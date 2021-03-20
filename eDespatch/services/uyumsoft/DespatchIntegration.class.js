class DespatchIntegration {
	constructor(url,username,password){
		this.client=new WcfHelper(url,username,password,'IDespatchIntegration')
	}

	/* string[] despatchesIds */
	CloneDespatches(despatchesIds, callback) { 
		this.run('CloneDespatches',{despatchesIds:despatchesIds}, callback)
	}

	/* InboxDespatchQueryModel query */
	GetInboxDespatchesData(query, callback) { 
		this.run('GetInboxDespatchesData',{query:query}, callback)
	}

	/* string despatchId */
	GetInboxDespatchPdf(despatchId, callback) { 
		this.run('GetInboxDespatchPdf',{despatchId:despatchId}, callback)
	}

	/* OutboxDespatchQueryModel query */
	GetOutboxDespatchesData(query, callback) { 
		this.run('GetOutboxDespatchesData',{query:query}, callback)
	}

	/* string despatchId */
	GetOutboxDespatchPdf(despatchId, callback) { 
		this.run('GetOutboxDespatchPdf',{despatchId:despatchId}, callback)
	}

	/* InboxDespatchQueryModel query */
	GetInboxDespatches(query, callback) { 
		this.run('GetInboxDespatches',{query:query}, callback)
	}

	/* OutboxDespatchQueryModel query */
	GetOutboxDespatches(query, callback) { 
		this.run('GetOutboxDespatches',{query:query}, callback)
	}

	/* BinaryRequestData data */
	CompressedSaveAsDraft(data, callback) { 
		this.run('CompressedSaveAsDraft',{data:data}, callback)
	}

	/* BinaryRequestData data */
	CompressedSendDespatch(data, callback) { 
		this.run('CompressedSendDespatch',{data:data}, callback)
	}

	/* DespatchInfo[] despatches */
	SaveAsDraft(despatches, callback) { 
		this.run('SaveAsDraft',{despatches:despatches}, callback)
	}

	/* DespatchInfo[] despatches */
	SendDespatch(despatches, callback) { 
		this.run('SendDespatch',{despatches:despatches}, callback)
	}

	/* string despatchId */
	GetInboxDespatch(despatchId, callback) { 
		this.run('GetInboxDespatch',{despatchId:despatchId}, callback)
	}

	/* string despatchId */
	GetOutboxDespatch(despatchId, callback) { 
		this.run('GetOutboxDespatch',{despatchId:despatchId}, callback)
	}

	/* string[] despatchIds */
	QueryInboxDespatchStatus(despatchIds, callback) { 
		this.run('QueryInboxDespatchStatus',{despatchIds:despatchIds}, callback)
	}

	/* string[] despatchIds */
	QueryOutboxDespatchStatus(despatchIds, callback) { 
		this.run('QueryOutboxDespatchStatus',{despatchIds:despatchIds}, callback)
	}

	/* string[] despatchIds */
	GetInboxDespatchStatusWithLogs(despatchIds, callback) { 
		this.run('GetInboxDespatchStatusWithLogs',{despatchIds:despatchIds}, callback)
	}

	/* string[] despatchIds */
	GetOutboxDespatchStatusWithLogs(despatchIds, callback) { 
		this.run('GetOutboxDespatchStatusWithLogs',{despatchIds:despatchIds}, callback)
	}

	/* string despatchId */
	GetInboxDespatchView(despatchId, callback) { 
		this.run('GetInboxDespatchView',{despatchId:despatchId}, callback)
	}

	/* string despatchId */
	GetOutboxDespatchView(despatchId, callback) { 
		this.run('GetOutboxDespatchView',{despatchId:despatchId},callback)
	}

	/* ReceiptAdviceViewContext receiptAdviceViewContext */
	GetReceiptAdviceView(receiptAdviceViewContext, callback) { 
		this.run('GetReceiptAdviceView',{receiptAdviceViewContext:receiptAdviceViewContext}, callback)
	}

	/* string[] despatchIds */
	CancelDraft(despatchIds, callback) { 
		this.run('CancelDraft',{despatchIds:despatchIds}, callback)
	}

	/* string[] despatchesId, bool isInbox, bool isArchived */
	ChangeDespatchArchiveStatus(despatchesId, isInbox, isArchived, callback) { 
		this.run('ChangeDespatchArchiveStatus',{despatchesId:despatchesId,isInbox:isInbox,isArchived:isArchived}, callback)
	}

	/* string vknTckn, string alias */
	IsEDespatchUser(vknTckn, alias, callback) { 
		this.run('IsEDespatchUser',{vknTckn:vknTckn,alias:alias}, callback)
	}

	/* ReceiptAdviceInfo[] receiptAdvices */
	SaveReceiptAdviceAsDraft(receiptAdvices, callback) { 
		this.run('SaveReceiptAdviceAsDraft',{receiptAdvices:receiptAdvices}, callback)
	}

	/* string[] despatchIds */
	SendDraft(despatchIds, callback) { 
		this.run('SendDraft',{despatchIds:despatchIds}, callback)
	}

	/* ReceiptAdviceInfo[] receiptAdvices */
	SendReceiptAdvice(receiptAdvices, callback) { 
		this.run('SendReceiptAdvice',{receiptAdvices:receiptAdvices}, callback)
	}

	/* string[] despatchIds */
	SetDespatchesTaken(despatchIds, callback) { 
		this.run('SetDespatchesTaken',{despatchIds:despatchIds}, callback)
	}

	/* string[] despatchIds */
	SetDespatchReceiptAdvicesTaken(despatchIds, callback) { 
		this.run('SetDespatchReceiptAdvicesTaken',{despatchIds:despatchIds}, callback)
	}

	/* string[] receiptAdviceDocumentIds */
	SetReceiptAdvicesTaken(receiptAdviceDocumentIds, callback) { 
		this.run('SetReceiptAdvicesTaken',{receiptAdviceDocumentIds:receiptAdviceDocumentIds}, callback)
	}

	/* InboxDespatchListQueryModel query */
	GetInboxDespatchList(query, callback) { 
		this.run('GetInboxDespatchList',{query:query}, callback)
	}

	/* InboxReceiptAdviceListQueryModel query */
	GetInboxReceiptAdvicesList(query, callback) { 
		this.run('GetInboxReceiptAdvicesList',{query:query}, callback)
	}

	/* InboxReceiptAdviceQueryModel query */
	GetInboxReceiptAdvices(query, callback) { 
		this.run('GetInboxReceiptAdvices',{query:query}, callback)
	}

	/* OutboxDespatchListQueryModel query */
	GetOutboxDespatchList(query, callback) { 
		this.run('GetOutboxDespatchList',{query:query}, callback)
	}

	/* ReceiptAdviceViewContext receiptAdviceViewContext */
	GetReceiptAdvicePdf(receiptAdviceViewContext, callback) { 
		this.run('GetReceiptAdvicePdf',{receiptAdviceViewContext:receiptAdviceViewContext}, callback)
	}

	/* ReceiptAdviceTypeInfo[] receiptAdvices */
	SaveReceiptAdviceUblAsDraft(receiptAdvices, callback) { 
		this.run('SaveReceiptAdviceUblAsDraft',{receiptAdvices:receiptAdvices}, callback)
	}

	/* ReceiptAdviceTypeInfo[] receiptAdvices */
	SendReceiptAdviceUbl(receiptAdvices, callback) { 
		this.run('SendReceiptAdviceUbl',{receiptAdvices:receiptAdvices}, callback)
	}

	/* string[] despatchId */
	QueryReceiptAdviceStatus(despatchId, callback) { 
		this.run('QueryReceiptAdviceStatus',{despatchId:despatchId},callback)
	}

	/* string[] despatchIds */
	RetrySendDespatches(despatchIds, callback) { 
		this.run('RetrySendDespatches',{despatchIds:despatchIds},callback)
	}


	/* SystemUserFilterContext context */
	FilterEDespatchUsers(context, callback) {
		this.run('FilterEDespatchUsers',{context:context}, callback)
	}

	/* PagedQueryContext pagination:{pageIndex:0,pageSize:300} */
	GetEDespatchUsers(pagination, callback) { 
		this.run('GetEDespatchUsers',{pagination:pagination}, callback)
	}
	
	/* string vknTckn */
	GetUserAliasses(vknTckn, callback) { 
		this.run('GetUserAliasses',{vknTckn:vknTckn}, callback)
	}

	isSucceed(data,callback){
		if(data.attr){
			if(data.attr.isSucceded!=undefined){
				if(data.attr.isSucceded==false){
					return callback({code:'WCF_ERROR',message:(data.attr.message || 'WCF bilinmeyen hata.')})
				}
			}
		}
		callback(null,data)
	}

	run(funcName,parameters,callback){
		this.client.send(funcName,parameters,(err,data)=>{
			if(!err){
				var obj=util.renameInvoiceObjects(data[`${funcName}Response`][`${funcName}Result`],util.renameKey)
				this.isSucceed(obj,callback)
			}else{
				callback(err)
			}
		})
	}

}

class PagedQueryContext {
	PageIndex=0
	PageSize=0
}

class DespatchListQueryModel extends PagedQueryContext {
	ExecutionStartDate
	ExecutionEndDate
	ActualDespatchStartDate
	ActualDespatchEndDate
	CreateStartDate
	CreateEndDate
	Statuses=[]
	DespatchIds=[]
	DespatchNumbers=[]
}

class InboxDespatchListQueryModel extends DespatchListQueryModel {
	OnlyNewestDespatches=false
}

class OutboxDespatchListQueryModel extends DespatchListQueryModel {
	IsOnlyNewReceiptAdvice=false
	ReceiptAdviceStartDate
	ReceiptAdviceEndDate
}

class InboxReceiptAdviceListQueryModel extends PagedQueryContext {
	IssueDateStart
	IssueDateEnd
	CreateDateStart
	CreateDateEnd
	DocumentIds=[]
	DespatchDocumentIds=[]
	DespatchNumbers=[]
	OnlyNewestReceiptAdvices=false
}

class OutboxDespatchQueryModel extends DespatchListQueryModel {
	ReceiptAdviceStartDate
	ReceiptAdviceEndDate
	IsOnlyNewReceiptAdviceTaken=false
}

class FilterablePagedQueryContext extends PagedQueryContext {
	Filter=''
}

class SystemUserFilterContext extends FilterablePagedQueryContext {
	SystemCreateDateBegin
	SystemCreateDateEnd
	FirstCreateDateBegin
	FirstCreateDateEnd
}

class ReceiptAdviceViewContext {
	ReceiptAdviceId=''
	DespatchId=''
	IsInboxDespatch=false
	UseDefaultXslt=true
	ifExceptionUseDefaultXslt=true
}

class DespatchInfo {
	constructor(DespatchAdvice){
		this.DespatchAdvice=DespatchAdvice
		
	}
	
	
	NotificationInformation=new NotificationInformation()
	LocalDocumentId=''
	ExtraInformation=''
	TargetCustomer={
		Title:'',VknTckn:'',Alias:''
	}
	generateXml(){
		
		var xmlData=util.e_despatch2xml(this.DespatchAdvice,'DespatchAdvice')
		xmlData=xmlData.replace('<DespatchAdvice','<q1:DespatchAdvice');
		xmlData=xmlData.replace('</DespatchAdvice','</q1:DespatchAdvice');
		
		var xmlDataInfo=`<s:DespatchInfo LocalDocumentId="${this.LocalDocumentId}" ExtraInformation="${this.ExtraInformation}">
		<s:TargetCustomer Title="${this.TargetCustomer.Title}" VknTckn="${this.TargetCustomer.VknTckn}" Alias="${this.TargetCustomer.Alias}" />
		${xmlData}
		<s:NotificationInformation>
		<s:MailingInformation EnableNotification="true" To="alitek@gmail.com" BodyXsltIdentifier="" EmailAccountIdentifier="">
		<s:Subject>tr216 eirsaliye</s:Subject>
		</s:MailingInformation>
		</s:NotificationInformation>
		</s:DespatchInfo>`
		
		return xmlDataInfo
	}
}

class ReceiptAdviceTypeInfo {
	constructor(ReceiptAdvice){

		this.ReceiptAdvice=ReceiptAdvice
		
	}
	
	LocalDocumentId=''
	TargetCustomer={
		Title:'',VknTckn:'',Alias:''
	}

	generateXml(){
		
		var xmlData=util.e_receiptAdvice2xml(this.ReceiptAdvice,'ReceiptAdvice')
		xmlData=xmlData.replace('<ReceiptAdvice','<q2:ReceiptAdvice');
		xmlData=xmlData.replace('</ReceiptAdvice','</q2:ReceiptAdvice');
		
		var xmlDataInfo=`<s:ReceiptAdviceTypeInfo LocalDocumentId="${this.LocalDocumentId}" >
		<s:TargetCustomer Title="${this.TargetCustomer.Title}" VknTckn="${this.TargetCustomer.VknTckn}" Alias="${this.TargetCustomer.Alias}" />
		${xmlData}

		</s:ReceiptAdviceTypeInfo>`
		return xmlDataInfo
	}

}

class CustomerInfo {
	VknTckn=''
	Alias=''
	Title=''
}

class NotificationInformation {
	MailingInformation=[]
	SmsMessageInformation=[]
}

class MailingInformation {
	Subject=''
	EnableNotification=true
	Attachment= new MailAttachmentInformation()
	To=''
	BodyXsltIdentifier=''
	EmailAccountIdentifier=''

}

class MailAttachmentInformation {
	Xml=false
	Pdf=true
	Html=false
	AdditionalDocuments=true
}

module.exports={
	DespatchIntegration:DespatchIntegration,
	PagedQueryContext:PagedQueryContext,
	DespatchListQueryModel:DespatchListQueryModel,
	InboxDespatchListQueryModel:InboxDespatchListQueryModel,
	OutboxDespatchListQueryModel:OutboxDespatchListQueryModel,
	InboxReceiptAdviceListQueryModel:InboxReceiptAdviceListQueryModel,
	OutboxDespatchQueryModel:OutboxDespatchQueryModel,
	FilterablePagedQueryContext:FilterablePagedQueryContext,
	SystemUserFilterContext:SystemUserFilterContext,
	ReceiptAdviceViewContext:ReceiptAdviceViewContext,
	DespatchInfo:DespatchInfo,
	ReceiptAdviceTypeInfo:ReceiptAdviceTypeInfo,
	CustomerInfo:CustomerInfo,
	NotificationInformation:NotificationInformation,
	MailingInformation:MailingInformation,
	MailAttachmentInformation:MailAttachmentInformation
}
