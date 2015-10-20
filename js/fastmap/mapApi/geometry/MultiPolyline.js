/**
 * Created by wangtun on 2015/9/10.
 * MultiPolyline对象
 * @namespace fast.mapApi
 * @class MultiPolyline
 */
fastmap.mapApi.MultiPolyline = fastmap.mapApi.Collection.extend({
    type: "MultiPolyline",
    /**
     * 构造函数
     * @class MultiPolyline
     * @constructor
     * @namespace fastmap.mapApi
     * @param {Array}coordinates
     * @param {Object}options
     */
    initialize: function (coordinates, options) {
        this.coordinates = coordinates;
        this.options = options;
    },
    /**
     * 在MultiPolylineZ中怎加lineString
     * @method appendLineString
     * @param {LineString}lineString
     */
    appendLineString: function (lineString) {

    },
    /**
     * 获取一份完整的MultiPolyline
     * @method clone
     * @returns {L.MultiPolyline}
     */
    clone: function () {
        var lineStrings = new fastmap.mapApi.MultiPolyline(null);
        return lineStrings;
    },
    /**
     * 获取坐标数组
     * @method getCoordinates
     */
    getCoordinates: function () {

    },
    /**
     * 获得MultiPolyline中的单个lineString
     * @method getLineString
     * @param {Number}index
     * @returns {fastmap.mapApi.LineString}
     */
    getLineString: function (index) {
        var lineString = new fastmap.mapApi.LineString(null);
        return lineString;
    },
    /**
     * 获得MultiPolyline中的全部lineString
     * @method getLineStrings
     * @returns {Array}
     */
    getLineStrings: function () {
        var lineStrings = [];
        return lineStrings;
    },
    /**
     * set lineStrings
     * @method setLineString
     * @param {Array}lineStrings
     */
    setLineStrings: function (lineStrings) {

    },
    /**
     * 获取最近的点
     * @method closestPointXY
     */
    closestPointXY: function () {

    },
    /**
     * 是否相交
     * @method intersectsExtend
     * @param {object}extend
     */
    intersectsExtent: function (extend) {

    },
    /**
     * 获取MultiPolyline内环
     * @param {Number}squaredTolerance
     * @returns {L.MultiPolyline}
     */
    getSimplifiedGeometryInternal: function (squaredTolerance) {
        var simplifiedFlatCoordinates = [];
        var simplifiedMultiLineString = new fastmap.mapApi.MultiPolyline(null);
        return simplifiedMultiLineString;
    }
});
fastmap.mapApi.multiPolyline=function(coordiates,options) {
    return new fastmap.mapApi.MultiPolyline(coordiates, options);
};
