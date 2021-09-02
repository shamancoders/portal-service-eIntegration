module.exports = (dbModel, req, res, next, cb)=>{
	if(req.params.param1==undefined)
		error.param1(req)
    switch(req.method){
        case 'GET':
        	dbModel.despatches.findOne({_id:req.params.param1}).select('_id ioType uuid ID profileId issueDate issueTime despatchAdviceTypeCode despatchSupplierParty deliveryCustomerParty despatchStatus despatchErrors localStatus localErrors').exec((err,doc)=>{
        		if(dberr(err,next)){
        			if(dbnull(doc,next)){
        				cb(doc)
        			}
        		}
        	})
        break;
        // case 'POST':
        
        // break;
        // case 'PUT':
        
        // break;
        // case 'DELETE':
        
        // break;
        default:
        error.method(req, next)
        break;
    }

}
