/**
 * Created by zhaohang on 2016/5/6.
 */
var rdRestrictionApp = angular.module("app");
rdRestrictionApp.controller("addRdRestrictionController", ["$scope", '$ocLazyLoad','appPath', function ($scope, $ocLazyLoad, appPath) {
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.inLaneInfoArr = [];
    $scope.directData = objCtrl.originalData;
    $scope.limitRelation = {};
    $scope.clickFlag = true;
    $scope.excitLineArr = [];
    $scope.highFeatures = [];
    // var changedDirectObj = {
    //     "loadType": "subAttrTplContainer",
    //     "propertyCtrl": appPath.road + 'ctrls/toolBar_cru_ctrl/addRestrictionCtrl/directOfRestrictionCtrl',
    //     "propertyHtml": appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addRestrictionTepl/directOfRestrictionTpl.html'
    // };
    // $scope.$emit("transitCtrlAndTpl", changedDirectObj);

    var changedDirectObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载speedOfConditionCtrl。
        "loadType": "subAttrTplContainer",
        "propertyCtrl": appPath.road  + 'ctrls/blank_ctrl/blankCtrl',
        "propertyHtml": appPath.root + appPath.road + 'tpls/blank_tpl/blankTpl.html',
        "callback": function () {
            var obj = {
                "loadType": "subAttrTplContainer",
                "propertyCtrl": appPath.road  + 'ctrls/toolBar_cru_ctrl/addRestrictionCtrl/directOfRestrictionCtrl',
                "propertyHtml": appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addRestrictionTepl/directOfRestrictionTpl.html'
            };
            $scope.$emit("transitCtrlAndTpl", obj);
        }
    };
    $scope.$emit("transitCtrlAndTpl", changedDirectObj);

    //删除普通车道或附加车道方向有公交车道的时候 一并删除
    $scope.minusNormalData = function (item, index, event) {
        if ($scope.directData.showNormalData.length > 0) {

            $scope.directData.showNormalData.splice(index, 1);
            $scope.directData.showTransitData.splice(index, 1);
            $scope.directData.inLaneInfoArr.splice(index, 1);

        }

    };
    if (map.currentTool && typeof map.currentTool.cleanHeight === "function") {
        map.currentTool.cleanHeight();
        map.currentTool.disable();//禁止当前的参考线图层的事件捕获
    }

    shapeCtrl.setEditingType("addRestriction");
    tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDRESTRICTION);
    tooltipsCtrl.setCurrentTooltip('正要新建交限,先选择线！');
    map.currentTool = new fastmap.uikit.SelectForRestriction({
        map: map,
        createRestrictFlag: true,
        currentEditLayer: rdLink,
        shapeEditor: shapeCtrl,
        operationList:['line','point','line']
    });
    map.currentTool.enable();
    $scope.excitLineArr = [];
    eventController.on(eventController.eventTypes.GETLINKID, function (data) {
        if (data.index === 0) {
            $scope.limitRelation.inLinkPid = parseInt(data.id);
            $scope.highFeatures.push({
                id:  $scope.limitRelation.inLinkPid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {
                    color: '#3A5FCD'
                }
            });
            highRenderCtrl.highLightFeatures = $scope.highFeatures;
            highRenderCtrl.drawHighlight();

            // //清除鼠标十字
            // map.currentTool.snapHandler.snaped = false;
            // map.currentTool.clearCross();
            // map.currentTool.snapHandler._guides = [];
            // map.currentTool.snapHandler.addGuideLayer(rdnode);

            //tooltipsCtrl.setStyleTooltip("color:black;");
            tooltipsCtrl.setCurrentTooltip("已经选择进入线,选择进入点!");
            var linkDirect = data["properties"]["direct"];
            if (linkDirect == 2 || linkDirect == 3) { //单方向
                // map.currentTool.snapHandler.snaped = false;
                // map.currentTool.clearCross();
                // map.currentTool.snapHandler._guides = [];

                $scope.limitRelation.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
                $scope.highFeatures.push({
                    id:  $scope.limitRelation.nodePid.toString(),
                    layerid: 'rdLink',
                    type: 'rdnode',
                    style: {
                        color: 'yellow'
                    }
                });
                highRenderCtrl.drawHighlight();
                map.currentTool.selectedFeatures.push($scope.limitRelation.nodePid.toString());

                //tooltipsCtrl.setStyleTooltip("color:red;");
                tooltipsCtrl.setCurrentTooltip("已经选择进入点,选择退出线!");
            }
        } else if (data.index === 1) {
            $scope.limitRelation.nodePid = parseInt(data.id);
            $scope.highFeatures.push({
                id:  $scope.limitRelation.nodePid.toString(),
                layerid: 'rdLink',
                type: 'rdnode',
                style: {
                    color: 'yellow'
                }
            });
            highRenderCtrl.drawHighlight();
            tooltipsCtrl.setStyleTooltip("color:red;");
            tooltipsCtrl.setCurrentTooltip("已经选择进入点,选择退出线!");
        } else if (data.index > 1) {
            $scope.excitLineArr.push(parseInt(data.id));
            $scope.highFeatures.push({
                id:  data.id.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {
                    color: '#CD0000'
                }
            });
            highRenderCtrl.drawHighlight();
            $scope.limitRelation.outLinkPids = $scope.excitLineArr;
            tooltipsCtrl.setCurrentTooltip("已选退出线,点击空格键保存!");
        }
        $scope.directData["limitRelation"] = $scope.limitRelation
    })

}])