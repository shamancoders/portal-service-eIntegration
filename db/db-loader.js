global.dbType=require('./db-types')


module.exports=(cb)=>{
	init((err)=>{
		if(!err){
			moduleLoader(path.join(__dirname, 'master.collections'),'.collection.js','master db',(err,holder)=>{
				if(!err){
					global.db=holder
					global.repoDb={}
					moduleLoader(path.join(__dirname, 'repo.collections'),'.collection.js','repository db',(err,holder)=>{
						if(!err){
							global.repoDbModels=holder
							// exports.init_all_databases((err)=>{
							// 	cb(err)
							// })
							
							refreshRepoDb(()=>{
								cb(null)
							})
						}else{
							cb(err)
						}
					})
				}else{
					cb(err)
				}
			})
		}else{

			cb(err)
		}
	})
	
}


global.refreshRepoDb=function(callback){
	Object.keys(repoDb).forEach((key)=>{
		repoDb[key].passive=true
	})
	db.dbdefines.find({deleted:false,passive:false},(err,docs)=>{
		if(!err){
			var startFunc=(new Date()).yyyymmddhhmmss()
			var veriAmbarlari=[]
			docs.forEach((doc,index)=>{
				doc['finish']=false
				veriAmbarlari.push(doc)
			})

			veriAmbarlari.forEach((doc)=>{
				if(repoDb[doc._id]==undefined){
					exports.connectDatabase(doc,(err)=>{
						doc.finish=true
					})
				}else{
					repoDb[doc._id].passive=false
					doc.finish=true
				}
				
			})


			function kontrolet(cb){
				var bitmemisVar=false
				veriAmbarlari.forEach((doc)=>{
					if(doc.finish==false){
						bitmemisVar=true
						return
					}
				})
				if(bitmemisVar){
					setTimeout(kontrolet,0,cb)
				}else{
					cb(null)
				}
			}

			kontrolet((err)=>{
				Object.keys(repoDb).forEach((key)=>{
					if(repoDb[key].passive){
						repoDb[key]=undefined
						delete repoDb[key]
					}
				})
				callback(err)
			})

		}else{
			callback(err)
		}
	})
}



function init(callback){
	global.mongoose = require('mongoose')
	global.mongoosePaginate = require('mongoose-paginate-v2')
	global.mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')
	mongoosePaginate.paginate.options = { 
		lean:  true,
		limit: 10
	}
	global.ObjectId = mongoose.Types.ObjectId

	mongoose.set('useCreateIndex', true)
	mongoose.set('useFindAndModify', false)



	global.dbconn = mongoose.createConnection(config.mongodb.address,{ useNewUrlParser: true ,useUnifiedTopology:true, autoIndex: true  })

	global.sendToTrash=(conn,collectionName,member,filter,cb)=>{
		conn.model(collectionName).findOne(filter,(err,doc)=>{
			if(!err){
				function silelim(cb1){
					conn.model('recycle').insertMany([{collectionName:collectionName,documentId:doc._id,document:doc,deletedBy:member.username}],(err)=>{
						if(!err){
							conn.model(collectionName).deleteOne(filter,(err,doc)=>{
								cb1(err,doc)
							})
						}else{
							cb1(err)
						}
					})
				}

				if(conn.model(collectionName).relations){
					var keys=Object.keys(conn.model(collectionName).relations)
					var index=0

					function kontrolEt(cb2){
						if(index>=keys.length){
							cb2(null)
						}else{
							var relationFilter={}
							var k=keys[index]

							relationFilter[conn.model(collectionName).relations[k]]=doc._id
							conn.model(k).countDocuments(relationFilter,(err,c)=>{
								if(!err){
									if(c>0){
										cb2({name:'RELATION_ERROR',message:"Bu kayit '" + k + "' tablosuna baglidir. Silemezsiniz!"})

									}else{
										index++
										setTimeout(kontrolEt,0,cb2)
									}
								}else{
									cb2(err)
								}
							})
						}
					}

					kontrolEt((err)=>{
						if(!err){
							silelim(cb)
						}else{

							cb(err)
						}
					})
				}else{
					silelim(cb)
				}

			}else{
				cb(err)
			}
		})
	}


	global.dberr=(err,cb)=>{
		if(!err){
			return true
		}else{
			if(!cb){
				throw err
				return false
			}else{
				cb(err)
				return false
			}
		}
	}

	global.dbnull=(doc,cb,msg='Kayıt bulunamadı')=>{
		if(doc!=null){
			return true
		}else{
			var err={code:'RECORD_NOT_FOUND',message:msg}
			if(!cb){
				throw err
				return false
			}else{
				cb(err)
				return false
			}
		}
	}

	mongoose.set('debug', false)

	process.on('SIGINT', function() {  
		mongoose.connection.close(function () { 
			eventLog('Mongoose default connection disconnected through app termination') 
			process.exit(0) 
		}) 
	}) 

	global.epValidateSync=(doc,cb)=>{
		var err = doc.validateSync()
		if(err){
			var keys=Object.keys(err.errors)
			var returnError={code:'HATALI_VERI',message:''}
			keys.forEach((e,index)=>{
				returnError.message +=`Hata ${(index+1).toString()} : ${err.errors[e].message}`
				if(index<keys.length-1)
					returnError.message +='  |  '

			})

			if(cb){
				cb(returnError)
				return false
			}
			else{
				throw returnError
			}
		}else{
			return true
		}
	}

	dbconn.on('connected', function () { 
		eventLog('Mongoose connected to ' + config.mongodb.address.brightBlue)
		callback(null)
	}) 


	dbconn.on('error',function (err) {  
		errorLog('Mongoose default connection error: ', err)
		callback(err)
	}) 

	dbconn.on('disconnected', function () {  
		eventLog('Mongoose default connection disconnected') 
	})
}

function moduleLoader(folder,suffix,expression,cb){
	try{
		var moduleHolder={}
		var files=fs.readdirSync(folder)

		files.forEach((e)=>{
			let f = path.join(folder, e)
			if(!fs.statSync(f).isDirectory()){
				var fileName = path.basename(f)
				var apiName = fileName.substr(0, fileName.length - suffix.length)
				if (apiName != '' && (apiName + suffix) == fileName) {
					moduleHolder[apiName] = require(f)
				}
			}
		})

		cb(null,moduleHolder)
	}catch(e){
		errorLog(`moduleLoader Error:
		         folder:${folder} 
		         suffix:${suffix}
		         expression:${expression}
		         `)
		cb(e)
	}
}

//_id,userDb,userDbHost,dbName,

exports.connectDatabase=function(dbDoc,cb){
	if(repoDb[dbDoc._id]!=undefined){
		return cb(null)
	}

	//var usrConn = mongoose.createConnection(dbDoc.userDbHost + dbDoc.userDb,{ useNewUrlParser: true, useUnifiedTopology:true, autoIndex: true})
	var usrConn = mongoose.createConnection(config.mongodb.userAddress + dbDoc.userDb,{ useNewUrlParser: true, useUnifiedTopology:true, autoIndex: true})
	usrConn.on('connected', function () {  
		eventLog(`repository db ${dbDoc.dbName.brightGreen} connected.`)
		repoDb[dbDoc._id]={}
		Object.keys(repoDbModels).forEach((e)=>{
			repoDb[dbDoc._id][e]=repoDbModels[e](usrConn)
		})

		repoDb[dbDoc._id]['_id']=dbDoc._id
		repoDb[dbDoc._id]['owner']=dbDoc.owner
		repoDb[dbDoc._id]['userDb']=dbDoc.userDb
		// repoDb[dbDoc._id]['userDbHost']=dbDoc.userDbHost
		repoDb[dbDoc._id]['userDbHost']=config.mongodb.userAddress
		repoDb[dbDoc._id]['dbName']=dbDoc.dbName
		repoDb[dbDoc._id]['authorizedMembers']=dbDoc.authorizedMembers || []
		repoDb[dbDoc._id]['conn']=usrConn

		if(cb)
			cb(null)
	}) 

	usrConn.on('error',function (err) {  
		errorLog('Mongoose user connection "' + config.mongodb.userAddress + dbDoc.userDb + '" error: ', err)
		if(cb)
			cb(err)
	}) 
}


exports.init_all_databases=function(callback){
	
	db.dbdefines.find({deleted:false,passive:false},(err,docs)=>{
		if(!err){
			var startFunc=(new Date()).yyyymmddhhmmss()
			var veriAmbarlari=[]
			docs.forEach((doc,index)=>{
				doc['finish']=false
				veriAmbarlari.push(doc)
			})

			veriAmbarlari.forEach((doc)=>{

				exports.connectDatabase(doc,(err)=>{
					doc.finish=true
				})
			})


			function kontrolet(cb){
				var bitmemisVar=false
				veriAmbarlari.forEach((doc)=>{
					if(doc.finish==false){
						bitmemisVar=true
						return
					}
				})
				if(bitmemisVar){
					setTimeout(kontrolet,0,cb)
				}else{
					cb(null)
				}
			}

			kontrolet((err)=>{

				callback(err)
			})

		}else{
			callback(err)
		}
	})
}


global.getFileJSON=(fileName)=>{
	var jsonStr=fs.readFileSync(fileName,'utf8')
	return getJSON(jsonStr)
}

global.getJSON=(jsonStr)=>{
	var dizi=jsonStr.split('\n')
	var yeniStr=''
	dizi.forEach((e)=>{
		if(e.trim().indexOf('//')==0){

		}else{
			yeniStr+=e + '\n'
		}
	})
	return JSON.parse(yeniStr)
}

// exports.settings=(_id,cb)=>{
// 	var defaultRepoSettings=getFileJSON(path.join(__dirname,'repo.resources','repodb-settings.json'))
// 	var obj=clone(defaultRepoSettings)
// 	db.dbdefines.findOne({_id:_id},(err,doc)=>{
// 		if(!err){
// 			if(doc){
// 				obj=Object.assign(obj,doc.settings)
// 			}
// 		}
// 		cb(null,obj)
// 	})
	
// }