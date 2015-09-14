define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.mapApi.Map = L.Map.extend({
        initialize: function (id, options) {
            L.Map.prototype.initialize.call(this, id, options);
            this.map = this;
            this.mapControl = new this._mapController(this);
        },
        /**
         * 地图控件，主要包含操作地图的方法
         * @param map
         * @private
         */
        _mapController : function(map){

            /***
             * 放大
             */
            this.zoomIn = function(){
                map.zoomIn()
            };

            /***
             * 缩小
             */
            this.zoomOut = function(){
                map.zoomOut()
            };

            /**
             * 平移
             * @param latlng
             */
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
