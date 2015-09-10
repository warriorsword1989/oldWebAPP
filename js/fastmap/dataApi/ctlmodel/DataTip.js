/**
 * Created by liwanchong on 2015/9/9.
 */
define(['js/fastmap/fastmap'],function(fastmap) {
    fastmap.DataTips = L.Class.extend({
        options: {
        },
        initialize: function (id,type,geometry,options) {
            this.options = options || {};

            L.setOptions(this, options);
            this.style = options.style;
            this.geometry = geometry;
            this.icon = null;
            this.id = id;
            this.type = type;
            this.source = null;

        },
        setCoordinates: function (coordinates) {
            this.options = coordinates;
        },
        remove: function () {

        },
        setOutput:function() {

        }



    });
})