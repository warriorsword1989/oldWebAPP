/**
 * Created by wangmingdong on 2016/5/26.
 */
FM.dataApi.IxSamepoi = FM.dataApi.DataModel.extend({
	dataModelType: "IX_SAMEPOI",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.groupId = data['groupId'] || 0;
		this.relationType = data['relationType'] || 1;
		this.rowId = data["rowId"];
	},
	getIntegrate: function(){
		var ret = {};
		ret["groupId"] = this.groupId;
		ret["relationType"] = this.relationType;
		ret["rowId"] = this.rowId;
		return ret;
	}
});