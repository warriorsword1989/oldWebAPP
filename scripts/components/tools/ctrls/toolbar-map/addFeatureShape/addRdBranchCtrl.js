/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller("addRdBranchCtrl", ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath','$timeout',
    function($scope, $ocLazyLoad, dsEdit, appPath,$timeout) {
        var layerCtrl = fastmap.uikit.LayerController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdnode = layerCtrl.getLayerById('rdNode');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var eventController = fastmap.uikit.EventController();
        $scope.limitRelation = {};

        /**
         * 添加geometry
         * @param type
         * @param num
         * @param event
         */
        $scope.addShape = function(type) {
            //大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal("提示","地图缩放等级必须大于16级才可操作","info");
                return;
            }
            //重置选择工具
            $scope.resetToolAndMap();
            $scope.$emit("SWITCHCONTAINERSTATE", {
                "attrContainerTpl": false,
                "subAttrContainerTpl": false
            });
            $("#popoverTips").hide();
             if (type.split('_')[0] == 'BRANCH') {


                $scope.resetOperator("addRelation", type);
                var typeArr = type.split('_');
                var currentActiveBranch = '';
                //保存所有需要高亮的图层数组;
                var highLightFeatures = [],
                    linkDirect = 0;
                //设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(typeArr[0]);
                //根据不同的分歧种类构建limitRelation的参数;
                switch (typeArr[1]) {
                    case 'REALIMAGE':
                        currentActiveBranch = '实景图';
                        $scope.limitRelation.branchType = 5;
                        break;
                    case 'SIGNBOARDNAME':
                        currentActiveBranch = '方向看板';
                        $scope.limitRelation.branchType = 9;
                        break;
                    case 'SIGNASREAL':
                        currentActiveBranch = '实景看板';
                        $scope.limitRelation.branchType = 6;
                        break;
                    case 'SERIESBRANCH':
                        currentActiveBranch = '连续分歧';
                        $scope.limitRelation.branchType = 7;
                        break;
                    case 'BIGCROSSSCHEMATIC':
                        currentActiveBranch = '大路口交叉点模式';
                        $scope.limitRelation.branchType = 8;
                        break;
                    case 'NORMALROAD':
                        currentActiveBranch = '普通道路方面';
                        $scope.limitRelation.branchType = 1;
                        break;
                    case 'HIGHWAY':
                        currentActiveBranch = '高速分歧';
                        $scope.limitRelation.branchType = 0;
                        break;
                    case '3D':
                        currentActiveBranch = '3D分歧';
                        $scope.limitRelation.branchType = 3;
                        break;
                }
                //地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdBranch');
                tooltipsCtrl.setCurrentTooltip('正要新建' + currentActiveBranch + '分歧,先选择线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList:['line','point','line']
                });
                map.currentTool.enable();
                //map.currentTool.snapHandler.addGuideLayer(rdnode);
                map.currentTool.snapHandler.addGuideLayer(rdLink); //添加自动吸附的图层
                //获取退出线并高亮;
                $scope.getOutLink = function(dataId) {
                    $scope.limitRelation.outLinkPid = parseInt(dataId);
                    if (highLightFeatures.length === 3) {
                        highLightFeatures.pop();
                    }
                    highRenderCtrl._cleanHighLight();
                    highLightFeatures.push({
                        id: $scope.limitRelation.outLinkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {}
                    });
                    highRenderCtrl.drawHighlight();
                    tooltipsCtrl.setCurrentTooltip("已选退出线,点击空格键保存!");
                }
                //选择分歧监听事件;
                eventController.on(eventController.eventTypes.GETLINKID, function(data) {
                    if (data.index === 1) {
                        //清除吸附的十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];

                        map.currentTool.snapHandler.addGuideLayer(rdnode);

                        //进入线;
                        $scope.limitRelation.inLinkPid = parseInt(data.id);
                        highLightFeatures.push({
                            id: $scope.limitRelation.inLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {color: '#21ed25'}
                        });
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                        linkDirect = data["properties"]["direct"];
                        if (linkDirect == 2 || linkDirect == 3) {
                            $scope.limitRelation.nodePid = parseInt(linkDirect == 2 ? data["properties"]['enode'] : data["properties"]['snode']);
                            highLightFeatures.push({
                                id: $scope.limitRelation.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();
                            map.currentTool.selectedFeatures.push($scope.limitRelation.nodePid.toString());
                            tooltipsCtrl.setCurrentTooltip("已经选择进入点,选择退出线!");

                            //清除吸附的十字
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];
                            map.currentTool.snapHandler.addGuideLayer(rdLink);
                        }
                    } else if (data.index === 2) {
                        if (linkDirect == 2 || linkDirect == 3) {
                            $scope.getOutLink(data.id);
                        } else {
                            $scope.limitRelation.nodePid = parseInt(data.id);
                            highLightFeatures.push({
                                id: $scope.limitRelation.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {}
                            });
                            highRenderCtrl.drawHighlight();
                            tooltipsCtrl.setCurrentTooltip("已经选择进入点,选择退出线!");

                            //清除吸附的十字
                            map.currentTool.snapHandler.snaped = false;
                            map.currentTool.clearCross();
                            map.currentTool.snapHandler._guides = [];

                            map.currentTool.snapHandler.addGuideLayer(rdLink);
                        }
                    } else if (data.index > 2) {
                        $scope.getOutLink(data.id);
                        $scope.limitRelation.outLinkPid = parseInt(data.id);
                    }
                    featCodeCtrl.setFeatCode($scope.limitRelation);
                })
            }
        }
    }
]);