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
                    break;
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
                    break;
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
        var ppArray = [];
        ppArray.push([northWest.lng + " " + northWest.lat]);
        ppArray.push([southWest.lng + " " + southWest.lat]);
        ppArray.push([southEast.lng + " " + southEast.lat]);
        ppArray.push([northEast.lng + " " + northEast.lat]);
        ppArray.push([northWest.lng + " " + northWest.lat]);
        return ppArray;
    },
    getMapBounds_1:function (map) {//获取地图边界,两个方法传的参数不同，因此和上面的有区别
        var bounds = map.getBounds(),
            southWest = bounds.getSouthWest(),
            southEast = bounds.getSouthEast(),
            northWest = bounds.getNorthWest(),
            northEast = bounds.getNorthEast();
        var pointsArray = [];
        var ppArray = [];
        ppArray.push([northWest.lng,northWest.lat]);
        ppArray.push([southWest.lng,southWest.lat]);
        ppArray.push([southEast.lng,southEast.lat]);
        ppArray.push([northEast.lng,northEast.lat]);
        ppArray.push([northWest.lng,northWest.lat]);
        pointsArray.push(ppArray);
        return pointsArray;
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
        qqLayer.id = "qqLayer";
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
        if(FM.mapConf.autoDrag){
            // FM.leafletUtil.removeLine(pMap,e.target.id+"-@-gl");
            // var guidelayer = FM.leafletUtil.getLayerById(pMap,e.target.id);
            var guide = FM.leafletUtil.closestPoint(e);
            var point = guide.point;
            var locPoint = null;
            FM.leafletUtil.removeLine(pMap, e.target.id + "-@-gl");
            if (point != undefined) {
                var latlng = new L.latLng(point.x, point.y);
                var guidePoint = FM.leafletUtil.getLayerById(pMap, e.target.id + "-@-gp");
                guidePoint.setLatLng(latlng);
                FM.leafletUtil.drawNewline(e.target, guidePoint);
            } else {
                FM.leafletUtil.drawNewline(e.target, FM.mapConf.pGuideGeo);
                // G.ui.tips.warn("当前点位1000米范围内未找到可用的引导LINK，请检查");
            }
        }else {
            FM.leafletUtil.removeLine(pMap,e.target.id+"-@-gl");
            var guidePoint = FM.leafletUtil.getLayerById(pMap,e.target.id+"-@-gp");
            FM.leafletUtil.drawNewline(e.target,guidePoint);
        }
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
        var locLatlng = e.target.getLatLng();
        var loc = FM.leafletUtil.latLngToLoc(locLatlng);
        console.log(loc);
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
        // var target = null;
        // if (e.target.name != "poi") {
        //     target = e.target;
        // } else {
        //     target = e;
        // }
        var retObj = FM.leafletUtil.closestPoint(e);
        var point = retObj.point;
        var locPoint = null;
        if(e.target.name != "poi"){
            FM.leafletUtil.removeLine(pMap, e.target.id.replace("-@-gp", "-@-gl"));
            locPoint = FM.leafletUtil.getLayerById(pMap, e.target.id.split("-@-gp")[0]);
            if (point != undefined) {
                var latlng = new L.latLng(point.x, point.y);
                e.target.setLatLng(latlng);
                FM.leafletUtil.drawNewline(locPoint, e.target);
            } else {
                FM.leafletUtil.drawNewline(locPoint, FM.mapConf.pGuideGeo);
                // G.ui.tips.warn("当前点位1000米范围内未找到可用的引导LINK，请检查");
            }
        }else {
            FM.leafletUtil.removeLine(pMap, e.target.id + "-@-gl");
            if (point != undefined) {
                var latlng = new L.latLng(point.x, point.y);
                var guidePoint = FM.leafletUtil.getLayerById(pMap, e.target.id + "-@-gp");
                guidePoint.setLatLng(latlng);
                FM.leafletUtil.drawNewline(e.target, guidePoint);
            } else {
                FM.leafletUtil.drawNewline(e.target, FM.mapConf.pGuideGeo);
                // G.ui.tips.warn("当前点位1000米范围内未找到可用的引导LINK，请检查");
            }
        }
        var guideLatlng = e.target.getLatLng();
        var guide = FM.leafletUtil.latLngToLoc(guideLatlng);
        guide.linkPid = retObj.linkPid;
        console.log(guide);
    },
    closestPoint: function (e) {//寻找最近的引导点
        var target = null;
        var line = null;
        if (e.target.name != "poi") {
            line = FM.leafletUtil.getLayerById(pMap, e.target.id.replace("-@-gp", "-@-gl"));
        } else {
            line = FM.leafletUtil.getLayerById(pMap, e.target.id + "-@-gl");
        }
        var pFc = 0;
        var retObj = {};
        var minDis = 50;
        var allLine = FM.leafletUtil.getLayerById(pMap, "navBaseLayer").getLayers();
        for (var i = 0; i < allLine.length; i++) {
            if (allLine[i].attributes.type == "rdLink" && allLine[i].attributes.fow.indexOf(50) == -1) { //去除formOfWay=50的道路
                for (var j = 0; j < allLine[i]._originalPoints.length - 1; j++) {
                    var p1 = L.point(line._originalPoints[1].x, line._originalPoints[1].y);
                    var p2 = L.point(allLine[i]._originalPoints[j].x, allLine[i]._originalPoints[j].y);
                    var p3 = L.point(allLine[i]._originalPoints[j + 1].x, allLine[i]._originalPoints[j + 1].y);
                    var ll = L.LineUtil.pointToSegmentDistance(p1, p2, p3);//点到线的最短距离
                    var l1 = L.point(line._latlngs[1].lat, line._latlngs[1].lng);
                    var l2 = L.point(allLine[i]._latlngs[j].lat, allLine[i]._latlngs[j].lng);
                    var l3 = L.point(allLine[i]._latlngs[j + 1].lat, allLine[i]._latlngs[j + 1].lng);
                    if (ll < minDis) {
                        var point = L.LineUtil.closestPointOnSegment(l1, l2, l3);//点到线的最短距离在线上的交点
                        retObj.linkPid = allLine[i].attributes.pid;
                        retObj.point = point;
                        minDis = ll;
                        pFc = allLine[i].attributes.fc;//把fc做为取舍条件之一
                    } else if(ll == minDis && (allLine[i].attributes.fc != 0 && allLine[i].attributes.fc < pFc)){//fc的原则：1>2>3>4>5>0
                        var point = L.LineUtil.closestPointOnSegment(l1, l2, l3);//点到线的最短距离在线上的交点
                        minDis = ll;
                        retObj.linkPid = allLine[i].attributes.pid;
                        retObj.point = point;
                        pFc = allLine[i].attributes.fc;
                    }
                }
            }
        }
        return retObj;
    },
    createGuideLine: function (poiFid, location, guide) {    //画引导线
        var fid = poiFid + "-@-gl";
        var linePoints = [];
        var spoint = new L.LatLng(location.latitude, location.longitude);
        var epoint = new L.LatLng(guide.latitude, guide.longitude);
        linePoints.push(spoint);
        linePoints.push(epoint);
        return this.drawGuideLine(fid, linePoints);
    },
    splitPolyline: function (wkt, strline) {    //将wkt格式的线分割成点
        var line = wkt.read(strline.geometry);
        var coords = line.components;
        var points = [];
        for (var i = 0; i < coords.length; i++) {
            points.push(new L.latLng(coords[i].y, coords[i].x));
        }
        return points;
    },
    showLinkInMap: function (layerName, linkArray, linkType) {    //将线显示在地图上
        var lineStyle;
        var navLayer = this.getLayerById(pMap, "navBaseLayer");
        var wkt = new Wkt.Wkt();
        for (var i = 0; i < linkArray.length; i++) {
            if(this.getLayerById(pMap, linkArray[i].pid) !=undefined){
                continue;
            }else {
                var lineLayer = L.polyline(this.splitPolyline(wkt, linkArray[i]));
                lineLayer.id = linkArray[i].pid;
                lineLayer.type = linkArray[i].kind;
                lineStyle = this.getLineStyle(linkArray[i].kind);
                lineLayer.setStyle(lineStyle);
                lineLayer.attributes = linkArray[i];
                lineLayer.attributes.type = "rdLink";
                navLayer.addLayer(lineLayer);
            }
        }
    },
    highlightFeatureInMap: function (feature) { //将点的icon改变并高亮显示
        if (FM.mapConf.pSelectMarker) {
            FM.mapConf.pSelectMarker.setIcon(FM.iconStyles.dotIcon);
            FM.mapConf.pSelectMarker.update();
            feature.setIcon(FM.iconStyles.blueIcon);
            feature.openPopup();
            feature.update();
            FM.mapConf.pSelectMarker = feature;
        } else {
            feature.setIcon(FM.iconStyles.blueIcon);
            feature.openPopup();
            feature.update();
            FM.mapConf.pSelectMarker = feature;
        }
    },
    
 
    getLineStyle: function (kind) {    // 分配线型
        var lstype;
        switch (kind) {
            case 1:
                lstype = FM.lineStyles.line1;
                break;
            case 2:
                lstype = FM.lineStyles.line2;
                break;
            case 3:
                lstype = FM.lineStyles.line3;
                break;
            case 4:
                lstype = FM.lineStyles.line4;
                break;
            case 6:
                lstype = FM.lineStyles.line6;
                break;
            case 7:
                lstype = FM.lineStyles.line7;
                break;
            case 8:
                lstype = FM.lineStyles.line9;
                break;
            case 10:
                lstype = FM.lineStyles.line10;
                break;
            case 99:
                lstype = FM.lineStyles.line99;
                break;
            default:
                lstype = FM.lineStyles.line10;
                break;
        }
        return lstype;
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
    pGuide:null,
    autoDrag:true,
    pRoadList:null
};