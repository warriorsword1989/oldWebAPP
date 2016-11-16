/**
 * Created by mali on 2016/9/28.
 */

fastmap.dataApi.RdNodeMesh = fastmap.dataApi.GeoDataModel.extend({

    /** *
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = 'RDNODEMESH';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.nodePid = data.nodePid || '';
        this.meshId = data.meshId || 0;
        this.rowId = data.rowId || '';
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.nodePid = this.nodePid;
        data.meshId = this.formOfWay;
        data.rowId = this.rowId;
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
        data.nodePid = this.nodePid;
        data.meshId = this.formOfWay;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * Rdnode初始化函数
 * @param id
 * @param point 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdNodeMesh = function (data, options) {
    return new fastmap.dataApi.RdNodeMesh(data, options);
};

