define(['fastmap/fastmap'], function (fastmap) {
    fastmap.mapApi.Map = function (id, options) {
        fastmap.mapApi.Map = L.Map.extend({
            initialize: function (id, options) {
                L.Map.prototype.initialize.call(this, id, options);
                this.MapControllers = [];
                this.MapLayers = [];
            }
        });

        return new fastmap.mapApi.Map(id, options);
    }
});
