
var SinifGrubu=require('./uyumsoft/DespatchIntegration.class.js')
var downloadInterval=config.downloadInterval || 5000 

var serviceName=`eDespatch`
var defaultServiceName=`eDespatch`
var ioBox=(ioType)=>{ return ioType==0?'Outbox':'Inbox'}
var taskListener=require('./task-listener')
global.WcfHelper=require('../../bin/wcf-helper').WcfHelper

exports.getDespatch=(dbModel,ioType,integrator,listItem,callback)=>{
	var logPrefix=`${dbModel.nameLog} ${defaultServiceName.green + '/GetDespatch'.cyan + '/' + ioBox(ioType)},`
	dbModel.despatches.findOne({ioType:ioType, eIntegrator:listItem.docId2,'uuid.value':listItem.docId},(err,doc)=>{
		if(dberr(err,callback)){
			if(doc==null){
				var GetDespatch=(query,cb)=>{
					if(ioType==0){
						integrator.despatchIntegration.GetOutboxDespatch(query,cb)
					}else{
						integrator.despatchIntegration.GetInboxDespatch(query,cb)
					}
				}
				GetDespatch(listItem.docId,(err,data)=>{
					if(dberr(err,callback)){
						var newDoc=new dbModel.despatches(data.value.despatchAdvice)
						newDoc.eIntegrator=integrator._id
						newDoc.ioType=ioType
						newDoc.despatchStatus=listItem.document.statusEnum
						if(newDoc.profileId.value=='TEMELSEVKIRSALIYESI'){
							newDoc.profileId.value='TEMELIRSALIYE'
						}


						newDoc.save((err,newDoc2)=>{
							if(!err){
								eventLog(`${logPrefix} ${newDoc2.ID.value} indirildi`)
							}
							listItem.status='Downloaded'
							listItem.save((err)=>{
								if(callback)
									callback(err)
							})
							
						})
					}
				})
			}else{
				eventLog(`${logPrefix} ${doc.ID.value} zaten var`)
				if(ioType==0){
					listItem.status='Uploaded'
				}else{
					listItem.status='Downloaded'
				}
				
				listItem.save((err)=>{
					if(callback)
						callback(err)
				})
			}
		}
	})
}

function syncDespatches(dbModel,ioType,integrator,srvcName,callback){
	var logPrefix=`${dbModel.nameLog} ${srvcName.green}, sync`
	var limit=0
	if(config.status=='development'){
		limit=3
	}
	eventLog(`${logPrefix} started `)

	dbModel.temp_table.find({docType:`eDespatch_sync${ioBox(ioType)}List`,status:'',docId2:integrator._id}).limit(limit).exec((err,docs)=>{
		if(dberr(err,callback)){
			iteration(docs,(listItem,cb)=>{ exports.getDespatch(dbModel,ioType,integrator,listItem,cb)}, downloadInterval,true,(err,result)=>{
				if(err)
					errorLog(`${logPrefix} error:`,err)
				else
					eventLog(`${logPrefix} OK`)

				if(callback)
					callback(err,result)
			})
		}
	})
}



function syncDespatchList(dbModel,ioType,integrator,srvcName, callback){
	var logPrefix=`${dbModel.nameLog} ${srvcName.green}, syncList`
	syncDespatchList_queryModel(dbModel,ioType,integrator,(err,query)=>{
		var GetDespatchList=(query,cb)=>{
			if(ioType==0){
				integrator.despatchIntegration.GetOutboxDespatchList(query,cb)
			}else{
				integrator.despatchIntegration.GetInboxDespatchList(query,cb)
			}
		}

		function indir(cb){
			GetDespatchList(query,(err,data)=>{
				if(dberr(err,cb)){
					if(data.value.attr.totalPages==0) 
						return cb(null)
					eventLog(`${logPrefix} page:${data.value.attr.pageIndex+1}/${data.value.attr.totalPages}`)
					if(!Array.isArray(data.value.items)){
						data.value.items=[clone(data.value.items)]
					}
					data.value.items.forEach((e)=>{ e._integratorId=integrator._id })
					iteration(data.value.items,(item,cb)=>{ insertTempTable(dbModel,ioType,item,cb)},0,false,(err)=>{
						if(dberr(err,cb)){
							if(config.status=='development'){
								if(data.value.attr.pageIndex<data.value.attr.totalPages-1 && data.value.attr.pageIndex<2 ){
									query.PageIndex++
									setTimeout(indir,downloadInterval,cb)
								}else{
									cb(null)
								}
							}else{
								if(data.value.attr.pageIndex<data.value.attr.totalPages-1){
									query.PageIndex++
									setTimeout(indir,downloadInterval,cb)
								}else{
									cb(null)
								}
							}
						}
					})
				}
			})
		}

		indir((err)=>{
			if(callback)
				callback(err)
		})
	})
}


function syncDespatchList_queryModel(dbModel,ioType,integrator,cb){
	var query=ioType==0?new SinifGrubu.OutboxDespatchListQueryModel():new SinifGrubu.InboxDespatchListQueryModel()

	
	query.PageIndex=0
	query.PageSize=10
	query.CreateStartDate=defaultStartDate()
	query.CreateEndDate=endDate()

	dbModel.temp_table.find({docType:`eDespatch_sync${ioBox(ioType)}List`}).sort({orderBy:-1}).limit(1).exec((err,docs)=>{
		if(!err){
			if(docs.length>0){
				var tarih=new Date(docs[0].document['createDateUtc'])
				tarih.setMinutes(tarih.getMinutes()+(new Date()).getTimezoneOffset()*-1)
				query.CreateStartDate=tarih.toISOString()

				cb(null,query)
			}else{
				cb(null,query)
			}
		}else{
			cb(err,query)
		}
	})
}


function downloadDespatches(dbModel,ioType,srvcName, callback){
	var logPrefix=`${dbModel.nameLog} ${srvcName.green}`
	dbModel.integrators.find({passive:false},(err,docs)=>{
		if(dberr(err,callback)){
			var integrators=[]
			docs.forEach((e)=>{
				if(e.despatch.url!='' && e.despatch.username!='' && e.despatch.password!=''){
					var itg=e.toJSON()
					itg['despatchIntegration']=new SinifGrubu.DespatchIntegration(itg.despatch.url,itg.despatch.username,itg.despatch.password)
					integrators.push(itg)
				}
			})

			iteration(integrators,(item,cb)=>{ syncDespatchList(dbModel,ioType,item,srvcName,cb)},0,true,(err,result)=>{
				if(err)
					errorLog(`${logPrefix}, syncList error:`,err)
				else
					eventLog(`${logPrefix}, syncList OK`)

				iteration(integrators,(item,cb)=>{ syncDespatches(dbModel,ioType,item,srvcName,cb)},0,true,(err,result)=>{
					if(err)
						errorLog(`${logPrefix}, sync error:`,err)
					else
						eventLog(`${logPrefix}, sync OK`)

					if(callback)
						callback()
				})
			})
		}
	})
}


function insertTempTable(dbModel,ioType,item,callback){
	if(item['statusEnum']=='Error')
		return callback(null)
	var filter={
		docType:`eDespatch_sync${ioBox(ioType)}List`,
		docId:item['despatchId'],
		docId2:item['_integratorId']
	}

	dbModel.temp_table.findOne(filter,(err,doc)=>{
		if(err) 
			return callback(err)
		if(doc==null){
			var data={
				docType:`eDespatch_sync${ioBox(ioType)}List`,
				docId:item['despatchId'],
				docId2:item['_integratorId'],
				document:item,
				status:'',
				orderBy:item['createDateUtc']
			}
			
			doc=new dbModel.temp_table(data)
			doc.save((err)=>{
				callback(err)
			})
		}else{
			if(doc.document['statusEnum']!=item['statusEnum']){
				doc.status='modified'
				doc.document=item
				doc.modifiedDate=new Date()

				doc.save((err)=>{
					callback(err)
				})
			}else{
				callback(null)
			}
		}
	})
}


function defaultStartDate(){

	if(config.status=='development'){
		return (new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate(),0,0,0)).addDays(-10).toISOString()
	}else{
		return (new Date((new Date()).getFullYear(),0,1,0,0,0)).toISOString()
	}
}

function endDate(){
	var a=new Date()
	a.setMinutes(a.getMinutes()+(new Date()).getTimezoneOffset()*-1)
	return a.toISOString()
}

exports.logs=(dbModel,despatchDoc,callback)=>{
	var webService=new SinifGrubu.DespatchIntegration(despatchDoc.eIntegrator.despatch.url,despatchDoc.eIntegrator.despatch.username,despatchDoc.eIntegrator.despatch.password)
	var GetDespatchStatusWithLogs=(despatchIds,cb)=>{
		if(despatchDoc.ioType==0){
			webService.GetOutboxDespatchStatusWithLogs(despatchIds,cb)
		}else{
			webService.GetInboxDespatchStatusWithLogs(despatchIds,cb)
		}
	}
	
	GetDespatchStatusWithLogs([despatchDoc.uuid.value],(err,data)=>{
		if(!err){
			callback(null,data.value)
		}else{
			callback(err)
		}
		
	})
}



exports.xsltView=(dbModel,despatchDoc,callback)=>{
	try{
		var webService=new SinifGrubu.DespatchIntegration(despatchDoc.eIntegrator.despatch.url,despatchDoc.eIntegrator.despatch.username,despatchDoc.eIntegrator.despatch.password)
		var GetDespatchView=(despatchId,cb)=>{
			if(despatchDoc.ioType==0){
				webService.GetOutboxDespatchView(despatchId,cb)
			}else{
				webService.GetInboxDespatchView(despatchId,cb)
			}
		}
		
		GetDespatchView(despatchDoc.uuid.value,(err,data)=>{
			if(!err){
				callback(null,data.value.html)
			}else{
				callback(err)
			}
			
		})
	}catch(e){
		cb(e)
	}
}


function despatchTime(text){
	var sbuf='09:13:11.0000000+03:00'
	return sbuf
}

exports.getXslt=(dbModel,despatchDoc,cb)=>{
	if(despatchDoc.eIntegrator.despatch.xslt){
		dbModel.files.findOne({_id:despatchDoc.eIntegrator.despatch.xslt},(err,doc)=>{
			if(!err){
				if(doc!=null){
					cb(null,doc.data.replace('data:application/xml;base64,',''))
				}else{
					cb(null)
				}
			}else{
				cb(err)
			}
		})
	}else{
		cb(null)
	}
}

exports.sendToGib=(dbModel,despatchDoc,cb)=>{
	try{
		exports.getXslt(dbModel,despatchDoc,(err,xsltData)=>{
			if(!err){
				var webService=new SinifGrubu.DespatchIntegration(despatchDoc.eIntegrator.despatch.url,despatchDoc.eIntegrator.despatch.username,despatchDoc.eIntegrator.despatch.password)
				despatchDoc.despatchSupplierParty.party=clone(despatchDoc.eIntegrator.party)
				despatchDoc.sellerSupplierParty.party=clone(despatchDoc.eIntegrator.party)

				if(despatchDoc.deliveryCustomerParty.party['partyIdentification[0]']!=undefined){
					despatchDoc.deliveryCustomerParty.party['partyIdentification[0]']=undefined
					delete despatchDoc.deliveryCustomerParty.party['partyIdentification[0]']
				}
				if(despatchDoc.deliveryCustomerParty.party.postalAddress.country.identificationCode.value==''){
					despatchDoc.deliveryCustomerParty.party.postalAddress.country.identificationCode.value='TR'
				}
				despatchDoc.buyerCustomerParty.party=clone(despatchDoc.deliveryCustomerParty.party)

			
				despatchDoc.uuid.value=uuid.v4()
				
				if(xsltData){
					despatchDoc.additionalDocumentReference=[{
						ID:{value:uuid.v4()},
						issueDate:{value:despatchDoc.issueDate.value},
						documentType:{value:'xslt'},
						attachment:{
							embeddedDocumentBinaryObject:{
								attr:{
									filename:'tr216com.xslt',
									characterSetCode:'UTF-8',
									encodingCode:'Base64',
									mimeCode:'application/xml'
								},
								value:xsltData
							}
						}
					}]
				}

				despatchDoc.shipment={
					ID:{value:'1'},
					shipmentStage:despatchDoc.shipment.shipmentStage,
					delivery:{
						ID:{value:'1'},
						despatch:{
							actualDespatchDate:{value:despatchDoc.issueDate.value},
							actualDespatchTime:{value:despatchDoc.issueTime.value}
						}
					}
				}

				var despatchInfo=new SinifGrubu.DespatchInfo(despatchDoc)
				var xmlstr=despatchInfo.generateXml()
				var parseString = require('xml2js').parseString

				tempLog(`sendToGib_request_${despatchDoc.ID.value}.xml`,xmlstr)

				// /* DespatchInfo[] despatches */
				webService.SendDespatch([xmlstr],(err,data)=>{
					if(!err){
						tempLog(`sendToGib_response_${despatchDoc.ID.value}.json`,JSON.stringify(data,null,2))

						dbModel.despatches.updateMany({_id:despatchDoc._id},{
							$set:{
								despatchStatus:'Queued',
								uuid:{value:data.value.attr.id},
								ID:{value:data.value.attr.number}
							}
						},{multi:false},(err)=>{
							if(!err){
								cb(null,data.value)
							}else{
								cb(err)
							}
						})
					}else{
						tempLog(`sendToGib_response_err_${despatchDoc.ID.value}.json`,JSON.stringify(err,null,2))
						errorLog(`${serviceName} Hata:`,err)
						cb(err)
					}
				})
			}else{
				cb(err)
			}
		})
		

	}catch(e){
		cb(e)
	}
	
}

exports.sendReceiptAdvice=(dbModel,receiptAdviceDoc,cb)=>{
	try{
		
		var webService=new SinifGrubu.DespatchIntegration(receiptAdviceDoc.eIntegrator.despatch.url,receiptAdviceDoc.eIntegrator.despatch.username,receiptAdviceDoc.eIntegrator.despatch.password)


		if(receiptAdviceDoc.uuid.value=='')
			receiptAdviceDoc.uuid.value=uuid.v4()

		var receiptAdviceTypeInfo=new SinifGrubu.ReceiptAdviceTypeInfo(receiptAdviceDoc)
		var xmlstr=receiptAdviceTypeInfo.generateXml()
		
		

		tempLog(`sendReceiptAdvice_request_${receiptAdviceDoc._id}.xml`,xmlstr)

		/* ReceiptAdviceInfo[] receiptAdvices */
		webService.SendReceiptAdviceUbl([xmlstr],(err,data)=>{
			if(!err){
				tempLog(`SendReceiptAdvice_response_${receiptAdviceDoc._id}.json`,JSON.stringify(data,null,2))
				

				dbModel.despatches_receipt_advice.updateMany({_id:receiptAdviceDoc._id},{
					$set:{
						receiptStatus:'Success',
						'uuid.value':receiptAdviceDoc.uuid.value
					}
				},{multi:false},(err)=>{
					if(!err){
						cb(null,data.value)
					}else{
						cb(err)
					}
				})

				
			}else{
				tempLog(`SendReceiptAdvice_response_err_${receiptAdviceDoc._id}.json`,JSON.stringify(err,null,2))
				errorLog(`${serviceName} Hata:`,err)
				cb(err)
			}
		})


	}catch(e){
		cb(e)
	}

}

function queryDespatchStatus(dbModel,despatchDoc,cb){
	try{
		if(!despatchDoc.eIntegrator)
			return cb(null)

		var webService=new SinifGrubu.DespatchIntegration(despatchDoc.eIntegrator.despatch.url,despatchDoc.eIntegrator.despatch.username,despatchDoc.eIntegrator.despatch.password)
		var GetDespatchList=(query,cb)=>{
			if(despatchDoc.ioType==0){
				return webService.GetOutboxDespatchList(query,cb)
			}else{
				return webService.GetInboxDespatchList(query,cb)
			}
		}

		var query={
			DespatchIds:[despatchDoc.uuid.value],
			PageIndex:0,
			PageSize:1
		}
		GetDespatchList(query,(err,data)=>{
			if(dberr(err,cb)){
				if(!data.value)
					return cb(null)
				if(!data.value.items)
					return cb(null)

				if(!Array.isArray(data.value.items))
					data.value.items=[clone(data.value.items)]
				
				var obj={
					_id:despatchDoc._id,
					uuid:data.value.items[0].despatchId,
					ID:data.value.items[0].despatchNumber,
					title:data.value.items[0].targetTitle,
					vknTckn:data.value.items[0].targetTcknVkn,
					despatchStatus:data.value.items[0].statusEnum
				}
				if(despatchDoc.despatchStatus!=data.value.items[0].statusEnum){
					dbModel.despatches.updateMany({_id:despatchDoc._id},{$set:{despatchStatus:data.value.items[0].statusEnum}},{multi:false},(err)=>{
						if(dberr(err,cb)){
							cb(null,obj)
						}
					})
				}else{
					cb(null,obj)
				}
			}
		})
	}catch(e){
		cb(e)
	}
}

function checkDespatcheStatus(dbModel,srvcName, callback){
	var logPrefix=`${dbModel.nameLog} ${srvcName.green}`
	var baslamaTarihi=(new Date()).addDays(-15).yyyymmdd()
	if(config.status=='development'){
		baslamaTarihi=(new Date()).addDays(-90).yyyymmdd()
	}
	var options={page: 1, limit:500000,
		populate:[
		{path:'eIntegrator',select:'_id eIntegrator despatch'}
		],
		
		select:'_id ioType eIntegrator ID uuid issueDate issueTime despatchStatus',
		sort:{'issueDate.value':'desc' , 'ID.value':'desc'}
	}

	var filter={
		ioType:0,
		despatchStatus:{$nin:['Approved','PartialApproved','Declined','Canceled','Cancelled']},
		'issueDate.value':{$gte:baslamaTarihi}
	}
	
	dbModel.despatches.paginate(filter, options, (err,resp)=>{
		if(dberr(err,callback)){
			
			eventLog(`${logPrefix}, count:${resp.docs.length}`)
			
			var index=0

			function calistir(cb){
				if(index>=resp.docs.length)
					return cb()
				if(config.status=='development' && index>=5)
					return cb()

				queryDespatchStatus(dbModel,resp.docs[index],(err,result)=>{
					if(err){
						errorLog(`${logPrefix}, checking:${(index+1)}/${resp.docs.length} ${resp.docs[index].ID.value}  error:`,err)
					}else{
						eventLog(`${logPrefix}, checking:${(index+1)}/${resp.docs.length}`)
					}
					index++
					setTimeout(calistir,10,cb)
				})
			}

			calistir(()=>{
				if(callback)
					callback(err)
			})
		}
	})
}


// function task_sendReceiptAdvice(dbModel,srvcName,callback){
// 	var logPrefix=`${dbModel.nameLog} ${srvcName.green}`
// 	dbModel.tasks.find({taskType:'edespatch_send_receipt_advice',status:'pending'},(err,docs)=>{
// 		if(dberr(err,callback)){
// 			if(docs.length>0){
// 				eventLog(`${dbModel.nameLog} Srvc:${serviceName.cyan}, task count:${docs.length}`)

// 				iteration(docs,(item,cb)=>{ 
// 					exports.sendReceiptAdvice(dbModel,(item.toJSON()).document,(err)=>{
// 						if(!err){
// 							dbModel.tasks.updateMany({_id:item._id},{$set:{status:'completed'}},(err)=>{
// 								cb(err)
// 							})
// 						}else{
// 							dbModel.tasks.updateMany({_id:item._id},{$set:{status:'error',error:[{code:(err.code || err.name || 'TASK_ERROR'),message:err.message}]}},{multi:false},(err2)=>{
// 								dbModel.despatches_receipt_advice.updateMany({_id:item.documentId},{$set:{receiptStatus:'Error',receiptErrors:[{code:(err.code || err.name || 'TASK_ERROR'),message:err.message}]}},{multi:false},(err2)=>{
// 									cb(null)
// 								})
// 							})
// 						}
// 					})
// 				},0,true,(err,result)=>{
					
// 					if(callback)
// 						callback(err)
// 				})
// 			}else{
// 				if(callback)
// 						callback()
// 			}
// 		}
// 	})
// }

function task_sentToGib(dbModel,srvcName,callback){
	var logPrefix=`${dbModel.nameLog} ${srvcName.green}`
	dbModel.tasks.find({taskType:'edespatch_send_to_gib',status:'pending'},(err,docs)=>{
		if(dberr(err,callback)){
			if(docs.length>0){
				eventLog(`${dbModel.nameLog} Srvc:${serviceName.cyan}, task count:${docs.length}`)
				iteration(docs,(item,cb)=>{ 
					exports.sendToGib(dbModel,item.document,(err)=>{
						if(!err){
							dbModel.tasks.updateMany({_id:item._id},{$set:{status:'completed'}},(err)=>{
								cb(err)
							})
						}else{
							dbModel.tasks.updateMany({_id:item._id},{$set:{status:'error',error:[{code:(err.code || err.name || 'TASK_ERROR'),message:err.message}]}},{multi:false},(err2)=>{
								dbModel.despatches.updateMany({_id:item.documentId},{$set:{despatchStatus:'Error',despatchErrors:[{code:(err.code || err.name || 'TASK_ERROR'),message:err.message}]}},{multi:false},(err2)=>{
									cb(null)
								})
							})
						}
					})
				},0,true,(err,result)=>{
					if(callback)
						callback(err)
				})
			}else{
				if(callback)
						callback()
			}
		}
	})
}

exports.start=()=>{
	
	// runServiceOnAllUserDb({
	// 	filter:(dbModel)=>{ return dbModel.services.eIntegration.eDespatch },
	// 	serviceFunc:(dbModel,cb)=>{ downloadDespatches(dbModel,0,`eDespatch/${'download'.cyan}/outbox`,cb) },
	// 	name:'eDespatch/download/outbox',
	// 	repeatInterval:config.repeatInterval || 60000
	// })

	// runServiceOnAllUserDb({
	// 	filter:(dbModel)=>{ return dbModel.services.eIntegration.eDespatch },
	// 	serviceFunc:(dbModel,cb)=>{ downloadDespatches(dbModel,1,`eDespatch/${'download'.cyan}/inbox`,cb) },
	// 	name:'eDespatch/download/inbox',
	// 	repeatInterval:config.repeatInterval || 60000
	// })

	runServiceOnAllUserDb({
		filter:(dbModel)=>{ return dbModel.services.eIntegration.eDespatch },
		serviceFunc:(dbModel,cb)=>{ checkDespatcheStatus(dbModel,`eDespatch/${'checkStatus'.cyan}`,cb) },
		name:'eDespatch/checkStatus',
		repeatInterval:config.repeatInterval || 60000
	})

	runServiceOnAllUserDb({
		filter:(dbModel)=>{ return dbModel.services.eIntegration.eDespatch },
		serviceFunc:(dbModel,cb)=>{
			task_sentToGib(dbModel,`eDespatch/${'task'.cyan}/sentToGib`,cb)
		},
		name:'eDespatch/task/sentToGib',
		repeatInterval:config.repeatInterval || 6000
	})

	// runServiceOnAllUserDb({
	// 	filter:(dbModel)=>{ return dbModel.services.eIntegration.eDespatch },
	// 	serviceFunc:(dbModel,cb)=>{
	// 		taskListener.sendReceiptAdvice(dbModel,`${serviceName}/sendReceiptAdvice`,cb)
	// 	},
	// 	name:'eDespatch/task/sendReceiptAdvice',
	// 	repeatInterval:config.repeatInterval || 60000
	// })

	
	
}
