var processList=[]
var SinifGrubu=require('./uyumsoft/InvoiceIntegration.class.js')
var downloadInterval=2000 
var taskInterval=5000
var serviceName=`[eInvoice]`.yellow

global.WcfHelper=require(path.join(__root,'lib/wcf-helper')).WcfHelper

var sync=require('./sync')


exports.getInvoice=(dbModel,ioType,integrator,listItem,callback)=>{
	dbModel.invoices.findOne({ioType:ioType, eIntegrator:listItem.docId2,'uuid.value':listItem.docId},(err,doc)=>{
		if(!err){
			if(doc==null){
				var GetInvoice=(query,cb)=>{
					if(ioType==0){
						integrator.invoiceIntegration.GetOutboxInvoice(query,cb)
					}else{
						integrator.invoiceIntegration.GetInboxInvoice(query,cb)
					}
				}
				GetInvoice(listItem.docId,(err,data)=>{
					if(!err){
						var newDoc=new dbModel.invoices(data.value.invoice)
						newDoc.eIntegrator=integrator._id
						newDoc.ioType=ioType
						newDoc.invoiceStatus=listItem.document.status
						

						newDoc.save((err,newDoc2)=>{
							if(!err){
								eventLog(`${serviceName} ${dbModel.dbName.cyan} Invoice_${ioBox(ioType)}:${newDoc2.ID.value} indirildi`)
							}
							listItem.status='Downloaded'
							listItem.save((err)=>{
								callback(err)
							})
							
						})
					}else{
						console.error(`getInvoice err:`,err)
						callback(err)
					}
				})
			}else{
				eventLog(`getInvoice ${ioBox(ioType)} ${doc.ID.value} zaten var `)
				if(ioType==0){
					listItem.status='Uploaded'
				}else{
					listItem.status='Downloaded'
				}
				
				listItem.save((err)=>{
					callback(err)
				})
			}
		}else{
			callback(err)
		}
	})
}


exports.logs=(dbModel,invoiceDoc,callback)=>{
	var webService=new SinifGrubu.InvoiceIntegration(invoiceDoc.eIntegrator.invoice.url,invoiceDoc.eIntegrator.invoice.username,invoiceDoc.eIntegrator.invoice.password)
	var GetInvoiceStatusWithLogs=(invoiceIds,cb)=>{
			if(invoiceDoc.ioType==0){
				webService.GetOutboxInvoiceStatusWithLogs(invoiceIds,cb)
			}else{
				webService.GetInboxInvoiceStatusWithLogs(invoiceIds,cb)
			}
		}
	
	GetInvoiceStatusWithLogs([invoiceDoc.uuid.value],(err,data)=>{
		if(!err){
			tempLog(`GetInvoiceStatusWithLogs_response_${invoiceDoc.ID.value}.json`,JSON.stringify(data,null,2))
			callback(null,data.value)
		}else{
			callback(err)
		}
		
	})
}


exports.xsltView=(dbModel,invoiceDoc,callback)=>{
	try{
		var webService=new SinifGrubu.InvoiceIntegration(invoiceDoc.eIntegrator.invoice.url,invoiceDoc.eIntegrator.invoice.username,invoiceDoc.eIntegrator.invoice.password)
		var GetInvoiceView=(invoiceId,cb)=>{
				if(invoiceDoc.ioType==0){
					webService.GetOutboxInvoiceView(invoiceId,cb)
				}else{
					webService.GetInboxInvoiceView(invoiceId,cb)
				}
			}
		
		GetInvoiceView(invoiceDoc.uuid.value,(err,data)=>{
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


exports.getXslt=(dbModel,invoiceDoc,cb)=>{
	if(invoiceDoc.eIntegrator.invoice.xslt){
		dbModel.files.findOne({_id:invoiceDoc.eIntegrator.invoice.xslt},(err,doc)=>{
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

exports.sendToGib=(dbModel,invoiceDoc,cb)=>{
	try{
		exports.getXslt(dbModel,invoiceDoc,(err,xsltData)=>{
			if(!err){
				var webService=new SinifGrubu.InvoiceIntegration(invoiceDoc.eIntegrator.invoice.url,invoiceDoc.eIntegrator.invoice.username,invoiceDoc.eIntegrator.invoice.password)
				invoiceDoc.accountingSupplierParty.party=invoiceDoc.eIntegrator.party
				if(invoiceDoc.uuid.value=='')
					invoiceDoc.uuid.value=uuid.v4()
				if(xsltData){
					invoiceDoc.additionalDocumentReference=[{
						ID:{value:uuid.v4()},
						issueDate:{value:invoiceDoc.issueDate.value},
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


				var invoiceInfo=new SinifGrubu.InvoiceInfo(invoiceDoc)
				var xmlstr=invoiceInfo.generateXml()
				
				tempLog(`sendToGib_request_${invoiceDoc.ID.value}.xml`,xmlstr)
				/* InvoiceInfo[] invoices */
				webService.SendInvoice([xmlstr],(err,data)=>{
					if(!err){
						tempLog(`sendToGib_response_${invoiceDoc.ID.value}.json`,JSON.stringify(data,null,2))
						dbModel.invoices.updateMany({_id:invoiceDoc._id},{
							$set:{
								invoiceStatus:'Queued',
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
						tempLog(`sendToGib_response_err_${invoiceDoc.ID.value}.json`,JSON.stringify(err,null,2))
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

exports.queryInvoiceStatus=(dbModel,invoiceDoc,cb)=>{
	try{
		if(!invoiceDoc.eIntegrator)
			return cb(null)
		
		var webService=new SinifGrubu.InvoiceIntegration(invoiceDoc.eIntegrator.invoice.url,invoiceDoc.eIntegrator.invoice.username,invoiceDoc.eIntegrator.invoice.password)
		var GetInvoiceList=(query,cb)=>{
			if(invoiceDoc.ioType==0){
				return webService.GetOutboxInvoiceList(query,cb)
			}else{
				return webService.GetInboxInvoiceList(query,cb)
			}
		}

		var query={
			InvoiceIds:[invoiceDoc.uuid.value],
			PageIndex:0,
			PageSize:1
		}
		GetInvoiceList(query,(err,data)=>{
			if(!err){
				if(!data.value)
					return cb(null)
				if(!data.value.items)
					return cb(null)
				
				if(!Array.isArray(data.value.items)){
					data.value.items=[clone(data.value.items)]
				}
				var obj={
					_id:invoiceDoc._id,
					uuid:data.value.items[0].invoiceId,
					ID:data.value.items[0].invoiceNumber,
					title:data.value.items[0].targetTitle,
					vknTckn:data.value.items[0].targetTcknVkn,
					invoiceStatus:data.value.items[0].status
				}
				if(invoiceDoc.invoiceStatus!=data.value.items[0].status){
					dbModel.invoices.updateMany({_id:invoiceDoc._id},{$set:{invoiceStatus:data.value.items[0].status}},{multi:false},(err)=>{
						if(!err){
							cb(null,obj)
						}else{
							cb(err)
						}
					})
				}else{
					cb(null,obj)
				}
			}else{
				cb(err)
			}
		})
		
				
	}catch(e){
		cb(e)
	}
}


exports.start=()=>{
	sync.start()
}
