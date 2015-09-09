/**
 * Created by liwanchong on 2015/9/8.
 */
define(['../fastmap', 'fastmap/utils'], function (fastmap) {
    fastmap.mapApi.LineString = fastmap.mapApi.Geometry.extend({
        initialize: function (coordinates) {
            fastmap.mapApi.Geometry.prototype.initialize.apply(this, arguments);
            this.coordinates = coordinates;
        },
        /**
         * Make a complete copy of the geometry.
         * @return LineString Clone.
         */
        clone: function () {
            var lineString = new fastmap.mapApi.LineString(null);

            return lineString;
        },
        /**
         *
         * @param coordinates
         */

        getCoordinates: function () {
        },
        /**
         * get the start Point
         */
        getStartPoint: function (coordinates) {

        },
        /**
         * get the end Point
         */
        getEndPoint: function (coordinates) {

        },
        /**
         * distance from a point to a segment between two points
         * @param p
         * @param p1
         * @param p2
         * @returns {number}
         */
        pointToSegmentDistance: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
            return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, true));
        },
        /**
         * APIMethod: intersects
         * Test for instersection between two geometries.  This is a cheapo
         *     implementation of the Bently-Ottmann algorigithm.  It doesn't
         *     really keep track of a sweep line data structure.  It is closer
         *     to the brute force method, except that segments are sorted and
         *     potential intersections are only calculated when bounding boxes
         *     intersect.
         *
         * @param geometry
         * @returns {boolean}
         */
        intersects: function (geometry) {
            var intersect = false;
            return intersect;
        },
        /**
         * Method: getSortedSegments
         *
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
         * Method: splitWithSegment
         * Split this geometry with the given segment.
         */
        splitWithSegment: function (seg, options) {
            var result = null;
            return result;
        },
        /**
         * Method: split
         * Use this geometry (the source) to attempt to split a target geometry.
         *
         */
        split: function (target, options) {
            var results = null;
            return results;
        },
        simplify: function(tolerance){

        },
        /**
         * APIMethod: distanceTo
         * Calculate the closest distance between two geometries (on the x-y plane).
         * @param geometry
         * @param options
         * @returns {{}}
         */
        distanceTo:function(geometry, options) {
            var best = {};
            return best;
        }
    });
})
