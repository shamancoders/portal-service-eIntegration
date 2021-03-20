module.exports=function(dbModel){
    let schema = mongoose.Schema({
        location: {type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], required: [true,'Lokasyon gereklidir.']},
        name: {type: String, trim:true, required: [true,'isim gereklidir'], unique:true},
        description: {type: String, trim:true},
        account: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel['accounts'], default:null },
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
 

    let collectionName='mrp_stations'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    // model.removeMany=(member, filter,cb)=>{ sendToTrashMany(conn,collectionName,member,filter,cb) }
    model.relations={mrp_machines:'station'}
    return model
}
