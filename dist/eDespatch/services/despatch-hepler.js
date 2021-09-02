exports.gonderilecekIrsaliyeAlanlariniDuzenle=function(despatchDoc,xsltData){
	despatchDoc.despatchSupplierParty.party=clone(despatchDoc.eIntegrator.party)
	despatchDoc.sellerSupplierParty.party=clone(despatchDoc.eIntegrator.party)


	if(despatchDoc.deliveryCustomerParty.party['partyIdentification[0]']!=undefined){
		despatchDoc.deliveryCustomerParty.party['partyIdentification[0]']=undefined
		delete despatchDoc.deliveryCustomerParty.party['partyIdentification[0]']
	}
	if(despatchDoc.deliveryCustomerParty.party.postalAddress.country.identificationCode.value==''){
		despatchDoc.deliveryCustomerParty.party.postalAddress.country.identificationCode.value='TR'
	}
	despatchDoc.buyerCustomerParty.party=clone(despatchDoc.deliveryCustomerParty.party)


	despatchDoc.uuid.value=uuid.v4()

	if(xsltData){
		despatchDoc.additionalDocumentReference=[{
			ID:{value:uuid.v4()},
			issueDate:{value:despatchDoc.issueDate.value},
			documentType:{value:'xslt'},
			attachment:{
				embeddedDocumentBinaryObject:{
					attr:{
						filename:'tr216com.xslt',
						characterSetCode:'UTF-8',
						encodingCode:'Base64',
						mimeCode:'application/xml'
					},
					value:xsltData
				}
			}
		}]
	}

	despatchDoc.shipment={
		ID:{value:'1'},
		shipmentStage:despatchDoc.shipment.shipmentStage,
		delivery:{
			ID:{value:'1'},
			despatch:{
				actualDespatchDate:{value:despatchDoc.issueDate.value},
				actualDespatchTime:{value:despatchDoc.issueTime.value}
			},
			deliveryAddress:clone(despatchDoc.deliveryCustomerParty.party.postalAddress)
		}
	}

	if(despatchDoc.shipment.shipmentStage){
		if(despatchDoc.shipment.shipmentStage.length>0){
			if(despatchDoc.shipment.shipmentStage[0].transportMeans){
				if(despatchDoc.shipment.shipmentStage[0].transportMeans.roadTransport){
					if(despatchDoc.shipment.shipmentStage[0].transportMeans.roadTransport.licensePlateId){
						if(!despatchDoc.shipment.shipmentStage[0].transportMeans.roadTransport.licensePlateId.attr){
							despatchDoc.shipment.shipmentStage[0].transportMeans.roadTransport.licensePlateId.attr={
								schemeID:'PLAKA'
							}
						}
					}
				}
			}
		}
	}

	despatchDoc.despatchSupplierParty=partyTemizle(despatchDoc.despatchSupplierParty)
	despatchDoc.sellerSupplierParty=partyTemizle(despatchDoc.sellerSupplierParty)
	despatchDoc.deliveryCustomerParty=partyTemizle(despatchDoc.deliveryCustomerParty)
	despatchDoc.buyerCustomerParty=partyTemizle(despatchDoc.buyerCustomerParty)
	if(despatchDoc.originatorCustomerParty){
		if(despatchDoc.originatorCustomerParty.party){
			if(despatchDoc.originatorCustomerParty.party.partyName.name.value==''){
				despatchDoc.originatorCustomerParty=undefined
				delete despatchDoc.originatorCustomerParty
			}else{
				despatchDoc.originatorCustomerParty=partyTemizle(despatchDoc.originatorCustomerParty)
			}
		}
	}

	if(despatchDoc.ID.attr){
		delete despatchDoc.ID.attr
	}

	
	despatchDoc=despatchLineTemizle(despatchDoc)
	return despatchDoc
}

function despatchLineTemizle(doc){
	if(doc.despatchLine){
		doc.despatchLine.forEach((e)=>{
			if(e.item){
				//e.item._id=undefined
				delete e.item._id
			}
			if(e.deliveredQuantity){
				if(!e.outstandingQuantity){
					e.outstandingQuantity={
						value:0,
						attr:{
							unitCode:e.deliveredQuantity.attr.unitCode
						}
					}
				}
				if(!e.oversupplyQuantity){
					e.oversupplyQuantity={
						value:0,
						attr:{
							unitCode:e.deliveredQuantity.attr.unitCode
						}
					}
				}
			}
			
			if(!e.orderLineReference){
				e.orderLineReference={lineId:{value:''}}
			}
		})
	}

	return doc
}

function partyTemizle(partyMain){
	
	partyMain.party=partyPersonTemizle(partyMain.party)
	partyMain=partyContactTemizle(partyMain)


	return partyMain
}
function partyPersonTemizle(party){
	if(party.person){
		if(!party.person.firstName.value && !party.person.familyName.value){
			//party.person=undefined
			delete party.person
		}else{
			//party.person.financialAccount=undefined
			delete party.person.financialAccount

			//party.person.identityDocumentReference=undefined
			delete party.person.identityDocumentReference

			
		}
	}

	return party
}


function partyContactTemizle(partyMain){

	if(partyMain.despatchContact){
		if(partyMain.despatchContact.otherCommunication){
			if(partyMain.despatchContact.otherCommunication.length>0){
				if(partyMain.despatchContact.otherCommunication[0].value==''){
					
					//partyMain.despatchContact.otherCommunication=undefined
					delete partyMain.despatchContact.otherCommunication
				}
			}else{
				//partyMain.despatchContact.otherCommunication=undefined
				delete partyMain.despatchContact.otherCommunication
			}
		}

		if(partyMain.despatchContact.ID){
			if(partyMain.despatchContact.ID.value==''){
				//partyMain.despatchContact.ID=undefined
				delete partyMain.despatchContact.ID
			}
		}
		
	}

	if(partyMain.deliveryContact){
		if(partyMain.deliveryContact.otherCommunication){
			if(partyMain.deliveryContact.otherCommunication.length>0){
				if(partyMain.deliveryContact.otherCommunication[0].value==''){
					//partyMain.deliveryContact.otherCommunication=undefined
					delete partyMain.deliveryContact.otherCommunication
				}
			}else{
				//partyMain.deliveryContact.otherCommunication=undefined
				delete partyMain.deliveryContact.otherCommunication
			}
		}
		
		if(partyMain.deliveryContact.ID){
			if(partyMain.deliveryContact.ID.value==''){
				//partyMain.deliveryContact.ID=undefined
				delete partyMain.deliveryContact.ID
			}
		}
	}

	if(partyMain.party.contact){
		if(partyMain.party.contact.otherCommunication){
			if(partyMain.party.contact.otherCommunication.length>0){
				if(partyMain.party.contact.otherCommunication[0].value==''){
					
					//partyMain.party.contact.otherCommunication=undefined
					delete partyMain.party.contact.otherCommunication
				}
			}else{
				//partyMain.party.contact.otherCommunication=undefined
				delete partyMain.party.contact.otherCommunication
			}
		}
		if(partyMain.party.contact.ID){
			if(partyMain.party.contact.ID.value==''){
				//partyMain.party.contact.ID=undefined
				delete partyMain.party.contact.ID
			}
		}
	}
	
	if(partyMain.party.partyTaxScheme){
		if(partyMain.party.partyTaxScheme.taxScheme){
			if(partyMain.party.partyTaxScheme.taxScheme.taxTypeCode){
				if(partyMain.party.partyTaxScheme.taxScheme.taxTypeCode.value==''){
					//partyMain.party.partyTaxScheme.taxScheme.taxTypeCode=undefined
					delete partyMain.party.partyTaxScheme.taxScheme.taxTypeCode
				}
			}
		}
	}

	partyMain.party._id=undefined
	delete partyMain.party._id
	return partyMain
}