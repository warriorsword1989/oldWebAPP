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
    //初始化地图;
    var laneTopo = featCodeCtrl.getFeatCode().laneTopo;//当前修改的分歧的类型;
    var laneInfoArr = [];
    var laneArr = [];
    $scope.doCancel = function () {
        $scope.$emit("CLOSERDLANETOPO");
        featCodeCtrl.setFeatCode(null);
    };
    $scope.rdLaneData = featCodeCtrl.getFeatCode().rdLaneData;
    for(var i = 0;i<laneTopo.length;i++){
        for(var j = 0;j<laneTopo[i].laneInfos.length;j++){
            if(laneTopo[i].laneInfos[j].geometry.type == "LineString"){
                laneInfoArr.push(laneTopo[i].laneInfos[j]);
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
    for(var i=0;i<laneInfoArr.length;i++){
        var geo = [];
        for(var j = 0;j<laneInfoArr[i].geometry.coordinates.length;j++){
            geo.push({
                lng:laneInfoArr[i].geometry.coordinates[j][0],
                lat:laneInfoArr[i].geometry.coordinates[j][1]
            });
        }
        if(laneInfoArr[i].linkPid == $scope.rdLaneData.linkPids[0]){
            var guideLine = L.polyline(geo, {
                color: '#FF0000',
                weight: 5,
                id:"guideLine"
            });
        } else {
            var guideLine = L.polyline(geo, {
                color: '#AE8F00',
                weight: 5,
                id:"guideLine"
            });
        }

        var miniLine = L.polyline(geo, {
            color: 'red',
            weight: 5,
            id:"miniLine"
        });
        polyLines.addLayer(guideLine);
        miniPolyLines.addLayer(miniLine);
        var _width = laneInfoArr[i].lanes.length *30 +20;
        var html = "<div class ='lane-img-container' style='width: 90px;>";
        html += "<div class='roadside-left'>";
        html +=  "</div>";
        for(var k =0;k<laneInfoArr[i].lanes.length;k++){
            var m = k+1;
            html += "<div class='lane-driveway'>";
            html += "<span class='top'>"+m+"</span>";
            html += "<div class='middle'>";
            html += "<img src='../../../images/road/1301/1301_0_"+m+".svg' style='width: 30px;height:30px;'/>";
            html += "</div>";
            html += "<span class='bottom' click='removeLane("+m+");' ng-if='laneArr.length!=1'>";
            html += "<i class='glyphicon glyphicon-remove'></i>";
            html += "</span>";
            html += "</div>";
        }
        html += "<div class='roadside-right'></div>";
        html += "</div>";
        var myIcon = L.divIcon({
            iconSize:new L.point(_width,_width),
            html:html});
        L.marker([laneInfoArr[i].geometry.coordinates[0][1], laneInfoArr[i].geometry.coordinates[0][0]],{icon:myIcon}).addTo(topoMap);
    }


    topoMap.addLayer(polyLines);



    topoMap.setView([laneInfoArr[0].geometry.coordinates[0][1], laneInfoArr[0].geometry.coordinates[0][0]], 17);
    var miniMap = new L.Control.MiniMap(miniPolyLines, {
        width: 200,
        height: 200,
        toggleDisplay: true,
        strings: {
            hideText: '隐藏小地图',
            showText: '显示小地图'
        },
        position: 'bottomleft'
    }).addTo(topoMap);
    //防止地图视口加载不全;
    topoMap.on('resize', function () {
        setTimeout(function () {
            topoMap.invalidateSize()
        }, 400);
    });



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