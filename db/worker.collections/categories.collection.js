module.exports=function(conn){
	var schema = mongoose.Schema({
		name: {type: String, trim:true, required: true,index:true},
		createdDate: { type: Date,default: Date.now},
		modifiedDate:{ type: Date,default: Date.now}
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


	var collectionName='categories'
	var model=conn.model(collectionName, schema)

	model.removeOne=(member, filter,cb)=>{ sendToTrash(conn,collectionName,member,filter,cb) }
	return model
}
