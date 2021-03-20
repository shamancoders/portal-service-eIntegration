module.exports=function(dbModel){
	let schema = mongoose.Schema({
		partyId: {type: mongoose.Schema.Types.ObjectId, ref: 'parties', mdl:dbModel['parties'], default:null},
		generated: {type: Boolean, default: false},
		cancelled: {type: Boolean, default: false},
		partyType:{ type: String, trim:true, default: '',enum:['Customer','Vendor','Both','Agency']},
		mainParty: {type: mongoose.Schema.Types.ObjectId, 
			
			validate: {
				validator: function(v) {
					if((this.partyType=='Ageny') && ( (v || '') == '')){
						return false
					}else{
						return true
					}
				},
				message: 'Acente eklerken, ana firma secmelisiniz'
			},
			default:null
		},
		account: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel['accounts'],default:null},
		websiteURI:dbType.valueType,
		partyIdentification:[dbType.partyIdentificationType],
		partyName:{
			name:{value:{ type: String, trim:true, required:[true,'Isim gereklidir'], default: ''}}
		},
		postalAddress:dbType.addressType,
		partyTaxScheme:{
			taxScheme:{
				name:dbType.valueType,
				taxTypeCode:dbType.valueType
			}
		},
		contact:dbType.contactType,
		person:dbType.personType,
		tags:{ type: String, trim:true, default: ''},
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

	schema.index({
		"partyName.name.value":1,
		"partyType":1,
		"passive":1,
		"postalAddress.province.value":1,
		"postalAddress.cityName.value":1,
		"person.firstName.value":1,
		"person.middleName.value":1,
		"person.familyName.value":1,
		"createdDate":1,
		"tags":1
	})

	let collectionName='autonew_parties'
	let model=dbModel.conn.model(collectionName, schema)

	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }

	return model
}
