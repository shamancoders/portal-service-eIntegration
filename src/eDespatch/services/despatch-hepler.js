exports.gonderilecekIrsaliyeAlanlariniDuzenle = function(despatchDoc, xsltData) {
	despatchDoc.despatchSupplierParty.party = clone(despatchDoc.eIntegrator.party)
	despatchDoc.sellerSupplierParty.party = clone(despatchDoc.eIntegrator.party)


	if(despatchDoc.deliveryCustomerParty.party['partyIdentification[0]'] != undefined) {
		despatchDoc.deliveryCustomerParty.party['partyIdentification[0]'] = undefined
		delete despatchDoc.deliveryCustomerParty.party['partyIdentification[0]']
	}
	if(despatchDoc.deliveryCustomerParty.party.postalAddress.country.identificationCode.value == '') {
		despatchDoc.deliveryCustomerParty.party.postalAddress.country.identificationCode.value = 'TR'
	}
	despatchDoc.buyerCustomerParty.party = clone(despatchDoc.deliveryCustomerParty.party)


	despatchDoc.uuid.value = uuid.v4()

	if(xsltData) {
		// tempLog('xsltData.xslt',xsltData)
		despatchDoc.additionalDocumentReference = [{
			// ID: { value: uuid.v4() },
			ID: { value: '9026a79e-e9c1-412d-ac0a-eeeeddddccbb' },
			issueDate: { value: despatchDoc.issueDate.value },
			documentType: { value: 'Xslt' },
			// documentTypeCode: { value: 'XSLT' },
			attachment: {
				embeddedDocumentBinaryObject: {
					attr: {
						filename: `${despatchDoc.ID.value}.xslt`,
						characterSetCode: 'UTF-8',
						encodingCode: 'Base64',
						mimeCode: 'application/xml'
					},
					value: xsltData
				}
			}
		}]
	}

	despatchDoc.shipment = {
		ID: { value: '1' },
		shipmentStage: despatchDoc.shipment.shipmentStage,
		delivery: {
			ID: { value: '1' },
			despatch: {
				actualDespatchDate: { value: despatchDoc.issueDate.value },
				actualDespatchTime: { value: despatchDoc.issueTime.value }
			},
			deliveryAddress: clone(despatchDoc.deliveryCustomerParty.party.postalAddress)
		}
	}

	if(despatchDoc.shipment.shipmentStage) {
		if(despatchDoc.shipment.shipmentStage.length > 0) {
			if(despatchDoc.shipment.shipmentStage[0].transportMeans) {
				if(despatchDoc.shipment.shipmentStage[0].transportMeans.roadTransport) {
					if(despatchDoc.shipment.shipmentStage[0].transportMeans.roadTransport.licensePlateId) {
						if(!despatchDoc.shipment.shipmentStage[0].transportMeans.roadTransport.licensePlateId.attr) {
							despatchDoc.shipment.shipmentStage[0].transportMeans.roadTransport.licensePlateId.attr = {
								schemeID: 'PLAKA'
							}
						}
					}
				}
			}
		}
	}

	despatchDoc.despatchSupplierParty = partyTemizle(despatchDoc.despatchSupplierParty)
	despatchDoc.sellerSupplierParty = partyTemizle(despatchDoc.sellerSupplierParty)
	despatchDoc.deliveryCustomerParty = partyTemizle(despatchDoc.deliveryCustomerParty)
	despatchDoc.buyerCustomerParty = partyTemizle(despatchDoc.buyerCustomerParty)
	if(despatchDoc.originatorCustomerParty) {
		if(despatchDoc.originatorCustomerParty.party) {
			if(despatchDoc.originatorCustomerParty.party.partyName.name.value == '') {
				despatchDoc.originatorCustomerParty = undefined
				delete despatchDoc.originatorCustomerParty
			} else {
				despatchDoc.originatorCustomerParty = partyTemizle(despatchDoc.originatorCustomerParty)
			}
		}
	}

	despatchDoc.ID = util.deleteObjectProperty(despatchDoc.ID, 'attr')
	despatchDoc = util.deleteObjectProperty(despatchDoc, 'eIntegrator')
	despatchDoc = util.deleteObjectProperty(despatchDoc, 'localStatus')
	despatchDoc = util.deleteObjectProperty(despatchDoc, 'despatchStatus')
//	despatchDoc = util.deleteObjectProperty(despatchDoc, 'localDocumentId')
	despatchDoc = util.deleteObjectProperty(despatchDoc, 'ioType')
	despatchDoc = util.deleteObjectProperty(despatchDoc, 'location')
	despatchDoc = util.deleteObjectProperty(despatchDoc, 'location2')
	despatchDoc = util.deleteObjectProperty(despatchDoc, 'despatchErrors')
	despatchDoc = util.deleteObjectProperty(despatchDoc, 'localErrors')
	despatchDoc = util.deleteObjectProperty(despatchDoc, 'createdDate')
	despatchDoc = util.deleteObjectProperty(despatchDoc, 'modifiedDate')
	despatchDoc = util.deleteObjectProperty(despatchDoc, '__v')
	despatchDoc = util.deleteObjectProperty(despatchDoc, '_id')
	despatchDoc = util.deleteObjectProperty(despatchDoc, 'despatchPeriod')
	despatchDoc = util.deleteObjectProperty(despatchDoc, 'originatorDocumentReference')


	despatchDoc = despatchLineTemizle(despatchDoc)

	despatchDoc.CopyIndicator=false
	despatchDoc.UBLVersionID='2.1'
	despatchDoc.CustomizationID='TR1.2.1'
	

	//despatchDoc = despatchAdviceTypeSiralama(despatchDoc)

	despatchDoc.attr = {
		'xmlns:cbc': "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
		'xmlns:cac': "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
		'xmlns:ds': "http://www.w3.org/2000/09/xmldsig#",
		'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
		'xmlns:ext': "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
		'xmlns:xades': "http://uri.etsi.org/01903/v1.3.2#",
		'xmlns': "urn:oasis:names:specification:ubl:schema:xsd:DespatchAdvice-2",
		' xsi:schemaLocation': "urn:oasis:names:specification:ubl:schema:xsd:DespatchAdvice-2 UBL-DespatchAdvice-2.1.xsd"
	}

	let despatchInfo = {
		attr: {
			LocalDocumentId: despatchDoc.localDocumentId,
			ExtraInformation: ''
		},
		DespatchAdvice: util.renameObjectProperty(despatchDoc, renameKey),
		':NotificationInformation': {
			':MailingInformation': [],
			':SmsMessageInformation': []
		},
		':TargetCustomer': {
			attr: {
				Title: '',
				VknTckn: '',
				Alias: ''
			}
		}
	}


	return despatchInfo
}

function despatchAdviceTypeSiralama(doc) {
	let doc2 = {
		':UBLExtensions': '',
		':UBLVersionID': '2.1',
		':CustomizationID': 'TR1.2.1',
		':ProfileID': doc[':ProfileID'] || '',
		':ID': doc[':ID'] || '',
		':CopyIndicator': false,
		':UUID': doc[':UUID'] || '',
		':IssueDate': doc[':IssueDate'] || '',
		':IssueTime': doc[':IssueTime'] || '',
		':DespatchAdviceTypeCode': doc[':DespatchAdviceTypeCode'] || '',
		':Note': doc[':Note'] || [],
		':LineCountNumeric': doc[':LineCountNumeric'] || 0,
		':OrderReference': doc[':OrderReference'] || [],
		':AdditionalDocumentReference': doc[':AdditionalDocumentReference'] || [],
		':Signature': doc[':Signature'] || null,
		':DespatchSupplierParty': doc[':DespatchSupplierParty'] || {},
		':DeliveryCustomerParty': doc[':DeliveryCustomerParty'] || {},
		':BuyerCustomerParty': doc[':BuyerCustomerParty'] || {},
		':SellerSupplierParty': doc[':SellerSupplierParty'] || {},
		':OriginatorCustomerParty': doc[':OriginatorCustomerParty'] || {},
		':Shipment': doc[':Shipment'] || {},
		':DespatchLine': doc[':DespatchLine'] || [],
	}

	return doc2
}


function renameKey(key, obj, parentObj) {

	if(key.indexOf(':') > -1)
		return key

	if(key.startsWith('UBLExtension'))
		return 'ext:' + key

	switch (key) {
		case 'ID':
			return 'cbc:ID'
		case 'uuid':
			return 'cbc:UUID'
		case 'note':
			return 'cbc:Note'
		case 'URI':	return 'cbc:URI'
		case 'CopyIndicator':	return 'cbc:CopyIndicator'
		case 'UBLVersionID':	return 'cbc:UBLVersionID'
		case 'CustomizationID':	return 'cbc:CustomizationID'

		case 'schemeID':
		case 'unitCode':
		case 'mimeCode':
		case 'filename':
		case 'encodingCode':
		case 'characterSetCode':
		case 'value':
		case 'attr':
			return key
	}
	if(key.length >= 2) {
		key = key[0].toUpperCase() + key.substr(1, key.length - 1)
		if(key.substr(key.length - 2, 2) == 'Id' && key.length > 2) {
			key = key.substr(0, key.length - 2) + 'ID'
		}
	}


	if(obj == null) {
		key = 'cbc:' + key
	} else if(obj != undefined) {
		if(Array.isArray(obj)) {
			key = 'cac:' + key
		} else if(typeof obj === 'object') {
			if(obj.value != undefined) {
				key = 'cbc:' + key
			} else if(obj.getFullYear != undefined) {
				key = 'cbc:' + key
			} else {
				key = 'cac:' + key
			}
		}
	}
	return key
}

function renameObjectProperty(obj, renameFunction, exeptions=['attr','value']) {
	if(obj == null)
		return obj
	if(Array.isArray(obj)) {
		let newObj = []
		obj.forEach((e)=>{
			newObj.push(renameObjectProperty(e, renameFunction))
		})
		
		return newObj
	} else if(typeof obj === 'object') {
		if(obj.getFullYear == undefined) {
			let newObj = {}
			let keys = Object.keys(obj)
			keys.forEach((key) => {
				if(exeptions.includes(key) == false) {
					let newKey = renameFunction(key, obj[key], obj)
					if(Array.isArray(obj[key]) || typeof obj[key] === 'object') {
						newObj[newKey] = renameObjectProperty(obj[key], renameFunction)
					} else {
						newObj[newKey] = obj[key]
					}
				}else{
					newObj[key] = obj[key]
				}
			})
			return newObj
		} else {
			return obj
		}
	} else {
		return obj
	}
}

function renameKey111(key, obj) {

	if(key.indexOf(':') > -1)
		return key

	// if(key.startsWith('UBL')) return 'ext:' + key
	//if(key.startsWith('UBL')) return key

	switch (key) {
		case 'ID':
			return ':ID'
		case 'uuid':
			return ':UUID'

		case 'URI':
			return ':URI'
		case 'schemeID':
			return 'schemeID'
		case 'value':
			return 'value'
		case 'attr':
			return 'attr'
	}
	if(key.length >= 2) {
		key = key[0].toUpperCase() + key.substr(1, key.length - 1)
		if(key.substr(key.length - 2, 2) == 'Id' && key.length > 2) {
			key = key.substr(0, key.length - 2) + 'ID'
		}
	}


	if(obj == null) {
		key = ':' + key
	} else if(obj != undefined) {
		if(Array.isArray(obj)) {
			key = ':' + key
		} else if(typeof obj === 'object') {
			if(obj.value != undefined) {
				key = ':' + key
			} else if(obj.getFullYear != undefined) {
				key = ':' + key
			} else {
				key = ':' + key
			}
		}
	}
	return key
}

function despatchLineTemizle(doc) {
	if(doc.despatchLine) {
		doc.despatchLine.forEach((e) => {
			if(e.item) {
				//e.item._id=undefined
				delete e.item._id
			}
			if(e.deliveredQuantity) {
				if(!e.outstandingQuantity) {
					e.outstandingQuantity = {
						value: 0,
						attr: {
							unitCode: e.deliveredQuantity.attr.unitCode
						}
					}
				}
				if(!e.oversupplyQuantity) {
					e.oversupplyQuantity = {
						value: 0,
						attr: {
							unitCode: e.deliveredQuantity.attr.unitCode
						}
					}
				}
			}

			if(!e.orderLineReference) {
				e.orderLineReference = { lineId: { value: '' } }
			}
		})
	}

	return doc
}

function partyTemizle(partyMain) {

	partyMain.party = partyPersonTemizle(partyMain.party)
	partyMain = partyContactTemizle(partyMain)


	return partyMain
}

function partyPersonTemizle(party) {
	if(party.person) {
		if(!party.person.firstName.value && !party.person.familyName.value) {
			//party.person=undefined
			delete party.person
		} else {
			//party.person.financialAccount=undefined
			delete party.person.financialAccount

			//party.person.identityDocumentReference=undefined
			delete party.person.identityDocumentReference


		}
	}

	return party
}


function partyContactTemizle(partyMain) {

	if(partyMain.despatchContact) {
		if(partyMain.despatchContact.otherCommunication) {
			if(partyMain.despatchContact.otherCommunication.length > 0) {
				if(partyMain.despatchContact.otherCommunication[0].value == '') {

					//partyMain.despatchContact.otherCommunication=undefined
					delete partyMain.despatchContact.otherCommunication
				}
			} else {
				//partyMain.despatchContact.otherCommunication=undefined
				delete partyMain.despatchContact.otherCommunication
			}
		}

		if(partyMain.despatchContact.ID) {
			if(partyMain.despatchContact.ID.value == '') {
				//partyMain.despatchContact.ID=undefined
				delete partyMain.despatchContact.ID
			}
		}

	}

	if(partyMain.deliveryContact) {
		if(partyMain.deliveryContact.otherCommunication) {
			if(partyMain.deliveryContact.otherCommunication.length > 0) {
				if(partyMain.deliveryContact.otherCommunication[0].value == '') {
					//partyMain.deliveryContact.otherCommunication=undefined
					delete partyMain.deliveryContact.otherCommunication
				}
			} else {
				//partyMain.deliveryContact.otherCommunication=undefined
				delete partyMain.deliveryContact.otherCommunication
			}
		}

		if(partyMain.deliveryContact.ID) {
			if(partyMain.deliveryContact.ID.value == '') {
				//partyMain.deliveryContact.ID=undefined
				delete partyMain.deliveryContact.ID
			}
		}
	}

	if(partyMain.party.contact) {
		if(partyMain.party.contact.otherCommunication) {
			if(partyMain.party.contact.otherCommunication.length > 0) {
				if(partyMain.party.contact.otherCommunication[0].value == '') {

					//partyMain.party.contact.otherCommunication=undefined
					delete partyMain.party.contact.otherCommunication
				}
			} else {
				//partyMain.party.contact.otherCommunication=undefined
				delete partyMain.party.contact.otherCommunication
			}
		}
		if(partyMain.party.contact.ID) {
			if(partyMain.party.contact.ID.value == '') {
				//partyMain.party.contact.ID=undefined
				delete partyMain.party.contact.ID
			}
		}
	}

	if(partyMain.party.partyTaxScheme) {
		if(partyMain.party.partyTaxScheme.taxScheme) {
			if(partyMain.party.partyTaxScheme.taxScheme.taxTypeCode) {
				if(partyMain.party.partyTaxScheme.taxScheme.taxTypeCode.value == '') {
					//partyMain.party.partyTaxScheme.taxScheme.taxTypeCode=undefined
					delete partyMain.party.partyTaxScheme.taxScheme.taxTypeCode
				}
			}
		}
	}

	partyMain.party._id = undefined
	delete partyMain.party._id
	return partyMain
}