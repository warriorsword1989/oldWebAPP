/**
 * Created by liwanchong on 2016/1/25.
 */
var laneConnexityApp = angular.module("app");
laneConnexityApp.controller("addLaneConnexityController", ["$scope", '$ocLazyLoad', 'appPath', function($scope, $ocLazyLoad, appPath) {
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    $scope.CurrentObject = objCtrl.originalData;
    var changedDirectObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
        "loadType": "subAttrTplContainer",
        "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
        "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
        "callback": function() {
            var laneObj = {
                "loadType": "subAttrTplContainer",
                "propertyCtrl": appPath.road + 'ctrls/toolBar_cru_ctrl/addConnexityCtrl/directOfConnexityCtrl',
                "propertyHtml": appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addConnexityTepl/directOfConnexityTpl.html'
            };
            $scope.$emit("transitCtrlAndTpl", laneObj);
        }
    };
    $scope.$emit("transitCtrlAndTpl", changedDirectObj);
    $scope.toBusLane = function(item) {
        item.busDir = {
            flag: item.dir.flag,
            log: item.dir.log
        };;
        item.laneInfo = item.dir.flag + '<' + item.busDir.flag + '>';
        if (item.adt == 1) {
            item.laneInfo = '[' + item.laneInfo + ']';
        }
    };
    $scope.deleteLane = function(item, index) {
        $scope.CurrentObject.lanes.splice(index, 1);
    };
    $scope.deleteBusLane = function(item) {
        item.busDir = null;
        item.laneInfo = item.dir.flag;
        if (item.adt == 1) {
            item.laneInfo = '[' + item.laneInfo + ']';
        }
    }
    var doHighlight = function() {
        //清除高亮
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
        // 进入线
        if ($scope.CurrentObject["inLinkPid"]) {
            highRenderCtrl.highLightFeatures.push({
                id: $scope.CurrentObject["inLinkPid"].toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {
                    color: 'red'
                }
            });
        }
        // 退出线
        for (var i = 0; i < $scope.CurrentObject.outLinkPids.length; i++) {
            highRenderCtrl.highLightFeatures.push({
                id: $scope.CurrentObject.outLinkPids[i].toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {
                    color: '#008000'
                }
            });
        }
        // 进入点
        if ($scope.CurrentObject["nodePid"]) {
            highRenderCtrl.highLightFeatures.push({
                id: $scope.CurrentObject["nodePid"].toString(),
                layerid: 'rdNode',
                type: 'node',
                style: {}
            });
        }
        highRenderCtrl.drawHighlight();
    };
    if (map.currentTool && typeof map.currentTool.cleanHeight === "function") {
        map.currentTool.cleanHeight();
        map.currentTool.disable();
    }
    shapeCtrl.setEditingType("addRdLaneConnexity");
    tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDLANECONNEXITY);
    tooltipsCtrl.setCurrentTooltip('开始新建车信, 请选择进入线！');
    map.currentTool = new fastmap.uikit.SelectForRestriction({
        map: map,
        createLaneFlag: true,
        currentEditLayer: rdLink,
        shapeEditor: shapeCtrl,
        operationList: ['line', 'point', 'line']
    });
    map.currentTool.enable();
    $scope.excitLineArr = [];
    eventController.off(eventController.eventTypes.GETLINKID);
    eventController.on(eventController.eventTypes.GETLINKID, function(data) {
        if (data.index === 0) {
            if (parseInt(data.properties.direct) == 1) {
                $scope.CurrentObject.inLinkPid = parseInt(data.id);
                tooltipsCtrl.setCurrentTooltip("已经选择进入线, 请选择进入点!");
            } else if (parseInt(data.properties.direct) == 2 || parseInt(data.properties.direct) == 3) {
                $scope.CurrentObject.inLinkPid = parseInt(data.id);
                if (parseInt(data.properties.direct) == 2) {
                    $scope.CurrentObject.nodePid = parseInt(data.properties.enode);
                } else if (parseInt(data.properties.direct) == 3) {
                    $scope.CurrentObject.nodePid = parseInt(data.properties.snode);
                }
                tooltipsCtrl.setCurrentTooltip("已经选择进入点, 请选择退出线!");
                map.currentTool.selectedFeatures.push($scope.CurrentObject.nodePid);
            }
        } else if (data.index === 1) {
            $scope.CurrentObject.nodePid = parseInt(data.id);
            tooltipsCtrl.setCurrentTooltip("已经选择进入点, 请选择退出线!");
            map.currentTool.selectedFeatures.push($scope.CurrentObject.nodePid);
        } else if (data.index > 1) {
            var pid = parseInt(data.id);
            // 退出线不能是9级路
            // 退出线不能与进入线相同
            if (parseInt(data.properties.kind) == 9 || pid == $scope.CurrentObject.inLinkPid) {
                return;
            }
            if ($scope.CurrentObject.outLinkPids.indexOf(pid) >= 0) {
                $scope.CurrentObject.outLinkPids.splice($scope.CurrentObject.outLinkPids.indexOf(pid), 1);
            } else {
                $scope.CurrentObject.outLinkPids.push(pid);
            }
            if ($scope.CurrentObject.outLinkPids.length == 0) {
                tooltipsCtrl.setCurrentTooltip("已经选择进入点, 请选择退出线!");
            } else {
                tooltipsCtrl.setCurrentTooltip("已选退出线, 请在右侧面板中选择车道方向或者继续选择退出线或者按空格键保存!");
            }
        }
        doHighlight();
    });
}])