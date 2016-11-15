/**
 * Created by zhaohang on 2016/4/7.
 */
fastmap.dataApi.AdFace = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'ADFACE';
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function (data) {
        this.pid = data.pid;
        this.regionId = data.regionId;
        this.geometry = data.geometry;
        this.area = data.area || 0;
        this.perimeter = data.perimeter || 0;
        this.meshId = data.meshId || 0;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.regionId = this.regionId;
        data.geometry = this.geometry;
        data.area = this.area;
        data.perimeter = this.perimeter;
        data.meshId = this.meshId;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.facePid = this.facePid;
        data.regionId = this.regionId;
        data.geometry = this.geometry;
        data.area = this.area;
        data.perimeter = this.perimeter;
        data.meshId = this.meshId;
        data.geoLiveType = this.geoLiveType;
        return data;
    }

});

fastmap.dataApi.adFace = function (data, options) {
    return new fastmap.dataApi.AdFace(data, options);
};

