module.exports=function(conn){
	var schema = mongoose.Schema({
		identifier: {type: String, trim:true, default:"" ,index:true},
    postboxAlias: {type: String, trim:true, default:"",index:true},
    senderboxAlias: {type: String, trim:true, default:"",index:true},
    title: {type: String, trim:true, default:"",index:true},
    type: {type: String, trim:true, default:""},
    systemCreateDate: { type: Date,default: Date.now},
    firstCreateDate: { type: Date,default: Date.now},
    enabled: {type: Boolean, default: false,index:true}
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


	var collectionName='einvoice_users'
	var model=conn.model(collectionName, schema)

	model.removeOne=(member, filter,cb)=>{ sendToTrash(conn,collectionName,member,filter,cb) }
	return model
}
