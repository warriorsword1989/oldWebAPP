/**
 * Created by wuz on 2016/5/27.
 */
FM.dataApi.AuIxPoiName = FM.dataApi.DataModel.extend({
	dataModelType: "AU_IX_POI_NAME",
	/*
	 * DB-->UI
	 */
	setAttributes: function(data) {
		this.aunameId = data['aunameId'];
		this.audataId = data['audataId'];
		this.nameId = data['nameId'] || 0;
		this.nameGroupid = data['nameGroupid'] || 1;
		this.poiPid = data['poiPid'] || 0;
		this.langCode = data['langCode'];
		this.nameClass = data['nameClass'] || 1;
		this.nameType = data['nameType'] || 1;
		this.name = data['name'] || null;
		this.namePhonetic = data['namePhonetic'] || null;
		this.keywords = data['keywords'] || null;
		this.nidbPid = data['nidbPid'] || null;
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
		ret["aunameId"] = this.aunameId;
		ret["audataId"] = this.audataId;
		ret["nameId"] = this.nameId;
		ret["nameGroupid"] = this.nameGroupid;
		ret["poiPid"] = this.poiPid;
		ret["langCode"] = this.langCode;
		ret["nameClass"] = this.nameClass;
		ret["nameType"] = this.nameType;
		ret["name"] = this.name;
		ret["namePhonetic"] = this.namePhonetic;
		ret["keywords"] = this.keywords;
		ret["nidbPid"] = this.nidbPid;
		ret["attTaskId"] = this.attTaskId;
		ret["fieldTaskId"] = this.fieldTaskId;
		ret["attOprstatus"] = this.attOprstatus;
		ret["attCheckstatus"] = this.attCheckstatus;
		return ret;
	}
});