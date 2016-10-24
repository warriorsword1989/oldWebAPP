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
    $scope.infoData = objCtrl.data;
    $scope.currLaneIndex = $scope.infoData["index"]; // 当前选择的车道号
    $scope.laneNum = 0; // 车道总数
    $scope.showDirect = [];
    $scope.outLanesArr = [];
    $scope.showLaneInfo = [];
    $scope.laneFlag = false;
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
    $scope.transData = {
        "a": 1,
        "b": 2,
        "c": 3,
        "d": 4,
        "r": 5,
        "s": 6
    };
    var decimalToArr = function(data) {
        var arr = [];
        arr = data.toString(2).split("");
        return arr;
    };
    var intToDecial = function(data) {
        var str = "1";
        for (var i = 0; i < 15 - data; i++) {
            str += "0";
        }
        return parseInt(str, 2).toString(10);
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
    }
    $scope.directArr = [];
    // 对车道方向进行变换，将复合方向拆分为多个基本方向
    var getChangedDirect = function() {
        var laneArr = $scope.infoData.laneInfo.split(",");
        $scope.laneNum = laneArr.length;
        var directArr = laneArr[$scope.currLaneIndex].split(/\[|\]|\<|\>/); // 把附加车道、公交车道的分隔符拆掉
        // 去掉空字符串
        for(var k in directArr) {
            if(!directArr[k]) {
                directArr.splice(k, 1);
            }
        }
        for (var i = 0; i < directArr.length; i++) {
            Array.prototype.push.apply($scope.directArr, $scope.changeDirects[directArr[i]].split(""));
        }
        // 判断是否是附加车道，并进行标识
        if (laneArr[$scope.currLaneIndex].indexOf('[') >= 0) {
            $scope.laneFlag = true;
        }
    };
    getChangedDirect();
    // 计算一个当前车道一个通行方向的退出线
    var calculateLaneArr = function(direct) {
        var directNum = $scope.transData[direct];
        var topo, ordArr, outLinkObj;
        $scope.outLanesArr.length = 0;
        for (var i = 0, len = $scope.infoData["topos"].length; i < len; i++) {
            topo = $scope.infoData["topos"][i];
            ordArr = intToBinaryArray(topo.inLaneInfo);
            if (ordArr[$scope.currLaneIndex] == 1 && topo.reachDir == directNum) {
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
        }
        // 高亮一个方向
    var refreshHighlight = function() {
        //清除高亮
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
        // 进入线
        highRenderCtrl.highLightFeatures.push({
            id: $scope.infoData["inLinkPid"].toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {
                color: 'red'
            }
        });
        // 进入点
        highRenderCtrl.highLightFeatures.push({
            id: $scope.infoData["nodePid"].toString(),
            layerid: 'rdLink',
            type: 'node',
            style: {}
        });
        // 退出线
        for (var i = 0; i < $scope.outLanesArr.length; i++) {
            highRenderCtrl.highLightFeatures.push({
                id: $scope.outLanesArr[i].outLinkPid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {
                    color: '#008000'
                }
            });
            for (var j = 0; j < $scope.outLanesArr[i].vias.length; j++) {
                highRenderCtrl.highLightFeatures.push({
                    id: $scope.outLanesArr[i].vias[j].linkPid.toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {
                        color: '#FFD306'
                    }
                });
            }
        }
        highRenderCtrl.drawHighlight();
    };
    var selectedLaneDirIndex = -1;
    var selectLanePic = function(event) {
        $.each($('#infoOfConnexityDiv .lanePic'), function(i, v) {
            $(v).removeClass('active');
        });
        $(event.target).addClass("active");
    };
    $scope.selectLaneDirect = function(index, event) {
        if (index == selectedLaneDirIndex) {
            return;
        }
        if(event) {
            selectLanePic(event);
        }
        var selectDirect = $scope.directArr[index];
        calculateLaneArr(selectDirect);
        refreshHighlight();
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
        var directNum = $scope.transData[item];
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
                for (i = 0, len = $scope.infoData["topos"].length; i < len; i++) {
                    topo = $scope.infoData["topos"][i];
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
                    "connexityPid": $scope.infoData["pid"],
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
                    "inLinkPid": $scope.infoData.inLinkPid,
                    "nodePid": $scope.infoData.nodePid,
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
                    $scope.infoData["topos"].unshift(topo);
                    $scope.outLanesArr.push(topo);
                    refreshHighlight();
                });
            } else {
                refreshHighlight();
            }
        });
    };
    // $scope.currentValue = function() {
    //     for (var i = 0, len = $scope.outLanesArr.length; i < len; i++) {
    //         if ($scope.outLanesArr[i]["reachDir"] === $scope.transData[$scope.directArr[0]]) {
    //             $scope.showLaneInfo.push($scope.outLanesArr[i]);
    //         }
    //     }
    // };
    // $scope.showVias = function() {
    //     for (var i = 0, len = $scope.showLaneInfo.length; i < len; i++) {
    //         for (var k = 0; k < highRenderCtrl.highLightFeatures.length; k++) {
    //             if (highRenderCtrl.highLightFeatures[k].id == $scope.showLaneInfo[i].outLinkPid.toString()) {
    //                 highRenderCtrl.highLightFeatures[k].style.color = "#FFD306";
    //             }
    //         }
    //         for (var j = 0; j < $scope.showLaneInfo[i].vias.length; j++) {
    //             highRenderCtrl.highLightFeatures.push({
    //                 id: $scope.showLaneInfo[i].vias[j].linkPid.toString(),
    //                 layerid: 'rdLink',
    //                 type: 'line',
    //                 style: {}
    //             });
    //         }
    //     }
    //     highRenderCtrl.drawHighlight();
    // };
    // $scope.getChangedDirect();
    // $scope.currentValue();
    // $scope.showVias();
    $scope.getLanesInfo = function(item, event) {
        // $scope.removeTipsActive();
        // $(event.target).addClass("active");
        tooltipsCtrl.setCurrentTooltip('请在地图上选择Link以调整退出线！');
        if (eventController.eventTypesMap[eventController.eventTypes.GETOUTLINKSPID]) {
            for (var ii = 0, lenII = eventController.eventTypesMap[eventController.eventTypes.GETOUTLINKSPID].length; ii < lenII; ii++) {
                eventController.off(eventController.eventTypes.GETOUTLINKSPID, eventController.eventTypesMap[eventController.eventTypes.GETOUTLINKSPID][ii]);
            }
        }
        $scope.showLaneInfo.length = 0;
        var outLinkArr = [],
            outLinkPid, changedObj = {},
            copyTopos = [];
        $scope.changeOutLinkFlag = 0;
        for (var i = 0, len = $scope.outLanesArr.length; i < len; i++) {
            if ($scope.outLanesArr[i]["reachDir"] === $scope.transData[item]) {
                $scope.showLaneInfo.push($scope.outLanesArr[i]);
                outLinkArr.push($scope.outLanesArr[i].outLinkPid);
            }
        }
        // $scope.showVias();
        // highRenderCtrl.drawHighlight();
        map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
        map.currentTool = new fastmap.uikit.SelectPath({
            map: map,
            currentEditLayer: rdLink,
            linksFlag: false,
            shapeEditor: shapeCtrl
        });
        map.currentTool.enable();
        eventController.off(eventController.eventTypes.GETOUTLINKSPID);
        eventController.on(eventController.eventTypes.GETOUTLINKSPID, function(data) {
            if (parseInt(data.properties.fc) != 9) {
                tooltipsCtrl.setCurrentTooltip('调整完成点击属性面板“保存”按钮以保存！');
                if (outLinkArr.indexOf(parseInt(data.id)) > -1) { //在现有的退出线内,排除掉
                    var inLaneDecArr = $scope.decimalToArr($scope.infoData["topos"][outLinkArr.indexOf(parseInt(data.id))]["inLaneInfo"]); //十进制转二进制
                    var infoLen = (16 - inLaneDecArr.length);
                    inLaneDecArr[infoLen] = "0";
                    var str = inLaneDecArr[0];
                    for (var j = 1; j < inLaneDecArr.length; j++) {
                        str += inLaneDecArr[j];
                    }
                    if (parseInt(parseInt(str, 2).toString(10)) == 0) {
                        for (var i = 0; i < $scope.infoData["topos"][outLinkArr.indexOf(parseInt(data.id))].vias.length; i++) {
                            for (var j = 0; j < highRenderCtrl.highLightFeatures.length; j++) {
                                if (highRenderCtrl.highLightFeatures[j].id == $scope.infoData["topos"][outLinkArr.indexOf(parseInt(data.id))].vias[i].linkPid.toString()) {
                                    highRenderCtrl.highLightFeatures.splice(j, 1);
                                    j--;
                                }
                            }
                        }
                        $scope.infoData["laneNum"] -= 1;
                        if ($scope.outLinkPidArr.indexOf(parseInt(data.id)) > -1) {
                            $scope.outLinkPidArr.splice($scope.outLinkPidArr.indexOf(parseInt(data.id)), 1);
                        }
                        $scope.infoData["topos"].splice(outLinkArr.indexOf(parseInt(data.id)), 1);
                    } else {
                        $scope.infoData["topos"][outLinkArr.indexOf(parseInt(data.id))]["inLaneInfo"] = parseInt(parseInt(str, 2).toString(10)); //二进制转十进制
                    }
                    for (var k = 0, lenK = $scope.showLaneInfo.length; k < lenK; k++) {
                        if (parseInt($scope.showLaneInfo[k]["outLinkPid"]) === parseInt(data.id)) {
                            outLinkPid = data.id;
                            changedObj = $scope.showLaneInfo[k];
                            $scope.showLaneInfo.splice(k, 1);
                            $scope.$apply();
                            $scope.changeOutLinkFlag++;
                            outLinkArr.splice(outLinkArr.indexOf(parseInt(data.id)), 1);
                            break;
                        }
                    }
                    for (var i = 0; i < highRenderCtrl.highLightFeatures.length; i++) {
                        if (highRenderCtrl.highLightFeatures[i].id == data.id.toString()) {
                            highRenderCtrl.highLightFeatures.splice(i, 1);
                            i--;
                        }
                    }
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.drawHighlight();
                } else if ($scope.outLinkPidArr.indexOf(parseInt(data.id)) > -1 && outLinkArr.indexOf(parseInt(data.id)) < 0) { //在当前的退出线中,但不是现有的退出线
                    outLinkArr.push(parseInt(data.id));
                    changedObj["outLinkPid"] = data.id;
                    changedObj["inLinkPid"] = $scope.infoData["inLinkPid"];
                    $scope.showLaneInfo.push(changedObj);
                    for (var k = 0; k < highRenderCtrl.highLightFeatures.length; k++) {
                        if (highRenderCtrl.highLightFeatures[k].id == data.id.toString()) {
                            highRenderCtrl.highLightFeatures[k].style.color = "#FFD306";
                        }
                    }
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.drawHighlight();
                    var inLaneDecArr = $scope.decimalToArr($scope.infoData["topos"][$scope.outLinkPidArr.indexOf(parseInt(data.id))]["inLaneInfo"]); //十进制转二进制
                    var infoLen = (16 - inLaneDecArr.length);
                    inLaneDecArr[infoLen] = "1";
                    var str = inLaneDecArr[0];
                    for (var j = 1; j < inLaneDecArr.length; j++) {
                        str += inLaneDecArr[j];
                    }
                    $scope.infoData["topos"][$scope.outLinkPidArr.indexOf(parseInt(data.id))]["inLaneInfo"] = parseInt(parseInt(str, 2).toString(10)); //二进制转十进制
                } else { //不在退出线内的线
                    highRenderCtrl.highLightFeatures.push({
                        id: data.id.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {}
                    });
                    var param1 = {};
                    param1["dbId"] = App.Temp.dbId;
                    param1["type"] = "RDLANEVIA";
                    param1["data"] = {
                        "inLinkPid": $scope.infoData.inLinkPid,
                        "nodePid": $scope.infoData.nodePid,
                        "outLinkPid": parseInt(data.id)
                    };
                    dsEdit.getByCondition(param1).then(function(conLinks) { //找出经过线
                        if (conLinks.errcode === -1) {
                            return;
                        }
                        if (conLinks.data) {
                            var viaArr = [];
                            for (var j = 0; j < conLinks.data.length; j++) {
                                var viasOne = fastmap.dataApi.rdLaneVIA({
                                    rowId: "",
                                    linkPid: conLinks.data[j]
                                });
                                viaArr.push(viasOne);
                                highRenderCtrl.highLightFeatures.push({
                                    id: conLinks.data[j].toString(),
                                    layerid: 'rdLink',
                                    type: 'line',
                                    style: {}
                                });
                            }
                            highRenderCtrl.drawHighlight();
                            var selObj = fastmap.dataApi.rdLaneTopology({
                                "busLaneInfo": 0,
                                "connexityPid": $scope.infoData["pid"],
                                "inLaneInfo": parseInt($scope.intToDecial($scope.infoData["selectNum"])),
                                "outLinkPid": parseInt(data.id),
                                "reachDir": $scope.transData[item] ? $scope.transData[item] : 0,
                                "relationshipType": 1,
                                "vias": viaArr
                            });
                            $scope.infoData["laneNum"] += 1;
                            $scope.infoData["topos"].unshift(selObj);
                            selObj.enterLaneNum = $scope.infoData["selectNum"];
                            selObj.enterBusNum = 0;
                            selObj.inLinkPid = $scope.infoData["inLinkPid"];
                            $scope.showLaneInfo.push(selObj);
                            outLinkArr.push(parseInt(data.id));
                        }
                    });
                }
                // highRenderCtrl.drawHighlight();
            }
        });
    };
    $scope.changeVias = function(item) {
        tooltipsCtrl.setCurrentTooltip('请在地图上选择Link以调整经过线！');
        var lastNode = $scope.infoData["nodePid"];
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
                        id: $scope.infoData["inLinkPid"].toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {
                            color: 'red'
                        }
                    });
                    highRenderCtrl.highLightFeatures.push({
                        id: $scope.infoData["nodePid"].toString(),
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
                        if ((parseInt(data.id) != $scope.infoData["inLinkPid"]) && (parseInt(data.id) != item.outLinkPid)) {
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