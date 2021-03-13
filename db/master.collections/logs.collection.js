module.exports=function(conn){
	var schema = mongoose.Schema({
		logDate: { type: Date,default: Date.now},
		logData:{type: Object, default:null}
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


	var collectionName='logs'
	var model=conn.model(collectionName, schema)

	model.removeOne=(member, filter,cb)=>{ sendToTrash(conn,collectionName,member,filter,cb) }
	return model
}
