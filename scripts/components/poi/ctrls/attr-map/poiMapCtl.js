angular.module('app').controller('poiMapCtl', function ($http,$scope) {
    //初始化地图
    pMap = L.map('NaviMap_container', {
        attributionControl: false,
        zoomControl: false
    }).setView([40.012834, 116.476293], 17);

    //加载各个图层
    FM.leafletUtil.loadLayers(pMap);

    //加载地图的道路数据
    $scope.loadNavBaseData = function () {
        FM.leafletUtil.clearMapLayer(pMap,"navBaseLayer");
        var mapBounds = FM.leafletUtil.getMapBounds(pMap);
        var cond = "POLYGON((" + mapBounds.join(",") + "))";
        FM.dataApi.getFromHbase.get("poi/getlink", cond, function (data) {
            FM.leafletUtil.showLinkInMap("navBaseLayer", data, "rdLink");
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

    //选择同位点
    $scope.selectSamePoi = function ($event) {
        var pois = [];
        pois.push($event.target);
        for (var key in FM.layerConf) {
            if (key != $event.target.parentLayer) {
                var layers = FM.leafletUtil.getLayerById(pMap,key);
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
            FM.leafletUtil.highlightFeatureInMap(data[0]);
        } else if (data.length > 1) {
            $scope.$emit("samePois", data);//将同位点数据抛给父页面，显示在popover中
        }
    };

    //创建一个能点击的同位点
    $scope.createSamePointFeature = function (poiJson,iconName) {
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
            var poiLayer = $scope.createSamePointFeature(poiArray[i],"dotIcon");
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
        FM.dataApi.ajax.get("editsupport/poi/query",param,function (data) {
            if (data.errcode == 0) {
                FM.leafletUtil.getLayerById(pMap,"mainPoiLayer").clearLayers();
                $scope.showPoisInMap("mainPoiLayer",data.data.data);
            } else {
                console.log("wrong request!")
            }
        })
    };

    $scope.loadNavBarControl = function (map) {
        var navBar = L.control.navbar();
        navBar.id = "navbar";
        navBar.__proto__._resetMap = function () {
            var poiJson = FM.mapConf.pPoiJson;
            FM.leafletUtil.clearMapLayer(map,"poiEditLayer");
            if(poiJson.lifecycle == 1){
                FM.leafletUtil.createEneditablePoiInMap(poiJson,"poiEditLayer","redIcon");
            }else {
                FM.leafletUtil.createEditablePoiInMap(poiJson,"poiEditLayer","redIcon");
            }
        };
        navBar.addTo(map);
    };

    $scope.loadRelatedLayer = function (layerId, dataArray, title) {
        console.log("aaaaaaa");
    };

    $scope.initDrawControl = function (map, data) {
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
                var param = {
                    projectId: data.projectId,
                    condition: cond,
                    phase:"4",
                    featcode: data.featCode,
                    type: "snapshot",
                    pagesize: 0
                };
                FM.dataApi.ajax.get("editsupport/poi/query",param,function (data) {
                    if (data.errcode == 0) {
                        var ret = data.data.data;
                        if (ret.length == 0) {
                            FM.leafletUtil.getLayerById(pMap, "rectChooseLayer").clearLayers();
                        } else {
                            $scope.$emit("drawPois",ret);
                            $scope.showPoisInMap("parentPoiLayer", ret);
                        }
                    } else {
                        ret = [];
                        console.log("wrong request!")
                    }
                });
            }
            FM.leafletUtil.getLayerById(pMap, "rectChooseLayer").addLayer(layer);
        });
    };

    $scope.initSearchControl = function (data) {
        var layer = FM.leafletUtil.getLayerById(pMap,"mainPoiLayer");
        var controlSearch = new L.Control.Search({data: data, initial: false, position:'topright'});
        controlSearch.__proto__.searchPoiAround = function (type,val,data) {
            var loc = FM.mapConf.pLocation;
            if (!loc) {
                loc = FM.leafletUtil.latLngToLoc(pMap.getCenter());
            }
            var condObj;
            if (type == "名称") {
                condObj = {
                    "$and": [{
                        "loc": {
                            "$near": {
                                "$geometry": {
                                    "type": "Point",
                                    "coordinates": [loc.longitude, loc.latitude]
                                },
                                "$maxDistance": FM.mapConf.geomRadius
                            }
                        }
                    }, {
                        "lifecycle": {
                            "$ne": 1
                        }
                    }, {
                        "$or": [{
                            "name": {
                                "$regex": val
                            }
                        }, {
                            "name": {
                                "$regex": App.Util.ToDBC(val)
                            }
                        }]
                    }]
                };
            } else if (type == "分类") {
                var tmp = new Array();
                for (var key in data.kindFormat) {
                    if (data.kindFormat[key].kindName.indexOf(val) >= 0) {
                        tmp.push(key);
                    }
                }
                condObj = {
                    "loc": {
                        "$near": {
                            "$geometry": {
                                "type": "Point",
                                "coordinates": [loc.longitude, loc.latitude]
                            },
                            "$maxDistance": FM.mapConf.geomRadius
                        }
                    },
                    "kindCode": {
                        '$in': tmp
                    },
                    "lifecycle": {
                        "$ne": 1
                    }
                };
            } else if (type == "FID") {
                condObj = {
                    "fid": val,
                    "lifecycle": {
                        "$ne": 1
                    }
                };
            } else {
                condObj = {
                    "loc": {
                        "$near": {
                            "$geometry": {
                                "type": "Point",
                                "coordinates": [loc.longitude, loc.latitude]
                            },
                            "$maxDistance": FM.mapConf.geomRadius
                        }
                    },
                    "lifecycle": {
                        "$ne": 1
                    }
                };
            }
            var param = {
                projectId: data.projectId,
                condition: condObj,
                phase: "4",
                featcode: data.featCode,
                type: "snapshot",
                pagesize: 0
            };
            FM.dataApi.ajax.get("editsupport/poi/query", param, function (data) {
                if (data.errcode == 0) {
                    var ret = data.data.data;
                    if (ret.length == 0) {
                        console.log("no data!");
                    } else {
                        $scope.$emit("searchPois",ret);
                        $scope.showPoisInMap("parentPoiLayer", ret);
                    }
                } else {
                    console.log("wrong request!");
                }
            });
        };
        pMap.addControl(controlSearch);
    };

    $scope.initCheckboxControl = function (data) {
        var controlSearch = new L.Control.Checkbox({data: data, initial: false, position:'topleft'});
        pMap.addControl(controlSearch);
    };

    $scope.loadZoomControl = function (map) {
        L.control.zoom({//左上角的zoom
            position: 'topleft',
            zoomInTitle: '放大',
            zoomOutTitle: '缩小'
        }).addTo(map);
    };

    $scope.loadLayerControl = function (map) {
        var overLayers = {
            "道路": FM.leafletUtil.getLayerById(map,"navBaseLayer"),
            "腾讯": FM.leafletUtil.getLayerById(map,"qqLayer")
        };
        L.control.layers('', overLayers).addTo(map);//右上角的图层
    };

    $scope.loadControls = function (map, data) {
        $scope.loadLayerControl(map);
        $scope.loadNavBarControl(map);
        $scope.initDrawControl(map,data);
        $scope.initSearchControl(data);
        $scope.initCheckboxControl(data);
    };

    //接收基础的poi信息并显示
    $scope.$on("loadup_poiMap", function (event, data) {
        if (!(FM.mapConf.pPoiJson && FM.mapConf.pPoiJson == data.data)) {//防止重复加载
            FM.mapConf.pPoiJson = data.data;
            FM.leafletUtil.clearMapLayer(pMap, "poiEditLayer");
            if (data.data.lifecycle == 1) {
                FM.leafletUtil.createEneditablePoiInMap(data.data, "poiEditLayer", "redIcon");
            } else {
                FM.leafletUtil.createEditablePoiInMap(data.data, "poiEditLayer", "redIcon");
                $scope.loadControls(pMap, data);
                console.log(data);
            }
            $scope.loadTaskPoiData(data.projectId, data.featcode);
            FM.mapConf.singeton = 1;
        }
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
        $scope.FM.leafletUtil(data);
    });


});