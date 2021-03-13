module.exports=function(conn){
	var schema = mongoose.Schema({
    item: {type: mongoose.Schema.Types.ObjectId, ref:'items' , default:null},
    member: {type: mongoose.Schema.Types.ObjectId, ref:'members' , default:null},
    image: {type:String, default: ''},
    width:{type:Number,default:0},
    height:{type:Number,default:0},
    blur: {type:Boolean, default: false},
    uploaddate: {type:Date,default: Date('1900-01-01')},
    deleted: {type:Boolean, default: false},
    deleteddate: {type:Date,default: Date('1900-01-01')}
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


	var collectionName='images'
	var model=conn.model(collectionName, schema)

	model.removeOne=(member, filter,cb)=>{ sendToTrash(conn,collectionName,member,filter,cb) }
	return model
}
