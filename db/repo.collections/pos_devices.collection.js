module.exports=function(dbModel){
    let schema = mongoose.Schema({
        location: {type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], required: [true,'Lokasyon gereklidir.']},
        service: {type: mongoose.Schema.Types.ObjectId, ref: 'pos_device_services', mdl:dbModel['pos_device_services'], required: [true,'Yazarkasa servisi gereklidir.']},
        deviceSerialNo: {type: String, required: [true,'Cihaz seri numarasi gereklidir.']},
        deviceModel: {type: String, default: ''},
        localConnector: {type: mongoose.Schema.Types.ObjectId, ref: 'local_connectors', mdl:dbModel['local_connectors'],default:null},
        createdDate: { type: Date,default: Date.now},
        modifiedDate:{ type: Date,default: Date.now},
        passive: {type: Boolean, default: false}
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
    

    let collectionName='pos_devices'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    model.relations={pos_device_zreports:'posDevice'}

    return model
}
