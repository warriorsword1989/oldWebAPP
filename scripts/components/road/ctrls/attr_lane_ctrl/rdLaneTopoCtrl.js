/**
 * Created by liuyang on 2016/9/9.
 */
var rdLineApp = angular.module("app");
/*
* 动态拼的div作用域在controllor之外，只能写到这里
* */
var featCodeCtrl = fastmap.uikit.FeatCodeController();
var inLanePid = null;
var outLanePid = null;
var outLinkPid = null;
var laneTopoVias = [];
var inLinkPid  = featCodeCtrl.getFeatCode().rdLaneData.linkPids[0];
function selectLane (linkPid, lanePid, seqNum, laneDir) {
    if (linkPid == inLinkPid) {//进入车道
        inLanePid = lanePid;
    } else {//作为退出线、经过线
        outLanePid = lanePid;
        outLinkPid = linkPid;
        laneTopoVias.push({
            lanePid: lanePid,
            seqNum: seqNum,
            linkPid: linkPid
        })
    }
};
rdLineApp.controller("rdLaneTopoCtrl", ['$scope', '$compile', 'dsEdit', '$sce','$timeout', function ($scope, $compile, dsEdit, $sce ,$timeout) {
    /***********************************地图相关配置以及外部js注入***********************************/

    var layerCtrl = fastmap.uikit.LayerController();
    var eventCtrl = fastmap.uikit.EventController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var relationData = layerCtrl.getLayerById('relationData');
    //初始化地图;
    var laneTopo = featCodeCtrl.getFeatCode().laneTopo;//当前修改的分歧的类型;
    var laneInfoArr = [];

    var rdLaneTopoDetail = {
        topoIds: [],
        inLinkPid: null,
        inNodePid: null,
        laneTopoInfos: []
    };
    $scope.doClose = function () {
        $scope.$emit("CLOSERDLANETOPO");
        featCodeCtrl.setFeatCode(null);
    };
    $scope.doCreate = function () {
        for (var i = 0; i < laneTopoVias.length; i++) {
            if (laneTopoVias[i].lanePid == outLanePid) {
                laneTopoVias.splice(i, 1);
                i--;
            }
        }
        rdLaneTopoDetail.laneTopoInfos.push({
            inLanePid: inLanePid,
            outLanePid: outLanePid,
            outLinkPid: outLinkPid,
            laneTopoVias: laneTopoVias
        });
    };
    $scope.doSave = function () {
        var param = {
            "command": "BATCH",
            "type": "RDLANETOPODETAIL",
            "dbId": App.Temp.dbId,
            "data": rdLaneTopoDetail
        };
        //调用编辑接口;
        dsEdit.save(param).then(function (data) {
            if (data != null) {
                relationData.redraw();
                $scope.doClose();
            }
        });
    };
    $scope.rdLaneData = featCodeCtrl.getFeatCode().rdLaneData;

    var inLinkPid = $scope.rdLaneData.linkPids[0];//进入线
    rdLaneTopoDetail.inLinkPid = $scope.rdLaneData.linkPids[0];
    rdLaneTopoDetail.inNodePid = $scope.rdLaneData.nodePid;

    for (var i = 0; i < laneTopo.length; i++) {
        for (var j = 0; j < laneTopo[i].laneInfos.length; j++) {
            if (laneTopo[i].laneInfos[j].geometry.type == "LineString") {
                laneInfoArr.push(laneTopo[i].laneInfos[j]);
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

    for (var i = 0; i < laneInfoArr.length; i++) {
        var linkPid = laneInfoArr[i].linkPid;
        var geo = [];
        for (var j = 0; j < laneInfoArr[i].geometry.coordinates.length; j++) {
            geo.push({
                lng: laneInfoArr[i].geometry.coordinates[j][0],
                lat: laneInfoArr[i].geometry.coordinates[j][1]
            });
        }
        if (laneInfoArr[i].linkPid == inLinkPid) {
            var guideLine = L.polyline(geo, {
                color: 'red',
                weight: 5,
                id: "guideLine"
            });
        } else {
            var guideLine = L.polyline(geo, {
                color: '#AE8F00',
                weight: 5,
                id: "guideLine"
            });
        }

        var miniLine = L.polyline(geo, {
            color: 'red',
            weight: 3,
            id: "miniLine"
        });
        polyLines.addLayer(guideLine);
        miniPolyLines.addLayer(miniLine);

        var lanes1Arr = [], lanes2Arr = [], lanes3Arr = [];
        for (var j = 0; j < laneInfoArr[i].lanes.length; j++) {
            if (laneInfoArr[i].lanes[j].laneDir == 1) {
                lanes1Arr.push(laneInfoArr[i].lanes[j]);
            } else if (laneInfoArr[i].lanes[j].laneDir == 2) {
                lanes2Arr.push(laneInfoArr[i].lanes[j]);
            } else {
                lanes3Arr.push(laneInfoArr[i].lanes[j]);
            }
        }
        if (lanes1Arr.length > 0) {
            var kk = (laneInfoArr[i].geometry.coordinates[0][0] - laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length - 1][0]) / (laneInfoArr[i].geometry.coordinates[0][1] - laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length - 1][1]);
            // var distance = (L.latLng(laneInfoArr[i].geometry.coordinates[0][1],laneInfoArr[i].geometry.coordinates[0][0])).distanceTo(L.latLng(laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length-1][1],laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length-1][0]))
            var deg = Math.round(Math.atan(Math.abs(kk)) * 180 / Math.PI) + 180;//旋转角度
            // var scale = distance/150;
            var _width = lanes1Arr.length * 30 + 20;
            var xtrans = _width / 2 * Math.sin(deg);
            var ytrans = _width / 2 * Math.cos(deg);
            var html = "<div class ='lane-img-container' style='width:" + _width + "px;transform: translateX(" + xtrans + "px);transform: translateX(" + ytrans + "px);-webkit-transform:rotate(" + deg + "deg);'>";
            html += "<div class='roadside-left'>";
            html += "</div>";
            for (var k = 0; k < lanes1Arr.length; k++) {
                var lanePid = lanes1Arr[k].pid;
                var seqNum = lanes1Arr[k].seqNum;
                var laneDir = lanes1Arr[k].laneDir;
                var arrowDir = lanes1Arr[k].arrowDir;
                var m = k + 1;
                html += "<div class='lane-driveway'>";
                html += "<span class='top'>" + m + "</span>";
                html += "<div class='middle'>";
                html += "<img src='../../../images/road/1301/1301_0_" + arrowDir + ".svg' style='width: 30px;height:30px;'/>";
                html += "</div>";
                html += "<input class='bottom' type='checkbox' style='margin:" + 0 + "px' onclick='selectLane(" + linkPid + ',' + lanePid + ',' + seqNum + ',' + laneDir + ");'>";
                html += "</div>";
            }
            html += "<div class='roadside-right'></div>";
            html += "</div>";
            var myIcon = L.divIcon({
                // iconAnchor:[0,50],
                iconSize:[0,0],
                // html:$sce.trustAsHtml(html),
                //html: $compile(html)($scope)
                html: html
            });
            L.marker([(laneInfoArr[i].geometry.coordinates[0][1] + laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length - 1][1]) / 2, (laneInfoArr[i].geometry.coordinates[0][0] + laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length - 1][0]) / 2], {icon: myIcon}).addTo(topoMap);

        } else {
            if (lanes2Arr.length > 0) {
                var kk = (laneInfoArr[i].geometry.coordinates[0][0] - laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length - 1][0]) / (laneInfoArr[i].geometry.coordinates[0][1] - laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length - 1][1]);
                var deg = Math.round(Math.atan(Math.abs(kk)) * 180 / Math.PI);//旋转角度
                var _width = lanes2Arr.length * 30 + 20;
                var xtrans = _width / 2 * Math.sin(deg);
                var ytrans = _width / 2 * Math.cos(deg);
                var html = "<div class ='lane-img-container' style='width:" + _width + "px;-webkit-transform:rotate(" + deg + "deg);transform-origin:left'>";
                html += "<div class='roadside-left'>";
                html += "</div>";
                for (var k = 0; k < lanes2Arr.length; k++) {
                    var lanePid = lanes2Arr[k].pid;
                    var seqNum = lanes2Arr[k].seqNum;
                    var laneDir = lanes2Arr[k].laneDir;
                    var arrowDir = lanes2Arr[k].arrowDir;
                    var m = k + 1;
                    html += "<div class='lane-driveway'>";
                    html += "<span class='top'>" + m + "</span>";
                    html += "<div class='middle'>";
                    html += "<img src='../../../images/road/1301/1301_0_" + arrowDir + ".svg' style='width: 30px;height:30px;'/>";
                    html += "</div>";
                    html += "<input class='bottom' type='checkbox' style='margin:" + 0 + "px' onclick='selectLane(" + linkPid + ',' + lanePid + ',' + seqNum + ',' + laneDir + ");'>";
                    html += "</div>";
                }
                html += "<div class='roadside-right'></div>";
                html += "</div>";
                var myIcon = L.divIcon({
                    // iconAnchor:[0,50],
                    html: html
                });
                L.marker([(laneInfoArr[i].geometry.coordinates[0][1] + laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length - 1][1]) / 2, (laneInfoArr[i].geometry.coordinates[0][0] + laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length - 1][0]) / 2], {icon: myIcon}).addTo(topoMap);

            } else if (lanes3Arr.length > 0) {
                var kk = (laneInfoArr[i].geometry.coordinates[0][0] - laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length - 1][0]) / (laneInfoArr[i].geometry.coordinates[0][1] - laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length - 1][1]);
                var deg = Math.round(Math.atan(Math.abs(kk)) * 180 / Math.PI) + 180;//旋转角度
                var _width = lanes3Arr.length * 30 + 20;
                var xtrans = _width / 2 * Math.sin(deg);
                var ytrans = _width / 2 * Math.cos(deg);
                var html = "<div class ='lane-img-container' style='width:" + _width + "px;-webkit-transform:rotate(" + deg + "deg);transform-origin:right'>";
                html += "<div class='roadside-left'>";
                html += "</div>";
                for (var k = 0; k < lanes3Arr.length; k++) {
                    var lanePid = lanes3Arr[k].pid;
                    var seqNum = lanes3Arr[k].seqNum;
                    var laneDir = lanes3Arr[k].laneDir;
                    var arrowDir = lanes3Arr[k].arrowDir;
                    var m = k + 1;
                    html += "<div class='lane-driveway'>";
                    html += "<span class='top'>" + m + "</span>";
                    html += "<div class='middle'>";
                    html += "<img src='../../../images/road/1301/1301_0_" + arrowDir + ".svg' style='width: 30px;height:30px;'/>";
                    html += "</div>";
                    html += "<input class='bottom' type='checkbox' style='margin:" + 0 + "px' onclick='selectLane(" + linkPid + ',' + lanePid + ',' + seqNum + ',' + laneDir + ");'>";
                    html += "</div>";
                }
                html += "<div class='roadside-right'></div>";
                html += "</div>";
                var myIcon = L.divIcon({
                    // iconAnchor:[0,50],
                    html: html
                });
                L.marker([(laneInfoArr[i].geometry.coordinates[0][1] + laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length - 1][1]) / 2, (laneInfoArr[i].geometry.coordinates[0][0] + laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length - 1][0]) / 2], {icon: myIcon}).addTo(topoMap);
            }
        }
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



}]);