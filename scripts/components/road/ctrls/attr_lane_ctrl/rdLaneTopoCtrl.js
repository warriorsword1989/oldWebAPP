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
    if (index == 1) { // 选中车道，一条link上的车道只能被选一次
        if (linkPid == inLinkPid) { // 进入车道,只能选一条进入线
            if (inLanePid == null) {
                inLanePid = lanePid;
                $('#' + lanePid).addClass('red');
                $('#checkbox' + lanePid).prop({
                    checked: true
                });
            } else if (inLanePid == lanePid) { // 取消选择
                $('#' + inLanePid).removeClass('red');
                $('#checkbox' + inLanePid).prop({
                    checked: false
                });
                inLanePid = null;
            } else {
                $('#' + inLanePid).removeClass('red');
                $('#checkbox' + inLanePid).prop({
                    checked: false
                });
                inLanePid = lanePid;
                $('#' + lanePid).addClass('red');
                $('#checkbox' + lanePid).prop({
                    checked: true
                });
            }
        } else { // 作为经过车道
            if (outLinkPid == linkPid) { // 退出车道所在的link
                return;
            }
            var selfFlag = true;
            for (var k = 0; k < laneTopoVias.length; k++) { // 取消选择
                if (laneTopoVias[k].lanePid == lanePid) {
                    $('#' + lanePid).removeClass('green');
                    $('#label' + lanePid).text('');
                    laneTopoVias.splice(k, 1);
                    k--;
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
            $('#' + lanePid).siblings().each(function () {
                for (var i = 0; i < laneTopoVias.length; i++) {
                    if (laneTopoVias[i].lanePid == $(this)[0].id) {
                        $('#label' + laneTopoVias[i].lanePid).text('');
                        laneTopoVias.splice(i, 1);
                        i--;
                    }
                }
            });
            $('#' + lanePid).siblings().removeClass('green');
            $('#' + lanePid).siblings().find('.bottom').prop({
                checked: false
            });
            $('#' + lanePid).addClass('green');
            $('#label' + lanePid).text(laneTopoVias.length);
        }
    } else { // 选中checkbox,经过线不会是checkbox
        event.stopPropagation();
        if (self.checked == true) {
            if (linkPid == inLinkPid) { // 进入车道
                if (inLanePid == null) {
                    inLanePid = lanePid;
                    $('#' + lanePid).addClass('red');
                } else {
                    $('#' + inLanePid).removeClass('red');
                    $('#checkbox' + inLanePid).prop({
                        checked: false
                    });
                    inLanePid = lanePid;
                    $('#' + lanePid).addClass('red');
                }
            } else { // 退出车道
                if (outLanePid == null) {
                    $('#' + lanePid).siblings().removeClass('yellow');
                    $('#' + lanePid).siblings().removeClass('green');
                    $('#' + lanePid).siblings().find('.bottom').prop({
                        checked: false
                    });
                    $('#' + lanePid).siblings().find('.number').text('');
                    for (var k = 0; k < laneTopoVias.length; k++) { // 之前是经过车道，去掉
                        if (laneTopoVias[k].linkPid == linkPid) {
                            $('#' + laneTopoVias[k].lanePid).removeClass('green');
                            $('#label' + laneTopoVias[k].lanePid).text('');
                            laneTopoVias.splice(k, 1);
                            k--;
                        }
                    }
                    outLanePid = lanePid;
                    outLinkPid = linkPid;
                    $('#' + lanePid).addClass('yellow');
                } else {
                    $('#checkbox' + outLanePid).prop({
                        checked: false
                    });
                    $('#' + outLanePid).removeClass('yellow');
                    if (outLinkPid != linkPid) {
                        laneTopoVias.push({
                            lanePid: outLanePid,
                            seqNum: laneTopoVias.length + 1,
                            linkPid: linkPid
                        });
                        $('#' + outLanePid).removeClass('green');
                    }
                    outLanePid = lanePid;
                    outLinkPid = linkPid;
                    for (var i = 0; i < laneTopoVias.length; i++) {
                        if (laneTopoVias[i].linkPid == linkPid) {
                            laneTopoVias.splice(i, 1);
                            i--;
                        }
                    }
                    $('#label' + lanePid).text('');
                    $('#' + lanePid).addClass('yellow');
                }
            }
        } else if (linkPid == inLinkPid) { // 进入车道
            inLanePid = null;// 清空进入车道
            $('#' + lanePid).removeClass('red');
        } else if (linkPid == outLinkPid) { // 退出线
            outLanePid = null;
            outLinkPid = null;
            $('#' + lanePid).removeClass('yellow');
        }
    }
    modifyNums();
}
function modifyNums() {
    for (var i = 0; i < laneTopoVias.length; i++) {
        laneTopoVias[i].seqNum = i + 1;
        $('#label' + laneTopoVias[i].lanePid).text(laneTopoVias[i].seqNum.toString());
    }
}

rdLaneTopoApp.controller('rdLaneTopoCtrl', ['$scope', '$compile', 'dsEdit', '$sce', '$timeout', '$ocLazyLoad', function ($scope, $compile, dsEdit, $sce, $timeout, $ocLazyLoad) {
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    var layerCtrl = fastmap.uikit.LayerController();
    var eventCtrl = fastmap.uikit.EventController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var relationData = layerCtrl.getLayerById('relationData');
    // 初始化地图;
    var laneTopo = featCodeCtrl.getFeatCode().laneTopo;// 服务返回的数据;
    $scope.rdLaneData = featCodeCtrl.getFeatCode().rdLaneData;// 创建前保留的数据
    $scope.laneInfoArr = laneTopo[0].laneInfos;// 所有的详细车道
    $scope.laneTopoInfoArr = laneTopo[0].laneTopoInfos;// 所有的原始的车道连通
    $scope.deleteLaneTopoArr = [];// 所有的删除的车道连通
    $scope.insertLaneTopoArr = [];// 所有的新增的车道连通
    $scope.showLaneDetail = false;
    $scope.index = null;
    $scope.laneDetail = null;
    var showPanel = null;
    var panelIndex = null;
    var laneInfoObject = {};
    var rdLaneTopoDetail = {
        topoIds: [],
        inLinkPid: null,
        inNodePid: null,
        laneTopoInfos: []
    };
    for (var i = 0; i < $scope.laneInfoArr.length; i++) {
        laneInfoObject[$scope.laneInfoArr[i].linkPid] = {
            eNode: $scope.laneInfoArr[i].eNodePid,
            sNode: $scope.laneInfoArr[i].sNodePid,
            direct: $scope.laneInfoArr[i].direct,
            distance: $scope.laneInfoArr[i].length
        };
    }
    // for (var i = 0; i < $scope.laneTopoInfoArr.length; i++) {
    //     rdLaneTopoDetail.laneTopoInfos.push({
    //         inLanePid: $scope.laneTopoInfoArr[i].inLanePid,
    //         outLanePid: $scope.laneTopoInfoArr[i].outLanePid,
    //         outLinkPid: $scope.laneTopoInfoArr[i].outLinkPid,
    //         laneTopoVias: $scope.laneTopoInfoArr[i].topoVias
    //     });
    // }
    var inLinkPid = $scope.rdLaneData.linkPids[0];// 进入线
    rdLaneTopoDetail.inLinkPid = $scope.rdLaneData.linkPids[0];
    rdLaneTopoDetail.inNodePid = $scope.rdLaneData.nodePid;
    topoMap = new L.Map('topoMap', {
        attributionControl: false,
        doubleClickZoom: false,
        zoomControl: false,
        minZoom: 16,
        maxZoom: 22
    });
    $scope.processFlagOption = [
        { id: 1, label: '人工（与批处理原则不一致）' },
        { id: 2, label: '批处理' },
        { id: 3, label: '人工（与批处理原则一致）' }
    ];
    $scope.throughTurnOption = [
        { id: 0, label: '否' },
        { id: 1, label: '是' }
    ];
    $scope.reachDirTrans = {
        0: '0 未调查',
        1: '1 直',
        2: '2 左',
        3: '3 右',
        4: '4 调',
        5: '5 左斜前',
        6: '6 右斜前'
    };
    $scope.vehicleOptions = [
        { id: 0, label: '客车(小汽车)', checked: false },
        { id: 1, label: '配送卡车', checked: false },
        { id: 2, label: '运输卡车', checked: false },
        { id: 3, label: '步行者', checked: false },
        { id: 4, label: '自行车', checked: false },
        { id: 5, label: '摩托车', checked: false },
        { id: 6, label: '机动脚踏两用车', checked: false },
        { id: 7, label: '急救车', checked: false },
        { id: 8, label: '出租车', checked: false },
        { id: 9, label: '公交车', checked: false },
        { id: 10, label: '工程车', checked: false },
        { id: 11, label: '本地车辆', checked: false },
        { id: 12, label: '自用车辆', checked: false },
        { id: 13, label: '多人乘坐车辆', checked: false },
        { id: 14, label: '军车', checked: false },
        { id: 15, label: '有拖车的车', checked: false },
        { id: 16, label: '私营公共汽车', checked: false },
        { id: 17, label: '农用车', checked: false },
        { id: 18, label: '载有易爆品的车辆', checked: false },
        { id: 19, label: '载有水污染品的车辆', checked: false },
        { id: 20, label: '载有其它危险品的车辆', checked: false },
        { id: 21, label: '电车', checked: false },
        { id: 22, label: '轻轨', checked: false },
        { id: 23, label: '校车', checked: false },
        { id: 24, label: '四轮驱动车', checked: false },
        { id: 25, label: '装有防雪链的车', checked: false },
        { id: 26, label: '邮政车', checked: false },
        { id: 27, label: '槽罐车', checked: false },
        { id: 28, label: '残疾人车', checked: false }
    ];
        /**
     *
     * @param vehicle
     * @param $index
     */
    $scope.showvehicle = function (vehicle, $index) {
        var towbin = dec2bin(vehicle);
        // 循环车辆值域，根据数据库数据取出新的数组显示在页面
        var originArray = [];
        $scope.isAllowed[$index] = false;
        // 长度小于32即是没有选中checkbox，不允许
        if (towbin.length < 32) {
            var len = towbin.length - 1;
            $scope.isAllowed[$index] = false;
        } else {
            len = towbin.length - 2;
            $scope.isAllowed[$index] = true;
        }
        for (var i = len; i >= 0; i--) {
            if (towbin.split('').reverse().join('')[i] == 1) {
                originArray.push($scope.vehicleOptions[i]);
            }
        }
        if (originArray.length == 0) {
            $scope.carData[$index] = [];
        } else {
            for (var p in originArray) {
                for (var s in $scope.vehicleOptions) {
                    if (originArray[p].id.toString() == $scope.vehicleOptions[s].id) {
                        $scope.vehicleOptions[s].checked = true;
                        $scope.carData[$index].push($scope.vehicleOptions[s]);
                    }
                }
            }
        }
    };

    $scope.getLayerById = function (layerId) {
        var layers = null;
        for (var item in topoMap._layers) {
            if (topoMap._layers[item].id) {
                if (topoMap._layers[item].id === layerId) {
                    layers = topoMap._layers[item];
                }
            }
        }
        return layers;
    };
    $scope.changeLineColor = function (e) {
        var selectLine = e.target.id + 'polyLine';
        var selectLineLayer = $scope.getLayerById(selectLine);
        var newStyle = {
            // color: "#FFA8FF",
            weight: 10
        };
        selectLineLayer.setStyle(newStyle);
    };
    $scope.resetLineColor = function (e) {
        var selectLine = e.target.id + 'polyLine';
        var selectLineLayer = $scope.getLayerById(selectLine);
        var newStyle = {
            // color: "#FFA8FF",
            weight: 5
        };
        selectLineLayer.setStyle(newStyle);
    };
    $scope.resetLaneInfo = function () {
        inLanePid = null;
        outLanePid = null;
        outLinkPid = null;
        laneTopoVias = [];
    };
    $scope.deleteLaneDetails = function (item, index) {
        rdLaneTopoDetail.topoIds.push(item.pid);
        $scope.deleteLaneTopoArr.push(item);
        $scope.laneTopoInfoArr.splice(index, 1);
        if (index == panelIndex && showPanel == 1) {
            $('.red').removeClass('red');
            $('.green').removeClass('green');
            $('.yellow').removeClass('yellow');
        }
    };
    $scope.showLaneDetails = function (item, index, panelFlag) {
        $('.red').removeClass('red');
        $('.green').removeClass('green');
        $('.yellow').removeClass('yellow');
        if (showPanel != panelFlag) {
            showPanel = panelFlag;
            panelIndex = index;
            $scope.showLaneDetail = true;
            $scope.laneDetail = item;
            timeoutLoad();
            $('#' + item.inLanePid).addClass('red');
            $('#' + item.outLanePid).addClass('yellow');
            for (var i = 0; i < item.topoVias.length; i++) {
                $('#' + item.topoVias[i].lanePid).addClass('green');
            }
        } else if (panelIndex == index) {
            panelIndex = null;
            $scope.showLaneDetail = false;
        } else {
            panelIndex = index;
            $scope.showLaneDetail = true;
            $scope.laneDetail = item;
            $('#' + item.inLanePid).addClass('red');
            $('#' + item.outLanePid).addClass('yellow');
            for (var i = 0; i < item.topoVias.length; i++) {
                $('#' + item.topoVias[i].lanePid).addClass('green');
            }
        }
    };
    $scope.clearLanes = function () { // 清除车道样式
        $('#' + inLanePid).removeClass('red');
        $('#' + outLanePid).removeClass('yellow');
        $('#checkbox' + inLanePid).prop({
            checked: false
        });
        $('#checkbox' + outLanePid).prop({
            checked: false
        });
        for (var i = 0; i < laneTopoVias.length; i++) {
            $('#label' + laneTopoVias[i].lanePid).text('');
            $('#' + laneTopoVias[i].lanePid).removeClass('green');
        }
    };
    $scope.checkRepeat = function () {
        var checkFlag = 1;
        // 检查是否重复
        for (var i = 0; i < $scope.insertLaneTopoArr.length; i++) {
            if ($scope.insertLaneTopoArr[i].inLanePid == inLanePid && $scope.insertLaneTopoArr[i].outLanePid == outLanePid) {
                swal('提示', '已经新增过该车道连通！', 'error');
                checkFlag = 0;
                return checkFlag;
            }
        }
        for (var i = 0; i < $scope.laneTopoInfoArr.length; i++) {
            if ($scope.laneTopoInfoArr[i].inLanePid == inLanePid && $scope.laneTopoInfoArr[i].outLanePid == outLanePid) {
                checkFlag = i + 10;
                return checkFlag;
            }
        }
        return checkFlag;
    };
    $scope.checkLanes = function () {
        var checkFlag = true;
        var lastNodePid = $scope.rdLaneData.nodePid;
        if (inLanePid == null) {
            checkFlag = false;
            swal('提示', '进入线错误！', 'error');
            return checkFlag;
        }
        if (outLanePid == null || outLinkPid == null) {
            checkFlag = false;
            swal('提示', '退出线错误！', 'error');
            return checkFlag;
        }
        // 检查是否连通
        if (laneTopoVias && laneTopoVias.length > 0) { // 有经过线
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
                        swal('提示', '车道不连通！', 'error');
                        checkFlag = false;
                        return checkFlag;
                    }
                } else {
                    swal('提示', '车道不连通！', 'error');
                    checkFlag = false;
                    return checkFlag;
                }
            }
        }
        // 检查退出线是否连通
        checkFlag = laneInfoObject[outLinkPid].direct == 1 || (laneInfoObject[outLinkPid].direct == 2 && laneInfoObject[outLinkPid].sNode == lastNodePid) || (laneInfoObject[outLinkPid].direct == 3 && laneInfoObject[outLinkPid].eNode == lastNodePid);
        return checkFlag;
    };
    $scope.doClose = function () {
        $scope.$emit('CLOSERDLANETOPO');
        $scope.resetLaneInfo();
        featCodeCtrl.setFeatCode(null);
    };
    $scope.doCreate = function () {
        $scope.clearLanes();
        var flag = $scope.checkLanes();
        var repeat = $scope.checkRepeat();
        if (flag && repeat == 1) {
            rdLaneTopoDetail.laneTopoInfos.push({
                inLanePid: inLanePid,
                outLanePid: outLanePid,
                outLinkPid: outLinkPid,
                laneTopoVias: laneTopoVias
            });
            $scope.insertLaneTopoArr.push(fastmap.dataApi.rdLaneTopoDetail({ pid: 0,
                inLanePid: inLanePid,
                outLanePid: outLanePid,
                outLinkPid: outLinkPid,
                topoVias: laneTopoVias }));
            $scope.resetLaneInfo();
            swal('提示', '创建车道连通成功！', 'success');
        } else if (!flag || repeat == 0) {
            $scope.resetLaneInfo();
        } else if (flag && repeat != 0 && repeat != 1) {
            swal({
                title: '跟现有车道连通重复',
                type: 'warning',
                animation: 'slide-from-top',
                showCancelButton: true,
                confirmButtonText: '替换',
                cancelButtonText: '放弃',
                confirmButtonColor: '#ec6c62',
                closeOnConfirm: false
            }, function (f) {
                if (f) {
                    rdLaneTopoDetail.topoIds.push($scope.laneTopoInfoArr[repeat - 10].pid);
                    $scope.deleteLaneTopoArr.push($scope.laneTopoInfoArr[repeat - 10]);
                    $scope.laneTopoInfoArr.splice(repeat - 10, 1);

                    rdLaneTopoDetail.laneTopoInfos.push({
                        inLanePid: inLanePid,
                        outLanePid: outLanePid,
                        outLinkPid: outLinkPid,
                        laneTopoVias: laneTopoVias
                    });
                    $scope.insertLaneTopoArr.push(fastmap.dataApi.rdLaneTopoDetail({ pid: 0,
                        inLanePid: inLanePid,
                        outLanePid: outLanePid,
                        outLinkPid: outLinkPid,
                        topoVias: laneTopoVias }));
                    $scope.resetLaneInfo();
                    swal('提示', '创建车道连通成功！', 'success');
                } else {
                    $scope.resetLaneInfo();
                }
            });
        }
    };
    $scope.doSave = function () {
        var param = {
            command: 'BATCH',
            type: 'RDLANETOPODETAIL',
            dbId: App.Temp.dbId,
            data: rdLaneTopoDetail
        };
        // 调用编辑接口;
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

    var polyLines = new L.layerGroup();
    polyLines.id = 'polyLines';

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
        if (linkPid == inLinkPid) {
            var guideLine = L.polyline(geo, {
                color: 'red',
                weight: 5
            });
        } else {
            var guideLine = L.polyline(geo, {
                color: '#AE8F00',
                weight: 5
            });
        }
        guideLine.id = linkPid + 'polyLine';
        polyLines.addLayer(guideLine);

        // var miniLine = L.polyline(geo, {
        //     color: 'red',
        //     weight: 3,
        //     id: "miniLine"
        // });
        // miniPolyLines.addLayer(miniLine);
        var lanesArr = $scope.laneInfoArr[i].lanes;
        if (lanesArr.length > 0) {
            var s_lng = $scope.laneInfoArr[i].geometry.coordinates[0][0],
                s_lat = $scope.laneInfoArr[i].geometry.coordinates[0][1],
                s1_lng = $scope.laneInfoArr[i].geometry.coordinates[1][0],
                s1_lat = $scope.laneInfoArr[i].geometry.coordinates[1][1],
                e1_lng = $scope.laneInfoArr[i].geometry.coordinates[$scope.laneInfoArr[i].geometry.coordinates.length - 2][0],
                e1_lat = $scope.laneInfoArr[i].geometry.coordinates[$scope.laneInfoArr[i].geometry.coordinates.length - 2][1],
                e_lng = $scope.laneInfoArr[i].geometry.coordinates[$scope.laneInfoArr[i].geometry.coordinates.length - 1][0],
                e_lat = $scope.laneInfoArr[i].geometry.coordinates[$scope.laneInfoArr[i].geometry.coordinates.length - 1][1];
            var kk;
            if ($scope.laneInfoArr[i].direct == 2) {
                kk = (e1_lng - e_lng) / (e1_lat - e_lat);
            } else if ($scope.laneInfoArr[i].direct == 3) {
                kk = (s1_lng - s_lng) / (s1_lat - s_lat);
            } else {
                kk = (s_lng - e_lng) / (s_lat - e_lat);
            }

            var deg = Math.round(Math.atan(Math.abs(kk)) * 180 / Math.PI);// 旋转角度
            if (($scope.laneInfoArr[i].direct == 2) && (e1_lng > e_lng || (e1_lng == e_lng && e1_lat > e_lat))) {
                deg = 180 + deg;
            }
            // if (($scope.laneInfoArr[i].direct == 3) && (s_lat < s1_lat || (s_lat == s1_lat && s_lng < s1_lng))) {
            //     deg =  180 + deg;
            // }
            // var scale = distance/150;
            var _width = lanesArr.length * 30 + 20;
            var xtrans = _width / 2 * Math.sin(deg);
            var ytrans = _width / 2 * Math.cos(deg);
            var html = "<div class ='lane-img-container' style='width:" + _width + 'px;-webkit-transform:rotate(' + deg + "deg);'>";
            html += "<div class='roadside-left'>";
            html += '</div>';
            for (var k = 0; k < lanesArr.length; k++) {
                var lanePid = lanesArr[k].pid;
                var seqNum = lanesArr[k].seqNum;
                var laneDir = lanesArr[k].laneDir;
                var arrowDir = lanesArr[k].arrowDir;
                var m = k + 1;
                html += "<div class='lane-driveway' id='" + lanePid + "' onclick='selectLane(this,event," + inLinkPid + ',' + linkPid + ',' + lanePid + ',' + laneDir + ',' + 1 + ")'>";
                html += "<span class='top'>" + m + '</span>';
                html += "<div class='middle'>";
                html += "<img src='../../../images/road/1301/1301_0_" + arrowDir + ".svg' style='width: 30px;height:30px;'/>";
                html += '</div>';
                html += "<span class='number' id ='label" + lanePid + "'></span>";
                html += "<input class='bottom' id='checkbox" + lanePid + "' type='checkbox' style='margin:" + 0 + "px' onclick='selectLane(this,event," + inLinkPid + ',' + linkPid + ',' + lanePid + ',' + laneDir + ',' + 2 + ");'>";
                html += '</div>';
            }
            html += "<div class='roadside-right'></div>";
            html += '</div>';
            var myIcon = L.divIcon({
                // iconAnchor:[0,50],
                iconSize: [0, 0],
                // html:$sce.trustAsHtml(html),
                // html: $compile(html)($scope)
                html: html
            });
            var sLatlng = new L.latLng(s_lat, s_lng);
            var eLatlng = new L.latLng(e_lat, e_lng);
            var distance = sLatlng.distanceTo(eLatlng);
            if (distance < 150) {
                var marker = L.marker([s_lat, s_lng], { icon: myIcon, draggable: true }).on('drag', $scope.changeLineColor).on('dragend', $scope.resetLineColor);
                marker.id = linkPid;
                marker.addTo(topoMap);
            } else {
                var marker = L.marker([(s_lat + e_lat) / 2, (s_lng + e_lng) / 2], { icon: myIcon, draggable: true }).on('drag', $scope.changeLineColor).on('dragend', $scope.resetLineColor);
                marker.id = linkPid;
                marker.addTo(topoMap);
            }
        }
    }
    function timeoutLoad() {
        $timeout(function () {
            $ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function () {
                $scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
                /* 查询数据库取出时间字符串*/
                $timeout(function () {
                    $scope.fmdateTimer($scope.laneDetail.timeDomain);
                    $scope.$broadcast('set-code', $scope.laneDetail.timeDomain);
                    $scope.$apply();
                }, 100);
            });
        });
    }
    /* 时间控件*/
    $scope.fmdateTimer = function (str) {
        $scope.$on('get-date', function (event, data) {
            $scope.laneDetail.timeDomain = data;
        });
        $timeout(function () {
            $scope.$broadcast('set-code', str);
            $scope.laneDetail.timeDomain = str;
            $scope.$apply();
        }, 100);
    };


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
    // 防止地图视口加载不全;
    topoMap.on('resize', function () {
        setTimeout(function () {
            topoMap.invalidateSize();
        }, 400);
    });
}]);
