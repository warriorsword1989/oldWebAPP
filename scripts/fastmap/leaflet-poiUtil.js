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
    },
    clearMapLayer:function (map,layerId) {
        var layer = this.getLayerById(pMap,layerId);
        layer.clearLayers();
    }
}

FM.iconStyles = {
    yellowIcon: L.icon({
        iconUrl: '../../images/poi/map/marker_yellow.png',
        iconSize: [25, 32],
        iconAnchor: [12, 30],
        popupAnchor: [0, -32]
    }),
    blueIcon: L.icon({
        iconUrl: '../../images/poi/map/marker_blue.png',
        iconSize: [25, 32],
        iconAnchor: [12, 30],
        popupAnchor: [0, -32]
    }),
    greenIcon: L.icon({
        iconUrl: '../../images/poi/map/marker_green.png',
        iconSize: [25, 32],
        iconAnchor: [12, 30],
        popupAnchor: [0, -32]
    }),
    redIcon: L.icon({
        iconUrl: '../../images/poi/map/marker_red.png',
        iconSize: [25, 32],
        iconAnchor: [12, 30],
        popupAnchor: [0, -32]
    }),
    dotIcon: L.icon({
        iconUrl: '../../images/poi/map/dot_infor_16.png',
        iconSize: [8, 8],
        //iconAnchor: [12,30],
        popupAnchor: [0, -32]
    }),
    pointIcon: L.icon({
        iconUrl: '../../images/poi/map/point_512.png',
        iconSize: [10, 10]
        //iconAnchor: [12,30],
        //popupAnchor: [0,-32]
    }),
    deletIcon: L.icon({
        iconUrl: '../../images/poi/map/del_marker.png',
        iconSize: [25, 32],
        iconAnchor: [12, 30],
        popupAnchor: [0, -32]
    })
}