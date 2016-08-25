/**
 * Created by chenx on 2016-07-05
 */
angular.module("app").controller("mapToolbarCtrl", ["$scope", '$ocLazyLoad', 'appPath',
    function($scope, $ocLazyLoad, appPath) {
        var layerCtrl = fastmap.uikit.LayerController();
        var editLayer = layerCtrl.getLayerById('edit');
        var rdLink = layerCtrl.getLayerById('rdLink');
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var selectCtrl = fastmap.uikit.SelectController();
        var eventCtrl = fastmap.uikit.EventController();
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        // 工具按鈕控制開關
        $scope.selectBtnOpened = false;
        $scope.addBtnOpened = false;
        $scope.advanceBtnOpened = false;
        $scope.nodeChecked = true;
        $scope.linkChecked = true;
        // 编辑操作符
        $scope.shapeOperator = "navigate"; // 形狀操作符selectNode,addLink等
        $scope.featureOperator = null; // 要素操作符RDNODE,RWLINK,ADLINK等，必須与形狀操作符配合使用
        $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/selectShapeCtrl.js').then(function() {
            $scope.selectShapeTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/selectShapeTpl.htm';
        });
        // $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/advanceToolsCtrl.js').then(function() {
        //     $scope.advanceToolsTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/advanceToolsTpl.htm';
        // });
        $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addShapeCtrl.js').then(function () {
            $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addNodeFeatureCtrl.js').then(function () {
                $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addLinkFeatureCtrl.js').then(function () {
                    $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addCRFShapeCtrl.js').then(function () {
                        $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addFaceFeatureCtrl.js').then(function () {
                            $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addSameFeatureCtrl.js').then(function () {
                                $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addRdBranchCtrl.js').then(function () {
                                    $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addRdRelationCtrl.js').then(function () {
                                        $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addPoiCtrl.js').then(function () {
                                        });
                                        $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/specialOperAdvanceToolsCtl.js').then(function () {
                                            $scope.specialOperAdvanceToolsTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/specialOperAdvanceToolsTpl.htm';
                                        });
                                        $scope.addShapeTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/addShapeTpl.htm';
                                        $scope.advanceToolsTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/advanceToolsTpl.htm';
                                    });
                                });
                            });
                        });
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
            $scope.resetToolAndMap();
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
        //重新设置选择工具
        $scope.resetToolAndMap = function () {
            $scope.dropdownStatus.isopen = !$scope.dropdownStatus.isopen;

            eventCtrl.off(eventCtrl.eventTypes.GETLINKID); //清除select**ShapeCtrl.js中的事件,防止菜单之间事件错乱
            eventCtrl.off(eventCtrl.eventTypes.GETADADMINNODEID);
            eventCtrl.off(eventCtrl.eventTypes.GETNODEID);
            eventCtrl.off(eventCtrl.eventTypes.GETRELATIONID);
            eventCtrl.off(eventCtrl.eventTypes.GETTIPSID);
            eventCtrl.off(eventCtrl.eventTypes.GETFACEID);
            eventCtrl.off(eventCtrl.eventTypes.RESETCOMPLETE);
            eventCtrl.off(eventCtrl.eventTypes.GETBOXDATA);
            eventCtrl.off(eventCtrl.eventTypes.GETRECTDATA);
            eventCtrl.off(eventCtrl.eventTypes.GETFEATURE);

            if (map.floatMenu) {
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            if (event) {
                event.stopPropagation();
            }
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures = [];

            editLayer.drawGeometry = null;
            editLayer.clear();
            editLayer.bringToBack();
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            shapeCtrl.stopEditing();
            rdLink.clearAllEventListeners();
            if (tooltipsCtrl.getCurrentTooltip()) {
                tooltipsCtrl.onRemoveTooltip();
            }
            if (map.currentTool) {
                map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
            }

            if (selectCtrl.rowKey) {
                selectCtrl.rowKey = null;
            }

            $(editLayer.options._div).unbind();

        };
        $scope.$on("resetButtons",function (event) {
            $scope.clearOperator();
        });
        //用于控制dropdown的收缩与展示
        $scope.dropdownStatus = {
            isopen:false
        };
        $scope.togglEspecialOperAdvanceBtn = function(){
        	$scope.specialOperAdvanceBtnOpened = !$scope.specialOperAdvanceBtnOpened;
        };
    }
]);