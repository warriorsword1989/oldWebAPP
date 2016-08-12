/**
 * Created by linglong on 2016/8/12.
 */
fastmap.dataApi.LCFace = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "LCFACE";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.featureId = data["featureId"] || 0;
        this.geometry = data["geometry"];
        this.kind = data["kind"] || 0;
        this.area = data["area"] || 0;
        this.perimeter = data["perimeter"] || 0;
        this.meshId = data["meshId"] || 0;
        this.names = data["faceNames"] || [];
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["featureId"] = this.featureId;
        data["geometry"] = this.geometry;
        data["kind"] = this.kind;
        data["area"] = this.area;
        data["perimeter"] = this.perimeter;
        data["meshId"] = this.meshId;
        data["geoLiveType"] = this.geoLiveType;
        data["faceNames"] = this.names;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["featureId"] = this.featureId;
        data["geometry"] = this.geometry;
        data["area"] = this.area;
        data["perimeter"] = this.perimeter;
        data["meshId"] = this.meshId;
        data["geoLiveType"] = this.geoLiveType;
        data["faceNames"] = this.names;
        return data;
    },

});

fastmap.dataApi.lcFace = function (data, options) {
    return new fastmap.dataApi.LCFace(data, options);
};
