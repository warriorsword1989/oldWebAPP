/**
 * Created by zhaohang on 2016/4/12.
 */

var addAdShapeApp = angular.module('mapApp', ['oc.lazyLoad']);
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

                if (event) {
                    event.stopPropagation();
                }
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
                $("#popoverTips").hide();
                editLayer.clear();
                editLayer.bringToBack();
                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                rdLink.clearAllEventListeners()
                if (tooltipsCtrl.getCurrentTooltip()) {
                    tooltipsCtrl.onRemoveTooltip();
                }
                map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                $scope.changeBtnClass(num);
                if (type === "adLink") {
                    if (shapeCtrl.shapeEditorResult) {
                        shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                        selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                        layerCtrl.pushLayerFront('edit');
                    }
                    shapeCtrl.setEditingType('drawAdLink');
                    shapeCtrl.startEditing();
                    map.currentTool = shapeCtrl.getCurrentTool();
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
               else if (type === "node") {
                    if (shapeCtrl.shapeEditorResult) {
                        shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.point([fastmap.mapApi.point(0, 0)]));
                        selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                        layerCtrl.pushLayerFront('edit');
                    }
                    shapeCtrl.setEditingType('pointVertexAdd');
                    shapeCtrl.startEditing();
                    map.currentTool = shapeCtrl.getCurrentTool();
                    tooltipsCtrl.setEditEventType('pointVertexAdd');
                    tooltipsCtrl.setCurrentTooltip('开始增加节点！');
                    tooltipsCtrl.setStyleTooltip("color:black;");
                    tooltipsCtrl.setChangeInnerHtml("点击增加节点!");
                    tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存,或者按ESC键取消!");
                }
            }


}
])