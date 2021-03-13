module.exports=function(conn){
	var schema = mongoose.Schema({
    connectorId: {type: Number, default:0, unique : true},
    connectorPass: {type: String, required: true},
    uuid: {type: String, required: true,default:""},
    version: {type: String, default:""},
    ip: {type: String, required: true,default:""},
    platform: {type: String,default:""},
    architecture: {type: String,default:""},
    hostname: {type: String,default:""},
    release: {type: String,default:""},
    userInfo: {type: Object,default:null},
    cpus: {type: Object,default:null},
    freemem: {type: Number,default:0},
    totalmem: {type: Number,default:0},
    createdDate: { type: Date,default: Date.now},
    lastOnline:{ type: Date,default: Date.now},
    lastError: {type: String, default:""},
    passive: {type: Boolean, default: false}
	})

	schema.pre('save', function(next) {
		next()
	})
	schema.pre('remove', function(next) {
		next()
	})

	schema.pre('remove', true, function(next, done) {
		next()
	})

	schema.on('init', function(model) {

	})
	
	schema.plugin(mongoosePaginate)


	var collectionName='local_connectors'
	var model=conn.model(collectionName, schema)

	model.removeOne=(member, filter,cb)=>{ sendToTrash(conn,collectionName,member,filter,cb) }
	return model
}
