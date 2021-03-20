module.exports=function(dbModel){
    let schema = mongoose.Schema({
        taskType: {type: String, required: true, enum:['connector_transfer_zreport','send_email','send_sms',
        'connector_import_einvoice','connector_export_einvoice','connector_import_eledger','einvoice_send_to_gib',
        'einvoice_approve','einvoice_decline','edespatch_send_to_gib','edespatch_send_receipt_advice']},
        collectionName:{type: String, default:''},
        documentId: {type: mongoose.Schema.Types.ObjectId, default: null},
        document:{type: Object, default:null},
        startDate: { type: Date,default: Date.now},
        endDate:{ type: Date,default: Date.now},
        status:{type: String, required: true, default:'pending', enum:['running','pending','completed','cancelled','error']},
        attemptCount:{type:Number,default:1},
        error:[]
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
    schema.index({
        "taskType":1,
        "collectionName":1,
        "documentId":1,
        "startDate":1,
        "status":1
    })

    let collectionName='tasks'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    //model.relations={pos_device_zreports:'posDevice'}

    return model
}
