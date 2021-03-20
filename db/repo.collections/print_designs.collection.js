module.exports=function(dbModel){
    let schema = mongoose.Schema({
        // module: {type :String, trim:true, enum:[
        //     'recipe','recipe-list','item','item-list','item-product',
        //     'mrp-production-order-list','mrp-production-order','mrp-production-order-pallet','mrp-production-order-packing',
        //     'despatch-inbox-list','despatch-inbox','despatch-outbox-list','despatch-outbox',
        //     'order-inbox-list','order-inbox','order-outbox-list','order-outbox',
        //     'inventory-list','inventory-fiche-list','inventory-fiche',
        //     ''
        // ], required: true},
				module: {type :String, trim:true, required: true},        
				function: {type :String, trim:true, required: true},        
        name: {type :String, trim:true, default:''},
        design: {type :String, default:''},
        createdDate: { type: Date,default: Date.now},
        modifiedDate:{ type: Date,default: Date.now},
        isDefault: {type: Boolean, default: true},
        passive: {type: Boolean, default: false}
    })

    schema.pre('save', function(next) {
       next()
      
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
    

    let collectionName='print_designs'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    //model.relations={pos_devices:'localConnector'}

    return model
}
