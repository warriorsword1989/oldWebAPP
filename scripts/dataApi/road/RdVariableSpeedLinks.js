/**
 * Created by linglong on 2016/7/29.
 * Class RdVariableSpeedLinks
 */

fastmap.dataApi.RdVariableSpeedLinks = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDVARIABLESPEEDLINKS";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.linkPid = data["linkPid"];
        this.seqNum = data["seqNum"] || 1;
    },

    /**
     * 获取连续link简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["linkPid"] = this.linkPid;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取连续link详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["linkPid"] = this.linkPid;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * Rdnode初始化函数
 * @param id
 * @param point 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdVariableSpeedLinks = function (data, options) {
    return new fastmap.dataApi.RdVariableSpeedLinks(data, options);
}

