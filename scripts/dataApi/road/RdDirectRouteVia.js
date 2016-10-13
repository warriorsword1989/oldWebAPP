/**
 * Created by wangmingdong on 2016/8/4.
 * Class Rdnode
 */

fastmap.dataApi.RdDirectRouteVia = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDDIRECTROUTEVIA";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || "";
        this.groupId = data["groupId"] || 1;
        this.linkPid = data["linkPid"];
        this.seqNum = data["seqNum"] || 1;
        this.uRecord = data["uRecord"] || 0;
        this.uFields = data["uFields"] || null;
    },

    /**
     * 获取RdDirectRouteVia简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["groupId"] = this.groupId;
        data["linkPid"]  = this.linkPid;
        data["seqNum"] = this.seqNum;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdDirectRouteVia详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["groupId"] = this.groupId;
        data["linkPid"]  = this.linkPid;
        data["seqNum"] = this.seqNum;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * RdDirectRouteVia初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdDirectRouteVia = function (data, options) {
    return new fastmap.dataApi.RdDirectRouteVia(data, options);
}

