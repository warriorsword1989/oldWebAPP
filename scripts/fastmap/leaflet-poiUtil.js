/**
 * Created by liuyang on 2016/5/6.
 */
FM.leafletUtil = {
    getLayerById: function(map, layerId) {
        var layer;
        for (var item in map._layers) {
            if (map._layers[item].id) {
                if (map._layers[item].id === layerId) {
                    layer=map._layers[item];
                }
            }
        }
        return layer;
    },
    getLayersById: function(map, layerId) {
        var layers = [];
        for (var item in map._layers) {
            if (map._layers[item].id) {
                if (map._layers[item].id === layerId) {
                    layers.push(map._layers[item]);
                }
            }
        }
        return layers;
    },
    isSamePoint: function(latlng1, latlng2) {
        if ((latlng1.lat == latlng2.lat) && (latlng1.lng == latlng2.lng)) {
            return true;
        } else {
            return false;
        }
    },
    removeLine: function(map,id) {
        var lineList = this.getLayersById(map, id);
        for (var i = 0; i < lineList.length; i++) {
            if (map.hasLayer(lineList[i])) {
                map.removeLayer(lineList[i]);
            }
        }
    }
}