module.exports=function(dbModel){
    let schema = mongoose.Schema({
        item: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
        name:{type: String, default: ''},
        description:{type: String, trim:true, default: ''},
        revision:{ type: Number, default: 1},
        mrpVersion:{ type: Number, default: 1},
        process:[{
            sequence:{ type: Number, default: 0},
            station: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_stations', mdl:dbModel['mrp_stations']},
            step: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_process_steps', mdl:dbModel['mrp_process_steps']},
            machines: [{
                machineGroup:{type: mongoose.Schema.Types.ObjectId, ref: 'mrp_machine_groups', mdl:dbModel['mrp_machine_groups'], default:null},
                mold:{type: mongoose.Schema.Types.ObjectId, ref: 'mrp_molds', mdl:dbModel['mrp_molds'], default:null},
                cycle:dbType.measureType,
                cavity:{ type: Number, default: 0},
                quantityPerHour:{ type: Number, default: 0},
                parameters:{type:Object,default:null}
            }],
            input: [{
                item:{type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
                quantity:{ type: Number, default: 0},
                unitCode:{type: String, trim:true, default: ''},
                percent:{ type: Number, default: 0}
            }],
            output: [{  //yan urunler
                item:{type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
                quantity:{ type: Number, default: 0},
                unitCode:{type: String, trim:true, default: ''},
                percent:{ type: Number, default: 0}
            }],
            parameters:{type: String, default: ''}
        }],
        materialSummary:[{
            item: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
            quantity:{ type: Number, default: 0},
            unitCode:{type: String, trim:true, default: ''},
            percent:{ type: Number, default: 0}
        }],
        outputSummary:[{
            item: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
            quantity:{ type: Number, default: 0},
            unitCode:{type: String, trim:true, default: ''},
            percent:{ type: Number, default: 0}
        }],
        qualityControl:[{
            param:{type: String,trim:true, default: ''},
            value:{type: String,trim:true, default: ''}
        }],
        isDefault: {type: Boolean, default: false},
        totalQuantity:{ type: Number, default: 100},
        totalWeight:{ type: Number, default: 0},
        staffCount:{ type: Number, default: 0},
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
    schema.plugin(mongooseAggregatePaginate)
    
    schema.index({
        "item":1,
        "name":1,
        "description":1,
        "createdDate":1
    })


    let collectionName='recipes'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    return model
}
