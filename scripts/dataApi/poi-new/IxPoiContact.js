/**
 * Created by wuz on 2016/5/27.
 */
FM.dataApi.IxPoiContact = FM.dataApi.DataModel.extend({
	dataModelType: "IX_POI_CONTACT",
	/*
	 * DB-->UI
	 */
	setAttributes: function(data) {
		this.poiPid = data['poiPid'] || 0;
		this.contactType = data['contactType'] || 1;
		this.contact = data['contact'] || null;
		this.contactDepart = data['contactDepart'] || 0;
		this.priopity = data['priopity'] || 1;
		this.code = data['code'] || "";
		if(this.contactType == 1 && this.contact && this.contact.indexOf("-") > -1){
			var tmep = this.contact.split("-");
			this.code = tmep[0];
			this.contact = tmep[1];
		}
		this.rowId = data["rowId"];
	},
	/*
	 * UI-->DB
	 */
	getIntegrate: function(){
		var ret = {};
		ret["poiPid"] = this.poiPid;
		ret["contactType"] = this.contactType;
		ret["contact"] = this.contact;
		ret["contactDepart"] = this.contactDepart;
		ret["priopity"] = this.priopity;
		if(this.contactType == 1){
			ret["contact"] = this.code + "-" +this.contact;
		}
		ret["rowId"] = this.rowId;
		return ret;
	}
});