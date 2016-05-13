/**
 * Created by zhaohang on 2016/4/12.
 */

var addAdShapeApp = angular.module('mapApp');
addAdShapeApp.controller("addAdShapeController", ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {

            var layerCtrl = fastmap.uikit.LayerController();
            var featCodeCtrl = fastmap.uikit.FeatCodeController();
            var editLayer = layerCtrl.getLayerById('edit');
            var shapeCtrl = fastmap.uikit.ShapeEditorController();
            var selectCtrl = fastmap.uikit.SelectController();
            var tooltipsCtrl = fastmap.uikit.ToolTipsController();
            var adLink = layerCtrl.getLayerById('adLink');
            var rdLink = layerCtrl.getLayerById('referenceLine');
            var hLayer = layerCtrl.getLayerById('highlightlayer');
            var objCtrl = fastmap.uikit.ObjectEditController();
            var eventController = fastmap.uikit.EventController();
            var adAdmin=layerCtrl.getLayerById('adAdmin');
            var highRenderCtrl = fastmap.uikit.HighRenderController();
            $scope.limitRelation = {};
            //两点之间的距离
            $scope.distance = function (pointA, pointB) {
                var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
                return Math.sqrt(len);
            };
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
            $scope.addShape = function (type, num, event) {
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                if (event) {
                    event.stopPropagation();
                }
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
                $("#popoverTips").hide();
                editLayer.clear();
                editLayer.bringToBack();
                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                adLink.clearAllEventListeners()
                if (tooltipsCtrl.getCurrentTooltip()) {
                    tooltipsCtrl.onRemoveTooltip();
                }
                if (map.currentTool&&typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                    map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                }
                map.currentTool.disable();
                $scope.changeBtnClass(num);
                if (type === "adLink") {
                    if (shapeCtrl.shapeEditorResult) {
                        shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                        selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                        layerCtrl.pushLayerFront('edit');
                    }
                    shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.DRAWPATH);
                    shapeCtrl.startEditing();
                    map.currentTool = shapeCtrl.getCurrentTool();
                    shapeCtrl.editFeatType = "adLink";
                    map.currentTool.snapHandler.addGuideLayer(adLink);
                    tooltipsCtrl.setEditEventType('drawAdLink');
                    tooltipsCtrl.setCurrentTooltip('开始画线！');
                    tooltipsCtrl.setStyleTooltip("color:black;");
                    tooltipsCtrl.setChangeInnerHtml("点击最后一个点结束画线!");
                    tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
                }

                else if (type === "adFace") {
                    if (shapeCtrl.shapeEditorResult) {
                        shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.polygon([fastmap.mapApi.point(0, 0)]));
                        selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                        layerCtrl.pushLayerFront('edit');
                    }
                    shapeCtrl.setEditingType('drawPolygon');
                    shapeCtrl.startEditing();
                    map.currentTool = shapeCtrl.getCurrentTool();
                    tooltipsCtrl.setEditEventType('drawPolygon');
                    tooltipsCtrl.setCurrentTooltip('开始画面！');
                    tooltipsCtrl.setStyleTooltip("color:black;");
                    tooltipsCtrl.setChangeInnerHtml("点击最后一个点结束!");
                    tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
                }
               else if (type === "adNode") {
                    if (shapeCtrl.shapeEditorResult) {
                        shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                        selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                        layerCtrl.pushLayerFront('edit');
                    }

                    shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
                    shapeCtrl.startEditing();
                    map.currentTool = shapeCtrl.getCurrentTool();
                    map.currentTool.enable();
                    shapeCtrl.editFeatType = "adLink";
                    map.currentTool.snapHandler.addGuideLayer(adLink);
                    tooltipsCtrl.setEditEventType('pointVertexAdd');
                    tooltipsCtrl.setCurrentTooltip('开始增加节点！');
                    tooltipsCtrl.setStyleTooltip("color:black;");
                    tooltipsCtrl.setChangeInnerHtml("点击增加节点!");
                    tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存,或者按ESC键取消!");
                }else if (type === "adAdmin") {
                    if (shapeCtrl.shapeEditorResult) {
                        shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.point(0, 0));
                        selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                        layerCtrl.pushLayerFront('edit');
                    }
                    shapeCtrl.setEditingType('addAdAdmin');
                    shapeCtrl.startEditing();
                    map.currentTool = shapeCtrl.getCurrentTool();
                    tooltipsCtrl.setEditEventType('pointVertexAdd');
                    tooltipsCtrl.setCurrentTooltip('开始增加行政区划代表点！');
                    tooltipsCtrl.setChangeInnerHtml("点击空格保存,或者按ESC键取消!");
                }
            }


}
])