/**
 * Geometry
 * 基于leaflet的几何基类
 *
 * @namespace mapApi
 * @class Geometry
 */
fastmap.mapApi.Geometry = L.Class.extend({
    type: "",

    /**
     * @method initialize
     * 初始化构造函数
     *
     */
    initialize: function () {
        this.bounds = null;
    },

    /**
     * 深度拷贝几何.
     * @method clone
     * @return {!fastmap.mapApi.Geometry} Clone.
     */
    clone: fastmap.abstractMethod,

    /**
     * 获取几何的外包框.
     * @method  getExtent
     * @param {fastmap.mapApi.Extent} opt_extent Extent.
     * @return {fastmap.mapApi.Extent} extent Extent.
     */
    getExtent: fastmap.abstractMethod,

    /**
     * 清除外包框
     */
    clearBounds: function() {
        this.bounds = null;
        if (this.parent) {
            this.parent.clearBounds();
        }
    },
    /**
     * 通过GeoJson生成几何
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
    },

    /**
     * 通过wkt生成几何类
     * @method fromWkt
     *
     * @param {string} wkt.
     * @return {fastmap.mapApi.Geometry} geometry.
     */
    fromWkt: function (wkt) {
        return null;
    },

    /**
     * 几何类生成wkt
     * @method toWkt
     *
     * @return {string} geoJsonString.
     */
    toWkt: function () {
        return "";
    },

    /**
     * 计算两个几何之间的距离
     * @method distanceTo
     *
     * @param {fastmap.mapApi.Geometry} 用于计算距离的另外一个几何
     * @param {Object} Optional 计算距离时所需要的其他参数
     *
     * @return {Number | Object} 返回距离和相应的两个点
     */
    distanceTo: function (geometry, options) {

    }
});
fastmap.mapApi.geometry=function() {
    return new fastmap.mapApi.Geometry();
};
