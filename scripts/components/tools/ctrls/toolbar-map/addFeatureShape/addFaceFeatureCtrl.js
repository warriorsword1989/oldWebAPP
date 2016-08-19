/**
 * Created by liuyang on 2016/8/18.
 */
var addFaceShapeApp = angular.module('app');
addFaceShapeApp.controller("addFaceFeatureCtrl", ['$scope', '$ocLazyLoad',
    function($scope, $ocLazyLoad) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var eventController = fastmap.uikit.EventController();
        var highRenderCtrl = fastmap.uikit.HighRenderController();

        var adLink = layerCtrl.getLayerById('adLink');
        var zoneLink = layerCtrl.getLayerById('zoneLink');

        //type 必须是类型的大写,与hotKeyEvent里对应，如："ADFACE"
        $scope.addFace = function(type ,index) {
            $scope.resetToolAndMap();
            $scope.$emit("SWITCHCONTAINERSTATE", {
                "attrContainerTpl": false,
                "subAttrContainerTpl": false
            });
            $("#popoverTips").hide();
            //大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal("提示","地图缩放等级必须大于16级才可操作","info");
                return;
            }
            $scope.resetOperator("addFace", type);
            if(index == 1){//普通的面
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.polygon([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                //设置添加类型
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.DRAWPOLYGON);
                shapeCtrl.startEditing();
                shapeCtrl.editFeatType = type;
                //把工具添加到map中
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.enable();
                map.currentTool.snapHandler._guides = [];
                //提示信息
                tooltipsCtrl.setEditEventType(fastmap.mapApi.ShapeOptionType.DRAWPOLYGON);
                tooltipsCtrl.setCurrentTooltip('开始画面！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击最后一个点结束!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
            } else if(index == 2){//线构面
                layerCtrl.pushLayerFront('edit');
                var snapLayer = null;
                var layerId = "";
                var selectCount = 0,
                    linksArr = [],
                    sNode, eNode;
                if(type === "ADLINKFACE"){
                    snapLayer = adLink;
                    tooltipsCtrl.setCurrentTooltip('请选择行政区划线！');
                    layerId = 'adLink';
                } else if(type === "ZONELINKFACE"){
                    snapLayer = zoneLink;
                    tooltipsCtrl.setCurrentTooltip('请选择zone线！');
                    layerId = 'zoneLink';
                }
                map.currentTool = new fastmap.uikit.SelectPath({
                    map: map,
                    currentEditLayer: snapLayer,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.snapHandler._guides = [];
                map.currentTool.snapHandler.addGuideLayer(snapLayer);
                map.currentTool.enable();
                shapeCtrl.editType = type;
                snapLayer.options.editable = true;

                eventController.on(eventController.eventTypes.GETLINKID, function(data) {
                    //第一次选择一个线
                    if (selectCount === 0) {
                        tooltipsCtrl.setCurrentTooltip('选择了第一条线！');
                        highRenderCtrl.highLightFeatures.push({
                            id: data["id"].toString(),
                            layerid: layerId,
                            type: 'line',
                            style: {}
                        });
                        highRenderCtrl.drawHighlight();
                        linksArr.push(data["id"]);
                        sNode = data["properties"]["snode"];
                        eNode = data["properties"]["enode"];
                        selectCount++;
                    } else if (selectCount === 1) { //第二次选择的线  如果符合就添加到数组中
                        if (sNode === data["properties"]["snode"]) {
                            highRenderCtrl._cleanHighLight(); //清空高亮
                            //提示信息
                            tooltipsCtrl.setStyleTooltip("color:black;");
                            tooltipsCtrl.setChangeInnerHtml("已经选择了第二条线!");
                            //没有和第二根线相连的点作为一个startNode
                            $scope.startNode = eNode;
                            $scope.endNode = data["properties"]["enode"];
                            selectCount++;
                            linksArr.push(data["id"]);
                            highRenderCtrl.highLightFeatures.push({
                                id: data["id"].toString(),
                                layerid: layerId,
                                type: 'line',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();
                        } else if (sNode === data["properties"]["enode"]) {
                            highRenderCtrl._cleanHighLight();
                            tooltipsCtrl.setStyleTooltip("color:black;");
                            tooltipsCtrl.setChangeInnerHtml("已经选择了第二条线!");
                            $scope.startNode = eNode;
                            $scope.endNode = data["properties"]["snode"];
                            selectCount++;
                            linksArr.push(data["id"]);
                            highRenderCtrl.highLightFeatures.push({
                                id: data["id"].toString(),
                                layerid: layerId,
                                type: 'line',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();
                        } else if (eNode === data["properties"]["snode"]) {
                            highRenderCtrl._cleanHighLight();
                            tooltipsCtrl.setStyleTooltip("color:black;");
                            tooltipsCtrl.setChangeInnerHtml("已经选择了第二条线!");
                            $scope.startNode = sNode;
                            $scope.endNode = data["properties"]["enode"];
                            selectCount++;
                            linksArr.push(data["id"]);
                            highRenderCtrl.highLightFeatures.push({
                                id: data["id"].toString(),
                                layerid: layerId,
                                type: 'line',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();
                        } else if (eNode === data["properties"]["enode"]) {
                            highRenderCtrl._cleanHighLight();
                            tooltipsCtrl.setStyleTooltip("color:black;");
                            tooltipsCtrl.setChangeInnerHtml("已经选择了第二条线!");
                            $scope.startNode = sNode;
                            $scope.endNode = data["properties"]["snode"];
                            selectCount++;
                            linksArr.push(data["id"]);
                            highRenderCtrl.highLightFeatures.push({
                                id: data["id"].toString(),
                                layerid: layerId,
                                type: 'line',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();
                        } else {
                            tooltipsCtrl.setStyleTooltip("color:black;");
                            tooltipsCtrl.setChangeInnerHtml("此线不符合，请重新选择第二条线!");
                        }
                    } else if (selectCount > 1) { //第三次及以上选择的线
                        if ($scope.endNode === data["properties"]["snode"]) {
                            highRenderCtrl._cleanHighLight();
                            tooltipsCtrl.setStyleTooltip("color:black;");
                            tooltipsCtrl.setChangeInnerHtml("已经选择了第二条线!");
                            $scope.endNode = data["properties"]["enode"];
                            highRenderCtrl.highLightFeatures.push({
                                id: data["id"].toString(),
                                layerid: layerId,
                                type: 'line',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();
                            selectCount++;
                            linksArr.push(data["id"]);
                        } else if ($scope.endNode === data["properties"]["enode"]) {
                            highRenderCtrl._cleanHighLight();
                            tooltipsCtrl.setStyleTooltip("color:black;");
                            tooltipsCtrl.setChangeInnerHtml("已经选择了第二条线!");
                            $scope.endNode = data["properties"]["snode"];
                            highRenderCtrl.highLightFeatures.push({
                                id: data["id"].toString(),
                                layerid: layerId,
                                type: 'line',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();
                            selectCount++;
                            linksArr.push(data["id"]);
                        } else {
                            tooltipsCtrl.setStyleTooltip("color:black;");
                            tooltipsCtrl.setChangeInnerHtml("此线不符合，请重新选择线!");
                        }
                    }
                    //假如已经选择了三条及以上的线 并且第一根线的点和最后一根线的snode和enode重合
                    if (selectCount > 2 && ($scope.endNode === $scope.startNode)) {
                        tooltipsCtrl.setStyleTooltip("color:black;");
                        tooltipsCtrl.setChangeInnerHtml("选择的线已闭合,请点击空格，生成面");
                        selectCtrl.onSelected({
                            'links': linksArr
                        })
                    }
                });
            }
        }
    }
])