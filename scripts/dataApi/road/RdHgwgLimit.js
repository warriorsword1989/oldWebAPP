/**
 * Created by wuzhen on 2016/11/11.
 */
fastmap.dataApi.RdHgwgLimit = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'RDHGWGLIMIT';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data.pid;
        this.linkPid = data.linkPid;
        this.direct = data.direct;
        this.resHigh = data.resHigh;
        this.resWeigh = data.resWeigh;
        this.resWidth = data.resWidth;
        this.resAxleLoad = data.resAxleLoad;
        this.meshId = data.meshId;
        this.geometry = data.geometry;
        this.rowId = data.rowId;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.linkPid = this.linkPid;
        data.direct = this.direct;
        data.resHigh = this.resHigh;
        data.resWeigh = this.resWeigh;
        data.resAxleLoad = this.resAxleLoad;
        data.resWidth = this.resWidth;
        data.meshId = this.meshId;
        data.geometry = this.geometry;
        data.rowId = this.rowId;

        data.geoLiveType = this.geoLiveType;
        return data;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.linkPid = this.linkPid;
        data.direct = this.direct;
        data.resHigh = this.resHigh;
        data.resWeigh = this.resWeigh;
        data.resAxleLoad = this.resAxleLoad;
        data.resWidth = this.resWidth;
        data.meshId = this.meshId;
        data.geometry = this.geometry;
        data.rowId = this.rowId;

        data.geoLiveType = this.geoLiveType;
        return data;
    }
});
/** *
 * rdHgwgLimit初始化函数
 * @param data 分歧数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdHgwgLimit}
 */
fastmap.dataApi.rdHgwgLimit = function (data, options) {
    return new fastmap.dataApi.RdHgwgLimit(data, options);
};
