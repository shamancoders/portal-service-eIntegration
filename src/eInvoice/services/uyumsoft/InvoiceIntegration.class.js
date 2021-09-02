class InvoiceIntegration {
	constructor(url,username,password){
		this.client=new WcfHelper(url,username,password,'IIntegration')
	}

	/* string vknTckn, string alias */
	IsEInvoiceUser(vknTckn, alias, callback) { 
		this.run('IsEInvoiceUser',{vknTckn:vknTckn, alias:alias}, callback)
	}

	/* PagedQueryContext pagination:{pageIndex:0,pageSize:300} */
	GetEInvoiceUsers(pagination, callback) { 
		this.run('GetEInvoiceUsers',{pagination:pagination}, callback)
	}

	/* SystemUserFilterContext context */
	FilterEInvoiceUsers(context, callback) { 
		this.run('FilterEInvoiceUsers',{context:context}, callback)
	}

	/* string vknTckn */
	GetUserAliasses(vknTckn, callback) { 
		this.run('GetUserAliasses',{vknTckn:vknTckn}, callback)
	} 

	/* XsltViewType type, string fileContent */
	SetXsltView(type, fileContent, callback) { 
		this.run('SetXsltView',{type:type,fileContent:fileContent}, callback)
	}

	/* XsltViewType type */
	GetXsltView(type, callback) { 
		this.run('GetXsltView',{type:type}, callback)
	}

	/* InvoiceType invoice */
	ValidateInvoice(invoice, callback) { 
		this.run('ValidateInvoice',{invoice:invoice}, callback)
	}

	/* InboxInvoiceQueryModel query*/
	GetInboxInvoices(query, callback) { 
		this.run('GetInboxInvoices',{query:query}, callback)
	}

	/* InboxInvoiceListQueryModel query*/
	GetInboxInvoiceList(query, callback) { 
		this.run('GetInboxInvoiceList',{query:query}, callback)
	}

	/* string invoiceId*/
	GetInboxInvoice(invoiceId, callback) { 
		this.run('GetInboxInvoice',{invoiceId:invoiceId}, callback)
	}

	/* InboxInvoiceQueryModel query */
	GetInboxInvoicesData(query, callback) { 
		this.run('GetInboxInvoicesData',{query:query}, callback)
	}

	/* string invoiceId */
	GetInboxInvoiceData(invoiceId, callback) { 
		this.run('GetInboxInvoiceData',{invoiceId:invoiceId}, callback)
	}

	/* string[] invoiceIds */
	QueryInboxInvoiceStatus(invoiceIds, callback) { 
		this.run('QueryInboxInvoiceStatus',{invoiceIds:invoiceIds}, callback)
	}

	/* string[] invoices */
	SetInvoicesTaken(invoices, callback) { 
		this.run('SetInvoicesTaken',{invoices:invoices}, callback)
	}

	/* DocumentResponseInfo[] responses */
	SendDocumentResponse(responses, callback) { 
		this.run('SendDocumentResponse',{responses:responses}, callback)
	}

	/* string[] invoiceIds */
	QueryDocumentResponseStatus(invoiceIds, callback) { 
		this.run('QueryDocumentResponseStatus',{invoiceIds:invoiceIds}, callback)
	}

	/* InvoiceQueryModel query */
	GetOutboxInvoices(query, callback) { 
		this.run('GetOutboxInvoices',{query:query}, callback)
	}

	/* OutboxInvoiceListQueryModel query */
	GetOutboxInvoiceList(query, callback) { 
		this.run('GetOutboxInvoiceList',{query:query}, callback)
	}

	/* string invoiceId */
	GetOutboxInvoice(invoiceId, callback) { 
		this.run('GetOutboxInvoice',{invoiceId:invoiceId}, callback)
	}

	/* InvoiceQueryModel query */
	GetOutboxInvoicesData(query, callback) { 
		this.run('GetOutboxInvoicesData',{query:query}, callback)
	}

	/* string invoiceId */
	GetOutboxInvoiceData(invoiceId, callback) { 
		this.run('GetOutboxInvoiceData',{invoiceId:invoiceId}, callback)
	}

	/* string[] invoiceIds */
	QueryOutboxInvoiceStatus(invoiceIds, callback) { 
		this.run('QueryOutboxInvoiceStatus',{invoiceIds:invoiceIds}, callback)
	}

	/* string[] invoiceIds */
	QueryInvoiceGtbResponses(invoiceIds, callback) { 
		this.run('QueryInvoiceGtbResponses',{invoiceIds:invoiceIds}, callback)
	}

	/* InvoiceInfo[] invoices */
	SaveAsDraft(invoices, callback) { 
		this.run('SaveAsDraft',{invoices:invoices}, callback)
	}

	/* InvoiceInfo[] invoices */
	SendInvoice(invoices, callback) { 
		this.run('SendInvoice',{invoices:invoices}, callback)
	}

	/* BinaryRequestData data */
	CompressedSaveAsDraft(data, callback) { 
		this.run('CompressedSaveAsDraft',{data:data}, callback)
	}

	/* BinaryRequestData data */
	CompressedSendInvoice(data, callback) { 
		this.run('CompressedSendInvoice',{data:data}, callback)
	}

	/* string[] invoiceIds */
	SendDraft(invoiceIds, callback) { 
		this.run('SendDraft',{invoiceIds:invoiceIds}, callback)
	}

	/* string[] invoiceIds */
	CancelDraft(invoiceIds, callback) { 
		this.run('CancelDraft',{invoiceIds:invoiceIds}, callback)
	}

	/* string invoiceId */
	GetInboxInvoiceView(invoiceId, callback) { 
		this.run('GetInboxInvoiceView',{invoiceId:invoiceId}, callback)
	}

	/* string invoiceId */
	GetOutboxInvoiceView(invoiceId, callback) { 
		this.run('GetOutboxInvoiceView',{invoiceId:invoiceId}, callback)
	}

	/* string invoiceId */
	GetOutboxInvoiceResponseView(invoiceId, callback) { 
		this.run('GetOutboxInvoiceResponseView',{invoiceId:invoiceId}, callback)
	}

	/* string[] invoiceIds */
	GetInboxInvoiceStatusWithLogs(invoiceIds, callback) { 
		this.run('GetInboxInvoiceStatusWithLogs',{invoiceIds:invoiceIds}, callback)
	}

	/* string[] invoiceIds */
	GetOutboxInvoiceStatusWithLogs(invoiceIds, callback) { 
		this.run('GetOutboxInvoiceStatusWithLogs',{invoiceIds:invoiceIds}, callback)
	}

	/* string[] invoiceIds */
	RetrySendInvoices(invoiceIds, callback) { 
		this.run('RetrySendInvoices',{invoiceIds:invoiceIds}, callback)
	}

	/* string[] invoiceIds */
	CloneInvoices(invoiceIds, callback) { 
		this.run('CloneInvoices',{invoiceIds:invoiceIds}, callback)
	}

	/* EArchiveCancelInvoiceContext request */
	CancelEArchiveInvoice(request, callback) { 
		this.run('CancelEArchiveInvoice',{request:request}, callback)
	}

	/* string invoiceId */
	GetInboxInvoicePdf(invoiceId, callback) { 
		this.run('GetInboxInvoicePdf',{invoiceId:invoiceId}, callback)
	}

	/* string invoiceId */
	GetOutboxInvoicePdf(invoiceId, callback) { 
		this.run('GetOutboxInvoicePdf',{invoiceId:invoiceId}, callback)
	}

	/* string[] invoiceIds, bool isInbox, bool isArchived */
	ChangeInvoiceArchiveStatus(invoiceIds, isInbox, isArchived, callback) { 
		this.run('ChangeInvoiceArchiveStatus',{invoiceIds:invoiceIds, isInbox:isInbox, isArchived:isArchived}, callback)
	}

	/* AliasType type */
	GetSystemUsersCompressedList(type, callback) { 
		this.run('GetSystemUsersCompressedList',{type:type}, callback)
	}

	/* AliasType type */
	GetSystemUsersCompressedListOld(type, callback) { 
		this.run('GetSystemUsersCompressedListOld',{type:type}, callback)
	}

	/* FileUploadRequest request */
	ImportExistingInvoice(request, callback) { 
		this.run('ImportExistingInvoice',{request:request}, callback)
	}

	/* QueueInvoiceNotificationRequest request */
	QueueInvoiceNotification(request, callback) { 
		this.run('QueueInvoiceNotification',{request:request}, callback)
	}

	/* string invoiceId, bool isInbox */
	GetInvoiceEnvelope(invoiceId, isInbox, callback) { 
		this.run('GetInvoiceEnvelope',{invoiceId:invoiceId, isInbox:isInbox}, callback)
	}

	/*  */
	TestConnection(callback) { 
		this.run('TestConnection',{}, callback)
	}

	/* DateTime startDate, DateTime endDate */
	GetSummaryReport(startDate, endDate, callback) { 
		this.run('GetSummaryReport',{startDate:startDate, endDate:endDate}, callback)
	}

	/*  */
	WhoAmI(callback) { 
		this.run('WhoAmI',{}, callback)
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

class InvoiceListQueryModel extends PagedQueryContext {
	ExecutionStartDate
	ExecutionEndDate
	ActualInvoiceStartDate
	ActualInvoiceEndDate
	CreateStartDate
	CreateEndDate
	Status
	StatusInList=[]
	InvoiceIds=[]
	InvoiceNumbers=[]
}

class InboxInvoiceListQueryModel extends InvoiceListQueryModel {
	OnlyNewestInvoices=false
}
class InvoiceScenarioType {
	static eInvoice='eInvoice'
	static eArchive='eArchive'
}

class AliasType {
    static InvoiceReceiverbox='InvoiceReceiverbox'
    static InvoiceSenderbox='InvoiceSenderbox'
    static InvoiceReceiverbox='InvoiceReceiverbox'
    static InvoiceSenderbox='InvoiceSenderbox'
}

class OutboxInvoiceListQueryModel extends InvoiceListQueryModel {
	Scenario=InvoiceScenarioType.eInvoice
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

class XsltViewType {
    static Invoice='Invoice'
    static AproveInvoice='AproveInvoice'
    static CancelInvoice='CancelInvoice'
    static eArchiveDefaultInvoice='eArchiveDefaultInvoice'
    static eArchiveInternetSalesInvoice='eArchiveInternetSalesInvoice'
    static EmailBody='EmailBody'
    static Ticket='Ticket'
    static PassengerList='PassengerList'
    static eInvoice='eInvoice'
    static eReceiptAdvice='eReceiptAdvice'
    static Voucher='Voucher'
    static CancelEmailBody='CancelEmailBody'
    static XmlToUblTransformator='XmlToUblTransformator'
    static VoucherEmailBody='VoucherEmailBody'
    static VoucherCancelEmailBody='VoucherCancelEmailBody'
    static ProducerReceipt='ProducerReceipt'
    static InboxInvoiceEmailBody='InboxInvoiceEmailBody'
    static SmsBody='SmsBody'
}

class BinaryRequestData {
	Hash=''
	Data // byte array
}

class InvoiceQueryModel extends PagedQueryContext {
	ExecutionStartDate
	ExecutionEndDate
    InvoiceIds=[]
    InvoiceNumbers=[]
}

class InboxInvoiceQueryModel extends InvoiceQueryModel{
	SetTaken=false
	OnlyNewestInvoices=false
}

class LineResponseInfo {
  	LineNumber=0
  	Description=''
}

class DocumentResponseStatus {
    static Approved='Approved'
    static Declined='Declined'
    static Return='Return'
}

class DocumentResponseInfo {
	LineResponses=[] //LineResponseInfo[]
    InvoiceId=''
    ResponseStatus='' //DocumentResponseStatus
    Reason=''
}

class InvoiceInfo {
	constructor(Invoice){
		this.Invoice=Invoice
		
	}
	
	NotificationInformation=new NotificationInformation()
	LocalDocumentId=''
	ExtraInformation=''
	TargetCustomer={
		Title:'',VknTckn:'',Alias:''
	}
	generateXml(){

		var xmlInvoiceAdvice=util.e_Invoice2xml(this.InvoiceAdvice,'InvoiceAdvice')
		xmlInvoiceAdvice=xmlInvoiceAdvice.replace('<InvoiceAdvice','<q1:InvoiceAdvice');
		xmlInvoiceAdvice=xmlInvoiceAdvice.replace('</InvoiceAdvice','</q1:InvoiceAdvice');

		var xmlInvoiceInfo=`<s:InvoiceInfo LocalDocumentId="${this.LocalDocumentId}" ExtraInformation="${this.ExtraInformation}">
		<s:TargetCustomer Title="${this.TargetCustomer.Title}" VknTckn="${this.TargetCustomer.VknTckn}" Alias="${this.TargetCustomer.Alias}" />
		${xmlInvoiceAdvice}
		<s:NotificationInformation>
		<s:MailingInformation EnableNotification="true" To="alitek@gmail.com" BodyXsltIdentifier="" EmailAccountIdentifier="">
		<s:Subject>tr216</s:Subject>
		</s:MailingInformation>
		</s:NotificationInformation>
		</s:InvoiceInfo>`

		return xmlInvoiceInfo
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
	InvoiceIntegration:InvoiceIntegration,
	PagedQueryContext:PagedQueryContext,
	InvoiceListQueryModel:InvoiceListQueryModel,
	InboxInvoiceListQueryModel:InboxInvoiceListQueryModel,
	OutboxInvoiceListQueryModel:OutboxInvoiceListQueryModel,
	FilterablePagedQueryContext:FilterablePagedQueryContext,
	SystemUserFilterContext:SystemUserFilterContext,
	InvoiceScenarioType:InvoiceScenarioType,
	AliasType:AliasType,
	XsltViewType:XsltViewType,
	BinaryRequestData:BinaryRequestData,
	LineResponseInfo:LineResponseInfo,
	DocumentResponseStatus:DocumentResponseStatus,
	DocumentResponseInfo:DocumentResponseInfo,
	InvoiceInfo:InvoiceInfo,
	CustomerInfo:CustomerInfo,
	NotificationInformation:NotificationInformation,
	MailingInformation:MailingInformation,
	MailAttachmentInformation:MailAttachmentInformation
}
