define(['../fastmap'], function (fastmap) {
    fastmap.mapApi.Geometry = L.Class.extend({
        initialize: function () {
            this.bounds = null;
        },

        /**
        * 深度拷贝几何.
        * @function
        * @return {!fastmap.mapApi.Geometry} Clone.
        */
        clone: fastmap.abstractMethod,

        /**
        * 获取几何的外包框.
        * @function
        * @param {fastmap.mapApi.Extent=} opt_extent Extent.
        * @return {fastmap.mapApi.Extent} extent Extent.
        */
        getExtent: fastmap.abstractMethod,

        /**
        * @param {string} geoJson.
        * @return {fastmap.mapApi.Geometry} geometry.
        */
        fromGeoJson: function (geoJson) {
            return null;
        },

        /**
        * @return {string} geoJsonString.
        */
        toGeoJSON: function () {
            return null;
        },

        /**
        * @param {string} wkt.
        * @return {fastmap.mapApi.Geometry} geometry.
        */
        fromWkt: function (wkt) {
            return null;
        },

        /**
        * @return {string} geoJsonString.
        */
        toWkt: function () {
            return "";
        },

        /**
         * 计算两个几何之间的距离
         *
         * Parameters:
         * @param {<fastmap.mapApi.Geometry>} The target geometry.
         * @param {Object} Optional properties for configuring the distance
         *     calculation.
         *
         * Valid options depend on the specific geometry type.
         * 
         * Returns:
         * {Number | Object} The distance between this geometry and the target.
         *     If details is true, the return will be an object with distance,
         *     x0, y0, x1, and x2 properties.  The x0 and y0 properties represent
         *     the coordinates of the closest point on this geometry. The x1 and y1
         *     properties represent the coordinates of the closest point on the
         *     target geometry.
         */
        distanceTo: function(geometry, options) {
            
        }
    });
});
