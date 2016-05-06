angular.module('app').controller('poiMapCtl', function($scope) {
    pMap = L.map('NaviMap_container', {
        attributionControl: false,
        zoomControl:false
    }).setView([40.012834, 116.476293], 17);

    $scope.loadLayers = function (map) {
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
        L.control.layers('',overLayers).addTo(map);//右上角的图层
        // map.zommControl.setAttribute({
        //         position:'topleft',
        //         zoomInTitle:'放大',
        //         zoomOutTitle:'缩小'
        // })
        L.control.zoom({
            position:'topleft',
            zoomInTitle:'放大',
            zoomOutTitle:'缩小'
        }).addTo(map);
        var center = new L.LatLng(39.90, 116.37);
        map.setView(center, 14);
            // .on("moveend", $scope.loadNewData);
    };

    $scope.loadLayers(pMap);

    $scope.loadNewData = function () {
        console.log(11111);
        document.getElementById('zoomLevelBar').text("缩放等级:" + pMap.getZoom());
        if(pMap.getZoom()>13){

        }
    }


    //将线显示在地图上
    $scope.showLinkInMap = function (layerName, linkArray, linkType) {
        var lineStyle;
        var navLayer = FM.leafletUtil.getLayerById(pMap, "navBaseLayer");
        var wkt = new Wkt.Wkt();
        for (var i = 0; i < linkArray.length; i++) {
            var lineLayer = L.polyline($scope.splitPolyline(wkt, linkArray[i]));
            lineLayer.id = linkArray[i].pid;
            lineLayer.type = linkArray[i].kind;
            lineStyle = $scope.getLineStyle(linkArray[i].kind);
            lineLayer.setStyle(lineStyle);
            lineLayer.attributes = linkArray[i];
            navLayer.addLayer(lineLayer);
        }
    };

    //加载地图的道路数据
    $scope.loadNavBaseData = function () {
        FM.leafletUtil.clearMapLayer(pMap,"navBaseLayer");
        var mapBounds = $scope.getMapBounds(pMap);
        var cond = "POLYGON((" + mapBounds.join(",") + "))";
        FM.dataApi.getFromHbase.get("poi/getlink", cond, function (data) {
            $scope.showLinkInMap("navBaseLayer", data, "rdLink");
        });
    };

    // 每次地图移动后加载视口内的道路
    $scope.loadNewRoad = function () {
        document.getElementById('zoomLevelBar').innerHTML = "缩放等级:" + pMap.getZoom();
        if (pMap.getZoom() > 13) {
            $scope.loadNavBaseData();
        }
    };

    pMap.on("moveend", $scope.loadNewRoad);

    //重画引导坐标
    $scope.repeatGuidPoint = function ($event) {
        FM.leafletUtil.removeLine(pMap,e.target.id.replace("-@-gp","-@-gl"));
        var locPoint = FM.leafletUtil.getLayerById(pMap,$event.target.id.split("-@-gp"));
        $scope.drawNewline(locPoint,$event.target);
    };

    //找道路上距离最近的点
    $scope.closestPoint = function ($event) {
        var minDis=50;
        var p0= L.point();
        var allLine=FM.leafletUtil.getLayerById(pMap,"navBaseLayer").getLayers();
        var line = FM.leafletUtil.getLayerById(pMap,$event.target.id.replace("-@-gp","-@-gl"));
        for(var i=0;i<allLine.length;i++){
            for(var j=0;j<allLine[i]._originalPoints.length-1;j++){
                var p1 = L.point(line._originalPoints[1].x,line._originalPoints[1].y);
                var p2=L.point(allLine[i]._originalPoints[j].x,allLine[i]._originalPoints[j].y);
                var p3=L.point(allLine[i]._originalPoints[j+1].x,allLine[i]._originalPoints[j+1].y);
                var ll= L.LineUtil.pointToSegmentDistance(p1,p2,p3);
                //console.log(ll);
                if(ll<=minDis){
                    var p1 = L.point(line._latlngs[1].lat,line._latlngs[1].lng);
                    var p2=L.point(allLine[i]._latlngs[j].lat,allLine[i]._latlngs[j].lng);
                    var p3=L.point(allLine[i]._latlngs[j+1].lat,allLine[i]._latlngs[j+1].lng);
                    var point= L.LineUtil.closestPointOnSegment(p1,p2,p3);
                    minDis=ll;
                    p0=point;
                }
            }
        }
        return p0;
    };

    //设置最近的点并画link
    $scope.setClosestPoint = function ($event) {
        var point = $scope.closestPoint($event);
        if(point){
            FM.leafletUtil.removeLine(pMap,$event.target.id.replace("-@-gp","-@-gl"));
            var locPoint = FM.leafletUtil.getLayerById(pMap,$event.target.id.split("-@-gp"));
            var guidePoint = L.marker(point,{
                icon:FM.iconStyles.pointIcon,
                draggable:true
            }).on("drag",$scope.repeatGuidPoint).on("dragend",$scope.setClosestPoint);
            guidePoint.id = $event.target.id;
            guidePoint.name="guide-point";
            $scope.drawNewline(locPoint,guidePoint);
        }
        else{
            FM.leafletUtil.removeLine(pMap,$event.target.id.replace("-@-gp","-@-gl"));
            var locPoint = FM.leafletUtil.getLayerById(pMap,$event.target.id.split("-@-gp"));
            $scope.drawNewline(locPoint,pGuideGeo);
            // G.ui.tips.warn("当前点位1000米范围内未找到可用的引导LINK，请检查");
        }
    };

    //画引导点
    $scope.createGuidePoint = function (poiFid, guide) {
        var fid = poiFid + "-@-gp";
        var point =new L.LatLng(guide.latitude,guide.longitude );
        var guidePoint = L.marker(point,{
            icon:FM.iconStyles.pointIcon,
            draggable:true
        }).on("drag",$scope.repeatGuidPoint).on("dragend",$scope.setClosestPoint);
        guidePoint.id = fid;
        guidePoint.name="guide-point";
        return guidePoint;
    };

    //画引导线
    $scope.drawGuideLine = function (fid,points) {
        var guideLine=L.polyline(points,{
            color: 'red',
            weight: 3,
            dashArray:"5, 10"
        }).addTo(pMap);
        guideLine.id = fid;
        guideLine.name="guide-line";
        return guideLine;
    };

    //画引导线
    $scope.drawNewline = function (loc,guide) {
        var newLine=[];
        newLine.push([loc.getLatLng().lat,loc.getLatLng().lng]);
        newLine.push([guide.getLatLng().lat,guide.getLatLng().lng]);
        FM.leafletUtil.getLayerById(pMap,"poiEditLayer").addLayer($scope.drawGuideLine(loc.id+"-@-gl",newLine));
    };

    //重新画线
    $scope.repeatDraw = function ($event) {
        FM.leafletUtil.removeLine(pMap,$event.target.id+"-@-gl");
        var guidePoint = FM.leafletUtil.getLayerById(pMap,$event.target.id+"-@-gp");
        $scope.drawNewline($event.target,guidePoint);
    };

    //创建显示坐标
    $scope.createPoiFeature = function (poiJson) {
        var point =new L.LatLng(poiJson.location.latitude,poiJson.location.longitude );
        var poiFeature = L.marker(point,{
                draggable: true,
                opacity: 0.8,
                riseOnHover: true,
                riseOffset:300,
                rotate: false,
                angle:20,
                icon:FM.iconStyles.redIcon
            }
        ).bindPopup('<span style="display:block;width:100px;text-align:center">' + poiJson.name + '</span>').openPopup().on("drag",$scope.repeatDraw).on("dragend",$scope.completeDraw);
        poiFeature.id=poiJson.fid;
        poiFeature.name="poi";
        poiFeature.attributes = poiJson;
        return poiFeature;
    };

    //画引导线
    $scope.createGuideLine = function (poiFid, location, guide) {
        var fid = poiFid + "-@-gl";
        var linePoints=[];
        var spoint =new L.LatLng(location.latitude,location.longitude );
        var epoint =new L.LatLng(guide.latitude,guide.longitude );
        linePoints.push(spoint);
        linePoints.push(epoint);
        return $scope.drawGuideLine(fid,linePoints);
    }

    $scope.$on("loadup_poiMap",function (event, data) {
        console.log("_________________________");
        var editPoi = $scope.createPoiFeature(data);
        editPoi.parentLayer = "poiEditLayer";
        FM.leafletUtil.getLayerById(pMap,"poiEditLayer").addLayer(editPoi);
        editPoi.openPopup();
        pMap.setView([editPoi._latlng.lat,editPoi._latlng.lng],17);
        if (data.guide) {
            var guidePoint = $scope.createGuidePoint(data.fid, data.guide);
            pGuideGeo = guidePoint;
            FM.leafletUtil.getLayerById(pMap,"poiEditLayer").addLayer( guidePoint);
            var guideLine = $scope.createGuideLine(data.fid, data.location, data.guide);
            FM.leafletUtil.getLayerById(pMap,"poiEditLayer").addLayer(guideLine);
        }else {
            console.log("guide missing");
        }
    });

});