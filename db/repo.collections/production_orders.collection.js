module.exports=function(dbModel){
    let schema = mongoose.Schema({
        item: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
        //qwerty renkler, desenler, bedenler, her varyasyon icin subQuantity dusunulebilir
        sourceRecipe: {type: mongoose.Schema.Types.ObjectId, ref: 'recipes', mdl:dbModel['recipes'], default:null},
        productionId:{type: String, trim:true, default: ''},
        productionTypeCode: { type: String,default: '', trim:true, enum:['MUSTERI','DEPO'] },
        issueDate: { type: String,  required: [true,'İş Emri tarihi gereklidir']},
        issueTime: { type: String,default: '00:00:00.0000000+03:00'},
        plannedPeriod: {
            startDate: { type: String, trim:true, default: ''},
            startTime: { type: String, trim:true, default: ''},
            endDate: { type: String, trim:true, default: ''},
            endTime: { type: String, trim:true, default: ''}
        },
        producedPeriod: {
            startDate: { type: String, trim:true, default: ''},
            startTime: { type: String, trim:true, default: ''},
            endDate: { type: String, trim:true, default: ''},
            endTime: { type: String, trim:true, default: ''}
        },
        plannedQuantity:{ type: Number, default: 0},
        producedQuantity:{ type: Number, default: 0},
        unitCode:{type: String, trim:true, default: ''},
        orderLineReference:[
            {
                lineId:dbType.idType,
                item:dbType.itemType,
                orderedQuantity:dbType.quantityType,
                producedQuantity:dbType.quantityType,
                deliveredQuantity:dbType.quantityType,
                orderReference:{
                    order:{type: mongoose.Schema.Types.ObjectId, ref: 'orders', mdl:dbModel['orders'], default:null},
                    ID:dbType.idType,
                    issueDate:dbType.valueType,
                    orderTypeCode:dbType.valueType,
                    salesOrderId:dbType.idType,
                    buyerCustomerParty:{
                        party:dbType.partyType,
                        deliveryContact:dbType.contactType,
                        accountingContact:dbType.contactType,
                        buyerContact:dbType.contactType
                    }
                }
            }
        ],
        description:{ type: String, trim:true, default: ''},
        process:[{
            sequence:{ type: Number, default: 0},
            station: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_stations', mdl:dbModel['mrp_stations']},
            step: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_process_steps', mdl:dbModel['mrp_process_steps']},
            machines: [ {
                machine:{type: mongoose.Schema.Types.ObjectId, ref: 'mrp_machines', mdl:dbModel['mrp_machines'], default:null},
                mold:{type: mongoose.Schema.Types.ObjectId, ref: 'mrp_molds', mdl:dbModel['mrp_molds'], default:null},
                cycle:dbType.measureType,
                cavity:{ type: Number, default: 0},
                quantityPerHour:{ type: Number, default: 0},
                parameters:{type:Object,default:null}
            }],
            input: [{
                item:{type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
                //qwerty buraya renk desen beden gelecek
                quantity:{ type: Number, default: 0},
                unitCode:{type: String, trim:true, default: ''},
                percent:{ type: Number, default: 0}
            }],
            output: [{  //yan urunler
                item:{type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
                //qwerty buraya renk desen beden gelecek
                quantity:{ type: Number, default: 0},
                unitCode:{type: String, trim:true, default: ''},
                percent:{ type: Number, default: 0}
            }],
            parameters:{type: String, trim:true, default: ''}
        }],
        materialSummary:[{
            item: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
            //qwerty buraya renk desen beden gelecek
            quantity:{ type: Number, default: 0},
            unitCode:{type: String, trim:true, default: ''},
            percent:{ type: Number, default: 0}
        }],
        outputSummary:[{
            item: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
            //qwerty buraya renk desen beden gelecek
            quantity:{ type: Number, default: 0},
            unitCode:{type: String, trim:true, default: ''},
            percent:{ type: Number, default: 0}
        }],
        qualityControl:[{
            param:{type: String, trim:true, default: ''},
            value:{type: String, trim:true, default: ''}
        }],
        totalWeight:{ type: Number, default: 0},
        finishNotes:{type: String, default: ''},
        packingOption:{
            palletType:{type: mongoose.Schema.Types.ObjectId, ref: 'pallet_types', mdl:dbModel['pallet_types'],default:null},
            packingType:{type: mongoose.Schema.Types.ObjectId, ref: 'packing_types', mdl:dbModel['packing_types'],default:null},
            quantityInPacking:{ type: Number, default: 0},
            palletRowCount:{ type: Number, default: 0},
            packingCountInRow:{ type: Number, default: 0},
            unitCode:{type: String, trim:true, default: ''},
            packingType2:{type: mongoose.Schema.Types.ObjectId, ref: 'packing_types', mdl:dbModel['packing_types'],default:null},
            packingType3:{type: mongoose.Schema.Types.ObjectId, ref: 'packing_types', mdl:dbModel['packing_types'],default:null}
        },
        totalPallet:{ type: Number, default: 0},
        totalPacking:{ type: Number, default: 0},
        staffCount:{ type: Number, default: 0},
        status: {type: String, default: 'Draft',enum:['Draft', 'Approved', 'Declined', 'Processing', 'Cancelled','Completed','Error']},
        createdDate: { type: Date,default: Date.now},
        modifiedDate:{ type: Date,default: Date.now},
        cancelled: {type: Boolean, default: false}
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
 
    schema.index({
        "item":1,
        "sourceRecipe":1,
        "productionNumber":1,
        "description":1,
        "createdDate":1
    })


    let collectionName='production_orders'
    let model=dbModel.conn.model(collectionName, schema)
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel.conn,collectionName,member,filter,cb) }
    
    model.relations={inventory_fiches:'productionOrderId'}
    return model
}
