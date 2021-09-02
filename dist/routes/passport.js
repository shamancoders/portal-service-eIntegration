var jwt = require('jsonwebtoken')
module.exports= (req, res, next, cb)=>{
	var IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || ''
	
	// if(IP=='::1' || IP.indexOf('127.0.0.1'))
	// 	return cb({username:`garfield${IP}`})
	
	var yolGecenHanMuduru = { 
		_id : '',
		username: 'yolGecenHanMuduru',
		name: 'Khan',
		lastName: 'Yolgecenogullari',
		gender: 'male',
		role : 'user',
		isSysUser:false,
		isMember:true,
		ip: IP
	}
	return cb(yolGecenHanMuduru)

	if(req.params.func=='login' || req.params.func=='signup' || req.params.func=='register' || req.params.func=='verify' || req.params.func=='forgot-password'){
		cb(null)
	}else{
		var token = req.body.token || req.query.token || req.headers['x-access-token']  || req.headers['token']
		if (token) {
			jwt.verify(token, 'gizliSir', (err, decoded)=>{
				if (err) {
					return next({ code: 'FAILED_TOKEN', message: 'Yetki hatasi' })
				} else {
					cb(decoded)
				}
			})
		} else {
			return next({ code: 'NO_TOKEN_PROVIDED', message: 'Yetki hatasi' })
		}
	}
}