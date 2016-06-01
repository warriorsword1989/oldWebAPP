/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.AuIxPoiChildren = FM.dataApi.DataModel.extend({
	dataModelType: "AU_IX_POI_CHILDREN",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.audataId = data['audataId'];
		this.groupId = data['groupId'] || 0;
		this.childPoiPid = data['childPoiPid'] || 0;
		this.relationType = data['relationType'] || 0;
		this.attTaskId = data['attTaskId'] || 0;
		this.attOprstatus = data['attOprstatus'] || 0;
		this.attCheckstatus = data['attCheckstatus'] || 0;
		this.fieldTaskId = data['fieldTaskId'] || 0;
		this.fieldTaskSubId = data['fieldTaskSubId'] || null;
		this.fieldGuid = data['fieldGuid'] || null;
		this.label = data['label'] || null;
		this.fieldSource = data['fieldSource'];
	},
	getIntegrate: function(){
		var ret = {};
		ret["audataId"] = this.audataId;
		ret["groupId"] = this.groupId;
		ret["childPoiPid"] = this.childPoiPid;
		ret["attTaskId"] = this.attTaskId;
		ret["attOprstatus"] = this.attOprstatus;
		ret["attCheckstatus"] = this.attCheckstatus;
		ret["fieldTaskId"] = this.fieldTaskId;
		ret["fieldTaskSubId"] = this.fieldTaskSubId;
		ret["fieldGuid"] = this.fieldGuid;
		ret["label"] = this.label;
		ret["fieldSource"] = this.fieldSource;
		return ret;
	}
});