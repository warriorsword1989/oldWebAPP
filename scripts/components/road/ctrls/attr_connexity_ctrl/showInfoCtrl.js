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
    $scope.CurrentLane = $scope.CurrentObject.lanes[$scope.CurrentObject.selectedLaneIndex];
    $scope.currLaneIndex = $scope.CurrentObject.selectedLaneIndex; // 当前选择的车道号
    $scope.directArr = []; // 由复合方向解析出来的简单方向数组
    $scope.outLinkArray = []; // 一个方向的退出线集合
    $scope.reachDirTrans = {
        "0": "0 未调查",
        "1": "1 直行",
        "2": "2 左转",
        "3": "3 右转",
        "4": "4 调头",
        "5": "5 左斜前",
        "6": "6 右斜前"
    };
    var changeDirects = {
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
    var transformDirect = function() {
        // 普通车方向
        Array.prototype.push.apply($scope.directArr, changeDirects[$scope.CurrentLane.dir.flag].split(""));
        // 公交车方向,不需要对公交车道做编辑，先注释掉
        // if ($scope.CurrentLane.busDir) {
        //     var tmp = changeDirects[$scope.CurrentLane.busDir.flag].split("");
        //     for (var k in tmp) {
        //         if ($scope.directArr.indexOf(tmp[k]) < 0) {
        //             $scope.directArr.push(tmp[k]);
        //         }
        //     }
        // }
    };
    transformDirect();
    // 计算一个当前车道一个通行方向的退出线
    var calculateLaneArr = function(direct) {
        var directNum = transData[direct];
        var topo, ordArr, outLinkObj;
        $scope.outLinkArray.length = 0;
        for (var i = 0, len = $scope.CurrentObject["topos"].length; i < len; i++) {
            topo = $scope.CurrentObject["topos"][i];
            ordArr = intToBinaryArray(topo.inLaneInfo);
            if (ordArr[$scope.currLaneIndex] == 1 && topo.reachDir == directNum) {
                topo._index = i;
                $scope.outLinkArray.push(topo); // 退出线
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
        for (var i = 0; i < $scope.outLinkArray.length; i++) {
            linkPid = $scope.outLinkArray[i].outLinkPid;
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
            for (var j = 0; j < $scope.outLinkArray[i].vias.length; j++) {
                linkPid = $scope.outLinkArray[i].vias[j].linkPid;
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
        if (map.currentTool) {
            map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
        }
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
        eventController.off(eventController.eventTypes.GETOUTLINKSPID);
        eventController.on(eventController.eventTypes.GETOUTLINKSPID, function(data) {
            if (parseInt(data.properties.fc) == 9) { // 不能选择9级路
                return;
            }
            var flag = false,
                i, topo, param;
            //如果在当前车道相同方向的退出线内,进行车道信息删除
            for (i = $scope.outLinkArray.length - 1; i >= 0; i--) {
                topo = $scope.outLinkArray[i];
                if (topo.outLinkPid == data.id) {
                    topo.inLaneInfo = changeLineInfo(topo.inLaneInfo, $scope.currLaneIndex, 0);
                    topo.busLaneInfo = changeLineInfo(topo.busLaneInfo, $scope.currLaneIndex, 0);
                    $scope.outLinkArray.splice(i, 1);
                    flag = true;
                }
            }
            //如果不在当前车道相同方向的退出线内,但是在其他车道的相同方向的退出线内，则在其他车道信息退出link信息中增加当前车道
            if (!flag) {
                for (i = 0, len = $scope.CurrentObject["topos"].length; i < len; i++) {
                    topo = $scope.CurrentObject["topos"][i];
                    if (topo.outLinkPid == data.id && topo.reachDir == directNum) {
                        topo.inLaneInfo = changeLineInfo(topo.inLaneInfo, $scope.currLaneIndex, 1);
                        $scope.outLinkArray.push(topo);
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
                    $scope.outLinkArray.push(topo);
                    doHighlight();
                });
            } else {
                doHighlight();
            }
        });
    };
    // todo 重构经过线的维护
    $scope.changeVias = function(item) {
        clearMapTool();
        tooltipsCtrl.setCurrentTooltip('请在地图上选择Link以调整经过线！');
        var inNodePid = $scope.CurrentObject["nodePid"];
        var viaLinks = getViaLinkList(item.vias);
        var outNodePid = getOutNodePid(inNodePid, viaLinks);
        var tmpOutNodePid = outNodePid;
        map.currentTool = new fastmap.uikit.SelectPath({
            map: map,
            currentEditLayer: rdLink,
            linksFlag: true,
            shapeEditor: shapeCtrl
        });
        map.currentTool.enable();
        var directNum = transData[item];
        eventController.off(eventController.eventTypes.GETLINKID);
        eventController.on(eventController.eventTypes.GETLINKID, function(data) {
            var pid = parseInt(data.id);
            if (pid == $scope.CurrentObject["inLinkPid"] || pid == item.outLinkPid) {
                return;
            }
            var flag = false;
            for (var i = 0; i < viaLinks.length; i++) {
                if (viaLinks[i].pid == pid) {
                    viaLinks.splice(i);
                    item.vias.splice(i);
                    tmpOutNodePid = getOutNodePid(inNodePid, viaLinks);
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                if (data.properties.snode == tmpOutNodePid || data.properties.enode == tmpOutNodePid) {
                    viaLinks.push({
                        pid: pid,
                        snode: data.properties.snode,
                        enode: data.properties.enode
                    });
                    item.vias.push(fastmap.dataApi.rdLaneVIA({
                        rowId: "",
                        linkPid: pid,
                        topologyId: item.pid,
                        seqNum: item.vias.length + 1
                    }));
                    tmpOutNodePid = data.properties.snode == tmpOutNodePid ? data.properties.enode : data.properties.snode;
                    flag = true;
                }
            }
            if (tmpOutNodePid == outNodePid) {
                tooltipsCtrl.setCurrentTooltip('经过线已经连通，可以保存！');
            } else {
                tooltipsCtrl.setCurrentTooltip('经过线未连通，请继续选择！');
            }
            if (flag) {
                doHighlight();
            }
        });
    };
    var getViaLinkList = function(oViaLinks) {
        var pidArray = [],
            i, j;
        for (i = 0; i < oViaLinks.length; i++) {
            pidArray.push(oViaLinks[i].linkPid);
        }
        var linkList = getLinkFromLayer(rdLink, pidArray.slice());
        var viaLinkList = [];
        for (i = 0; i < pidArray.length; i++) {
            for (j = 0; j < linkList.length; i++) {
                if (linkList[j].pid == pidArray[i]) {
                    viaLinkList.push(linkList[j]);
                    linkList.splice(j, 1);
                    break;
                }
            }
        }
        return viaLinkList;
    };
    var getOutNodePid = function(inNodePid, viaLinks) {
        var outNodePid = inNodePid;
        if (viaLinks.length > 0) {
            outNodePid = viaLinks[0].snode == inNodePid ? viaLinks[0].enode : viaLinks[0].snode;
            if (viaLinks.length > 1) {
                for (var i = 1; i < viaLinks.length; i++) {
                    outNodePid = viaLinks[i].snode == outNodePid ? viaLinks[i].enode : viaLinks[i].snode;
                }
            }
        }
        return outNodePid;
    };
    var getLinkFromLayer = function(layer, pidArray) {
        var ret = [];
        var data, pid, idx;
        for (var k in layer.tiles) {
            data = layer.tiles[k].data;
            for (var j = 0; j < data.length; j++) {
                pid = parseInt(data[j].properties.id);
                idx = pidArray.indexOf(pid);
                if (idx >= 0) {
                    ret.push({
                        pid: pid,
                        snode: parseInt(data[j].properties.snode),
                        enode: parseInt(data[j].properties.enode)
                    });
                    pidArray.splice(idx, 1);
                }
                if (pidArray.length == 0) {
                    break;
                }
            }
            if (pidArray.length == 0) {
                break;
            }
        }
        return ret;
    };
}]);