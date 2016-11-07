/**
 * Created by liuyang on 2016/9/9.
 */
var rdLaneTopoApp = angular.module("app");
/*
* 动态拼的div作用域在controllor之外，只能写到这里
* */
// var featCodeCtrl = fastmap.uikit.FeatCodeController();
var inLanePid = null;
var outLanePid = null;
var outLinkPid = null;
var laneTopoVias = [];
function selectLane (self,inLinkPid,linkPid, lanePid, laneDir) {
    if(self.checked == true){
        if (linkPid == inLinkPid) {//进入车道,只能选一条进入线
            if(inLanePid == null){
                inLanePid = lanePid;
                $("#"+lanePid).addClass('red');
            }else {
                $("#"+inLanePid).removeClass('red');
                $("#checkbox"+inLanePid).prop({
                    checked:false
                });
                inLanePid = lanePid;
                $("#"+lanePid).addClass('red');
                $("#checkbox"+lanePid).prop({
                    checked:true
                });
            }
        } else {//作为退出线、经过线
            outLanePid = lanePid;
            outLinkPid = linkPid;
            laneTopoVias.push({
                lanePid: lanePid,
                seqNum: laneTopoVias.length+1,
                linkPid: linkPid
            });
            $("#"+lanePid).addClass('green');
            $("#label"+lanePid).text(laneTopoVias.length);
            modifyNums();
        }
    } else {
        if (linkPid == inLinkPid) {//进入车道
            inLanePid = null;//清空进入车道
            $("#"+lanePid).removeClass('red');
        } else if(linkPid == outLinkPid){//退出线
            laneTopoVias.splice(laneTopoVias.length-1, 1);
            if(laneTopoVias.length >0){
                outLinkPid = laneTopoVias[laneTopoVias.length-1].linkPid;
            } else {
                outLinkPid = null;
            }
            $("#"+lanePid).removeClass('green');

            $("#label"+lanePid).text("");
            modifyNums();
        } else {//经过线
            for (var i = 0; i < laneTopoVias.length; i++) {
                if (laneTopoVias[i].lanePid == outLanePid) {
                    laneTopoVias.splice(i, 1);
                    i--;
                }
            }
            $("#"+lanePid).removeClass('green');
            $("#label"+lanePid).text("");
            modifyNums();
        }
    }
}
function modifyNums() {
    for (var i = 0; i < laneTopoVias.length; i++) {
        laneTopoVias[i].seqNum = i+1;
        $("#label"+laneTopoVias[i].lanePid).text(laneTopoVias[i].seqNum.toString());
    }
}

rdLaneTopoApp.controller("rdLaneTopoCtrl", ['$scope', '$compile', 'dsEdit', '$sce','$timeout', function ($scope, $compile, dsEdit, $sce ,$timeout) {
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    var layerCtrl = fastmap.uikit.LayerController();
    var eventCtrl = fastmap.uikit.EventController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var relationData = layerCtrl.getLayerById('relationData');
    //初始化地图;
    var laneTopo = featCodeCtrl.getFeatCode().laneTopo;//服务返回的数据;
    $scope.rdLaneData = featCodeCtrl.getFeatCode().rdLaneData;//创建前保留的数据
    $scope.laneInfoArr = laneTopo[0].laneInfos;//所有的详细车道
    $scope.laneTopoInfoArr = laneTopo[0].laneTopoInfos;//所有的原始的车道连通
    $scope.deleteLaneTopoArr = [];//所有的删除的车道连通
    $scope.insertLaneTopoArr = [];//所有的新增的车道连通
    $scope.showLaneDetail = false;
    $scope.laneDetail = null;
    var rdLaneTopoDetail = {
        topoIds: [],
        inLinkPid: null,
        inNodePid: null,
        laneTopoInfos: []
    };
    var inLinkPid = $scope.rdLaneData.linkPids[0];//进入线
    rdLaneTopoDetail.inLinkPid = $scope.rdLaneData.linkPids[0];
    rdLaneTopoDetail.inNodePid = $scope.rdLaneData.nodePid;

    $scope.showLaneDetails = function (item) {
        $scope.showLaneDetail = true;
        $scope.laneDetail = item;
    };
    $scope.clearLanes = function () {//清除车道样式
        $("#"+inLanePid).removeClass('red');
        $("#"+outLanePid).removeClass('green');
        for (var i = 0; i < laneTopoVias.length; i++) {
            $("#label"+laneTopoVias[i].lanePid).text("");
            $("#"+laneTopoVias[i].lanePid).removeClass('green');
        }
        // inLanePid = null;
        // outLanePid = null;
        // outLinkPid = null;
        // laneTopoVias = [];
    };
    $scope.checkLanes =function(){
        var checkFlag = true;
        if(inLanePid == null){
            checkFlag = false;
            swal("提示","进入线错误！","error");
            return checkFlag;
        }
        if(outLanePid == null || outLinkPid == null){
            checkFlag = false;
            swal("提示","退出线错误！","error");
            return checkFlag;
        }
        for (var i = 0;i<$scope.laneTopoInfoArr.length;i++){
            if($scope.laneTopoInfoArr[i].inLanePid == inLanePid && $scope.laneTopoInfoArr[i].outLanePid == outLanePid){
                swal("提示","车道重复！","error");
                checkFlag = false;
                return checkFlag;
            }
        }
        return checkFlag;
    };
    $scope.doClose = function () {
        $scope.$emit("CLOSERDLANETOPO");
        featCodeCtrl.setFeatCode(null);
    };
    $scope.doCreate = function () {
        $scope.clearLanes();
        laneTopoVias.splice(laneTopoVias.length-1, 1);
        var flag = $scope.checkLanes();
        if(flag){
            rdLaneTopoDetail.laneTopoInfos.push({
                inLanePid: inLanePid,
                outLanePid: outLanePid,
                outLinkPid: outLinkPid,
                laneTopoVias: laneTopoVias
            });
            $scope.insertLaneTopoArr.push({
                pid:0,
                rdLaneTopoDetail:rdLaneTopoDetail
            });
            swal("提示","创建车道连通成功！","success");
        }
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
                $scope.clearLanes();
                swal("提示","保存车道连通成功！","success");
                $scope.doClose();
            }
        });
    };



    // for (var i = 0; i < laneTopo.length; i++) {
    //     for (var j = 0; j < laneTopo[i].laneInfos.length; j++) {
    //         if (laneTopo[i].laneInfos[j].geometry.type == "LineString") {
    //             laneInfoArr.push(laneTopo[i].laneInfos[j]);
    //         }
    //     }
    //     for(var k = 0;k<laneTopo[i].laneTopoInfos.length;k++){
    //         laneTopoInfoArr.push(laneTopo[i].laneTopoInfos[k]);
    //     }
    // }
    topoMap = new L.Map('topoMap', {
        attributionControl: false,
        doubleClickZoom: false,
        zoomControl: false
    });
    var polyLines = new L.layerGroup();
    var miniPolyLines = new L.layerGroup();
    polyLines.id = "polyLines";
    miniPolyLines.id = "miniPolyLines";

    for (var i = 0; i < $scope.laneInfoArr.length; i++) {
        var linkPid = $scope.laneInfoArr[i].linkPid;
        var geo = [];
        for (var j = 0; j < $scope.laneInfoArr[i].geometry.coordinates.length; j++) {
            geo.push({
                lng: $scope.laneInfoArr[i].geometry.coordinates[j][0],
                lat: $scope.laneInfoArr[i].geometry.coordinates[j][1]
            });
        }
        if ($scope.laneInfoArr[i].linkPid == inLinkPid) {
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
        for (var j = 0; j < $scope.laneInfoArr[i].lanes.length; j++) {
            if ($scope.laneInfoArr[i].lanes[j].laneDir == 1) {
                lanes1Arr.push($scope.laneInfoArr[i].lanes[j]);
            } else if ($scope.laneInfoArr[i].lanes[j].laneDir == 2) {
                lanes2Arr.push($scope.laneInfoArr[i].lanes[j]);
            } else {
                lanes3Arr.push($scope.laneInfoArr[i].lanes[j]);
            }
        }
        if (lanes1Arr.length > 0) {
            var s_lng = $scope.laneInfoArr[i].geometry.coordinates[0][0],
                s_lat = $scope.laneInfoArr[i].geometry.coordinates[0][1],
                e_lng = $scope.laneInfoArr[i].geometry.coordinates[$scope.laneInfoArr[i].geometry.coordinates.length - 1][0],
                e_lat = $scope.laneInfoArr[i].geometry.coordinates[$scope.laneInfoArr[i].geometry.coordinates.length - 1][1];
            var kk = (s_lng - e_lng) / (s_lat - e_lat);
            // var distance = (L.latLng(laneInfoArr[i].geometry.coordinates[0][1],laneInfoArr[i].geometry.coordinates[0][0])).distanceTo(L.latLng(laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length-1][1],laneInfoArr[i].geometry.coordinates[laneInfoArr[i].geometry.coordinates.length-1][0]))
            var deg = Math.round(Math.atan(Math.abs(kk)) * 180 / Math.PI) ;//旋转角度
            if ((s_lat > e_lat || (s_lat == e_lat && s_lng > e_lng))) {
                deg = 180 + deg;
            }
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
                html += "<div class='lane-driveway' id='"+lanePid+"'>";
                html += "<span class='top'>" + m + "</span>";
                html += "<div class='middle'>";
                html += "<img src='../../../images/road/1301/1301_0_" + arrowDir + ".svg' style='width: 30px;height:30px;'/>";
                html += "</div>";
                html += "<span class='number' id ='label"+lanePid+"'></span>";
                html += "<input class='bottom' id='checkbox"+lanePid+"' type='checkbox' style='margin:" + 0 + "px' onclick='selectLane(this,"+ inLinkPid + ','+ linkPid + ',' + lanePid + ',' + laneDir + ");'>";
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
            var sLatlng = new L.latLng(s_lat,s_lng);
            var eLatlng = new L.latLng(e_lat,e_lng);
            var distance = sLatlng.distanceTo(eLatlng);
            if(distance < 150){
                L.marker([s_lat, s_lng], {icon: myIcon}).addTo(topoMap);
            } else {
                L.marker([(s_lat + e_lat) / 2, (s_lng + e_lng) / 2], {icon: myIcon}).addTo(topoMap);
            }
        } else {
            if (lanes2Arr.length > 0) {
                var s_lng = $scope.laneInfoArr[i].geometry.coordinates[0][0],
                    s_lat = $scope.laneInfoArr[i].geometry.coordinates[0][1],
                    e_lng = $scope.laneInfoArr[i].geometry.coordinates[$scope.laneInfoArr[i].geometry.coordinates.length - 1][0],
                    e_lat = $scope.laneInfoArr[i].geometry.coordinates[$scope.laneInfoArr[i].geometry.coordinates.length - 1][1];
                var kk = ( s_lng - e_lng) / (s_lat - e_lat);
                var deg = Math.round(Math.atan(Math.abs(kk)) * 180 / Math.PI);//旋转角度
                if ((s_lat > e_lat || (s_lat == e_lat && s_lng > e_lng))) {
                    deg = 180 + deg;
                }
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
                    html += "<div class='lane-driveway' id='"+lanePid+"'>";
                    html += "<span class='top'>" + m + "</span>";
                    html += "<div class='middle'>";
                    html += "<img src='../../../images/road/1301/1301_0_" + arrowDir + ".svg' style='width: 30px;height:30px;'/>";
                    html += "</div>";
                    html += "<span class='number' id ='label"+lanePid+"'></span>";
                    html += "<input class='bottom' type='checkbox' style='margin:" + 0 + "px' onclick='selectLane(this," + inLinkPid + ','+ linkPid + ',' + lanePid + ',' + laneDir + ");'>";
                    html += "</div>";
                }
                html += "<div class='roadside-right'></div>";
                html += "</div>";
                var myIcon = L.divIcon({
                    iconSize:[0,0],
                    // iconAnchor:[0,50],
                    html: html
                });
                var sLatlng = new L.latLng(s_lat,s_lng);
                var eLatlng = new L.latLng(e_lat,e_lng);
                var distance = sLatlng.distanceTo(eLatlng);
                if(distance < 150){
                    L.marker([s_lat, s_lng], {icon: myIcon}).addTo(topoMap);
                } else {
                    L.marker([(s_lat + e_lat) / 2, (s_lng + e_lng) / 2], {icon: myIcon}).addTo(topoMap);
                }
            } else if (lanes3Arr.length > 0) {
                var s_lng = $scope.laneInfoArr[i].geometry.coordinates[0][0],
                    s_lat = $scope.laneInfoArr[i].geometry.coordinates[0][1],
                    e_lng = $scope.laneInfoArr[i].geometry.coordinates[$scope.laneInfoArr[i].geometry.coordinates.length - 1][0],
                    e_lat = $scope.laneInfoArr[i].geometry.coordinates[$scope.laneInfoArr[i].geometry.coordinates.length - 1][1];
                var kk = ( s_lng - e_lng) / (s_lat - e_lat);
                var deg = Math.round(Math.atan(Math.abs(kk)) * 180 / Math.PI) ;//旋转角度
                if ((s_lat > e_lat || (s_lat == e_lat && s_lng > e_lng))) {
                    deg = 180 + deg;
                }
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
                    html += "<div class='lane-driveway' id='"+lanePid+"'>";
                    html += "<span class='top'>" + m + "</span>";
                    html += "<div class='middle'>";
                    html += "<img src='../../../images/road/1301/1301_0_" + arrowDir + ".svg' style='width: 30px;height:30px;'/>";
                    html += "</div>";
                    html += "<span class='number' id ='label"+lanePid+"'></span>";
                    html += "<input class='bottom' type='checkbox' style='margin:" + 0 + "px' onclick='selectLane(this," + inLinkPid + ','+ linkPid + ',' + lanePid + ',' + laneDir + ");'>";
                    html += "</div>";
                }
                html += "<div class='roadside-right'></div>";
                html += "</div>";
                var myIcon = L.divIcon({
                    iconSize:[0,0],
                    // iconAnchor:[0,50],
                    html: html
                });
                var sLatlng = new L.latLng(s_lat,s_lng);
                var eLatlng = new L.latLng(e_lat,e_lng);
                var distance = sLatlng.distanceTo(eLatlng);
                if(distance < 150){
                    L.marker([s_lat, s_lng], {icon: myIcon}).addTo(topoMap);
                } else {
                    L.marker([(s_lat + e_lat) / 2, (s_lng + e_lng) / 2], {icon: myIcon}).addTo(topoMap);
                }
            }
        }
    }

    topoMap.addLayer(polyLines);

    topoMap.setView([$scope.laneInfoArr[0].geometry.coordinates[0][1], $scope.laneInfoArr[0].geometry.coordinates[0][0]], 17);
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