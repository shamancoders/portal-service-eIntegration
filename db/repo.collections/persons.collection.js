module.exports=function(dbModel){
    let schema = mongoose.Schema({
        //personType:{ type: String,default: '', trim:true}, // qwerty personel gorevi
        //department:{ type: String,default: '', trim:true}, // qwerty departman eklenebilir. muhasebe satis finans vs
        firstName:dbType.valueType,
        middleName:dbType.valueType,
        familyName:dbType.valueType,
        nameSuffix:dbType.valueType,
        title:dbType.valueType,
        financialAccount:dbType.financialAccountType,
        identityDocumentReference:dbType.documentReferenceType,
        nationalityId:dbType.idType,
        postalAddress:dbType.addressType,
        station: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_stations', mdl:dbModel['mrp_stations'], default:null},
        shift: {type: mongoose.Schema.Types.ObjectId, ref: 'shifts', mdl:dbModel['shifts'], default:null},
        account: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel['accounts'], default:null},
        bloodGroup: { type: String,default: '', trim:true, enum:['none','0+','0-','A+','A-','B+','B-','AB+','AB-']},
        passive:{type:Boolean , default:false},
        monthlyCost:{type:Number , default:0},
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
        'firstName.value':1,
        'middleName.value':1,
        'familyName.value':1,
        'nameSuffix.value':1,
        'title.value':1,
        'bloodGroup':1,
        'account':1,
        'shift':1,
        'station':1,
        "passive":1,
        "createdDate":1
    })

    let collectionName='persons'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    return model
}
