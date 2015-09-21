/**
 * Created by wangtun on 2015/9/10.
 * Polygon 对象
 * @namespace fast.mapApi
 * @class Polygon
 */
fastmap.mapApi.Polygon = fastmap.mapApi.Geometry.extend({
    type: "Polygon",
    coordinates: [],
    options: {},
    /**
     * 构造函数
     * @class Polygon
     * @constructor
     * @param {Array}coordinates
     * @param {Object}options
     */
    initialize: function (coordinates, options) {
        this.coordinates = coordinates;
        this.options = options;
    },
    /**
     * 获取面积
     * @method getArea
     * @returns {number}
     */
    getArea: function () {
        var area = 0.0;
        return area;
    },
    /**
     * 是否包含某点
     * @method containsPoint
     * @param {Point}point
     * @returns {boolean}
     */
    containsPoint: function (point) {
        var contained = false;
        return contained;
    },
    /**
     * 相交
     * @method intersects
     * @param {Geometry}geometry
     * @returns {boolean}
     */
    intersects: function (geometry) {
        var intersect = false;
        return intersect;
    },
    /**
     * 获取到polygon最近的点
     * @method distanceTo
     * @param {Geometry}geometry
     * @param {Object}options
     * @returns {*}
     */
    distanceTo: function (geometry, options) {
        var result;
        return result;
    },
    /**
     * 复制完整的Polygon
     * @method Polygon
     * @returns {.mapApi.Polygon}
     */
    clone: function () {
        var polygon = new fastmap.mapApi.Polygon(null);
        return polygon;
    },
    /**
     * 获取polygon坐标组
     * @method getCoordinates
     */
    getCoordinates: function () {

    },
    /**
     *  获取Polygon的内环
     * @param {Number}squaredTolerance
     * @returns {.mapApi.Polygon}
     */
    getSimplifiedGeometryInternal: function (squaredTolerance) {
        var simplifiedPolygon = new fastmap.mapApi.Polygon(null);
        return simplifiedPolygon;
    }

});
fastmap.mapApi.polygon=function(coordiates,options) {
    return new fastmap.mapApi.Polygon(coordiates, options);
};
