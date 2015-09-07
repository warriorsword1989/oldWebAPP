define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.mapApi.Map = L.Map.extend({
        initialize: function (id, options) {
            L.Map.prototype.initialize.call(this, id, options);
            this.map = this;
            this.mapControl = new this._mapControler(this);
        },
        /**
         * 地图控件，主要包含操作地图的方法
         * @param map
         * @private
         */
        _mapControler : function(map){

            this.zoomIn = function(){
                map.zoomIn()
            };

            this.zoomOut = function(){
                map.zoomOut()
            };

            this.pan = function(latlng){
                map.panTo(latlng);
            };
            this.pointSelect = function(){

            };

            this.boxSelect = function(){

            };

            this.snap = function(){

            };
        }

    });
});
