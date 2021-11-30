module.exports = (dbModel, req, res, next, cb)=>{
	if(req.params.param1==undefined)
		error.param1(req, next)
	switch(req.method){
		case 'GET':
		dbModel.despatches.findOne({_id:req.params.param1}).populate('eIntegrator').exec((err,doc)=>{
			if(dberr(err,next))
				if(dbnull(doc,next)){
					if(doc.ioType==0){
						doc.despatchSupplierParty.party=doc.eIntegrator.party
						doc.sellerSupplierParty.party=doc.eIntegrator.party
						doc.buyerCustomerParty.party=doc.deliveryCustomerParty.party
					}
					var xmlstr=`<?xml version="1.0" encoding="utf-8"?>` + util.e_despatch2xml(doc)
					xmlstr=xmlstr.replaceAll('<DespatchAdvice','<q1:DespatchAdvice').replaceAll('</DespatchAdvice','</q1:DespatchAdvice')
					
					// cb({file:{fileName:`${doc.ID.value}.xml`,data:xmlstr}})
					cb({file:{fileName:`${doc.ID.value}.xml`,data:xmlstr}})
				}
			})
		break
		default:
		error.method(req, next)
		break
	}

}
