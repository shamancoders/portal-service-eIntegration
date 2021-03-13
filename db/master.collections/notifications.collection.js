module.exports=function(conn){
	var schema = mongoose.Schema({
		memberId: {type: mongoose.Schema.Types.ObjectId, ref:'members', default:null, index:true},
		dbId: {type: mongoose.Schema.Types.ObjectId, ref:'dbdefines', default:null, index:true},
		status:{type:String,default:'', index:true},
		icon:{type:String,default:''},
		text:{type:String,default:''},
		createdDate: { type: Date,default: Date.now, index:true},
		isRead: {type: Boolean, default: false, index:true},
		readDate: { type: Date,default: Date.now, index:true}
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
	schema.plugin(mongooseAggregatePaginate)

	var collectionName='notifications'
	var model=conn.model(collectionName, schema)

	model.removeOne=(member, filter,cb)=>{ sendToTrash(conn,collectionName,member,filter,cb) }
	return model
}
