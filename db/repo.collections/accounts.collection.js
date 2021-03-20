module.exports=function(dbModel){
	let schema = mongoose.Schema({
		// parentAccount: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel['accounts'] },
		parentAccount: {type: mongoose.Schema.Types.ObjectId},
		accountCode: {type: String, trim:true, index:true  },
		code: {type: String, trim:true, required: true, index:true },
		name: {type: String, trim:true, required: true, index:true },
		balanceAmount:{ type: Number,default: 0 , index:true },
		balanceQuantity:{ type: Number,default: 0, index:true },
		balanceQuantity2:{ type: Number,default: 0},
		balanceQuantity3:{ type: Number,default: 0},
		balanceReports:[
		{
			balanceDate:{type: String, trim:true, required: true},
			balanceAmount:{ type: Number,default: 0},
			balanceQuantity:{ type: Number,default: 0},
			balanceQuantity2:{ type: Number,default: 0},
			balanceQuantity3:{ type: Number,default: 0},
		}
		],
		createdDate: { type: Date,default: Date.now, index:true },
		modifiedDate:{ type: Date,default: Date.now, index:true }
	})


	schema.pre('save', function(next) {
		if(this.parentAccount){
			conn.model('accounts').findOne({_id:this.parentAccount},(err,parentDoc)=>{
				if(!err){
					if(parentDoc!=null){
						this.accountCode=parentDoc.accountCode + '.' + this.code
					}
				}else{
					return next(new Error({name:err.name,message:err.message}))
				}
				next()

			})

		}else{
			this.accountCode=this.code
			next()
		}

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
	schema.index({
		"accountCode":1,
		"code":1,
		"name":1,
		"balanceAmount":1,
		"balanceQuantity":1,
		"createdDate":1
	})
	schema.index({
		"accountCode":1
	},{unique:true})
	let collectionName='accounts'
	let model=dbModel.conn.model(collectionName, schema)


	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
	model.relations={accounts:'parentAccount', parties:'account'}

	return model
}

