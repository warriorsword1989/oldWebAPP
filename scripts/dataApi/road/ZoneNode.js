/**
 * Created by liuyang on 2016/6/29.
 */
fastmap.dataApi.ZoneNode = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'ZONENODE';
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function (data) {
        this.pid = data.pid;
        this.kind = data.kind;
        this.form = data.form;
        this.geometry = data.geometry;
        this.meshes = data.meshes;
        var str = [];
        for (var i = 0; i < data.meshes.length; i++) {
            str.push(data.meshes[i].meshId);
        }
        this.meshId = str.join(',');
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.kind = this.kind;
        data.form = this.form;
        data.meshId = this.meshId;
        data.geometry = this.geometry;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.kind = this.kind;
        data.form = this.form;
        data.meshId = this.meshId;
        data.geometry = this.geometry;
        data.geoLiveType = this.geoLiveType;
        return data;
    }

});

fastmap.dataApi.zoneNode = function (data, options) {
    return new fastmap.dataApi.ZoneNode(data, options);
};

