/**
 * Created by liuyang on 2016/8/24.
 * Class RdObject组成node
 */

fastmap.dataApi.RdObjectRoads = fastmap.dataApi.GeoDataModel.extend({


    /** *
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = 'RDOBJECTROADS';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.roadPid = data.roadPid;
    },

    /**
     * 获取组成node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.roadPid = this.roadPid;
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
        data.roadPid = this.roadPid;
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
fastmap.dataApi.rdObjectRoads = function (data, options) {
    return new fastmap.dataApi.RdObjectRoads(data, options);
};

