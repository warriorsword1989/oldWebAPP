/**
 * Created by chenx on 2016-07-05
 */
angular.module("app").controller("mapToolbarCtrl", ["$scope", '$ocLazyLoad', 'appPath',
    function($scope, $ocLazyLoad, appPath) {
        // 工具按鈕控制開關
        $scope.selectBtnOpened = false;
        $scope.addBtnOpened = false;
        $scope.advanceBtnOpened = false;
        // 编辑操作符
        $scope.shapeOperator = "navigate"; // 形狀操作符selectNode,addLink等
        $scope.featureOperator = null; // 要素操作符RDNODE,RWLINK,ADLINK等，必須与形狀操作符配合使用
        $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/selectShapeCtrl.js').then(function() {
            $scope.selectShapeTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/selectShapeTpl.htm';
        });
        // $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/advanceToolsCtrl.js').then(function() {
        //     $scope.advanceToolsTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/advanceToolsTpl.htm';
        // });
        $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addShapeCtrl.js').then(function() {
            $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addRwShapeCtrl.js').then(function() {
                $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addAdShapeCtrl.js').then(function() {
                    $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addZoneShapeCtrl.js').then(function() {
                        $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addPoiCtrl.js').then(function() {});
                        $scope.addShapeTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/addShapeTpl.htm';
                        $scope.advanceToolsTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/advanceToolsTpl.htm';
                    });
                });
            });
        });
        $scope.toggleSelectBtn = function() {
            $scope.selectBtnOpened = !$scope.selectBtnOpened;
            $scope.addBtnOpened = false;
            $scope.advanceBtnOpened = false;
        };
        $scope.toggleAddBtn = function() {
            $scope.selectBtnOpened = false;
            $scope.addBtnOpened = !$scope.addBtnOpened;
            $scope.advanceBtnOpened = false;
        };
        $scope.toggleAdvanceBtn = function() {
            $scope.selectBtnOpened = false;
            $scope.addBtnOpened = false;
            $scope.advanceBtnOpened = !$scope.advanceBtnOpened;
        };
        $scope.clearOperator = function() {
            $scope.shapeOperator = "navigate";
            $scope.featureOperator = null;
            resetMap();
        };
        $scope.resetOperator = function(shapeOper, featureOper) {
            if (shapeOper) {
                $scope.shapeOperator = shapeOper;
            }
            if (featureOper) {
                $scope.featureOperator = featureOper;
            } else {
                $scope.featureOperator = null;
            }
        };
        var selectCtrl = fastmap.uikit.SelectController();
        var layerCtrl = fastmap.uikit.LayerController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var eventCtrl = fastmap.uikit.EventController();
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var editLayer = layerCtrl.getLayerById("edit");

        function resetMap() {
            eventCtrl.off(eventCtrl.eventTypes.GETLINKID);
            eventCtrl.off(eventCtrl.eventTypes.GETADADMINNODEID);
            eventCtrl.off(eventCtrl.eventTypes.GETNODEID);
            eventCtrl.off(eventCtrl.eventTypes.GETRELATIONID);
            eventCtrl.off(eventCtrl.eventTypes.GETTIPSID);
            if (map.currentTool) { //禁止当前的参考线图层的事件捕获
                map.currentTool.disable();
            }
            if (map.floatMenu) { // 清除操作按钮
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures.length = 0;
            if (tooltipsCtrl.getCurrentTooltip()) {
                tooltipsCtrl.onRemoveTooltip();
            }
            if (selectCtrl.rowKey) {
                selectCtrl.rowKey = null;
            }
            editLayer.drawGeometry = null;
            shapeCtrl.stopEditing();
            editLayer.bringToBack();
            $(editLayer.options._div).unbind();
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            editLayer.clear();
        }
        $scope.$on("resetButtons",function (event) {
            $scope.clearOperator();
        });
    }
]);