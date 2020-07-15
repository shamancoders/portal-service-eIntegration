module.exports=function(conn){
    var schema = mongoose.Schema({
        ioType :{ type: Number,default: 0}, // 0 - cikis , 1- giris
        eIntegrator: {type: mongoose.Schema.Types.ObjectId, ref: 'integrators', required: true},
        location: {type: mongoose.Schema.Types.ObjectId, ref: 'locations', default:null},
        subLocation: {type: mongoose.Schema.Types.ObjectId, ref: 'sub_locations', default:null},
        profileId: { 
            value: { type: String,default: '', trim:true, enum:['TEMELFATURA','TICARIFATURA','IHRACAT','YOLCUBERABERFATURA','EARSIVFATURA'], required: true}
        },
        ID: {
            value: { type: String, trim:true, default: '',
                validate: {
                  validator: function(v) {
                    if(this.ioType==0 && v!='' && v.length!=16){
                        return false;
                    }else{
                        return true;
                    }
                  },
                  message: 'Fatura numarasi 16 karakter olmalidir veya bos birakiniz.'
                }
            }
        },
        uuid: dbType.valueType,
        issueDate: {value :{ type: String,  required: [true,'Fatura tarihi gereklidir']}},
        issueTime: {value :{ type: String,default: '00:00:00.0000000+03:00'}},
        invoiceTypeCode: {
            value:{ type: String,default: '', trim:true, enum:['SATIS','IADE','TEVKIFAT','ISTISNA','OZELMATRAH','IHRACKAYITLI'],
                validate: {
                  validator: function(v) {
                    if(this.ioType==0 && (this.profileId=='IHRACAT' || this.profileId=='YOLCUBERABERFATURA') && v!='ISTISNA'){
                        return false;
                    }else{
                        return true;
                    }
                  },
                  message: 'Senaryo: IHRACAT veya YOLCUBERABERFATURA oldugunda fatura turu ISTISNA olarak secilmelidir.'
                }
            }
        },
        invoicePeriod: dbType.periodType,
        note:[dbType.valueType],
        documentCurrencyCode:dbType.valueType,
        taxCurrencyCode:dbType.valueType,
        pricingCurrencyCode:dbType.valueType,
        paymentCurrencyCode:dbType.valueType,
        paymentAlternativeCurrencyCode:dbType.valueType,
        lineCountNumeric:dbType.numberValueType,
        additionalDocumentReference:[dbType.documentReferenceType],
        orderReference:[dbType.orderReferenceType],
        despatchDocumentReference:[dbType.documentReferenceType],
        originatorDocumentReference:[dbType.documentReferenceType],
        accountingSupplierParty:{
            party:dbType.partyType,
            despatchContact:dbType.contactType
        },
        accountingCustomerParty:{
            party:dbType.partyType,
            deliveryContact:dbType.contactType
        },
        sellerSupplierParty:{
            party:dbType.partyType,
            despatchContact:dbType.contactType
        },
        buyerCustomerParty:{
            party:dbType.partyType,
            deliveryContact:dbType.contactType
        },
        accountingCost:dbType.valueType,
        delivery:[dbType.deliveryType],
        billingReference:[dbType.billingReferenceType],
        contractDocumentReference:[dbType.documentReferenceType],
        paymentTerms:dbType.paymentTermsType,
        paymentMeans:[dbType.paymentMeansType],
        taxExchangeRate:dbType.exchangeRateType,
        pricingExchangeRate:dbType.exchangeRateType,
        paymentExchangeRate:dbType.exchangeRateType,
        paymentAlternativeExchangeRate:dbType.exchangeRateType,
        taxTotal:[dbType.taxTotalType],
        withholdingTaxTotal:[dbType.taxTotalType],
        allowanceCharge:[dbType.allowanceChargeType],
        legalMonetaryTotal: { 
            lineExtensionAmount  :dbType.amountType,
            taxExclusiveAmount  : dbType.amountType,
            taxInclusiveAmount   : dbType.amountType,
            allowanceTotalAmount   : dbType.amountType,
            chargeTotalAmount : dbType.amountType,
            payableRoundingAmount : dbType.amountType,
            payableAmount :dbType.amountType
        },
        invoiceLine:[dbType.invoiceLineType],
        pdf:{type: mongoose.Schema.Types.ObjectId, ref: 'files' , default:null},
        html:{type: mongoose.Schema.Types.ObjectId, ref: 'files' , default:null},
        localDocumentId: {type: String, default: ''},
        invoiceStatus: {type: String, default: 'Draft',enum:['Draft','Pending','Queued', 'Processing','SentToGib','Approved','Declined','WaitingForApprovement','Error']},
        invoiceErrors:[{_date:{ type: Date,default: Date.now}, code:'',message:''}],
        localStatus: {type: String, default: '',enum:['','transferring','pending','transferred','error']},
        localErrors:[{_date:{ type: Date,default: Date.now}, code:'',message:''}],
        createdDate: { type: Date,default: Date.now},
        modifiedDate:{ type: Date,default: Date.now}
    });

    

    schema.pre('save', function(next) {
        if(this.invoiceLine){
            this.lineCountNumeric.value=this.invoiceLine.length;
        }
               
        next();
        //bir seyler ters giderse 
        // next(new Error('ters giden birseyler var'));
        
    });
    schema.pre('remove', function(next) {
        next();
    });

    schema.pre('remove', true, function(next, done) {
        next();
        //bir seyler ters giderse 
        // next(new Error('ters giden birseyler var'));
    });

    schema.on('init', function(model) {

    });
    

    schema.plugin(mongoosePaginate);
    schema.plugin(mongooseAggregatePaginate);
    
    schema.index({
        "ioType":1,
        "ID.value":1,
        "issueDate.value":1,
        "uuid.value":1,
        "eIntegrator":1,
        "profileId.value":1,
        "invoiceTypeCode.value":1,
        "documentCurrencyCode.value":1,
        "localDocumentId":1,
        "invoiceStatus":1,
        "localStatus":1,
        "createdDate":1
    });


    var collectionName='invoices';
    var model=conn.model(collectionName, schema);
    
    model.removeOne=(member, filter,cb)=>{ sendToTrash(conn,collectionName,member,filter,cb); }
    
    return model;
}
