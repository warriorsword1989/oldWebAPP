/**
 * Created by mali on 2016/7/25.
 */
fastmap.dataApi.LUFace = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'LUFACE';
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function (data) {
        this.pid = data.pid;
        this.featureId = data.featureId || 0;
        this.geometry = data.geometry;
        this.kind = data.kind || 0;
        this.area = data.area || 0;
        this.perimeter = data.perimeter || 0;
        this.meshId = data.meshId || 0;
        this.faceNames = [];
        if (data.faceNames) {
            for (var i = 0, len = data.faceNames.length; i < len; i++) {
                this.faceNames.push(fastmap.dataApi.luFaceName(data.faceNames[i]));
            }
        }
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.featureId = this.featureId;
        data.geometry = this.geometry;
        data.kind = this.kind;
        data.area = this.area;
        data.perimeter = this.perimeter;
        data.meshId = this.meshId;
        data.geoLiveType = this.geoLiveType;
        data.faceNames = [];
        if (this.faceNames) {
            for (var i = 0, len = this.faceNames.length; i < len; i++) {
                data.faceNames.push(this.faceNames[i].getIntegrate());
            }
        }
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.featureId = this.featureId;
        data.geometry = this.geometry;
        data.area = this.area;
        data.perimeter = this.perimeter;
        data.meshId = this.meshId;
        data.geoLiveType = this.geoLiveType;
        data.faceNames = [];
        if (this.names) {
            for (var i = 0, len = this.faceNames.length; i < len; i++) {
                data.faceNames.push(this.faceNames[i].getIntegrate());
            }
        }
        return data;
    }

});

fastmap.dataApi.luFace = function (data, options) {
    return new fastmap.dataApi.LUFace(data, options);
};
