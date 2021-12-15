
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var logger = require('morgan')
var favicon = require('serve-favicon')


var indexRouter = require('./routes/index')
var dbLoader = require('./db/db-loader')
var httpServer=require('./lib/http-server.js')

global.app = express()
var cors = require('cors')
app.use(cors())
var flash = require('connect-flash')

app.use(logger('dev'))
app.use(bodyParser.json({limit: "100mb"}))
app.use(bodyParser.urlencoded({limit: "100mb", extended: true, parameterLimit:50000}))
app.use(cookieParser())

indexRouter(app)

testControllers(false)

app.set('name',require('./package').name)
app.set('version',require('./package').version)
app.set('port',config.httpserver.port)

module.exports=()=>{
	httpServer(app,(err,server,port)=>{
		dbLoader((err)=>{
			if(!err){
				
				global.taskHelper=require('./lib/taskhelper')
				global.eDespatch=require('./eDespatch/services/e-despatch')
				global.eInvoice=require('./eInvoice/services/e-invoice')
				eDespatch.start()
				// eInvoice.start()
				
			}else{
				errorLog(err)
			}
		})
	})
}

if(config.status != 'development') {
	process.on('uncaughtException', function(err) {
		errorLog('Caught exception: ', err)
		mail.sendErrorMail(`${(new Date()).yyyymmddhhmmss()} ${app.get('name')} Error`, err)
	})
}

/* [CONTROLLER TEST] */
function testControllers(log){
	moduleLoader(path.join(__dirname,'eDespatch/controllers'),'.controller.js',(log?'controllers checking':''),(err,holder)=>{
		if(err)
			throw err
		else{
			eventLog(`checking eDespatch/controllers OK ${Object.keys(holder).length.toString().yellow}`)
			moduleLoader(path.join(__dirname,'eInvoice/controllers'),'.controller.js',(log?'controllers checking':''),(err,holder)=>{
				if(err)
					throw err
				else{
					eventLog(`checking eInvoice/controllers OK ${Object.keys(holder).length.toString().yellow}`)
				}
			})
		}
	})
}
