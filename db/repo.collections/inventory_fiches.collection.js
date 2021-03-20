module.exports=function(dbModel){
    let schema = mongoose.Schema({
        docTypeCode:{ type: String,default: '', trim:true, enum:['TRANSFER','GIRIS','CIKIS','SAYIMFAZLASI','SAYIMEKSIGI','SARF','URETIMECIKIS','URETIMDENGIRIS','SAYIM']},
        docId:{type: String, trim:true, default: '', unique:true},
        issueDate: { type: String, trim:true, required: [true,'Tarih gereklidir']},
        issueTime: { type: String, trim:true, default: '00:00:00.0000000+03:00'},
        productionOrderId: {type: mongoose.Schema.Types.ObjectId, ref: 'production_orders', mdl:dbModel['production_orders'], default:null},
        location: {type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], default:null},
        subLocation: {type: mongoose.Schema.Types.ObjectId, ref: 'sub_locations', mdl:dbModel['sub_locations'], default:null},
        location2: {type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], default:null},
        subLocation2: {type: mongoose.Schema.Types.ObjectId, ref: 'sub_locations', mdl:dbModel['sub_locations'], default:null},
        description:{type: String, trim:true, default: ''},
        docLine:[{
            sequence:{ type: Number, default: 0},
            item:{type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items'], default:null, index:true},
            quantity: {type: Number, default: 0, index:true},
            quantity2: {type: Number, default: 0, index:true},
            quantity3: {type: Number, default: 0, index:true},
            unitCode:{type: String, trim:true, default: '', index:true},
            pallet:{type: mongoose.Schema.Types.ObjectId, ref: 'pallets', mdl:dbModel['pallets'], default:null, index:true},
            lotNo:{type: String, trim:true, default: '', index:true},
            serialNo:{type: String, trim:true, default: '', index:true},
            color:{type: Object, default:null, index:true},  //qwerty  colors tablosuna
            pattern:{type: Object, default:null, index:true},  //qwerty  pattern tablosuna
            size:{type: Object, default:null, index:true}  //qwerty  size tablosuna
        }],

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
        "item":1,
        "name":1,
        "description":1,
        "createdDate":1
    })


    let collectionName='inventory_fiches'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    return model
}
