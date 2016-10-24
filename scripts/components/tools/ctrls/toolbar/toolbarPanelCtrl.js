/**
 * Created by chenx on 2016-09-30
 */
angular.module("app").controller("ToolbarCtrl", ["$scope", '$ocLazyLoad', '$q', 'appPath',
    function($scope, $ocLazyLoad, $q, appPath) {
        var layerCtrl = fastmap.uikit.LayerController();
        var editLayer = layerCtrl.getLayerById('edit');
        var rdLink = layerCtrl.getLayerById('rdLink');
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var selectCtrl = fastmap.uikit.SelectController();
        var eventCtrl = fastmap.uikit.EventController();
        var highRenderCtrl = fastmap.uikit.HighRenderController();
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
        // 工具按鈕控制開關
        $scope.selectBtnOpened = false;
        $scope.addBtnOpened = false;
        $scope.advanceBtnOpened = false;
        $scope.nodeChecked = true;
        $scope.linkChecked = true;
        // 编辑操作符
        $scope.shapeOperator = "navigate"; // 形狀操作符selectNode,addLink等
        $scope.featureOperator = null; // 要素操作符RDNODE,RWLINK,ADLINK等，必須与形狀操作符配合使用
        // $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/selectShapeCtrl.js').then(function () {
        //     $scope.selectShapeTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/selectShapeTpl.htm';
        // });
        // // $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/advanceToolsCtrl.js').then(function() {
        // //     $scope.advanceToolsTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/advanceToolsTpl.htm';
        // // });
        // $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addShapeCtrl.js').then(function () {
        //     $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addNodeFeatureCtrl.js').then(function () {
        //         $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addLinkFeatureCtrl.js').then(function () {
        //             $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addCRFShapeCtrl.js').then(function () {
        //                 $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addFaceFeatureCtrl.js').then(function () {
        //                     $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addSameFeatureCtrl.js').then(function () {
        //                         $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addRdBranchCtrl.js').then(function () {
        //                             $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addRdRelationCtrl.js').then(function () {
        //                                 $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addPoiCtrl.js').then(function () {
        //                                 });
        //                                 $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/specialOperAdvanceToolsCtl.js').then(function () {
        //                                     $scope.specialOperAdvanceToolsTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/specialOperAdvanceToolsTpl.htm';
        //                                 });
        //                                 $scope.addShapeTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/addShapeTpl.htm';
        //                                 $scope.advanceToolsTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/advanceToolsTpl.htm';
        //                             });
        //                         });
        //                     });
        //                 });
        //             });
        //         });
        //     });
        // });
        var llPromises = [];
        llPromises.push($ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/selectShapeCtrl.js'));
        llPromises.push($ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addNodeFeatureCtrl.js'));
        llPromises.push($ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addLinkFeatureCtrl.js'));
        llPromises.push($ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addFaceFeatureCtrl.js'));
        llPromises.push($ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addRdRelationCtrl.js'));
        llPromises.push($ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addRdBranchCtrl.js'));
        llPromises.push($ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addCRFShapeCtrl.js'));
        llPromises.push($ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addSameFeatureCtrl.js'));
        llPromises.push($ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addPoiCtrl.js'));
        llPromises.push($ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addShapeCtrl.js'));
        $q.all(llPromises).then(function() {
            $scope.toolbarTpl = appPath.root + 'scripts/components/tools/tpls/toolbar/toolbarTpl.htm';;
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
        $scope.resetToolAndMap = function() {
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
            // if (event) { //取消点击菜单自动回收功能
            //     event.stopPropagation();
            // }
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
            if(map.markerLayer){ //清除marker图层
                map.removeLayer(map.markerLayer);
                map.markerLayer = null;
            }
            if (selectCtrl.rowKey) {
                selectCtrl.rowKey = null;
            }
            $(editLayer.options._div).unbind();
        };
        $scope.$on("resetButtons", function(event) {
            $scope.clearOperator();
        });
        //用于控制dropdown的收缩与展示
        $scope.dropdownStatus = {
            isopen: false
        };
        $scope.togglEspecialOperAdvanceBtn = function() {
            $scope.specialOperAdvanceBtnOpened = !$scope.specialOperAdvanceBtnOpened;
        };
        //更改捕捉，type:node,link;
        $scope.changeSnap = function(type, featType, snapLayer) {
            var snapList = shapeCtrl.getCurrentTool().snapHandler._guides;
            if (type == "node") {
                if (!$scope.nodeChecked) {
                    for (var i = 0; i < snapList.length; i++) {
                        if (snapList[i].type == "Point") {
                            snapList.splice(i, 1);
                            i--;
                        }
                    }
                } else {
                    snapList.unshift(snapLayer);
                }
            } else if (type == "link") {
                if (!$scope.linkChecked) {
                    for (var i = 0; i < snapList.length; i++) {
                        if (snapList[i].type == "LineString") {
                            snapList.splice(i, 1);
                            i--;
                        }
                    }
                } else {
                    snapList.push(snapLayer);
                }
            }
        };

        $scope.changeLayerSnap = function(type) {
            if (type == "node") {
                if ($scope.nodeChecked == true) {
                    $scope.nodeChecked = false;
                } else {
                    $scope.nodeChecked = true;
                }
            } else {
                if ($scope.linkChecked == true) {
                    $scope.linkChecked = false;
                } else {
                    $scope.linkChecked = true;
                }
            }
            var tool = shapeCtrl.getCurrentTool();
            var nodeType = null;
            var snapNode = null;
            var snapLink = null;
            if (tool.shapeEditor != undefined) {
                var linkType = tool.shapeEditor.editFeatType;
                switch (linkType) {
                    case "RDLINK":
                        nodeType = "RDNODE";
                        snapLink = rdLink;
                        snapNode = rdNode;
                        break;
                    case "RWLINK":
                        nodeType = "RWNODE";
                        snapLink = rwLink;
                        snapNode = rwNode;
                        break;
                    case "ADLINK":
                        nodeType = "ADNODE";
                        snapLink = adLink;
                        snapNode = adNode;
                        break;
                    case "ZONELINK":
                        nodeType = "ZONENODE";
                        snapLink = zoneLink;
                        snapNode = zoneNode;
                        break;
                    case "LCLINK":
                        nodeType = "LCNODE";
                        snapLink = lcLink;
                        snapNode = lcNode;
                        break;
                    case "LULINK":
                        nodeType = "LUNODE";
                        snapLink = luLink;
                        snapNode = luNode;
                        break;
                }
                if (type == "node") {
                    $scope.changeSnap("node", nodeType, snapNode);
                } else {
                    $scope.changeSnap("link", linkType, snapLink);
                }
            }
        }
    }
]);