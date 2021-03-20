module.exports=function(dbModel){
    let schema = mongoose.Schema({
        docType: {type: String, default: '',required:true,index:true},
        docId: {type: String, default: '',index:true},
        docId2: {type: String, default: '',index:true},
        document: {type: Object, default: null},
        status: {type: String, default: '',index:true},
        orderBy: {type: Object, default: null,index:true},
        createdDate: { type: Date,default: Date.now,index:true},
        modifiedDate:{ type: Date,default: Date.now,index:true},
        error:{code:'',message:''}
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
        
    let collectionName='temp_table'
    let model=dbModel.conn.model(collectionName, schema)
    
    // model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    return model
}
