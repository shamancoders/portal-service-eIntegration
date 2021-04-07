module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		ledger: {type: mongoose.Schema.Types.ObjectId, default:null, ref: 'accounting_ledgers', mdl:dbModel.accounting_ledgers},
		year:{ type: Number,default: 0, index:true},
		period:{ type: Number,default: 0 , index:true},
		startDate: {type: String, default:'', index:true },
		endDate: {type: String, default:'', index:true },
		enteredBy: {type: mongoose.Schema.Types.ObjectId,default:null , index:true},
		entryNumber:{ type: Number,default: 0, index:true},
		entryComment: {type: String, default:'', trim:true , index:true},
		batchId: {type: String, default:'', trim:true },
		batchDescription: {type: String, default:'', trim:true },
		totalDebit:{ type: Number,default: 0 , index:true },
		totalCredit:{ type: Number,default: 0 , index:true },
		documentType: {type: String, default:'', index:true },
		documentTypeDescription: {type: String, default:'', index:true },
		documentNumber: {type: String, default:'', index:true },
		documentDate: {type: String, required:[true,'Belge tarihi zorunludur'], index:true },
		paymentMethod: {type: String, default:'', index:true },
		journalNumber:{ type: Number,default: 0 , index:true },
		entryLine:[{
			lineNo:{ type: Number,default: 0 , index:true },
			accountMain: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel.accounts},
			account: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel.accounts},
			debit:{ type: Number,default: 0 , index:true },
			credit:{ type: Number,default: 0 , index:true },
			postingDate: {type: String, default:'' },
			detailComment: {type: String, default:'', index:true },
			journalLineNumber:{ type: Number,default: 0 , index:true },
		}],
		createdDate: { type: Date,default: Date.now, index:true },
		modifiedDate:{ type: Date,default: Date.now, index:true }
	})

	schema.pre('save', (next)=>{
		if(!isNaN(this.documentDate.substr(0,4))){
			if(Number(this.documentDate.substr(0,4))!=this.year){
				return next({code:'SYNTAX_ERROR',message:'Belge tarihi ile çalışma yılı tutarsız'})
			}
		}else{
			return next({code:'SYNTAX_ERROR',message:'Belge tarihi hatalı'})
		}
		if(!isNaN(this.documentDate.substr(5,2))){
			if(Number(this.documentDate.substr(5,2))!=this.period){
				return next({code:'SYNTAX_ERROR',message:'Belge tarihi ile çalışma periyodu(ay) tutarsız'})
			}
		}else{
			return next({code:'SYNTAX_ERROR',message:'Belge tarihi hatalı'})
		}
		this.startDate=(new Date(this.year,this.period-1,1)).yyyymmdd()
		this.endDate=(new Date(this.year,this.period-1,1)).lastThisMonth().yyyymmdd()
		this.totalDebit=0
		this.totalCredit=0
		if(this.entryLine){
			if(Array.isArray(this.entryLine)){
				var hata=''
				this.entryLine.forEach((e)=>{
					if((e.detailComment || '')==''){
						e.detailComment=this.entryComment
					}
					e.postingDate=this.documentDate
					if(e.debit>0 && e.credit>0){
						hata+='Hem borç hem alacak sıfırdan büyük olamaz. '
					}else if(e.debit<0 || e.credit<0){
						hata+='Borç ve alacak negatif değer olamaz. '
					}
					e.debit=Math.round(100*e.debit)/100
					e.credit=Math.round(100*e.credit)/100
					this.totalDebit+=e.debit
					this.totalCredit+=e.credit
				})
				if(hata!=''){
					return next({code:'SYNTAX_ERROR',message:hata})
				}
			}
		}

		if(this.totalDebit!=this.totalCredit){
			return next({code:'SYNTAX_ERROR',message:'Borc ve alacak toplami eşit değildir'})
		}
	})
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)
	let model=dbModel.conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
	model.relations={}
	return model
}

