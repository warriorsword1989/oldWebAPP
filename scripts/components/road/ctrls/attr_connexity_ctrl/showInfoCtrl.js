/**
 * Created by liwanchong on 2016/3/1.
 * modified by liuyang
 */
var infoOfConnexityApp = angular.module("app");
infoOfConnexityApp.controller("infoOfConnexityController", ['$scope', 'dsEdit', function($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
    if ($scope.infoConnexityForm) {
        $scope.infoConnexityForm.$setPristine();
    }
    $scope.CurrentObject = objCtrl.data; // 车信对象
    $scope.currLaneIndex = $scope.CurrentObject.selectedLaneIndex; // 当前选择的车道号
    var CurrentLane = $scope.CurrentObject.lanes[$scope.currLaneIndex];
    $scope.directArr = []; // 由复合方向解析出来的简单方向数组
    $scope.outLanesArr = []; // 一个方向的退出线集合
    $scope.reachDirOptions = [
        {
            "id": 0,
            "label": "0 未调查"
        },
        {
            "id": 1,
            "label": "1 直"
        },
        {
            "id": 2,
            "label": "2 左"
        },
        {
            "id": 3,
            "label": "3 右"
        },
        {
            "id": 4,
            "label": "4 调"
        },
        {
            "id": 5,
            "label": "5 左斜前"
        },
        {
            "id": 6,
            "label": "6 右斜前"
        }
    ];
    $scope.reachDirTrans = {
        "0": "0 未调查",
        "1": "1 直行",
        "2": "2 左转",
        "3": "3 右转",
        "4": "4 调头",
        "5": "5 左斜前",
        "6": "6 右斜前"
    };
    $scope.changeDirects = {
        "a": "a",
        "b": "b",
        "c": "c",
        "d": "d",
        "e": "ad",
        "f": "ac",
        "g": "ab",
        "h": "bac",
        "i": "dac",
        "j": "dab",
        "k": "bc",
        "l": "db",
        "m": "dbc",
        "n": "dc",
        "o": "o",
        "p": "bace",
        "t": "ar",
        "u": "br",
        "v": "cr",
        "w": "dr",
        "x": "as",
        "y": "bs",
        "z": "cs",
        "0": "ds",
        "1": "rs",
        "2": "abr",
        "3": "abs",
        "4": "acr",
        "5": "acs"
    };
    var transData = {
        "a": 1,
        "b": 2,
        "c": 3,
        "d": 4,
        "r": 5,
        "s": 6
    };
    var intToBinaryArray = function(num) {
        var num = +num;
        var arr = num.toString(2).split("");
        for (var i = 0, len = arr.length; i < 16 - len; i++) {
            arr.unshift('0');
        }
        return arr;
    }
    var binaryArrayToInt = function(array) {
        return parseInt(array.join(''), 2);
    }
    var changeLineInfo = function(laneInfo, index, value) {
        var arr = intToBinaryArray(laneInfo);
        arr[index] = value;
        return binaryArrayToInt(arr);
    };
    // 对车道方向进行变换，将复合方向拆分为多个基本方向
    var getChangedDirect = function() {
        // 普通车方向
        Array.prototype.push.apply($scope.directArr, $scope.changeDirects[CurrentLane.dir.flag].split(""));
        // 公交车方向
        if (CurrentLane.busDir) {
            var tmp = $scope.changeDirects[CurrentLane.busDir.flag].split("");
            for (var k in tmp) {
                if ($scope.directArr.indexOf(tmp[k]) < 0) {
                    $scope.directArr.push(tmp[k]);
                }
            }
        }
    };
    getChangedDirect();
    // 计算一个当前车道一个通行方向的退出线
    var calculateLaneArr = function(direct) {
        var directNum = transData[direct];
        var topo, ordArr, outLinkObj;
        $scope.outLanesArr.length = 0;
        for (var i = 0, len = $scope.CurrentObject["topos"].length; i < len; i++) {
            topo = $scope.CurrentObject["topos"][i];
            ordArr = intToBinaryArray(topo.inLaneInfo);
            if (ordArr[$scope.currLaneIndex] == 1 && topo.reachDir == directNum) {
                topo._index = i;
                $scope.outLanesArr.push(topo); // 退出线
            }
        }
    };
    $scope.getBusFlag = function(busLaneInfo) {
        var busArr = intToBinaryArray(busLaneInfo);
        if (busArr[$scope.currLaneIndex] == 1) {
            return '是';
        } else {
            return '否';
        }
    };
    // 高亮一个方向
    var doHighlight = function() {
        //清除高亮
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
        // 进入线
        highRenderCtrl.highLightFeatures.push({
            id: $scope.CurrentObject["inLinkPid"].toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {
                color: 'red'
            }
        });
        var outLinkPids = [],
            viaLinkPids = [],
            linkPid;
        // 退出线
        for (var i = 0; i < $scope.outLanesArr.length; i++) {
            linkPid = $scope.outLanesArr[i].outLinkPid;
            if (outLinkPids.indexOf(linkPid) < 0) {
                highRenderCtrl.highLightFeatures.push({
                    id: linkPid.toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {
                        color: '#008000'
                    }
                });
                outLinkPids.push(linkPid);
            }
            for (var j = 0; j < $scope.outLanesArr[i].vias.length; j++) {
                linkPid = $scope.outLanesArr[i].vias[j].linkPid;
                if (outLinkPids.indexOf(linkPid) < 0 && viaLinkPids.indexOf(linkPid) < 0) {
                    highRenderCtrl.highLightFeatures.push({
                        id: linkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {
                            color: '#FFD306'
                        }
                    });
                    viaLinkPids.push(linkPid);
                }
            }
        }
        // 进入点
        highRenderCtrl.highLightFeatures.push({
            id: $scope.CurrentObject["nodePid"].toString(),
            layerid: 'rdLink',
            type: 'node',
            style: {}
        });
        highRenderCtrl.drawHighlight();
    };
    var selectedLaneDirIndex = -1;
    var selectLaneDir = function(event) {
        $(event.target).parent().siblings().find('.lanePic').removeClass('active');
        $(event.target).addClass("active");
    };
    $scope.selectLaneDirect = function(index, event) {
        if (index == selectedLaneDirIndex) {
            return;
        }
        if (event) {
            selectLaneDir(event);
        }
        var selectDirect = $scope.directArr[index];
        calculateLaneArr(selectDirect);
        doHighlight();
        selectedLaneDirIndex = index;
    }
    $scope.selectLaneDirect(0);
    var clearMapTool = function() {
        if (eventController.eventTypesMap[eventController.eventTypes.GETOUTLINKSPID]) {
            for (var ii = 0, lenII = eventController.eventTypesMap[eventController.eventTypes.GETOUTLINKSPID].length; ii < lenII; ii++) {
                eventController.off(eventController.eventTypes.GETOUTLINKSPID, eventController.eventTypesMap[eventController.eventTypes.GETOUTLINKSPID][ii]);
            }
        }
        map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
    };
    $scope.doEditOutLinks = function(item) {
        clearMapTool();
        tooltipsCtrl.setCurrentTooltip('请在地图上选择Link以调整退出线！');
        map.currentTool = new fastmap.uikit.SelectPath({
            map: map,
            currentEditLayer: rdLink,
            linksFlag: false,
            shapeEditor: shapeCtrl
        });
        map.currentTool.enable();
        var directNum = transData[item];
        eventController.on(eventController.eventTypes.GETOUTLINKSPID, function(data) {
            if (parseInt(data.properties.fc) == 9) { // 不能选择9级路
                return;
            }
            var flag = false,
                i, topo, param;
            //如果在当前车道相同方向的退出线内,进行车道信息删除
            for (i = $scope.outLanesArr.length - 1; i >= 0; i--) {
                topo = $scope.outLanesArr[i];
                if (topo.outLinkPid == data.id) {
                    topo.inLaneInfo = changeLineInfo(topo.inLaneInfo, $scope.currLaneIndex, 0);
                    topo.busLaneInfo = changeLineInfo(topo.busLaneInfo, $scope.currLaneIndex, 0);
                    $scope.outLanesArr.splice(i, 1);
                    flag = true;
                }
            }
            //如果不在当前车道相同方向的退出线内,但是在其他车道的相同方向的退出线内，则在其他车道信息退出link信息中增加当前车道
            if (!flag) {
                for (i = 0, len = $scope.CurrentObject["topos"].length; i < len; i++) {
                    topo = $scope.CurrentObject["topos"][i];
                    if (topo.outLinkPid == data.id && topo.reachDir == directNum) {
                        topo.inLaneInfo = changeLineInfo(topo.inLaneInfo, $scope.currLaneIndex, 1);
                        $scope.outLanesArr.push(topo);
                        flag = true;
                    }
                }
            }
            //如果不在所有同方向的退出线内,则进行新增
            if (!flag) {
                topo = fastmap.dataApi.rdLaneTopology({
                    "busLaneInfo": 0,
                    "connexityPid": $scope.CurrentObject["pid"],
                    "inLaneInfo": changeLineInfo(0, $scope.currLaneIndex, 1),
                    "outLinkPid": parseInt(data.id),
                    "reachDir": directNum,
                    "relationshipType": 1,
                    "vias": []
                });
                param = {};
                param["dbId"] = App.Temp.dbId;
                param["type"] = "RDLANEVIA";
                param["data"] = {
                    "inLinkPid": $scope.CurrentObject.inLinkPid,
                    "nodePid": $scope.CurrentObject.nodePid,
                    "outLinkPid": parseInt(data.id)
                };
                dsEdit.getByCondition(param).then(function(conLinks) { //找出经过线
                    if (conLinks !== -1) {
                        var via;
                        for (i = 0; i < conLinks.data.length; i++) {
                            via = fastmap.dataApi.rdLaneVIA({
                                rowId: "",
                                linkPid: conLinks.data[i],
                                seqNum: i + 1
                            });
                            topo.vias.push(via);
                        }
                    }
                    $scope.CurrentObject["topos"].unshift(topo);
                    $scope.outLanesArr.push(topo);
                    doHighlight();
                });
            } else {
                doHighlight();
            }
        });
    };
    // todo 重构经过线的维护
    $scope.changeVias = function(item) {
        tooltipsCtrl.setCurrentTooltip('请在地图上选择Link以调整经过线！');
        var lastNode = $scope.CurrentObject["nodePid"];
        var viaLink = [];
        dsEdit.getByPid(item.outLinkPid, "RDLINK").then(function(outLink) {
            if (outLink) {
                if (outLink.eNodePid == lastNode || outLink.sNodePid == lastNode) { //退出线和进入点相连，不能做经过线
                    swal("提示", "此退出线无法制作经过线！", "info");
                    return;
                } else {
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    highRenderCtrl.highLightFeatures.push({
                        id: $scope.CurrentObject["inLinkPid"].toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {
                            color: 'red'
                        }
                    });
                    highRenderCtrl.highLightFeatures.push({
                        id: $scope.CurrentObject["nodePid"].toString(),
                        layerid: 'rdLink',
                        type: 'node',
                        style: {}
                    });
                    highRenderCtrl.highLightFeatures.push({
                        id: item.outLinkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {
                            color: 'green'
                        }
                    });
                    for (var i = 0; i < item.vias.length; i++) {
                        highRenderCtrl.highLightFeatures.push({
                            id: item.vias[i].linkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#C1FFE4'
                            }
                        });
                    }
                    highRenderCtrl.drawHighlight();
                    map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
                    map.currentTool = new fastmap.uikit.SelectPath({
                        map: map,
                        currentEditLayer: rdLink,
                        linksFlag: false,
                        shapeEditor: shapeCtrl
                    });
                    map.currentTool.enable();
                    item.vias = [];
                    eventController.off(eventController.eventTypes.GETOUTLINKSPID);
                    eventController.on(eventController.eventTypes.GETOUTLINKSPID, function(data) {
                        if ((parseInt(data.id) != $scope.CurrentObject["inLinkPid"]) && (parseInt(data.id) != item.outLinkPid)) {
                            tooltipsCtrl.setCurrentTooltip('继续调整或点击属性面板“保存”按钮以保存！');
                            if (viaLink.indexOf(parseInt(data.id)) < 0) { //不在现有的经过线中
                                if (parseInt(data.properties.snode) == lastNode && (parseInt(data.properties.direct) != 3)) {
                                    viaLink.push(parseInt(data.id));
                                    lastNode = parseInt(data.properties.enode);
                                    highRenderCtrl.highLightFeatures.push({
                                        id: data.id.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {}
                                    });
                                    highRenderCtrl.drawHighlight();
                                    item.vias.push(fastmap.dataApi.rdLaneVIA({
                                        rowId: "",
                                        linkPid: parseInt(data.id),
                                        topologyId: item.pid,
                                        seqNum: item.vias.length + 1
                                    }));
                                } else if (parseInt(data.properties.enode) == lastNode && (parseInt(data.properties.direct) != 2)) {
                                    viaLink.push(parseInt(data.id));
                                    lastNode = parseInt(data.properties.snode);
                                    highRenderCtrl.highLightFeatures.push({
                                        id: data.id.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {}
                                    });
                                    highRenderCtrl.drawHighlight();
                                    item.vias.push(fastmap.dataApi.rdLaneVIA({
                                        rowId: "",
                                        linkPid: parseInt(data.id),
                                        topologyId: item.pid,
                                        seqNum: item.vias.length + 1
                                    }));
                                }
                            } else if (viaLink[viaLink.length - 1] == parseInt(data.id)) { //最后一条
                                if (parseInt(data.properties.enode) == lastNode) {
                                    lastNode = parseInt(data.properties.snode);
                                } else if (parseInt(data.properties.snode) == lastNode) {
                                    lastNode = parseInt(data.properties.enode);
                                }
                                viaLink.pop();
                                for (var i = 0; i < highRenderCtrl.highLightFeatures.length; i++) {
                                    if (highRenderCtrl.highLightFeatures[i] == data.id) {
                                        highRenderCtrl.highLightFeatures.splice(i, 1);
                                        i--;
                                    }
                                }
                                highRenderCtrl.drawHighlight();
                                for (var j = 0; j < item.vias.length; j++) {
                                    if (item.vias[j].linkPid == parseInt(data.id)) {
                                        item.vias.splice(j, 1);
                                        j--;
                                    }
                                }
                            }
                        }
                    })
                }
            }
        });
    };
}]);