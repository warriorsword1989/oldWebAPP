/**
 * Created by mali on 2016/4/29.
 */
FM.dataApi.CheckRule = FM.dataApi.GeoDataModel.extend({

    /*
     * 初始化
     */
    initialize: function(data, options) {
        FM.setOptions(this, options);
        this.geoLiveType = "IXPOIKIND";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function(data) {
        this.severity = data["severity"];
        this.ruleType = data["ruleType"];
        this.ruleDesc = data["ruleDesc"];
        this.ruleId = data["ruleId"];
    },
    /*
     *获取检查规则的信息
     */
    getAttribute: function() {
        var data = {};
        data["severity"] = this.severity;
        data["ruleType"] = this.ruleType;
        data["ruleDesc"] = this.ruleDesc;
        data["ruleId"] = this.ruleId;
        return data;
    },
    statics: {
        getList: function(param, callback) {
            FM.dataApi.ajax.get("/fos/meta/queryRule", param, function(data) {
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