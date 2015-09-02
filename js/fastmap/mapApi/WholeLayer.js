/**
 * Created by zhongxiaoming on 2015/9/2.
 */
define(['js/fastmap/fastmap','js/fastmap/mapApi/Layer'], function (fastmap) {
    fastmap.mapApi.WholeLayer =  fastmap.mapApi.Layer.extend({
        initialize: function (options) {
        },
        onAdd: function(map) {
            this.map = map;
            this._initContainer(this.map, this.options);
            map.on("moveend", this._redraw, this);
            this._redraw();
        },

        onRemove: function(map) {
            map.getPanes().overlayPane.removeChild(this._div);
            map.off("moveend", this._redraw, this);
        },

        _initContainer: function (options) {
            var container = L.DomUtil.create('div', 'leaflet-wholelayer-container');
            container.style.position = 'absolute';
            container.style.width = this.map.getSize().x+"px";
            container.style.height = this.map.getSize().y+"px";
            this._div = container;
        },

        draw: function(){},

        _redraw: function(){
            this._resetCanvasPosition();
        },

        clear: function(){},

        _resetCanvasPosition: function() {
            var bounds = this.map.getBounds();
            var topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
            L.DomUtil.setPosition(this._div, topLeft);
        }

    });

});
