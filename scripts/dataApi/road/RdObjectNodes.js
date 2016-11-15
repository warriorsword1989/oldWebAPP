/**
 * Created by liuyang on 2016/8/24.
 * Class RdObject组成node
 */

fastmap.dataApi.RdObjectNodes = fastmap.dataApi.GeoDataModel.extend({


    /** *
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = 'RDOBJECTNODES';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.nodePid = data.nodePid;
    },

    /**
     * 获取组成node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.nodePid = this.nodePid;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 获取组成node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.nodePid = this.nodePid;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * rdInterNodes初始化函数
 * @param id
 * @param point 初始化rdInterNodes的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdObjectNodes = function (data, options) {
    return new fastmap.dataApi.RdObjectNodes(data, options);
};

