/**
 * Created by zhaohang on 2016/5/6.
 */
var rdRestrictionApp = angular.module("mapApp");
rdRestrictionApp.controller("addRdRestrictionController", ["$scope", '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var hLayer = layerCtrl.getLayerById("highlightlayer");
    $scope.inLaneInfoArr = [];
    $scope.directData = objCtrl.originalData;
    $scope.limitRelation = {};
    $scope.clickFlag = true;
    $scope.excitLineArr = [];
    $scope.highRender = new fastmap.uikit.HighLightRender(hLayer);
    $scope.highFeatures = [];
    var changedDirectObj = {
        "loadType": "subAttrTplContainer",
        "propertyCtrl": 'components/road/ctrls/toolBar_cru_ctrl/addRestrictionCtrl/directOfRestrictionCtrl',
        "propertyHtml": '../../scripts/components/road/tpls/toolBar_cru_tpl/addRestrictionTepl/directOfRestrictionTpl.html'
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

    shapeCtrl.setEditingType(fastmap.dataApi.GeoLiveModelType.RDRESTRICTION);
    tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDRESTRICTION);
    tooltipsCtrl.setCurrentTooltip('正要新建交限,先选择线！');
    map.currentTool = new fastmap.uikit.SelectForRestriction({
        map: map,
        createRestrictFlag: true,
        currentEditLayer: rdLink
    });
    map.currentTool.enable();
    $scope.excitLineArr = [];
    eventController.on(eventController.eventTypes.GETLINKID, function (data) {
        if (data.index === 0) {
            $scope.limitRelation.inLinkPid = parseInt(data.id);
            $scope.highFeatures.push({
                id:  $scope.limitRelation.inLinkPid.toString(),
                layerid: 'referenceLine',
                type: 'line',
                style: {}
            });
            $scope.highRender.highLightFeatures = $scope.highFeatures;
            $scope.highRender.drawHighlight();
            tooltipsCtrl.setStyleTooltip("color:black;");
            tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择进入点!");
        } else if (data.index === 1) {
            $scope.limitRelation.nodePid = parseInt(data.id);
            $scope.highFeatures.push({
                id:  $scope.limitRelation.nodePid.toString(),
                layerid: 'referenceLine',
                type: 'rdnode',
                style: {}
            });
            $scope.highRender.drawHighlight();
            tooltipsCtrl.setStyleTooltip("color:red;");
            tooltipsCtrl.setChangeInnerHtml("已经选择进入点,选择退出线!");
        } else if (data.index > 1) {
            $scope.excitLineArr.push(parseInt(data.id));
            $scope.highFeatures.push({
                id:  data.id.toString(),
                layerid: 'referenceLine',
                type: 'line',
                style: {}
            });
            $scope.highRender.drawHighlight();
            $scope.limitRelation.outLinkPids = $scope.excitLineArr;
            tooltipsCtrl.setChangeInnerHtml("已选退出线,点击空格键保存!");
        }
        $scope.directData["limitRelation"] = $scope.limitRelation
    })

}])