module.exports=function(dbModel){
    let schema = mongoose.Schema({
        name: {type: String, required: [true,'Isim gereklidir.']},
        connectorType: {type: String, enum:['','e-invoice','e-ledger','zreport']},
        connectorId: {type: String, required: [true,'Connector ID gereklidir.']},
        connectorPass: {type: String, required: [true,'Connector password gereklidir.']},
        connectionType: {type: String, enum:['mssql','mysql','file','console','js','bat','bash','wscript','cscript'], required: [true,'Baglanti Turu gereklidir.']},
        connection:{
            server: {type :String, default: ''},
            port:{type :Number, default: 0},
            database:{type :String, default: ''},
            username: {type :String, default: ''},
            password: {type :String, default: ''},
            file: {type :String, default: ''}
        },
        startFile:{type: mongoose.Schema.Types.ObjectId, ref: 'files', mdl:dbModel['files']},
        files:[{type: mongoose.Schema.Types.ObjectId, ref: 'files', mdl:dbModel['files']}],
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
    

    let collectionName='local_connectors'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    model.relations={pos_devices:'localConnector'}

    return model
}
