/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.IxPoiParent = FM.dataApi.DataModel.extend({
	dataModelType: "IX_POI_PARENT",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.pid = data['pid'];
		//this.groupId = data['groupId'];
		this.parentPoiPid = data['parentPoiPid'];
		this.tenantFlag = data['tenantFlag'] || 0;
		this.memo = data['memo'] || null;
		this.rowId = data["rowId"];
	},
	getIntegrate: function(){
		var ret = {};
		ret["pid"] = this.pid;
		//ret["groupId"] = this.groupId;
		ret["parentPoiPid"] = this.parentPoiPid;
		ret["tenantFlag"] = this.tenantFlag;
		ret["memo"] = this.memo;
		ret["rowId"] = this.rowId;
		return ret;
	}
});