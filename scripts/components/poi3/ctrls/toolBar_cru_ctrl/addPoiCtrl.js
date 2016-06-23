/**
 * Created by zhaohang on 2016/4/12.
 */

var addPoiApp = angular.module('app');
addPoiApp.controller("addPoiController", ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {

    var layerCtrl = fastmap.uikit.LayerController();
    var editLayer = layerCtrl.getLayerById('edit');
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var selectCtrl = fastmap.uikit.SelectController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    /**
     * 两点之间的距离
     * @param pointA
     * @param pointB
     * @returns {number}
     */
    $scope.distance = function (pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    };
    /**
     * 两点之间的夹角
     * @param pointA
     * @param pointB
     * @returns {*}
     */
    $scope.includeAngle = function (pointA, pointB) {
        var angle, dValue = pointA.x - pointB.x,
            PI = Math.PI;

        if (dValue === 0) {
            angle = PI / 2;
        } else {
            angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
        }
        return angle;
    };
    $scope.addPoi = function (type, num, event) {
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }
        if (event) {
            event.stopPropagation();
        }
        //清空上一步的操作时的高亮
        highRenderCtrl._cleanHighLight();
        if (highRenderCtrl.highLightFeatures != undefined) {
            highRenderCtrl.highLightFeatures.length = 0;
        }
        //收回上一步中打开的属性栏和tips框
        $scope.$emit("SWITCHCONTAINERSTATE",
            {"attrContainerTpl": false, "subAttrContainerTpl": false})
        $("#popoverTips").hide();

        //清空编辑图层
        editLayer.clear();
        editLayer.bringToBack();
        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);

        if (tooltipsCtrl.getCurrentTooltip()) {
            tooltipsCtrl.onRemoveTooltip();
        }
        if (map.currentTool && typeof map.currentTool.cleanHeight === "function") {
            map.currentTool.cleanHeight();
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
        }
        $scope.changeBtnClass(num);
         if (type === "poi") {
            if (shapeCtrl.shapeEditorResult) {
                var feature={};
                feature.components = [];
                feature.points = [];
                feature.components.push(fastmap.mapApi.point(0, 0));
                feature.components.push(fastmap.mapApi.point(0, 0));
                feature.points.push(fastmap.mapApi.point(0, 0));
                feature.points.push(fastmap.mapApi.point(0, 0));
                feature.type = "Poi";

                shapeCtrl.shapeEditorResult.setFinalGeometry(feature);
                selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                layerCtrl.pushLayerFront('edit');
            }

            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POIADD);
            shapeCtrl.startEditing();
            map.currentTool = shapeCtrl.getCurrentTool();
            map.currentTool.enable();
            shapeCtrl.editFeatType = "rdLink";
            map.currentTool.captureHandler.addGuideLayer(rdLink);
            tooltipsCtrl.setEditEventType('poiAdd');
            tooltipsCtrl.setCurrentTooltip('点击空格保存,或者按ESC键取消!');
        }
    }
}
])