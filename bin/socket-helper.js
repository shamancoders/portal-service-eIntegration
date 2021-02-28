exports.start= function (server) {
	socketCorsDomainList=['https://portal.tr216.com','http://portal.tr216.com']


	global.io = require("socket.io")(server, {
		cors: {
			origin:function(origin,callback){
				if(socketCorsDomainList.includes(origin) || origin.indexOf('http://localhost')>-1){
					callback(null,true)
				}else{
					callback(new Error('Hatali domain erisimi'))
				}
			}

		}
	})

	global.socketClients=[]

	io.on('connection', socket => {

		socket.id=uuid.v4()
		socketClients.push(socket)


		socket.on('message', (data) => {
			console.log('client message:',data)
		})

		socket.on('I_AM_HERE', (token,dbId) => {
			
			jwt.verify(token, 'gizliSir', function (err, decoded) {
				if(!err){
					socket.memberId=decoded._id
					socket.username=decoded.username
					socket.dbId=dbId
					exports.sendTotalUnread(socket)
				}else{
					errorLog(err)
				}
			})
		})
		socket.on('READ_ALL', () => {
			db.notifications.updateMany({memberId:socket.memberId,dbId:socket.dbId},{$set:{isRead:true,readDate:(new Date())}},{multi:true},(err,result)=>{
			})
		})

		socket.on('disconnect', () => {
			var foundIndex=0
			socketClients.findIndex((e,index)=>{
				if(e.id==socket.id){
					foundIndex=index
					return true
				}	
			})
			if(foundIndex>-1){
				console.log(`foundIndex:`,foundIndex)
				socketClients.splice(foundIndex,1)
			}
		})
	})
}

exports.notify=function(memberId,dbId,text,status,icon){
	var socket
	socketClients.forEach((e)=>{
		if(e.memberId==memberId && e.dbId==dbId){
			socket=e
		}
	})
	if(socket){
		socket.emit('NOTIFY',text,status,icon)
		exports.sendTotalUnread(socket)
	}
}


exports.sendTotalUnread=function(socket){
	var filter={memberId:socket.memberId,dbId:socket.dbId,isRead:false}
	
	db.notifications.find(filter).sort({_id:-1}).exec((err,docs)=>{
		if(!err){
			var totalUnread=docs.length
			var dizi=[]
			docs.forEach((e,index)=>{
				if(index<10){
					dizi.push(e)
				}
			})
			socket.emit('TOTAL_UNREAD',totalUnread,dizi)
		}
	})
}
