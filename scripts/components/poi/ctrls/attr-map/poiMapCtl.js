angular.module('app').controller('poiMapCtl', function ($scope) {
    //初始化地图
    pMap = L.map('NaviMap_container', {
        attributionControl: false,
        zoomControl: false
    }).setView([40.012834, 116.476293], 17);
    //加载各个图层
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
        L.control.layers('', overLayers).addTo(map);//右上角的图层
        L.control.zoom({//左上角的zoom
            position: 'topleft',
            zoomInTitle: '放大',
            zoomOutTitle: '缩小'
        }).addTo(map);
    };

    //获取地图边界
    $scope.getMapBounds = function (map) {
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
    };
    $scope.loadLayers(pMap);

    //初始化线型
    $scope.initLines = function () {
        var lineList = {};
        lineList.line1 = {
            color: "#FFA8FF",
            opacity: 0.5,
            weight: 2
        },
            lineList.line2 = {
                color: "#F0DFFF",
                opacity: 0.5,
                weight: 2
            },
            lineList.line3 = {
                color: "#FF8F8F",
                opacity: 0.5,
                weight: 2
            },
            lineList.line4 = {
                color: "#FFD247",
                opacity: 0.5,
                weight: 2
            },
            lineList.line6 = {
                color: "#99E865",
                opacity: 0.5,
                weight: 2
            },
            lineList.line7 = {
                color: "#D1A87F",
                opacity: 0.5,
                weight: 2
            },
            lineList.line8 = {
                color: "#E7E7BB",
                opacity: 0.5,
                weight: 2
            },
            lineList.line9 = {
                color: "#232323",
                opacity: 0.5,
                weight: 2
            },
            lineList.line10 = {
                color: "#8FE3FF",
                opacity: 0.5,
                weight: 2
            },
            lineList.line99 = { //测线
                color: "#2F39C8",
                opacity: 0.5,
                weight: 2
            }
        return lineList;
    };

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
        var lineList = $scope.initLines();
        var lstype;
        switch (kind) {
            case 1:
                lstype = lineList.line1;
                break;
            case 2:
                lstype = lineList.line2;
                break;
            case 3:
                lstype = lineList.line3;
                break;
            case 4:
                lstype = lineList.line4;
                break;
            case 6:
                lstype = lineList.line6;
                break;
            case 7:
                lstype = lineList.line7;
                break;
            case 8:
                lstype = lineList.line9;
                break;
            case 10:
                lstype = lineList.line10;
                break;
            case 99:
                lstype = lineList.line99;
                break;
            default:
                lstype = lineList.line10;
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
        var mapBounds = $scope.getMapBounds(pMap);
        var cond = "POLYGON((" + mapBounds.join(",") + "))";
        FM.dataApi.getFromHbase.get("poi/getlink", cond, function (data) {
            $scope.showLinkInMap("navBaseLayer", data, "rdLink");
        });
    };


    $scope.loadNewData = function () {
        document.getElementById('zoomLevelBar').innerHTML = "缩放等级:" + pMap.getZoom();
        if (pMap.getZoom() > 13) {
            $scope.loadNavBaseData();
        }
    };
    pMap.on("moveend", $scope.loadNewData);

});