module.exports = (dbModel, req, res, next, cb)=>{
	if(req.params.param1==undefined)
		error.param1(req, next)
	switch(req.method){
		case 'GET':
		dbModel.despatches.findOne({_id:req.params.param1}).populate('eIntegrator').exec((err,doc)=>{
			if(dberr(err,next))
				if(dbnull(doc,next)){
					if(doc.eIntegrator.despatch.xslt){
						cb({fileId:doc.eIntegrator.despatch.xslt})
					}else{
						var defaultXslt=fs.readFileSync(path.join(__root,'resources/default-irsaliye.xslt'),'utf8')
						cb({file:{fileName:'default.xslt',data:defaultXslt}})
					}
				}
			})
		break
		default:
		error.method(req, next)
		break
	}

}

