exports.sendReceiptAdvice11111=(dbModel,serviceName,callback)=>{
	dbModel.tasks.find({taskType:'edespatch_send_receipt_advice',status:'pending'},(err,docs)=>{
		if(dberr(err,callback)){
			if(docs.length>0){
				eventLog(`${dbModel.nameLog} Srvc:${serviceName.cyan}, task count:${docs.length}`)

				iteration(docs,(item,cb)=>{ 
					eDespatch.sendReceiptAdvice(dbModel,(item.toJSON()).document,(err)=>{
						if(!err){
							dbModel.tasks.updateMany({_id:item._id},{$set:{status:'completed'}},(err)=>{
								cb(err)
							})
						}else{
							dbModel.tasks.updateMany({_id:item._id},{$set:{status:'error',error:[{code:(err.code || err.name || 'TASK_ERROR'),message:err.message}]}},{multi:false},(err2)=>{
								dbModel.despatches_receipt_advice.updateMany({_id:item.documentId},{$set:{receiptStatus:'Error',receiptErrors:[{code:(err.code || err.name || 'TASK_ERROR'),message:err.message}]}},{multi:false},(err2)=>{
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

exports.sentToGib11111=(dbModel,serviceName,callback)=>{
	dbModel.tasks.find({taskType:'edespatch_send_to_gib',status:'pending'},(err,docs)=>{
		if(dberr(err,callback)){
			if(docs.length>0){
				eventLog(`${dbModel.nameLog} Srvc:${serviceName.cyan}, task count:${docs.length}`)
				iteration(docs,(item,cb)=>{ 
					eDespatch.sendToGib(dbModel,item.document,(err)=>{
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
