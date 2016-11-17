/**
 * Created by liuyang on 2016/9/9.
 */
var rdLaneTopoApp = angular.module('app');
/*
 * 动态拼的div作用域在controllor之外，只能写到这里
 * */
var inLanePid = null;
var outLanePid = null;
var outLinkPid = null;
var laneTopoVias = [];
var showPanelIndex = null;
var panelIndex = null;

function modifyNums() {
    for (var i = 0; i < laneTopoVias.length; i++) {
        laneTopoVias[i].seqNum = i + 1;
        $('#label' + laneTopoVias[i].lanePid).text(laneTopoVias[i].seqNum.toString());
    }
}
function selectLane(self, event, inLinkPid, linkPid, lanePid, laneDir, index) {
    if (showPanelIndex) {
        showPanelIndex = null;
        panelIndex = null;
        $('.red').removeClass('red');
        $('.green').removeClass('green');
        $('.yellow').removeClass('yellow');
    }
    if (index === 1) { // 选中车道，一条link上的车道只能被选一次
        if (linkPid === inLinkPid) { // 进入车道,只能选一条进入线
            if (inLanePid == null) {
                inLanePid = lanePid;
                $('#' + lanePid).addClass('red');
                $('#checkbox' + lanePid).prop({
                    checked: true
                });
            } else if (inLanePid === lanePid) { // 取消选择
                $('#' + inLanePid).removeClass('red');
                $('#checkbox' + inLanePid).prop({
                    checked: false
                });
                inLanePid = null;
            } else if (inLanePid === lanePid) { // 取消选择
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
            var selfFlag = true;
            if (outLinkPid === linkPid) { // 退出车道所在的link
                return;
            }
            for (var kk = 0; kk < laneTopoVias.length; kk++) { // 取消选择
                if (laneTopoVias[kk].lanePid === lanePid) {
                    $('#' + lanePid).removeClass('green');
                    $('#label' + lanePid).text('');
                    laneTopoVias.splice(kk, 1);
                    kk--;
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
                    if (laneTopoVias[i].lanePid === $(this)[0].id) {
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
        if (self.checked === true) {
            if (linkPid === inLinkPid) { // 进入车道
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
            } else if (outLanePid == null) { // 退出车道
                $('#' + lanePid).siblings().removeClass('yellow');
                $('#' + lanePid).siblings().removeClass('green');
                $('#' + lanePid).siblings().find('.bottom').prop({
                    checked: false
                });
                $('#' + lanePid).siblings().find('.number').text('');
                for (var k = 0; k < laneTopoVias.length; k++) { // 之前是经过车道，去掉
                    if (laneTopoVias[k].linkPid === linkPid) {
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
                if (outLinkPid !== linkPid) {
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
                    if (laneTopoVias[i].linkPid === linkPid) {
                        laneTopoVias.splice(i, 1);
                        i--;
                    }
                }
                $('#label' + lanePid).text('');
                $('#' + lanePid).addClass('yellow');
            }
        } else if (linkPid === inLinkPid) { // 进入车道
            inLanePid = null;// 清空进入车道
            $('#' + lanePid).removeClass('red');
        } else if (linkPid === outLinkPid) { // 退出线
            outLanePid = null;
            outLinkPid = null;
            $('#' + lanePid).removeClass('yellow');
        }
    }
    modifyNums();
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
    $scope.showPanel = false;
    var laneInfoObject = {};
    var rdLaneTopoDetail = {
        topoIds: [],
        inLinkPid: null,
        inNodePid: null,
        laneTopoInfos: []
    };
    var inLinkToLane = {};
    $scope.formatInlink = function (topoId) {
        return inLinkToLane[topoId];
    };
    var inLinkPid = $scope.rdLaneData.linkPids[0]; // 进入线
    var nodePid = $scope.rdLaneData.nodePid; // 进入点
    var nodeGeo = null;
    for (var ii = 0; ii < $scope.laneInfoArr.length; ii++) {
        laneInfoObject[$scope.laneInfoArr[ii].linkPid] = {
            eNode: $scope.laneInfoArr[ii].eNodePid,
            sNode: $scope.laneInfoArr[ii].sNodePid,
            direct: $scope.laneInfoArr[ii].direct,
            distance: $scope.laneInfoArr[ii].length
        };
        if ($scope.laneInfoArr[ii].linkPid === inLinkPid) {
            for (var jj = 0; jj < $scope.laneInfoArr[ii].lanes.length; jj++) {
                inLinkToLane[$scope.laneInfoArr[ii].lanes[jj].pid] = '进' + (jj + 1);
            }
        }
        if ($scope.laneInfoArr[ii].linkPid === inLinkPid &&
            $scope.laneInfoArr[ii].sNodePid === nodePid) {
            nodeGeo = $scope.laneInfoArr[ii].geometry.coordinates[0];
        } else if ($scope.laneInfoArr[ii].linkPid === inLinkPid &&
            $scope.laneInfoArr[ii].eNodePid === nodePid) {
            var lastIndex = $scope.laneInfoArr[ii].geometry.coordinates.length - 1;
            nodeGeo = $scope.laneInfoArr[ii].geometry.coordinates[lastIndex];
        }
    }
    // for (var i = 0; i < $scope.laneTopoInfoArr.length; i++) {
    //     rdLaneTopoDetail.laneTopoInfos.push({
    //         inLanePid: $scope.laneTopoInfoArr[i].inLanePid,
    //         outLanePid: $scope.laneTopoInfoArr[i].outLanePid,
    //         outLinkPid: $scope.laneTopoInfoArr[i].outLinkPid,
    //         laneTopoVias: $scope.laneTopoInfoArr[i].topoVias
    //     });
    // }
    rdLaneTopoDetail.inLinkPid = $scope.rdLaneData.linkPids[0];
    rdLaneTopoDetail.inNodePid = $scope.rdLaneData.nodePid;
    var topoMap = new L.Map('topoMap', {
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
        if (index === panelIndex && showPanelIndex === 1) {
            $('.red').removeClass('red');
            $('.green').removeClass('green');
            $('.yellow').removeClass('yellow');
        }
    };
    function timeoutLoad() {
        $timeout(function () {
            $ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function () {
                $scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
                /* 查询数据库取出时间字符串 */
                $timeout(function () {
                    $scope.fmdateTimer($scope.laneDetail.timeDomain);
                    $scope.$broadcast('set-code', $scope.laneDetail.timeDomain);
                    $scope.$apply();
                }, 100);
            });
        });
    }
    $scope.showLaneDetails = function (item, index, panelFlag) {
        $('.red').removeClass('red');
        $('.green').removeClass('green');
        $('.yellow').removeClass('yellow');
        $('.number').text('');
        $('.bottom').prop({
            checked: false
        });
        $scope.resetLaneInfo();
        $scope.showPanel = (panelFlag === 2);
        if (showPanelIndex !== panelFlag) {
            showPanelIndex = panelFlag;
            panelIndex = index;
            $scope.showLaneDetail = true;
            $scope.laneDetail = item;
            timeoutLoad();
            $('#' + item.inLanePid).addClass('red');
            $('#' + item.outLanePid).addClass('yellow');
            for (var iii = 0; iii < item.topoVias.length; iii++) {
                $('#' + item.topoVias[iii].lanePid).addClass('green');
            }
        } else if (panelIndex === index) {
            showPanelIndex = null;
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
        for (var i1 = 0; i1 < $scope.insertLaneTopoArr.length; i1++) {
            if ($scope.insertLaneTopoArr[i1].inLanePid === inLanePid &&
                $scope.insertLaneTopoArr[i1].outLanePid === outLanePid) {
                swal('提示', '已经新增过该车道连通！', 'error');
                checkFlag = 0;
                return checkFlag;
            }
        }
        for (var i = 0; i < $scope.laneTopoInfoArr.length; i++) {
            if ($scope.laneTopoInfoArr[i].inLanePid === inLanePid &&
                $scope.laneTopoInfoArr[i].outLanePid === outLanePid) {
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
                if (laneInfoObject[laneTopoVias[i].linkPid].direct === 2 &&
                    laneInfoObject[laneTopoVias[i].linkPid].sNode === lastNodePid) {
                    lastNodePid = laneInfoObject[laneTopoVias[i].linkPid].eNode;
                } else if (laneInfoObject[laneTopoVias[i].linkPid].direct === 3 &&
                    laneInfoObject[laneTopoVias[i].linkPid].eNode === lastNodePid) {
                    lastNodePid = laneInfoObject[laneTopoVias[i].linkPid].sNode;
                } else if (laneInfoObject[laneTopoVias[i].linkPid].direct === 1) {
                    if (laneInfoObject[laneTopoVias[i].linkPid].sNode === lastNodePid) {
                        lastNodePid = laneInfoObject[laneTopoVias[i].linkPid].eNode;
                    } else if (laneInfoObject[laneTopoVias[i].linkPid].eNode === lastNodePid) {
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
        checkFlag = laneInfoObject[outLinkPid].direct === 1 ||
            (laneInfoObject[outLinkPid].direct === 2 &&
            laneInfoObject[outLinkPid].sNode === lastNodePid) ||
            (laneInfoObject[outLinkPid].direct === 3 &&
            laneInfoObject[outLinkPid].eNode === lastNodePid);
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
        if (flag && repeat === 1) {
            rdLaneTopoDetail.laneTopoInfos.push({
                inLanePid: inLanePid,
                outLanePid: outLanePid,
                outLinkPid: outLinkPid,
                laneTopoVias: laneTopoVias
            });
            $scope.insertLaneTopoArr.push(fastmap.dataApi.rdLaneTopoDetail({
                pid: 0,
                inLanePid: inLanePid,
                outLanePid: outLanePid,
                outLinkPid: outLinkPid,
                topoVias: laneTopoVias
            }));
            $scope.resetLaneInfo();
            swal('提示', '创建车道连通成功！', 'success');
        } else if (!flag || repeat === 0) {
            $scope.resetLaneInfo();
        } else if (flag && repeat !== 0 && repeat !== 1) {
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
                    $scope.insertLaneTopoArr.push(fastmap.dataApi.rdLaneTopoDetail({
                        pid: 0,
                        inLanePid: inLanePid,
                        outLanePid: outLanePid,
                        outLinkPid: outLinkPid,
                        topoVias: laneTopoVias
                    }));
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
                swal({
                    title: '保存成功，是否关闭制作面板？',
                    type: 'warning',
                    animation: 'slide-from-top',
                    showCancelButton: true,
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    confirmButtonColor: '#ec6c62'
                }, function (f) {
                    if (f) {
                        relationData.redraw();
                        $scope.clearLanes();
                        $scope.doClose();
                    } else {
                        relationData.redraw();
                        $scope.clearLanes();
                    }
                });
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

    var polyLines = new L.LayerGroup();
    polyLines.id = 'polyLines';

    // var miniPolyLines = new L.layerGroup();
    // miniPolyLines.id = "miniPolyLines";

    for (var i = 0; i < $scope.laneInfoArr.length; i++) {
        var linkPid = $scope.laneInfoArr[i].linkPid;
        var geo = [];
        var guideLine;
        for (var j = 0; j < $scope.laneInfoArr[i].geometry.coordinates.length; j++) {
            geo.push({
                lng: $scope.laneInfoArr[i].geometry.coordinates[j][0],
                lat: $scope.laneInfoArr[i].geometry.coordinates[j][1]
            });
        }
        if (linkPid === inLinkPid) {
            guideLine = L.polyline(geo, {
                color: 'red',
                weight: 5
            });
        } else {
            guideLine = L.polyline(geo, {
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
            var sLng = $scope.laneInfoArr[i].geometry.coordinates[0][0];
            var sLat = $scope.laneInfoArr[i].geometry.coordinates[0][1];
            var s1Lng = $scope.laneInfoArr[i].geometry.coordinates[1][0];
            var s1Lat = $scope.laneInfoArr[i].geometry.coordinates[1][1];
            var lastOne = $scope.laneInfoArr[i].geometry.coordinates.length - 1;
            var lastTwo = $scope.laneInfoArr[i].geometry.coordinates.length - 2;
            var e1Lng = $scope.laneInfoArr[i].geometry.coordinates[lastTwo][0];
            var e1Lat = $scope.laneInfoArr[i].geometry.coordinates[lastTwo][1];
            var eLng = $scope.laneInfoArr[i].geometry.coordinates[lastOne][0];
            var eLat = $scope.laneInfoArr[i].geometry.coordinates[lastOne][1];
            var kk;
            var directFlag;
            // 处理双方向道路的车道方向
            if (($scope.laneInfoArr[i].direct === 1) &&
                (nodePid === $scope.laneInfoArr[i].eNodePid &&
                inLinkPid === $scope.laneInfoArr[i].linkPid)) {
                directFlag = 2;
            } else if (($scope.laneInfoArr[i].direct === 1) &&
                (nodePid === $scope.laneInfoArr[i].sNodePid &&
                inLinkPid === $scope.laneInfoArr[i].linkPid)) {
                directFlag = 3;
            }
            if ($scope.laneInfoArr[i].direct === 2) {
                kk = (e1Lng - eLng) / (e1Lat - eLat);
            } else if ($scope.laneInfoArr[i].direct === 3) {
                kk = (s1Lng - sLng) / (s1Lat - sLat);
            } else {
                kk = (sLng - eLng) / (sLat - eLat);
            }
            var deg = Math.round((Math.atan(Math.abs(kk)) * 180) / Math.PI); // 旋转角度,此方法算出来的角度不分方向
            if (($scope.laneInfoArr[i].direct === 2) &&
                (e1Lng > eLng || (e1Lng === eLng && e1Lat > eLat))) {
                deg = 180 + deg;
            }
            if (($scope.laneInfoArr[i].direct === 3) &&
                (s1Lng > sLng ||
                (s1Lng === sLng && s1Lat > sLat))) {
                deg = 180 + deg;
            }
            if (($scope.laneInfoArr[i].direct === 1)) {
                if ((directFlag === 3 && inLinkPid === $scope.laneInfoArr[i].linkPid)) {
                    deg = 180 + deg;
                } else if (inLinkPid !== $scope.laneInfoArr[i].linkPid) {
                    if (L.latLng(sLat, sLng).distanceTo(new L.LatLng(nodeGeo[1], nodeGeo[0])) >
                        L.latLng(eLat, eLng).distanceTo(new L.LatLng(nodeGeo[1], nodeGeo[0]))) {
                        deg = 180 + deg;
                    }
                }
            }
            // var scale = distance/150;
            // var xtrans = _width / 2 * Math.sin(deg);
            // var ytrans = _width / 2 * Math.cos(deg);
            var _width = (lanesArr.length * 30) + 20;
            var html = "<div class ='lane-img-container' id ='html" + linkPid + "' style='width:" + _width + 'px;-webkit-transform:rotate(' + deg + "deg);-webkit-transform:scale(0.7,0.7);'>";
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
            var sLatlng = new L.LatLng(sLat, sLng);
            var eLatlng = new L.LatLng(eLat, eLng);
            var marker;
            // var distance = sLatlng.distanceTo(eLatlng);
            var distance = laneInfoObject[linkPid].distance;
            if (distance < 150) {
                marker = L.marker([sLat, sLng], {
                    icon: myIcon,
                    draggable: true,
                    title: 'linkPid=' + linkPid
                }).on('drag', $scope.changeLineColor).on('dragend', $scope.resetLineColor);
                marker.id = linkPid;
                marker.addTo(topoMap);
            } else {
                marker = L.marker([(sLat + eLat) / 2, (sLng + eLng) / 2], {
                    icon: myIcon,
                    draggable: true,
                    title: 'linkPid=' + linkPid
                }).on('drag', $scope.changeLineColor).on('dragend', $scope.resetLineColor);
                marker.id = linkPid;
                marker.addTo(topoMap);
            }
        }
    }

    /* 时间控件 */
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
    var viewLat = $scope.laneInfoArr[0].geometry.coordinates[0][1];
    var viewLng = $scope.laneInfoArr[0].geometry.coordinates[0][0];
    topoMap.setView([viewLat, viewLng], 18);
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
    topoMap.on('zoomend', function (e) {
        var scale = ((topoMap.getZoom() - 17) * 0.05) + 0.8;
        $('.lane-img-container').css('-webkit-transform', 'scale(' + scale + ',' + scale + ')');
    });
    // 防止地图视口加载不全;
    topoMap.on('resize', function () {
        setTimeout(function () {
            topoMap.invalidateSize();
        }, 400);
    });
}]);
