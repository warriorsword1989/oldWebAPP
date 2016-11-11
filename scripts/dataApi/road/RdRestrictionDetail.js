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
        this.flag = (data["flag"] === undefined || data["flag"] === '') ? 2 :data["flag"];
        this.restricInfo = data["restricInfo"] ||0;
        this.type = (data["type"] === undefined || data["type"] === '') ? 1 :data["type"];
        this.relationshipType = (data["relationshipType"] === undefined || data["relationshipType"] === '') ? 1 :data["relationshipType"];

        this.conditions = [];
        if (data["conditions"]&&data["conditions"].length > 0) {
            for (var i = 0, len = data["conditions"].length; i < len; i++) {
                var condition =fastmap.dataApi.rdRestrictionCondition(data["conditions"][i]);
                this.conditions.push(condition);
            }
        }
        this.vias = [];
        if(data["vias"] && data["vias"].length > 0){
            for(var i = 0, len = data["vias"].length; i < len; i++){
                var vias  = fastmap.dataApi.rdRestrictionVias(data["vias"][i]);
                this.vias.push(vias);
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
        data["geoLiveType"] = this.geoLiveType;
        var conditions = [];
        for (var i = 0, len = this.conditions.length; i < len; i++) {
            conditions.push(this.conditions[i].getIntegrate());
        }
        data["conditions"] = conditions;

        var vias = [];
        for(var i = 0, len = this.vias.length; i < len; i++){
            vias.push(this.vias[i].getIntegrate())
        }
        data["vias"] = vias;

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