module.exports = (dbModel, req, res, next, cb)=>{
	if(req.params.param1==undefined)
		error.param1(req)
    switch(req.method){
        case 'GET':
        	dbModel.invoices.findOne({_id:req.params.param1},(err,doc)=>{
        		if(dberr(err,next)){
        			if(dbnull(doc,next)){
        				cb(doc.invoiceErrors)
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
