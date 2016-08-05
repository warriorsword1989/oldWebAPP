/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller("addLuShapeCtrl", ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath', '$timeout',
    function ($scope, $ocLazyLoad, dsEdit, appPath, $timeout) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var luNode = layerCtrl.getLayerById('luNode');
        var luLink = layerCtrl.getLayerById('luLink');

        /**
         * 添加geometry
         * @param type
         * @param num
         * @param event
         */
        $scope.addShape = function (type) {
            //大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal("提示", "地图缩放等级必须大于16级才可操作", "info");
                return;
            }
            //重置选择工具
            $scope.resetToolAndMap();
            // $scope.changeBtnClass(num);
            // //连续点击两次按钮
            // if (num !== 7) {
            //     if (!$scope.classArr[num]) {
            //         map.currentTool.disable();
            //         map._container.style.cursor = '';
            //         return;
            //     }
            // }
            if (type === "LUNODE") {
                $scope.resetOperator("addNode", type);
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                //shapeCtrl.editFeatType = "rdNode";
                shapeCtrl.editFeatType = "LUNODE";
                map.currentTool.snapHandler.addGuideLayer(luLink);
                tooltipsCtrl.setEditEventType('pointVertexAdd');
                tooltipsCtrl.setCurrentTooltip('开始增加节点！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击增加节点!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存,或者按ESC键取消!");
            } else if (type === "LULINK") {
                $scope.resetOperator("addLink", type);
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.DRAWPATH);
                shapeCtrl.startEditing();
                //重置创建link时   扑捉工具中的值
                shapeCtrl.getCurrentTool().clickcount = 1;
                shapeCtrl.getCurrentTool().catches.length = 0;
                shapeCtrl.getCurrentTool().snodePid = 0;
                shapeCtrl.getCurrentTool().enodePid = 0;
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.enable();
                shapeCtrl.editFeatType = "LULINK";
                //把点和线图层放到捕捉工具中(此处注意必须是先点后线，为了解决当起始点和终点为自动捕捉时，获取nodeId失败)
                map.currentTool.snapHandler.addGuideLayer(luNode);
                map.currentTool.snapHandler.addGuideLayer(luLink);
                tooltipsCtrl.setEditEventType(fastmap.mapApi.ShapeOptionType.DRAWPATH);
                tooltipsCtrl.setCurrentTooltip('开始画线！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("双击最后一个点结束画线!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
            } else if (type === 'LUFACE') {
                $scope.resetOperator("addFace", type);
                if (shapeCtrl.shapeEditorResult) {
                    shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.polygon([fastmap.mapApi.point(0, 0)]));
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                //设置添加类型
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.DRAWPOLYGON);
                shapeCtrl.startEditing();

                //把工具添加到map中
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.enable();
                shapeCtrl.editFeatType = "LUFACE";
                //提示信息
                tooltipsCtrl.setEditEventType(fastmap.mapApi.ShapeOptionType.DRAWPOLYGON);
                tooltipsCtrl.setCurrentTooltip('开始画面！');
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setChangeInnerHtml("点击最后一个点结束!");
                tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
            }
        }
    }
]);