angular.module('app').controller('poiMapCtl', function ($scope) {
    //初始化地图
    pMap = L.map('NaviMap_container', {
        attributionControl: false,
        zoomControl: false
    }).setView([40.012834, 116.476293], 17);

    //加载各个图层
    FM.leafletUtil.loadLayers(pMap);

    //将wkt格式的线分割成点
    $scope.splitPolyline = function (wkt, strline) {
        var line = wkt.read(strline.geometry);
        var coords = line.components;
        var points = [];
        for (var i = 0; i < coords.length; i++) {
            points.push(new L.latLng(coords[i].y, coords[i].x));
        }
        return points;
    };

    // 分配线型
    $scope.getLineStyle = function (kind) {
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
    };

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
        var mapBounds = FM.leafletUtil.getMapBounds(pMap);
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
        }else {
            FM.leafletUtil.clearMapLayer(pMap,"navBaseLayer");
        }
    };

    //注册地图的moveend事件
    pMap.on("moveend", $scope.loadNewRoad);

    //重画引导坐标
    $scope.repeatGuidPoint = function ($event) {
        FM.leafletUtil.removeLine(pMap,$event.target.id.replace("-@-gp","-@-gl"));
        var locPoint = FM.leafletUtil.getLayerById(pMap,$event.target.id.split("-@-gp")[0]);
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
        if(point != undefined){
            var latlng = new L.latLng(point.x,point.y);
            FM.leafletUtil.removeLine(pMap,$event.target.id.replace("-@-gp","-@-gl"));
            var locPoint = FM.leafletUtil.getLayerById(pMap,$event.target.id.split("-@-gp")[0]);
            var guidePoint = L.marker(latlng,{
                icon:FM.iconStyles.pointIcon,
                draggable:true
            }).on("drag",$scope.repeatGuidPoint).on("dragend",$scope.setClosestPoint);
            guidePoint.id = $event.target.id;
            guidePoint.name="guide-point";
            $scope.drawNewline(locPoint,guidePoint);
        }
        else{
            FM.leafletUtil.removeLine(pMap,$event.target.id.replace("-@-gp","-@-gl"));
            var locPoint = FM.leafletUtil.getLayerById(pMap,$event.target.id.split("-@-gp")[0]);
            $scope.drawNewline(locPoint,FM.mapConf.pGuideGeo);
            // G.ui.tips.warn("当前点位1000米范围内未找到可用的引导LINK，请检查");
        }
    };

    //画引导点
    $scope.createGuidePoint = function (poiFid, guide) {
        var fid = poiFid + "-@-gp";
        var point =new L.LatLng(guide.latitude,guide.longitude );
        var guidePoint = L.marker(point,{
            icon:FM.iconStyles.pointIcon
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

    //拖动完后的操作
    $scope.completeDraw = function ($event) {
        $event.target.openPopup();
    };

    //创建显示坐标
    $scope.createPoiFeature = function (poiJson,iconName) {
        var point =new L.LatLng(poiJson.location.latitude,poiJson.location.longitude );
        var iconType = FM.iconStyles.redIcon;
        if(FM.iconStyles.hasOwnProperty(iconName)){
            iconType = FM.iconStyles[iconName];
        }
        var poiFeature = L.marker(point,{
                // draggable: true,
                opacity: 0.8,
                riseOnHover: true,
                riseOffset:300,
                rotate: false,
                angle:20,
                icon:iconType
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
    };

    //将点的icon改变并高亮显示
    $scope.highlightFeatureInMap = function (feature) {
        if(FM.mapConf.pSelectMarker){
            FM.mapConf.pSelectMarker.setIcon(FM.iconStyles.dotIcon);
            FM.mapConf.pSelectMarker.update();
            feature.setIcon(FM.iconStyles.blueIcon);
            feature.openPopup();
            feature.update();
            FM.mapConf.pSelectMarker= feature;
        }else {
            feature.setIcon(FM.iconStyles.blueIcon);
            feature.openPopup();
            feature.update();
            FM.mapConf.pSelectMarker= feature;
        }
    };

    //选择同位点
    $scope.selectSamePoi = function ($event) {
        var pois = [];
        pois.push($event.target);
        for (var key in FM.layerConf) {
            if (key != $event.target.parentLayer) {
                var layers = FM.leafletUtil.getLayerById(key);
                pois.concat(layers._layers);
            }
        }
        var data = [];
        for (var i = 0; i < pois.length; i++) {
            if (FM.leafletUtil.isSamePoint($event.target._latlng, pois[i]._latlng)) {
                pois[i].parentLayer = $event.target.parentLayer;
                data.push(pois[i]);
            }
        }
        if (data.length == 1) {
            $scope.highlightFeatureInMap(data[0]);
        } else if (data.length > 1) {
            $scope.$emit("samePois", data);//将同位点数据抛给父页面，显示在popover中
        }
    };

    //创建一个能点击的同位点
    $scope.createPoiPointFeature = function (poiJson,iconName) {
        var point =new L.LatLng(poiJson.location.latitude,poiJson.location.longitude );
        var iconType = FM.iconStyles.redIcon;
        if(FM.iconStyles.hasOwnProperty(iconName)){
            iconType = FM.iconStyles[iconName];
        }
        var poiMarker = L.marker(point,
            { draggable: false,
                opacity: 0.8,
                riseOnHover: true,
                riseOffset:300,
                rotate: false,
                angle:20,
                icon:iconType
            }
        ).bindPopup('<span style="display:block;width:100px;text-align:center">' + poiJson.name + '</span>').on("click",$scope.selectSamePoi);
        poiMarker.id = poiJson.fid;
        poiMarker.type = "poi";
        poiMarker.attributes = poiJson;
        return poiMarker;
    };

    //将点显示在地图上
    $scope.showPoisInMap = function (layerId, poiArray) {
        for (var i = 0; i < poiArray.length; i++) {
            var poiLayer = $scope.createPoiPointFeature(poiArray[i],"dotIcon");
            poiLayer.parentLayer = layerId;
            FM.leafletUtil.getLayerById(pMap,"mainPoiLayer").addLayer(poiLayer);
        }
    };

    //创建视野范围内其他的poi点
    $scope.loadTaskPoiData = function () {
        var mapBounds = FM.leafletUtil.getMapBounds(pMap);
        var cond = {
            loc: {
                "$geoWithin": {
                    "$geometry": {
                        "type": "Polygon",
                        "coordinates": mapBounds
                    }
                }
            }
        };
        var param = {
            projectId: 2016013086,
            condition: cond,
            phase:"4",
            featcode: "poi",
            type: "snapshot",
            pagesize: 0
        };
        FM.dataApi.ajax.post("editsupport/poi/query",param,function (data) {
            if (data.errcode == 0) {
                FM.leafletUtil.getLayerById(pMap,"mainPoiLayer").clearLayers();
                $scope.showPoisInMap("mainPoiLayer",data.data.data);
            } else {
                console.log("wrong request!")
            }
        })
    };

    //初始化可拖动的marker
    $scope.initEditablePoiInMap = function (data,layerId,iconStyle) {
        var editPoi = $scope.createPoiFeature(data,iconStyle);
        editPoi.options.draggable = true;
        editPoi.parentLayer = layerId;
        FM.leafletUtil.getLayerById(pMap,layerId).addLayer(editPoi);
        editPoi.openPopup();
        pMap.setView([editPoi._latlng.lat,editPoi._latlng.lng],17);
        if (data.guide && layerId == "poiEditLayer") {//只有当前编辑的poi才有引导坐标，其他的只显示loc
            var guidePoint = $scope.createGuidePoint(data.fid, data.guide);
            guidePoint.options.draggable = true;
            FM.mapConf.pGuideGeo = $scope.createGuidePoint(data.fid, data.guide);
            FM.mapConf.pGuideGeo.options.draggable = true;
            FM.leafletUtil.getLayerById(pMap,layerId).addLayer( guidePoint);
            var guideLine = $scope.createGuideLine(data.fid, data.location, data.guide);
            FM.leafletUtil.getLayerById(pMap,layerId).addLayer(guideLine);
        }else {
            console.log("guide missing");
        }
    };

    //初始化不可拖动的marker
    $scope.initEneditablePoiInMap = function (data, layerId, iconStyle) {
        var editPoi = $scope.createPoiFeature(data, iconStyle);
        editPoi.parentLayer = layerId;
        FM.leafletUtil.getLayerById(pMap, layerId).addLayer(editPoi);
        editPoi.openPopup();
        pMap.setView([editPoi._latlng.lat, editPoi._latlng.lng], 17);
        if (data.guide && layerId == "poiEditLayer") {
            var guidePoint = $scope.createGuidePoint(data.fid, data.guide);
            FM.leafletUtil.getLayerById(pMap, layerId).addLayer(guidePoint);
            var guideLine = $scope.createGuideLine(data.fid, data.location, data.guide);
            FM.leafletUtil.getLayerById(pMap, layerId).addLayer(guideLine);
        } else {
            console.log("guide missing");
        }
    };

    //接收基础的poi信息并显示
    $scope.$on("loadup_poiMap",function (event, data) {
        FM.leafletUtil.clearMapLayer(pMap,"poiEditLayer");
        if(data.lifecycle == 1){
            $scope.initEneditablePoiInMap(data,"poiEditLayer","redIcon");
        }else {
            $scope.initEditablePoiInMap(data,"poiEditLayer","redIcon");
        }
    });

    //接收父信息并显示
    $scope.$on("showParentPoiInMap",function (event, data) {
        FM.leafletUtil.clearMapLayer(pMap,"parentPoiLayer");
        if(data.lifecycle == 1){
            $scope.initEneditablePoiInMap(data,"parentPoiLayer","blueIcon");
        }else if(data.lifecycle == 2||data.lifecycle == 3) {
            $scope.initEditablePoiInMap(data,"parentPoiLayer","blueIcon");
        }else {
            console.log("wrong data !");
        }
    });

    //接收子poi信息并显示
    $scope.$on("showChildrenPoisInMap",function (event, datas) {
        FM.leafletUtil.clearMapLayer(pMap,"childPoiLayer");
        for(var i = 0;i<datas.length;i++){
            if(datas[i].lifecycle == 1){
                $scope.initEneditablePoiInMap(datas[i],"childPoiLayer","greenIcon");
            }else if(datas[i].lifecycle == 2||datas[i].lifecycle == 3) {
                $scope.initEditablePoiInMap(datas[i],"childPoiLayer","greenIcon");
            }else {
                console.log("wrong datas !");
            }
        }
    });

    //高亮显示指定的子poi
    $scope.$on("highlightChildInMap",function (event, poiFid) {
        var marker = FM.leafletUtil.getLayerById(pMap,poiFid);
        marker.openPopup();
    });

    //接收同位点信息并显示
    $scope.$on("showSamePoiInMap",function (event, data) {
        $scope.highlightFeatureInMap(data);
    });


});