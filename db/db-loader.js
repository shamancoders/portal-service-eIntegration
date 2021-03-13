global.dbType=require('./db-types')

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

global.db={
	dbName:'@MasterDb',
	get nameLog(){
		return dbNameLog(this)
	}
}
global.wooDb={
	dbName:'@WooDb',
	get nameLog(){
		return dbNameLog(this)
	}
}


module.exports=(cb)=>{
	baglan('master.collections',config.mongodb.address,db,(err)=>{
		if(!err){
			baglan('woo.collections',config.mongodb.wooIntegrationDb,wooDb,(err)=>{
				if(!err){
					cb(null)
				}else{
					cb(err)
				}
			})
			
		}else{
			cb(err)
		}
	})
}

function baglan(collectionFolder, mongoAddress, dbObj, cb){
	if(collectionFolder && mongoAddress && !dbObj.conn){
		moduleLoader(path.join(__dirname, collectionFolder),'.collection.js',``,(err,holder)=>{
			if(!err){
				dbObj.conn = mongoose.createConnection(mongoAddress,{ useNewUrlParser: true ,useUnifiedTopology:true, autoIndex: true  })
				dbObj.conn.on('connected', ()=>{
					if(dbObj.conn.active!=undefined){
						eventLog(`${dbObj.nameLog} ${'re-connected'.green}`)
					}else{
						eventLog(`${dbObj.nameLog} ${'connected'.brightGreen}`)
					}
					dbObj.conn.active=true
					
					Object.keys(holder).forEach((e)=>{
						if(!dbObj[e]){
							dbObj[e]=holder[e](dbObj.conn)
						}
					})

					if(cb)
						cb(null)
				})

				dbObj.conn.on('error', (err)=>{
					dbObj.conn.active=false
					errorLog(`${dbObj.nameLog} Error:\r\n`,err)
					if(cb)
						cb(err)
				}) 

				dbObj.conn.on('disconnected', ()=>{
					dbObj.conn.active=false
					eventLog(`${dbObj.nameLog} ${'disconnected'.cyan}`)
					if(repoDb[dbObj._id]!=undefined){
						repoDb[dbObj._id]=undefined
						delete repoDb[dbObj._id]
					}
				})
			}else{
				if(cb)
					cb(err)
			}

		})
	}else{
		if(cb)
			cb()
	}
}



function userDbCheckItSelf(cb){
	var target=this
	db.dbdefines.findOne({_id:this._id},(err,doc)=>{
		if(dberr(err,cb)){
			target=Object.assign({}, target, doc.toJSON())
			if(this.userDb!=doc.userDb || this.userDbHost!=doc.userDbHost){
				this.conn=undefined
				delete this.conn

				baglan('repo.collections',`${doc.userDbHost}${doc.userDb}`, this, (err)=>{
					if(dberr(err,cb)){
						if(cb)
							cb(null)
					}
				})
			}else{
				if(cb)
					cb(null)
			}
		}
	})
}

global.repoDb={}

global.refreshRepoDb=()=>{
	var filter={}
	db.dbdefines.find(filter,(err,docs)=>{
		if(dberr(err)){
			docs.forEach((doc)=>{
				doc=doc.toJSON()
				if(repoDb[doc._id]==undefined && !doc.deleted && !doc.passive){
					repoDb[doc._id]={
						get nameLog(){
							return dbNameLog(doc)
						},
						isBusy:true
					}
					
					Object.keys(doc).forEach((key)=>{
						repoDb[doc._id][key]=doc[key]
					})
					repoDb[doc._id].check=userDbCheckItSelf
					baglan('repo.collections',`${doc.userDbHost}${doc.userDb}`, repoDb[doc._id], (err)=>{
						repoDb[doc._id].isBusy=false
					})
				}else if(repoDb[doc._id]!=undefined &&  (doc.deleted || doc.passive)){
					if(repoDb[doc._id].conn){
						repoDb[doc._id].conn.close()
					}
					repoDb[doc._id]=undefined
					delete repoDb[doc._id]
					
				}else{
					if(repoDb[doc._id]!=undefined){
						if(repoDb[doc._id].isBusy)
							return
						repoDb[doc._id].isBusy=true
						Object.keys(doc).forEach((key)=>{
							repoDb[doc._id][key]=doc[key]
						})
						repoDb[doc._id].isBusy=false
					}
				}
			})
		}
	})

	setTimeout(refreshRepoDb,2000)

}

var moduleLoaderCache={}
function moduleLoader(folder,suffix,expression,cb){
	try{

		var moduleHolder={}

		if(moduleLoaderCache[folder]!=undefined){
			// moduleHolder=clone(moduleLoaderCache[folder])
			// return cb(null,moduleHolder)
			return cb(null,moduleLoaderCache[folder])
		}
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

		moduleLoaderCache[folder]=moduleHolder

		
		cb(null,moduleHolder)
	}catch(e){
		errorLog(`moduleLoader Error:\r\n\tfolder:${folder}\r\n\tsuffix:${suffix}\r\n\texpression:${expression}`,e)
		cb(e)
	}
}


global.runServiceOnAllUserDb=(options)=>{
	try{
		options.repeatInterval=options.repeatInterval || 60000
		if(repoDb==undefined){
			setTimeout(()=>{ runServiceOnAllUserDb(options) },options.repeatInterval)
			return
		}

		Object.keys(repoDb).forEach((_id)=>{
			var dbModel=repoDb[_id]
			if(dbModel.conn==undefined)
				return
			if(!dbModel.conn.active)
				return

			var serviceName=options.name || app.get('name')
			dbModel.isWorking=dbModel.isWorking || {}

			if((options.filter?options.filter(dbModel):true)){
				if(!dbModel.isWorking[serviceName]){
					

					if(dbModel.isWorking[`${serviceName}_endTime`]!=undefined){
						// ** son bitisin uzerinden repeatInterval kadar gecmediyse calistirma, sonraki refreshte calissin
						var sonBitis=dbModel.isWorking[`${serviceName}_endTime`]
						var fark=(new Date()).getTime()-sonBitis
						if(fark<options.repeatInterval){
							return
						}
					}

					dbModel.isWorking[serviceName]=true
					dbModel.isWorking[`${serviceName}_t`]=(new Date()).getTime()
					eventLog(`${dbModel.dbName.padding(20).brightBlue} ${serviceName.yellow} started`)

					options.serviceFunc(dbModel,(err)=>{
						var fark=(((new Date()).getTime())-dbModel.isWorking[`${serviceName}_t`])/1000
						dbModel.isWorking[serviceName]=false
						if(!err){
							eventLog(`${dbModel.dbName.padding(20).brightBlue} ${serviceName.yellow} finished in ${fark.toString().yellow} sn`)
						}else{
							errorLog(`${dbModel.dbName.padding(20).brightBlue} ${serviceName.yellow} ${fark.toString().yellow} sn Error:`,err)
						}
						dbModel.isWorking[`${serviceName}_endTime`]=(new Date()).getTime()
					})
				}
			}
		})
		setTimeout(()=>{ runServiceOnAllUserDb(options) },options.repeatInterval)
	}catch(tryErr){
		console.error(tryErr)
		setTimeout(()=>{ runServiceOnAllUserDb(options) },options.repeatInterval)
	}
}

function dbNameLog(target){
	var s=''
	
	if(target.dbName!=undefined){
		s=target.dbName
	}
	s=s.padding(20).brightBlue
	return s
}
