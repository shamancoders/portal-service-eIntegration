module.exports=function(dbModel){
    let schema = mongoose.Schema({
        moldGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_mold_groups', mdl:dbModel['mrp_mold_groups'], required: [true,'Kalıp grubu gereklidir.']},
        machineGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_machine_groups', mdl:dbModel['mrp_machine_groups'], required: [true,'Makine grubu gereklidir.']},
        name: {type: String, trim:true, required: true},
        description: {type: String, trim:true},
        moldParameters:[{
            name:{type: String, trim:true, default:''},
            value:{type: String, trim:true, default:''}
        }],
        cavity:{ type: Number, default: 0},
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
 

    let collectionName='mrp_molds'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    // model.removeMany=(member, filter,cb)=>{ sendToTrashMany(conn,collectionName,member,filter,cb) }
    //model.relations={pos_devices:'location'}
    return model
}
