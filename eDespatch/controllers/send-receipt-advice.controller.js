module.exports = (dbModel, req, res, next, cb)=>{
    switch(req.method){
        case 'POST':
        	sendReceiptAdvice(dbModel,req,res,next,cb)
        break
        
        default:
        error.method(req, next)
        break
    }

}

function sendReceiptAdvice(dbModel,req,res,next,cb){
	var filter={ioType:1, receiptStatus:{$in:['Draft','Error']}}
	if(req.params.param1!=undefined){
		filter['_id']=req.params.param1
	}else{
		var list=req.body.list || []
		
		var idList=[]
		list.forEach((e)=>{
			if(typeof e=='string'){
				idList.push(e)
			}else if(typeof e=='object'){
				idList.push(e._id)
			}else{
				return next({code:'PARAMETER_ERROR',message:'gonderilecek evrak listesi hatali'})
			}
		})
		if(idList.length==0)
			return next({code:'PARAMETER_ERROR',message:'gonderilecek evrak listesi bos'})
		filter['_id']={$in:idList}
	}
	
	dbModel.despatches_receipt_advice.find(filter).populate(['eIntegrator',{path:'despatch',select:'_id uuid ID'}]).exec((err,docs)=>{
		if(dberr(err, next)){
			iteration(docs, (doc,cb)=>{ addNewTaskList(dbModel,doc,cb) },0, false, (err)=>{
				if(!err){
					cb(`${docs.length} adet evrak kuyruga eklendi`)
				}else{
					console.log('iterasyon err:',err)
					next(err)
				}
			})
		}
	})
}

function addNewTaskList(dbModel,doc,cb){
	var taskData={
		taskType:'edespatch_send_receipt_advice',
		collectionName:'despatches_receipt_advice',
		documentId:doc._id,
		document:doc.toJSON(),
		status:'pending'
	}
	
	taskHelper.newTask(dbModel,taskData,(err,taskDoc)=>{
		if(!err){
			dbModel.despatches_receipt_advice.updateMany({_id:doc._id},{$set:{localStatus:'pending'}},{multi:false},(err,c)=>{
				cb(null,{taskId:taskDoc._id,taskType:taskDoc.taskType,collectionName:taskDoc.collectionName,documentId:taskDoc.documentId,status:taskDoc.status})	
			})
			
		}else{
			cb(err)
		}
	})
}