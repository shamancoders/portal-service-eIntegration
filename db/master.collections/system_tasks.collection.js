module.exports=function(conn){
	var schema = mongoose.Schema({
		userDb: {type: mongoose.Schema.Types.ObjectId, ref: 'dbdefines', default: null},
		taskType: {type: String, required: true, enum:['connector_transfer_zreport','send_email','send_sms',
		'connector_import_einvoice','connector_export_einvoice','connector_import_eledger','einvoice_send_to_gib']},
		collectionName:{type: String, default:''},
		documentId: {type: mongoose.Schema.Types.ObjectId, default: null},
		document:{type: Object, default:null},
		startDate: { type: Date,default: Date.now},
		endDate:{ type: Date,default: Date.now},
		status:{type: String, required: true, default:'pending', enum:['running','pending','completed','cancelled','error']},
		attemptCount:{type:Number,default:1},
		error:[]
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


	var collectionName='system_tasks'
	var model=conn.model(collectionName, schema)

	model.removeOne=(member, filter,cb)=>{ sendToTrash(conn,collectionName,member,filter,cb) }
	return model
}
