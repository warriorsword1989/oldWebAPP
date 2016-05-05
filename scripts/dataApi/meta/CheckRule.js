/**
 * Created by mali on 2016/4/29.
 */
FM.dataApi.CheckRule = FM.dataApi.DataModel.extend({
	dataModelType: "CHECK_RULE",
    /*
     * 返回参数赋值
     */
	setAttributes: function(data) {
        this.severity = data["severity"];
        this.ruleType = data["ruleType"];
        this.ruleDesc = data["ruleDesc"];
        this.ruleId = data["ruleId"];
    },
    statics: {
        getList: function(callback) {
            FM.dataApi.ajax.get("meta/queryRule/", {}, function(data) {
                var checkRules = [],
                    checkRule;
                for (var i = 0; i < data.data.length; i++) {
                	checkRule = new FM.dataApi.CheckRule(data.data[i]);
                    checkRules.push(checkRule);
                }
                callback(checkRules);
            });
        }
    }
});