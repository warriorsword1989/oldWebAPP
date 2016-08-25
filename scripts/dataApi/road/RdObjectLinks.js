/**
 * Created by liuyang on 2016/8/24.
 * Class RdObject组成link
 */

fastmap.dataApi.RdObjectLinks = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDOBJECTLINKS";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"];
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
fastmap.dataApi.rdObjectLinks = function (data, options) {
    return new fastmap.dataApi.RdObjectLinks(data, options);
}

