/**
 * Created by chenxiao on 2016/5/3.
 * Class GeoDataModel GIS数据模型基类，继承于DataModel类
 * 继承后可重写相关的方法，一般要求重写geoLiveType属性，setAttributes、getSnapShot方法
 */
FM.dataApi.GeoDataModel = FM.dataApi.DataModel.extend({
    options: {},
    /***
     *
     * @param id
     * 模型几何
     */
    // geometry: null,
    /***
     *
     * @param id
     * 模型类型
     */
    geoLiveType: "GLM",
    /***
     *
     * @param options
     */
    initialize: function(data, options) {
        if (options) {
            this.options = options || {};
            FM.setOptions(this, options);
        }
        // this.geometry = geometry;
        this.setAttributes(data);
    },
    getDiffProperties: function(integrateJson) {
        var difJson = {};
        var originJson = this.getIntegrate();
        for (property in originJson.hasOwnProperty()) {
            if (typeof originJson[property] == "number") {
                if (originJson[property] != integrateJson[property]) {
                    difJson[property] = originJson[property];
                }
            } else if (typeof originJson[property] == "string") {
                if (originJson[property] != integrateJson[property]) {
                    difJson[property] = originJson[property];
                }
            } else if (typeof originJson[property] == "boolean") {
                if (originJson[property] != integrateJson[property]) {
                    difJson[property] = originJson[property];
                }
            } else if (typeof originJson[property] == "object") {
                if (JSON.stringify(originJson[property]) != JSON.stringify(integrateJson[property])) {
                    difJson[property] = originJson[property];
                }
            }
        }
        return difJson;
    },
    /**
     * 通过GeoJson生成模型对象
     * @method fromGeoJson
     *
     * @param {string} geoJson.
     * @return {fastmap.mapApi.Geometry} geometry.
     */
    fromGeoJson: function(geoJson) {
        return null;
    },
    /**
     * 几何生成GeoJSON
     * @method toGeoJSON
     *
     * @return {string} geoJsonString.
     */
    toGeoJSON: function() {
        return null;
    }
});