/**
 * Created by liuyang on 2016/8/18.
 */
angular.module('app').controller('addNodeFeatureCtrl', ['$scope', '$ocLazyLoad',
    function ($scope, $ocLazyLoad) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();

        var adLink = layerCtrl.getLayerById('adLink');
        var rdLink = layerCtrl.getLayerById('rdLink');
        var lcLink = layerCtrl.getLayerById('lcLink');
        var luLink = layerCtrl.getLayerById('luLink');
        var rwLink = layerCtrl.getLayerById('rwLink');
        var zoneLink = layerCtrl.getLayerById('zoneLink');

        $scope.addNode = function (type) {
            $scope.resetToolAndMap();
            $scope.$emit('SWITCHCONTAINERSTATE', {
                attrContainerTpl: false,
                subAttrContainerTpl: false
            });
            $('#popoverTips').hide();
            // 大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                return;
            }
            $scope.resetOperator('addNode', type);
            if (shapeCtrl.shapeEditorResult) {
                shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                layerCtrl.pushLayerFront('edit');
            }
            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
            shapeCtrl.startEditing();
            shapeCtrl.editFeatType = type;
            map.currentTool = shapeCtrl.getCurrentTool();
            map.currentTool.enable();
            map.currentTool.snapHandler._guides = [];
            // 设置捕捉图层
            if (type === 'RDNODE') {
                map.currentTool.snapHandler.addGuideLayer(rdLink);
            } else if (type === 'RWNODE') {
                map.currentTool.snapHandler.addGuideLayer(rwLink);
            } else if (type === 'ADNODE') {
                map.currentTool.snapHandler.addGuideLayer(adLink);
            } else if (type === 'ZONENODE') {
                map.currentTool.snapHandler.addGuideLayer(zoneLink);
            } else if (type === 'LCNODE') {
                map.currentTool.snapHandler.addGuideLayer(lcLink);
            } else if (type === 'LUNODE') {
                map.currentTool.snapHandler.addGuideLayer(luLink);
            }
            tooltipsCtrl.setEditEventType('pointVertexAdd');
            tooltipsCtrl.setCurrentTooltip('开始增加节点！');
            tooltipsCtrl.setChangeInnerHtml('点击增加节点!');
            tooltipsCtrl.setDbClickChangeInnerHtml('点击空格保存,或者按ESC键取消!');
        };
    }
]);
