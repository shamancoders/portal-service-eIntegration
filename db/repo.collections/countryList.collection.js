module.exports= function(conn){
    let schema = mongoose.Schema({
        name: {type:String, default: ""},
        code: {type:String, default: ""}
        
    })

    schema.pre('save',function(next){
    	next()
    	//bir seyler ters giderse 
    	// next(new Error('ters giden birseyler var'))
    })
    schema.pre('remove',function(next){
    	next()
    })

    schema.pre('remove', true, function (next, done) {
      	next()
    	//bir seyler ters giderse 
    	// next(new Error('ters giden birseyler var'))
    })

    schema.on('init', function (model) {

    })
    //schema.plugin(autoIncrement.plugin, { model: 'countryList', field: '_rowid'})
    return conn.model('countryList', schema)
}