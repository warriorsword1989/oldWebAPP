/**
 * Created by zhongxiaoming on 2015/9/9.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.dataApi.rdNode = fastmap.dataApi.GeoDataModel.extend({

        options: {
        },

        initialize: function (id,point,options) {
            L.setOptions(this, options);
            this.id = id;
            this._latlng = point;
        }
    });

    fastmap.dataApi.rdnode = function(id,point,options){
        return new fastmap.dataApi.rdNode(id,point,options);
    }

});
