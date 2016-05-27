/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.AuIxSamepoi = FM.dataApi.DataModel.extend({
	dataModelType: "AU_IX_SAMEPOI",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.samepoiAudataId = data['samepoiAudataId'];
		this.groupId = data['groupId'] || 0;
		this.relationType = data['relationType'] || 1;
		this.attTaskId = data['attTaskId'] || 0;
		this.attOprstatus = data['attOprstatus'] || 0;
		this.attCheckstatus = data['attCheckstatus'] || 0;
		this.fieldTaskId = data['fieldTaskId'] || 0;
		this.fieldTaskSubId = data['fieldTaskSubId'] || null;
		this.fieldGuid = data['fieldGuid'] || null;
		this.fieldDayTime = data['fieldDayTime'] || null;
		this.fieldSource = data['fieldSource'];
		this.paramEx1 = data['description'] || null;
		this.paramEx2 = data['description'] || null;
		this.paramEx3 = data['description'] || null;
		this.paramEx4 = data['description'] || null;
	},
	getIntegrate: function(){
		var ret = {};
		ret["samepoiAudataId"] = this.samepoiAudataId;
		ret["groupId"] = this.groupId;
		ret["relationType"] = this.relationType;
		ret["attTaskId"] = this.attTaskId;
		ret["attOprstatus"] = this.attOprstatus;
		ret["attCheckstatus"] = this.attCheckstatus;
		ret["fieldTaskId"] = this.fieldTaskId;
		ret["fieldTaskSubId"] = this.fieldTaskSubId;
		ret["fieldGuid"] = this.fieldGuid;
		ret["fieldDayTime"] = this.fieldDayTime;
		ret["fieldSource"] = this.fieldSource;
		ret["paramEx1"] = this.paramEx1;
		ret["paramEx2"] = this.paramEx2;
		ret["paramEx3"] = this.paramEx3;
		ret["paramEx4"] = this.paramEx4;
		return ret;
	}
});