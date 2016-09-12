/**
 * Created by liuyang on 2016/9/9.
 */
var rdLineApp = angular.module("app");
rdLineApp.controller("rdLaneTopoCtrl",['$scope', function ($scope) {
    /***********************************地图相关配置以及外部js注入***********************************/

    var layerCtrl = fastmap.uikit.LayerController();
    var eventCtrl = fastmap.uikit.EventController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var mapZoomPoint = [40.012834, 116.476293];
    //初始化地图;
    var laneTopo = featCodeCtrl.getFeatCode().laneTopo;//当前修改的分歧的类型;
    var linkArr = [];
    var laneArr = []
    for(var i = 0;i<laneTopo.length;i++){
        for(var j = 0;j<laneTopo[i].laneInfos.length;j++){
            if(laneTopo[i].laneInfos[j].geometry.type == "LineString"){
                linkArr.push(laneTopo[i].laneInfos[j].geometry);
                laneArr = laneArr.concat(laneTopo[i].laneInfos[j].lanes);
            }
        }
    }
    topoMap = new L.Map('topoMap', {
        attributionControl: false,
        doubleClickZoom: false,
        zoomControl: false
    });
    var polyLines = new L.layerGroup();
    var miniPolyLines = new L.layerGroup();
    polyLines.id = "polyLines";
    miniPolyLines.id = "miniPolyLines";
    for(var i=0;i<linkArr.length;i++){
        var geo = [];
        for(var j = 0;j<linkArr[i].coordinates.length;j++){
            geo.push({
                lng:linkArr[i].coordinates[j][0],
                lat:linkArr[i].coordinates[j][1]
            });
        }
        var guideLine = L.polyline(geo, {
            color: 'red',
            weight: 5,
            id:"guideLine"
        });
        var miniLine = L.polyline(geo, {
            color: 'red',
            weight: 5,
            id:"miniLine"
        });
        polyLines.addLayer(guideLine);
        miniPolyLines.addLayer(miniLine);
    }
    topoMap.addLayer(polyLines);


    topoMap.setView([linkArr[0].coordinates[0][1], linkArr[0].coordinates[0][0]], 17);
    var miniMap = new L.Control.MiniMap(miniPolyLines, { width: 200,
        height: 200,toggleDisplay: true,strings: {
            hideText: '隐藏小地图',
            showText: '显示小地图'
        },position: 'bottomleft'}).addTo(topoMap);
    //防止地图视口加载不全;
    topoMap.on('resize', function () {
        setTimeout(function () {
            topoMap.invalidateSize()
        }, 400);
    });


    $scope.doCancel = function () {
        $scope.$emit("CLOSERDLANETOPO");
    };
    //对要加载的图层事件监听;
    // layerCtrl.eventController.on(eventCtrl.eventTypes.LAYERONSHOW, function (event) {
    //     for (var layer in event.layer) {
    //         topoMap.addLayer(event.layer[layer]);
    //     }
    // });
    //设置要加载显示的图层;
    // layerCtrl.setLayersVisible(['rdLink']);
    //layerCtrl.setLayersVisible(['mesh']);


}]);