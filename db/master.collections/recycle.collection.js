module.exports=function(conn){
	var schema = mongoose.Schema({
		collectionName: {type: String, default: '',index:true},
		documentId: {type: mongoose.Schema.Types.ObjectId, default: null, index:true},
		document: {type: Object, default: null},
		deletedBy: {type: String, required: true, default: ''},
		deletedDate: { type: Date,required: true, default: Date.now, index:true}
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


	var collectionName='recycle'
	var model=conn.model(collectionName, schema)

	model.removeOne=(member, filter,cb)=>{ sendToTrash(conn,collectionName,member,filter,cb) }
	return model
}
