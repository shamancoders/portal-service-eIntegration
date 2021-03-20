module.exports=function(dbModel){
    let schema = mongoose.Schema({
        collectionName: {type: String, default: ''},
        documentId: {type: mongoose.Schema.Types.ObjectId, default: null},
        document: {type: Object, default: null},
        deletedBy: {type: String, required: true, default: ''},
        deletedDate: { type: Date,required: true, default: Date.now}
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
    
    return conn.model('recycle', schema)
}
