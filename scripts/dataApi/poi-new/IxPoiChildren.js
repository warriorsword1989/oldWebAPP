/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.IxPoiChildren = FM.dataApi.DataModel.extend({
	dataModelType: "IX_POI_CHILDREN",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.groupId = data['groupId'];
		this.childPoiPid = data['childPoiPid'];
		this.relationType = data['relationType'] || 0;
		this.rowId = data["rowId"];
	},
	getIntegrate: function(){
		var ret = {};
		ret["groupId"] = this.groupId;
		ret["childPoiPid"] = this.childPoiPid;
		ret["relationType"] = this.relationType;
		ret["rowId"] = this.rowId;
		return ret;
	}
});