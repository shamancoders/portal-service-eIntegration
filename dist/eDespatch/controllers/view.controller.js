module.exports = (dbModel, req, res, next, cb)=>{
	if(req.params.param1==undefined)
		error.param1(req, next)
	switch(req.method){
		case 'GET':
		dbModel.despatches.findOne({_id:req.params.param1}).populate('eIntegrator').exec((err,doc)=>{
			if(dberr(err,next))
				if(dbnull(doc,next)){
					eDespatch.xsltView(dbModel,doc,(err,data)=>{
						if(dberr(err,next)){
							cb(data)
						}
					})
				}
			})
		break
		default:
		error.method(req, next)
		break
	}

}
