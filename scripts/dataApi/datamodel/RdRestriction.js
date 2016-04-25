/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdRestriction = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        if (!data["pid"]) {
            throw "对象没有对应pid"
        }
        this.geoemtry = data["geometry"];
        this.geoLiveType = "RDRESTRICTION" ;
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"] || null;
        this.inLinkPid = data["inLinkPid"] || null;
        this.restricInfo = data["restricInfo"] || null;
        this.kgFlag = data["kgFlag"] || 0;

        this.details = [];
        if (data["details"] && data["details"].length > 0) {
            for (var i = 0, len = data["details"].length; i < len; i++) {
                var detail = fastmap.dataApi.rdRestrictionDetail(data["details"][i])
                this.details.push(detail);
            }
        }
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["restricInfo"] = this.restricInfo;
        data["kgFlag"] = this.kgFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["restricInfo"] = this.restricInfo;
        data["geoLiveType"] = this.geoLiveType;
        data["kgFlag"] = this.kgFlag;

        var details = [];
        for (var i = 0, len = this.details.length; i < len; i++) {
            details.push(this.details[i].getIntegrate());

        }
        data["details"]=details


        return data;
    }
});

/***
 * rdRestriction
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
fastmap.dataApi.rdRestriction = function (data, options) {
    return new fastmap.dataApi.RdRestriction(data, options);
}