/**
 * Created by liuyang on 2016/8/9.
 * Class RdInter组成link
 */

fastmap.dataApi.RdInterLinks = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDINTERLINKS";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"];
        this.seqNum = data["seqNum"] || 1;
    },

    /**
     * 获取组成link简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["seqNum"] = this.seqNum;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取组成link详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["seqNum"] = this.seqNum;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * rdInterLinks初始化函数
 * @param id
 * @param point 初始化rdInterLinks的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdInterLinks = function (data, options) {
    return new fastmap.dataApi.RdInterLinks(data, options);
}

