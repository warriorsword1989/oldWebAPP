/**
 * Created by mali on 2016/6/29.
 */
angular.module('app').controller("addZoneShapeController", ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {

    var layerCtrl = fastmap.uikit.LayerController();
    var editLayer = layerCtrl.getLayerById('edit');
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var selectCtrl = fastmap.uikit.SelectController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var zoneLink = layerCtrl.getLayerById('zoneLink');
    var zoneNode = layerCtrl.getLayerById('zoneNode');
    var zoneFace = layerCtrl.getLayerById('zoneFace');
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    $scope.limitRelation = {};
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
    $scope.addZoneShape = function (type, num, event) {
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

        zoneLink.clearAllEventListeners()
        if (tooltipsCtrl.getCurrentTooltip()) {
            tooltipsCtrl.onRemoveTooltip();
        }
        if (map.currentTool && typeof map.currentTool.cleanHeight === "function") {
            map.currentTool.cleanHeight();
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
        }
        $scope.changeBtnClass(num);
        if (type === "zoneLink") {
            if (shapeCtrl.shapeEditorResult) {
                //初始化编辑工具
                shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                layerCtrl.pushLayerFront('edit');
            }
            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.DRAWPATH);
            shapeCtrl.startEditing();
            map.currentTool = shapeCtrl.getCurrentTool();
            shapeCtrl.editFeatType = "zoneLink";
            //重置捕捉工具中的值
            shapeCtrl.getCurrentTool().clickcount = 1;
            shapeCtrl.getCurrentTool().catches.length = 0;
            shapeCtrl.getCurrentTool().snodePid = 0;
            shapeCtrl.getCurrentTool().enodePid = 0;

            //把点和线图层加到捕捉工具中，先加的优先捕捉
            map.currentTool.snapHandler.addGuideLayer(zoneNode);
            map.currentTool.snapHandler.addGuideLayer(zoneLink);
            //提示信息
            tooltipsCtrl.setEditEventType('drawZoneLink');
            tooltipsCtrl.setCurrentTooltip('开始画线！');
            tooltipsCtrl.setStyleTooltip("color:black;");
            tooltipsCtrl.setChangeInnerHtml("点击最后一个点结束画线!");
            tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
        }
        else if (type === "zoneFace") {
            if (shapeCtrl.shapeEditorResult) {
                shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.polygon([fastmap.mapApi.point(0, 0)]));
                selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                layerCtrl.pushLayerFront('edit');
            }
            //设置添加类型
            shapeCtrl.setEditingType('drawPolygon');
            shapeCtrl.startEditing();

            //把工具添加到map中
            map.currentTool = shapeCtrl.getCurrentTool();

            //提示信息
            tooltipsCtrl.setEditEventType('drawPolygon');
            tooltipsCtrl.setCurrentTooltip('开始画面！');
            tooltipsCtrl.setStyleTooltip("color:black;");
            tooltipsCtrl.setChangeInnerHtml("点击最后一个点结束!");
            tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
        }
        else if (type === "zoneNode") {
            if (shapeCtrl.shapeEditorResult) {
                shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                layerCtrl.pushLayerFront('edit');
            }

            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
            shapeCtrl.startEditing();
            map.currentTool = shapeCtrl.getCurrentTool();
            map.currentTool.enable();
            shapeCtrl.editFeatType = "zoneLink";
            map.currentTool.snapHandler.addGuideLayer(zoneLink);
            tooltipsCtrl.setEditEventType('pointVertexAdd');
            tooltipsCtrl.setCurrentTooltip('开始增加节点！');
            tooltipsCtrl.setStyleTooltip("color:black;");
            tooltipsCtrl.setChangeInnerHtml("点击增加节点!");
            tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存,或者按ESC键取消!");
        }
    }
}
])