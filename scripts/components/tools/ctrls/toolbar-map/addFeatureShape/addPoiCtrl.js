/**
 * Created by zhaohang on 2016/4/12.
 */
angular.module('app').controller('addPoiCtrl', ['$scope', '$ocLazyLoad',
    function ($scope, $ocLazyLoad) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        /**
         * 两点之间的距离
         * @param pointA
         * @param pointB
         * @returns {number}
         */
        $scope.distance = function (pointA, pointB) {
            var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
            return Math.sqrt(len);
        };
        /**
         * 两点之间的夹角
         * @param pointA
         * @param pointB
         * @returns {*}
         */
        $scope.includeAngle = function (pointA, pointB) {
            var angle,
                dValue = pointA.x - pointB.x,
                PI = Math.PI;
            if (dValue === 0) {
                angle = PI / 2;
            } else {
                angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
            }
            return angle;
        };

        /**
         * 增加POI
         * @param type
         */
        $scope.addPoi = function (type) {
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
            if (type === 'IXPOI') {
                $scope.resetOperator('addPointFeature', type);
                if (shapeCtrl.shapeEditorResult) {
                    var feature = {};
                    feature.components = [];
                    feature.points = [];
                    feature.components.push(fastmap.mapApi.point(0, 0));
                    feature.components.push(fastmap.mapApi.point(0, 0));
                    feature.points.push(fastmap.mapApi.point(0, 0));
                    feature.points.push(fastmap.mapApi.point(0, 0));
                    feature.type = 'IXPOI';
                    shapeCtrl.shapeEditorResult.setFinalGeometry(feature);
                    selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                    layerCtrl.pushLayerFront('edit');
                }
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POIADD);
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                map.currentTool.enable();
                shapeCtrl.editFeatType = 'IXPOI';
                map.currentTool.captureHandler.addGuideLayer(rdLink);
                tooltipsCtrl.setEditEventType('poiAdd');
                tooltipsCtrl.setCurrentTooltip('点击空格保存,或者按ESC键取消!');
            }
        };
    }
]);
