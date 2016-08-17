/**
 * Created by wangmingdong on 2016/8/17.
 */
FM.dataApi.IxSearchResult = FM.dataApi.DataModel.extend({
	dataModelType: "IX_SEARCH_RESULT",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.pid = data['pid'];
		this.name = data['name'];
		this.typeName = data['typeName'];
	},
	getIntegrate: function(){
		var ret = {};
		ret["pid"] = this.pid;
		ret["name"] = this.name;
		ret["typeName"] = this.typeName;
		return ret;
	}
});