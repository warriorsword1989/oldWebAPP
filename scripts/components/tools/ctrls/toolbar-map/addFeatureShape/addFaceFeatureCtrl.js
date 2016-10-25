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
        var luLink = layerCtrl.getLayerById('luLink');
        var lcLink = layerCtrl.getLayerById('lcLink');

        //高亮满足条件的link;
        function _highLightSelected(linksArr,layerId){
            highRenderCtrl.highLightFeatures.length = 0;
            for(var index in linksArr){
                highRenderCtrl.highLightFeatures.push({
                    id: linksArr[index],
                    layerid: layerId,
                    type: 'line',
                    style: {}
                });
            }
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.drawHighlight();
        }
        //延迟清除定时器;
        function _clearTimeOut(){
            var timer = setTimeout(function(){
                tooltipsCtrl.onRemoveTooltip();
                clearTimeout(timer)
            },1500)
        }

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
                    nodeArr = [],
                    sNode, eNode;
                if(type === "ADLINKFACE"){
                    snapLayer = adLink;
                    tooltipsCtrl.setCurrentTooltip('请选择行政区划线！');
                    layerId = 'adLink';
                } else if(type === "ZONELINKFACE"){
                    snapLayer = zoneLink;
                    tooltipsCtrl.setCurrentTooltip('请选择zone线！');
                    layerId = 'zoneLink';
                } else if(type === "LULINKFACE"){
                    snapLayer = luLink;
                    tooltipsCtrl.setCurrentTooltip('请选择LU线！');
                    layerId = 'luLink';
                } else if(type === "LCLINKFACE"){
                    snapLayer = lcLink;
                    tooltipsCtrl.setCurrentTooltip('请选择LC线！');
                    layerId = 'lcLink';
                }
                //线选择配置
                map.currentTool = new fastmap.uikit.SelectPath({
                    map: map,
                    currentEditLayer: snapLayer,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.snapHandler._guides = [];
                map.currentTool.snapHandler.addGuideLayer(snapLayer);
                map.currentTool.enable();
                //配置保存热键类型;
                shapeCtrl.editType = type;
                snapLayer.options.editable = true;
                eventController.on(eventController.eventTypes.GETLINKID, function(data) {
                    //第一次选择一个线
                    if (selectCount === 0) {
                        tooltipsCtrl.onRemoveTooltip();
                        tooltipsCtrl.setCurrentTooltip('已选择了一条线！');
                        linksArr.push(data["id"]);
                        //更新高数组;
                        _highLightSelected(linksArr,layerId);
                        sNode = data["properties"]["snode"];
                        eNode = data["properties"]["enode"];
                        nodeArr.push(sNode);
                        nodeArr.push(eNode);
                        selectCount++;
                    } else if (selectCount == 1) { //第二次选择的线  如果符合就添加到数组中
                        if(linksArr.indexOf(data.id)!=-1){
                            if(linksArr[linksArr.length-1]==data.id){
                                //更新选中的符合条件的link；
                                linksArr.splice(linksArr.indexOf(data.id),1);
                                nodeArr = [];
                                $scope.endNode = nodeArr[nodeArr.length-1];
                                //更新高数组;
                                _highLightSelected(linksArr,layerId);
                                selectCount--;
                                tooltipsCtrl.onRemoveTooltip();
                            }else{
                                tooltipsCtrl.onRemoveTooltip();
                                tooltipsCtrl.setCurrentTooltip('闭合线选择错误!');
                                _clearTimeOut();
                                return;
                            }
                        }else{
                            if(data["properties"]["snode"]==sNode||data["properties"]["enode"]==sNode||data["properties"]["snode"]==eNode||data["properties"]["enode"]==eNode){
                                if(data["properties"]["snode"]==sNode){
                                    $scope.startNode = eNode;
                                    $scope.endNode = data["properties"]["enode"]
                                }else if(data["properties"]["snode"]==eNode){
                                    $scope.startNode = sNode;
                                    $scope.endNode = data["properties"]["enode"]
                                }else if(data["properties"]["enode"]==sNode){
                                    $scope.startNode = eNode;
                                    $scope.endNode = data["properties"]["snode"]
                                }else if(data["properties"]["enode"]==eNode){
                                    $scope.startNode = sNode;
                                    $scope.endNode = data["properties"]["snode"]
                                }

                                selectCount++;
                                nodeArr.push($scope.endNode);
                                if($scope.startNode==nodeArr[1]){
                                    nodeArr[1] = nodeArr[0];
                                    nodeArr[0] = $scope.startNode;
                                }
                                linksArr.push(data["id"]);
                                //更新高数组;
                                _highLightSelected(linksArr,layerId);
                                tooltipsCtrl.onRemoveTooltip();
                                tooltipsCtrl.setCurrentTooltip('已选择了两条线！');
                            }else{
                                tooltipsCtrl.onRemoveTooltip();
                                tooltipsCtrl.setCurrentTooltip('选择的线必须和上一条线连接');
                                _clearTimeOut();
                                return;
                            }
                        }
                    }else if(selectCount > 1){
                        if(linksArr.indexOf(data.id)!=-1){
                            if(linksArr[linksArr.length-1]==data.id){
                                //更新选中的符合条件的link；
                                linksArr.splice(linksArr.indexOf(data.id),1);
                                nodeArr.splice(nodeArr.length-1,1);
                                $scope.endNode = nodeArr[nodeArr.length-1];
                                //更新高数组;
                                _highLightSelected(linksArr,layerId);
                                selectCount--;
                                tooltipsCtrl.onRemoveTooltip();
                            }else{
                                tooltipsCtrl.onRemoveTooltip();
                                tooltipsCtrl.setCurrentTooltip('闭合线选择错误!');
                                _clearTimeOut();
                                return;
                            }
                        }else{
                            if(data["properties"]["snode"]==$scope.endNode||data["properties"]["enode"]==$scope.endNode){
                                if(data["properties"]["snode"]==$scope.endNode){
                                    $scope.endNode = data["properties"]["enode"];
                                }else if(data["properties"]["enode"]==$scope.endNode){
                                    $scope.endNode = data["properties"]["snode"];
                                }
                                selectCount++;
                                nodeArr.push( $scope.endNode);
                                linksArr.push(data["id"]);
                                //更新高数组;
                                _highLightSelected(linksArr,layerId);
                            }else{
                                tooltipsCtrl.setCurrentTooltip('选择的线必须和上一条线连接!');
                                _clearTimeOut();
                                return;
                            }
                        }
                    }
                    //console.log(nodeArr);
                    //假如已经选择了三条及以上的线 并且第一根线的点和最后一根线的snode和enode重合
                    if(selectCount > 2){
                        if (selectCount > 2 && ($scope.endNode == $scope.startNode)) {
                            tooltipsCtrl.onRemoveTooltip();
                            tooltipsCtrl.setCurrentTooltip('选择的线已闭合,请点击空格，生成面!');
                            selectCtrl.onSelected({
                                'links': linksArr,
                                'flag': true
                            })
                        }else{
                            tooltipsCtrl.onRemoveTooltip();
                            tooltipsCtrl.setCurrentTooltip('所选线还未闭合，请继续选择!');
                            selectCtrl.onSelected({
                                'links': linksArr,
                                'flag': false
                            })
                        }
                    }


                });
            }
        }

    }
])