module.exports=function(dbModel){
    let schema = mongoose.Schema({
        item:{type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items'], default:null, index:true},
        issueDate:{type: String, trim:true, default: ''},
        quantity: {type: Number, default: 0, index:true},
        quantity2: {type: Number, default: 0, index:true},
        quantity3: {type: Number, default: 0, index:true},
        unitCode:{type: String, trim:true, default: '', index:true},
        locations:[{
            locationId:{type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], default:null, index:true},
            quantity: {type: Number, default: 0, index:true},
            quantity2: {type: Number, default: 0, index:true},
            quantity3: {type: Number, default: 0, index:true},
            unitCode:{type: String, trim:true, default: ''},
            subLocations:[{
                subLocationId:{type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], default:null, index:true},
                quantity: {type: Number, default: 0, index:true},
                quantity2: {type: Number, default: 0, index:true},
                quantity3: {type: Number, default: 0, index:true},
                unitCode:{type: String, trim:true, default: ''}
            }]
        }],
        lastModified:{ type: Date, default: Date.now}
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
  
   
        
    let collectionName='inventory_dailies'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    return model
}
