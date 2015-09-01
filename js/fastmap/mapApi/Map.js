define(['fastmap/fastmap'], function (fastmap) {
    fastmap.mapApi.Map = L.Map.extend({
            initialize: function (id, options) {
                L.Map.prototype.initialize.call(this, id, options);
                this.MapControllers = [];
                this.MapLayers = [];
            }
        });
    }
});
