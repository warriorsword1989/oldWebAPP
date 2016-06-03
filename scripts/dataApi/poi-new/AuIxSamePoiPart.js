/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.AuIxSamepoiPart = FM.dataApi.DataModel.extend({
	dataModelType: "AU_IX_SAMEPOI_PART",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.groupId = data['groupId'] || 0;
		this.poiPid = data['poiPid'] || 0;
		this.uRecord = data['uRecord'] || 0;
		this.uFields = data['uFields'] || null;
	},
	getIntegrate: function(){
		var ret = {};
		ret["groupId"] = this.groupId;
		ret["poiPid"] = this.poiPid;
		ret["uRecord"] = this.uRecord;
		ret["uFields"] = this.uFields;
		return ret;
	}
});