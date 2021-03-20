module.exports=function(dbModel){
    let schema = mongoose.Schema({
        station: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_stations', mdl:dbModel['mrp_stations'], required: [true,'Istasyon gereklidir.']},
        machineGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_machine_groups', mdl:dbModel['mrp_machine_groups'], required: [true,'Makine grubu gereklidir.']},
        name: {type: String, trim:true, required: true},
        description: {type: String, trim:true},
        minCapacity:{type: Number, default:0},
        maxCapacity:{type: Number, default:0},
        power:{type: Number, default:0},
        machineParameters:[{
            name:{type: String, trim:true, default:''},
            value:{type: String, trim:true, default:''}
        }],
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
 

    let collectionName='mrp_machines'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    // model.removeMany=(member, filter,cb)=>{ sendToTrashMany(conn,collectionName,member,filter,cb) }
    //model.relations={pos_devices:'location'}
    return model
}
