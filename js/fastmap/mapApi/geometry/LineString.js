/**
 * Created by liwanchong on 2015/9/8.
 * lineString对象
 * @namespace fast.mapApi
 * @class LineString
 */
fastmap.mapApi.LineString = fastmap.mapApi.Collection.extend({
    type: "LineString",
    points: [],
    /**
     * @class LineString
     * @constructor
     * @namespace fastmap.mapApi
     * @param {Array}Points
     */
    initialize: function (points) {
        fastmap.mapApi.Collection.prototype.initialize.apply(this, arguments);
        this.points = points;
    },
    /**
     * 复制整个lineString
     * @method clone
     * @return LineString Clone.
     */
    clone: function () {
        var newpoints = new Array();
        newpoints = this.points.slice(0);
        var lineString = new fastmap.mapApi.LineString(newpoints);
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
        return this._sqClosestPointOnSegment(p, p1, p2);
    },

    _sqClosestPointOnSegment: function(p, p1, p2){
        var x0 = p.x;
        var y0 = p.y;
        var x1 = p1.x;
        var y1 = p1.y;
        var x2 = p2.x;
        var y2 = p2.y;
        var dx = x2 - x1;
        var dy = y2 - y1;
        var along = ((dx * (x0 - x1)) + (dy * (y0 - y1))) /
            (Math.pow(dx, 2) + Math.pow(dy, 2));
        var x, y;
        if(along <= 0.0) {
            x = x1;
            y = y1;
        } else if(along >= 1.0) {
            x = x2;
            y = y2;
        } else {
            x = x1 + along * dx;
            y = y1 + along * dy;
        }
        return {
            distance:Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2)) ,
            x: x, y: y,
            along: along
        };
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
    getSortedSegments: function () {
        var numSeg = this.components.length - 1;
        var segments = new Array(numSeg), point1, point2;
        for(var i=0; i<numSeg; ++i) {
            point1 = this.components[i];
            point2 = this.components[i + 1];
            if(point1.x < point2.x) {
                segments[i] = {
                    x1: point1.x,
                    y1: point1.y,
                    x2: point2.x,
                    y2: point2.y
                };
            } else {
                segments[i] = {
                    x1: point2.x,
                    y1: point2.y,
                    x2: point1.x,
                    y2: point1.y
                };
            }
        }
        // more efficient to define this somewhere static
        function byX1(seg1, seg2) {
            return seg1.x1 - seg2.x1;
        }
        return segments.sort(byX1);

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
    simplify: function (tolerance) {

    },
    /**
     * 距线最近的点
     * @method distanceTo
     * @param {Geometry}geometry
     * @param {Object}options
     * @returns {{}}
     */
    distanceTo: function (geometry, options) {
        var best = {};
        return best;
    }
});
fastmap.mapApi.lineString=function(coordiates) {
    return new fastmap.mapApi.LineString(coordiates);
};

