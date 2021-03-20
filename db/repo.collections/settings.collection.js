module.exports=function(dbModel){
	let schema = mongoose.Schema({
		type:{type: String, default:'', enum:['global','user'],index:true},
		memberId: {type: mongoose.Schema.Types.ObjectId, default: null,index:true},
		module:{type: String, default:'',index:true},
		name:{type: String, default:'',index:true},
		createdDate: { type: Date,default: Date.now, index:true },
		modifiedDate:{ type: Date,default: Date.now, index:true },
		programButtons:[{
			program:{type: mongoose.Schema.Types.ObjectId, ref: 'programs', mdl:dbModel['programs']},
			text: {type: String, default: ''},
			icon: {type :String, default:''},		
			class: {type :String, default:''},
			passive:{ type: Boolean, default:false }
		}],
		print:{
			form:{type: mongoose.Schema.Types.ObjectId, ref: 'print_designs', mdl:dbModel['print_designs'], default: null},
			list:{type: mongoose.Schema.Types.ObjectId, ref: 'print_designs', mdl:dbModel['print_designs'], default: null}
		},
		autoSave:{ type: Boolean, default:false }
	})

	schema.pre('save', function(next) {
		this.name=`${this.type}_${this.module}`
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
	

	let collectionName='settings'
	let model=dbModel.conn.model(collectionName, schema)
	
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
	
	return model
}
