/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.AuIxSamepoiPart = FM.dataApi.DataModel.extend({
	dataModelType: "AU_IX_SAMEPOI_PART",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.samepoiAudataId = data['samepoiAudataId'];
		this.audataId = data['audataId'];
		this.groupId = data['groupId'] || 0;
		this.poiPid = data['poiPid'] || 0;
		this.attTaskId = data['attTaskId'] || 0;
		this.attOprstatus = data['attOprstatus'] || 0;
		this.attCheckstatus = data['attCheckstatus'] || 0;
		this.fieldTaskId = data['fieldTaskId'] || 0;
		this.fieldTaskSubId = data['fieldTaskSubId'] || null;
		this.fieldGuid = data['fieldGuid'] || null;
		this.fieldSource = data['fieldSource'];
	},
	getIntegrate: function(){
		var ret = {};
		ret["samepoiAudataId"] = this.samepoiAudataId;
		ret["audataId"] = this.audataId;
		ret["groupId"] = this.groupId;
		ret["poiPid"] = this.poiPid;
		ret["attTaskId"] = this.attTaskId;
		ret["attOprstatus"] = this.attOprstatus;
		ret["attCheckstatus"] = this.attCheckstatus;
		ret["fieldTaskId"] = this.fieldTaskId;
		ret["fieldTaskSubId"] = this.fieldTaskSubId;
		ret["fieldGuid"] = this.fieldGuid;
		ret["fieldSource"] = this.fieldSource;
		return ret;
	}
});