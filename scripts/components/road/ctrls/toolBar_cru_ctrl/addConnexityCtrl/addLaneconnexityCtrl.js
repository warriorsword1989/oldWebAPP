/**
 * Created by liwanchong on 2016/1/25.
 */
var laneConnexityApp = angular.module('app');
laneConnexityApp.controller('addLaneConnexityController', ['$scope', '$ocLazyLoad', 'appPath', function ($scope, $ocLazyLoad, appPath) {
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    $scope.CurrentObject = objCtrl.originalData;
    var changedDirectObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
        loadType: 'subAttrTplContainer',
        propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
        propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
        callback: function () {
            var laneObj = {
                loadType: 'subAttrTplContainer',
                propertyCtrl: appPath.road + 'ctrls/toolBar_cru_ctrl/addConnexityCtrl/directOfConnexityCtrl',
                propertyHtml: appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addConnexityTepl/directOfConnexityTpl.html'
            };
            $scope.$emit('transitCtrlAndTpl', laneObj);
        }
    };
    $scope.$emit('transitCtrlAndTpl', changedDirectObj);
    $scope.toBusLane = function (item) {
        item.busDir = {
            flag: item.dir.flag,
            log: item.dir.log
        };
        item.laneInfo = item.dir.flag + '<' + item.busDir.flag + '>';
        if (item.adt == 1) {
            item.laneInfo = '[' + item.laneInfo + ']';
        }
    };
    $scope.deleteLane = function (item, index) {
        $scope.CurrentObject.lanes.splice(index, 1);
    };
    $scope.deleteBusLane = function (item) {
        item.busDir = null;
        item.laneInfo = item.dir.flag;
        if (item.adt == 1) {
            item.laneInfo = '[' + item.laneInfo + ']';
        }
    };
    var doHighlight = function () {
        // 清除高亮
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
        // 进入线
        if ($scope.CurrentObject.inLinkPid) {
            highRenderCtrl.highLightFeatures.push({
                id: $scope.CurrentObject.inLinkPid.toString(),
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
        if ($scope.CurrentObject.nodePid) {
            highRenderCtrl.highLightFeatures.push({
                id: $scope.CurrentObject.nodePid.toString(),
                layerid: 'rdNode',
                type: 'node',
                style: {}
            });
        }
        highRenderCtrl.drawHighlight();
    };
    if (map.currentTool && typeof map.currentTool.cleanHeight === 'function') {
        map.currentTool.cleanHeight();
        map.currentTool.disable();
    }
    shapeCtrl.setEditingType('addRdLaneConnexity');
    tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDLANECONNEXITY);
    tooltipsCtrl.setCurrentTooltip('开始新建车信, 请选择进入线！');
    var tooltipWatcher;
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
    eventController.on(eventController.eventTypes.GETLINKID, function (data) {
        var pid = parseInt(data.id);
        // 进入线、退出线不能是9级以上路
        if (parseInt(data.properties.kind) >= 9) {
            map.currentTool.selectedFeatures.pop();
            tooltipsCtrl.notify('进入线/退出线不能是9级以上道路，请重新选择!', 'error');
            return;
        }
        if (data.index === 0) {
            var direct = parseInt(data.properties.direct);
            $scope.CurrentObject.inLinkPid = pid;
            if (direct == 1) {
                tooltipsCtrl.setCurrentTooltip('已经选择进入线, 请选择进入点!');
            } else {
                if (direct == 2) {
                    $scope.CurrentObject.nodePid = parseInt(data.properties.enode);
                } else if (direct == 3) {
                    $scope.CurrentObject.nodePid = parseInt(data.properties.snode);
                }
                tooltipsCtrl.setCurrentTooltip('已经选择进入点, 请选择退出线!');
                map.currentTool.selectedFeatures.push($scope.CurrentObject.nodePid);
            }
        } else if (data.index === 1) {
            $scope.CurrentObject.nodePid = parseInt(data.id);
            tooltipsCtrl.setCurrentTooltip('已经选择进入点, 请选择退出线!');
            // map.currentTool.selectedFeatures.push($scope.CurrentObject.nodePid);
        } else if (data.index > 1) {
            // 退出线不能与进入线相同
            if (pid == $scope.CurrentObject.inLinkPid) {
                map.currentTool.selectedFeatures.pop();
                tooltipsCtrl.notify('退出线不能与进入线是同一条线，请重新选择!', 'error');
                return;
            }
            if ($scope.CurrentObject.outLinkPids.indexOf(pid) >= 0) {
                $scope.CurrentObject.outLinkPids.splice($scope.CurrentObject.outLinkPids.indexOf(pid), 1);
            } else {
                $scope.CurrentObject.outLinkPids.push(pid);
            }
            if ($scope.CurrentObject.outLinkPids.length == 0) {
                tooltipsCtrl.setCurrentTooltip('已经选择进入点, 请选择退出线!');
            } else {
                // if ($scope.CurrentObject.lanes.length > 0) {
                //     tooltipsCtrl.setCurrentTooltip("已选择" + $scope.CurrentObject.outLinkPids.length + "条退出线, 可以继续选择或者按空格键进行保存!", 'succ');
                // } else {
                //     tooltipsCtrl.setCurrentTooltip("已选择" + $scope.CurrentObject.outLinkPids.length + "条退出线, 可以继续选择或者在右侧面板中选择车道方向!", 'info');
                // }
                tooltipWatcher = $scope.$watch('CurrentObject.lanes.length', function (newVal, oldVal) {
                    if (newVal == 0) {
                        tooltipsCtrl.setCurrentTooltip('已选择' + $scope.CurrentObject.outLinkPids.length + '条退出线, 可以继续选择或者在右侧面板中选择车道方向!', 'info');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('已选择' + $scope.CurrentObject.outLinkPids.length + '条退出线, 可以继续选择或者按空格键进行保存!', 'succ');
                    }
                });
            }
        }
        doHighlight();
    });
    var clearMapTool = function () {
        eventController.off(eventController.eventTypes.GETLINKID);
        if (map.currentTool) {
            map.currentTool.disable();
        }
        if (tooltipsCtrl.enabled()) {
            tooltipsCtrl.disable();
        }
        if (tooltipWatcher) {
            tooltipWatcher();
        }
    };
    // 二级面板关闭时，自动清理地图操作工具（只绑定一次watch）
    var unwatch = $scope.$watch('suspendPanelOpened', function (newVal, oldVal) {
        if (newVal == false) {
            clearMapTool();
            unwatch();
        }
    });
}]);
