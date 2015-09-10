/**
 * Created by zhongxiaoming on 2015/9/2.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.mapApi.Layer =  L.Class.extend({
        initialize: function (options) {
            this.options = options || {};
            this.isVisiable = options.isVisiable ? true : false;
            this.isSelectable = options.isSelectable ? true : false;
        },
        onAdd: function (map) {
            this._map = map;
            //map.addLayer(this)
        },
        onRemove: function (map) {
            //map.removeLayer(this);
            this._map = null;

        }

    });

});
