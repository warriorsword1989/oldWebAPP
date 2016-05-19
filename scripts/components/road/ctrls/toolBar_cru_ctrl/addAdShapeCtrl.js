/**
 * Created by zhaohang on 2016/4/12.
 */

var addAdShapeApp = angular.module('mapApp');
addAdShapeApp.controller("addAdShapeController", ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {

            var layerCtrl = fastmap.uikit.LayerController();
            var editLayer = layerCtrl.getLayerById('edit');
            var shapeCtrl = fastmap.uikit.ShapeEditorController();
            var selectCtrl = fastmap.uikit.SelectController();
            var tooltipsCtrl = fastmap.uikit.ToolTipsController();
            var adLink = layerCtrl.getLayerById('adLink');
            var adNode = layerCtrl.getLayerById('adnode');
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
                if(highRenderCtrl.highLightFeatures!=undefined) {
                    highRenderCtrl.highLightFeatures.length = 0;
                }
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
                    shapeCtrl.getCurrentTool().clickcount =1;
                    map.currentTool.snapHandler.addGuideLayer(adLink);
                    map.currentTool.snapHandler.addGuideLayer(adNode);
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
                else if (type === "adFaceLine") {
                    layerCtrl.pushLayerFront('edit');
                    map.currentTool = new fastmap.uikit.SelectPath(
                        {
                            map: map,
                            currentEditLayer: adLink,
                            linksFlag: true,
                            shapeEditor: shapeCtrl
                        });
                    map.currentTool.snapHandler.addGuideLayer(adLink);
                    map.currentTool.enable();
                    shapeCtrl.editType = "addAdFaceLine";
                    //初始化鼠标提示
                    $scope.toolTipText = '请选择线！';
                    adLink.options.editable = true;
                    var selectCount = 0,linksArr=[],sNode,eNode;
                    eventController.on(eventController.eventTypes.GETLINKID, function(data){
                        if(selectCount===0) {
                            highRenderCtrl.highLightFeatures.push({
                                id:data["id"].toString(),
                                layerid:'adLink',
                                type:'line',
                                style:{}
                            });
                            highRenderCtrl.drawHighlight();
                            linksArr.push(data["id"]);
                            sNode = data["properties"]["snode"];
                            eNode=data["properties"]["enode"];
                            selectCount++;
                        } else  if(selectCount===1) {
                            highRenderCtrl._cleanHighLight();
                           if(sNode===data["properties"]["snode"]) {
                               $scope.startNode = eNode;
                               $scope.endNode = data["properties"]["enode"];
                               selectCount++;
                               linksArr.push(data["id"]);
                               highRenderCtrl.highLightFeatures.push({
                                   id:data["id"].toString(),
                                   layerid:'adLink',
                                   type:'line',
                                   style:{}
                               });
                               highRenderCtrl.drawHighlight();
                           }else if(sNode===data["properties"]["enode"]){
                               $scope.startNode = eNode;
                               $scope.endNode = data["properties"]["snode"];
                               selectCount++;
                               linksArr.push(data["id"]);
                               highRenderCtrl.highLightFeatures.push({
                                   id:data["id"].toString(),
                                   layerid:'adLink',
                                   type:'line',
                                   style:{}
                               });
                               highRenderCtrl.drawHighlight();
                           }else if(eNode===data["properties"]["snode"]) {
                               $scope.startNode = sNode;
                               $scope.endNode = data["properties"]["enode"];
                               selectCount++;
                               linksArr.push(data["id"]);
                               highRenderCtrl.highLightFeatures.push({
                                   id:data["id"].toString(),
                                   layerid:'adLink',
                                   type:'line',
                                   style:{}
                               });
                               highRenderCtrl.drawHighlight();
                           }else if(eNode===data["properties"]["enode"]) {
                               $scope.startNode = sNode;
                               $scope.endNode = data["properties"]["snode"];
                               selectCount++;
                               linksArr.push(data["id"]);
                               highRenderCtrl.highLightFeatures.push({
                                   id:data["id"].toString(),
                                   layerid:'adLink',
                                   type:'line',
                                   style:{}
                               });
                               highRenderCtrl.drawHighlight();
                           }
                       } else if(selectCount>1) {
                            highRenderCtrl._cleanHighLight();
                           if( $scope.endNode===data["properties"]["snode"]) {
                               $scope.endNode = data["properties"]["enode"];
                               highRenderCtrl.highLightFeatures.push({
                                   id:data["id"].toString(),
                                   layerid:'adLink',
                                   type:'line',
                                   style:{}
                               });
                               highRenderCtrl.drawHighlight();
                               selectCount++;
                               linksArr.push(data["id"]);
                           }else if($scope.endNode===data["properties"]["enode"]){
                               $scope.endNode = data["properties"]["snode"];
                               highRenderCtrl.highLightFeatures.push({
                                   id:data["id"].toString(),
                                   layerid:'adLink',
                                   type:'line',
                                   style:{}
                               });
                               highRenderCtrl.drawHighlight();
                               selectCount++;
                               linksArr.push(data["id"]);
                           }
                       }
                        if(selectCount>2&&($scope.endNode===$scope.startNode)) {
                            selectCtrl.onSelected(
                                {
                                    'adLinks':linksArr
                                }
                            )
                        }
                    });
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