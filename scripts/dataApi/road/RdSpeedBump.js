/**
 * Created by wangmingdong on 2016/8/4.
 * Class Rdnode
 */

fastmap.dataApi.RdSpeedBump = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDSPEEDBUMP";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.bumpPid = data["bumpPid"] || "";
        this.nodePid = data["nodePid"];
        this.linkPid = data["linkPid"];
        this.memo = data["memo"] || null;
        this.reserved = data["reserved"] || null;
        this.uRecord = data["uRecord"] || 0;
        this.uFields = data["uFields"] || null;
    },

    /**
     * 获取RdSpeedBump简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["bumpPid"] = this.bumpPid;
        data["nodePid"] = this.nodePid;
        data["linkPid"]  = this.linkPid;
        data["memo"] = this.memo;
        data["reserved"] = this.reserved;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdSpeedBump详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["bumpPid"] = this.bumpPid;
        data["nodePid"] = this.nodePid;
        data["linkPid"]  = this.linkPid;
        data["memo"] = this.memo;
        data["reserved"] = this.reserved;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * RdSpeedBump初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdSpeedBump = function (data, options) {
    return new fastmap.dataApi.RdSpeedBump(data, options);
}

