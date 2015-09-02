define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.mapApi.Map = function (id, options) {
        fastmap.dataApi.propertyCard = L.Class.extend({
            initialize: function (latlngs, options) {
                L.Map.prototype.initialize.call(this, id, options);
                this.MapControllers = [];
                this.MapLayers = [];
            }
        });

        return new fastmap.mapApi.Map(id, options);
    }
});