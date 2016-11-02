/**
 * Created by liuzhaoxia on 2015/12/23.
 */
var otherApp = angular.module('app');
otherApp.controller("rdLaneConnexityController", ['$scope', '$ocLazyLoad', '$document', 'appPath', 'dsEdit', '$q', function($scope, $ocLazyLoad, $document, appPath, dsEdit, $q) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var layerCtrl = fastmap.uikit.LayerController();
    var eventController = fastmap.uikit.EventController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var rdConnexity = layerCtrl.getLayerById("relationData");
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
    var getDirectNumArray = function(laneDir) {
        var ret = [];
        var tmp = changeDirects[laneDir].split("");
        for (var k in tmp) {
            ret.push(transData[tmp[k]]);
        }
        return ret;
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
    var getLaneDirFlag = function(laneInfo, index) {
        var arr = intToBinaryArray(laneInfo);
        return parseInt(arr[index]);
    };
    $scope.initialize = function() {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.initializeData();
    };
    $scope.initializeData = function() {
        $scope.CurrentObject = objCtrl.data;
        $scope.CurrentObject.lanes = [];
        var laneInfo = $scope.CurrentObject.laneInfo.split(",");
        var lane, temp;
        for (var i = 0; i < laneInfo.length; i++) {
            lane = {
                dir: null,
                adt: 0,
                busDir: null
            };
            if (laneInfo[i].indexOf('[') >= 0) { // 附加车道
                lane.adt = 1;
                laneInfo[i] = laneInfo[i].replace(/\[|\]/g, '');
            }
            if (laneInfo[i].indexOf('<') >= 0) { // 公交车道
                laneInfo[i] = laneInfo[i].replace(/\<|\>/g, '');
                temp = laneInfo[i].split('');
                if (temp.length == 1) { // 普通车道与公交车道同方向
                    lane.dir = {
                        flag: temp[0]
                    };
                    lane.busDir = {
                        flag: temp[0]
                    };
                } else { // 普通车道与公交车道不同方向，普通车道在前，公交车道在后
                    lane.dir = {
                        flag: temp[0]
                    };
                    lane.busDir = {
                        flag: temp[1]
                    };
                }
            } else {
                lane.dir = {
                    flag: laneInfo[i]
                };
            }
            $scope.CurrentObject.lanes.push(lane);
        }
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.rdLaneConnexityForm) {
            $scope.rdLaneConnexityForm.$setPristine();
        }
        doHighlight();
    };
    // 高亮
    var doHighlight = function() {
        var outLinkPids = [],
            viaLinkPids = []; // 用于防止重复绘制，以及优先画退出线
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
        var linkPid;
        // 退出线
        for (var i = 0; i < $scope.CurrentObject['topos'].length; i++) {
            linkPid = $scope.CurrentObject['topos'][i].outLinkPid;
            if (outLinkPids.indexOf(linkPid) < 0 && $scope.CurrentObject['topos'][i].inLaneInfo > 0) {
                highRenderCtrl.highLightFeatures.push({
                    id: linkPid.toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {
                        color: '#008000'
                    }
                });
                // 经过线
                for (var j = 0; j < $scope.CurrentObject['topos'][i].vias.length; j++) {
                    linkPid = $scope.CurrentObject['topos'][i].vias[j].linkPid;
                    if (outLinkPids.indexOf(linkPid) < 0 && viaLinkPids.indexOf(linkPid) < 0) {
                        highRenderCtrl.highLightFeatures.push({
                            id: $scope.CurrentObject['topos'][i].vias[j].linkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#FFD306'
                            }
                        });
                    }
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
        //高亮本身图标
        highRenderCtrl.highLightFeatures.push({
            id: $scope.CurrentObject.pid.toString(),
            layerid: 'relationData',
            type: 'relationData',
            style: {
                fillColor: '#ff00ff',
                radius: 3
            }
        });
        highRenderCtrl.drawHighlight();
    };
    $scope.clickLane = function(item, index, event) {
        selectLane(event);
        $scope.CurrentObject.selectedLaneIndex = index;
        if (event.button == 2) { // 修改普通车道方向
            $scope.CurrentObject.changeLaneDirectFlag = 1;
            changeLaneDir();
        } else {
            // 显示车道详情
            var rdlaneInfoObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
                "loadType": "subAttrTplContainer",
                "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
                "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
                "callback": function() {
                    var showInfoObj = {
                        "loadType": "subAttrTplContainer",
                        "propertyCtrl": appPath.road + 'ctrls/attr_connexity_ctrl/showInfoCtrl',
                        "propertyHtml": appPath.root + appPath.road + 'tpls/attr_connexity_tpl/showInfoTpl.html'
                    };
                    $scope.$emit("transitCtrlAndTpl", showInfoObj);
                }
            };
            $scope.$emit("transitCtrlAndTpl", rdlaneInfoObj);
        }
    };
    // 选中车道进行高亮
    var selectLane = function(event) {
        $(event.target).parent().parent().parent().find('.lanePic').removeClass("active");
        $(event.target).addClass('active');
    };
    // 修改公交车道方向
    $scope.changeBusLaneDir = function(item, index, event) {
        selectLane(event);
        $scope.CurrentObject.selectedLaneIndex = index;
        $scope.CurrentObject.changeLaneDirectFlag = 2;
        changeLaneDir();
    };
    // 打开方向选择面板
    var changeLaneDir = function() {
        // 改方向
        var rdlaneInfoObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            "loadType": "subAttrTplContainer",
            "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            "callback": function() {
                var changedDirectObj = {
                    "loadType": "subAttrTplContainer",
                    "propertyCtrl": appPath.road + 'ctrls/attr_connexity_ctrl/changeDirectCtrl',
                    "propertyHtml": appPath.root + appPath.road + 'tpls/attr_connexity_tpl/changeDirectTpl.html'
                };
                $scope.$emit("transitCtrlAndTpl", changedDirectObj);
            }
        };
        $scope.$emit("transitCtrlAndTpl", rdlaneInfoObj);
    };
    // 打开增加车道的方向选择面板
    $scope.addLane = function() {
        var rdlaneInfoObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            "loadType": "subAttrTplContainer",
            "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            "callback": function() {
                var addDirectObj = {
                    "loadType": "subAttrTplContainer",
                    "propertyCtrl": appPath.road + 'ctrls/attr_connexity_ctrl/addDirectCtrl',
                    "propertyHtml": appPath.root + appPath.road + 'tpls/attr_connexity_tpl/addDirectTpl.html'
                };
                $scope.$emit("transitCtrlAndTpl", addDirectObj);
            }
        };
        $scope.$emit("transitCtrlAndTpl", rdlaneInfoObj);
    };
    //删除车道
    $scope.deleteLane = function(item, index) {
        var topo;
        for (var i = 0; i < $scope.CurrentObject.topos.length; i++) {
            topo = $scope.CurrentObject.topos[i];
            topo.inLaneInfo = changeLineInfo(topo.inLaneInfo, index, 0);
            topo.busLaneInfo = changeLineInfo(topo.busLaneInfo, index, 0);
        }
        $scope.CurrentObject.lanes.splice(index, 1);
        toggleExtend();
    };
    // 增加公交车道属性
    var addBusLane = function(item, index) {
        var topo;
        var dir = getDirectNumArray(item.dir.flag);
        for (var i = 0; i < $scope.CurrentObject.topos.length; i++) {
            topo = $scope.CurrentObject.topos[i];
            // 新增公交方向，必须参考普通方向
            if (dir.indexOf(topo.reachDir) >= 0 && getLaneDirFlag(topo.inLaneInfo, index) == 1) {
                topo.busLaneInfo = changeLineInfo(topo.busLaneInfo, index, 1);
            }
        }
        item.busDir = {
            flag: item.dir.flag
        };
    };
    //删除公交车道属性
    $scope.deleteBusLane = function(item, index) {
        var topo;
        var dir = getDirectNumArray(item.busDir.flag);
        for (var i = 0; i < $scope.CurrentObject.topos.length; i++) {
            topo = $scope.CurrentObject.topos[i];
            if (dir.indexOf(topo.reachDir) >= 0) {
                topo.busLaneInfo = changeLineInfo(topo.busLaneInfo, index, 0);
            }
        }
        item.busDir = null;
    };
    var toggleBusLane = function(item, index) {
        if (item.busDir) {
            $scope.deleteBusLane(item, index);
        } else {
            addBusLane(item, index);
        }
    };
    var toggleAdtLane = function(item) {
        if (item.adt == 1) {
            item.adt = 0;
        } else {
            item.adt = 1;
        }
        toggleExtend();
    };
    var toggleExtend = function() {
        if ($scope.CurrentObject.lanes.length > 0) {
            if ($scope.CurrentObject.lanes.length == 1) {
                $scope.CurrentObject.leftExtend = $scope.CurrentObject.lanes[0].adt;
                $scope.CurrentObject.rightExtend = 0;
            } else {
                var cnt = 0,
                    i;
                for (i = 0; i < $scope.CurrentObject.lanes.length; i++) {
                    if ($scope.CurrentObject.lanes[i].adt == 1) {
                        cnt++;
                    } else {
                        break;
                    }
                }
                $scope.CurrentObject.leftExtend = cnt;
                cnt = 0;
                for (i = $scope.CurrentObject.lanes.length - 1; i >= 0; i--) {
                    if ($scope.CurrentObject.lanes[i].adt == 1) {
                        cnt++;
                    } else {
                        break;
                    }
                }
                $scope.CurrentObject.rightExtend = cnt;
            }
        } else {
            $scope.CurrentObject.leftExtend = 0;
            $scope.CurrentObject.rightExtend = 0;
        }
    };
    $scope.save = function() {
        // 重组laneInfo
        var lanes = [],
            tmp, str;
        for (var k in $scope.CurrentObject.lanes) {
            tmp = $scope.CurrentObject.lanes[k];
            if (tmp.busDir) {
                if (tmp.busDir.flag == tmp.dir.flag) {
                    str = '<' + tmp.dir.flag + '>';
                } else {
                    str = tmp.dir.flag + '<' + tmp.busDir.flag + '>';
                }
            } else {
                str = tmp.dir.flag;
            }
            if (tmp.adt == 1) {
                str = '[' + str + ']';
            }
            lanes.push(str);
        }
        $scope.CurrentObject.laneInfo = lanes.join(",");
        // 删除三个用于与二级页面交互的控制属性
        // delete $scope.CurrentObject.lanes;
        // delete $scope.CurrentObject.selectedLaneIndex;
        // delete $scope.CurrentObject.changeLaneDirectFlag;
        objCtrl.save();
        console.log(objCtrl.changedProperty);
        if (!objCtrl.changedProperty) {
            swal("操作成功", '属性值没有变化！', "success");
            return;
        }
        var arr = [];
        if (objCtrl.changedProperty.topos && objCtrl.changedProperty.topos.length > 0) {
            for (var i = 0; i < objCtrl.changedProperty.topos.length; i++) {
                if (objCtrl.changedProperty.topos[i].objStatus == "INSERT") {
                    for (var j = 0; j < objCtrl.changedProperty.topos[i].vias.length; j++) {
                        objCtrl.changedProperty.topos[i].vias[j].objStatus = "INSERT";
                        delete objCtrl.changedProperty.topos[i].vias[j].geoLiveType;
                    }
                } else if (objCtrl.changedProperty.topos[i].objStatus == "UPDATE") {
                    //判断闭合
                    // if(objCtrl.changedProperty.topos[i].vias && objCtrl.changedProperty.topos[i].vias.length > 0){
                    //     var toop = objCtrl.changedProperty.topos[i];
                    //     var lastVia = toop.vias[toop.vias.length -1]; //获取vias数组中的最后一个值
                    //     var temp ={'outLinkPid':toop.outLinkPid,'linkpid':lastVia.linkPid};
                    //     arr.push(temp);
                    // }
                }
            }
        }
        var promises = [];
        var flagArr = [];
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                flagArr[i] = false;
                promises.push(dsEdit.getByPid(arr[i].linkPid, "RDLINK"), function(data) {
                    if (data) {
                        if (data.eNodePid == arr[i].outLinkPid || data.sNodePid == arr[i].outLinkPid) {
                            flagArr[i] = true;
                        }
                    }
                });
            }
            $q.all(promises).then(function() {
                if (flagArr.indexOf(false) > -1) {
                    swal('提示', '经过线没有闭合！', 'warning');
                    return;
                }
                $scope.saveFinal();
            });
        } else {
            $scope.saveFinal();
        }
        $scope.$emit('SWITCHCONTAINERSTATE', {
            'subAttrContainerTpl': false
        });
    };
    $scope.saveFinal = function() {
        var param = {
            "command": "UPDATE",
            "type": "RDLANECONNEXITY",
            "dbId": App.Temp.dbId,
            "data": objCtrl.changedProperty
        };
        dsEdit.save(param).then(function(data) {
            if (data) {
                dsEdit.getByPid(objCtrl.data.pid, "RDLANECONNEXITY").then(function(ret) {
                    if (ret) {
                        objCtrl.setCurrentObject('RDLANECONNEXITY', ret);
                        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                    }
                });
            }
            map.currentTool.disable();
            if (tooltipsCtrl.getCurrentTooltip()) {
                tooltipsCtrl.onRemoveTooltip();
            }
            rdConnexity.redraw();
        })
    };
    $scope.delete = function() {
        var objId = parseInt($scope.CurrentObject.pid);
        var param = {
            "command": "DELETE",
            "type": "RDLANECONNEXITY",
            "dbId": App.Temp.dbId,
            "objId": objId
        };
        dsEdit.save(param).then(function(data) {
            if (data) {
                // 高亮必须放在redraw之前，因为redraw后，tile重新加载会触发高亮操作
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                if (map.currentTool) {
                    map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
                }
                rdConnexity.redraw();
                //清空编辑图层和shapeCtrl
                shapeCtrl.stopEditing();
                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                $scope.$emit('SWITCHCONTAINERSTATE', {
                    'subAttrContainerTpl': false,
                    'attrContainerTpl': false
                });
            }
        })
    };
    $scope.cancel = function() {};
    $scope.showMe = function() {
        $scope.$emit('SWITCHCONTAINERSTATE', {
            'subAttrContainerTpl': false
        });
        if (map.currentTool) {
            map.currentTool.disable();
        }
        doHighlight();
    };
    $scope.initialize();
    // $document.unbind("keydown");
    $document.bind("keydown", function(event) {
        if ($scope.CurrentObject.selectedLaneIndex == undefined) {
            return;
        }
        if (event.keyCode == 16) { //shift键 公交车道
            toggleBusLane($scope.CurrentObject.lanes[$scope.CurrentObject.selectedLaneIndex], $scope.CurrentObject.selectedLaneIndex);
            $scope.$apply();
        } else if (event.keyCode === 17) { //ctrl键 附加车道
            toggleAdtLane($scope.CurrentObject.lanes[$scope.CurrentObject.selectedLaneIndex]);
            $scope.$apply();
        }
    });
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initialize);
}]);