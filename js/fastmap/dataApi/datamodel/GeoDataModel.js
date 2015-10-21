/**
 * Created by zhongxiaoming on 2015/9/10.
 * Class GeoDataModel 数据模型基类
 */

fastmap.dataApi.GeoDataModel = L.Class.extend({
    options: {},

    /***
     *
     * @param id
     * 模型ID
     */
    id:null,
    /***
     *
     * @param id
     * 模型几何
     */
    geometry:null,

    /***
     *
     * @param attributes
     * 对象属性
     */
    attributes:null,

    /***
     *
     * @param snapShot
     * 对象简要属性
     */
    snapShot:null,

    /***
     *
     * @param integrate
     * 对象全部属性
     */
    integrate:null,

    /***
     *
     * @param options
     */
    initialize: function (geometry,attributes,options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.geometry = geometry;
        this.snapShot = this.getSnapShot(attributes);
        this.integrate = this.getIntegrate(attributes);
    },

    /***
     * 设置对象概要属性信息
     * @param snapshot
     */
    getSnapShot: function (snapshot) {

        return null;
    },

    /***
     * 设置对象完整信息
     * @param integrate
     */
    getIntegrate: function (integrate) {
        return null;
    },

    getDiffProperties:function(integrateJson){
        var difJson={};
        var originJson = this.getIntegrate();
        for  (property in originJson.hasOwnProperty()) {
            if (typeof originJson[property]=="number"){
                if(originJson[property]!=integrateJson[property]){
                    difJson[property] = originJson[property];
                }
            }
            else if(typeof originJson[property]=="string"){
                if(originJson[property]!=integrateJson[property]){
                    difJson[property] = originJson[property];
                }
            }
            else if(typeof originJson[property]=="boolean"){
                if(originJson[property]!=integrateJson[property]){
                    difJson[property] = originJson[property];
                }
            }
            else if(typeof originJson[property]=="object"){
                if(JSON.stringify(originJson[property]) != JSON.stringify(integrateJson[property])){
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
    fromGeoJson: function (geoJson) {

        return null;
    },

    /**
     * 几何生成GeoJSON
     * @method toGeoJSON
     *
     * @return {string} geoJsonString.
     */
    toGeoJSON: function () {
        return null;
    }
});

