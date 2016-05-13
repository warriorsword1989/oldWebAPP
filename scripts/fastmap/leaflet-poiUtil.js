/**
 * Created by liuyang on 2016/5/6.
 */
FM.leafletUtil = {
    self:this,
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
        return ((latlng1.lat == latlng2.lat) && (latlng1.lng == latlng2.lng));
    },
    removeLine: function(map,id) {
        var line = this.getLayerById(map, id);
        map.removeLayer(line);
    },
    clearMapLayer:function (map,layerId) {
        var layer = this.getLayerById(pMap,layerId);
        layer.clearLayers();
    },
    getMapBounds:function (map) {//获取地图边界
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
    latLngToLoc:function (latlng) {
        return{
            longitude: parseFloat(latlng.lng.toFixed(5)),
            latitude: parseFloat(latlng.lat.toFixed(5))
        }
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
        // L.control.zoom({//左上角的zoom
        //     position: 'topleft',
        //     zoomInTitle: '放大',
        //     zoomOutTitle: '缩小'
        // }).addTo(map);
    },
    createEditablePoiInMap:function (data, layerId, iconStyle) {//初始化可拖动的marker
        var editPoi = this.createPoiFeature(data,iconStyle);
        editPoi.options.draggable = true;
        editPoi.parentLayer = layerId;
        FM.leafletUtil.getLayerById(pMap,layerId).addLayer(editPoi);
        editPoi.openPopup();
        pMap.setView([editPoi._latlng.lat,editPoi._latlng.lng],17);
        if (data.guide && layerId == "poiEditLayer") {//只有当前编辑的poi才有引导坐标，其他的只显示loc
            var guidePoint = this.createGuidePoint(data.fid, data.guide);
            guidePoint.options.draggable = true;
            FM.mapConf.pGuideGeo = this.createGuidePoint(data.fid, data.guide);
            FM.mapConf.pGuideGeo.options.draggable = true;
            this.getLayerById(pMap,layerId).addLayer( guidePoint);
            var guideLine = this.createGuideLine(data.fid, data.location, data.guide);
            this.getLayerById(pMap,layerId).addLayer(guideLine);
        }else {
            console.log("guide missing");
        }
    },
    createEneditablePoiInMap: function (data, layerId, iconStyle) {
        var editPoi = this.createPoiFeature(data, iconStyle);
        editPoi.parentLayer = layerId;
        this.getLayerById(pMap, layerId).addLayer(editPoi);
        editPoi.openPopup();
        pMap.setView([editPoi._latlng.lat, editPoi._latlng.lng], 17);
        if (data.guide && layerId == "poiEditLayer") {
            var guidePoint = this.createGuidePoint(data.fid, data.guide);
            this.getLayerById(pMap, layerId).addLayer(guidePoint);
            var guideLine = this.createGuideLine(data.fid, data.location, data.guide);
            this.getLayerById(pMap, layerId).addLayer(guideLine);
        } else {
            console.log("guide missing");
        }
    },
    createPoiFeature:function (poiJson, iconName) {    //创建显示坐标
        var point =new L.LatLng(poiJson.location.latitude,poiJson.location.longitude );
        var iconType = FM.iconStyles.redIcon;
        if(FM.iconStyles.hasOwnProperty(iconName)){
            iconType = FM.iconStyles[iconName];
        }
        var poiFeature = L.marker(point,{
                opacity: 0.8,
                riseOnHover: true,
                riseOffset:300,
                rotate: false,
                angle:20,
                icon:iconType
            }
        ).bindPopup('<span style="display:block;width:100px;text-align:center">' + poiJson.name + '</span>').openPopup().on("drag",this.repeatDraw).on("dragend",this.completeDraw);
        poiFeature.id=poiJson.fid;
        poiFeature.name="poi";
        poiFeature.attributes = poiJson;
        return poiFeature;
    },
    repeatDraw:function (e) {  //重新画线
        FM.leafletUtil.removeLine(pMap,e.target.id+"-@-gl");
        var guidePoint = FM.leafletUtil.getLayerById(pMap,e.target.id+"-@-gp");
        FM.leafletUtil.drawNewline(e.target,guidePoint);
    },
    drawNewline:function (loc, guide) { //画引导线
        var newLine=[];
        newLine.push([loc.getLatLng().lat,loc.getLatLng().lng]);
        newLine.push([guide.getLatLng().lat,guide.getLatLng().lng]);
        this.getLayerById(pMap,"poiEditLayer").addLayer(this.drawGuideLine(loc.id+"-@-gl",newLine));
    },
    drawGuideLine: function (fid, points) {//画引导线
        var guideLine = L.polyline(points, {
            color: 'red',
            weight: 3,
            dashArray: "5, 10"
        }).addTo(pMap);
        guideLine.id = fid;
        guideLine.name = "guide-line";
        return guideLine;
    },
    completeDraw: function (e) {
        e.target.openPopup();
    },
    createGuidePoint: function (poiFid, guide) {    //画引导点
        var fid = poiFid + "-@-gp";
        var point = new L.LatLng(guide.latitude, guide.longitude);
        var guidePoint = L.marker(point, {
            icon: FM.iconStyles.pointIcon
        }).on("drag", this.repeatGuidPoint).on("dragend", this.setClosestPoint);
        guidePoint.id = fid;
        guidePoint.name = "guide-point";
        return guidePoint;
    },
    repeatGuidPoint: function (e) {    //重画引导坐标
        FM.leafletUtil.removeLine(pMap, e.target.id.replace("-@-gp", "-@-gl"));
        var locPoint = FM.leafletUtil.getLayerById(pMap, e.target.id.split("-@-gp")[0]);
        FM.leafletUtil.drawNewline(locPoint, e.target);
    },
    setClosestPoint: function (e) {    //设置最近的点并画link
        var point = FM.leafletUtil.closestPoint(e);
        if (point != undefined) {
            var latlng = new L.latLng(point.x, point.y);
            FM.leafletUtil.removeLine(pMap, e.target.id.replace("-@-gp", "-@-gl"));
            var locPoint = FM.leafletUtil.getLayerById(pMap, e.target.id.split("-@-gp")[0]);
            e.target.setLatLng(latlng);
            FM.leafletUtil.drawNewline(locPoint, e.target);
        }
        else {
            FM.leafletUtil.removeLine(pMap, e.target.id.replace("-@-gp", "-@-gl"));
            var locPoint = this.getLayerById(pMap, e.target.id.split("-@-gp")[0]);
            FM.leafletUtil.drawNewline(locPoint, FM.mapConf.pGuideGeo);
            // G.ui.tips.warn("当前点位1000米范围内未找到可用的引导LINK，请检查");
        }
    },
    closestPoint: function (e) {
        var minDis = 50;
        var p0 = L.point();
        var allLine = FM.leafletUtil.getLayerById(pMap, "navBaseLayer").getLayers();
        var line = FM.leafletUtil.getLayerById(pMap, e.target.id.replace("-@-gp", "-@-gl"));
        for (var i = 0; i < allLine.length; i++) {
            for (var j = 0; j < allLine[i]._originalPoints.length - 1; j++) {
                var p1 = L.point(line._originalPoints[1].x, line._originalPoints[1].y);
                var p2 = L.point(allLine[i]._originalPoints[j].x, allLine[i]._originalPoints[j].y);
                var p3 = L.point(allLine[i]._originalPoints[j + 1].x, allLine[i]._originalPoints[j + 1].y);
                var ll = L.LineUtil.pointToSegmentDistance(p1, p2, p3);
                //console.log(ll);
                if (ll <= minDis) {
                    var p1 = L.point(line._latlngs[1].lat, line._latlngs[1].lng);
                    var p2 = L.point(allLine[i]._latlngs[j].lat, allLine[i]._latlngs[j].lng);
                    var p3 = L.point(allLine[i]._latlngs[j + 1].lat, allLine[i]._latlngs[j + 1].lng);
                    var point = L.LineUtil.closestPointOnSegment(p1, p2, p3);
                    minDis = ll;
                    p0 = point;
                }
            }
        }
        return p0;
    },
    createGuideLine: function (poiFid, location, guide) {    //画引导线
        var fid = poiFid + "-@-gl";
        var linePoints = [];
        var spoint = new L.LatLng(location.latitude, location.longitude);
        var epoint = new L.LatLng(guide.latitude, guide.longitude);
        linePoints.push(spoint);
        linePoints.push(epoint);
        return this.drawGuideLine(fid, linePoints);
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
    geomRadius:1000,
    pSelectMarker:null,
    pGuideGeo:null,
    pLocationGeo:null,
    pPoiJson:null,
    pLocation:null,
    pGuide:null
};