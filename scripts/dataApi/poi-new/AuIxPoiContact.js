/**
 * Created by wuz on 2016/5/27.
 */
FM.dataApi.AuIxPoiContact = FM.dataApi.DataModel.extend({
	dataModelType: "AU_IX_POI_CONTACT",
	/*
	 * DB-->UI
	 */
	setAttributes: function(data) {
		this.audataId = data['audataId'];
		this.poiPid = data['poiPid'] || 0;
		this.oldContact = data['oldContact'] || null;
		this.contactType = data['contactType'] || 1;
		this.contact = data['contact'] || null;
		this.contactDepart = data['contactDepart'] || 0;
		this.priopity = data['priopity'] || 1;
		this.attTaskId = data['attTaskId'] || 0;
		this.fieldTaskId = data['fieldTaskId'] || 0;
		this.attOprstatus = data['attOprstatus'] || 0;
		this.attCheckstatus = data['attCheckstatus'] || 0;
	},
	/*
	 * UI-->DB
	 */
	getIntegrate: function(){
		var ret = {};
		ret["audataId"] = this.audataId;
		ret["poiPid"] = this.poiPid;
		ret["oldContact"] = this.oldContact;
		ret["contactType"] = this.contactType;
		ret["contact"] = this.contact;
		ret["contactDepart"] = this.contactDepart;
		ret["priopity"] = this.priopity;
		ret["attTaskId"] = this.attTaskId;
		ret["fieldTaskId"] = this.fieldTaskId;
		ret["attOprstatus"] = this.attOprstatus;
		ret["attCheckstatus"] = this.attCheckstatus;
		return ret;
	}
});