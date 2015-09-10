define(['../../fastmap','fastmap/utils'], function (fastmap) {
    fastmap.mapApi.Point = fastmap.mapApi.Geometry.extend({
         /** 
        *  x 
        * {float} 
        */
        x: null,

        /** 
        *  y 
        * {float} 
        */
        y: null,

        /**
        * Constructor: fastmap.mapApi.Point
        * Construct a point geometry.
        *
        * Parameters:
        * x - {float} 
        * y - {float}
        * 
        */
        initialize: function(x, y) {
            fastmap.mapApi.Geometry.prototype.initialize.apply(this, arguments);
       
            this.x = parseFloat(x);
            this.y = parseFloat(y);
        },

        /**
         * clone
         * 
         * Returns:
         * {<fastmap.mapApi.Point>} An exact clone of this OpenLayers.Geometry.Point
         */
        clone: function(obj) {
            if (obj == null) {
                obj = new fastmap.mapApi.Point(this.x, this.y);
            }

            // catch any randomly tagged-on properties
            fastmap.Utils.applyDefaults(obj, this);

            return obj;
        },

        /** 
         * Method: calculateBounds
         * Create a new Bounds based on the lon/lat
         */
        calculateBounds: function () {
            this.bounds = new fastmap.mapApi.Bounds(this.x, this.y, this.x, this.y);
        }
    })
});
