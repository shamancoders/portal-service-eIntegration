module.exports=function(dbModel){
	
	let collectionName='locations'
	// if(conn.models[collectionName]){
	// 	return conn.models[collectionName]
	// }
  let schema = mongoose.Schema({
      name: {type: String, trim:true, required:  [true,'isim gereklidir.']  , index:true},
      type: {type: String, required:  [true,'tur gereklidir.'] , default:'', 
      enum:['warehouse','shop','manufacture','return','mobile','other'], index:true}, 
      createdDate: { type: Date,default: Date.now, index:true},
      modifiedDate:{ type: Date,default: Date.now},
      subLocations:[
      	{
      		name: {type: String, required:  [true,'isim gereklidir.']},
      		passive: {type: Boolean, default: false}
      	}
      ],
      passive: {type: Boolean, default: false, index:true}
  })

  schema.pre('save', function(next) {
      next()
  })
  schema.pre('remove', function(next) {
      next()
  })

  schema.pre('remove', true, function(next, done) {
      next()
  })

  schema.on('init', function(model) {

  })

  schema.plugin(mongoosePaginate)


  
  let model=dbModel.conn.model(collectionName, schema)
  
  model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
  model.relations={pos_devices:'location',machines:'location'}
  
  return model
}
