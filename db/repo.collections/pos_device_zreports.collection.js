module.exports=function(dbModel){
    let schema = mongoose.Schema({
        posDevice: {type: mongoose.Schema.Types.ObjectId, ref: 'pos_devices', mdl:dbModel['pos_devices'], required: true,index:true},
        zNo: { type: Number,default: 0,index:true},
        zDate: { type: Date,default: null,index:true},
        zTotal: { type: Number,default: 0},
        data: {type: Object, default: null},
        status: {type: String, default: '',enum:['','transferring','pending','transferred','error'],index:true},
        error:{_date:{ type: Date,default: Date.now}, code:'',message:''},
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
    
    // schema.index({
    //     "zNo":1,
    //     "zDate":1,
    //     "status":1,
    //     "posDevice":1
    // })
    
    let collectionName='pos_device_zreports'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    return model
}
