var schema = mongoose.Schema({
    username: {type:String, required: true},
    password: {type :String, default: ""},
    role: {type :String, default: "user"},
    name:{type :String, trim:true, default: ""},
    lastName:{type :String, trim:true, default: ""},
    gender: {type :String, default: ""},
    isMobile: {type :Boolean, default: true},
    authCode: {type :String, default: ""},
    verified: {type :Boolean, default: false},
    email: {type :String, default: ""},
    country: {type :String, default: ""},
    favorites: [],
    point : {type :Number, default: 100},
    latitude: {type :Number, default: 0},
    longitude:{type :Number, default: 0},
    address:{
        cityName: {type :String, default: ''},
        citySubdivisionName:{type :String, default: ''},
        streetName:{type :String, default: ''},
        buildingNumber: {type :String, default: ''},
        buildingName: {type :String, default: ''},
        room: {type :String, default: ''},
        countryName: {type :String, default: ''},
        province: {type :String, default: ''}
    },
    address2:{
        cityName: {type :String, default: ''},
        citySubdivisionName:{type :String, default: ''},
        streetName:{type :String, default: ''},
        buildingNumber: {type :String, default: ''},
        buildingName: {type :String, default: ''},
        room: {type :String, default: ''},
        countryName: {type :String, default: ''},
        province: {type :String, default: ''}
    },
    mainPicture: {type: mongoose.Schema.Types.ObjectId, ref:'images' , default:null},
    mainPictureSmall: {type: mongoose.Schema.Types.ObjectId, ref:'smallimages' , default:null},
    mainPictureBlur: {type: mongoose.Schema.Types.ObjectId, ref:'images' , default:null},
    mainPictureSmallBlur: {type: mongoose.Schema.Types.ObjectId, ref:'smallimages' , default:null},
    taxboardPicture: {type: mongoose.Schema.Types.ObjectId, ref:'images' , default:null},
    idCardPicture1: {type: mongoose.Schema.Types.ObjectId, ref:'images' , default:null},
    idCardPicture2: {type: mongoose.Schema.Types.ObjectId, ref:'images' , default:null},

    showName :  {type :Boolean, default: true},
    showPicture :  {type :Boolean, default: true},
    profileEnabled :  {type :Boolean, default: true},
    ip: {type :String, default: ""},
    deviceId: {type :String, default: ""},
    deviceToken: {type :String, default: ""},
    createdDate: { type: Date,default: Date.now},
    modifiedDate:{ type: Date,default: Date.now},
    modules:{
        eInvoice: {type: Boolean, default: false},
        eDespatch: {type: Boolean, default: false},
        eLedger: {type: Boolean, default: false},
        eDocument: {type: Boolean, default: false},
        erp: {type: Boolean, default: false},
        mrp: {type: Boolean, default: false},
        mrp2: {type: Boolean, default: false},
        inventory: {type: Boolean, default: false},
        finance: {type: Boolean, default: false},
        sales: {type: Boolean, default: false},
        purchase: {type: Boolean, default: false},
        accounting: {type: Boolean, default: false},
        cargoIntegrations: {
            all:{type: Boolean, default: false},
            suratkargo:{type: Boolean, default: false},
            yurticikargo:{type: Boolean, default: false},
            mngkargo:{type: Boolean, default: false},
            pttkargo:{type: Boolean, default: false}
        },
        bankIntegrations: {
            all:{type: Boolean, default: false},
            garantibbva:{type: Boolean, default: false},
            yapikredi:{type: Boolean, default: false},
            finansbank:{type: Boolean, default: false}
        },
        webIntegrations: {
            all:{type: Boolean, default: false},
            opencart:{type: Boolean, default: false},
            n11:{type: Boolean, default: false},
            sahibinden:{type: Boolean, default: false},
            gittigidiyor:{type: Boolean, default: false},
            hepsiburada:{type: Boolean, default: false},
        },
        posDevice: {type: Boolean, default: false}
    },
    passive: {type: Boolean, default: false}
})

schema.pre('save',function(next){
	next()
	//bir seyler ters giderse 
	// next(new Error('ters giden birseyler var'))
})
schema.pre('remove',function(next){
	next()
})


schema.pre('remove', true, function (next, done) {
  	next()
	//bir seyler ters giderse 
	// next(new Error('ters giden birseyler var'))
})

schema.on('init', function (model) {

})

schema.plugin(mongoosePaginate)
schema.plugin(mongooseAggregatePaginate)

var model=dbconn.model('members', schema)

schema.index({ name: 'text', lastName: 'text'},{default_language: "turkish" ,name:'members_searchindex', weights:{name:10,lastName:5}})
model.removeOne=(member, filter,cb)=>{ sendToTrash(conn,collectionName,member,filter,cb) }

module.exports=model