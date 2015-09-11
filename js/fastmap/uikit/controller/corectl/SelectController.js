/**
 * Created by wangtun on 2015/9/10.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.SelectController = L.Class.extend({
        options: {
        },
        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
            this.selectedFeatures = null;

        },
        selectByAttribute:function() {
            var features=[];
            this.onSelected(features);
        },
        selectByGeometry:function(geometry) {
            this.geometry = geometry;
            var features=[];
             if(geometry ==="circle"){
             }

            this.onSelected(features);
        },
        onSelected:function(features) {
            this.selectedFeatures = features;
        },
        clear:function() {
            this.selectedFeatures= [];
        }
    })
});