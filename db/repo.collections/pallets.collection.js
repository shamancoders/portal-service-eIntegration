module.exports=function(dbModel){
    let schema = mongoose.Schema({
        palletType: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items'], required: [true,'Palet tipi gereklidir.'], index:true},
        name: {type: String, trim:true, required: [true,'isim gereklidir.'] , unique:true},
        location: {type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], default:null},
        subLocation: {type: mongoose.Schema.Types.ObjectId, ref: 'sub_locations', mdl:dbModel['sub_locations'], default:null},
        pack:[{
            item: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items'], default:null},
            lotNo: {type: String, trim:true, default:'' , index:true},
            serialNo: {type: String, trim:true, default:'' , index:true},
            quantity: {type: Number, default: 0, index:true},
            quantity2: {type: Number, default: 0, index:true},
            quantity3: {type: Number, default: 0, index:true},
            unitCode:{type: String, trim:true, default: '', index:true},
            color:{type: Object, default:null, index:true},  //qwerty  colors tablosuna
            pattern:{type: Object, default:null, index:true},  //qwerty  pattern tablosuna
            size:{type: Object, default:null, index:true}  //qwerty  size tablosuna
        }],
        createdDate: { type: Date,default: Date.now, index:true},
        modifiedDate:{ type: Date,default: Date.now},
        passive: {type: Boolean, default: false, index:true}
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
 

    let collectionName='pallets'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    // model.removeMany=(member, filter,cb)=>{ sendToTrashMany(conn,collectionName,member,filter,cb) }
    model.relations={actions:'inventory.palletId'}
    // model.relations={machines:'location'}
    return model
}
