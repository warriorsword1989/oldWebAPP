/**
 * Created by liwanchong on 2015/9/8.
 * lineString对象
 * @namespace fast.mapApi
 * @class LineString
 */
define(['../../fastmap', 'fastmap/mapApi/Geometry'], function (fastmap) {
    fastmap.mapApi.LineString = fastmap.mapApi.Geometry.extend({
        type:"LineString",
        coordinates:[],
        /**
         * @class LineString
         * @constructor
         * @namespace fastmap.mapApi
         * @param {Array}coordinates
         */
        initialize: function (coordinates) {
            fastmap.mapApi.Geometry.prototype.initialize.apply(this, arguments);
            this.coordinates = coordinates;
        },
        /**
         * 复制整个lineString
         * @method clone
         * @return LineString Clone.
         */
        clone: function () {
            var lineString = new fastmap.mapApi.LineString(null);

            return lineString;
        },
        /**
         *获取lineString坐标数据
         * @method getCoordinates
         * @param {Array}coordinates
         */

        getCoordinates: function () {
        },
        /**
         * 获取开始点
         * @method getStartPoint
         * @param {Point}coordinates
         */
        getStartPoint: function (coordinates) {

        },
        /**
         * 获取线的结束点
         * @method getEndPoint
         * @param {Point} coordinates
         */
        getEndPoint: function (coordinates) {

        },
        /**
         *点到线的小片段的距离
         * @method pointToSegmentDistance
         * @param {Point}p
         * @param {Point}p1
         * @param {Point}p2
         * @returns {number}
         */
        pointToSegmentDistance: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
            return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, true));
        },
        /**
         *判断线是否交汇
         * @method intersects
         * @param {Geometry}geometry
         * @returns {boolean}
         */
        intersects: function (geometry) {
            var intersect = false;
            return intersect;
        },
        /**
         * 获取组成线的片段
         *@method getSortedSegments
         * Returns:
         * {Array} An array of segment objects.  Segment objects have properties
         *     x1, y1, x2, and y2.  The start point is represented by x1 and y1.
         *     The end point is represented by x2 and y2.  Start and end are
         *     ordered so that x1 < x2.
         */
        getSortedSegments: function() {
            var segments = [];
            return segments;
        },
        /**
         *把线分离成多个片段
         *@method splitWithSegment
         * @param {Object}seg
         * @param {Object}options
         */
        splitWithSegment: function (seg, options) {
            var result = null;
            return result;
        },
        /**
         * 根据参数分离geometry
         *@method split
         * @param {Object}target
         * @param {Object}options
         */
        split: function (target, options) {
            var results = null;
            return results;
        },
        /**
         *根据容差获取数据
         * @method simplify
         * @param {Number}tolerance
         */
        simplify: function(tolerance){

        },
        /**
         * 距线最近的点
         * @method distanceTo
         * @param {Geometry}geometry
         * @param {Object}options
         * @returns {{}}
         */
        distanceTo:function(geometry, options) {
            var best = {};
            return best;
        }
    });
})
