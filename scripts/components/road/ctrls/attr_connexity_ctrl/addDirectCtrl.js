/**
 * Created by liwanchong on 2016/3/9.
 */
var addDirectConnexityApp = angular.module("app");
addDirectConnexityApp.controller("addDirectOfConnexityController", ["$scope", 'dsEdit', function($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var layerCtrl = fastmap.uikit.LayerController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = new fastmap.uikit.HighRenderController();
    $scope.flagNum = 0;
    $scope.laneDirectData = [
        {
            flag: "a",
            log: "直"
        },
        {
            flag: "b",
            log: "左"
        },
        {
            flag: "c",
            log: "右"
        },
        {
            flag: "d",
            log: "调"
        },
        {
            flag: "e",
            log: "直调"
        },
        {
            flag: "f",
            log: "直右"
        },
        {
            flag: "g",
            log: "直左"
        },
        {
            flag: "h",
            log: "左直右"
        },
        {
            flag: "i",
            log: "调直右"
        },
        {
            flag: "j",
            log: "调左值"
        },
        {
            flag: "k",
            log: "左右"
        },
        {
            flag: "i",
            log: "调右"
        },
        {
            flag: "m",
            log: "调左右"
        },
        {
            flag: "n",
            log: "调右"
        },
        {
            flag: "o",
            log: "空"
        }
    ];
    var dirTranform = {
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
    var dirCharToNum = {
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
    var CurrentObject = objCtrl.data;
    var currentLaneIndex = CurrentObject.lanes.length;
    var currentDirArray = [];
    var outLanesArr = [];
    var selectedLaneInfo = null;
    // 选择道路方向
    $scope.selectLaneDir = function(item, event) {
        $(event.target).siblings().removeClass("active");
        $(event.target).addClass("active");
        currentDirArray.length = 0;
        outLanesArr.length = 0;
        var tmp = dirTranform[item.flag].split("");
        for (var k in tmp) {
            currentDirArray.push(dirCharToNum[tmp[k]]);
        }
        selectedLaneInfo = {
            dir: item,
            adt: 0,
            busDir: null
        };
        if (event.button == 2) {
            selectedLaneInfo.adt = 1;
        }
        enableOutLinkHandler();
    };
    var enableOutLinkHandler = function() {
        map.currentTool.disable();
        map.currentTool = new fastmap.uikit.SelectPath({
            map: map,
            currentEditLayer: rdLink,
            linksFlag: false,
            shapeEditor: shapeCtrl
        });
        map.currentTool.enable();
        tooltipsCtrl.setCurrentTooltip('请在地图上选择退出线！');
        eventController.off(eventController.eventTypes.GETOUTLINKSPID);
        eventController.on(eventController.eventTypes.GETOUTLINKSPID, function(data) {
            var pid = parseInt(data.id);
            // 退出线不能与进入线相同
            if (pid == CurrentObject.inLinkPid) {
                tooltipsCtrl.setCurrentTooltip("退出线不能与进入线是同一条线，请重新选择!", 'error');
                return;
            }
            if (parseInt(data.properties.kind) >= 9) { // 不能选择9级路
                tooltipsCtrl.setCurrentTooltip("退出线不能是9级以上道路，请重新选择!", 'error');
                return;
            }
            var flag = false,
                i, topo, param;
            //如果在当前车道相同方向的退出线内,进行车道信息删除
            for (i = outLanesArr.length - 1; i >= 0; i--) {
                topo = outLanesArr[i];
                if (topo.outLinkPid == pid) {
                    // topo.inLaneInfo = changeLineInfo(topo.inLaneInfo, currentLaneIndex, 0);
                    // topo.busLaneInfo = changeLineInfo(topo.busLaneInfo, currentLaneIndex, 0);
                    outLanesArr.splice(i, 1);
                    flag = true;
                }
            }
            //如果不在当前车道相同方向的退出线内,但是在其他车道的相同方向的退出线内，则在其他车道信息退出link信息中增加当前车道
            if (!flag) {
                for (i = 0, len = CurrentObject["topos"].length; i < len; i++) {
                    topo = CurrentObject["topos"][i];
                    if (topo.outLinkPid == pid && currentDirArray.indexOf(topo.reachDir) >= 0) {
                        // topo.inLaneInfo = changeLineInfo(topo.inLaneInfo, currentLaneIndex, 1);
                        outLanesArr.push(topo);
                        flag = true;
                    }
                }
            }
            //如果不在所有同方向的退出线内,则进行新增
            if (!flag) {
                topo = fastmap.dataApi.rdLaneTopology({
                    "busLaneInfo": 0,
                    "connexityPid": CurrentObject["pid"],
                    "inLaneInfo": changeLineInfo(0, currentLaneIndex, 1),
                    "outLinkPid": pid,
                    "reachDir": currentDirArray[0],
                    "relationshipType": 1,
                    "vias": []
                });
                param = {};
                param["dbId"] = App.Temp.dbId;
                param["type"] = "RDLANEVIA";
                param["data"] = {
                    "inLinkPid": CurrentObject.inLinkPid,
                    "nodePid": CurrentObject.nodePid,
                    "outLinkPid": pid,
                    "type": "RDLANECONNEXITY" // 车信专用
                };
                dsEdit.getByCondition(param).then(function(data) { //找出经过线
                    if (data !== -1) {
                        var temp = data.data[0];
                        topo.relationshipType = temp.relationshipType;
                        var via;
                        for (i = 0; i < temp.links.length; i++) {
                            via = fastmap.dataApi.rdLaneVIA({
                                rowId: "",
                                linkPid: temp.links[i],
                                seqNum: i + 1
                            });
                            topo.vias.push(via);
                        }
                    }
                    // CurrentObject["topos"].unshift(topo);
                    outLanesArr.push(topo);
                    doHighlight();
                });
            } else {
                doHighlight();
            }
            if (outLanesArr.length > 0) {
                tooltipsCtrl.setCurrentTooltip('已选择了' + outLanesArr.length + '根退出线！');
            } else {
                tooltipsCtrl.setCurrentTooltip('请在地图上选择退出线！');
            }
        });
    };
    $scope.addLane = function() {
        if (selectedLaneInfo) {
            if (map.currentTool) {
                map.currentTool.disable();
            }
            if (CurrentObject.lanes.length == currentLaneIndex) { // 插入
                CurrentObject.lanes.push(selectedLaneInfo);
            } else { // 替换
                CurrentObject.lanes.splice(currentLaneIndex, 1, selectedLaneInfo);
            }
            for (var i = 0; i < outLanesArr.length; i++) {
                if (outLanesArr[i].pid == 0) { // 新增
                    CurrentObject["topos"].unshift(outLanesArr[i]);
                } else {
                    outLanesArr[i].inLaneInfo = changeLineInfo(outLanesArr[i].inLaneInfo, currentLaneIndex, 1);
                }
            }
            toggleExtend();
            // 清空全局信息后，可以再当前页面继续增加
            selectedLaneInfo = null;
            currentLaneIndex = CurrentObject.lanes.length;
        }
    };
    var toggleExtend = function() {
        var left = 0,
            right = 0,
            i;
        for (i = 0; i < CurrentObject.lanes.length; i++) {
            if (CurrentObject.lanes[i].adt == 1) {
                left++;
            } else {
                break;
            }
        }
        if (CurrentObject.lanes.length == left) {
            CurrentObject.leftExtend = Math.ceil(left / 2);
            CurrentObject.rightExtend = Math.floor(left / 2);
        } else {
            CurrentObject.leftExtend = left;
            for (i = CurrentObject.lanes.length - 1; i > left; i--) {
                if (CurrentObject.lanes[i].adt == 1) {
                    right++;
                } else {
                    break;
                }
            }
            CurrentObject.rightExtend = right;
        }
    };
    // 高亮一个方向
    var doHighlight = function() {
        //清除高亮
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
        // 进入线
        highRenderCtrl.highLightFeatures.push({
            id: CurrentObject["inLinkPid"].toString(),
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
        for (var i = 0; i < outLanesArr.length; i++) {
            linkPid = outLanesArr[i].outLinkPid;
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
            for (var j = 0; j < outLanesArr[i].vias.length; j++) {
                linkPid = outLanesArr[i].vias[j].linkPid;
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
            id: CurrentObject["nodePid"].toString(),
            layerid: 'rdLink',
            type: 'node',
            style: {}
        });
        highRenderCtrl.drawHighlight();
    };
    // 初始化时渲染一次
    doHighlight();
}]);