var nodemailer=require('nodemailer')
var htmlToText = require('html-to-text')
var emailvalidator = require("email-validator")


exports.sendMail = function (mailto,subject, body,cb){
    try {
        if(!emailvalidator.validate(mailto))
            return cb({code:"EMAIL_NOT_VALID",message:"Email gecersiz."})

        var smtpTransport = require('nodemailer-smtp-transport')
        
        subject = htmlToText.fromString(subject, {wordwrap: 130})
        body = htmlToText.fromString(body, {wordwrap: 130})
        
        var transporter = nodemailer.createTransport(smtpTransport({
            host: privateConfig.mail?privateConfig.mail.host:'',
            port: privateConfig.mail?privateConfig.mail.port:587,
            secure:privateConfig.mail?privateConfig.mail.secure:false,
            auth: {
                user: privateConfig.mail?privateConfig.mail.auth.user:'',
                pass: privateConfig.mail?privateConfig.mail.auth.pass:''
            },
            tls: { rejectUnauthorized: false }
        }))

        var mailOptions = {
            from: privateConfig.mail?privateConfig.mail.auth.user:'', 
            to: mailto,  

            subject: subject + '', // Subject line
            text: body + '', // plaintext body
            html: body + '' // html body
        }
        
        // send mail with defined transport object
       transporter.sendMail(mailOptions, (error, info)=>{
            transporter.close()
            if (error) {
                cb(error)
            }else{
                cb(null,info.response)
            }
            
        })
    } catch ( err ) {
        
        cb(err)
    }
}

exports.sendErrorMail=(subject,err,cb)=>{
	var body='Error:<br>'
	if(typeof err=='string'){
		body += err
	}else{
		body +='code:' + (err.code || err.name || '') + '<br>'
		body +='message:' + (err.message || '')
	}
	exports.sendMail('alitek@gmail.com',subject,body,cb)
}