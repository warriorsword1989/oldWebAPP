/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdRestrictionDetail = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDRESTRICTIONDETAIL";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){

        this.pid = data["pid"] || 0;
        this.restricPid = data["restricPid"] || 0;
        this.outLinkPid = data["outLinkPid"] || 0;
        this.flag = data["flag"] || 2;
        this.restricInfo = data["restricInfo"] ||0;
        this.type = data["type"] || 1;
        this.relationshipType = data["relationshipType"] || 1;

        this.conditions = [];
        if (data["conditions"]&&data["conditions"].length > 0) {
            for (var i = 0, len = data["conditions"].length; i < len; i++) {
                var condition =fastmap.dataApi.rdRestrictionCondition(data["conditions"][i]);
                this.conditions.push(condition);
            }


        }
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["restricPid"] = this.restricPid;
        data["outLinkPid"] = this.outLinkPid;
        data["flag"] = this.flag;
        data["restricInfo"] = this.restricInfo;
        data["type"] = this.type;
        data["relationshipType"] = this.relationshipType;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["restricPid"] = this.restricPid;
        data["outLinkPid"] = this.outLinkPid;
        data["flag"] = this.flag;
        data["restricInfo"] = this.restricInfo;
        data["type"] = this.type;
        data["relationshipType"] = this.relationshipType;

        var conditions = [];
        for (var i = 0, len = this.conditions.length; i < len; i++) {
            conditions.push(this.conditions[i].getIntegrate());
        }
        data["conditions"] = conditions;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * rdRestriction
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
fastmap.dataApi.rdRestrictionDetail = function (data, options) {
    return new fastmap.dataApi.RdRestrictionDetail(data, options);
}