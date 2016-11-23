/**
 * Created by linglong on 2016/11/21.
 */
angular.module('app').controller('addAdminPointCtrl', ['$scope', '$ocLazyLoad',
    function ($scope, $ocLazyLoad) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');

        /**
         * 增加POI
         * @param type
         */
        $scope.addAdmin = function (type) {
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
            // $scope.changeBtnClass(num);
            if (type === 'ADADMIN') {
                $scope.resetOperator('addPointFeature', type);
                if (shapeCtrl.shapeEditorResult) {
                    var feature = {};
                    feature.components = [];
                    feature.points = [];
                    feature.components.push(fastmap.mapApi.point(0, 0));
                    feature.components.push(fastmap.mapApi.point(0, 0));
                    feature.points.push(fastmap.mapApi.point(0, 0));
                    feature.points.push(fastmap.mapApi.point(0, 0));
                    feature.type = 'ADMINPOINT';

                    shapeCtrl.shapeEditorResult.setFinalGeometry(feature);
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType('addAdAdminPoint');
                shapeCtrl.startEditing();
                shapeCtrl.editFeatType = null;

                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.resultData = null;
                map.currentTool.enable();
                map.currentTool.captureHandler.addGuideLayer(rdLink);

                tooltipsCtrl.setEditEventType('addAdAdmin');
                tooltipsCtrl.setCurrentTooltip('开始增加行政区划代表点！', 'info');
            }
        };
    }
]);
