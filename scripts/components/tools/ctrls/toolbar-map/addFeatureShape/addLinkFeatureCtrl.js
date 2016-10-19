/**
 * Created by liuyang on 2016/8/18.
 */
var addLinkShapeApp = angular.module('app');
addLinkShapeApp.controller("addLinkFeatureCtrl", ['$scope', '$ocLazyLoad',
    function($scope, $ocLazyLoad) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();

        var adLink = layerCtrl.getLayerById('adLink');
        var adNode = layerCtrl.getLayerById('adNode');

        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdNode = layerCtrl.getLayerById('rdNode');

        var lcNode = layerCtrl.getLayerById('lcNode');
        var lcLink = layerCtrl.getLayerById('lcLink');

        var luNode = layerCtrl.getLayerById('luNode');
        var luLink = layerCtrl.getLayerById('luLink');

        var rwLink = layerCtrl.getLayerById('rwLink');
        var rwNode = layerCtrl.getLayerById('rwNode');

        var zoneLink = layerCtrl.getLayerById('zoneLink');
        var zoneNode = layerCtrl.getLayerById('zoneNode');

        $scope.addLink = function(type) {
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
            $scope.resetOperator("addLink", type);
            if (shapeCtrl.shapeEditorResult) {
                //初始化编辑工具
                shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                layerCtrl.pushLayerFront('edit');
            }
            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.DRAWPATH);
            shapeCtrl.startEditing();
            map.currentTool = shapeCtrl.getCurrentTool();
            map.currentTool.enable();
            map.currentTool.snapHandler._guides = [];

            //重置捕捉工具中的值
            shapeCtrl.getCurrentTool().clickcount = 1;
            shapeCtrl.getCurrentTool().catches.length = 0;
            shapeCtrl.getCurrentTool().snodePid = 0;
            shapeCtrl.getCurrentTool().enodePid = 0;
            shapeCtrl.editFeatType = type;
            //把点和线图层加到捕捉工具中，先加的优先捕捉
            if (type === "ADLINK") {
                if($scope.nodeChecked){
                    map.currentTool.snapHandler.addGuideLayer(adNode);
                }
                if($scope.linkChecked){
                    map.currentTool.snapHandler.addGuideLayer(adLink);
                }
            } else if (type === "RDLINK") {
                if($scope.nodeChecked){
                    map.currentTool.snapHandler.addGuideLayer(rdNode);
                }
                if($scope.linkChecked){
                    map.currentTool.snapHandler.addGuideLayer(rdLink);
                }
            } else if (type === "RWLINK") {
                if($scope.nodeChecked){
                    map.currentTool.snapHandler.addGuideLayer(rwNode);
                }
                if($scope.linkChecked){
                    map.currentTool.snapHandler.addGuideLayer(rwLink);
                }
            } else if (type === "ZONELINK") {
                if($scope.nodeChecked){
                    map.currentTool.snapHandler.addGuideLayer(zoneNode);
                }
                if($scope.linkChecked){
                    map.currentTool.snapHandler.addGuideLayer(zoneLink);
                }
            } else if (type === "LCLINK") {
                if($scope.nodeChecked){
                    map.currentTool.snapHandler.addGuideLayer(lcNode);
                }
                if($scope.linkChecked){
                    map.currentTool.snapHandler.addGuideLayer(lcLink);
                }
            } else if (type === "LULINK") {
                if($scope.nodeChecked){
                    map.currentTool.snapHandler.addGuideLayer(luNode);
                }
                if($scope.linkChecked){
                    map.currentTool.snapHandler.addGuideLayer(luLink);
                }
            }
            tooltipsCtrl.setEditEventType(fastmap.mapApi.ShapeOptionType.DRAWPATH);
            tooltipsCtrl.setCurrentTooltip('开始画线！');
            tooltipsCtrl.setStyleTooltip("color:black;");
            tooltipsCtrl.setChangeInnerHtml("双击最后一个点结束画线!");
            tooltipsCtrl.setDbClickChangeInnerHtml("点击空格保存画线,或者按ESC键取消!");
        };

    }
])