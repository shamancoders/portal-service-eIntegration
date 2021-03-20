module.exports=function(dbModel){
	let schema = mongoose.Schema({
		id:{ type: String, trim:true, default: ''},
		room:{ type: String, trim:true, default: ''},
		streetName:{ type: String, trim:true, default: ''},
		blockName:{ type: String, trim:true, default: ''},
		buildingName:{ type: String, trim:true, default: ''},
		buildingNumber:{ type: String, trim:true, default: ''},
		citySubdivisionName:{ type: String, trim:true, default: ''},
		cityName:{ type: String, trim:true, default: ''},
		postalZone:{ type: String, trim:true, default: ''},
		postbox:{ type: String, trim:true, default: ''},
		region:{ type: String, trim:true, default: ''},
		district:{ type: String, trim:true, default: ''},
		country:{
			identificationCode:{ type: String, default: 'TR'},
			name:{ type: String, trim:true, default: 'Türkiye'}
		},
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
	

	let collectionName='address'
	let model=dbModel.conn.model(collectionName, schema)
	
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
	
	return model
}
