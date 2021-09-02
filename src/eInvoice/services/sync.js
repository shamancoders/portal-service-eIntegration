// var repeatInterval=60000*10
var repeatInterval=30000
var SinifGrubu=require('./uyumsoft/InvoiceIntegration.class.js')
var downloadInterval=2000 
var taskInterval=5000
var serviceName=`[eInvoice]`.yellow

exports.syncInvoices=(dbModel,ioType,integrator,callback)=>{
	eventLog(`${serviceName} ${dbModel.dbName.cyan} syncInvoices ${ioBox(ioType)} started `)
	dbModel.temp_table.find({docType:`eInvoice_sync${ioBox(ioType)}List`,status:'',docId2:integrator._id},(err,docs)=>{
		if(!err){
			iteration(docs,
			(listItem,cb)=>{ 
				eInvoice.getInvoice(dbModel,ioType,integrator,listItem,cb)
			},
			downloadInterval,true,
			(err,result)=>{
				callback(err,result)
			})
		}else{
			callback(err)
		}
	})
}

exports.syncInvoiceList=(dbModel,ioType,integrator,callback)=>{
	exports.syncInvoiceList_queryModel(dbModel,ioType,integrator,(err,query)=>{
		var GetInvoiceList=(query,cb)=>{
			if(ioType==0){
				integrator.invoiceIntegration.GetOutboxInvoiceList(query,cb)
			}else{
				integrator.invoiceIntegration.GetInboxInvoiceList(query,cb)
			}
		}

		function indir(cb){
			GetInvoiceList(query,(err,data)=>{
				if(!err){
					if(data.value.attr.totalPages==0) 
						return cb(null)
					eventLog(`${serviceName} ${dbModel.dbName.cyan} syncInvoiceList ${ioBox(ioType)} page:${data.value.attr.pageIndex+1}/${data.value.attr.totalPages}`)
					if(!Array.isArray(data.value.items)){
						data.value.items=[clone(data.value.items)]
					}
					data.value.items.forEach((e)=>{ e._integratorId=integrator._id })
					iteration(data.value.items,(item,cb)=>{ exports.insertTempTable(dbModel,ioType,item,cb)},0,false,(err)=>{
						if(!err){
							if(config.status=='development'){
								if(data.value.attr.pageIndex<data.value.attr.totalPages-1 && data.value.attr.pageIndex<3 ){
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
							
							
						}else{
							cb(err)
						}
					})
				}else{
					cb(err)
				}
			})
		}

		indir((err)=>{
			callback(err)
		})
		
	})
	
}

exports.syncInvoiceList_queryModel=(dbModel,ioType,integrator,cb)=>{
	var query=ioType==0?new SinifGrubu.OutboxInvoiceListQueryModel():new SinifGrubu.InboxInvoiceListQueryModel()
	
	query.PageIndex=0
	query.PageSize=10
	query.CreateStartDate=defaultStartDate()
	query.CreateEndDate=endDate()

	dbModel.temp_table.find({docType:`eInvoice_sync${ioBox(ioType)}List`}).sort({orderBy:-1}).limit(1).exec((err,docs)=>{
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

exports.insertTempTable=(dbModel,ioType,item,callback)=>{
	if(item['status']=='Error')
		return callback(null)
	var filter={
			docType:`eInvoice_sync${ioBox(ioType)}List`,
			docId:item['documentId'],
			docId2:item['_integratorId']
		}

	dbModel.temp_table.findOne(filter,(err,doc)=>{
		if(err) 
			return callback(err)
		if(doc==null){
			var data={
				docType:`eInvoice_sync${ioBox(ioType)}List`,
				docId:item['documentId'],
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
			if(doc.document['status']!=item['status']){
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
		return (new Date((new Date()).getFullYear(),6,10,0,0,0)).toISOString()
	}else{
		return (new Date((new Date()).getFullYear(),0,1,0,0,0)).toISOString()
	}
	
}

function endDate(){
	var a=new Date()
	a.setMinutes(a.getMinutes()+(new Date()).getTimezoneOffset()*-1)
	return a.toISOString()
}


exports.listenTasks=(dbModel)=>{
	dbModel.tasks.find({taskType:'einvoice_send_to_gib',status:'pending'},(err,docs)=>{
		if(!err){
			if(docs.length>0){
				eventLog(`${serviceName} task count:${docs.length}`)
				iteration(docs,(item,cb)=>{ 
					eInvoice.sendToGib(dbModel,item.document,(err)=>{
						if(!err){
							dbModel.tasks.updateMany({_id:item._id},{$set:{status:'completed'}},(err)=>{
								cb(err)
							})
						}else{
							dbModel.tasks.updateMany({_id:item._id},{$set:{status:'error',error:[{code:(err.code || err.name || 'TASK_ERROR'),message:err.message}]}},{multi:false},(err2)=>{
								dbModel.invoices.updateMany({_id:item.documentId},{$set:{invoiceStatus:'Error',invoiceErrors:[{code:(err.code || err.name || 'TASK_ERROR'),message:err.message}]}},{multi:false},(err2)=>{
									cb(null)
								})
							})
						}
					})
				},0,true,(err,result)=>{
					if(!err){
						eventLog(`${serviceName} ${dbModel.dbName} sendToGib\tOK`)
					}else{
						errorLog(`${serviceName} ${dbModel.dbName} sendToGib Error`,err)
					}
					setTimeout(()=>{
						exports.listenTasks(dbModel)
					},taskInterval)
				})
			}else{
				setTimeout(()=>{
					exports.listenTasks(dbModel)
				},taskInterval)
			}
			
					
		}else{
			errorLog(`${serviceName} ${dbModel.dbName} Error`,err)
			setTimeout(()=>{
				exports.listenTasks(dbModel)
			},taskInterval)
		}
	})
}



exports.repeatDownloadInvoices=(dbModel,ioType)=>{
	dbModel.integrators.find({passive:false},(err,docs)=>{
		if(!err){
			var integrators=[]
			docs.forEach((e)=>{
				if(e.invoice.url!='' && e.invoice.username!='' && e.invoice.password!=''){
					var itg=e.toJSON()
					itg['invoiceIntegration']=new SinifGrubu.InvoiceIntegration(itg.invoice.url,itg.invoice.username,itg.invoice.password)
					integrators.push(itg)
				}
				
			})

			iteration(integrators,(item,cb)=>{ exports.syncInvoiceList(dbModel,ioType,item,cb)},0,true,(err,result)=>{
				if(err)
					errorLog(`${serviceName} ${dbModel.dbName.cyan} ${ioBox(ioType)}List  error:`,err)
				else
					eventLog(`${serviceName} ${dbModel.dbName.cyan} ${ioBox(ioType)}List\tok`)
				
				iteration(integrators,(item,cb)=>{ exports.syncInvoices(dbModel,ioType,item,cb)},0,true,(err,result)=>{
					if(err)
						errorLog(`${serviceName} ${dbModel.dbName.cyan} ${ioBox(ioType)}Invoices  error:`,err)
					else
						eventLog(`${serviceName} ${dbModel.dbName.cyan} ${ioBox(ioType)}Invoices\tok`)
						
					eventLog(`${serviceName} ${dbModel.dbName.cyan} ${ioBox(ioType)}Invoices finished`)
					setTimeout(()=>{exports.repeatDownloadInvoices(dbModel,ioType)},repeatInterval)
				})
			})
			
		}else{
			errorLog(`${serviceName} ${dbModel.dbName.cyan} ${ioBox(ioType)}Invoices error:`,err)
			setTimeout(()=>{exports.repeatDownloadInvoices(dbModel)},repeatInterval)
		}
	})
}

exports.repeatCheckInvoiceStatus=(dbModel)=>{
	var baslamaTarihi=(new Date()).addDays(-15).yyyymmdd()
	var filter={
		ioType:0,
		invoiceStatus:{$nin:['Approved','Declined','Canceled','Cancelled']},
		'issueDate.value':{$gte:baslamaTarihi}
	}

	dbModel.invoices.find(filter).populate('eIntegrator').exec((err,docs)=>{
		if(!err){
			eventLog(`${serviceName} ${dbModel.dbName.cyan} status check count:`,docs.length)
			iteration(docs,(item,cb)=>{ eInvoice.queryInvoiceStatus(dbModel,item,cb)},0,true,(err,result)=>{
				if(!err){
					eventLog(`${serviceName} ${dbModel.dbName.cyan} repeatCheckInvoiceStatus result:`,result.length)
				}else{
					errorLog(`${serviceName} ${dbModel.dbName.cyan} repeatCheckInvoiceStatus err:`,err)
				}
				setTimeout(()=>{exports.repeatCheckInvoiceStatus(dbModel)},repeatInterval)
			})
			
		}else{
			errorLog(err)
			setTimeout(()=>{exports.repeatCheckInvoiceStatus(dbModel)},repeatInterval)
		}
	})
}



exports.start=()=>{

	setTimeout(()=>{
		Object.keys(repoDb).forEach((e)=>{
			exports.repeatDownloadInvoices(repoDb[e],0)
			eventLog(`${serviceName} download ${ioBox(0)}Invoices working on ${repoDb[e].dbName.cyan}`)
			
			exports.repeatDownloadInvoices(repoDb[e],1)
			eventLog(`${serviceName} download ${ioBox(1)}Invoices working on ${repoDb[e].dbName.cyan}`)

			exports.repeatCheckInvoiceStatus(repoDb[e])
			eventLog(`${serviceName} checkStatus working on ${repoDb[e].dbName.cyan}`)

			exports.listenTasks(repoDb[e])
			eventLog(`${serviceName} tasks listening on ${repoDb[e].dbName.cyan}`)
			
		})
		
	},10000)
}
