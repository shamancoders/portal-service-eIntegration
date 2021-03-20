module.exports=function(dbModel){
    let schema = mongoose.Schema({
        type: {type: String, trim:true, required: [true,'Servis turu gereklidir'], default: 'ingenico', enum:['ingenico','beko','hugin','profilo','verifone','olivetti','veradelta']},
        name: {type: String,  trim:true, required: [true,'Servis adi gereklidir']},
        url: {type: String, trim:true, default: ''},
        username: {type: String, trim:true, default: ''},
        password: {type: String, default: ''},
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
    

    let collectionName='pos_device_services'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    model.relations={pos_devices:'service'}

    return model
}
