define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.mapApi.Map = L.Map.extend({
        initialize: function (id, options) {
            L.Map.prototype.initialize.call(this, id, options);
            this.mapControl = new this._mapControler();
        },

        _mapControler : function(){
            this.zoomIn = function(){};
            this.zoomOut = function(){};
            this.pan = function(){};
            this.pointSelect = function(){};
            this.boxSelect = function(){}


        }

    });
});
