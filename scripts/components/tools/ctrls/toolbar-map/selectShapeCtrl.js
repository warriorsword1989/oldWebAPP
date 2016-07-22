/**
 * Created by liwanchong on 2015/10/28.
 * Rebuild by chenx on 2016-07-05
 */
angular.module("app").controller("selectShapeCtrl", ["$scope", '$ocLazyLoad', '$rootScope', 'dsFcc', 'dsEdit', 'appPath',
    function($scope, $ocLazyLoad, $rootScope, dsFcc, dsEdit, appPath) {
        var selectCtrl = fastmap.uikit.SelectController();
        var objCtrl = fastmap.uikit.ObjectEditController();
        var layerCtrl = fastmap.uikit.LayerController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var eventController = fastmap.uikit.EventController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdNode = layerCtrl.getLayerById('rdNode');
        var workPoint = layerCtrl.getLayerById('workPoint');
        var editLayer = layerCtrl.getLayerById('edit');
        var poiLayer = layerCtrl.getLayerById('poi');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var originalFeature = []; // 用于poi
        var selectCount = 0; // 用于poi
        var popup = L.popup();
        $scope.toolTipText = "";
        //重新设置选择工具
        $scope.resetToolAndMap = function() {
            eventController.off(eventController.eventTypes.GETLINKID); //清除是select**ShapeCtrl.js中的事件,防止菜单之间事件错乱
            eventController.off(eventController.eventTypes.GETADADMINNODEID);
            eventController.off(eventController.eventTypes.GETNODEID);
            eventController.off(eventController.eventTypes.GETRELATIONID);
            eventController.off(eventController.eventTypes.GETTIPSID);
            if (map.currentTool) {
                map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
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
            //$scope.changeBtnClass("");
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            editLayer.clear();
        };
        /**
         *  显示属性栏
         * @param data 点击地图上的点获取的数据
         * @param type 点击地图上的点的类型
         * @param objCtrl ObjectController
         * @param propertyId   地图上点的id
         * @param propertyCtrl 需要打开的地图上的点的ctrl
         * @param propertyTpl 需要打开的地图上的点的html片段
         */
        $scope.showTipsOrProperty = function(data, type, objCtrl, propertyId, propertyCtrl, propertyTpl) {
            var ctrlAndTplParams = {
                loadType: 'tipsTplContainer',
                propertyCtrl: appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                propertyHtml: appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                callback: function() {
                    if (data.t_lifecycle === 2) { //外业修改直接打开相关的属性栏
                        $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                    } else { //3新增或1删除
                        var stageLen = data.t_trackInfo.length;
                        var stage = parseInt(data.t_trackInfo[stageLen - 1]["stage"]);
                        if (stage === 1) { // 未作业 当是删除时 可以打开右侧属性栏
                            if (data.t_lifecycle === 1) {
                                $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                            } else { //3新增或1删除
                                var stageLen = data.t_trackInfo.length;
                                var stage = parseInt(data.t_trackInfo[stageLen - 1]["stage"]);
                                if (stage === 1) { // 未作业 当是删除时 可以打开右侧属性栏
                                    if (data.t_lifecycle === 1) {
                                        $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                                    }
                                } else if (stage === 3) { //已作业 新添加的可以打开右侧属性栏
                                    if (data.t_lifecycle === 3) {
                                        if (data.f) {
                                            $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            //先load Tips面板和控制器
            $scope.$emit("transitCtrlAndTpl", ctrlAndTplParams);
        };
        $scope.selectShape = function(type) {
            //大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal("提示","地图缩放等级必须大于16级才可操作","info");
                return;
            }
            //重置选择工具
            $scope.resetToolAndMap();
            //清除上一步中的悬浮工具
            if (map.floatMenu) {
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            //收回上一步弹开的属性栏和tips框
            $scope.$emit("SWITCHCONTAINERSTATE", {
                "attrContainerTpl": false,
                "subAttrContainerTpl": false
            });
            $scope.$emit('closePopoverTips', false);
            //$scope.subAttrTplContainerSwitch(false);
            $("#popoverTips").hide();
            // //点击按钮后样式的修改
            // $scope.changeBtnClass(num);
            // //连续点击同一个按钮的操作
            // if (!$scope.classArr[num]) {
            //     map.currentTool.disable();
            //     map._container.style.cursor = '';
            //     return;
            // }
            if (type === "node") { //选择点
                $scope.resetOperator("selectNode");
                layerCtrl.pushLayerFront('edit'); //置顶editLayer
                //初始化选择点工具
                map.currentTool = new fastmap.uikit.SelectNode({
                    map: map,
                    nodesFlag: true,
                    // currentEditLayer: rdNode,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                //需要捕捉的图层
                // map.currentTool.snapHandler.addGuideLayer(rdNode);
                $scope.toolTipText = '请选择点！';
                eventController.off(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
            } else if (type === "link") { // 选择线
                $scope.resetOperator("selectLink");
                layerCtrl.pushLayerFront('edit'); //置顶editLayer
                //初始化选择线的工具
                map.currentTool = new fastmap.uikit.SelectPath({
                    map: map,
                    // currentEditLayer: rdLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                //初始化鼠标提示
                $scope.toolTipText = '请选择线！';
                //把要捕捉的线图层添加到捕捉工具中
                // commented by chenx
                // map.currentTool.snapHandler.addGuideLayer(rdLink);
                // rdLink.options.editable = true;
                eventController.off(eventController.eventTypes.GETLINKID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETLINKID, $scope.selectObjCallback);
            } else if (type === "face") {
                $scope.resetOperator("selectFace");
                //初始化选择面工具
                map.currentTool = new fastmap.uikit.SelectPolygon({
                    map: map,
                    // currentEditLayer: adFace,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                editLayer.bringToBack();
                //初始化鼠标提示
                $scope.toolTipText = '请选择面！';
                eventController.off(eventController.eventTypes.GETFACEID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETFACEID, $scope.selectObjCallback);
            } else if (type === "relation") {
                $scope.resetOperator("selectRelation");
                //初始化选择关系的工具
                map.currentTool = new fastmap.uikit.SelectRelation({
                    map: map,
                    relationFlag: true
                });
                map.currentTool.enable();
                editLayer.bringToBack();
                $scope.toolTipText = '请选择关系！';
                eventController.off(eventController.eventTypes.GETRELATIONID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETRELATIONID, $scope.selectObjCallback);
            } else if (type === "tips") {
                $scope.resetOperator("selectTips");
                layerCtrl.pushLayerFront('workPoint'); //置顶editLayer
                //初始化选择tips的工具
                map.currentTool = new fastmap.uikit.SelectTips({
                    map: map,
                    dataTipsFlag: true,
                    currentEditLayer: workPoint
                });
                map.currentTool.enable();
                $scope.toolTipText = '请选择Tips！';
                eventController.off(eventController.eventTypes.GETTIPSID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETTIPSID, $scope.selectObjCallback)
            } else if (type === "point") { // 点要素：poi，adadmin
                $scope.resetOperator("selectPointFeature");
                layerCtrl.pushLayerFront('edit'); //置顶editLayer
                //初始化选择点工具
                map.currentTool = new fastmap.uikit.SelectNode({
                    map: map,
                    nodesFlag: true,
                    // currentEditLayer: rdNode,
                    shapeEditor: shapeCtrl,
                    nodeType: "PointFeature"
                });
                map.currentTool.enable();
                selectCount = 0;
                originalFeature = [];
                //需要捕捉的图层
                // map.currentTool.snapHandler.addGuideLayer(rdNode);
                $scope.toolTipText = '请选择点要素！';
                eventController.off(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
            }
            tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
        };
        /**
         * 根据选择的geomtry从后台返回的数据 打开不同的属性面板
         * @param data
         */
        $scope.selectObjCallback = function(data) {
            $scope.selectedFeature = data;
            $scope.$emit("SWITCHCONTAINERSTATE", {
                "subAttrContainerTpl": false
            });
            //地图小于17级时不能选择
            if (map.getZoom < 17) {
                return;
            }
            map.closePopup();//如果有popup的话清除它
            if (map.floatMenu) {
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            //清除上一个选择的高亮
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures = [];
            var ctrlAndTmplParams = {
                    propertyCtrl: "",
                    propertyHtml: ""
                },
                toolsObj = null;
            switch (data.optype) {
                case "RDLINK":
                    //悬浮工具条的设置
                    toolsObj = {
                            items: [{
                                'text': "<a class='glyphicon glyphicon-plus'></a>",
                                'title': "插入形状点",
                                'type': 'PATHVERTEXINSERT',
                                'class': "feaf",
                                callback: $scope.modifyTools
                            }, {
                                'text': "<a class='glyphicon glyphicon-remove'></a>",
                                'title': "删除形状点",
                                'type': 'PATHVERTEXREMOVE',
                                'class': "feaf",
                                callback: $scope.modifyTools
                            }, {
                                'text': "<a class='glyphicon glyphicon-move'></a>",
                                'title': "修改形状点",
                                'type': 'PATHVERTEXMOVE',
                                'class': "feaf",
                                callback: $scope.modifyTools
                            }, {
                                'text': "<a class='glyphicon glyphicon-resize-horizontal'></a>",
                                'title': "修改道路方向",
                                'type': 'TRANSFORMDIRECT',
                                'class': "feaf",
                                callback: $scope.modifyTools
                            }, {
                                'text': "<a class='glyphicon glyphicon-resize-full' type=''></a>",
                                'title': "打断link",
                                'type': 'PATHBREAK',
                                'class': "feaf",
                                callback: $scope.modifyTools
                            }]
                        };
                        //当在移动端进行编辑时,弹出此按钮
                    if (L.Browser.touch) {
                        toolsObj.items.push({
                            'text': "<a class='glyphicon glyphicon-floppy-disk' type=''></a>",
                            'title': "保存",
                            'type': shapeCtrl.editType,
                            'class': "feaf",
                            callback: function() {
                                var e = $.Event("keydown");
                                e.keyCode = 32;
                                $(document).trigger(e);
                            }
                        })
                    }
                    selectCtrl.onSelected({
                        point: data.point
                    });
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "RDLINK", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "RDNODE":
                    toolsObj = {
                            items: [{
                                'text': "<a class='glyphicon glyphicon-move'></a>",
                                'title': "移动端点",
                                'type': "PATHNODEMOVE",
                                'class': "feaf",
                                callback: $scope.modifyTools
                            }]
                        };
                        //当在移动端进行编辑时,弹出此按钮
                    if (L.Browser.touch) {
                        toolsObj.items.push({
                            'text': "<a class='glyphicon glyphicon-floppy-disk' type=''></a>",
                            'title': "保存",
                            'type': shapeCtrl.editType,
                            'class': "feaf",
                            callback: function() {
                                var e = $.Event("keydown");
                                e.keyCode = 32;
                                $(document).trigger(e);
                            }
                        })
                    }
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_gate_ctrl/rdGateCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_gate_tpl/rdGateTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "RDNODE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case 'RDRESTRICTION':
                    //if (data.restrictionType === 1) {
                    ctrlAndTmplParams.propertyCtrl = appPath.road + "ctrls/attr_restriction_ctrl/rdRestriction";
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html";
                    //}
                    //else {
                    //    ctrlAndTmplParams.propertyCtrl = "components/road/ctrls/attr_restriction_ctrl/rdRestriction";
                    //    ctrlAndTmplParams.propertyHtml = "../../scripts/components/road/tpls/attr_restrict_tpl/rdRestrictOfTruckTpl.html";
                    //}
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'RDLANECONNEXITY':
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_connexity_ctrl/rdLaneConnexityCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_connexity_tpl/rdLaneConnexityTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'RDSPEEDLIMIT':
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_speedLimit_ctrl/speedLimitCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_speedLimit_tpl/speedLimitTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'RDCROSS':
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_cross_ctrl/rdCrossCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_cross_tpl/rdCrossTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'RDGSC':
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_rdgsc_ctrl/rdGscCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_gsc_tpl/rdGscTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'RDTRAFFICSIGNAL':
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_trafficSignal_ctrl/trafficSignalCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_trafficSignal_tpl/trafficSignalTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'RDBRANCH':
                    toolsObj = {
                            items: [{
                                'text': "<a class='glyphicon glyphicon-move'></a>",
                                'title': "改退出线",
                                'type': "MODIFYBRANCH_OUT",
                                'class': "feaf",
                                callback: $scope.modifyTools
                            }, {
                                'text': "<a class='glyphicon glyphicon-resize-horizontal'></a>",
                                'title': "改经过线",
                                'type': "MODIFYBRANCH_THROUGH",
                                'class': "feaf",
                                callback: $scope.modifyTools
                            }]
                        };
                        //当在移动端进行编辑时,弹出此按钮
                    if (L.Browser.touch) {
                        toolsObj.items.push({
                            'text': "<a class='glyphicon glyphicon-floppy-disk' type=''></a>",
                            'title': "保存",
                            'type': shapeCtrl.editType,
                            'class': "feaf",
                            callback: function() {
                                var e = $.Event("keydown");
                                e.keyCode = 32;
                                $(document).trigger(e);
                            }
                        })
                    }
                    locllBranchCtlAndTpl(data.branchType);
                    $scope.getFeatDataCallback(data, null, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "RWNODE":
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "移动端点",
                            'type': "PATHNODEMOVE",
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }]
                    };
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_node_ctrl/rwNodeCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_node_tpl/rwNodeTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "RWNODE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "RWLINK":
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-plus'></a>",
                            'title': "插入形状点",
                            'type': 'PATHVERTEXINSERT',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-remove'></a>",
                            'title': "删除形状点",
                            'type': 'PATHVERTEXREMOVE',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "修改形状点",
                            'type': 'PATHVERTEXMOVE',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-transfer' type=''></a>",
                            'title': "打断link",
                            'type': 'PATHBREAK',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }]
                    };
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_link_ctrl/rwLinkCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_link_tpl/rwLinkTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "RWLINK", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "ADADMIN":
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "移动行政区划代表点",
                            'type': "ADADMINMOVE",
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }]
                    };
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_administratives_ctrl/adAdminCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_adminstratives_tpl/adAdminTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "ADADMIN", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "ADNODE":
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "移动端点",
                            'type': "PATHNODEMOVE",
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }]
                    };
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_administratives_ctrl/adNodeCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_adminstratives_tpl/adNodeTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "ADNODE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "ADLINK":
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-plus'></a>",
                            'title': "插入形状点",
                            'type': 'PATHVERTEXINSERT',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-remove'></a>",
                            'title': "删除形状点",
                            'type': 'PATHVERTEXREMOVE',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "修改形状点",
                            'type': 'PATHVERTEXMOVE',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-transfer' type=''></a>",
                            'title': "打断link",
                            'type': 'PATHBREAK',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }]
                    };
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_administratives_ctrl/adLinkCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_adminstratives_tpl/adLinkTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "ADLINK", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "ADFACE":
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_administratives_ctrl/adFaceCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_adminstratives_tpl/adFaceTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "ADFACE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case "ZONENODE":
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "移动ZONENODE点",
                            'type': "PATHNODEMOVE",
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }]
                    };
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_zone_ctrl/zoneNodeCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_zone_tpl/zoneNodeTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "ZONENODE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "ZONELINK":
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-plus'></a>",
                            'title': "插入形状点",
                            'type': 'PATHVERTEXINSERT',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-remove'></a>",
                            'title': "删除形状点",
                            'type': 'PATHVERTEXREMOVE',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "修改形状点",
                            'type': 'PATHVERTEXMOVE',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-transfer' type=''></a>",
                            'title': "打断link",
                            'type': 'PATHBREAK',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }]
                    };
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_zone_ctrl/zoneLinkCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_zone_tpl/zoneLinkTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "ZONELINK", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "ZONEFACE":
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_zone_ctrl/zoneFaceCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_zone_tpl/zoneFaceTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "ZONEFACE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case "IXPOI":
                    $scope.$parent.$parent.selectPoiInMap = true; //用于控制当前POI是否是从地图上选择的
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-open'></a>",
                            'title': "移动显示坐标",
                            'type': "POILOCMOVE",
                            'class': "feaf",
                            callback: $scope.modifyPoi
                        }, {
                            'text': "<a class='glyphicon glyphicon-export'></a>",
                            'title': "移动引导坐标",
                            'type': "POIGUIDEMOVE",
                            'class': "feaf",
                            callback: $scope.modifyPoi
                        }, {
                            'text': "<a class='glyphicon glyphicon-random'></a>",
                            'title': "引导坐标随着显示坐标变化",
                            'type': "POIAUTODRAG",
                            'class': "feaf",
                            callback: $scope.modifyPoi
                        }, {
                            'text': "<a class='glyphicon glyphicon-refresh'></a>",
                            'title': "重置",
                            'type': "POIRESET",
                            'class': "feaf",
                            callback: $scope.modifyPoi
                        }, {
                            'text': "<a class='glyphicon glyphicon-cloud-upload'></a>",
                            'title': "编辑父",
                            'type': "SELECTPARENT",
                            'class': "feaf",
                            callback: $scope.modifyPoi
                        }]
                    };
                    ctrlAndTmplParams.propertyCtrl = appPath.poi + "ctrls/attr-base/generalBaseCtl";
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.poi + "tpls/attr-base/generalBaseTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "IXPOI", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "TIPS":
                    $("#popoverTips").css("display", "block");
                    dsFcc.getTipsResult(data.id).then(function(result) {
                        if (result.rowkey === "undefined") {
                            return;
                        }
                        var options11 = {
                            "loadType": 'attrTplContainer',
                            "propertyCtrl": appPath.road + "ctrls/blank_ctrl/blankCtrl",
                            "propertyHtml": appPath.root + appPath.road + "tpls/blank_tpl/blankTpl.html"
                        }
                        $scope.$emit("transitCtrlAndTpl", options11);
                        $scope.$emit("SWITCHCONTAINERSTATE", {
                            "attrContainerTpl": false
                        });
                        eventController.fire(eventController.eventTypes.SELECTBYATTRIBUTE, {
                            feather: result
                        });
                        switch (result.s_sourceType) {
                            case "2001": //测线
                                $scope.showTipsOrProperty(result, "RDLINK", objCtrl, result.id, appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                break;
                            case "1101": //点限速
                                $scope.showTipsOrProperty(result, "RDSPEEDLIMIT", objCtrl, result.id, appPath.road + "ctrls/attr_speedLimit_ctrl/speedLimitCtrl", appPath.root + appPath.road + "tpls/attr_speedLimit_tpl/speedLimitTpl.html");
                                break;
                            case "1102": //红绿灯
                                var ctrlAndTplOfTraffic = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            // $scope.getFeatDataCallback(result, result.f_array[0].f.id ? result.f_array[0].f.id : '', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                            $scope.getFeatDataCallback(result, result.f_array[0].f.id ? result.f_array[0].f.id : '', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfTraffic);
                                break;
                            case "1103": //红绿灯方位
                                var ctrlAndTplOfTraffic = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            // $scope.getFeatDataCallback(result, result.in.id ? result.in.id:'', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                            $scope.getFeatDataCallback(result, result.in.id ? result.in.id : '', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfTraffic);
                                break;
                            case "1104": //大门
                                var ctrlAndTplOfTraffic = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            // $scope.getFeatDataCallback(result, result.in.id ? result.in.id:'', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                            $scope.getFeatDataCallback(result, result.in.id ? result.in.id : '', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfTraffic);
                                break;
                            case "1105": //危险信息
                                var ctrlAndTplOfDirect = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfDirect);
                                break;
                            case "1106": //坡度
                                var ctrlAndTpl = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            // $scope.getFeatDataCallback(result, result.in.id ? result.in.id:'', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                            $scope.getFeatDataCallback(result, result.out.id ? result.out.id : '', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                                break;
                            case "1107": //收费站
                                $scope.showTipsOrProperty(result, "RDLINK", objCtrl, result.in.id, appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                break;
                            case "1111": //条件限速
                                var ctrlAndTpl = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            // $scope.getFeatDataCallback(result, result.in.id ? result.in.id:'', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                            $scope.getFeatDataCallback(result, result.f.id ? result.f.id : '', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                                break;
                            case "1113": //车道限速
                                var ctrlAndTpl = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            // $scope.getFeatDataCallback(result, result.in.id ? result.in.id:'', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                            $scope.getFeatDataCallback(result, result.f.id ? result.f.id : '', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                                break;
                            case "1201": //种别
                                $scope.showTipsOrProperty(result, "RDLINK", objCtrl, result.f.id, appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                break;
                            case "1202": //车道数
                                var ctrlAndTpl = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 3) {
                                            $scope.getFeatDataCallback(result, result.f.id ? result.f.id : '', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                                break;
                            case "1203": //道路方向
                                var ctrlAndTplOfDirect = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.f.type == 1) {
                                            $scope.getFeatDataCallback(result, result.f.id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfDirect);
                                break;
                            case "1205": //SA
                                var ctrlAndTplOfSA = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.f) {
                                            $scope.getFeatDataCallback(result, result.f.id, "RDLINK", "scripts/components/road/ctrls/attr_link_ctrl/rdLinkCtrl", "../../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfSA);
                                break;
                            case "1206": //PA
                                var ctrlAndTplOfPA = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.f) {
                                            $scope.getFeatDataCallback(result, result.f.id, "RDLINK", "scripts/components/road/ctrls/attr_link_ctrl/rdLinkCtrl", "../../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfPA);
                                break;
                            case "1207": //匝道
                                var ctrlAndTpl = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 3) {
                                            $scope.getFeatDataCallback(result, result.f.id ? result.f.id : '', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                                break;
                            case "1208": //停车场出入口Link
                                var ctrlAndTpl = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        $scope.getFeatDataCallback(result, result.f.id ? result.f.id : '', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                                break;
                            case "1301": //车信
                                $scope.showTipsOrProperty(result, "RDLANECONNEXITY", objCtrl, result.id, appPath.road + "ctrls/attr_connexity_ctrl/rdLaneConnexityCtrl", appPath.root + appPath.road + "tpls/attr_connexity_tpl/rdLaneConnexityTpl.html");
                                break;
                            case "1302": //交限
                                $scope.showTipsOrProperty(result, "RDRESTRICTION", objCtrl, result.id, appPath.road + "ctrls/attr_restriction_ctrl/rdRestriction", appPath.root + appPath.road + "tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html");
                                break;
                            case "1304": //禁止穿行
                                var ctrlAndTpl = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            $scope.getFeatDataCallback(result, result.f.id ? result.f.id : '', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                                break;
                            case "1305": //禁止驶入
                                var ctrlAndTpl = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            $scope.getFeatDataCallback(result, result.f.id ? result.f.id : '', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                                break;
                            case "1401": //方向看板
                                var ctrlAndTplOfOrientation = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            $scope.getFeatDataCallback(result, result.brID ? result.brID[0].id : '', "RDBRANCH", appPath.road + "ctrls/attr_branch_ctrl/rdSignBoardCtrl", appPath.root + appPath.road + "../../../scripts/components/road/tpls/attr_branch_Tpl/signBoardOfBranch.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfOrientation);
                                break;
                            case "1402": //real sign
                                var ctrlAndTplOfRealSign = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            $scope.getFeatDataCallback(result, result.brID ? result.brID[0].id : '', "RDBRANCH", "scripts/components/road/ctrls/attr_branch_ctrl/rdBranchCtrl", "../../../scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfRealSign);
                                break;
                            case "1404": //提左提右
                                var ctrlAndTpl = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            $scope.getFeatDataCallback(result, result.brID ? result.brID[0].id : '', "RDBRANCH", appPath.road + 'ctrls/attr_branch_ctrl/rdBranchCtrl', appPath.root + appPath.road + 'tpls/attr_branch_Tpl/namesOfBranch.html', 3);
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                                break;
                            case "1406": //实景图
                                var ctrlAndTplOfJCV = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            $scope.getFeatDataCallback(result, result.brID ? result.brID[0].id : '', "RDBRANCH", appPath.road + 'ctrls/attr_branch_ctrl/rdRealImageCtrl', appPath.root + appPath.road + 'tpls/attr_branch_Tpl/realImageOfBranch.html');
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfJCV);
                                break;
                            case "1407": //分歧
                                $scope.showTipsOrProperty(result, "RDBRANCH", objCtrl, result.brID ? result.brID[0].id : '', appPath.road + "ctrls/attr_branch_ctrl/rdBranchCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/namesOfBranch.html");
                                break;
                            case "1502": //路面覆盖
                                var ctrlAndTpl = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                                break;
                            case "1510": //桥
                                var ctrlAndTplOfBridge = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        $scope.brigeLinkArray = result.f_array;
                                        $scope.getFeatDataCallback(result, result.f_array[0].id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfBridge);
                                break;
                            case "1514": //施工
                                var ctrlAndTplOfMend = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        $scope.brigeLinkArray = result.f_array;
                                        $scope.getFeatDataCallback(result, result.f_array[0].id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfMend);
                                break;
                            case "1515": //维修
                                var ctrlAndTplOfD = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        $scope.brigeLinkArray = result.f_array;
                                        $scope.getFeatDataCallback(result, result.f_array[0].id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfD);
                                break;
                            case "1604": //区域内道路
                                break;
                            case "1704": //交叉路口
                                var ctrlAndTplOfCross = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.f.id) {
                                            var obj = {
                                                "nodePid": parseInt(result.f.id)
                                            };
                                            var param = {
                                                "dbId": App.Temp.dbId,
                                                "type": "RDCROSS",
                                                "data": obj
                                            };
                                            dsEdit.getByCondition(JSON.stringify(param), function(data) {
                                                var crossCtrlAndTpl = {
                                                    propertyCtrl: appPath.road + "ctrls/attr_cross_ctrl/rdCrossCtrl",
                                                    propertyHtml: appPath.root + appPath.road + "tpls/attr_cross_tpl/rdCrossTpl.html"
                                                };
                                                objCtrl.setCurrentObject("RDCROSS", result.data[0]);
                                                $scope.$emit("transitCtrlAndTpl", crossCtrlAndTpl);
                                            });
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfCross);
                                break;
                            case "1803": //挂接
                                var ctrlAndTplOfOfGJ = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfOfGJ);
                                break;
                            case "1501": //上下线分离
                                var ctrlAndTplOfUpAndDown = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        $scope.getFeatDataCallback(result, result.f_array[0].id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfUpAndDown);
                                break;
                            case "1901": //道路名
                                var ctrlAndTplOfName = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfName);
                                break;
                        }
                    });
                    break;
            }
            /*判断分歧类型*/
            function locllBranchCtlAndTpl(branchType) {
                switch (branchType) {
                    case 0:
                        ctrlAndTmplParams.propertyCtrl = appPath.road + "ctrls/attr_branch_ctrl/rdBranchCtrl";
                        ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_branch_Tpl/namesOfBranch.html";
                        break;
                    case 1:
                        ctrlAndTmplParams.propertyCtrl = appPath.road + "ctrls/attr_branch_ctrl/rdBranchCtrl";
                        ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_branch_Tpl/namesOfBranch.html";
                        break;
                    case 2:
                        ctrlAndTmplParams.propertyCtrl = appPath.road + "ctrls/attr_branch_ctrl/rdBranchCtrl";
                        ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_branch_Tpl/namesOfBranch.html";
                        break;
                    case 3:
                        ctrlAndTmplParams.propertyCtrl = appPath.road + "ctrls/attr_branch_ctrl/rdBranchCtrl";
                        ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_branch_Tpl/namesOfBranch.html";
                        break;
                    case 4:
                        ctrlAndTmplParams.propertyCtrl = appPath.road + "ctrls/attr_branch_ctrl/rdBranchCtrl";
                        ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_branch_Tpl/namesOfBranch.html";
                        break;
                    case 5:
                        ctrlAndTmplParams.propertyCtrl = appPath.road + "ctrls/attr_branch_ctrl/rdRealImageCtrl";
                        ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_branch_Tpl/realImageOfBranch.html";
                        break;
                    case 6:
                        ctrlAndTmplParams.propertyCtrl = appPath.road + "ctrls/attr_branch_ctrl/rdSignAsRealCtrl";
                        ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_branch_Tpl/signAsRealOfBranch.html";
                        break;
                    case 7:
                        ctrlAndTmplParams.propertyCtrl = appPath.road + "ctrls/attr_branch_ctrl/rdSeriesCtrl";
                        ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_branch_Tpl/seriesOfBranch.html";
                        break;
                    case 8:
                        ctrlAndTmplParams.propertyCtrl = appPath.road + "ctrls/attr_branch_ctrl/rdSchematicCtrl";
                        ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_branch_Tpl/schematicOfBranch.html";
                        break;
                    case 9:
                        ctrlAndTmplParams.propertyCtrl = appPath.road + "ctrls/attr_branch_ctrl/rdSignBoardCtrl";
                        ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_branch_Tpl/signBoardOfBranch.html";
                        break;
                }
            }

        };
        $scope.sign = 0; //初始值
        /**
         * 修改方向
         * @param direct
         * @returns {*}
         */
        $scope.changeDirect = function(direct) {
            var orientation;
            switch (direct) {
                case 1: //双方向
                    if ($scope.sign === 0) {
                        orientation = 3; //向左
                    } else if (this.sign === 1) {
                        orientation = 2; //向右
                    }
                    break;
                case 2: //顺方向
                    orientation = 1;
                    $scope.sign = 0;
                    break;
                case 3: //逆方向
                    orientation = 1;
                    $scope.sign = 1;
                    break;
            }
            return orientation;
        };
        /**
         * 悬浮工具栏中的点击事件方法
         * @param event
         */
        $scope.modifyTools = function(event) {
            var type = event.currentTarget.type; //点击悬浮按钮的类型
            $("#popoverTips").hide();
            if (shapeCtrl.getCurrentTool()['options']) {
                shapeCtrl.stopEditing();
            }
            var feature = null;
            if (map.currentTool) {
                map.currentTool.disable();
            }
            if (shapeCtrl.shapeEditorResult) {
                if (tooltipsCtrl.getCurrentTooltip()) {
                    tooltipsCtrl.onRemoveTooltip();
                }
                if (type === "ADADMINMOVE") {
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('moveDot');
                        tooltipsCtrl.setCurrentTooltip('开始移动行政区划代表点！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('先选择行政区划代表点！');
                        return;
                    }
                } else if (type === "PATHVERTEXINSERT") {
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('insertDot');
                        tooltipsCtrl.setCurrentTooltip('开始插入形状点！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('正要插入形状点,先选择线！');
                        return;
                    }
                } else if (type === "PATHVERTEXREMOVE") {
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('deleteDot');
                        tooltipsCtrl.setCurrentTooltip('删除此形状点！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('正要删除形状点,先选择线！');
                        return;
                    }
                } else if (type === "TRANSFORMDIRECT") {
                    if (selectCtrl.selectedFeatures) {
                        selectCtrl.selectedFeatures["direct"] = $scope.changeDirect(selectCtrl.selectedFeatures["direct"]);
                        objCtrl.data["direct"] = selectCtrl.selectedFeatures["direct"];
                        // $scope.$apply();
                        tooltipsCtrl.setEditEventType('transformDirection');
                        tooltipsCtrl.setCurrentTooltip('修改方向！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('修改方向,先选择线！');
                        return;
                    }
                } else if (type === "PATHVERTEXMOVE") {
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('moveDot');
                        tooltipsCtrl.setCurrentTooltip('拖拽修改形状点位置！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('正要移动形状点先选择线！');
                        return;
                    }
                } else if (type === "PATHBREAK") {
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('pathBreak');
                        tooltipsCtrl.setCurrentTooltip('开始打断link！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('正要开始打断link,先选择线！');
                        return;
                    }
                } else if (type === "PATHNODEMOVE") {
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('pathNodeMove');
                        tooltipsCtrl.setCurrentTooltip('开始移动node！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('正要开始移动node,先选择node！');
                        return;
                    }
                } else if (type.split('_').length === 2) {
                    map.currentTool = new fastmap.uikit.SelectPath({
                        map: map,
                        currentEditLayer: rdLink,
                        linksFlag: true,
                        shapeEditor: shapeCtrl
                    });
                    map.currentTool.enable();
                    if (type.split('_')[1] === 'OUT') {
                        tooltipsCtrl.setCurrentTooltip('开始修改退出线！');
                    } else if (type.split('_')[1] === 'THROUGH') {
                        tooltipsCtrl.setCurrentTooltip('开始修改经过线！');
                    }
                    eventController.on(eventController.eventTypes.GETLINKID, function(data) {
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        //进入线;
                        highRenderCtrl.highLightFeatures.push({
                            id: objCtrl.data.inLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: '#5FCD3A'
                            }
                        });
                        highRenderCtrl.highLightFeatures.push({
                            id: objCtrl.data.nodePid.toString(),
                            layerid: 'rdLink',
                            type: 'rdnode',
                            style: {
                                color: 'yellow'
                            }
                        });
                        //退出线;
                        highRenderCtrl.highLightFeatures.push({
                            id: data.id,
                            layerid: 'rdLink',
                            type: 'line',
                            style: {}
                        });
                        //绘制当前的退出线和原来的进入线;
                        highRenderCtrl.drawHighlight();
                        //设置热键修改时的监听类型;
                        shapeCtrl.setEditingType("UPDATEBRANCH");
                        //退出线选完后的鼠标提示;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！');
                        //设置修改确认的数据;
                        featCodeCtrl.setFeatCode({
                            "nodePid": objCtrl.data.nodePid.toString(),
                            "inLinkPid": objCtrl.data.inLinkPid.toString(),
                            "outLinkPid": data.id.toString(),
                            "pid": objCtrl.data.pid.toString(),
                            "objStatus": "UPDATE",
                            "branchType": $scope.selectedFeature.branchType,
                            'childId': $scope.selectedFeature.id
                        });
                    });
                    return;
                }
                if (!selectCtrl.selectedFeatures) {
                    return;
                }
                feature = selectCtrl.selectedFeatures.geometry;
                layerCtrl.pushLayerFront('edit');
                var sObj = shapeCtrl.shapeEditorResult;
                if (type === "TRANSFORMDIRECT") {
                    editLayer.drawGeometry = selectCtrl.selectedFeatures;
                    editLayer.draw(selectCtrl.selectedFeatures, editLayer);
                    sObj.setOriginalGeometry(feature);
                    sObj.setFinalGeometry(feature);
                    shapeCtrl.editType = 'transformDirect';
                } else {
                    editLayer.drawGeometry = feature; //获取需要编辑几何体的geometry
                    editLayer.draw(feature, editLayer); //把需要编辑的几何体画在editLayer上
                    sObj.setOriginalGeometry(feature);
                    sObj.setFinalGeometry(feature);
                    shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType[type]); //设置编辑状态
                    shapeCtrl.startEditing();
                    // shapeCtrl.editFeatType = "rdLink";
                    // map.currentTool = shapeCtrl.getCurrentTool();
                    // map.currentTool.snapHandler.addGuideLayer(rdLink);
                    // modified by chenx
                    shapeCtrl.editFeatType = $scope.selectedFeature.optype;
                    map.currentTool = shapeCtrl.getCurrentTool();
                    map.currentTool.snapHandler.addGuideLayer(layerCtrl.getLayerByFeatureType($scope.selectedFeature.optype)); //捕捉图层
                }
                shapeCtrl.on("startshapeeditresultfeedback", saveOrEsc);
                shapeCtrl.on("stopshapeeditresultfeedback", function() {
                    shapeCtrl.off("startshapeeditresultfeedback", saveOrEsc);
                });

                function saveOrEsc(event) {
                    if (event.changeTooltips) {
                        tooltipsCtrl.setStyleTooltip("color:black;");
                        tooltipsCtrl.setChangeInnerHtml("点击空格键保存操作或者按ESC键取消!");
                    }
                }
            }
        };
        $scope.getFeatDataCallback = function(selectedData, id, type, ctrl, tpl,toolsObj) {
            if (type == 'RDBRANCH') {
                if (selectedData.branchType == 5 || selectedData.branchType == 7) {
                    dsEdit.getBranchByRowId(selectedData.id, selectedData.branchType).then(function(data) {
                        getByPidCallback(type, ctrl, tpl, data,selectedData,toolsObj);
                    });
                } else {
                    dsEdit.getBranchByDetailId(selectedData.id, selectedData.branchType).then(function(data) {
                        getByPidCallback(type, ctrl, tpl, data,selectedData,toolsObj);
                    });
                }
            } else {
                dsEdit.getByPid(id, type).then(function(data) {
                    getByPidCallback(type, ctrl, tpl, data,selectedData,toolsObj);
                });
            }
            //高亮poi并放入selectCtrl
            function initPoiData(selectedData,data) {
                var locArr = data.geometry.coordinates;
                // var guideArr = data.guide.coordinates;
                var points = [];
                points.push(fastmap.mapApi.point(locArr[0], locArr[1]));
                points.push(fastmap.mapApi.point(data.xGuide, data.yGuide));
                selectCtrl.onSelected({ //记录选中点信息
                    geometry: points,
                    id: data.pid,
                    linkPid: data.linkPid
                });
                //高亮POI点
                var highLightFeatures = [];
                highLightFeatures.push({
                    id: data.pid.toString(),
                    layerid: 'poi',
                    type: 'IXPOI'
                });
                highRenderCtrl.highLightFeatures = highLightFeatures;
                highRenderCtrl.drawHighlight();
            }
            function getByPidCallback(type, ctrl, tpl, data,selectedData,toolsObj) {
                objCtrl.setCurrentObject(type, data);
                if (type == "IXPOI") {
                    $scope.$emit("transitCtrlAndTpl", {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.poi + "ctrls/attr-tips/poiPopoverTipsCtl",
                        "propertyHtml": appPath.root + appPath.poi + "tpls/attr-tips/poiPopoverTips.html"
                    });
                    $scope.$emit("transitCtrlAndTpl", {
                        "loadType": "attrTplContainer",
                        "propertyCtrl": ctrl,
                        "propertyHtml": tpl
                    });
                    initPoiData(selectedData,data);
                } else {
                    $scope.$emit("transitCtrlAndTpl", {
                        "loadType": 'attrTplContainer',
                        "propertyCtrl": ctrl,
                        "propertyHtml": tpl
                    });
                }

                tooltipsCtrl.onRemoveTooltip();
                if (!map.floatMenu && toolsObj) {
                    map.floatMenu = new L.Control.FloatMenu("000", selectedData.event.originalEvent, toolsObj);
                    map.addLayer(map.floatMenu);
                    map.floatMenu.setVisible(true);
                }
            }
        };
        $scope.modifyPoi = function(event) {
            var type = event.currentTarget.type; //按钮的类型
            if (type === "POILOCMOVE") {
                if (selectCtrl.selectedFeatures) {
                    tooltipsCtrl.setCurrentTooltip('开始移动POI显示坐标点！');
                } else {
                    tooltipsCtrl.setCurrentTooltip('先选择POI显示坐标点！');
                    return;
                }
            } else if (type === "POIGUIDEMOVE") {
                if (selectCtrl.selectedFeatures) {
                    tooltipsCtrl.setCurrentTooltip('开始移动POI引导坐标点！');
                } else {
                    tooltipsCtrl.setCurrentTooltip('先选择POI引导坐标点！');
                    return;
                }
            } else if (type === "POIAUTODRAG") {
                if (selectCtrl.selectedFeatures) {
                    tooltipsCtrl.setCurrentTooltip('开始移动POI显示坐标点！');
                } else {
                    tooltipsCtrl.setCurrentTooltip('先选择POI显示坐标点！');
                    return;
                }
            } else if (type === "POIRESET") {
                if (shapeCtrl.shapeEditorResult) {
                    var sObj = shapeCtrl.shapeEditorResult;
                    var oFeature = sObj.getOriginalGeometry();
                    var of_1 = originalFeature[0].clone();
                    var of_2 = originalFeature[1].clone();
                    var comsAndPoints = [];
                    comsAndPoints.push(of_1);
                    comsAndPoints.push(of_2);
                    oFeature.components = comsAndPoints;
                    oFeature.points = comsAndPoints;
                    setTimeout(function() {
                        editLayer.clear();
                        $scope.geometry = of_1;
                        $scope.guide = of_2;
                        editLayer.draw(oFeature, editLayer); //在编辑图层中画出需要编辑的几何体
                    }, 100);
                    map.currentTool = shapeCtrl.getCurrentTool();
                    shapeCtrl.shapeEditorResult.setFinalGeometry(oFeature);
                    return;
                }
            } else if (type === "SELECTPARENT") {
                tooltipsCtrl.setCurrentTooltip('请框选地图上的POI点！');
                eventController.on(eventController.eventTypes.GETBOXDATA, function(event) {
                    var data = event.data,
                        highlightFeatures = [],
                        rectangleData = { //矩形框信息geoJson
                            "type": "Polygon",
                            "coordinates": [
                                []
                            ]
                        },
                        latArr = event.border._latlngs;
                    /*过滤框选后的数组，去重*/
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < data.length; j++) {
                            if (i != j) {
                                if (data[i].properties.id == data[j].properties.id || data[i].properties.id == objCtrl.data.pid) {
                                    data.splice(i, 1);
                                }
                            }
                        }
                    }
                    for (var rec = 0; rec < latArr.length; rec++) {
                        var tempArr = [];
                        tempArr.push(latArr[rec].lng);
                        tempArr.push(latArr[rec].lat);
                        rectangleData.coordinates[0].push(tempArr);
                        if (rec == latArr.length - 1) {
                            rectangleData.coordinates[0].push(rectangleData.coordinates[0][0]);
                        }
                    }
                    /*高亮link*/
                    for (var i = 0, lenI = data.length; i < lenI; i++) {
                        highlightFeatures.push({
                            id: data[i].properties.id.toString(),
                            layerid: 'poi',
                            type: 'IXPOI'
                        })
                    }
                    highRenderCtrl.highLightFeatures = highlightFeatures;
                    highRenderCtrl.drawHighlight();
                    //判断相交点数
                    if (data.length == 0) {
                        tooltipsCtrl.setCurrentTooltip('所选区域无POI点，请重新选择！');
                    } else {
                        var html = '<ul id="layerpopup">';
                        //this.overlays = this.unique(this.overlays);
                        for (var item in data) {
                            var index = parseInt(item) + 1;
                            if (objCtrl.data.parents.length > 0 && data[item].properties.id == objCtrl.data.parents[0].parentPoiPid) { //当前父
                                html += '<li><a href="#" id="' + data[item].properties.id + '">' + index + '、' + data[item].properties.name + '</a>' + '&nbsp;&nbsp;' + '<label class="label label-primary">' + $scope.metaData.kindFormat[data[item].properties.kindCode].kindName + '</label>' + '&nbsp;&nbsp;' + '<label class="label label-default">' + '当前父' + '</label>' + '&nbsp;&nbsp;' + '<input class="btn btn-warning btn-xs" type="button" onclick="changePoiParent(' + data[item].properties.id + ')" value="解除父">' + '</li>';
                            } else if ($scope.metaData.kindFormat[data[item].properties.kindCode].parent != 0) {
                                html += '<li><a href="#" id="' + data[item].properties.id + '">' + index + '、' + data[item].properties.name + '</a>' + '&nbsp;&nbsp;' + '<label class="label label-primary">' + $scope.metaData.kindFormat[data[item].properties.kindCode].kindName + '</label>' + '&nbsp;&nbsp;' + '<label class="label label-info">' + '可为父' + '</label>' + '&nbsp;&nbsp;' + '<input class="btn btn-success btn-xs" type="button" onclick="changePoiParent(' + data[item].properties.id + ')" value="作为父">' + '</li>';
                            }
                            // html += '<li><a href="#" id="' + data[item].properties.id+'">'+ index + '、' +data[item].properties.name + '<label class="label label-primary">'+$scope.metaData.kindFormat[data[item].properties.kindCode].kindName+'</label>'+ '<input type="button">' + '</a></li>';
                        }
                        html += '</ul>';
                        popup.setLatLng([data[item].point.y, data[item].point.x]).setContent(html);
                        if (data && data.length >= 1) {
                            setTimeout(function() {
                                map.openPopup(popup);
                            }, 200)
                        }
                    }
                });
            }
            if (!selectCtrl.selectedFeatures) {
                return;
            }
            if (!selectCount) {
                // $scope.$apply();
                //停止shapeCtrl
                if (shapeCtrl.getCurrentTool()['options']) {
                    shapeCtrl.stopEditing();
                }
                var feature = null;
                if (map.currentTool) {
                    map.currentTool.disable();
                }
                if (shapeCtrl.shapeEditorResult) {
                    if (tooltipsCtrl.getCurrentTooltip()) {
                        tooltipsCtrl.onRemoveTooltip();
                    }
                    feature = selectCtrl.selectedFeatures.geometry; //获取要编辑的几何体的geometry
                    //组装一个线
                    feature.components = [];
                    feature.points = [];
                    feature.components.push(feature[0]);
                    feature.components.push(feature[1]);
                    feature.points.push(feature[0]);
                    feature.points.push(feature[1]);
                    originalFeature.push(feature[0].clone());
                    originalFeature.push(feature[1].clone());
                    feature.type = "IXPOI";
                    layerCtrl.pushLayerFront('edit'); //使编辑图层置顶
                    var sObj = shapeCtrl.shapeEditorResult;
                    editLayer.drawGeometry = feature;
                    editLayer.draw(feature, editLayer); //在编辑图层中画出需要编辑的几何体
                    sObj.setOriginalGeometry(feature);
                    sObj.setFinalGeometry(feature);
                    selectCount = 1;
                }
            }
            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType[type]); //设置编辑的类型
            shapeCtrl.startEditing(); // 开始编辑
            map.currentTool = shapeCtrl.getCurrentTool();
            if (type === "POILOCMOVE") {
                shapeCtrl.editFeatType = "IXPOI";
                map.currentTool.captureHandler._guides.length = 0;
                map.currentTool.captureHandler.addGuideLayer(poiLayer); //把点图层放到捕捉工具中
            } else if (type === "POIGUIDEMOVE") {
                shapeCtrl.editFeatType = "IXPOI";
                map.currentTool.captureHandler._guides.length = 0;
                map.currentTool.captureHandler.addGuideLayer(rdLink); //把线图层放到捕捉工具中
            } else if (type === "POIAUTODRAG") {
                shapeCtrl.editFeatType = "IXPOI";
                map.currentTool.captureHandler._guides.length = 0;
                map.currentTool.captureHandler.addGuideLayer(rdLink); //把线图层放到捕捉工具中
            } else if (type === "POIRESET") {
                map.currentTool.captureHandler._guides.length = 0;
            } else if (type === "SELECTPARENT") {
                map.currentTool.snapHandler._guides.length = 0;
            }
        };
        $scope.clearMap = function () {
            //重置选择工具
            $scope.resetToolAndMap();
            //移除上一步中的悬浮按钮
            if (map.floatMenu) {
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            // $scope.classArr[0] = false;
            //重置上一步中的属性栏和tips框
            originalFeature = [];
            selectCount = 0;
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures.length = 0;
        };
        /*
         获取地图上的指定图层
         */
        $scope.getLayerById = function(layerId) {
            var layer;
            for (var item in map._layers) {
                if (map._layers[item].options&&map._layers[item].options.id) {
                    if (map._layers[item].options.id === layerId) {
                        layer=map._layers[item];
                        break;
                    }
                }
            }
            return layer;
        };
        /**
         * 查找poi
         */
        $scope.getPoi = function (pid) {
            dsEdit.getByPid(pid, "IXPOI").then(function (rest) {
                if (rest) {
                    objCtrl.setCurrentObject('IXPOI', rest);
                    $scope.$emit("transitCtrlAndTpl", {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.poi + "ctrls/attr-tips/poiPopoverTipsCtl",
                        "propertyHtml": appPath.root + appPath.poi + "tpls/attr-tips/poiPopoverTips.html"
                    });
                    $scope.$emit("transitCtrlAndTpl", {
                        "loadType": "attrTplContainer",
                        "propertyCtrl": appPath.poi + "ctrls/attr-base/generalBaseCtl",
                        "propertyHtml": appPath.root + appPath.poi + "tpls/attr-base/generalBaseTpl.html"
                    });
                }
            });
        };
        $scope.resetMap =function (myPid) {
            map.closePopup();
            $scope.clearMap();
            var drawLayer = $scope.getLayerById('parentLayer');
            if(drawLayer!=undefined){
                map.removeLayer(drawLayer);
            }
            $scope.getPoi(myPid);
        };
        /*
        变更父子关系
        */
        changePoiParent = function(parentId) {
            var myPid = objCtrl.data.pid;
            var myParent = objCtrl.data.parents;
            if (myParent.length > 0) {
                if (myParent[0].parentPoiPid == parentId) { //解除
                    dsEdit.deleteParent(myPid).then(function(data) {
                        $scope.resetMap(myPid);
                    });
                } else { //更新
                    dsEdit.updateParent(myPid, parentId).then(function(data) {
                        $scope.resetMap(myPid);
                    });
                }
            } else { //新增
                dsEdit.createParent(myPid, parentId).then(function(data) {
                    $scope.resetMap(myPid);
                });
            }
        };
        //高亮显示左侧列表的poi
        $scope.$on("highlightPoiByPid", function(event) {
            var pid = objCtrl.data.pid;
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures.length = 0;
            // $scope.clearMap();
            var highLightFeatures = [];
            highLightFeatures.push({
                id: pid,
                layerid: 'poi',
                type: 'IXPOI',
                style: {}
            });
            //高亮
            highRenderCtrl.highLightFeatures = highLightFeatures;
            highRenderCtrl.drawHighlight();
            map.setView([objCtrl.data.geometry.coordinates[1], objCtrl.data.geometry.coordinates[0]], 18);
        });
    }
]);