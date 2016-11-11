/**
 * Created by liuyang on 2016/9/9.
 */
var rdLaneTopoApp = angular.module('app');
/*
 * 动态拼的div作用域在controllor之外，只能写到这里
 * */
// var featCodeCtrl = fastmap.uikit.FeatCodeController();
var inLanePid = null;
var outLanePid = null;
var outLinkPid = null;
var laneTopoVias = [];
function selectLane(self, event, inLinkPid, linkPid, lanePid, laneDir, index) {
    if (index == 1) {//选中车道，一条link上的车道只能被选一次
        if (linkPid == inLinkPid) {//进入车道,只能选一条进入线
            if (inLanePid == null) {
                inLanePid = lanePid;
                $("#" + lanePid).addClass('red');
                $("#checkbox" + lanePid).prop({
                    checked: true
                });
            } else {
                if(inLanePid == lanePid){//取消选择
                    $("#" + inLanePid).removeClass('red');
                    $("#checkbox" + inLanePid).prop({
                        checked: false
                    });
                    inLanePid = null;
                } else {
                    $("#" + inLanePid).removeClass('red');
                    $("#checkbox" + inLanePid).prop({
                        checked: false
                    });
                    inLanePid = lanePid;
                    $("#" + lanePid).addClass('red');
                    $("#checkbox" + lanePid).prop({
                        checked: true
                    });
                }
            }
        } else {//作为经过车道
            if(outLinkPid == linkPid){//退出车道所在的link
                return;
            }
            var selfFlag = true;
            for (var k = 0; k < laneTopoVias.length; k++) {//取消选择
                if (laneTopoVias[k].lanePid == lanePid) {
                    $("#" + lanePid).removeClass('green');
                    $("#label" + lanePid).text("");
                    laneTopoVias.splice(k, 1);
                    selfFlag = false;
                }
            }
            if (!selfFlag) {
                modifyNums();
                return;
            }
            laneTopoVias.push({
                lanePid: lanePid,
                seqNum: laneTopoVias.length + 1,
                linkPid: linkPid
            });
            $("#" + lanePid).siblings().each(function () {
                for (var i = 0; i < laneTopoVias.length; i++) {
                    if (laneTopoVias[i].lanePid == $(this)[0].id) {
                        $("#label" + laneTopoVias[i].lanePid).text("");
                        laneTopoVias.splice(i, 1);
                        i--;
                    }
                }
            });
            $("#" + lanePid).siblings().removeClass('green');
            $("#" + lanePid).siblings().find('.bottom').prop({
                checked: false
            });
            $("#" + lanePid).addClass('green');
            $("#label" + lanePid).text(laneTopoVias.length);
        }
    } else {//选中checkbox,经过线不会是checkbox
        event.stopPropagation();
        if (self.checked == true) {
            if (linkPid == inLinkPid) {//进入车道
                if (inLanePid == null) {
                    inLanePid = lanePid;
                    $("#" + lanePid).addClass('red');
                } else {
                    $("#" + inLanePid).removeClass('red');
                    $("#checkbox" + inLanePid).prop({
                        checked: false
                    });
                    inLanePid = lanePid;
                    $("#" + lanePid).addClass('red');
                }
            } else {//退出车道
                if (outLanePid == null) {
                    $("#" + lanePid).siblings().removeClass('yellow');
                    $("#" + lanePid).siblings().removeClass('green');
                    $("#" + lanePid).siblings().find('.bottom').prop({
                        checked: false
                    });
                    $("#" + lanePid).siblings().find('.number').text("");
                    for (var k = 0; k < laneTopoVias.length; k++) {//之前是经过车道，去掉
                        if (laneTopoVias[k].linkPid == linkPid) {
                            $("#" + laneTopoVias[k].lanePid).removeClass('green');
                            $("#label" + laneTopoVias[k].lanePid).text("");
                            laneTopoVias.splice(k, 1);
                            k--;
                        }
                    }
                    outLanePid = lanePid;
                    outLinkPid = linkPid;
                    $("#" + lanePid).addClass('yellow');
                } else {
                    $("#checkbox" + outLanePid).prop({
                        checked: false
                    });
                    $("#" + outLanePid).removeClass('yellow');
                    if(outLinkPid !=linkPid){
                        laneTopoVias.push({
                            lanePid: outLanePid,
                            seqNum: laneTopoVias.length + 1,
                            linkPid: linkPid
                        });
                        $("#" + outLanePid).removeClass('green');
                    }
                    outLanePid = lanePid;
                    outLinkPid = linkPid;
                    for (var i = 0; i < laneTopoVias.length; i++) {
                        if (laneTopoVias[i].linkPid == linkPid) {
                            laneTopoVias.splice(i, 1);
                            i--;
                        }
                    }
                    $("#label" + lanePid).text("");
                    $("#" + lanePid).addClass('yellow');
                }
            }
        } else {
            if (linkPid == inLinkPid) {//进入车道
                inLanePid = null;//清空进入车道
                $("#" + lanePid).removeClass('red');

            } else if (linkPid == outLinkPid) {//退出线
                // laneTopoVias.push({
                //     lanePid: outLanePid,
                //     seqNum: laneTopoVias.length + 1,
                //     linkPid: linkPid
                // });
                outLanePid = null;
                outLinkPid = null;
                $("#" + lanePid).removeClass('yellow');
            }
        }
    }
    modifyNums();
}
function modifyNums() {
    for (var i = 0; i < laneTopoVias.length; i++) {
        laneTopoVias[i].seqNum = i + 1;
        $("#label" + laneTopoVias[i].lanePid).text(laneTopoVias[i].seqNum.toString());
    }
}

rdLaneTopoApp.controller("rdLaneTopoCtrl", ['$scope', '$compile', 'dsEdit', '$sce', '$timeout', function ($scope, $compile, dsEdit, $sce, $timeout) {
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
    $scope.index = null;
    $scope.laneDetail = null;
    var laneInfoObject = {};
    for (var i = 0; i < $scope.laneInfoArr.length; i++) {
        laneInfoObject[$scope.laneInfoArr[i].linkPid] = {
            eNode: $scope.laneInfoArr[i].eNodePid,
            sNode: $scope.laneInfoArr[i].sNodePid,
            direct: $scope.laneInfoArr[i].direct,
            distance: $scope.laneInfoArr[i].length
        }
    }
    var rdLaneTopoDetail = {
        topoIds: [],
        inLinkPid: null,
        inNodePid: null,
        laneTopoInfos: []
    };
    var inLinkPid = $scope.rdLaneData.linkPids[0];//进入线
    rdLaneTopoDetail.inLinkPid = $scope.rdLaneData.linkPids[0];
    rdLaneTopoDetail.inNodePid = $scope.rdLaneData.nodePid;

    $scope.showLaneDetails = function (item, index) {
        $('.red').removeClass('red');
        $('.green').removeClass('green');
        $('.yellow').removeClass('yellow');
        if ($scope.index == index) {
            $scope.index = null;
            $scope.showLaneDetail = false;
        } else {
            $scope.index = index;
            $scope.showLaneDetail = true;
            $scope.laneDetail = item;
            $("#" + item.inLanePid).addClass('red');
            $("#" + item.outLanePid).addClass('yellow');
            for (var i = 0; i < item.topoVias.length; i++) {
                $("#" + item.topoVias[i].lanePid).addClass('green');
            }
        }
    };
    $scope.clearLanes = function () {//清除车道样式
        $("#" + inLanePid).removeClass('red');
        $("#" + outLanePid).removeClass('yellow');
        $("#checkbox" + inLanePid).prop({
            checked: false
        });
        $("#checkbox" + outLanePid).prop({
            checked: false
        });
        for (var i = 0; i < laneTopoVias.length; i++) {
            $("#label" + laneTopoVias[i].lanePid).text("");
            $("#" + laneTopoVias[i].lanePid).removeClass('green');
        }

    };
    $scope.checkLanes = function () {
        var checkFlag = true;
        var lastNodePid = $scope.rdLaneData.nodePid;
        if (inLanePid == null) {
            checkFlag = false;
            swal("提示", "进入线错误！", "error");
            return checkFlag;
        }
        if (outLanePid == null || outLinkPid == null) {
            checkFlag = false;
            swal("提示", "退出线错误！", "error");
            return checkFlag;
        }
        //检查是否连通
        if (laneTopoVias && laneTopoVias.length > 0) {//有经过线
            for (var i = 0; i < laneTopoVias.length; i++) {
                if (laneInfoObject[laneTopoVias[i].linkPid].direct == 2 && laneInfoObject[laneTopoVias[i].linkPid].sNode == lastNodePid) {
                    lastNodePid = laneInfoObject[laneTopoVias[i].linkPid].eNode;
                } else if (laneInfoObject[laneTopoVias[i].linkPid].direct == 3 && laneInfoObject[laneTopoVias[i].linkPid].eNode == lastNodePid) {
                    lastNodePid = laneInfoObject[laneTopoVias[i].linkPid].sNode
                    ;
                } else if (laneInfoObject[laneTopoVias[i].linkPid].direct == 1) {
                    if (laneInfoObject[laneTopoVias[i].linkPid].sNode == lastNodePid) {
                        lastNodePid = laneInfoObject[laneTopoVias[i].linkPid].eNode;
                    } else if (laneInfoObject[laneTopoVias[i].linkPid].eNode == lastNodePid) {
                        lastNodePid = laneInfoObject[laneTopoVias[i].linkPid].sNode;
                    } else {
                        swal("提示", "车道不连通！", "error");
                        checkFlag = false;
                        return checkFlag;
                    }
                } else {
                    swal("提示", "车道不连通！", "error");
                    checkFlag = false;
                    return checkFlag;
                }
            }
        }
        //检查退出线是否连通
        checkFlag = laneInfoObject[outLinkPid].direct == 1 || (laneInfoObject[outLinkPid].direct == 2 && laneInfoObject[outLinkPid].sNode == lastNodePid) || (laneInfoObject[outLinkPid].direct == 3 && laneInfoObject[outLinkPid].eNode == lastNodePid);
        //检查是否重复
        for (var i = 0; i < $scope.insertLaneTopoArr.length; i++) {
            if ($scope.insertLaneTopoArr[i].inLanePid == inLanePid && $scope.insertLaneTopoArr[i].outLanePid == outLanePid) {
                swal("提示", "已经新增过该车道连通！", "error");
                checkFlag = false;
                return checkFlag;
            }
        }
        for (var i = 0; i < $scope.laneTopoInfoArr.length; i++) {
            if ($scope.laneTopoInfoArr[i].inLanePid == inLanePid && $scope.laneTopoInfoArr[i].outLanePid == outLanePid) {
                swal({
                    title: "跟现有车道连通重复",
                    type: "warning",
                    animation: 'slide-from-top',
                    showCancelButton: true,
                    confirmButtonText: "替换",
                    cancelButtonText: "放弃",
                    confirmButtonColor: "#ec6c62"
                }, function (f) {
                    if (f) {
                        $scope.deleteLaneTopoArr.push($scope.laneTopoInfoArr[i]);
                        checkFlag = true;
                    } else {
                        checkFlag = false;
                    }
                });
                return checkFlag;
            }
        }
        return checkFlag;
    };
    $scope.doClose = function () {
        $scope.$emit("CLOSERDLANETOPO");
        inLanePid = null;
        outLanePid = null;
        outLinkPid = null;
        laneTopoVias = [];
        featCodeCtrl.setFeatCode(null);
    };
    $scope.doCreate = function () {
        $scope.clearLanes();
        var flag = $scope.checkLanes();
        if (flag) {
            rdLaneTopoDetail.laneTopoInfos.push({
                inLanePid: inLanePid,
                outLanePid: outLanePid,
                outLinkPid: outLinkPid,
                laneTopoVias: laneTopoVias
            });
            $scope.insertLaneTopoArr.push({
                pid: 0,
                rdLaneTopoDetail: rdLaneTopoDetail
            });
            inLanePid = null;
            outLanePid = null;
            outLinkPid = null;
            laneTopoVias = [];
            swal("提示", "创建车道连通成功！", "success");
        } else {
            swal("提示", "车道不连通！", "error");
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
        zoomControl: false,
        minZoom: 16,
        maxZoom: 22
    });
    var polyLines = new L.layerGroup();
    polyLines.id = "polyLines";

    // var miniPolyLines = new L.layerGroup();
    // miniPolyLines.id = "miniPolyLines";

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
        polyLines.addLayer(guideLine);

        // var miniLine = L.polyline(geo, {
        //     color: 'red',
        //     weight: 3,
        //     id: "miniLine"
        // });
        // miniPolyLines.addLayer(miniLine);

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
            var deg = Math.round(Math.atan(Math.abs(kk)) * 180 / Math.PI);//旋转角度
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
                html += "<div class='lane-driveway' id='" + lanePid + "' onclick='selectLane(this,event," + inLinkPid + ',' + linkPid + ',' + lanePid + ',' + laneDir + ',' + 1 + ")'>";
                html += "<span class='top'>" + m + "</span>";
                html += "<div class='middle'>";
                html += "<img src='../../../images/road/1301/1301_0_" + arrowDir + ".svg' style='width: 30px;height:30px;'/>";
                html += "</div>";
                html += "<span class='number' id ='label" + lanePid + "'></span>";
                html += "<input class='bottom' id='checkbox" + lanePid + "' type='checkbox' style='margin:" + 0 + "px' onclick='selectLane(this,event," + inLinkPid + ',' + linkPid + ',' + lanePid + ',' + laneDir + ',' + 2 + ");'>";
                html += "</div>";
            }
            html += "<div class='roadside-right'></div>";
            html += "</div>";
            var myIcon = L.divIcon({
                // iconAnchor:[0,50],
                iconSize: [0, 0],
                // html:$sce.trustAsHtml(html),
                //html: $compile(html)($scope)
                html: html
            });
            var sLatlng = new L.latLng(s_lat, s_lng);
            var eLatlng = new L.latLng(e_lat, e_lng);
            var distance = sLatlng.distanceTo(eLatlng);
            if (distance < 150) {
                L.marker([s_lat, s_lng], {icon: myIcon, draggable: true}).addTo(topoMap);
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
                    html += "<div class='lane-driveway' id='" + lanePid + "' onclick='selectLane(this,event," + inLinkPid + ',' + linkPid + ',' + lanePid + ',' + laneDir + ',' + 1 + ")'>";
                    html += "<span class='top'>" + m + "</span>";
                    html += "<div class='middle'>";
                    html += "<img src='../../../images/road/1301/1301_0_" + arrowDir + ".svg' style='width: 30px;height:30px;'/>";
                    html += "</div>";
                    html += "<span class='number' id ='label" + lanePid + "'></span>";
                    html += "<input class='bottom' type='checkbox' style='margin:" + 0 + "px' onclick='selectLane(this,event," + inLinkPid + ',' + linkPid + ',' + lanePid + ',' + laneDir + ',' + 2 + ");'>";
                    html += "</div>";
                }
                html += "<div class='roadside-right'></div>";
                html += "</div>";
                var myIcon = L.divIcon({
                    iconSize: [0, 0],
                    // iconAnchor:[0,50],
                    html: html
                });
                var sLatlng = new L.latLng(s_lat, s_lng);
                var eLatlng = new L.latLng(e_lat, e_lng);
                var distance = sLatlng.distanceTo(eLatlng);
                if (distance < 150) {
                    L.marker([s_lat, s_lng], {icon: myIcon, draggable: true}).addTo(topoMap);
                } else {
                    L.marker([(s_lat + e_lat) / 2, (s_lng + e_lng) / 2], {icon: myIcon}).addTo(topoMap);
                }
            } else if (lanes3Arr.length > 0) {
                var s_lng = $scope.laneInfoArr[i].geometry.coordinates[0][0],
                    s_lat = $scope.laneInfoArr[i].geometry.coordinates[0][1],
                    e_lng = $scope.laneInfoArr[i].geometry.coordinates[$scope.laneInfoArr[i].geometry.coordinates.length - 1][0],
                    e_lat = $scope.laneInfoArr[i].geometry.coordinates[$scope.laneInfoArr[i].geometry.coordinates.length - 1][1];
                var kk = ( s_lng - e_lng) / (s_lat - e_lat);
                var deg = Math.round(Math.atan(Math.abs(kk)) * 180 / Math.PI);//旋转角度
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
                    html += "<div class='lane-driveway' id='" + lanePid + "' onclick='selectLane(this,event," + inLinkPid + ',' + linkPid + ',' + lanePid + ',' + laneDir + ',' + 1 + ")'>";
                    html += "<span class='top'>" + m + "</span>";
                    html += "<div class='middle'>";
                    html += "<img src='../../../images/road/1301/1301_0_" + arrowDir + ".svg' style='width: 30px;height:30px;'/>";
                    html += "</div>";
                    html += "<span class='number' id ='label" + lanePid + "'></span>";
                    html += "<input class='bottom' type='checkbox' style='margin:" + 0 + "px' onclick='selectLane(this,event," + inLinkPid + ',' + linkPid + ',' + lanePid + ',' + laneDir + ',' + 2 + ")'>";
                    html += "</div>";
                }
                html += "<div class='roadside-right'></div>";
                html += "</div>";
                var myIcon = L.divIcon({
                    iconSize: [0, 0],
                    // iconAnchor:[0,50],
                    html: html
                });
                var sLatlng = new L.latLng(s_lat, s_lng);
                var eLatlng = new L.latLng(e_lat, e_lng);
                var distance = sLatlng.distanceTo(eLatlng);
                if (distance < 150) {
                    L.marker([s_lat, s_lng], {icon: myIcon, draggable: true}).addTo(topoMap);
                } else {
                    L.marker([(s_lat + e_lat) / 2, (s_lng + e_lng) / 2], {icon: myIcon}).addTo(topoMap);
                }
            }
        }
    }

    topoMap.addLayer(polyLines);

    topoMap.setView([$scope.laneInfoArr[0].geometry.coordinates[0][1], $scope.laneInfoArr[0].geometry.coordinates[0][0]], 17);
    // var miniMap = new L.Control.MiniMap(miniPolyLines, {
    //     width: 200,
    //     height: 200,
    //     toggleDisplay: true,
    //     strings: {
    //         hideText: '隐藏小地图',
    //         showText: '显示小地图'
    //     },
    //     position: 'bottomleft'
    // }).addTo(topoMap);
    //防止地图视口加载不全;
    topoMap.on('resize', function () {
        setTimeout(function () {
            topoMap.invalidateSize()
        }, 400);
    });


}]);