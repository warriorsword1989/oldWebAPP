/**
 * Created by liwanchong on 2016/3/1.
 * modified by liuyang
 */
var infoOfConnexityApp = angular.module("app");
infoOfConnexityApp.controller("infoOfConnexityController", ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.infoData = objCtrl.data;
    $scope.directArr = $scope.infoData.laneInfo.split(",");
    var eventController = fastmap.uikit.EventController();
    $scope.showDirect = [];
    $scope.outLinkPidArr = [];
    $scope.outLanesArr = [];
    $scope.showLaneInfo = [];
    $scope.laneFlag = false;
    $scope.laneNum = $scope.infoData["laneInfo"].split(",").length;
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    //清除高亮
    highRenderCtrl._cleanHighLight();
    highRenderCtrl.highLightFeatures.length = 0;
    //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
    if ($scope.infoConnexityForm) {
        $scope.infoConnexityForm.$setPristine();
    }
    $scope.reachDirOptions = [
        {"id": 0, "label": "0 未调查"},
        {"id": 1, "label": "1 直"},
        {"id": 2, "label": "2 左"},
        {"id": 3, "label": "3 右"},
        {"id": 4, "label": "4 调"},
        {"id": 5, "label": "5 左斜前"},
        {"id": 6, "label": "6 右斜前"}
    ];
    $scope.changeDirects =
    {
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
    $scope.decimalToArr = function (data) {
        var arr = [];
        arr = data.toString(2).split("");
        return arr;
    };
    $scope.intToDecial = function (data) {
        var str = "1";
        for (var i = 0; i < 15 - data; i++) {
            str += "0";
        }
        return parseInt(str, 2).toString(10);
    };
    var highLightFeatures = [];
    highLightFeatures.push({
        id: objCtrl.data["inLinkPid"].toString(),
        layerid: 'rdLink',
        type: 'line',
        style: {color: 'red'}
    });
    highLightFeatures.push({
        id: objCtrl.data["nodePid"].toString(),
        layerid: 'rdLink',
        type: 'node',
        style: {}
    });
    $scope.calculateLaneArr = function () {
        for (var i = 0, len = $scope.infoData["topos"].length; i < len; i++) {
            $scope.outLinkPidArr.push($scope.infoData["topos"][i].outLinkPid);
            var arrOfDecimal = $scope.decimalToArr($scope.infoData["topos"][i]["inLaneInfo"]), lenOfInfo;
            if (arrOfDecimal.lastIndexOf('1') === 0) {
                lenOfInfo = (16 - arrOfDecimal.length);
                if (lenOfInfo === $scope.infoData["index"]) {
                    highLightFeatures.push({
                        id: $scope.infoData["topos"][i].outLinkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {color: '#FFF4C1'}
                    });
                    var obj = $scope.infoData["topos"][i];
                    // var obj = ($.extend(true, {}, $scope.infoData["topos"][i]));
                    obj["enterLaneNum"] = lenOfInfo + 1;
                    if (obj["busLaneInfo"] !== 0) {
                        obj["enterBusNum"] = lenOfInfo + 1;
                    } else {
                        obj["enterBusNum"] = 0;
                    }
                    $scope.outLanesArr.push(obj);
                }
            } else {
                var numLen = arrOfDecimal.lastIndexOf('1') - arrOfDecimal.indexOf("1");
                for (var k = 0; k <= numLen; k++) {
                    lenOfInfo = (16 - arrOfDecimal.length + k);
                    if (lenOfInfo === $scope.infoData["index"]) {
                        highLightFeatures.push({
                            id: $scope.infoData["topos"][i].outLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {color: '#FFF4C1'}
                        })
                        var obj = $scope.infoData["topos"][i];
                        // var obj = ($.extend(true, {}, $scope.infoData["topos"][i]));
                        obj["enterLaneNum"] = lenOfInfo + 1;
                        if (obj["busLaneInfo"] !== 0) {
                            obj["enterBusNum"] = lenOfInfo + 1;
                        } else {
                            obj["enterBusNum"] = 0;
                        }
                        $scope.outLanesArr.push(obj);
                    }
                }
            }
        }
    };
    $scope.calculateLaneArr();
    highRenderCtrl.highLightFeatures = highLightFeatures;
    highRenderCtrl.drawHighlight();
    $scope.getChangedDirect = function () {
        var direct = $scope.directArr[$scope.infoData["selectNum"]];
        if (direct.length === 1) {
            $scope.directArr = $scope.changeDirects[direct].split("");
        } else {
            if (direct.indexOf("]") !== -1) {
                $scope.laneFlag = true;
                if (direct.indexOf(">") !== -1) {
                    $scope.directArr = $scope.changeDirects[direct.charAt(1)].split("");
                } else {
                    $scope.directArr = $scope.changeDirects[direct.charAt(direct.length - 2)].split("");
                }
            }
        }
    };

    $scope.removeTipsActive = function () {
        $.each($('.lanePic'), function (i, v) {
            $(v).removeClass('active');
        });
    };
    $scope.currentValue = function () {
        for (var i = 0, len = $scope.outLanesArr.length; i < len; i++) {
            if ($scope.outLanesArr[i]["reachDir"] === $scope.transData[$scope.directArr[0]]) {
                $scope.showLaneInfo.push($scope.outLanesArr[i]);
            }
        }
    };
    $scope.showVias = function () {
        for (var i = 0, len = $scope.showLaneInfo.length; i < len; i++) {
            for (var k = 0; k < highRenderCtrl.highLightFeatures.length; k++) {
                if (highRenderCtrl.highLightFeatures[k].id == $scope.showLaneInfo[i].outLinkPid.toString()) {
                    highRenderCtrl.highLightFeatures[k].style.color = "#FFD306";
                }
            }
            for (var j = 0; j < $scope.showLaneInfo[i].vias.length; j++) {
                highRenderCtrl.highLightFeatures.push({
                    id: $scope.showLaneInfo[i].vias[j].linkPid.toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {}
                });
            }
        }
        highRenderCtrl.drawHighlight();
    };
    $scope.getChangedDirect();
    $scope.currentValue();
    $scope.showVias();
    $scope.getLanesInfo = function (item, event) {
        // $scope.removeTipsActive();
        // $(event.target).addClass("active");
        if (eventController.eventTypesMap[eventController.eventTypes.GETOUTLINKSPID]) {
            for (var ii = 0, lenII = eventController.eventTypesMap[eventController.eventTypes.GETOUTLINKSPID].length; ii < lenII; ii++) {
                eventController.off(eventController.eventTypes.GETOUTLINKSPID, eventController.eventTypesMap[eventController.eventTypes.GETOUTLINKSPID][ii]);
            }
        }
        $scope.showLaneInfo.length = 0;
        var outLinkArr = [], outLinkPid, changedObj = {},
            copyTopos = [];
        $scope.changeOutLinkFlag = 0;
        for (var i = 0, len = $scope.outLanesArr.length; i < len; i++) {
            if ($scope.outLanesArr[i]["reachDir"] === $scope.transData[item]) {
                $scope.showLaneInfo.push($scope.outLanesArr[i]);
                outLinkArr.push($scope.outLanesArr[i].outLinkPid);
            }
        }
        $scope.showVias();
        // highRenderCtrl.drawHighlight();
        map.currentTool.disable();//禁止当前的参考线图层的事件捕获
        map.currentTool = new fastmap.uikit.SelectPath({
            map: map,
            currentEditLayer: rdLink,
            linksFlag: false,
            shapeEditor: shapeCtrl
        });
        map.currentTool.enable();
        eventController.off(eventController.eventTypes.GETOUTLINKSPID);
        eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (data) {
            if (parseInt(data.properties.fc) != 9) {
                if ($scope.outLinkPidArr.indexOf(parseInt(data.id)) > -1 && outLinkArr.indexOf(parseInt(data.id)) < 0) {//在当前的退出线中,但不是现有的退出线
                    changedObj["outLinkPid"] = data.id;
                    changedObj["inLinkPid"] = objCtrl.data["inLinkPid"];
                    $scope.showLaneInfo.push(changedObj);
                    for (var k = 0; k < highRenderCtrl.highLightFeatures.length; k++) {
                        if (highRenderCtrl.highLightFeatures[k].id == data.id.toString()) {
                            highRenderCtrl.highLightFeatures[k].style.color = "#FFD306";
                        }
                    }
                    var inLaneDecArr = $scope.decimalToArr($scope.infoData["topos"][$scope.outLinkPidArr.indexOf(parseInt(data.id))]["inLaneInfo"]);//十进制转二进制
                    var infoLen = (16 - inLaneDecArr.length);
                    inLaneDecArr[$scope.directArr.length - infoLen] = "1";
                    var str = inLaneDecArr[0];
                    for (var j = 1; j < inLaneDecArr.length; j++) {
                        str += inLaneDecArr[j];
                    }
                    $scope.infoData["topos"][$scope.outLinkPidArr.indexOf(parseInt(data.id))]["inLaneInfo"] = parseInt(parseInt(str, 2).toString(10));//二进制转十进制
                } else if (outLinkArr.indexOf(parseInt(data.id)) > -1) {//在现有的退出线内,排除掉
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
                    var inLaneDecArr = $scope.decimalToArr($scope.infoData["topos"][$scope.outLinkPidArr.indexOf(parseInt(data.id))]["inLaneInfo"]);//十进制转二进制
                    var infoLen = (16 - inLaneDecArr.length);
                    inLaneDecArr[$scope.directArr.length - infoLen] = "0";
                    var str = inLaneDecArr[0];
                    for (var j = 1; j < inLaneDecArr.length; j++) {
                        str += inLaneDecArr[j];
                    }
                    if (parseInt(parseInt(str, 2).toString(10)) == 0) {
                        for (var i = 0; i < $scope.infoData["topos"][$scope.outLinkPidArr.indexOf(parseInt(data.id))].vias.length; i++) {
                            for (var j = 0; j < highRenderCtrl.highLightFeatures.length; j++) {
                                if (highRenderCtrl.highLightFeatures[j].id == $scope.infoData["topos"][$scope.outLinkPidArr.indexOf(parseInt(data.id))].vias[i].outLinkPid.toString()) {
                                    highRenderCtrl.highLightFeatures.splice(j, 1);
                                    j--;
                                }
                            }
                        }
                        $scope.infoData["topos"].splice($scope.outLinkPidArr.indexOf(parseInt(data.id)), 1);
                    } else {
                        $scope.infoData["topos"][$scope.outLinkPidArr.indexOf(parseInt(data.id))]["inLaneInfo"] = parseInt(parseInt(str, 2).toString(10));//二进制转十进制
                    }
                    for (var i = 0; i < highRenderCtrl.highLightFeatures.length; i++) {
                        if (highRenderCtrl.highLightFeatures[i].id == data.id.toString()) {
                            highRenderCtrl.highLightFeatures.splice(i, 1);
                            i--;
                        }
                    }
                } else {//不在退出线内的线
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
                    dsEdit.getByCondition(param1).then(function (conLinks) {//找出经过线
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
                                "inLaneInfo": parseInt($scope.intToDecial($scope.directArr.length)),
                                "outLinkPid": parseInt(data.id),
                                "reachDir": $scope.transData[item] ? $scope.transData[item] : 0,
                                "relationshipType": 1,
                                "vias": viaArr
                            });
                            for(var i = 0;i<selObj.vias.length;i++){
                                selObj.vias[i].objStatus = "INSERT";//当前的比较方法无法处理新增子表嵌套新增子表的情况，临时加这样的方法
                            }
                            $scope.infoData["laneNum"] += 1;
                            $scope.infoData["topos"].unshift(selObj);
                            selObj.enterLaneNum = $scope.showLaneInfo[0].enterLaneNum || 0;
                            selObj.enterBusNum = $scope.showLaneInfo[0].enterBusNum || 0;
                            selObj.inLinkPid = objCtrl.data["inLinkPid"];
                            $scope.showLaneInfo.push(selObj);
                            outLinkArr.push(parseInt(data.id));
                        }
                    });
                }
                highRenderCtrl.drawHighlight();
            }
        });
    };
    $scope.changeVias = function (item) {
        var lastNode = objCtrl.data["nodePid"];
        var viaLink = [];
        dsEdit.getByPid(item.outLinkPid, "RDLINK").then(function (outLink) {
            if (outLink) {
                if (outLink.eNodePid == lastNode || outLink.sNodePid == lastNode) {//退出线和进入点相连，不能做经过线
                    swal("提示", "此退出线无法制作经过线！", "info");
                    return;
                } else {
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    highRenderCtrl.highLightFeatures.push({
                        id: objCtrl.data["inLinkPid"].toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {color: 'red'}
                    });
                    highRenderCtrl.highLightFeatures.push({
                        id: objCtrl.data["nodePid"].toString(),
                        layerid: 'rdLink',
                        type: 'node',
                        style: {}
                    });
                    highRenderCtrl.highLightFeatures.push({
                        id: item.outLinkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {color: 'green'}
                    });
                    for (var i = 0; i < item.vias.length; i++) {
                        highRenderCtrl.highLightFeatures.push({
                            id: item.vias[i].linkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {color: '#C1FFE4'}
                        });
                    }
                    highRenderCtrl.drawHighlight();
                    map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                    map.currentTool = new fastmap.uikit.SelectPath({
                        map: map,
                        currentEditLayer: rdLink,
                        linksFlag: false,
                        shapeEditor: shapeCtrl
                    });
                    map.currentTool.enable();
                    item.vias = [];
                    eventController.off(eventController.eventTypes.GETOUTLINKSPID);
                    eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (data) {
                        if ((parseInt(data.id) != objCtrl.data["inLinkPid"]) && (parseInt(data.id) != item.outLinkPid)) {
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
                                        topologyId: item.topologyId,
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
                                        topologyId: item.topologyId,
                                        seqNum: item.vias.length + 1
                                    }));
                                }
                            } else if (viaLink[viaLink.length - 1] == parseInt(data.id)) {//最后一条
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