//, enum:['ejs','json','xml','xslt','xls','xlsx','doc','docx','txt','pdf','html','js','sh','bat','cmd','jpg','jpeg','csv','sql','xsl','png']

module.exports=function(dbModel){
    let schema = mongoose.Schema({
        name: {type :String, trim:true, default:'' },
        extension: {type :String,  trim:true, default: ''},
        fileName: {type :String,  trim:true, default:''},
        type: {type :String, default:'text/plain'},
        data: {type: Object, default: null},
        size: {type: Number ,default: 0},
        createdDate: { type: Date,default: Date.now},
        modifiedDate:{ type: Date,default: Date.now}
    })

    schema.pre('save', function(next) {
      if(this.name=='' && this.fileName==''){
        this.fileName='file000001'
        this.name='file000001'
      }
       if(this.fileName==''){
          this.fileName=this.name + '.' + this.extension
       }else if (this.name==''){
           this.name=this.fileName.split('.')[0]
           if(this.fileName.split('.').length>1){
               this.extension=this.fileName.split('.')[1]
           }
       }
       
       this.size=sizeOf(this.data)
       this.modifiedDate=new Date()
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
    

    let collectionName='files'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    //model.relations={pos_devices:'localConnector'}

    return model
}
