global.__root=__dirname

require('./bin/event-log')
require('./bin/initialize-app')

require('./eIntegrationApps')((err,app)=>{
	if(!err){
		var http=require('./bin/http-server.js')(app)
		eventLog(`application name:\t ${app.get('name').yellow}`)
		eventLog(`version:\t\t ${app.get('version').yellow}`)
		eventLog(`http port:\t ${app.get('port').toString().yellow}`)
		eventLog(`running mode:\t ${config.status.cyan}`)
	}else{
		errorLog(err)
	}
})

