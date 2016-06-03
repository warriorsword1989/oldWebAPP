/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.AuIxPoiChildren = FM.dataApi.DataModel.extend({
	dataModelType: "AU_IX_POI_CHILDREN",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.groupId = data['groupId'];
		this.childPoiPid = data['childPoiPid'];
		this.relationType = data['relationType'] || 0;
		this.uRecord = data['uRecord'] || 0;
	},
	getIntegrate: function(){
		var ret = {};
		ret["groupId"] = this.groupId;
		ret["childPoiPid"] = this.childPoiPid;
		ret["relationType"] = this.relationType;
		ret["uRecord"] = this.uRecord;
		return ret;
	}
});