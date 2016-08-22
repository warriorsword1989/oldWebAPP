/**
 * Created by liwanchong on 2015/10/28.
 * Rebuild by chenx on 2016-07-05
 */
angular.module("app").controller("selectShapeCtrl", ["$scope",'$q', '$ocLazyLoad', '$rootScope', 'dsFcc', 'dsEdit', 'appPath',
    function($scope,$q, $ocLazyLoad, $rootScope, dsFcc, dsEdit, appPath) {
        var selectCtrl = fastmap.uikit.SelectController();
        var objCtrl = fastmap.uikit.ObjectEditController();
        var layerCtrl = fastmap.uikit.LayerController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var eventController = fastmap.uikit.EventController();
        var transform = new fastmap.mapApi.MecatorTranform();

        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdNode = layerCtrl.getLayerById('rdNode');
        var workPoint = layerCtrl.getLayerById('workPoint');
        var editLayer = layerCtrl.getLayerById('edit');
        var poiLayer = layerCtrl.getLayerById('poi');
        var crfData = layerCtrl.getLayerById('crfData');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var originalFeature = []; // 用于poi
        var selectCount = 0; // 用于poi
        var popup = L.popup();
        $scope.toolTipText = "";
        $scope.angleOfLink = function (pointA, pointB) {
            var PI = Math.PI, angle;
            if ((pointA.x - pointB.x) === 0) {
                angle = PI / 2;
            } else {
                angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
            }
            return angle;

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
            //console.info("selectObjCallback",$scope);
            //$scope.$parent.$parent.$parent.$parent.$parent.selectPoiInMap = true;//表示poi是从地图上选中的
            //$scope.$parent.$parent.selectPoiInMap = true;//表示poi是从地图上选中的
            //$scope.selectPoiInMap = true;
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
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_node_ctrl/rdNodeFormCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_node_tpl/rdNodeFormTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "RDNODE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "RDSAMENODE"://同一点
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_same_ctrl/rdSameNodeCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_same_tpl/rdSameNodeTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "RDSAMENODE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case "RDSAMELINK": //同一线
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_same_ctrl/rdSameLinkCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_same_tpl/rdSameLinkTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "RDSAMELINK", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case "RDVOICEGUIDE": //语音引导
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_voiceGuide_ctrl/voiceGuide';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_voiceGuide_tpl/voiceGuide.html";
                    $scope.getFeatDataCallback(data, data.id, "RDVOICEGUIDE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
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
                    //悬浮工具条的设置
                    toolsObj = {
                        items: [  {
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "修改点位",
                            'type': 'MODIFYSPEEDNODE',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-resize-horizontal'></a>",
                            'title': "修改方向",
                            'type': 'TRANSFORMSPEEDDIRECT',
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }]
                    };
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_speedLimit_ctrl/speedLimitCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_speedLimit_tpl/speedLimitTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case 'RDLINKSPEEDLIMIT':
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_speedLimit_ctrl/linkSpeedLimitCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_speedLimit_tpl/linkSpeedLimitTpl.html";
                    $scope.getLinkSpeedLimit(data.selectData.properties, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'DBRDLINKSPEEDLIMIT':
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_speedLimit_ctrl/linkSpeedLimitCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_speedLimit_tpl/linkSpeedLimitTpl.html";
                    $scope.getLinkSpeedLimit(data.speedData.properties, data.orgtype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
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
                case 'RDWARNINGINFO': //警示信息
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_warninginfo_ctrl/warningInfoCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_warninginfo_tpl/warningInfoTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'RDTRAFFICSIGNAL':
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_trafficSignal_ctrl/trafficSignalCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_trafficSignal_tpl/trafficSignalTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'RDDIRECTROUTE': //顺行
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_directroute_ctrl/directRouteCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_directroute_tpl/directRouteTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'RDSPEEDBUMP': //减速带
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_speedbump_ctrl/speedBumpCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_speedbump_tpl/speedBumpTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'RDSE': //分叉口
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_se_ctrl/rdSeCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_se_tpl/rdSeTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'RDTOLLGATE': //收费站
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_tollgate_ctrl/tollGateCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_tollgate_tpl/tollGateTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case 'RDVARIABLESPEED': //可变限速;
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "改关联退出线和接续线",
                            'type': "MODIFYVARIABLESPEED",
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
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_variableSpeed_ctrl/variableSpeedCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_variableSpeed_tpl/variableSpeed.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case 'RDELECTRONICEYE':
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "改关联Link",
                            'type': "MODIFYOUTLINE",
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-record'></a>",
                            'title': "改点位",
                            'type': "MODIFYNODE",
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-pencil'></a>",
                            'title': "增加配对关系",
                            'type': "ADDPAIRBOND",
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
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_electronic_ctrl/electronicEyeCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_electronic_tpl/electronicEyeTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case 'RDSLOPE':
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "改退出线",
                            'type': "MODIFYLINKPID",
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-pencil'></a>",
                            'title': "改连续Link",
                            'type': "MODIFYLINKPIDS",
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
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_rdSlope_ctrl/rdSlopeCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_rdSlope_tpl/rdSlopeTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case 'RDINTER':
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "增加点",
                            'type': "ADDRDINTERPART",
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-pencil'></a>",
                            'title': "取消点",
                            'type': "DELETERDINTERPART",
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
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_rdcrf_ctrl/crfInterCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_rdcrf_tpl/crfInterTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case 'RDROAD':
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "增加线",
                            'type': "ADDRDROADLINK",
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }, {
                            'text': "<a class='glyphicon glyphicon-pencil'></a>",
                            'title': "取消线",
                            'type': "DELETERDROADLINK",
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
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_rdcrf_ctrl/crfRoadCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_rdcrf_tpl/crfRoadTpl.html";
                    $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case 'RDGATE':  //大门
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_gate_ctrl/rdGateCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_gate_tpl/rdGateTpl.html";
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
                case "LUNODE":
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "移动LUNODE点",
                            'type': "PATHNODEMOVE",
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }]
                    };
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_lu_ctrl/luNodeCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_lu_tpl/luNodeTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "LUNODE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "LUFACE":
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_lu_ctrl/luFaceCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_lu_tpl/luFaceTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "LUFACE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case "LULINK":
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
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_lu_ctrl/luLinkCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_lu_tpl/luLinkTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "LULINK", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "LCNODE":
                    toolsObj = {
                        items: [{
                            'text': "<a class='glyphicon glyphicon-move'></a>",
                            'title': "移动LCNODE点",
                            'type': "PATHNODEMOVE",
                            'class': "feaf",
                            callback: $scope.modifyTools
                        }]
                    };
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_lc_ctrl/lcNodeCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_lc_tpl/lcNodeTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "LCNODE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "LCLINK":
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
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_lc_ctrl/lcLinkCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_lc_tpl/lcLinkTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "LCLINK", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml,toolsObj);
                    break;
                case "LCFACE":
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_lc_ctrl/lcFaceCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_lc_tpl/lcFaceTpl.html";
                    $scope.getFeatDataCallback(data, data.id, "LCFACE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                    break;
                case "IXPOI":
                    $scope.$parent.$parent.$parent.$parent.$parent.selectPoiInMap = true;//表示poi是从地图上选中的

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
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            $scope.getFeatDataCallback(result, result.wID[0].id ? result.wID[0].id : '', "RDWARNINGINFO", appPath.road + "ctrls/attr_warninginfo_ctrl/warningInfoCtrl", appPath.root + appPath.road + "tpls/attr_warninginfo_tpl/warningInfoTpl.html");
                                        }
                                    }
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
                            case "1109": //电子眼
                                var ctrlAndTplOfTraffic = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function() {
                                        if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                            $scope.getFeatDataCallback(result, result.in.id ? result.in.id : '', "RDELECTRONICEYE", appPath.road + "ctrls/attr_electronic_ctrl/electronicEyeCtrl", appPath.root + appPath.road + "tpls/attr_electronic_tpl/electronicEyeTpl.html");
                                        }
                                    }
                                };
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfTraffic);
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
         * 修改点限速方向
         * @param direct
         * @returns {*}
         */
        $scope.changeSpeedDirect = function(direct) {
            var orientation;
            switch (direct) {
                case 0: //无方向
                    orientation = 2;
                    break;
                case 2: //顺方向
                    orientation = 3;
                    break;
                case 3: //逆方向
                    orientation = 2;
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
                        tooltipsCtrl.setChangeInnerHtml("点击继续增加形状点或按Esc/space取消或保存操作!");
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
                }else if (type === "TRANSFORMDIRECT") {
                    if (selectCtrl.selectedFeatures) {
                        if(selectCtrl.selectedFeatures.type == "Marker"){
                            selectCtrl.selectedFeatures["direct"] = $scope.changeSpeedDirect(selectCtrl.selectedFeatures["direct"]);
                        }else {
                            selectCtrl.selectedFeatures["direct"] = $scope.changeDirect(selectCtrl.selectedFeatures["direct"]);
                        }
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
                } else if (type === "ADDPAIRBOND") {    //配对电子眼
                    eventController.off(eventController.eventTypes.GETRELATIONID);
                    map.currentTool = new fastmap.uikit.SelectRelation({
                        map: map,
                        relationFlag: true
                    });
                    map.currentTool.enable();
                    editLayer.bringToBack();
                    tooltipsCtrl.setCurrentTooltip('请选择配对的电子眼！');
                    eventController.on(eventController.eventTypes.GETRELATIONID, function(data){
                        $scope.selectedFeature = data;
                        $scope.$emit("SWITCHCONTAINERSTATE", {
                            "subAttrContainerTpl": false
                        });
                        //清除上一个选择的高亮
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        dsEdit.getByPid(data.id.toString(),'RDELECTRONICEYE').then(function(elecData){
                            if(objCtrl.data.kind == 20 && elecData.kind == 21) {
                                featCodeCtrl.setFeatCode({
                                    "startPid": objCtrl.data.pid.toString(),
                                    "endPid": data.id.toString()
                                });
                            } else if (objCtrl.data.kind == 21 && elecData.kind == 20) {
                                featCodeCtrl.setFeatCode({
                                    "startPid": data.id.toString(),
                                    "endPid": objCtrl.data.pid.toString()
                                });
                            } else {
                                swal("操作失败", '请选择电子眼类型为“区间测速开始”和“区间测速结束”！', "warning");
                                return;
                            }
                            //设置热键修改时的监听类型;
                            shapeCtrl.setEditingType("ADDELECTRONICGROUP");
                            //退出线选完后的鼠标提示;
                            tooltipsCtrl.setCurrentTooltip('点击空格新增区间从测速电子眼组成！');
                        });
                    });
                    return;
                } else if (type === "PATHNODEMOVE") {
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('pathNodeMove');
                        tooltipsCtrl.setCurrentTooltip('开始移动node！');
                        tooltipsCtrl.setChangeInnerHtml("按Esc/space取消或保存操作!");
                    } else {
                        tooltipsCtrl.setCurrentTooltip('正要开始移动node,先选择node！');
                        return;
                    }
                } else if (type === "TRANSFORMSPEEDDIRECT") {
                    map.currentTool = shapeCtrl.getCurrentTool();
                    map.currentTool.disable();
                    var containerPoint;
                    dsEdit.getByPid(objCtrl.data.linkPid,"RDLINK").then(function (data) {
                        if (data) {
                            var endNum = parseInt(data.geometry.coordinates.length / 2);
                            var point = {
                                x: data.geometry.coordinates[0][0],
                                y: data.geometry.coordinates[0][1]
                            };
                            var pointVertex = {
                                x: data.geometry.coordinates[endNum][0],
                                y: data.geometry.coordinates[endNum][1]
                            };
                            containerPoint = map.latLngToContainerPoint([point.y, point.x]);
                            pointVertex = map.latLngToContainerPoint([pointVertex.y, pointVertex.x]);
                            var angle = $scope.angleOfLink(containerPoint, pointVertex);
                            if(parseInt(objCtrl.data.direct) ==3) {
                                angle = angle + Math.PI;
                            }
                            var marker = {
                                flag: false,
                                pid: objCtrl.data.pid,
                                point: point,
                                type: "marker",
                                angle: angle,
                                orientation: objCtrl.data.direct.toString()
                            };
                            var editLayer = layerCtrl.getLayerById('edit');
                            layerCtrl.pushLayerFront('edit');
                            var sobj = shapeCtrl.shapeEditorResult;
                            editLayer.drawGeometry = marker;
                            editLayer.draw(marker, editLayer);
                            sobj.setOriginalGeometry(marker);
                            sobj.setFinalGeometry(marker);
                            shapeCtrl.setEditingType("transformSpeedDirect");
                            shapeCtrl.startEditing();
                            tooltipsCtrl.setCurrentTooltip('点击方向图标开始修改方向！');
                            eventController.off(eventController.eventTypes.DIRECTEVENT);
                            eventController.on(eventController.eventTypes.DIRECTEVENT,function(event){
                                featCodeCtrl.setFeatCode({
                                    pid: objCtrl.data.pid,
                                    direct:parseInt(event.geometry.orientation)
                                });
                            })
                        }
                    });
                    return;
                } else if (type === "MODIFYSPEEDNODE") {
                    var pid = parseInt(selectCtrl.selectedFeatures.id),
                        linkPid = parseInt(selectCtrl.selectedFeatures.linkPid);

                    if (shapeCtrl.shapeEditorResult) {
                        shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point($scope.selectedFeature.event.latlng.lng, $scope.selectedFeature.event.latlng.lat)]));
                        selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                        layerCtrl.pushLayerFront('edit');
                    }
                    shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
                    shapeCtrl.startEditing();
                    map.currentTool = shapeCtrl.getCurrentTool();
                    map.currentTool.enable();
                    map.currentTool.snapHandler.addGuideLayer(rdLink);
                    tooltipsCtrl.setEditEventType('pointVertexAdd');
                    tooltipsCtrl.setCurrentTooltip('请选择新的位置点！');
                    tooltipsCtrl.setStyleTooltip("color:black;");
                    eventController.off(eventController.eventTypes.RESETCOMPLETE);
                    eventController.on(eventController.eventTypes.RESETCOMPLETE, function(e) {
                        var pro = e.property;
                        var actualDistance = transform.distance($scope.selectedFeature.event.latlng.lat,$scope.selectedFeature.event.latlng.lng,shapeCtrl.shapeEditorResult.getFinalGeometry().y,shapeCtrl.shapeEditorResult.getFinalGeometry().x);
                        if(actualDistance > 15){
                            swal("操作失败", '移动距离必须小于15米！', "warning");
                            return;
                        }else {
                            dsEdit.getByPid(pro.id, "RDLINK").then(function(data) {
                                if (data) {
                                    var point = $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry());
                                    var speedData = {
                                        pid: pid,
                                        longitude:point.x,
                                        latitude:point.y,
                                        objStatus: "UPDATE"
                                    };
                                    if(parseInt(pro.id) != linkPid){
                                        speedData.linkPid = parseInt(pro.id);
                                    }
                                    selectCtrl.onSelected({
                                        geometry: data.geometry.coordinates,
                                        id: data.pid,
                                        direct: pro.direct,
                                        point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                                    });
                                    shapeCtrl.shapeEditorResult.setFinalGeometry(speedData);
                                    shapeCtrl.setEditingType('updateSpeedNode');
                                    tooltipsCtrl.setCurrentTooltip('点击空格键保存操作或者按ESC键取消!');
                                }
                            })
                        }
                    });
                    return;
                } else if (type === "MODIFYNODE") {
                    if (shapeCtrl.shapeEditorResult) {
                        shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)]));
                        selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                        layerCtrl.pushLayerFront('edit');
                    }
                    shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
                    shapeCtrl.startEditing();
                    map.currentTool = shapeCtrl.getCurrentTool();
                    map.currentTool.enable();
                    map.currentTool.snapHandler.addGuideLayer(rdLink);
                    tooltipsCtrl.setEditEventType('pointVertexAdd');
                    tooltipsCtrl.setCurrentTooltip('请选择电子眼位置点！');
                    tooltipsCtrl.setStyleTooltip("color:black;");
                    eventController.off(eventController.eventTypes.RESETCOMPLETE);
                    eventController.on(eventController.eventTypes.RESETCOMPLETE, function(e) {
                        var pro = e.property;
                        var actualDistance = transform.distance($scope.selectedFeature.event.latlng.lat,$scope.selectedFeature.event.latlng.lng,shapeCtrl.shapeEditorResult.getFinalGeometry().y,shapeCtrl.shapeEditorResult.getFinalGeometry().x);
                        if(actualDistance > 100){
                            swal("操作失败", '移动距离必须小于100米！', "warning");
                            return;
                        }else{
                            dsEdit.getByPid(pro.id, "RDLINK").then(function(data) {
                                if (data) {
                                    featCodeCtrl.setFeatCode({
                                        "linkPid": data.pid.toString(),
                                        "pid": objCtrl.data.pid.toString(),
                                        "longitude": shapeCtrl.shapeEditorResult.getFinalGeometry().x,
                                        "latitude": shapeCtrl.shapeEditorResult.getFinalGeometry().y
                                    });
                                    selectCtrl.onSelected({
                                        geometry: data.geometry.coordinates,
                                        id: data.pid,
                                        direct: pro.direct,
                                        point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                                    });
                                    shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                    tooltipsCtrl.setCurrentTooltip('请点击空格,移动电子眼点位!');
                                    shapeCtrl.setEditingType('updateElecNode');
                                }
                            })
                        }
                    });
                    return;
                } else if (type === "MODIFYOUTLINE") {
                    map.currentTool = new fastmap.uikit.SelectPath({
                        map: map,
                        currentEditLayer: rdLink,
                        linksFlag: true,
                        shapeEditor: shapeCtrl
                    });
                    map.currentTool.enable();
                    tooltipsCtrl.setCurrentTooltip('开始修改关联Link！');
                    eventController.on(eventController.eventTypes.GETLINKID, function(data) {
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        //退出线;
                        highRenderCtrl.highLightFeatures.push({
                            id: data.id,
                            layerid: 'rdLink',
                            type: 'line',
                            style: {}
                        });
                        //绘制当前的退出线
                        highRenderCtrl.drawHighlight();
                        //设置热键修改时的监听类型;
                        shapeCtrl.setEditingType("UPDATEELECTRONICEYE");
                        //退出线选完后的鼠标提示;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！');
                        //设置修改确认的数据;
                        featCodeCtrl.setFeatCode({
                            "linkPid": data.id.toString(),
                            "pid": objCtrl.data.pid.toString(),
                            "objStatus": "UPDATE"
                        });
                    });
                    return;
                }  else if (type === "MODIFYLINKPID") {
                    map.currentTool = new fastmap.uikit.SelectPath({
                        map: map,
                        currentEditLayer: rdLink,
                        linksFlag: true,
                        shapeEditor: shapeCtrl
                    });
                    map.currentTool.enable();

                    var selData = objCtrl.data;

                    var comPids = [];
                    var slopeVias = selData.slopeVias;
                    slopeVias.sort(function (a, b) {
                        return a.seqNum < b.seqNum ? -1 : 1;
                    });
                    var conLinkPids = [];
                    var param1 = {};
                    param1["dbId"] = App.Temp.dbId;
                    param1["type"] = "RDLINK";
                    param1["data"] = {
                        "nodePid": selData.nodePid
                    };
                    if(slopeVias && slopeVias.length >= 0) {
                        for (var i = 0; i < slopeVias.length; i++) {
                            if(conLinkPids.indexOf(slopeVias[i].linkPid) < 0){
                                conLinkPids.push(slopeVias[i].linkPid);
                            }
                        }
                    }
                    dsEdit.getByCondition(param1).then(function (exLinks) {//退出线操作
                        if (exLinks.errcode === -1) {
                            return;
                        }
                        if (exLinks.data) {
                            if (exLinks.data.length == 1) {
                                swal("无法改退出线", "此进入点只有一条可选退出线！", "info");
                                return;
                            } else if (exLinks.data.length == 2) {
                                comPids = [];
                                comPids.push(exLinks.data[0].pid);
                                comPids.push(exLinks.data[1].pid);
                                if(exLinks.data[0].pid == selData.linkPid){
                                    highRenderCtrl.highLightFeatures.push({
                                        id: exLinks.data[1].pid,
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {color: '#FF79BC'}
                                    });
                                } else {
                                    highRenderCtrl.highLightFeatures.push({
                                        id: exLinks.data[0].pid,
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {color: '#FF79BC'}
                                    });
                                }
                                highRenderCtrl.drawHighlight();
                            }
                        }
                    });
                    tooltipsCtrl.setCurrentTooltip('请选择新的退出线！');
                    eventController.on(eventController.eventTypes.GETLINKID, function(data) {
                        if(comPids.indexOf(parseInt(data.id)) > -1){
                            highRenderCtrl._cleanHighLight();
                            highRenderCtrl.highLightFeatures = [];
                            highRenderCtrl.highLightFeatures.push({
                                id: selData.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'rdnode',
                                style: {}
                            });
                            highRenderCtrl.highLightFeatures.push({
                                id: data.id,
                                layerid: 'rdLink',
                                type: 'line',
                                style: {color: 'red'}
                            });
                            highRenderCtrl.drawHighlight();
                            shapeCtrl.setEditingType("UPDATERDSLOPE");   //设置热键修改时的监听类型;
                            tooltipsCtrl.setCurrentTooltip('点击空格保存修改！');     //退出线选完后的鼠标提示;


                            featCodeCtrl.setFeatCode({  //设置修改确认的数据;
                                "linkPid": data.id.toString(),
                                "linkPids":conLinkPids,
                                "objStatus": "UPDATE"
                            });
                        }
                    });
                    return;
                }else if (type === "MODIFYLINKPIDS") {
                    map.currentTool = new fastmap.uikit.SelectPath({
                        map: map,
                        currentEditLayer: rdLink,
                        linksFlag: true,
                        shapeEditor: shapeCtrl
                    });
                    map.currentTool.enable();

                    var selData = objCtrl.data;
                    var slopeVias = selData.slopeVias;
                    slopeVias.sort(function (a, b) {
                        return a.seqNum < b.seqNum ? -1 : 1;
                    });
                    var linkNodePid = null;
                    var comPids = [];
                    var conLinkPids = [];
                    var linkDetail = null;
                    if(slopeVias && slopeVias.length == 0){//没有连续link
                        dsEdit.getByPid(parseInt(selData.linkPid), "RDLINK").then(function (exLinkDetail) {   //查询退出线的详情
                            var param1 = {};
                            param1["dbId"] = App.Temp.dbId;
                            param1["type"] = "RDLINK";
                            if (exLinkDetail.sNodePid == selData.nodePid) {
                                param1["data"] = {
                                    "nodePid": exLinkDetail.eNodePid
                                };
                            } else {
                                param1["data"] = {
                                    "nodePid": exLinkDetail.sNodePid
                                };
                            }
                            dsEdit.getByCondition(param1).then(function (conLinks) {//找出退出线另一个节点的挂接线
                                if (conLinks.errcode === -1) {
                                    return;
                                }
                                if (conLinks.data) {
                                    if(conLinks.data.length > 2){
                                        swal("无法改连续Link", "此退出线挂接Link个数大于2！", "info");
                                        return;
                                    } else if(conLinks.data.length == 2){
                                        comPids = [];
                                        comPids.push(conLinks.data[0].pid);
                                        comPids.push(conLinks.data[1].pid);
                                        tooltipsCtrl.setCurrentTooltip('请添加连续Link！');
                                    }
                                }
                            });
                        })
                    } else if(slopeVias && slopeVias.length > 0){
                        for(var i = 0; i<slopeVias.length; i++){
                            if(conLinkPids.indexOf(slopeVias[i].linkPid) < 0){
                                conLinkPids.push(slopeVias[i].linkPid);
                            }
                        }
                        //下面是查询最后一条连续link的前面一条link的详情，以确定最后一条连续link的哪个点是要查询的挂接点
                        if(slopeVias.length == 1){
                            dsEdit.getByPid(parseInt(selData.linkPid), "RDLINK").then(function (exLinkDetail) {   //查询退出线的详情
                                linkDetail = exLinkDetail;
                                //查询最后一条连续link的详情，并选择出要查询的挂接点
                                dsEdit.getByPid(parseInt(slopeVias[slopeVias.length-1].linkPid), "RDLINK").then(function (newLinkDetail) {
                                    if(newLinkDetail.eNodePid != linkDetail.eNodePid && newLinkDetail.eNodePid != linkDetail.sNodePid){
                                        linkNodePid = newLinkDetail.eNodePid;
                                    } else {
                                        linkNodePid = newLinkDetail.sNodePid;
                                    }
                                    var param = {};
                                    param["dbId"] = App.Temp.dbId;
                                    param["type"] = "RDLINK";
                                    param["data"] = {
                                        "nodePid": linkNodePid
                                    };
                                    dsEdit.getByCondition(param).then(function (conLinks) {//找出连续link另一个节点的挂接线
                                        if (conLinks.errcode === -1) {
                                            return;
                                        }
                                        if (conLinks.data) {
                                            if(conLinks.data.length > 2 || conLinks.data.length == 1){
                                                comPids = [];
                                                tooltipsCtrl.setCurrentTooltip('请删除连续Link！');
                                            } else if(conLinks.data.length == 2){
                                                comPids = [];
                                                comPids.push(conLinks.data[0].pid);
                                                comPids.push(conLinks.data[1].pid);
                                                tooltipsCtrl.setCurrentTooltip('请修改连续Link！');
                                            }
                                        }
                                    });
                                })
                            })
                        } else {
                            dsEdit.getByPid(parseInt(slopeVias[slopeVias.length-2].linkPid), "RDLINK").then(function (conLinkDetail) {   //查询倒数第二条连续link的详情
                                linkDetail = conLinkDetail;
                                //查询最后一条连续link的详情，并选择出要查询的挂接点
                                dsEdit.getByPid(parseInt(slopeVias[slopeVias.length-1].linkPid), "RDLINK").then(function (newLinkDetail) {
                                    if(newLinkDetail.eNodePid != linkDetail.eNodePid && newLinkDetail.eNodePid != linkDetail.sNodePid){
                                        linkNodePid = newLinkDetail.eNodePid;
                                    } else {
                                        linkNodePid = newLinkDetail.sNodePid;
                                    }
                                    var param = {};
                                    param["dbId"] = App.Temp.dbId;
                                    param["type"] = "RDLINK";
                                    param["data"] = {
                                        "nodePid": linkNodePid
                                    };
                                    dsEdit.getByCondition(param).then(function (conLinks) {//找出连续link另一个节点的挂接线
                                        if (conLinks.errcode === -1) {
                                            return;
                                        }
                                        if (conLinks.data) {
                                            if(conLinks.data.length > 2 || conLinks.data.length == 1){
                                                comPids = [];
                                                tooltipsCtrl.setCurrentTooltip('请删除连续Link！');
                                            } else if(conLinks.data.length == 2){
                                                comPids = [];
                                                comPids.push(conLinks.data[0].pid);
                                                comPids.push(conLinks.data[1].pid);
                                                tooltipsCtrl.setCurrentTooltip('请修改连续Link！');
                                            }
                                        }
                                    });
                                })
                            })
                        }
                    }

                    eventController.on(eventController.eventTypes.GETLINKID, function(data) {
                        if(comPids && comPids.indexOf(parseInt(data.id)) > -1){//添加连续link
                            if(conLinkPids.indexOf(parseInt(data.id)) < 0){
                                conLinkPids.push(parseInt(data.id));
                            }
                            highRenderCtrl.highLightFeatures.push({
                                id: data.id,
                                layerid: 'rdLink',
                                type: 'line',
                                style: {color: '#FF79BC'}
                            });
                            highRenderCtrl.drawHighlight();
                            dsEdit.getByPid(parseInt(data.id), "RDLINK").then(function (newLinkDetail) {//保持linkNodePid是最后一个挂接点
                                if(newLinkDetail.eNodePid == linkNodePid){
                                    linkNodePid = newLinkDetail.sNodePid;
                                } else {
                                    linkNodePid = newLinkDetail.eNodePid;
                                }
                                var param = {};
                                param["dbId"] = App.Temp.dbId;
                                param["type"] = "RDLINK";
                                param["data"] = {
                                    "nodePid": linkNodePid
                                };
                                dsEdit.getByCondition(param).then(function (conLinks) {//找出连续link另一个节点的挂接线
                                    if (conLinks.errcode === -1) {
                                        return;
                                    }
                                    if (conLinks.data) {
                                        if(conLinks.data.length > 2 || conLinks.data.length == 1){
                                            comPids = [];
                                            tooltipsCtrl.setCurrentTooltip('请删除连续Link！');
                                        } else if(conLinks.data.length == 2){
                                            comPids = [];
                                            comPids.push(conLinks.data[0].pid);
                                            comPids.push(conLinks.data[1].pid);
                                            tooltipsCtrl.setCurrentTooltip('请修改连续Link！');
                                        }
                                    }
                                });
                            });
                        } else if(conLinkPids && conLinkPids[conLinkPids.length - 1] == (parseInt(data.id))){//删除最后一条连续link
                            conLinkPids.pop();
                            highRenderCtrl._cleanHighLight();
                            for(var i = 0;i<highRenderCtrl.highLightFeatures.length;i++){
                                if(highRenderCtrl.highLightFeatures[i].id == data.id){
                                    highRenderCtrl.highLightFeatures.splice(i,1);
                                    i--;
                                }
                            }
                            highRenderCtrl.drawHighlight();
                            //下面是查询最后一条连续link的前面一条link的详情，以确定最后一条连续link的哪个点是要查询的挂接点
                            if(conLinkPids.length == 1){
                                dsEdit.getByPid(parseInt(selData.linkPid), "RDLINK").then(function (exLinkDetail) {   //查询退出线的详情
                                    linkDetail = exLinkDetail;
                                })
                            } else {
                                dsEdit.getByPid(parseInt(conLinkPids[conLinkPids.length-2]), "RDLINK").then(function (conLinkDetail) {   //查询倒数第二条连续link的详情
                                    linkDetail = conLinkDetail;
                                })
                            }
                            //查询最后一条连续link的详情，并选择出要查询的挂接点
                            dsEdit.getByPid(parseInt(conLinkPids[conLinkPids.length-1]), "RDLINK").then(function (newLinkDetail) {
                                if(newLinkDetail.eNodePid != linkDetail.eNodePid && newLinkDetail.eNodePid != linkDetail.sNodePid){
                                    linkNodePid = newLinkDetail.eNodePid;
                                } else {
                                    linkNodePid = newLinkDetail.sNodePid;
                                }
                                var param = {};
                                param["dbId"] = App.Temp.dbId;
                                param["type"] = "RDLINK";
                                param["data"] = {
                                    "nodePid": linkNodePid
                                };
                                dsEdit.getByCondition(param).then(function (conLinks) {//找出连续link另一个节点的挂接线
                                    if (conLinks.errcode === -1) {
                                        return;
                                    }
                                    if (conLinks.data) {
                                        if(conLinks.data.length > 2 || conLinks.data.length == 1){
                                            comPids = [];
                                            tooltipsCtrl.setCurrentTooltip('请删除连续Link！');
                                        } else if(conLinks.data.length == 2){
                                            comPids = [];
                                            comPids.push(conLinks.data[0].pid);
                                            comPids.push(conLinks.data[1].pid);
                                            tooltipsCtrl.setCurrentTooltip('请修改连续Link！');
                                        }
                                    }
                                });
                            })
                        }
                        shapeCtrl.setEditingType("UPDATERDSLOPE");
                        //退出线选完后的鼠标提示;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！');
                        //设置修改确认的数据;
                        featCodeCtrl.setFeatCode({
                            "linkPid": selData.linkPid.toString(),
                            "linkPids":conLinkPids,
                            "objStatus": "UPDATE"
                        });
                    });
                    return;
                } else if (type === "ADDRDINTERPART") {
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [rdNode],
                        snapLayers: [rdNode]//将rdnode放前面，优先捕捉
                    });
                    map.currentTool.enable();

                    var selData = objCtrl.data;

                    var linkPids = [];
                    var nodePids = [];
                    var links = selData.links;
                    var nodes = selData.nodes;

                    if(links && links.length >= 0) {
                        for (var i = 0; i < links.length; i++) {
                            if(linkPids.indexOf(links[i].linkPid) < 0){
                                linkPids.push(links[i].linkPid);
                            }
                        }
                    }
                    if(nodes && nodes.length >= 0) {
                        for (var i = 0; i < nodes.length; i++) {
                            if(nodePids.indexOf(nodes[i].nodePid) < 0){
                                nodePids.push(nodes[i].nodePid);
                            }
                        }
                    }
                    tooltipsCtrl.setCurrentTooltip('请选择需要增加的点！');
                    eventController.on(eventController.eventTypes.GETFEATURE, function(data) {
                        highRenderCtrl._cleanHighLight();
                        if(data.optype == "RDNODE"){
                            if(nodePids.indexOf(parseInt(data.id)) < 0){
                                var param1 = {};
                                param1["dbId"] = App.Temp.dbId;
                                param1["type"] = "RDLINK";
                                param1["data"] = {
                                    "nodePid": parseInt(data.id)
                                };
                                dsEdit.getByCondition(param1).then(function (exLinks) {
                                    if (exLinks.errcode === -1) {
                                        return;
                                    }
                                    if (exLinks.data) {
                                        for (var i = 0;i<exLinks.data.length;i++){
                                            if(linkPids.indexOf(exLinks.data[i].pid) > -1){//某一条挂接link在crf里
                                                nodePids.push(parseInt(data.id));
                                                highRenderCtrl.highLightFeatures.push({
                                                    id: data.id.toString(),
                                                    layerid: 'rdLink',
                                                    type: 'node',
                                                    style: {
                                                        color: '#02F78E'
                                                    }
                                                });
                                                highRenderCtrl.drawHighlight();
                                            } else {
                                                dsEdit.getByPid(exLinks.data[i].pid,"RDLINK").then(function (linkData) {
                                                    if((nodePids.indexOf(linkData.eNodePid) >-1 && linkData.eNodePid!=parseInt(data.id)) || (nodePids.indexOf(linkData.sNodePid) >-1  && linkData.sNodePid!=parseInt(data.id))){//线正好是中间部分,把线也加入
                                                        nodePids.push(parseInt(data.id));
                                                        highRenderCtrl.highLightFeatures.push({
                                                            id: data.id.toString(),
                                                            layerid: 'rdLink',
                                                            type: 'node',
                                                            style: {
                                                                color: '#02F78E'
                                                            }
                                                        });
                                                        linkPids.push(linkData.pid);
                                                        highRenderCtrl.highLightFeatures.push({
                                                            id: linkData.pid.toString(),
                                                            layerid: 'rdLink',
                                                            type: 'line',
                                                            style: {
                                                                color: '#D9B300'
                                                            }
                                                        });
                                                    }
                                                    highRenderCtrl.drawHighlight();
                                                })
                                            }
                                        }
                                    }

                                });
                            }
                        }

                        shapeCtrl.setEditingType("UPDATEINTER");   //设置热键修改时的监听类型;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！');     //退出线选完后的鼠标提示;

                        featCodeCtrl.setFeatCode({  //设置修改确认的数据;
                            "pid": selData.pid,
                            "nodes": nodePids,
                            "links":linkPids,
                            "objStatus": "UPDATE"
                        });
                    });
                    return;
                } else if (type === "DELETERDINTERPART") {
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [crfData],
                        snapLayers: [crfData]//将rdnode放前面，优先捕捉
                    });
                    map.currentTool.enable();

                    var selData = objCtrl.data;
                    var linkPids = [];
                    var nodePids = [];
                    var links = selData.links;
                    var nodes = selData.nodes;

                    if(links && links.length >= 0) {
                        for (var i = 0; i < links.length; i++) {
                            if(linkPids.indexOf(links[i].linkPid) < 0){
                                linkPids.push(links[i].linkPid);
                            }
                        }
                    }
                    if(nodes && nodes.length >= 0) {
                        for (var i = 0; i < nodes.length; i++) {
                            if(nodePids.indexOf(nodes[i].nodePid) < 0){
                                nodePids.push(nodes[i].nodePid);
                            }
                        }
                    }
                    tooltipsCtrl.setCurrentTooltip('请选择需要删除的点！');
                    eventController.on(eventController.eventTypes.GETFEATURE, function(data) {
                        highRenderCtrl._cleanHighLight();
                        if(data.optype == "RDINTER"){
                            if(data.origType == "Point"){
                                if(nodePids.indexOf(parseInt(data.nodeId)) > -1){
                                    nodePids.splice(nodePids.indexOf(parseInt(data.nodeId)),1);
                                    for(var i = 0;i<highRenderCtrl.highLightFeatures.length;i++){
                                        if(highRenderCtrl.highLightFeatures[i].id == data.nodeId){
                                            highRenderCtrl.highLightFeatures.splice(i,1);
                                            i--;
                                        }
                                    }
                                    var param = {};
                                    param["dbId"] = App.Temp.dbId;
                                    param["type"] = "RDLINK";
                                    param["data"] = {
                                        "nodePid": parseInt(data.nodeId)
                                    };
                                    dsEdit.getByCondition(param).then(function (conLinks) {//找出所有的挂接线，删除存在于范围内的
                                        highRenderCtrl._cleanHighLight();
                                        if (conLinks.errcode === -1) {
                                            return;
                                        }
                                        if (conLinks.data) {
                                            for (var i = 0 ;i<conLinks.data.length;i++){
                                                if(linkPids.indexOf(conLinks.data[i].pid) > -1){
                                                    linkPids.splice(linkPids.indexOf(conLinks.data[i].pid),1);
                                                    for(var j = 0;j<highRenderCtrl.highLightFeatures.length;j++){
                                                        if(highRenderCtrl.highLightFeatures[j].id == conLinks.data[i].pid){
                                                            highRenderCtrl.highLightFeatures.splice(j,1);
                                                            j--;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        highRenderCtrl.drawHighlight();
                                    });
                                }
                            }
                        }
                        highRenderCtrl.drawHighlight();
                        shapeCtrl.setEditingType("UPDATEINTER");   //设置热键修改时的监听类型;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！');     //退出线选完后的鼠标提示;

                        featCodeCtrl.setFeatCode({  //设置修改确认的数据;
                            "pid": selData.pid,
                            "nodes": nodePids,
                            "links":linkPids,
                            "objStatus": "UPDATE"
                        });
                    });
                    return;
                } else if (type === "ADDRDROADLINK") {
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [rdLink],
                        snapLayers: [rdLink]
                    });
                    map.currentTool.enable();

                    var selData = objCtrl.data;
                    var linkPids = [];
                    var links = selData.links;
                    if(links && links.length >= 0) {
                        for (var i = 0; i < links.length; i++) {
                            if(linkPids.indexOf(links[i].linkPid) < 0){
                                linkPids.push(links[i].linkPid);
                            }
                        }
                    }
                    tooltipsCtrl.setCurrentTooltip('请选择需要增加的线！');
                    eventController.on(eventController.eventTypes.GETFEATURE, function(data) {
                        highRenderCtrl._cleanHighLight();
                        if(data.optype == "RDLINK"){
                            if(linkPids.indexOf(parseInt(data.id)) < 0){
                                linkPids.push(parseInt(data.id));
                                highRenderCtrl.highLightFeatures.push({
                                    id: data.id.toString(),
                                    layerid: 'rdLink',
                                    type: 'line',
                                    style: {
                                        color: '#D9B300'
                                    }
                                });
                            }
                        }
                        highRenderCtrl.drawHighlight();
                        shapeCtrl.setEditingType("UPDATERDROAD");   //设置热键修改时的监听类型;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！');     //退出线选完后的鼠标提示;

                        featCodeCtrl.setFeatCode({  //设置修改确认的数据;
                            "pid": selData.pid,
                            "linkPids":linkPids,
                            "objStatus": "UPDATE"
                        });
                    });
                    return;
                } else if (type === "DELETERDROADLINK") {
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [crfData],
                        snapLayers: [crfData]//将rdnode放前面，优先捕捉
                    });
                    map.currentTool.enable();

                    var selData = objCtrl.data;
                    var linkPids = [];
                    var links = selData.links;

                    if(links && links.length >= 0) {
                        for (var i = 0; i < links.length; i++) {
                            if(linkPids.indexOf(links[i].linkPid) < 0){
                                linkPids.push(links[i].linkPid);
                            }
                        }
                    }

                    tooltipsCtrl.setCurrentTooltip('请选择需要删除的线！');
                    eventController.on(eventController.eventTypes.GETFEATURE, function(data) {
                        highRenderCtrl._cleanHighLight();
                        if(data.optype == "RDROAD"){
                            if(linkPids.indexOf(parseInt(data.linkId)) > -1){
                                linkPids.splice(linkPids.indexOf(parseInt(data.linkId)),1);
                                for(var i = 0;i<highRenderCtrl.highLightFeatures.length;i++){
                                    if(highRenderCtrl.highLightFeatures[i].id == data.linkId){
                                        highRenderCtrl.highLightFeatures.splice(i,1);
                                        i--;
                                    }
                                }
                            }
                        }
                        highRenderCtrl.drawHighlight();
                        shapeCtrl.setEditingType("UPDATERDROAD");   //设置热键修改时的监听类型;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！');     //退出线选完后的鼠标提示;

                        featCodeCtrl.setFeatCode({  //设置修改确认的数据;
                            "pid": selData.pid,
                            "linkPids":linkPids,
                            "objStatus": "UPDATE"
                        });
                    });
                    return;
                } else if (type.indexOf('BRANCH') > -1 ) {
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
                } else if (type === "MODIFYVARIABLESPEED") {
                    //地图编辑相关设置;
                    map.currentTool = new fastmap.uikit.SelectForRestriction({
                        map: map,
                        createBranchFlag: true,
                        currentEditLayer: rdLink,
                        shapeEditor: shapeCtrl,
                        operationList:['line','line']
                    });
                    map.currentTool.enable();
                    //热键操作设置;
                    shapeCtrl.setEditingType("UPDATEVARIABLESPEED");
                    //添加自动吸附的图层
                    map.currentTool.snapHandler.addGuideLayer(rdLink);
                    tooltipsCtrl.setEditEventType('rdvariable');
                    tooltipsCtrl.setCurrentTooltip('开始修改退出线和接续线！');
                    //可变限速当前数据模型的拷贝;
                    var tempObj = objCtrl.data.getIntegrate();
                    //将临时接续线对象数组改为pid的数组;
                    for(var i=0;i<tempObj.vias.length;i++){
                        tempObj.vias[i] = tempObj.vias[i].linkPid;
                    }
                    var tempOutLink = tempObj.outLinkPid;
                    //获取退出线是否满足条件;
                    $scope.getSelectLinkInfos = function(param){
                        var defer = $q.defer();
                        dsEdit.getByPid(param, "RDLINK").then(function(data) {
                            if(data){defer.resolve(data);}
                        })
                        return defer.promise;
                    }
                    $scope.isOutLink = function(dataId) {
                        var param = {};
                        param["dbId"] = App.Temp.dbId;
                        param["type"] = "RDLINK";
                        param["data"] = {"nodePid": tempObj.nodePid};
                        var defer = $q.defer();
                        //查进入点的关联link，如果所选的退出线不在里面，则提示错误;
                        dsEdit.getByCondition(param).then(function(linkData) {
                            if (linkData.errcode === -1) {return;}
                            var outlinks = [];
                            for(var i=0;i<linkData.data.length;i++){
                                outlinks.push(linkData.data[i].pid)
                            }
                            if(outlinks.indexOf(parseInt(dataId))==-1){
                                //如果不衔接;
                                defer.resolve(-1);
                            }else{
                                $scope.getSelectLinkInfos(dataId).then(function(outLinkData){
                                    //如果衔接;
                                    if(!outLinkData)return;
                                    if((tempObj.nodePid==outLinkData.sNodePid&&outLinkData.direct==2)||(tempObj.nodePid==outLinkData.eNodePid&&outLinkData.direct==3)||(outLinkData.direct==1)){
                                        /**
                                         * 如果衔接需要判断方向性;
                                         * (1)如果退出线的startNode==nodePid(进入点)&&退出出线为顺方向2  才满足;
                                         * (2)如果退出线的endNode==nodePid(进入点) && 退出线为逆方向3  才满足
                                         */
                                        defer.resolve(1);
                                    }else{
                                        defer.resolve(2);
                                    }
                                })
                            }
                        })
                        return defer.promise;
                    }
                    //获得退出线和接续线连接的节点;;
                    $scope.getOutLinkInfos = function(dataId) {
                        var defer = $q.defer();
                        dsEdit.getByPid(tempObj.outLinkPid, "RDLINK").then(function(data) {
                            var linknodePid = '';
                            if(data){
                                defer.resolve(data);
                            }
                        })
                        return defer.promise;
                    }
                    //判断接续线是否连接退出线;
                    $scope.isLinkedLinks = function(linknodePid,dataId){
                        var defer = $q.defer();
                        var param = {};
                        param["dbId"] = App.Temp.dbId;
                        param["type"] = "RDLINK";
                        param["data"] = {"nodePid": linknodePid};
                        dsEdit.getByCondition(param).then(function(linkData) {
                            if (linkData.errcode === -1) {return;}
                            var jointLinks = [];
                            for(var i=0;i<linkData.data.length;i++){
                                jointLinks.push(linkData.data[i].pid)
                            }
                            //如果不衔接;
                            if(jointLinks.indexOf(parseInt(dataId))==-1 || tempOutLink==dataId){
                                defer.resolve(-1);
                            } else{
                                $scope.getSelectLinkInfos(dataId).then(function(outLinkData){
                                    //如果衔接;
                                    if(!outLinkData)return;
                                    if((linknodePid==outLinkData.sNodePid&&outLinkData.direct==2)||(linknodePid==outLinkData.eNodePid&&outLinkData.direct==3)||(outLinkData.direct==1)){
                                        /**
                                         * 选择的接续线需要判断方向性;
                                         * (1)如果接续线的startNode==nodePid(进入点)&&接续线线为顺方向2  才满足;
                                         * (2)如果接续线的endNode==nodePid(进入点) && 接续线为逆方向3  才满足
                                         */
                                        defer.resolve(1);
                                    }else{
                                        defer.resolve(2);
                                    }
                                })
                                //defer.resolve(dataId);
                            }
                        })
                        return defer.promise;
                    }
                    eventController.off(eventController.eventTypes.GETLINKID);
                    eventController.on(eventController.eventTypes.GETLINKID, function(dataresult) {
                        //选择接续线;
                        $scope.getOutLinkInfos(dataresult.id)
                            .then(function(dataRes){
                                var linkData = (dataRes.sNodePid==tempObj.nodePid)?dataRes.eNodePid:dataRes.sNodePid;
                                $scope.isLinkedLinks(linkData,dataresult.id).then(function(status){
                                    /**
                                     * 如果多点的线与当前的退出线挂接，则提示继续选"接续线";
                                     * 否则判断是否为"退出线";否则选择失败
                                     */
                                    if(status==1){
                                        //直接点击接续线  如果已选过  则取消  如果没有则加入;
                                        if(tempObj.vias.indexOf(parseInt(dataresult.id))!=-1){
                                            tempObj.vias.splice(tempObj.vias.indexOf(parseInt(dataresult.id)), 1);
                                            for(var i=0;i<highRenderCtrl.highLightFeatures.length;i++){
                                                if(highRenderCtrl.highLightFeatures[i].id==parseInt(dataresult.id)){
                                                    highRenderCtrl.highLightFeatures.splice(i,1);
                                                }
                                            }
                                            tooltipsCtrl.setCurrentTooltipText("点击空格键保存或继续选择接续线!");
                                        }else{
                                            tempObj.vias.push(parseInt(dataresult.id));
                                            highRenderCtrl.highLightFeatures.push({
                                                id: parseInt(dataresult.id).toString(),
                                                layerid: 'rdLink',
                                                type: 'line',
                                                style: {color:'blue'}
                                            });
                                            tooltipsCtrl.setCurrentTooltipText("已选则接续线,点击空格键保存或继续选择接续线!");
                                        }
                                        //重新高亮;
                                        highRenderCtrl._cleanHighLight();
                                        highRenderCtrl.drawHighlight();
                                    }
                                    else if(status==2){//接续线方向选择错误;
                                        tooltipsCtrl.setCurrentTooltipText("接续线方向错误或该路的方向不确定!");
                                    }
                                    else{//如果选的是退出线的逻辑部分;
                                        $scope.isOutLink(dataresult.id).then(function(linkData) {
                                            if(linkData==1){//如果是1；退出线选择正确;
                                                highRenderCtrl.highLightFeatures = [];
                                                //高亮进入线;
                                                highRenderCtrl.highLightFeatures.push({
                                                    id: tempObj.inLinkPid.toString(),
                                                    layerid: 'rdLink',
                                                    type: 'line',
                                                    style: {color: '#21ed25'}
                                                });
                                                highRenderCtrl.highLightFeatures.push({
                                                    id: tempObj.nodePid.toString(),
                                                    layerid: 'rdLink',
                                                    type: 'line',
                                                    style: {color: 'yellow',size:12}
                                                });
                                                tempObj.vias = [];
                                                //取消第一次高亮显示的退出线;
                                                tempObj.outLinkPid = parseInt(dataresult.id);
                                                tempOutLink = parseInt(dataresult.id);
                                                //新的高亮退出线;
                                                highRenderCtrl.highLightFeatures.push({
                                                    id: tempOutLink.toString(),
                                                    layerid: 'rdLink',
                                                    type: 'line',
                                                    style: {}
                                                });
                                                highRenderCtrl._cleanHighLight();
                                                highRenderCtrl.drawHighlight();
                                                tooltipsCtrl.setCurrentTooltipText("已选退出线,点击空格键保存或继续选择接续线!");
                                            }else if(linkData==2){//如果是1；退出线选择正确;
                                                tooltipsCtrl.setCurrentTooltipText("退出线方向错误或该路的方向不确定!");
                                            }else{
                                                tooltipsCtrl.setCurrentTooltipText("操作错误,按Esc取消或继续操作!");
                                                return;
                                            }
                                        })
                                    }
                                })
                        });
                        //设置修改确认的数据;
                        featCodeCtrl.setFeatCode({
                            "pid": tempObj.pid.toString(),
                            "nodePid": tempObj.nodePid.toString(),
                            "inLinkPid": tempObj.inLinkPid.toString(),
                            "outLinkPid": tempObj.outLinkPid.toString(),
                            "vias":tempObj.vias
                        });
                    });
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
                    $scope.selectedFeature.optype = "RDLINK" ? "RDSPEEDLIMIT" : $scope.selectedFeature.optype;
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
        $scope.getLinkSpeedLimit = function (data, type, ctrl, tpl) {
            if(data.direct == 0){
                swal("提示","点限速方向为：未调查！","info");
                return;
            }
            var linkSpeedLimit = {
                linkPid:data.linkPid,
                speedType:parseInt(data.speedType)
            };
            var linkPids = [];
            var obj = {
                "queryType": type,
                "linkPid": data.linkPid,
                "direct": data.direct
            };
            var param = {
                "dbId": App.Temp.dbId,
                "type": "RDLINK",
                "data": obj
            };
            if(data.direct == 2){
                linkSpeedLimit.fromSpeedLimit = parseInt(data.speedValue);
            } else if(data.direct == 3){
                linkSpeedLimit.toSpeedLimit = parseInt(data.speedValue);
            }
            if (parseInt(data.speedType) == 3){//条件限速
                linkSpeedLimit.speedDependent = parseInt(data.condition);
            }
            dsEdit.getByCondition(param).then(function(links) {//查找link串
                if(links.errcode == 0){
                    if(links.data){
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        for (var i = 0;i<links.data.length;i++){
                            linkPids.push(links.data[i]);
                            highRenderCtrl.highLightFeatures.push({
                                id: links.data[i].toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {}
                            });
                        }
                        highRenderCtrl.drawHighlight();
                        objCtrl.setCurrentObject("RDLINKSPEEDLIMIT", linkSpeedLimit);
                        $scope.$emit("transitCtrlAndTpl", {
                            "loadType": 'attrTplContainer',
                            "propertyCtrl": ctrl,
                            "propertyHtml": tpl
                        });
                        dsEdit.getByPid(links.data[links.data.length-1],"RDLINK").then(function (linkDetail) {
                           var linkNodes = [];
                            linkNodes.push(linkDetail.eNodePid);
                            linkNodes.push(linkDetail.sNodePid);
                            //增加或者删除link
                            map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                                map: map,
                                shapeEditor: shapeCtrl,
                                selectLayers: [rdLink],
                                snapLayers: [rdLink]
                            });
                            map.currentTool.enable();
                            tooltipsCtrl.setCurrentTooltip('请选择需要增加或者删除的线！');
                            eventController.off(eventController.eventTypes.GETRELATIONID);
                            eventController.on(eventController.eventTypes.GETFEATURE, function(selectLink) {
                                highRenderCtrl._cleanHighLight();
                                if(selectLink.optype == "RDLINK"){
                                    if(linkPids.indexOf(parseInt(selectLink.id)) < 0){//不在当前的link串里
                                        if(linkNodes.indexOf(parseInt(selectLink.properties.snode)) > -1 || linkNodes.indexOf(parseInt(selectLink.properties.enode)) > -1){//选择的link是link串里最后一条的挂接link
                                            if((linkNodes.indexOf(parseInt(selectLink.properties.snode)) > -1 && ((parseInt(selectLink.properties.direct) == 3)||(parseInt(selectLink.properties.direct) == 1))) || (linkNodes.indexOf(parseInt(selectLink.properties.enode)) > -1 && ((parseInt(selectLink.properties.direct) == 2)||(parseInt(selectLink.properties.direct) == 1)))){
                                                linkPids.push(parseInt(selectLink.id));
                                                highRenderCtrl.highLightFeatures.push({
                                                    id: selectLink.id.toString(),
                                                    layerid: 'rdLink',
                                                    type: 'line',
                                                    style: {
                                                        color: '#D9B300'
                                                    }
                                                });
                                            }
                                        }
                                    } else {//在当前的link串里
                                        linkPids.length = linkPids.indexOf(parseInt(selectLink.id));
                                        highRenderCtrl.highLightFeatures = [];
                                        for(var i = 0 ;i<linkPids.length;i++){
                                            highRenderCtrl.highLightFeatures.push({
                                                id: linkPids[i].toString(),
                                                layerid: 'rdLink',
                                                type: 'line',
                                                style: {}
                                            });
                                        }
                                        dsEdit.getByPid(linkPids[linkPids.length-1],"RDLINK").then(function (lastLinkDetail) {
                                            var linkNodes = [];
                                            linkNodes.push(lastLinkDetail.eNodePid);
                                            linkNodes.push(lastLinkDetail.sNodePid);
                                        });
                                    }
                                }
                                highRenderCtrl.drawHighlight();
                                featCodeCtrl.setFeatCode({  //设置修改确认的数据;
                                    "direct": data.direct,
                                    "linkPids":linkPids
                                });
                            });
                        });

                    }
                }

            });
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
                if (data.status == 3){
                    swal("提示","此数据为已提交数据，不能修改几何！","info");
                    return;
                }
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
                    $scope.$emit("clearAttrStyleUp");//清除属性样式
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
            // $scope.classArr[0] = false;
            //重置上一步中的属性栏和tips框
            originalFeature = [];
            selectCount = 0;
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