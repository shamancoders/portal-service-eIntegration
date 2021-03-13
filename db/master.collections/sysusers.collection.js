module.exports=function(conn){
	var schema = mongoose.Schema({
    username: {type:String, required: true},
    password: {type :String, default: ""},
    role: {type :String, default: "user"},
    name:{type :String, trim:true, default: ""},
    lastName:{type :String, trim:true, default: ""},
    gender: {type :String, default: ""},
    auth:{
        createUser: {type :Boolean, default: true},
        modifyMembers: {type :Boolean, default: true}
    },
    createdDate: { type: Date,default: Date.now},
    modifiedDate:{ type: Date,default: Date.now},
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


	var collectionName='sysusers'
	var model=conn.model(collectionName, schema)

	model.removeOne=(member, filter,cb)=>{ sendToTrash(conn,collectionName,member,filter,cb) }
	return model
}
