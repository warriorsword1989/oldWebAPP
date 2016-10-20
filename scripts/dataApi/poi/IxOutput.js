/**
 * Created by wangmingdong on 2016/6/2.
 */
FM.dataApi.IxOutput = FM.dataApi.DataModel.extend({
	dataModelType: "IX_OUTPUT",
	/*
	 * 返回参数赋值
	 */
	setAttributes: function(data) {
		this.type = data['type'];
		this.pid = data['pid'];
		this.childPid = data['childPid'];
		this.op = data['op'];
	},
	getIntegrate: function(){
		var ret = {};
		ret["type"] = this.type;
		ret["pid"] = this.pid;
		ret["childPid"] = this.childPid;
		ret["op"] = this.op;
		return ret;
	}
});