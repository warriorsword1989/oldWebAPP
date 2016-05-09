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
    },
    //获取地图边界
    getMapBounds:function (map) {
        var bounds = map.getBounds(),
            southWest = bounds.getSouthWest(),
            southEast = bounds.getSouthEast(),
            northWest = bounds.getNorthWest(),
            northEast = bounds.getNorthEast();
        var pointsArray = [];
        var ppArray = [];
        ppArray.push([northWest.lng + " " + northWest.lat]);
        ppArray.push([southWest.lng + " " + southWest.lat]);
        ppArray.push([southEast.lng + " " + southEast.lat]);
        ppArray.push([northEast.lng + " " + northEast.lat]);
        ppArray.push([northWest.lng + " " + northWest.lat]);
        pointsArray.push(ppArray);
        return ppArray;
    },
    loadLayers:function (map) {
        var qqLayer = new L.TileLayer('http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0', {
            layername: '腾讯',
            subdomains: ["rt0", "rt1", "rt2", "rt3"],
            tms: true,
            maxZoom: 20,
            selected: false,
            id: 'qqLayer',
            visible: true,
            added: true,
            singleselect: true,
            zIndex: 2
        });
        map.addLayer(qqLayer);
        var drawnItems = new L.layerGroup();
        drawnItems.id = "drawnItems";
        map.addLayer(drawnItems);
        var polygonGroup = new L.layerGroup();
        polygonGroup.id = "regionLayer";
        map.addLayer(polygonGroup);
        var navBaseLayer = new L.layerGroup();
        navBaseLayer.id = "navBaseLayer";
        navBaseLayer.name = "道路和测线";
        map.addLayer(navBaseLayer);
        var mainPoiLayer = new L.layerGroup();
        mainPoiLayer.id = "mainPoiLayer";
        map.addLayer(mainPoiLayer);
        var parentPoiGroup = new L.layerGroup();
        parentPoiGroup.id = "parentPoiLayer";
        map.addLayer(parentPoiGroup);
        var childPoiLayer = new L.layerGroup();
        childPoiLayer.id = "childPoiLayer";
        map.addLayer(childPoiLayer);
        var checkResultLayer = new L.layerGroup();
        checkResultLayer.id = "checkResultLayer";
        map.addLayer(checkResultLayer);
        var rectChooseLayer = new L.layerGroup();
        rectChooseLayer.id = "rectChooseLayer";
        map.addLayer(rectChooseLayer);
        var poiEditLayer = new L.layerGroup();
        poiEditLayer.id = "poiEditLayer";
        map.addLayer(poiEditLayer);
        var overLayers = {
            "道路": navBaseLayer,
            "腾讯": qqLayer
        };
        L.control.layers('', overLayers).addTo(map);//右上角的图层
        L.control.zoom({//左上角的zoom
            position: 'topleft',
            zoomInTitle: '放大',
            zoomOutTitle: '缩小'
        }).addTo(map);
    }
};

FM.lineStyles = {
    //初始化线型
    line1 : {
        color: "#FFA8FF",
        opacity: 0.5,
        weight: 2
    },
    line2 : {
        color: "#F0DFFF",
        opacity: 0.5,
        weight: 2
    },
    line3 : {
        color: "#FF8F8F",
        opacity: 0.5,
        weight: 2
    },
    line4 : {
        color: "#FFD247",
        opacity: 0.5,
        weight: 2
    },
    line6 : {
        color: "#99E865",
        opacity: 0.5,
        weight: 2
    },
    line7 : {
        color: "#D1A87F",
        opacity: 0.5,
        weight: 2
    },
    line8 : {
        color: "#E7E7BB",
        opacity: 0.5,
        weight: 2
    },
    line9 : {
        color: "#232323",
        opacity: 0.5,
        weight: 2
    },
    line10 : {
        color: "#8FE3FF",
        opacity: 0.5,
        weight: 2
    },
    line99 : { //测线
        color: "#2F39C8",
        opacity: 0.5,
        weight: 2
    }
};

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
};

FM.layerConf = {
    "mainPoiLayer": "周边POI",
    "parentPoiLayer": "候选父POI",
    "childPoiLayer": "子POI",
    "checkResultLayer": "关联POI"
};

FM.mapConf = {
    pSelectMarker:null,
    pGuideGeo:null,
    pLocationGeo:null
}