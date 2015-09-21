/**
 * Created by liwanchong on 2015/9/8.
 * LinearRing对象
 * @namespace fast.mapApi
 * @class LinearRing
 */
    fastmap.mapApi.LinearRing = fastmap.mapApi.Geometry.extend({
        options:{

        },
        coordinates:[],
        type: "LinearRing",

        /**
         * 构造函数
         * @class LinearRing
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
         *  在geometry中添加点
         *  @method addComponent
         * @param point
         * @param index
         * @returns {boolean}
         */
        addComponent: function (point, index) {
            var added = false;
            return added;
        },
        /**
         * 删除geometry中的点
         * @method removeComponent
         * @param point
         * @returns {Array}
         */
        removeComponent: function (point) {
            var removed = [];
            return removed;
        },
        /**
         * 根据x,y的值移动geometry
         * @method move
         * @param x
         * @param y
         */
        move: function (x, y) {
        },
        /**
         * 调整geometry的大小
         * @method resize
         * @param scale
         * @param origin
         * @param ratio
         * @returns {fastmap.mapApi.LinearRing}
         */
        resize: function (scale, origin, ratio) {
            return this;
        },
        /**
         * 获取中心点坐标
         * @method getCentroid
         */
        getCentroid: function () {

        },
        /**
         * geometry面积
         * @method getArea
         * @returns {number}
         */
        getArea: function () {
            var area = 0.0;
            return area;

        },
        /**
         * 获取geometry 周长
         * @method getGeodesicLength
         * @param projection
         * @returns {number}
         */
        getGeodesicLength: function (projection) {
            var length = 0.0;
            return length;
        },
        /**
         * 获取一份完整的LinearRing
         * @returns {fastmap.mapApi.LinearRing}
         */
        clone:function(){
            var linearRing = new fastmap.mapApi.LinearRing(null);
            return linearRing;
        },
        /**
         * 是否包含某点
         * @method containsPoint
         * @param point
         * @returns {boolean}
         */
        containsPoint: function (point) {
            var crossed = false;
            return crossed;
        },
        /**
         * 相交
         * @method intersects
         * @param geometry
         * @returns {boolean}
         */
        intersects: function (geometry) {
            var intersect = false;
            return intersect;
        },
        /**
         * 是否获取geometry的坐标串
         * @method getVertices
         * @param nodes
         */
        getVertices: function (nodes) {

        }


    })
fastmap.mapApi.linearRing=function(coordiates,options) {
    return new fastmap.mapApi.LinearRing(coordiates, options);
};

