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
            FM.leafletUtil.getLayerById(pMap,layerId).addLayer(poiLayer);
        }
    };

    //创建视野范围内其他的poi点
    $scope.loadTaskPoiData = function (projectId,featcode) {
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
            projectId: projectId,
            condition: cond,
            phase:"4",
            featcode: featcode,
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

    $scope.loadNavBar = function (map) {
        L.control.navbar().addTo(map);
    };

    $scope.searchPoiInMap = function (cond,data, callback) {
        var param = {
            projectId: data.projectId,
            condition: cond,
            phase:"4",
            featcode: data.featCode,
            type: "snapshot",
            pagesize: 0
        };
        FM.dataApi.ajax.post("editsupport/poi/query",param,function (data) {
            var ret;
            if (data.errcode == 0) {
                ret = data.data.data;
            } else {
                ret = [];
                console.log("wrong request!")
            }
            if (callback) {
                callback(ret);
            }
        });
    };
    
    $scope.loadRelatedLayer = function (layerId, dataArray, title) {
        console.log("aaaaaaa");
    };

    $scope.initDraw = function (map, data) {
        // Set the title to show on the polygon button
        L.drawLocal.draw.toolbar.buttons.marker = '打点';
        L.drawLocal.draw.toolbar.buttons.polygon = '画多边形';
        //L.drawLocal.draw.toolbar.buttons.polyline = '画线';
        L.drawLocal.draw.toolbar.buttons.rectangle = '画矩形';
        //L.drawLocal.draw.toolbar.buttons.circle = '画圆';


        var drawControl = new L.Control.Draw({
            position: 'topleft',
            draw: {
                polyline: false,
                polygon: {
                    allowIntersection: false,
                    showArea: true,
                    drawError: {
                        color: '#b00b00',
                        timeout: 1000
                    },
                    shapeOptions: {
                        color: '#bada55'
                    }
                },
                circle: false,
                marker: {
                    draggable: true
                }
            }
        });
        map.addControl(drawControl);
        map.on('draw:created', function (e) {
            var type = e.layerType,
                layer = e.layer;
            layer.id = "drawlayer";
            if (type === 'marker') {
                layer.bindPopup('新增点');
                layer.options.draggable = true;
            }
            else if (type === "rectangle" || type === 'polygon') {
                FM.leafletUtil.getLayerById(pMap, "drawnItems").clearLayers();
                var pointsArray = [];
                var ppArray = [];
                for (var i = 0; i < layer._latlngs.length; i++) {
                    pointsArray.push([layer._latlngs[i].lng, layer._latlngs[i].lat]);
                }
                pointsArray.push([layer._latlngs[0].lng, layer._latlngs[0].lat]);
                ppArray.push(pointsArray);
                var cond = {
                    "loc": {
                        "$geoWithin": {
                            "$geometry": {
                                "type": "Polygon",
                                "coordinates": ppArray
                            }
                        }
                    }
                };
                $scope.searchPoiInMap(cond, data, function (data) {
                    if (data.length == 0) {
                        FM.leafletUtil.getLayerById(pMap, "rectChooseLayer").clearLayers();
                    } else {
                        $scope.showPoisInMap("parentPoiLayer", data);
                    }
                });
            }
            FM.leafletUtil.getLayerById(pMap, "rectChooseLayer").addLayer(layer);
        });
    };

    //接收基础的poi信息并显示
    $scope.$on("loadup_poiMap",function (event, data) {
        FM.mapConf.pPoiJson = data.data;
        FM.leafletUtil.clearMapLayer(pMap,"poiEditLayer");
        if(data.data.lifecycle == 1){
            FM.leafletUtil.createEneditablePoiInMap(data.data,"poiEditLayer","redIcon");
        }else {
            FM.leafletUtil.createEditablePoiInMap(data.data,"poiEditLayer","redIcon");
        }
        // $scope.loadTaskPoiData(data.projectId,data.featcode);
        $scope.loadNavBar(pMap);
        $scope.initDraw(pMap,data);
    });

    //接收父信息并显示
    $scope.$on("showParentPoiInMap",function (event, data) {
        FM.leafletUtil.clearMapLayer(pMap,"parentPoiLayer");
        if(data.lifecycle == 1){
            FM.leafletUtil.createEneditablePoiInMap(data,"parentPoiLayer","blueIcon");
        }else if(data.lifecycle == 2||data.lifecycle == 3) {
            FM.leafletUtil.createEditablePoiInMap(data,"parentPoiLayer","blueIcon");
        }else {
            console.log("wrong data !");
        }
    });

    //接收子poi信息并显示
    $scope.$on("showChildrenPoisInMap",function (event, datas) {
        FM.leafletUtil.clearMapLayer(pMap,"childPoiLayer");
        for(var i = 0;i<datas.length;i++){
            if(datas[i].lifecycle == 1){
                FM.leafletUtil.createEneditablePoiInMap(datas[i],"childPoiLayer","greenIcon");
            }else if(datas[i].lifecycle == 2||datas[i].lifecycle == 3) {
                FM.leafletUtil.createEditablePoiInMap(datas[i],"childPoiLayer","greenIcon");
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