module.exports=function(dbModel){
	let schema = mongoose.Schema({
		name:{ type: String, trim:true,required: [true,'Isim gereklidir'], default: ''},
		times:[{
			name:{ type: String, trim:true, default: ''},
			startHour:{ type: Number, min:0, max:24, default: 0},
			startMinute:{ type: Number, min:0, max:59, default: 0},
			endHour:{ type: Number, min:0, max:24, default: 0},
			endMinute:{ type: Number, min:0, max:59, default: 0}
		}],
		passive:{type:Boolean , default:false},
		createdDate: { type: Date,default: Date.now},
		modifiedDate:{ type: Date,default: Date.now}
	})

	schema.pre('save', function(next) {
		next()
		//bir seyler ters giderse 
		// next(new Error('ters giden birseyler var'))
	})
	schema.pre('remove', function(next) {
		next()
	})

	schema.pre('remove', true, function(next, done) {
		next()
		//bir seyler ters giderse 
		// next(new Error('ters giden birseyler var'))
	})

	schema.on('init', function(model) {

	})
	

	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)
	

	let collectionName='shifts'
	let model=dbModel.conn.model(collectionName, schema)
	
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
	
	return model
}
