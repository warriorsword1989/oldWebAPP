/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.AuIxSamepoi = FM.dataApi.DataModel.extend({
	dataModelType: "AU_IX_SAMEPOI",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.groupId = data['groupId'] || 0;
		this.relationType = data['relationType'] || 1;
		this.uRecord = data['uRecord'] || 0;
		this.uFields = data['uFields'] || 0;
	},
	getIntegrate: function(){
		var ret = {};
		ret["groupId"] = this.groupId;
		ret["relationType"] = this.relationType;
		ret["uRecord"] = this.uRecord;
		ret["uFields"] = this.uFields;
		return ret;
	}
});