/**
 * Created by liwanchong on 2015/10/28.
 * Rebuild by chenx on 2016-07-05
 */
angular.module('app').controller('selectShapeCtrl', ['$scope', '$q', '$ocLazyLoad', '$rootScope', 'dsFcc', 'dsEdit', 'appPath', '$interval',
    function ($scope, $q, $ocLazyLoad, $rootScope, dsFcc, dsEdit, appPath, $interval) {
        var selectCtrl = fastmap.uikit.SelectController();
        var objCtrl = fastmap.uikit.ObjectEditController();
        var layerCtrl = fastmap.uikit.LayerController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var eventController = fastmap.uikit.EventController();
        var transform = new fastmap.mapApi.MecatorTranform();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rwLink = layerCtrl.getLayerById('rwLink');
        var lcLink = layerCtrl.getLayerById('lcLink');
        var rdNode = layerCtrl.getLayerById('rdNode');
        var workPoint = layerCtrl.getLayerById('workPoint');
        var editLayer = layerCtrl.getLayerById('edit');
        var poiLayer = layerCtrl.getLayerById('poi');
        var crfData = layerCtrl.getLayerById('crfData');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var popup = L.popup();
        $scope.toolTipText = '';
        $scope.angleOfLink = function (pointA, pointB) {
            var PI = Math.PI,
                angle;
            if ((pointA.x - pointB.x) === 0) {
                angle = PI / 2;
            } else {
                angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
            }
            return angle;
        };
        /**
         * 数据中是否有rdLink
         * @param data
         * @returns {boolean}
         */
        $scope.containsRdLink = function (data) {
            return data.filter(function (item) {
                return item.tableName === 'RD_LINK';
            }).length !== 0;
        };
        /**
         * 数据中是否有rwLink
         * @param data
         * @returns {boolean}
         */
        $scope.containsRwLink = function (data) {
            return data.filter(function (item) {
                return item.tableName === 'RW_LINK';
            }).length !== 0;
        };
        /**
         * 数据中是否有lcLink
         * @param data
         * @returns {boolean}
         */
        $scope.containsLcLink = function (data) {
            return data.filter(function (item) {
                return item.tableName === 'LC_LINK';
            }).length !== 0;
        };
        $scope.changeIndexCallback = function (data) {
            objCtrl.data.links.sort(function (a, b) {
                if (a.zlevel < b.zlevel) {
                    return 1;
                } else if (a.zlevel > b.zlevel) {
                    return -1;
                } else {
                    return 0;
                }
            });
            /* 把当前link的zlevel升高一级*/
            for (var zLevelNum = 0, zLevelLen = objCtrl.data.links.length; zLevelNum < zLevelLen; zLevelNum++) {
                if (objCtrl.data.links[zLevelNum].linkPid == data.id) {
                    if ((objCtrl.data.links[zLevelNum].zlevel) <= zLevelLen - 1 && zLevelNum !== 0) {
                        objCtrl.data.links[zLevelNum - 1].zlevel -= 1;
                        objCtrl.data.links[zLevelNum].zlevel += 1;
                        break;
                    }
                }
            }
            objCtrl.data.links.sort(function (a, b) {
                return a.zlevel - b.zlevel;
            });
            /* 重绘link颜f色*/
            highRenderCtrl.highLightFeatures = [];
            for (var i = 0; i < objCtrl.data.links.length; i++) {
                var tempObj = {
                    RD_LINK: 'rdLink',
                    RW_LINK: 'rwLink',
                    LC_LINK: 'lcLink'
                };
                var COLORTABLE = ['#14B7FC', '#4FFFB6', 'F8B19C', '#FCD6A4'];
                highRenderCtrl.highLightFeatures.push({
                    id: objCtrl.data.links[i].linkPid.toString(),
                    layerid: tempObj[objCtrl.data.links[i].tableName],
                    type: 'line',
                    index: objCtrl.data.links[i].zlevel,
                    style: {
                        strokeWidth: 5,
                        strokeColor: COLORTABLE[objCtrl.data.links[i].zlevel]
                    }
                });
            }
            highRenderCtrl.drawHighlight();
            tooltipsCtrl.setCurrentTooltip('调整完成点击属性面板“保存”按钮以保存！');
        };
        /**
         * 调整link层级高低
         */
        $scope.changeLevel = function () {
            editLayer.drawGeometry = null;
            map.currentTool.options.repeatMode = false;
            // shapeCtrl.stopEditing();
            editLayer.bringToBack();
            $(editLayer.options._div).unbind();
            // $scope.changeBtnClass("");
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            editLayer.clear();
            map._container.style.cursor = '';
            if ($scope.containsRdLink(objCtrl.data.links)) {
                map.currentTool = new fastmap.uikit.SelectPath({
                    map: map,
                    currentEditLayer: rdLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
            }
            if ($scope.containsRwLink(objCtrl.data.links)) {
                map.currentTool.rwEvent = new fastmap.uikit.SelectPath({
                    map: map,
                    currentEditLayer: rwLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.rwEvent.enable();
            }
            if ($scope.containsLcLink(objCtrl.data.links)) {
                map.currentTool.rwEvent = new fastmap.uikit.SelectPath({
                    map: map,
                    currentEditLayer: lcLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.rwEvent.enable();
            }
            rdLink.options.selectType = 'link';
            rdLink.options.editable = true;
            eventController.off(eventController.eventTypes.GETLINKID, $scope.changeIndexCallback);
            eventController.on(eventController.eventTypes.GETLINKID, $scope.changeIndexCallback);
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
        $scope.showTipsOrProperty = function (data, type, objCtrl, propertyId, propertyCtrl, propertyTpl) {
            var ctrlAndTplParams = {
                loadType: 'tipsTplContainer',
                propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                callback: function () {
                    if (data.t_lifecycle === 2) { // 外业修改直接打开相关的属性栏
                        $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                    } else { // 3新增或1删除
                        var stageLen = data.t_trackInfo.length;
                        var stage = parseInt(data.t_trackInfo[stageLen - 1].stage);
                        if (stage === 1) { // 未作业 当是删除时 可以打开右侧属性栏
                            if (data.t_lifecycle === 1) {
                                $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                            } else { // 3新增或1删除
                                var stageLen = data.t_trackInfo.length;
                                var stage = parseInt(data.t_trackInfo[stageLen - 1].stage);
                                if (stage === 1) { // 未作业 当是删除时 可以打开右侧属性栏
                                    if (data.t_lifecycle === 1) {
                                        $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                                    }
                                } else if (stage === 3) { // 已作业 新添加的可以打开右侧属性栏
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
            // 先load Tips面板和控制器
            $scope.$emit('transitCtrlAndTpl', ctrlAndTplParams);
        };
        $scope.selectShape = function (type) {
            shapeCtrl.editType = '';
            // 大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                return;
            }
            // 重置选择工具
            $scope.resetToolAndMap();
            $scope.$emit('closePopoverTips', false);
            // $scope.subAttrTplContainerSwitch(false);
            $('#popoverTips').hide();
            // //点击按钮后样式的修改
            // $scope.changeBtnClass(num);
            // //连续点击同一个按钮的操作
            // if (!$scope.classArr[num]) {
            //     map.currentTool.disable();
            //     map._container.style.cursor = '';
            //     return;
            // }
            if (type === 'node') { // 选择点
                $scope.resetOperator('selectNode');
                layerCtrl.pushLayerFront('edit'); // 置顶editLayer
                // 初始化选择点工具
                map.currentTool = new fastmap.uikit.SelectNode({
                    map: map,
                    nodesFlag: true,
                    // currentEditLayer: rdNode,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                $scope.toolTipText = '请选择点！';
                eventController.off(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
            } else if (type === 'link') { // 选择线
                $scope.resetOperator('selectLink');
                layerCtrl.pushLayerFront('edit'); // 置顶editLayer
                // 初始化选择线的工具
                map.currentTool = new fastmap.uikit.SelectPath({
                    map: map,
                    // currentEditLayer: rdLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                // 初始化鼠标提示
                $scope.toolTipText = '请选择线！';
                // 把要捕捉的线图层添加到捕捉工具中
                // commented by chenx
                // map.currentTool.snapHandler.addGuideLayer(rdLink);
                // rdLink.options.editable = true;
                eventController.off(eventController.eventTypes.GETLINKID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETLINKID, $scope.selectObjCallback);
            } else if (type === 'face') {
                $scope.resetOperator('selectFace');
                // 初始化选择面工具
                map.currentTool = new fastmap.uikit.SelectPolygon({
                    map: map,
                    // currentEditLayer: adFace,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                editLayer.bringToBack();
                // 初始化鼠标提示
                $scope.toolTipText = '请选择面！';
                eventController.off(eventController.eventTypes.GETFACEID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETFACEID, $scope.selectObjCallback);
            } else if (type === 'relation') {
                $scope.resetOperator('selectRelation');
                // 初始化选择关系的工具
                map.currentTool = new fastmap.uikit.SelectRelation({
                    map: map,
                    relationFlag: true
                });
                map.currentTool.enable();
                editLayer.bringToBack();
                $scope.toolTipText = '请选择关系！';
                eventController.off(eventController.eventTypes.GETRELATIONID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETRELATIONID, $scope.selectObjCallback);
            } else if (type === 'tips') {
                $scope.resetOperator('selectTips');
                layerCtrl.pushLayerFront('workPoint'); // 置顶editLayer
                // 初始化选择tips的工具
                map.currentTool = new fastmap.uikit.SelectTips({
                    map: map,
                    dataTipsFlag: true,
                    currentEditLayer: workPoint
                });
                map.currentTool.enable();
                $scope.toolTipText = '请选择Tips！';
                eventController.off(eventController.eventTypes.GETTIPSID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETTIPSID, $scope.selectObjCallback);
            } else if (type === 'point') { // 点要素：poi，adadmin
                $scope.resetOperator('selectPointFeature');
                layerCtrl.pushLayerFront('edit'); // 置顶editLayer
                // 初始化选择点工具
                map.currentTool = new fastmap.uikit.SelectNode({
                    map: map,
                    nodesFlag: true,
                    // currentEditLayer: rdNode,
                    shapeEditor: shapeCtrl,
                    nodeType: 'PointFeature'
                });
                map.currentTool.enable();
                // 需要捕捉的图层
                // map.currentTool.snapHandler.addGuideLayer(rdNode);
                $scope.toolTipText = '请选择点要素！';
                eventController.off(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
            } else if (type === 'all') {
                map.currentTool = new fastmap.uikit.SelectFeature({
                    map: map,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                $scope.toolTipText = '请选择要素！';
                eventController.off(eventController.eventTypes.GETLINKID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETLINKID, $scope.selectObjCallback);
                eventController.off(eventController.eventTypes.GETRELATIONID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETRELATIONID, $scope.selectObjCallback);
                eventController.off(eventController.eventTypes.GETTIPSID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETTIPSID, $scope.selectObjCallback);
                eventController.off(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
                eventController.off(eventController.eventTypes.GETFACEID, $scope.selectObjCallback);
                eventController.on(eventController.eventTypes.GETFACEID, $scope.selectObjCallback);
            }
            tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
        };
        /**
         * 根据选择的geomtry从后台返回的数据 打开不同的属性面板
         * @param data
         */
        $scope.selectObjCallback = function (data) {
            $scope.selectedFeature = data;
            // $scope.$emit("SWITCHCONTAINERSTATE", {
            //     "subAttrContainerTpl": false
            // });
            // 地图小于17级时不能选择
            if (map.getZoom < 17) {
                return;
            }
            if (data.showMenu == false) {
                return;
            }
            map.closePopup(); // 如果有popup的话清除它
            if (map.floatMenu) {
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            // 清除上一个选择的高亮
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures = [];
            var ctrlAndTmplParams = {
                    propertyCtrl: '',
                    propertyHtml: ''
                },
                toolsObj = null;
            $scope.$emit('SWITCHCONTAINERSTATE', {
                subAttrContainerTpl: false,
                attrContainerTpl: false
            });
            switch (data.optype) {
            case 'RDLINK':
                    // 悬浮工具条的设置
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>插</span>",
                        title: '插入形状点',
                        type: 'PATHVERTEXINSERT',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>删</span>",
                        title: '删除形状点',
                        type: 'PATHVERTEXREMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>修</span>",
                        title: '修改形状点',
                        type: 'PATHVERTEXMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>方</span>",
                        title: '修改道路方向',
                        type: 'TRANSFORMDIRECT',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>断</span>",
                        title: '打断link',
                        type: 'PATHBREAK',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    },
                    {
                        text: "<span class='float-option-bar'>分</span>",
                        title: '分离节点',
                        type: 'PATHDEPARTNODE_RDLINK',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }
                    ]
                };
                    // 当在移动端进行编辑时,弹出此按钮
                    // if (L.Browser.touch) {
                    //     toolsObj.items.push({
                    //         'text': "<a class='glyphicon glyphicon-floppy-disk' type=''></a>",
                    //         'title': "保存",
                    //         'type': shapeCtrl.editType,
                    //         'class': "feaf",
                    //         callback: function() {
                    //             var e = $.Event("keydown");
                    //             e.keyCode = 32;
                    //             $(document).trigger(e);
                    //         }
                    //     })
                    // }
                selectCtrl.onSelected({
                    point: data.point
                });
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'RDLINK', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDNODE':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>移</span>",
                        title: '移动端点',
                        type: 'PATHNODEMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                    // 当在移动端进行编辑时,弹出此按钮
                if (L.Browser.touch) {
                    toolsObj.items.push({
                        text: "<span class='float-option-bar'>存</span>",
                        title: '保存',
                        type: shapeCtrl.editType,
                        class: 'feaf',
                        callback: function () {
                            var e = $.Event('keydown');
                            e.keyCode = 32;
                            $(document).trigger(e);
                        }
                    });
                }
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_node_ctrl/rdNodeFormCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_node_tpl/rdNodeFormTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'RDNODE', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDSAMENODE': // 同一点
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_same_ctrl/rdSameNodeCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_same_tpl/rdSameNodeTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'RDSAMENODE', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDSAMELINK': // 同一线
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_same_ctrl/rdSameLinkCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_same_tpl/rdSameLinkTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'RDSAMELINK', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDVOICEGUIDE': // 语音引导
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_voiceGuide_ctrl/voiceGuide';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_voiceGuide_tpl/voiceGuide.html';
                $scope.getFeatDataCallback(data, data.id, 'RDVOICEGUIDE', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDRESTRICTION':
                // if (data.restrictionType === '0') { // 普通交限
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_restriction_ctrl/rdRestriction';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html';
                // } else { // 卡车交限
                //     ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_restriction_ctrl/rdRestrictionOfTruckCtl';
                //     ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_restrict_tpl/rdRestrictOfTruckTpl.html';
                // }
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDLANECONNEXITY':
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_connexity_ctrl/rdLaneConnexityCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_connexity_tpl/rdLaneConnexityTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDSPEEDLIMIT':
                    // 悬浮工具条的设置
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>修</span>",
                        title: '修改点位',
                        type: 'MODIFYSPEEDNODE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>方</span>",
                        title: '修改方向',
                        type: 'TRANSFORMSPEEDDIRECT',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_speedLimit_ctrl/speedLimitCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_speedLimit_tpl/speedLimitTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDLINKSPEEDLIMIT':
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_speedLimit_ctrl/linkSpeedLimitCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_speedLimit_tpl/linkSpeedLimitTpl.html';
                $scope.getLinkSpeedLimit(data.selectData.properties, 'RDSPEEDLIMIT', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'DBRDLINKSPEEDLIMIT':
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_speedLimit_ctrl/linkSpeedLimitCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_speedLimit_tpl/linkSpeedLimitTpl.html';
                $scope.getLinkSpeedLimit(data.speedData.properties, 'RDSPEEDLIMIT', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDCROSS':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>组</span>",
                        title: '编辑组成点',
                        type: 'MODIFYRDCROSS',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_cross_ctrl/rdCrossCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_cross_tpl/rdCrossTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDGSC':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>层</span>",
                        title: '调整层级关系',
                        type: 'CHANGELEVEL',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_rdgsc_ctrl/rdGscCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_gsc_tpl/rdGscTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDWARNINGINFO': // 警示信息
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_warninginfo_ctrl/warningInfoCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_warninginfo_tpl/warningInfoTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDTRAFFICSIGNAL':
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_trafficSignal_ctrl/trafficSignalCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_trafficSignal_tpl/trafficSignalTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDDIRECTROUTE': // 顺行
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_directroute_ctrl/directRouteCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_directroute_tpl/directRouteTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDSPEEDBUMP': // 减速带
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_speedbump_ctrl/speedBumpCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_speedbump_tpl/speedBumpTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDSE': // 分叉口
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_se_ctrl/rdSeCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_se_tpl/rdSeTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDTOLLGATE': // 收费站
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_tollgate_ctrl/tollGateCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_tollgate_tpl/tollGateTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDVARIABLESPEED': // 可变限速;
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>线</span>",
                        title: '改关联退出线和接续线',
                        type: 'MODIFYVARIABLESPEED',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                    // 当在移动端进行编辑时,弹出此按钮
                if (L.Browser.touch) {
                    toolsObj.items.push({
                        text: "<span class='float-option-bar'>存</span>",
                        title: '保存',
                        type: shapeCtrl.editType,
                        class: 'feaf',
                        callback: function () {
                            var e = $.Event('keydown');
                            e.keyCode = 32;
                            $(document).trigger(e);
                        }
                    });
                }
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_variableSpeed_ctrl/variableSpeedCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_variableSpeed_tpl/variableSpeed.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDMILEAGEPILE': // 里程桩;
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>修</span>",
                        title: '修改里程桩位置',
                        type: 'MODIFYMILEAGEPILE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                // 当在移动端进行编辑时,弹出此按钮
                if (L.Browser.touch) {
                    toolsObj.items.push({
                        text: "<span class='float-option-bar'>存</span>",
                        title: '保存',
                        type: shapeCtrl.editType,
                        class: 'feaf',
                        callback: function () {
                            var e = $.Event('keydown');
                            e.keyCode = 32;
                            $(document).trigger(e);
                        }
                    });
                }
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_mileagepile_ctrl/mileagePileCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_mileagepile_tpl/mileagePile.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDELECTRONICEYE':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>改</span>",
                        title: '改点位',
                        type: 'MODIFYNODE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>配</span>",
                        title: '增加配对关系',
                        type: 'ADDPAIRBOND',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                    // 当在移动端进行编辑时,弹出此按钮
                if (L.Browser.touch) {
                    toolsObj.items.push({
                        text: "<span class='float-option-bar'>存</span>",
                        title: '保存',
                        type: shapeCtrl.editType,
                        class: 'feaf',
                        callback: function () {
                            var e = $.Event('keydown');
                            e.keyCode = 32;
                            $(document).trigger(e);
                        }
                    });
                }
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_electronic_ctrl/electronicEyeCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_electronic_tpl/electronicEyeTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDSLOPE':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>退</span>",
                        title: '改退出线',
                        type: 'MODIFYLINKPID',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>连</span>",
                        title: '改连续Link',
                        type: 'MODIFYLINKPIDS',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                    // 当在移动端进行编辑时,弹出此按钮
                if (L.Browser.touch) {
                    toolsObj.items.push({
                        text: "<span class='float-option-bar'>存</span>",
                        title: '保存',
                        type: shapeCtrl.editType,
                        class: 'feaf',
                        callback: function () {
                            var e = $.Event('keydown');
                            e.keyCode = 32;
                            $(document).trigger(e);
                        }
                    });
                }
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_rdSlope_ctrl/rdSlopeCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_rdSlope_tpl/rdSlopeTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDINTER':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>增</span>",
                        title: '增加点',
                        type: 'ADDRDINTERPART',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>取</span>",
                        title: '取消点',
                        type: 'DELETERDINTERPART',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                    // 当在移动端进行编辑时,弹出此按钮
                if (L.Browser.touch) {
                    toolsObj.items.push({
                        text: "<span class='float-option-bar'>存</span>",
                        title: '保存',
                        type: shapeCtrl.editType,
                        class: 'feaf',
                        callback: function () {
                            var e = $.Event('keydown');
                            e.keyCode = 32;
                            $(document).trigger(e);
                        }
                    });
                }
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_rdcrf_ctrl/crfInterCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_rdcrf_tpl/crfInterTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDROAD':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>增</span>",
                        title: '增加线',
                        type: 'ADDRDROADLINK',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>取</span>",
                        title: '取消线',
                        type: 'DELETERDROADLINK',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                    // 当在移动端进行编辑时,弹出此按钮
                if (L.Browser.touch) {
                    toolsObj.items.push({
                        text: "<span class='float-option-bar'>存</span>",
                        title: '保存',
                        type: shapeCtrl.editType,
                        class: 'feaf',
                        callback: function () {
                            var e = $.Event('keydown');
                            e.keyCode = 32;
                            $(document).trigger(e);
                        }
                    });
                }
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_rdcrf_ctrl/crfRoadCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_rdcrf_tpl/crfRoadTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDOBJECT':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>增</span>",
                        title: '增加要素',
                        type: 'ADDRDOBJECT',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>取</span>",
                        title: '取消要素',
                        type: 'DELETERDOBJECT',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                    // 当在移动端进行编辑时,弹出此按钮
                if (L.Browser.touch) {
                    toolsObj.items.push({
                        text: "<span class='float-option-bar'>存</span>",
                        title: '保存',
                        type: shapeCtrl.editType,
                        class: 'feaf',
                        callback: function () {
                            var e = $.Event('keydown');
                            e.keyCode = 32;
                            $(document).trigger(e);
                        }
                    });
                }
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_rdcrf_ctrl/crfObjectCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_rdcrf_tpl/crfObjectTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDGATE': // 大门
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_gate_ctrl/rdGateCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_gate_tpl/rdGateTpl.html';
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDBRANCH':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>退</span>",
                        title: '改退出线',
                        type: 'MODIFYBRANCH_OUT',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }
                        //    {
                        //    'text': "<span class='float-option-bar'>经</span>",
                        //    'title': "修改经过线",
                        //    'type': "MODIFYBRANCH_THROUGH",
                        //    'class': "feaf",
                        //    callback: $scope.modifyTools
                        // }
                    ]
                };
                    // 当在移动端进行编辑时,弹出此按钮
                if (L.Browser.touch) {
                    toolsObj.items.push({
                        text: "<span class='float-option-bar'>存</span>",
                        title: '保存',
                        type: shapeCtrl.editType,
                        class: 'feaf',
                        callback: function () {
                            var e = $.Event('keydown');
                            e.keyCode = 32;
                            $(document).trigger(e);
                        }
                    });
                }
                objCtrl.flag = true;
                locllBranchCtlAndTpl(data.branchType);
                $scope.getFeatDataCallback(data, null, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RWNODE':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>移</span>",
                        title: '移动端点',
                        type: 'PATHNODEMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_node_ctrl/rwNodeCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_node_tpl/rwNodeTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'RWNODE', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RWLINK':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>插</span>",
                        title: '插入形状点',
                        type: 'PATHVERTEXINSERT',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>删</span>",
                        title: '删除形状点',
                        type: 'PATHVERTEXREMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>修</span>",
                        title: '修改形状点',
                        type: 'PATHVERTEXMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>断</span>",
                        title: '打断link',
                        type: 'PATHBREAK',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    },
                        {
                            text: "<span class='float-option-bar'>分</span>",
                            title: '分离节点',
                            type: 'PATHDEPARTNODE_RWLINK',
                            class: 'feaf',
                            callback: $scope.modifyTools
                        }
                    ]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_link_ctrl/rwLinkCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_link_tpl/rwLinkTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'RWLINK', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'ADADMIN':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>移</span>",
                        title: '移动行政区划代表点',
                        type: 'ADADMINMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_administratives_ctrl/adAdminCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_adminstratives_tpl/adAdminTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'ADADMIN', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'ADNODE':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>移</span>",
                        title: '移动端点',
                        type: 'PATHNODEMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_administratives_ctrl/adNodeCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_adminstratives_tpl/adNodeTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'ADNODE', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'ADLINK':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>插</span>",
                        title: '插入形状点',
                        type: 'PATHVERTEXINSERT',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>删</span>",
                        title: '删除形状点',
                        type: 'PATHVERTEXREMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>修</span>",
                        title: '修改形状点',
                        type: 'PATHVERTEXMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>断</span>",
                        title: '打断link',
                        type: 'PATHBREAK',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    },
                        {
                            text: "<span class='float-option-bar'>分</span>",
                            title: '分离节点',
                            type: 'PATHDEPARTNODE_ADLINK',
                            class: 'feaf',
                            callback: $scope.modifyTools
                        }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_administratives_ctrl/adLinkCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_adminstratives_tpl/adLinkTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'ADLINK', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'ADFACE':
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_administratives_ctrl/adFaceCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_adminstratives_tpl/adFaceTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'ADFACE', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'ZONENODE':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>移</span>",
                        title: '移动ZONENODE点',
                        type: 'PATHNODEMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_zone_ctrl/zoneNodeCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_zone_tpl/zoneNodeTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'ZONENODE', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'ZONELINK':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>插</span>",
                        title: '插入形状点',
                        type: 'PATHVERTEXINSERT',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>删</span>",
                        title: '删除形状点',
                        type: 'PATHVERTEXREMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>修</span>",
                        title: '修改形状点',
                        type: 'PATHVERTEXMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>断</span>",
                        title: '打断link',
                        type: 'PATHBREAK',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>分</span>",
                        title: '分离节点',
                        type: 'PATHDEPARTNODE_ZONELINK',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_zone_ctrl/zoneLinkCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_zone_tpl/zoneLinkTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'ZONELINK', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'ZONEFACE':
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_zone_ctrl/zoneFaceCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_zone_tpl/zoneFaceTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'ZONEFACE', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'LUNODE':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>移</span>",
                        title: '移动LUNODE点',
                        type: 'PATHNODEMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_lu_ctrl/luNodeCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_lu_tpl/luNodeTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'LUNODE', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'LUFACE':
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_lu_ctrl/luFaceCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_lu_tpl/luFaceTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'LUFACE', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'LULINK':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>插</span>",
                        title: '插入形状点',
                        type: 'PATHVERTEXINSERT',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>删</span>",
                        title: '删除形状点',
                        type: 'PATHVERTEXREMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>修</span>",
                        title: '修改形状点',
                        type: 'PATHVERTEXMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>断</span>",
                        title: '打断link',
                        type: 'PATHBREAK',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>分</span>",
                        title: '分离节点',
                        type: 'PATHDEPARTNODE_LULINK',
                        class: 'feaf',
                        callback: $scope.modifyTools
                        }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_lu_ctrl/luLinkCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_lu_tpl/luLinkTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'LULINK', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'LCNODE':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>移</span>",
                        title: '移动LCNODE点',
                        type: 'PATHNODEMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_lc_ctrl/lcNodeCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_lc_tpl/lcNodeTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'LCNODE', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'LCLINK':
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>插</span>",
                        title: '插入形状点',
                        type: 'PATHVERTEXINSERT',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>删</span>",
                        title: '删除形状点',
                        type: 'PATHVERTEXREMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>修</span>",
                        title: '修改形状点',
                        type: 'PATHVERTEXMOVE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }, {
                        text: "<span class='float-option-bar'>断</span>",
                        title: '打断link',
                        type: 'PATHBREAK',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    },
                        {
                            text: "<span class='float-option-bar'>分</span>",
                            title: '分离节点',
                            type: 'PATHDEPARTNODE_LCLINK',
                            class: 'feaf',
                            callback: $scope.modifyTools
                        }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_lc_ctrl/lcLinkCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_lc_tpl/lcLinkTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'LCLINK', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'LCFACE':
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_lc_ctrl/lcFaceCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_lc_tpl/lcFaceTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'LCFACE', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'IXPOI':
                    // $scope.$parent.$parent.$parent.$parent.$parent.selectPoiInMap = true; //表示poi是从地图上选中的
                $scope.rootCommonTemp.selectPoiInMap = true;
                toolsObj = {
                    items: [{
                            // 'text': "<span class='float-option-bar'>显</span>",
                        text: "<div class='icon-location'>",
                        title: '移动显示坐标',
                        type: 'POILOCMOVE',
                        class: 'feaf',
                        callback: $scope.modifyPoi
                    }, {
                        text: "<div class='icon-guide'></div>",
                        title: '移动引导坐标',
                        type: 'POIGUIDEMOVE',
                        class: 'feaf',
                        callback: $scope.modifyPoi
                    }, {
                        text: "<div class='icon-location'></div>",
                        title: '引导坐标随着显示坐标变化',
                        type: 'POIAUTODRAG',
                        class: 'feaf',
                        callback: $scope.modifyPoi
                    }, {
                        text: "<div class='icon-father'></div>",
                        title: '编辑父',
                        type: 'SELECTPARENT',
                        class: 'feaf',
                        callback: $scope.modifyPoi
                    }, {
                        text: "<div class='icon-same'></div>",
                        title: '同一关系',
                        type: 'POISAME',
                        class: 'feaf',
                        callback: $scope.modifyPoi
                    }, {
                        text: "<div class='icon-reset'></div>",
                        title: '重置',
                        type: 'RESETPOI',
                        class: 'feaf',
                        callback: $scope.modifyPoi
                    }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.poi + 'ctrls/attr-base/generalBaseCtl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.poi + 'tpls/attr-base/generalBaseTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'IXPOI', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'RDLANE':
                $scope.laneInfo = {
                    inLinkPid: 0,
                    nodePid: 0,
                    laneDir: 0,
                    links: [],
                    snode: 0,
                    enode: 0
                };
                if (map.getZoom() < 8) {
                    swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                    return;
                }
                var highLightFeatures = [],
                    linkDirect = 0;
                    // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.RDLANE);
                    // 地图编辑相关设置;
                tooltipsCtrl.setEditEventType('rdLane');
                tooltipsCtrl.setCurrentTooltip('请选择进入点！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    createBranchFlag: true,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink); // link高亮
                $scope.linkHighLight = function () {
                    if ($scope.laneInfo.nodePid !== 0) {
                        highLightFeatures.push({
                            id: $scope.laneInfo.nodePid.toString(),
                            layerid: 'rdLink',
                            type: 'node',
                            style: {
                                color: 'yellow'
                            }
                        });
                    }
                    if ($scope.laneInfo.links.length > 0) {
                        highLightFeatures.push({
                            id: $scope.laneInfo.inLinkPid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {
                                color: 'rgb(255, 0, 0)'
                            }
                        });
                    }
                    highRenderCtrl.highLightFeatures = highLightFeatures;
                    highRenderCtrl.drawHighlight();
                };
                $scope.laneInfo.inLinkPid = data.id;
                $scope.laneInfo.links = [data.id];
                var rdlinks = rdLink.tiles[data.tileId].data;
                var rdlinkData = [];
                $scope.laneInfo.laneDir = '';
                for (var i = 0; i < rdlinks.length; i++) {
                    if (rdlinks[i].properties.id == data.id) {
                        linkDirect = rdlinks[i].properties.direct;
                        $scope.laneInfo.snode = rdlinks[i].properties.snode;
                        $scope.laneInfo.enode = rdlinks[i].properties.enode;
                        break;
                    }
                }
                if (linkDirect == 2 || linkDirect == 3) { // 单方向
                    $scope.laneInfo.nodePid = parseInt(linkDirect == 2 ? $scope.laneInfo.enode : $scope.laneInfo.snode);
                    $scope.laneInfo.laneDir = 0;
                } else if (linkDirect == 1) {
                    if (parseInt($scope.laneInfo.snode) == $scope.laneInfo.nodePid) {
                        $scope.laneInfo.laneDir = 1;
                    } else {
                        $scope.laneInfo.laneDir = 2;
                    }
                }
                $scope.linkHighLight();
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    map.currentTool.snapHandler.snaped = false;
                    map.currentTool.snapHandler._guides = [];
                    map.currentTool.snapHandler.addGuideLayer(rdNode);
                    if (data.index === 0) {
                        $scope.laneInfo.nodePid = data.id;
                        $scope.linkHighLight();
                        tooltipsCtrl.setCurrentTooltip('已选进入点,空格查询!');
                    }
                    featCodeCtrl.setFeatCode($scope.laneInfo);
                });
                break;
            case 'RDHGWGLIMIT': // 限高限重
                toolsObj = {
                    items: [{
                        text: "<span class='float-option-bar'>修</span>",
                        title: '修改点位',
                        type: 'MODIFYHGWGLIMITNODE',
                        class: 'feaf',
                        callback: $scope.modifyTools
                    }]
                };
                ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_hgwglimit_ctrl/hgwgLimitCtrl';
                ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_hgwglimit_tpl/hgwglimitTpl.html';
                $scope.getFeatDataCallback(data, data.id, 'RDHGWGLIMIT', ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml, toolsObj);
                break;
            case 'TIPS':
                $('#popoverTips').css('display', 'block');
                dsFcc.getTipsResult(data.id).then(function (result) {
                    if (result.rowkey === 'undefined') {
                        return;
                    }
                    var options11 = {
                        loadType: 'attrTplContainer',
                        propertyCtrl: appPath.road + 'ctrls/blank_ctrl/blankCtrl',
                        propertyHtml: appPath.root + appPath.road + 'tpls/blank_tpl/blankTpl.html'
                    };
                    $scope.$emit('transitCtrlAndTpl', options11);
                    $scope.$emit('SWITCHCONTAINERSTATE', {
                        attrContainerTpl: false
                    });
                    eventController.fire(eventController.eventTypes.SELECTBYATTRIBUTE, {
                        feather: result
                    });
                        /**
                         * 根据tips的rowkey值来获取其关联的要素的PID
                         * 参考rowkey的赋值原则，以及警示信息、可变限速的关联要素的查询原则
                         * add by chenx on 20161101，临时方案
                         * 当lifecycle=1或2时，①如果rowkey是11开头，取rowkey中不包含11+sourceType的内容，去gdb中查询，当查询不到时不返回错误提示；②如果rowkey不是11开头，则不用去gdb中查询
                         */
                    var getRelatedFeaturePid = function (rowkey) {
                        var ret = null;
                        if (rowkey) {
                            if (rowkey.length > 6 && rowkey.substr(0, 2) == '11') {
                                ret = rowkey.substr(6);
                            }
                        }
                        return ret;
                    };
                        // 当lifecycle=1或2时，①如果web传输参数的长度>10位或=0，则不去gdb中查询；②如果传输参数的长度<=10位，则去gdb中查询，当查询不到时不返回错误提示
                    var getRelatedFeatureById = function (id) {
                        var ret = null;
                        if (id) {
                            if (id.toString().length <= 10) {
                                ret = id;
                            }
                        }
                        return ret;
                    };
                    switch (result.s_sourceType) {
                    case '1101': // 点限速
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var featurePid = getRelatedFeatureById(result.id);
                                    if (featurePid) {
                                        $scope.getFeatDataCallback(result, featurePid, 'RDSPEEDLIMIT', appPath.road + 'ctrls/attr_speedLimit_ctrl/speedLimitCtrl', appPath.root + appPath.road + 'tpls/attr_speedLimit_tpl/speedLimitTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1102': // 红绿灯
                        var ctrlAndTplOfTraffic = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var featurePid = getRelatedFeatureById(result.id);
                                    if (featurePid) {
                                        $scope.getFeatDataCallback(result, featurePid, 'RDCROSS', appPath.road + 'ctrls/attr_cross_ctrl/rdCrossCtrl', appPath.root + appPath.road + 'tpls/attr_cross_tpl/rdCrossTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfTraffic);
                        break;
                    case '1103': // 红绿灯方位
                        var ctrlAndTplOfTraffic = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var featurePid = getRelatedFeatureById(result.id);
                                    if (featurePid) {
                                        $scope.getFeatDataCallback(result, featurePid, 'RDTRAFFICSIGNAL', appPath.road + 'ctrls/attr_trafficSignal_ctrl/rdTrafficSignalCtrl', appPath.root + appPath.road + 'tpls/attr_trafficSignal_Tpl/rdTrafficSignalTpl.html');
                                    }
                                            // $scope.getFeatDataCallback(result, result.in.id ? result.in.id:'', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfTraffic);
                        break;
                    case '1104': // 大门
                        var ctrlAndTplOfTraffic = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var featurePid = getRelatedFeatureById(result.id);
                                    if (featurePid) {
                                        $scope.getFeatDataCallback(result, featurePid, 'RDGATE', appPath.road + 'ctrls/attr_gate_ctrl/rdGateCtrl', appPath.root + appPath.road + 'tpls/attr_gate_tpl/rdGateTpl.html');
                                    }
                                            // $scope.getFeatDataCallback(result, result.in.id ? result.in.id:'', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfTraffic);
                        break;
                    case '1105': // 危险信息
                        var ctrlAndTplOfDirect = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var rPid = getRelatedFeaturePid(result.rowkey);
                                    if (rPid) {
                                        $scope.getFeatDataCallback(result, result.wID[0].id, 'RDWARNINGINFO', appPath.road + 'ctrls/attr_warninginfo_ctrl/warningInfoCtrl', appPath.root + appPath.road + 'tpls/attr_warninginfo_tpl/warningInfoTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfDirect);
                        break;
                    case '1106': // 坡度
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDSLOP', appPath.road + 'ctrls/attr_rdSlope_ctrl/rdSlopeCtrl', appPath.root + appPath.road + 'tpls/attr_rdSlope_tpl/rdSlopeTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1107': // 收费站
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.in.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDLINK', appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl', appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                                // $scope.showTipsOrProperty(result, "RDLINK", objCtrl, result.in.id, appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                        break;
                    case '1108': // 减速带
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDSPEEDBUMP', appPath.road + 'ctrls/attr_speedbump_ctrl/speedBumpCtrl', appPath.root + appPath.road + 'tpls/attr_speedbump_tpl/speedBumpTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1109': // 电子眼
                        var ctrlAndTplOfTraffic = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDELECTRONICEYE', appPath.road + 'ctrls/attr_electronic_ctrl/electronicEyeCtrl', appPath.root + appPath.road + 'tpls/attr_electronic_tpl/electronicEyeTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfTraffic);
                        break;
                    case '1110': // 卡车限制
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1111': // 条件限速
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var rPid = getRelatedFeaturePid(result.rowkey);
                                    if (rPid) {
                                        $scope.getFeatDataCallback(result, result.sID[0].id, 'RDSPEEDLIMIT', appPath.road + 'ctrls/attr_speedLimit_ctrl/speedLimitCtrl', appPath.root + appPath.road + 'tpls/attr_speedLimit_tpl/speedLimitTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1112': // 可变限速
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.in.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDVARIABLESPEED', appPath.road + 'ctrls/attr_variableSpeed_ctrl/variableSpeedCtrl', appPath.root + appPath.road + 'tpls/attr_variableSpeed_tpl/variableSpeed.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1113': // 车道限速
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDSPEEDLIMIT', appPath.road + 'ctrls/attr_speedLimit_ctrl/speedLimitCtrl', appPath.root + appPath.road + 'tpls/attr_speedLimit_tpl/speedLimitTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1201': // 种别
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 3) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDLINK', appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl', appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1202': // 车道数
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 3) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDLINK', appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl', appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1203': // 道路方向
                        var ctrlAndTplOfDirect = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.f.type == 1) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDLINK', appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl', appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfDirect);
                        break;
                    case '1204': // 可逆车道
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    highLightFeatures.push({
                                        id: result.f.id.toString(),
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {
                                            color: 'rgb(255, 0, 0)'
                                        }
                                    });
                                    highRenderCtrl.highLightFeatures = highLightFeatures;
                                    highRenderCtrl.drawHighlight();
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1205': // SA
                        var ctrlAndTplOfSA = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.f) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDLINK', 'scripts/components/road/ctrls/attr_link_ctrl/rdLinkCtrl', '../../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfSA);
                        break;
                    case '1206': // PA
                        var ctrlAndTplOfPA = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.f) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDLINK', 'scripts/components/road/ctrls/attr_link_ctrl/rdLinkCtrl', '../../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfPA);
                        break;
                    case '1207': // 匝道
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 3) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDLINK', appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl', appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1208': // 停车场出入口Link
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                var f_id = getRelatedFeatureById(result.f.id);
                                if (f_id) {
                                    $scope.getFeatDataCallback(result, f_id, 'RDLINK', appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl', appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html');
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1209': // 详细车道
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1301': // 车信
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDLANECONNEXITY', appPath.road + 'ctrls/attr_connexity_ctrl/rdLaneConnexityCtrl', appPath.root + appPath.road + 'tpls/attr_connexity_tpl/rdLaneConnexityTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1302': // 交限
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDRESTRICTION', appPath.road + 'ctrls/attr_restriction_ctrl/rdRestriction', appPath.root + appPath.road + 'tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1303': // 卡车交限
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDRESTRICTION', appPath.road + 'ctrls/attr_restriction_ctrl/rdRestriction', appPath.root + appPath.road + 'tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1304': // 禁止穿行
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDLINK', appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl', appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1305': // 禁止驶入
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDLINK', appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl', appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1306': // 路口语音引导
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDVOICEGUIDE', appPath.road + 'ctrls/attr_voiceGuide_ctrl/voiceGuide', appPath.root + appPath.road + 'tpls/attr_voiceGuide_tpl/voiceGuide.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1308': // 禁止卡车驶入
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDLINK', appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl', appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1310': // 公交车道
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                highRenderCtrl.highLightFeatures.push({
                                    id: result.f.id,
                                    layerid: 'rdLink',
                                    type: 'node',
                                    style: {
                                        color: 'yellow'
                                    }
                                });
                                highRenderCtrl.drawHighlight();
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1311': // 可变导向车道
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                highRenderCtrl.highLightFeatures.push({
                                    id: result.f.id,
                                    layerid: 'rdLink',
                                    type: 'node',
                                    style: {
                                        color: 'yellow'
                                    }
                                });
                                highRenderCtrl.drawHighlight();
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1401': // 方向看板
                        var ctrlAndTplOfOrientation = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.brID[0].id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDBRANCH', appPath.road + 'ctrls/attr_branch_ctrl/rdSignBoardCtrl', appPath.root + appPath.road + '../../../scripts/components/road/tpls/attr_branch_Tpl/signBoardOfBranch.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfOrientation);
                        break;
                    case '1402': // real sign
                        var ctrlAndTplOfRealSign = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.brID[0].id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDBRANCH', 'scripts/components/road/ctrls/attr_branch_ctrl/rdBranchCtrl', '../../../scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfRealSign);
                        break;
                    case '1403': // 3D
                        var ctrlAndTplOfRealSign = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.brID[0].id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDBRANCH', 'scripts/components/road/ctrls/attr_branch_ctrl/rdBranchCtrl', '../../../scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfRealSign);
                        break;
                    case '1404': // 提左提右
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.brID[0].id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDBRANCH', appPath.road + 'ctrls/attr_branch_ctrl/rdBranchCtrl', appPath.root + appPath.road + 'tpls/attr_branch_Tpl/namesOfBranch.html', 3);
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1405': // 一般道路方面
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.brID[0].id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDBRANCH', appPath.road + 'ctrls/attr_branch_ctrl/rdBranchCtrl', appPath.root + appPath.road + 'tpls/attr_branch_Tpl/namesOfBranch.html', 3);
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1406': // 实景图
                        var ctrlAndTplOfJCV = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.brID[0].id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDBRANCH', appPath.road + 'ctrls/attr_branch_ctrl/rdRealImageCtrl', appPath.root + appPath.road + 'tpls/attr_branch_Tpl/realImageOfBranch.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfJCV);
                        break;
                    case '1407': // 分歧
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.brID[0].id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDBRANCH', appPath.road + 'ctrls/attr_branch_ctrl/rdBranchCtrl', appPath.root + appPath.road + 'tpls/attr_branch_Tpl/namesOfBranch.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1409': // 普通路口模式图
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.brID[0].id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDBRANCH', appPath.road + 'ctrls/attr_branch_ctrl/rdBranchCtrl', appPath.root + appPath.road + 'tpls/attr_branch_Tpl/namesOfBranch.html', 4);
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1410': // 高速入口模式图
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.brID[0].id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDBRANCH', appPath.road + 'ctrls/attr_branch_ctrl/rdBranchCtrl', appPath.root + appPath.road + 'tpls/attr_branch_Tpl/namesOfBranch.html', 4);
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1501': // 上下线分离
                        var ctrlAndTplOfUpAndDown = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfUpAndDown);
                        break;
                    case '1502': // 路面覆盖
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1503': // 高架路
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1504': // overpass
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1505': // underpass
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1506': // 私道
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1507': // 步行街
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1508': // 公交专用道路
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1509': // 跨线立交
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1510': // 桥
                        var ctrlAndTplOfBridge = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfBridge);
                        break;
                    case '1511': // 隧道
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1512': // 铺路
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1513': // 窄道
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1514': // 施工
                        var ctrlAndTplOfMend = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfMend);
                        break;
                    case '1515': // 维修
                        var ctrlAndTplOfD = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfD);
                        break;
                    case '1516': // 季节性关闭道路
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1517': // Usage Fee Required
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1601': // 环岛
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1602': // 特殊交通类型
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1603': // 未定义交通类型
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1604': // 区域内道路
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 3) {
                                    var f_id = getRelatedFeatureById(result.f_array[0].id);
                                    if (f_id) {
                                                // $scope.brigeLinkArray = result.f_array;
                                        $scope.getFeatDataCallback(result, f_id, 'RDLINK', appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl', appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1605': // POI连接路
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1606': // 收费站开放道路
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1607': // 风景路线
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1701': // 障碍物
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDNODEFORM', appPath.road + 'ctrls/attr_node_ctrl/rdNodeFormCtrl', appPath.root + appPath.road + 'tpls/attr_node_tpl/rdNodeFormTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1702': // 铁道路口
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        $scope.getFeatDataCallback(result, f_id, 'RDNODEFORM', appPath.road + 'ctrls/attr_node_ctrl/rdNodeFormCtrl', appPath.root + appPath.road + 'tpls/attr_node_tpl/rdNodeFormTpl.html');
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1703': // 分叉口提示
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1704': // 交叉路口
                        var ctrlAndTplOfCross = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html',
                            callback: function () {
                                if (result.t_lifecycle == 1 || result.t_lifecycle == 2) {
                                    var f_id = getRelatedFeatureById(result.f.id);
                                    if (f_id) {
                                        var obj = {
                                            nodePid: parseInt(f_id)
                                        };
                                        var param = {
                                            dbId: App.Temp.dbId,
                                            type: 'RDCROSS',
                                            data: obj
                                        };
                                        dsEdit.getByCondition(param, function (data) {
                                            var crossCtrlAndTpl = {
                                                propertyCtrl: appPath.road + 'ctrls/attr_cross_ctrl/rdCrossCtrl',
                                                propertyHtml: appPath.root + appPath.road + 'tpls/attr_cross_tpl/rdCrossTpl.html'
                                            };
                                            objCtrl.setCurrentObject('RDCROSS', data);
                                            $scope.$emit('transitCtrlAndTpl', crossCtrlAndTpl);
                                        });
                                    }
                                }
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfCross);
                        break;
                    case '1705': // 立交桥名称
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1706': // GPS打点
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1707': // 里程桩
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1801': // 立交
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1803': // 挂接
                        var ctrlAndTplOfOfGJ = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfOfGJ);
                        break;
                    case '1804': // 顺行
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1806': // 草图
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '1901': // 道路名
                        var ctrlAndTplOfName = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTplOfName);
                        break;
                    case '2001': // 测线
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '2101': // 删除标记
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    case '2102': // 万能标记
                        var ctrlAndTpl = {
                            loadType: 'tipsTplContainer',
                            propertyCtrl: appPath.road + 'ctrls/attr_tips_ctrl/sceneAllTipsCtrl',
                            propertyHtml: appPath.root + appPath.road + 'tpls/attr_tips_tpl/sceneAllTipsTpl.html'
                        };
                        $scope.$emit('transitCtrlAndTpl', ctrlAndTpl);
                        break;
                    }
                });
                break;
            }
            /* 判断分歧类型*/
            function locllBranchCtlAndTpl(branchType) {
                switch (branchType) {
                case 0:
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_branch_ctrl/rdBranchCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/namesOfBranch.html';
                        // 当要素切换时重新加载初始化方法;
                        // eventController.fire(eventController.eventTypes.SELECTEDFEATURECHANGE);
                    break;
                case 1:
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_branch_ctrl/rdBranchCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/namesOfBranch.html';
                    break;
                case 2:
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_branch_ctrl/rdBranchCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/namesOfBranch.html';
                    break;
                case 3:
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_branch_ctrl/rdBranchCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/namesOfBranch.html';
                    break;
                case 4:
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_branch_ctrl/rdBranchCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/namesOfBranch.html';
                    break;
                case 5:
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_branch_ctrl/rdRealImageCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/realImageOfBranch.html';
                    break;
                case 6:
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_branch_ctrl/rdSignAsRealCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/signAsRealOfBranch.html';
                    break;
                case 7:
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_branch_ctrl/rdSeriesCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/seriesOfBranch.html';
                    break;
                case 8:
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_branch_ctrl/rdSchematicCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/schematicOfBranch.html';
                    break;
                case 9:
                    ctrlAndTmplParams.propertyCtrl = appPath.road + 'ctrls/attr_branch_ctrl/rdSignBoardCtrl';
                    ctrlAndTmplParams.propertyHtml = appPath.root + appPath.road + 'tpls/attr_branch_Tpl/signBoardOfBranch.html';
                    break;
                }
            }
        };
        $scope.sign = 0; // 初始值
        /**
         * 修改方向
         * @param direct
         * @returns {*}
         */
        $scope.changeDirect = function (direct) {
            var orientation;
            switch (direct) {
            case 1: // 双方向
                if ($scope.sign === 0) {
                    orientation = 3; // 向左
                } else if (this.sign === 1) {
                    orientation = 2; // 向右
                }
                break;
            case 2: // 顺方向
                orientation = 1;
                $scope.sign = 0;
                break;
            case 3: // 逆方向
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
        $scope.changeSpeedDirect = function (direct) {
            var orientation;
            switch (direct) {
            case 0: // 无方向
                orientation = 2;
                break;
            case 2: // 顺方向
                orientation = 3;
                break;
            case 3: // 逆方向
                orientation = 2;
                break;
            }
            return orientation;
        };
        /**
         * 悬浮工具栏中的点击事件方法
         * @param event
         */
        $scope.modifyTools = function (event) {
            var type = event.currentTarget.type; // 点击悬浮按钮的类型
            $('#popoverTips').hide();
            if (shapeCtrl.getCurrentTool().options) {
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
                if (type === 'ADADMINMOVE') {
                    if (selectCtrl.selectedFeatures) {
                        if (shapeCtrl.shapeEditorResult) {
                            var feature = {};
                            feature.components = [];
                            feature.points = [];
                            feature.components.push(fastmap.mapApi.point(selectCtrl.selectedFeatures.geometry.x, selectCtrl.selectedFeatures.geometry.y));
                            feature.components.push(fastmap.mapApi.point(selectCtrl.selectedFeatures.linkcapturePoint.y, selectCtrl.selectedFeatures.linkcapturePoint.x));
                            feature.points.push(fastmap.mapApi.point(selectCtrl.selectedFeatures.geometry.x, selectCtrl.selectedFeatures.geometry.y));
                            feature.points.push(selectCtrl.selectedFeatures.linkcapturePoint.y, selectCtrl.selectedFeatures.linkcapturePoint.x);
                            feature.type = 'ADMINPOINT';
                            feature.id = selectCtrl.selectedFeatures.id;
                            shapeCtrl.shapeEditorResult.setFinalGeometry(feature);
                            selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                            layerCtrl.pushLayerFront('edit');
                        }
                        shapeCtrl.setEditingType('updateAdminPoint');
                        shapeCtrl.startEditing();

                        map.currentTool = shapeCtrl.getCurrentTool();
                        map.currentTool.enable();
                        map.currentTool.resultData = {};
                        map.currentTool.captureHandler.addGuideLayer(rdLink);
                        tooltipsCtrl.setCurrentTooltip('开始修改行政区划代表点！', 'info');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('先选择行政区划代表点！', 'warn');
                    }
                    return;
                } else if (type === 'PATHVERTEXINSERT') {
                    // 防止用户混合操作，原因是，打断、修改方向、增加形状点(删除，移动形状点)是分开的保存方法
                    if (shapeCtrl.editType && !(shapeCtrl.editType == 'pathVertexReMove' || shapeCtrl.editType == 'pathVertexInsert' || shapeCtrl.editType == 'pathVertexMove')) { // 这样做的原因是，打断、修改方向、增加形状点(删除，移动形状点)是分开的保存方法
                        // tooltipsCtrl.setCurrentTooltip('<span style="color: red;">线的方向已修改或者已进行了打断操作，请先按空格键保存！</span>');
                        tooltipsCtrl.setCurrentTooltip('线的方向已修改或者已进行了打断操作，请先按空格键保存！', 'error');
                        return;
                    }
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('insertDot');
                        tooltipsCtrl.setCurrentTooltip('开始插入形状点！');
                        tooltipsCtrl.setChangeInnerHtml('点击继续增加形状点或按Esc/space取消或保存操作!');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('正要插入形状点,先选择线！');
                        return;
                    }
                } else if (type.split('_')[0] === 'PATHVERTEXREMOVE') {
                    // 防止用户混合操作，原因是，打断、修改方向、增加形状点(删除，移动形状点)是分开的保存方法
                    if (shapeCtrl.editType && !(shapeCtrl.editType == 'pathVertexReMove' || shapeCtrl.editType == 'pathVertexInsert' || shapeCtrl.editType == 'pathVertexMove')) { // 这样做的原因是，打断、修改方向、增加形状点(删除，移动形状点)是分开的保存方法
                        // tooltipsCtrl.setCurrentTooltip('<span style="color: red;">线的方向已修改或者已进行了打断操作，请先按空格键保存！</span>');
                        tooltipsCtrl.setCurrentTooltip('线的方向已修改或者已进行了打断操作，请先按空格键保存！', 'error');
                        return;
                    }
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('deleteDot');
                        tooltipsCtrl.setCurrentTooltip('删除此形状点！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('正要删除形状点,先选择线！');
                        return;
                    }
                } else if (type === 'PATHDEPARTNODE') {
                    // 防止用户混合操作，原因是，打断、修改方向、增加形状点(删除，移动形状点)是分开的保存方法
                    if (shapeCtrl.editType && !(shapeCtrl.editType == 'PATHDEPARTNODE')) { // 这样做的原因是，打断、修改方向、增加形状点(删除，移动形状点)是分开的保存方法
                        // tooltipsCtrl.setCurrentTooltip('<span style="color: red;">道路线的端点已经修改过或分离，请先按空格键保存！</span>');
                        tooltipsCtrl.setCurrentTooltip('道路线的端点已经修改过或分离，请先按空格键保存！', 'error');
                        return;
                    }
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('deleteDot');
                        tooltipsCtrl.setCurrentTooltip('开始移动分离节点或移动端点！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('正要进行分离节点,请选择要分离的端点进行移动！');
                        return;
                    }
                } else if (type === 'TRANSFORMDIRECT') {
                    if (shapeCtrl.editType && shapeCtrl.editType != 'transformDirect') { // 防止用户混合操作，原因是，打断、修改方向、增加形状点(删除，移动形状点)是分开的保存方法
                        // tooltipsCtrl.setCurrentTooltip('<span style="color: red;">线的形状已修改或者已进行了打断操作，请先按空格键保存！</span>');
                        tooltipsCtrl.setCurrentTooltip('线的形状已修改或者已进行了打断操作，请先按空格键保存！', 'error');
                        return;
                    }
                    if (selectCtrl.selectedFeatures) {
                        if (selectCtrl.selectedFeatures.type == 'Marker') {
                            selectCtrl.selectedFeatures.direct = $scope.changeSpeedDirect(selectCtrl.selectedFeatures.direct);
                        } else {
                            selectCtrl.selectedFeatures.direct = $scope.changeDirect(selectCtrl.selectedFeatures.direct);
                        }
                        objCtrl.data.direct = selectCtrl.selectedFeatures.direct;
                        // eventController.fire('directChange', objCtrl.data["direct"]);
                        objCtrl.data.changeDirect(objCtrl.data.direct);
                        // 如果有打开的二级面板（限速的二级面板），需要关掉
                        $scope.$emit('SWITCHCONTAINERSTATE', {
                            subAttrContainerTpl: false
                        });
                        $scope.$apply();
                        tooltipsCtrl.setEditEventType('transformDirection');
                        tooltipsCtrl.setCurrentTooltip('修改方向！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('修改方向,先选择线！');
                        return;
                    }
                } else if (type === 'PATHVERTEXMOVE') {
                    // 防止用户混合操作，原因是，打断、修改方向、增加形状点(删除，移动形状点)是分开的保存方法
                    if (shapeCtrl.editType && !(shapeCtrl.editType == 'pathVertexReMove' || shapeCtrl.editType == 'pathVertexInsert' || shapeCtrl.editType == 'pathVertexMove')) { // 这样做的原因是，打断、修改方向、增加形状点(删除，移动形状点)是分开的保存方法
                        // tooltipsCtrl.setCurrentTooltip('<span style="color: red;">线的方向已修改或者已进行了打断操作，请先按空格键保存！</span>');
                        tooltipsCtrl.setCurrentTooltip('线的方向已修改或者已进行了打断操作，请先按空格键保存！', 'error');
                        return;
                    }
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('moveDot');
                        tooltipsCtrl.setCurrentTooltip('拖拽修改形状点位置！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('正要移动形状点先选择线！');
                        return;
                    }
                } else if (type === 'PATHBREAK') {
                    if (shapeCtrl.editType && shapeCtrl.editType != 'pathBreak') { // 防止用户混合操作，原因是，打断、修改方向、增加形状点(删除，移动形状点)是分开的保存方法
                        // tooltipsCtrl.setCurrentTooltip('<span style="color: red;">线的形状或者方向已变化但未保存，请先按空格键保存！</span>');
                        tooltipsCtrl.setCurrentTooltip('线的形状或者方向已变化但未保存，请先按空格键保存！', 'error');
                        return;
                    }
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('pathBreak');
                        tooltipsCtrl.setCurrentTooltip('开始打断link！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('正要开始打断link,先选择线！');
                        return;
                    }
                } else if (type === 'ADDPAIRBOND') { // 配对电子眼
                    eventController.off(eventController.eventTypes.GETRELATIONID);
                    map.currentTool = new fastmap.uikit.SelectRelation({
                        map: map,
                        relationFlag: true
                    });
                    map.currentTool.enable();
                    editLayer.bringToBack();
                    tooltipsCtrl.setCurrentTooltip('请选择配对的电子眼！');
                    eventController.on(eventController.eventTypes.GETRELATIONID, function (data) {
                        $scope.selectedFeature = data;
                        $scope.$emit('SWITCHCONTAINERSTATE', {
                            subAttrContainerTpl: false
                        });
                        // 清除上一个选择的高亮
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        dsEdit.getByPid(data.id.toString(), 'RDELECTRONICEYE').then(function (elecData) {
                            if (objCtrl.data.kind == 20 && elecData.kind == 21) {
                                featCodeCtrl.setFeatCode({
                                    startPid: objCtrl.data.pid.toString(),
                                    endPid: data.id.toString()
                                });
                            } else if (objCtrl.data.kind == 21 && elecData.kind == 20) {
                                featCodeCtrl.setFeatCode({
                                    startPid: data.id.toString(),
                                    endPid: objCtrl.data.pid.toString()
                                });
                            } else {
                                swal('操作失败', '请选择电子眼类型为“区间测速开始”和“区间测速结束”！', 'warning');
                                return;
                            }
                            // 设置热键修改时的监听类型;
                            shapeCtrl.setEditingType('ADDELECTRONICGROUP');
                            // 退出线选完后的鼠标提示;
                            tooltipsCtrl.setCurrentTooltip('点击空格新增区间从测速电子眼组成！');
                        });
                    });
                    return;
                } else if (type === 'PATHNODEMOVE') {
                    if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('pathNodeMove');
                        tooltipsCtrl.setCurrentTooltip('开始移动node！');
                        tooltipsCtrl.setChangeInnerHtml('按Esc/space取消或保存操作!');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('正要开始移动node,先选择node！');
                        return;
                    }
                } else if (type === 'TRANSFORMSPEEDDIRECT') {
                    map.currentTool = shapeCtrl.getCurrentTool();
                    map.currentTool.disable();
                    var containerPoint;
                    dsEdit.getByPid(objCtrl.data.linkPid, 'RDLINK').then(function (data) {
                        if (data) {
                            var SpeedPoint = {
                                x: objCtrl.data.geometry.coordinates[0],
                                y: objCtrl.data.geometry.coordinates[1]
                            };
                            var tp = map.latLngToContainerPoint([SpeedPoint.y, SpeedPoint.x]),
                                dist,
                                sVertex,
                                eVertex,
                                d1,
                                d2,
                                d3;
                            for (var i = 0, len = data.geometry.coordinates.length - 1; i < len; i++) {
                                sVertex = map.latLngToContainerPoint(L.latLng(data.geometry.coordinates[i][1], data.geometry.coordinates[i][0]));
                                eVertex = map.latLngToContainerPoint(L.latLng(data.geometry.coordinates[i + 1][1], data.geometry.coordinates[i + 1][0]));
                                dist = L.LineUtil.pointToSegmentDistance(tp, sVertex, eVertex);
                                if (dist < 5) {
                                    d1 = (tp.x - sVertex.x) * (tp.x - sVertex.x) + (tp.y - sVertex.y) * (tp.y - sVertex.y);
                                    d2 = (tp.x - eVertex.x) * (tp.x - eVertex.x) + (tp.y - eVertex.y) * (tp.y - eVertex.y);
                                    d3 = (sVertex.x - eVertex.x) * (sVertex.x - eVertex.x) + (sVertex.y - eVertex.y) * (sVertex.y - eVertex.y);
                                    if ((d1 < d3) && (d1 + d2 <= d3 + 1)) {
                                        break;
                                    }
                                }
                            }
                            var angle = $scope.angleOfLink(sVertex, eVertex);
                            if (parseInt(objCtrl.data.direct) == 3 && (tp.x > eVertex.x || (tp.x == eVertex.x && tp.y > eVertex.y))) {
                                angle = angle + Math.PI;
                            }
                            if (parseInt(objCtrl.data.direct) == 2 && (tp.x > eVertex.x || (tp.x == eVertex.x && tp.y > eVertex.y))) {
                                angle = Math.PI + angle;
                            }
                            var marker = {
                                flag: false,
                                pid: objCtrl.data.pid,
                                point: SpeedPoint,
                                type: 'marker',
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
                            shapeCtrl.setEditingType('transformSpeedDirect');
                            shapeCtrl.startEditing();
                            tooltipsCtrl.setCurrentTooltip('点击方向图标开始修改方向！');
                            eventController.off(eventController.eventTypes.DIRECTEVENT);
                            eventController.on(eventController.eventTypes.DIRECTEVENT, function (event) {
                                featCodeCtrl.setFeatCode({
                                    pid: objCtrl.data.pid,
                                    direct: parseInt(event.geometry.orientation)
                                });
                            });
                        }
                    });
                    return;
                } else if (type === 'MODIFYSPEEDNODE') {
                    var pid = parseInt(selectCtrl.selectedFeatures.id),
                        linkPid = parseInt(selectCtrl.selectedFeatures.linkPid),
                        currentLink = null;
                    if (shapeCtrl.shapeEditorResult) {
                        shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point($scope.selectedFeature.event.latlng.lng, $scope.selectedFeature.event.latlng.lat)]));
                        selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                        layerCtrl.pushLayerFront('edit');
                    }
                    shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.UPDATESPEEDNODE);
                    shapeCtrl.startEditing();
                    map.currentTool = shapeCtrl.getCurrentTool();
                    map.currentTool.enable();
                    map.currentTool.snapHandler.addGuideLayer(rdLink);
                    tooltipsCtrl.setEditEventType('updateSpeedNode');
                    tooltipsCtrl.setCurrentTooltip('请选择新的位置点！');

                    eventController.off(eventController.eventTypes.RESETCOMPLETE);
                    eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                        var pro = e.property;
                        var actualDistance = $scope.selectedFeature.event.latlng.distanceTo(new L.latLng(shapeCtrl.shapeEditorResult.getFinalGeometry().y, shapeCtrl.shapeEditorResult.getFinalGeometry().x));
                        if (actualDistance > 50) {
                            selectCtrl.selectedFeatures = null;
                            editLayer.drawGeometry = null;
                            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                            editLayer.clear();
                            // tooltipsCtrl.setCurrentTooltip('<span style="color: red">移动距离必须小于50米，请重新选择位置！</span>');
                            tooltipsCtrl.setCurrentTooltip('移动距离必须小于50米，请重新选择位置！', 'error');
                        } else {
                            var point = $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry());
                            var speedData = {
                                pid: pid,
                                longitude: point.x,
                                latitude: point.y,
                                objStatus: 'UPDATE',
                                linkPid: parseInt(pro.id)
                            };
                            if (pro.id != currentLink) {
                                currentLink = pro.id;
                                dsEdit.getByPid(pro.id, 'RDLINK').then(function (data) {
                                    if (data) {
                                        selectCtrl.onSelected({
                                            geometry: data.geometry.coordinates,
                                            id: data.pid,
                                            direct: pro.direct,
                                            point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                                        });
                                        featCodeCtrl.setFeatCode({
                                            speedData: speedData
                                        });
                                        tooltipsCtrl.setCurrentTooltip('点击空格键保存操作或者按ESC键取消!');
                                    }
                                });
                            } else {
                                featCodeCtrl.setFeatCode({
                                    speedData: speedData
                                });
                                tooltipsCtrl.setCurrentTooltip('点击空格键保存操作或者按ESC键取消!');
                            }
                        }
                    });
                    return;
                } else if (type === 'MODIFYMILEAGEPILE') {
                    shapeCtrl.editFeatType = null;
                    var pid = parseInt(selectCtrl.selectedFeatures.id),
                        linkPid = parseInt(selectCtrl.selectedFeatures.linkPid),
                        currentLink = null;
                    if (shapeCtrl.shapeEditorResult) {
                        shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point($scope.selectedFeature.event.latlng.lng, $scope.selectedFeature.event.latlng.lat)]));
                        selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                        layerCtrl.pushLayerFront('edit');
                    }
                    shapeCtrl.setEditingType('updateMileagePile');
                    shapeCtrl.startEditing();
                    map.currentTool = shapeCtrl.getCurrentTool();
                    map.currentTool.snapHandler.addGuideLayer(rdLink);
                    map.currentTool.enable();
                    tooltipsCtrl.setEditEventType('updateSpeedNode');
                    tooltipsCtrl.setCurrentTooltip('请选择新的位置点！', 'info');
                    eventController.off(eventController.eventTypes.RESETCOMPLETE);
                    eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                        var pro = e.property;
                        /* 判断所选的位置是否满足条件*/
                        if (['1', '2', '3', '4'].indexOf(pro.kind) == -1) {
                            editLayer.drawGeometry = null;
                            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                            editLayer.clear();
                            tooltipsCtrl.notify('里程桩关联link不能是1,2,3,4级以外的道路！', 'error');
                            return;
                        }
                        dsEdit.getByPid(pro.id, 'RDLINK').then(function (data) {
                            if (e.latlng.distanceTo(new L.latLng(data.geometry.coordinates[0][1], data.geometry.coordinates[0][0])) < 1 || e.latlng.distanceTo(new L.latLng(data.geometry.coordinates[data.geometry.coordinates.length - 1][1], data.geometry.coordinates[data.geometry.coordinates.length - 1][0])) < 1) {
                                selectCtrl.selectedFeatures = null;
                                editLayer.drawGeometry = null;
                                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                                editLayer.clear();
                                tooltipsCtrl.notify('道路的端点不能作为里程桩，请重新选择位置！', 'error');
                                return;
                            }
                            if (data) {
                                shapeCtrl.editFeatType = 'mileagePile';
                                var point = $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry());
                                var mileagePile = {
                                    pid: pid,
                                    longitude: point.x,
                                    latitude: point.y,
                                    linkPid: parseInt(pro.id)
                                };
                                featCodeCtrl.setFeatCode({
                                    mileagePile: mileagePile
                                });
                                tooltipsCtrl.setCurrentTooltip('点击空格键保存操作或者按ESC键取消!', 'info');
                            }
                        });
                    });
                    return;
                } else if (type === 'MODIFYHGWGLIMITNODE') { // 限高限重点位
                    var hgwgLimitData = selectCtrl.selectedFeatures;
                    if (shapeCtrl.shapeEditorResult) {
                        // shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point($scope.selectedFeature.event.latlng.lng, $scope.selectedFeature.event.latlng.lat)]));
                        shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.lineString([fastmap.mapApi.point(hgwgLimitData.data.geometry.coordinates[0], hgwgLimitData.data.geometry.coordinates[1])]));
                        selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                        layerCtrl.pushLayerFront('edit');
                    }
                    shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.UPDATEHGWHLIMITNODE);
                    shapeCtrl.startEditing();
                    map.currentTool = shapeCtrl.getCurrentTool();
                    map.currentTool.enable();
                    map.currentTool.snapHandler.addGuideLayer(rdLink);
                    tooltipsCtrl.setEditEventType(fastmap.mapApi.ShapeOptionType.UPDATEHGWHLIMITNODE);
                    tooltipsCtrl.setCurrentTooltip('请选择新的位置点！');

                    eventController.off(eventController.eventTypes.RESETCOMPLETE);
                    eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                        var pro = e.property;
                        var actualDistance = $scope.selectedFeature.event.latlng.distanceTo(new L.latLng(shapeCtrl.shapeEditorResult.getFinalGeometry().y, shapeCtrl.shapeEditorResult.getFinalGeometry().x));
                        if (actualDistance > 50) {
                            selectCtrl.selectedFeatures = null;
                            editLayer.drawGeometry = null;
                            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                            editLayer.clear();
                            tooltipsCtrl.setCurrentTooltip('移动距离必须小于50米，请重新选择位置！', 'error');
                        } else {
                            var tempData = {
                                pid: hgwgLimitData.data.pid,
                                lat: e.latlng.lat,
                                lng: e.latlng.lng,
                                linkPid: pro.id
                            };
                            // featCodeCtrl.setFeatCode({
                            //     "hgwgLimat": tempData
                            // });
                            featCodeCtrl.setFeatCode(tempData);
                            tooltipsCtrl.setCurrentTooltip('点击空格键保存操作或者按ESC键取消！');
                            // var point = $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry());
                            // var speedData = {
                            //     pid: pid,
                            //     longitude: point.x,
                            //     latitude: point.y,
                            //     objStatus: "UPDATE",
                            //     linkPid:parseInt(pro.id)
                            // };
                            // if(pro.id != currentLink){
                            //     currentLink = pro.id;
                            //     dsEdit.getByPid(pro.id, "RDLINK").then(function(data) {
                            //         if (data) {
                            //             selectCtrl.onSelected({
                            //                 geometry: data.geometry.coordinates,
                            //                 id: data.pid,
                            //                 direct: pro.direct,
                            //                 point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                            //             });
                            //             featCodeCtrl.setFeatCode({
                            //                 "speedData": speedData
                            //             });
                            //             tooltipsCtrl.setCurrentTooltip('点击空格键保存操作或者按ESC键取消!');
                            //         }
                            //     })
                            // } else {
                            //     featCodeCtrl.setFeatCode({
                            //         "speedData": speedData
                            //     });
                            //     tooltipsCtrl.setCurrentTooltip('点击空格键保存操作或者按ESC键取消!');
                            // }
                        }
                    });
                    return;
                } else if (type === 'MODIFYNODE') {
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

                    eventController.off(eventController.eventTypes.RESETCOMPLETE);
                    eventController.on(eventController.eventTypes.RESETCOMPLETE, function (e) {
                        var pro = e.property;
                        var actualDistance = transform.distance($scope.selectedFeature.event.latlng.lat, $scope.selectedFeature.event.latlng.lng, shapeCtrl.shapeEditorResult.getFinalGeometry().y, shapeCtrl.shapeEditorResult.getFinalGeometry().x);
                        /* if(parseInt(pro.id) != objCtrl.data.linkPid){
                            swal("操作失败", '拓扑操作不满足条件！', "warning");
                            tooltipsCtrl.setCurrentTooltip('请重新移动电子眼点位!');
                            return;
                        }*/
                        function setFeatcode() {
                            dsEdit.getByPid(pro.id, 'RDLINK').then(function (linkData) {
                                if (linkData) {
                                    featCodeCtrl.setFeatCode({
                                        linkPid: linkData.pid.toString(),
                                        pid: objCtrl.data.pid.toString(),
                                        longitude: shapeCtrl.shapeEditorResult.getFinalGeometry().x,
                                        latitude: shapeCtrl.shapeEditorResult.getFinalGeometry().y
                                    });
                                    selectCtrl.onSelected({
                                        geometry: linkData.geometry.coordinates,
                                        id: linkData.pid,
                                        direct: pro.direct,
                                        point: $.extend(true, {}, shapeCtrl.shapeEditorResult.getFinalGeometry())
                                    });
                                    shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                                    tooltipsCtrl.setCurrentTooltip('请点击空格,移动电子眼点位!');
                                    shapeCtrl.setEditingType('updateElecNode');
                                }
                            });
                        }
                        if (actualDistance > 100) {
                            swal('操作失败', '移动距离必须小于100米！', 'warning');
                            tooltipsCtrl.setCurrentTooltip('请重新移动电子眼点位!');
                        } else {
                            dsEdit.getByPid(objCtrl.data.linkPid, 'RDLINK').then(function (data) {
                                if (data) {
                                    // 同一条link
                                    if (parseInt(pro.id) == objCtrl.data.linkPid) {
                                        setFeatcode();
                                        return;
                                    }
                                    if (data.sNodePid != parseInt(pro.enode) && data.eNodePid != parseInt(pro.snode)) {
                                        swal('操作失败', '拓扑操作不满足条件！', 'warning');
                                        tooltipsCtrl.setCurrentTooltip('请重新移动电子眼点位!');
                                        return;
                                    }
                                    if (data.sNodePid == parseInt(pro.enode) || data.eNodePid == parseInt(pro.snode)) { // 联通link
                                        var commonPoint = null;
                                        if (data.sNodePid == parseInt(pro.enode)) {
                                            commonPoint = data.sNodePid;
                                        }
                                        if (data.eNodePid == parseInt(pro.snode)) {
                                            commonPoint = data.eNodePid;
                                        }
                                        var param = {
                                            type: 'RDLINK',
                                            dbId: App.Temp.dbId,
                                            data: {
                                                nodePid: commonPoint
                                            }
                                        };
                                        dsEdit.getByCondition(param).then(function (nodeData) {
                                            if (nodeData.errcode == 0) {
                                                if (nodeData.data.length > 2) {
                                                    swal('操作失败', '拓扑操作不满足条件！', 'warning');
                                                    tooltipsCtrl.setCurrentTooltip('请重新移动电子眼点位!');
                                                } else {
                                                    setFeatcode();
                                                }
                                            }
                                            tooltipsCtrl.setCurrentTooltip('请重新移动电子眼点位!');
                                        });
                                    }
                                }
                            });
                        }
                        /* if(actualDistance > 100){
                            swal("操作失败", '移动距离必须小于100米！', "warning");
                            tooltipsCtrl.setCurrentTooltip('请重新移动电子眼点位!');
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
                        }*/
                    });
                    return;
                } else if (type === 'MODIFYOUTLINE') {
                    map.currentTool = new fastmap.uikit.SelectPath({
                        map: map,
                        currentEditLayer: rdLink,
                        linksFlag: true,
                        shapeEditor: shapeCtrl
                    });
                    map.currentTool.enable();
                    tooltipsCtrl.setCurrentTooltip('开始修改关联Link！');
                    eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        // 退出线;
                        highRenderCtrl.highLightFeatures.push({
                            id: data.id,
                            layerid: 'rdLink',
                            type: 'line',
                            style: {}
                        });
                        // 绘制当前的退出线
                        highRenderCtrl.drawHighlight();
                        // 设置热键修改时的监听类型;
                        shapeCtrl.setEditingType('UPDATEELECTRONICEYE');
                        // 退出线选完后的鼠标提示;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！');
                        // 设置修改确认的数据;
                        featCodeCtrl.setFeatCode({
                            linkPid: data.id.toString(),
                            pid: objCtrl.data.pid.toString(),
                            objStatus: 'UPDATE'
                        });
                    });
                    return;
                } else if (type === 'MODIFYRDCROSS') {
                    var rdCrossData = objCtrl.data;
                    var modifyCross = {
                        pid: rdCrossData.pid,
                        nodePids: []
                    };
                    for (var i = 0, len = rdCrossData.nodes.length; i < len; i++) {
                        modifyCross.nodePids.push(rdCrossData.nodes[i].nodePid);
                    }
                    map.currentTool.disable();
                    map.currentTool = new fastmap.uikit.SelectNode({
                        map: map,
                        nodesFlag: true,
                        shapeEditor: shapeCtrl
                    });
                    map.currentTool.enable();
                    // 添加自动吸附的图层
                    map.currentTool.snapHandler.addGuideLayer(rdNode);
                    eventController.off(eventController.eventTypes.GETNODEID);
                    eventController.on(eventController.eventTypes.GETNODEID, function (data) {
                        if (editLayer.drawGeometry) {
                            editLayer.drawGeometry = null;
                            editLayer.bringToBack();
                            editLayer.clear();
                        }
                        if (modifyCross.nodePids.indexOf(parseInt(data.id)) < 0) { // 不存在于现有的node中
                            modifyCross.nodePids.push(parseInt(data.id));
                        } else {
                            modifyCross.nodePids.splice(modifyCross.nodePids.indexOf(parseInt(data.id)), 1);
                        }
                        highRenderCtrl._cleanHighLight();
                        for (var i = 0, len = modifyCross.nodePids.length; i < len; i++) {
                            highRenderCtrl.highLightFeatures.push({
                                id: modifyCross.nodePids[i].toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                        }
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltip('继续选择NODE或者按空格保存!');
                        shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.MODIFYRDCROSS);
                        shapeCtrl.shapeEditorResult.setFinalGeometry(modifyCross);
                    });
                    return;
                } else if (type === 'MODIFYLINKPID') {
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
                    var outLinkPids = null;
                    var param1 = {};
                    param1.dbId = App.Temp.dbId;
                    param1.type = 'RDLINK';
                    param1.data = {
                        nodePid: selData.nodePid
                    };
                    if (slopeVias && slopeVias.length >= 0) {
                        for (var i = 0; i < slopeVias.length; i++) {
                            if (conLinkPids.indexOf(slopeVias[i].linkPid) < 0) {
                                conLinkPids.push(slopeVias[i].linkPid);
                            }
                        }
                    }
                    dsEdit.getByCondition(param1).then(function (exLinks) { // 退出线操作
                        if (exLinks.errcode === -1) {
                            return;
                        }
                        if (exLinks.data) {
                            if (exLinks.data.length == 1) {
                                swal('无法改退出线', '此进入点只有一条可选退出线！', 'info');
                            } else if (exLinks.data.length == 2) {
                                comPids = [];
                                comPids.push(exLinks.data[0].pid);
                                comPids.push(exLinks.data[1].pid);
                                if (exLinks.data[0].pid == selData.linkPid) {
                                    highRenderCtrl.highLightFeatures.push({
                                        id: exLinks.data[1].pid,
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {
                                            color: '#FF79BC'
                                        }
                                    });
                                } else {
                                    highRenderCtrl.highLightFeatures.push({
                                        id: exLinks.data[0].pid,
                                        layerid: 'rdLink',
                                        type: 'line',
                                        style: {
                                            color: '#FF79BC'
                                        }
                                    });
                                }
                                highRenderCtrl.drawHighlight();
                            }
                        }
                    });
                    tooltipsCtrl.setCurrentTooltip('请选择新的退出线！');
                    eventController.off(eventController.eventTypes.GETLINKID);
                    eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                        if (comPids.indexOf(parseInt(data.id)) > -1 && parseInt(data.id) != selData.linkPid) {
                            outLinkPids = data.id.toString();
                            highRenderCtrl._cleanHighLight();
                            highRenderCtrl.highLightFeatures = [];
                            highRenderCtrl.highLightFeatures.push({
                                id: selData.nodePid.toString(),
                                layerid: 'rdLink',
                                type: 'node',
                                style: {}
                            });
                            highRenderCtrl.highLightFeatures.push({
                                id: data.id,
                                layerid: 'rdLink',
                                type: 'line',
                                style: {
                                    color: 'red'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            conLinkPids = [];
                        } else if (comPids.indexOf(parseInt(data.id)) > -1 && parseInt(data.id) == selData.nodePid) {
                            tooltipsCtrl.setCurrentTooltip('请选择新的退出线！');
                        } else {
                            conLinkPids.push(parseInt(data.id));
                        }
                        shapeCtrl.setEditingType('UPDATERDSLOPE'); // 设置热键修改时的监听类型;
                        tooltipsCtrl.setCurrentTooltip('继续选择线或者点击空格保存修改！'); // 退出线选完后的鼠标提示;
                        featCodeCtrl.setFeatCode({ // 设置修改确认的数据;
                            linkPid: outLinkPids,
                            linkPids: conLinkPids,
                            objStatus: 'UPDATE'
                        });
                    });
                    return;
                } else if (type === 'MODIFYLINKPIDS') {
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
                    if (slopeVias && slopeVias.length == 0) { // 没有连续link
                        dsEdit.getByPid(parseInt(selData.linkPid), 'RDLINK').then(function (exLinkDetail) { // 查询退出线的详情
                            var param1 = {};
                            param1.dbId = App.Temp.dbId;
                            param1.type = 'RDLINK';
                            if (exLinkDetail.sNodePid == selData.nodePid) {
                                param1.data = {
                                    nodePid: exLinkDetail.eNodePid
                                };
                            } else {
                                param1.data = {
                                    nodePid: exLinkDetail.sNodePid
                                };
                            }
                            dsEdit.getByCondition(param1).then(function (conLinks) { // 找出退出线另一个节点的挂接线
                                if (conLinks.errcode === -1) {
                                    return;
                                }
                                if (conLinks.data) {
                                    if (conLinks.data.length > 2) {
                                        swal('无法改连续Link', '此退出线挂接Link个数大于2！', 'info');
                                    } else if (conLinks.data.length == 2) {
                                        comPids = [];
                                        comPids.push(conLinks.data[0].pid);
                                        comPids.push(conLinks.data[1].pid);
                                        tooltipsCtrl.setCurrentTooltip('请添加连续Link！');
                                    }
                                }
                            });
                        });
                    } else if (slopeVias && slopeVias.length > 0) {
                        for (var i = 0; i < slopeVias.length; i++) {
                            if (conLinkPids.indexOf(slopeVias[i].linkPid) < 0) {
                                conLinkPids.push(slopeVias[i].linkPid);
                            }
                        }
                        // 下面是查询最后一条连续link的前面一条link的详情，以确定最后一条连续link的哪个点是要查询的挂接点
                        if (slopeVias.length == 1) {
                            dsEdit.getByPid(parseInt(selData.linkPid), 'RDLINK').then(function (exLinkDetail) { // 查询退出线的详情
                                linkDetail = exLinkDetail;
                                // 查询最后一条连续link的详情，并选择出要查询的挂接点
                                dsEdit.getByPid(parseInt(slopeVias[slopeVias.length - 1].linkPid), 'RDLINK').then(function (newLinkDetail) {
                                    if (newLinkDetail.eNodePid != linkDetail.eNodePid && newLinkDetail.eNodePid != linkDetail.sNodePid) {
                                        linkNodePid = newLinkDetail.eNodePid;
                                    } else {
                                        linkNodePid = newLinkDetail.sNodePid;
                                    }
                                    var param = {};
                                    param.dbId = App.Temp.dbId;
                                    param.type = 'RDLINK';
                                    param.data = {
                                        nodePid: linkNodePid
                                    };
                                    dsEdit.getByCondition(param).then(function (conLinks) { // 找出连续link另一个节点的挂接线
                                        if (conLinks.errcode === -1) {
                                            return;
                                        }
                                        if (conLinks.data) {
                                            if (conLinks.data.length > 2 || conLinks.data.length == 1) {
                                                comPids = [];
                                                tooltipsCtrl.setCurrentTooltip('请删除连续Link！');
                                            } else if (conLinks.data.length == 2) {
                                                comPids = [];
                                                comPids.push(conLinks.data[0].pid);
                                                comPids.push(conLinks.data[1].pid);
                                                tooltipsCtrl.setCurrentTooltip('请修改连续Link！');
                                            }
                                        }
                                    });
                                });
                            });
                        } else {
                            dsEdit.getByPid(parseInt(slopeVias[slopeVias.length - 2].linkPid), 'RDLINK').then(function (conLinkDetail) { // 查询倒数第二条连续link的详情
                                linkDetail = conLinkDetail;
                                // 查询最后一条连续link的详情，并选择出要查询的挂接点
                                dsEdit.getByPid(parseInt(slopeVias[slopeVias.length - 1].linkPid), 'RDLINK').then(function (newLinkDetail) {
                                    if (newLinkDetail.eNodePid != linkDetail.eNodePid && newLinkDetail.eNodePid != linkDetail.sNodePid) {
                                        linkNodePid = newLinkDetail.eNodePid;
                                    } else {
                                        linkNodePid = newLinkDetail.sNodePid;
                                    }
                                    var param = {};
                                    param.dbId = App.Temp.dbId;
                                    param.type = 'RDLINK';
                                    param.data = {
                                        nodePid: linkNodePid
                                    };
                                    dsEdit.getByCondition(param).then(function (conLinks) { // 找出连续link另一个节点的挂接线
                                        if (conLinks.errcode === -1) {
                                            return;
                                        }
                                        if (conLinks.data) {
                                            if (conLinks.data.length > 2 || conLinks.data.length == 1) {
                                                comPids = [];
                                                tooltipsCtrl.setCurrentTooltip('请删除连续Link！');
                                            } else if (conLinks.data.length == 2) {
                                                comPids = [];
                                                comPids.push(conLinks.data[0].pid);
                                                comPids.push(conLinks.data[1].pid);
                                                tooltipsCtrl.setCurrentTooltip('请修改连续Link！');
                                            }
                                        }
                                    });
                                });
                            });
                        }
                    }
                    eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                        if (comPids && comPids.indexOf(parseInt(data.id)) > -1) { // 添加连续link
                            if (conLinkPids.indexOf(parseInt(data.id)) < 0) {
                                conLinkPids.push(parseInt(data.id));
                            }
                            highRenderCtrl.highLightFeatures.push({
                                id: data.id,
                                layerid: 'rdLink',
                                type: 'line',
                                style: {
                                    color: '#FF79BC'
                                }
                            });
                            highRenderCtrl.drawHighlight();
                            dsEdit.getByPid(parseInt(data.id), 'RDLINK').then(function (newLinkDetail) { // 保持linkNodePid是最后一个挂接点
                                if (newLinkDetail.eNodePid == linkNodePid) {
                                    linkNodePid = newLinkDetail.sNodePid;
                                } else {
                                    linkNodePid = newLinkDetail.eNodePid;
                                }
                                var param = {};
                                param.dbId = App.Temp.dbId;
                                param.type = 'RDLINK';
                                param.data = {
                                    nodePid: linkNodePid
                                };
                                dsEdit.getByCondition(param).then(function (conLinks) { // 找出连续link另一个节点的挂接线
                                    if (conLinks.errcode === -1) {
                                        return;
                                    }
                                    if (conLinks.data) {
                                        if (conLinks.data.length > 2 || conLinks.data.length == 1) {
                                            comPids = [];
                                            tooltipsCtrl.setCurrentTooltip('请删除连续Link！');
                                        } else if (conLinks.data.length == 2) {
                                            comPids = [];
                                            comPids.push(conLinks.data[0].pid);
                                            comPids.push(conLinks.data[1].pid);
                                            tooltipsCtrl.setCurrentTooltip('请修改连续Link！');
                                        }
                                    }
                                });
                            });
                        } else if (conLinkPids && conLinkPids[conLinkPids.length - 1] == (parseInt(data.id))) { // 删除最后一条连续link
                            conLinkPids.pop();
                            highRenderCtrl._cleanHighLight();
                            for (var i = 0; i < highRenderCtrl.highLightFeatures.length; i++) {
                                if (highRenderCtrl.highLightFeatures[i].id == data.id) {
                                    highRenderCtrl.highLightFeatures.splice(i, 1);
                                    i--;
                                }
                            }
                            highRenderCtrl.drawHighlight();
                            // 下面是查询最后一条连续link的前面一条link的详情，以确定最后一条连续link的哪个点是要查询的挂接点
                            if (conLinkPids.length == 1) {
                                dsEdit.getByPid(parseInt(selData.linkPid), 'RDLINK').then(function (exLinkDetail) { // 查询退出线的详情
                                    linkDetail = exLinkDetail;
                                });
                            } else {
                                dsEdit.getByPid(parseInt(conLinkPids[conLinkPids.length - 2]), 'RDLINK').then(function (conLinkDetail) { // 查询倒数第二条连续link的详情
                                    linkDetail = conLinkDetail;
                                });
                            }
                            // 查询最后一条连续link的详情，并选择出要查询的挂接点
                            dsEdit.getByPid(parseInt(conLinkPids[conLinkPids.length - 1]), 'RDLINK').then(function (newLinkDetail) {
                                if (newLinkDetail.eNodePid != linkDetail.eNodePid && newLinkDetail.eNodePid != linkDetail.sNodePid) {
                                    linkNodePid = newLinkDetail.eNodePid;
                                } else {
                                    linkNodePid = newLinkDetail.sNodePid;
                                }
                                var param = {};
                                param.dbId = App.Temp.dbId;
                                param.type = 'RDLINK';
                                param.data = {
                                    nodePid: linkNodePid
                                };
                                dsEdit.getByCondition(param).then(function (conLinks) { // 找出连续link另一个节点的挂接线
                                    if (conLinks.errcode === -1) {
                                        return;
                                    }
                                    if (conLinks.data) {
                                        if (conLinks.data.length > 2 || conLinks.data.length == 1) {
                                            comPids = [];
                                            tooltipsCtrl.setCurrentTooltip('请删除连续Link！');
                                        } else if (conLinks.data.length == 2) {
                                            comPids = [];
                                            comPids.push(conLinks.data[0].pid);
                                            comPids.push(conLinks.data[1].pid);
                                            tooltipsCtrl.setCurrentTooltip('请修改连续Link！');
                                        }
                                    }
                                });
                            });
                        }
                        shapeCtrl.setEditingType('UPDATERDSLOPE');
                        // 退出线选完后的鼠标提示;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！');
                        // 设置修改确认的数据;
                        featCodeCtrl.setFeatCode({
                            linkPid: selData.linkPid.toString(),
                            linkPids: conLinkPids,
                            objStatus: 'UPDATE'
                        });
                    });
                    return;
                } else if (type === 'ADDRDINTERPART') {
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [rdNode],
                        snapLayers: [rdNode] // 将rdnode放前面，优先捕捉
                    });
                    map.currentTool.enable();
                    var selData = objCtrl.data;
                    var linkPids = [];
                    var nodePids = [];
                    var links = selData.links;
                    var nodes = selData.nodes;
                    if (links && links.length >= 0) {
                        for (var i = 0; i < links.length; i++) {
                            if (linkPids.indexOf(links[i].linkPid) < 0) {
                                linkPids.push(links[i].linkPid);
                            }
                        }
                    }
                    if (nodes && nodes.length >= 0) {
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodePids.indexOf(nodes[i].nodePid) < 0) {
                                nodePids.push(nodes[i].nodePid);
                            }
                        }
                    }
                    tooltipsCtrl.setCurrentTooltip('请选择需要增加的点！');
                    eventController.on(eventController.eventTypes.GETFEATURE, function (data) {
                        highRenderCtrl._cleanHighLight();
                        if (data.optype == 'RDNODE') {
                            if (nodePids.indexOf(parseInt(data.id)) < 0) {
                                nodePids.push(parseInt(data.id));
                                highRenderCtrl.highLightFeatures.push({
                                    id: data.id.toString(),
                                    layerid: 'rdLink',
                                    type: 'node',
                                    style: {
                                        color: '#02F78E'
                                    }
                                });
                                var param1 = {};
                                param1.dbId = App.Temp.dbId;
                                param1.type = 'RDLINK';
                                param1.data = {
                                    nodePid: parseInt(data.id)
                                };
                                dsEdit.getByCondition(param1).then(function (exLinks) {
                                    if (exLinks.errcode === -1) {
                                        return;
                                    }
                                    if (exLinks.data) {
                                        for (var i = 0; i < exLinks.data.length; i++) {
                                            if (linkPids.indexOf(exLinks.data[i].pid) > -1) { // 某一条挂接link在crf里
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
                                                dsEdit.getByPid(exLinks.data[i].pid, 'RDLINK').then(function (linkData) {
                                                    if ((nodePids.indexOf(linkData.eNodePid) > -1 && linkData.eNodePid != parseInt(data.id)) || (nodePids.indexOf(linkData.sNodePid) > -1 && linkData.sNodePid != parseInt(data.id))) {
 // 线正好是中间部分,把线也加入

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
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        shapeCtrl.setEditingType('UPDATEINTER'); // 设置热键修改时的监听类型;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！'); // 退出线选完后的鼠标提示;
                        featCodeCtrl.setFeatCode({ // 设置修改确认的数据;
                            pid: selData.pid,
                            nodes: nodePids,
                            links: linkPids,
                            objStatus: 'UPDATE'
                        });
                    });
                    return;
                } else if (type === 'DELETERDINTERPART') {
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [crfData],
                        snapLayers: [crfData] // 将rdnode放前面，优先捕捉
                    });
                    map.currentTool.enable();
                    var selData = objCtrl.data;
                    var linkPids = [];
                    var nodePids = [];
                    var links = selData.links;
                    var nodes = selData.nodes;
                    if (links && links.length >= 0) {
                        for (var i = 0; i < links.length; i++) {
                            if (linkPids.indexOf(links[i].linkPid) < 0) {
                                linkPids.push(links[i].linkPid);
                            }
                        }
                    }
                    if (nodes && nodes.length >= 0) {
                        for (var i = 0; i < nodes.length; i++) {
                            if (nodePids.indexOf(nodes[i].nodePid) < 0) {
                                nodePids.push(nodes[i].nodePid);
                            }
                        }
                    }
                    tooltipsCtrl.setCurrentTooltip('请选择需要删除的点！');
                    eventController.on(eventController.eventTypes.GETFEATURE, function (data) {
                        highRenderCtrl._cleanHighLight();
                        if (data.optype == 'RDINTER') {
                            if (data.origType == 'Point') {
                                if (nodePids.indexOf(parseInt(data.nodeId)) > -1) {
                                    nodePids.splice(nodePids.indexOf(parseInt(data.nodeId)), 1);
                                    for (var i = 0; i < highRenderCtrl.highLightFeatures.length; i++) {
                                        if (highRenderCtrl.highLightFeatures[i].id == data.nodeId) {
                                            highRenderCtrl.highLightFeatures.splice(i, 1);
                                            i--;
                                        }
                                    }
                                    var param = {};
                                    param.dbId = App.Temp.dbId;
                                    param.type = 'RDLINK';
                                    param.data = {
                                        nodePid: parseInt(data.nodeId)
                                    };
                                    dsEdit.getByCondition(param).then(function (conLinks) { // 找出所有的挂接线，删除存在于范围内的
                                        highRenderCtrl._cleanHighLight();
                                        if (conLinks.errcode === -1) {
                                            return;
                                        }
                                        if (conLinks.data) {
                                            for (var i = 0; i < conLinks.data.length; i++) {
                                                if (linkPids.indexOf(conLinks.data[i].pid) > -1) {
                                                    linkPids.splice(linkPids.indexOf(conLinks.data[i].pid), 1);
                                                    for (var j = 0; j < highRenderCtrl.highLightFeatures.length; j++) {
                                                        if (highRenderCtrl.highLightFeatures[j].id == conLinks.data[i].pid) {
                                                            highRenderCtrl.highLightFeatures.splice(j, 1);
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
                        shapeCtrl.setEditingType('UPDATEINTER'); // 设置热键修改时的监听类型;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！'); // 退出线选完后的鼠标提示;
                        featCodeCtrl.setFeatCode({ // 设置修改确认的数据;
                            pid: selData.pid,
                            nodes: nodePids,
                            links: linkPids,
                            objStatus: 'UPDATE'
                        });
                    });
                    return;
                } else if (type === 'ADDRDROADLINK') {
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
                    if (links && links.length >= 0) {
                        for (var i = 0; i < links.length; i++) {
                            if (linkPids.indexOf(links[i].linkPid) < 0) {
                                linkPids.push(links[i].linkPid);
                            }
                        }
                    }
                    tooltipsCtrl.setCurrentTooltip('请选择需要增加的线！');
                    eventController.on(eventController.eventTypes.GETFEATURE, function (data) {
                        highRenderCtrl._cleanHighLight();
                        if (data.optype == 'RDLINK') {
                            if (linkPids.indexOf(parseInt(data.id)) < 0) {
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
                        shapeCtrl.setEditingType('UPDATERDROAD'); // 设置热键修改时的监听类型;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！'); // 退出线选完后的鼠标提示;
                        featCodeCtrl.setFeatCode({ // 设置修改确认的数据;
                            pid: selData.pid,
                            linkPids: linkPids,
                            objStatus: 'UPDATE'
                        });
                    });
                    return;
                } else if (type === 'DELETERDROADLINK') {
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [crfData],
                        snapLayers: [crfData] // 将rdnode放前面，优先捕捉
                    });
                    map.currentTool.enable();
                    var selData = objCtrl.data;
                    var linkPids = [];
                    var links = selData.links;
                    if (links && links.length >= 0) {
                        for (var i = 0; i < links.length; i++) {
                            if (linkPids.indexOf(links[i].linkPid) < 0) {
                                linkPids.push(links[i].linkPid);
                            }
                        }
                    }
                    tooltipsCtrl.setCurrentTooltip('请选择需要删除的线！');
                    eventController.on(eventController.eventTypes.GETFEATURE, function (data) {
                        highRenderCtrl._cleanHighLight();
                        if (data.optype == 'RDROAD') {
                            if (linkPids.indexOf(parseInt(data.linkId)) > -1) {
                                linkPids.splice(linkPids.indexOf(parseInt(data.linkId)), 1);
                                for (var i = 0; i < highRenderCtrl.highLightFeatures.length; i++) {
                                    if (highRenderCtrl.highLightFeatures[i].id == data.linkId) {
                                        highRenderCtrl.highLightFeatures.splice(i, 1);
                                        i--;
                                    }
                                }
                            }
                        }
                        highRenderCtrl.drawHighlight();
                        shapeCtrl.setEditingType('UPDATERDROAD'); // 设置热键修改时的监听类型;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！'); // 退出线选完后的鼠标提示;
                        featCodeCtrl.setFeatCode({ // 设置修改确认的数据;
                            pid: selData.pid,
                            linkPids: linkPids,
                            objStatus: 'UPDATE'
                        });
                    });
                    return;
                } else if (type === 'ADDRDOBJECT') {
                    var selectCRFData = featCodeCtrl.getFeatCode().selectCRFData;
                    var objData = featCodeCtrl.getFeatCode().objData;
                    var crfPids = featCodeCtrl.getFeatCode().crfPids;
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [crfData, rdLink],
                        snapLayers: [rdLink]
                    });
                    map.currentTool.enable();
                    eventController.off(eventController.eventTypes.GETFEATURE);
                    eventController.on(eventController.eventTypes.GETFEATURE, function (data) {
                        highRenderCtrl._cleanHighLight();
                        if (data.optype == 'RDLINK') {
                            if (objData.links.indexOf(parseInt(data.id)) < 0) {
                                objData.links.push(parseInt(data.id));
                                highRenderCtrl.highLightFeatures.push({
                                    id: data.id.toString(),
                                    layerid: 'rdLink',
                                    type: 'line',
                                    style: {
                                        color: '#D9B300'
                                    }
                                });
                            }
                        } else if (data.optype == 'RDINTER') {
                            if (crfPids.indexOf(data.id) < 0) {
                                objData.inters.push(parseInt(data.id));
                                dsEdit.getByPid(parseInt(data.id), 'RDINTER').then(function (interData) {
                                    crfPids.push(interData.pid.toString());
                                    var tempData = {
                                        pid: interData.pid,
                                        highLightId: []
                                    };
                                    var linkArr = interData.links,
                                        points = interData.nodes;
                                    for (var i = 0, len = linkArr.length; i < len; i++) {
                                        tempData.highLightId.push(linkArr[i].linkPid);
                                        highRenderCtrl.highLightFeatures.push({
                                            id: linkArr[i].linkPid.toString(),
                                            layerid: 'rdLink',
                                            type: 'line',
                                            style: {
                                                color: '#00FFFF'
                                            }
                                        });
                                    }
                                    for (var i = 0, len = points.length; i < len; i++) {
                                        tempData.highLightId.push(points[i].nodePid);
                                        highRenderCtrl.highLightFeatures.push({
                                            id: points[i].nodePid.toString(),
                                            layerid: 'rdLink',
                                            type: 'node',
                                            style: {
                                                color: '#4A4AFF'
                                            }
                                        });
                                    }
                                    shapeCtrl.setEditingType('UPDATERDOBJECT'); // 设置热键修改时的监听类型;
                                    tooltipsCtrl.setCurrentTooltip('点击空格保存修改！'); // 退出线选完后的鼠标提示;
                                    highRenderCtrl.drawHighlight();
                                    selectCRFData.push(tempData);
                                    featCodeCtrl.setFeatCode({
                                        selectCRFData: selectCRFData,
                                        objData: objData,
                                        crfPids: crfPids,
                                        pid: objCtrl.data.pid
                                    });
                                });
                            }
                        } else if (data.optype == 'RDROAD') {
                            if (crfPids.indexOf(data.id) < 0) {
                                objData.roads.push(parseInt(data.id));
                                dsEdit.getByPid(parseInt(data.id), 'RDROAD').then(function (roadData) {
                                    crfPids.push(roadData.pid.toString());
                                    var tempData = {
                                        pid: roadData.pid,
                                        highLightId: []
                                    };
                                    var linkArr = roadData.links;
                                    for (var i = 0, len = linkArr.length; i < len; i++) {
                                        tempData.highLightId.push(linkArr[i].linkPid);
                                        highRenderCtrl.highLightFeatures.push({
                                            id: linkArr[i].linkPid.toString(),
                                            layerid: 'rdLink',
                                            type: 'line',
                                            style: {
                                                color: '#DAB1D5'
                                            }
                                        });
                                    }
                                    shapeCtrl.setEditingType('UPDATERDOBJECT'); // 设置热键修改时的监听类型;
                                    tooltipsCtrl.setCurrentTooltip('点击空格保存修改！'); // 退出线选完后的鼠标提示;
                                    highRenderCtrl.drawHighlight();
                                    selectCRFData.push(tempData);
                                    featCodeCtrl.setFeatCode({
                                        selectCRFData: selectCRFData,
                                        objData: objData,
                                        crfPids: crfPids,
                                        pid: objCtrl.data.pid
                                    });
                                });
                            }
                        }
                        shapeCtrl.setEditingType('UPDATERDOBJECT'); // 设置热键修改时的监听类型;
                        tooltipsCtrl.setCurrentTooltip('点击空格保存修改！'); // 退出线选完后的鼠标提示;
                        highRenderCtrl.drawHighlight();
                        featCodeCtrl.setFeatCode({
                            selectCRFData: selectCRFData,
                            objData: objData,
                            crfPids: crfPids,
                            pid: objCtrl.data.pid
                        });
                    });
                    return;
                } else if (type === 'DELETERDOBJECT') {
                    var selectCRFData = featCodeCtrl.getFeatCode().selectCRFData;
                    var objData = featCodeCtrl.getFeatCode().objData;
                    var crfPids = featCodeCtrl.getFeatCode().crfPids;
                    map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                        map: map,
                        shapeEditor: shapeCtrl,
                        selectLayers: [crfData, rdLink],
                        snapLayers: [rdLink]
                    });
                    map.currentTool.enable();
                    eventController.off(eventController.eventTypes.GETFEATURE);
                    eventController.on(eventController.eventTypes.GETFEATURE, function (data) {
                        highRenderCtrl._cleanHighLight();
                        if (data.optype == 'RDOBJECT' && parseInt(data.id) == objCtrl.data.pid) { // 属于rdobject的要素
                            if (data.properties.orgType == 'RDLINK') {
                                if (objData.links.indexOf(parseInt(data.linkId)) > -1) {
                                    objData.links.splice(objData.links.indexOf(parseInt(data.linkId)), 1);
                                    for (var i = 0; i < highRenderCtrl.highLightFeatures.length; i++) {
                                        if (highRenderCtrl.highLightFeatures[i].id == data.linkId) {
                                            highRenderCtrl.highLightFeatures.splice(i, 1);
                                            i--;
                                        }
                                    }
                                }
                            } else if (data.properties.orgType == 'RDINTER') {
                                if (crfPids.indexOf(data.properties.rdInterPid) > -1) { // 存在于现有数据中,删除之
                                    for (var i = 0; i < selectCRFData.length; i++) {
                                        if (selectCRFData[i].pid == data.properties.rdInterPid) {
                                            for (var j = 0; j < selectCRFData[i].highLightId.length; j++) {
                                                for (var k = 0; k < highRenderCtrl.highLightFeatures.length; k++) {
                                                    if (parseInt(highRenderCtrl.highLightFeatures[k].id) == selectCRFData[i].highLightId[j]) {
                                                        highRenderCtrl.highLightFeatures.splice(k, 1);
                                                        k--;
                                                    }
                                                }
                                            }
                                            selectCRFData.splice(i, 1);
                                            i--;
                                            crfPids.splice(crfPids.indexOf(data.properties.rdInterPid), 1);
                                        }
                                    }
                                }
                            } else if (data.properties.optype == 'RDROAD') {
                                if (crfPids.indexOf(data.properties.rdRoadPid) > -1) { // 存在于现有数据中,删除之
                                    for (var i = 0; i < selectCRFData.length; i++) {
                                        if (selectCRFData[i].pid == parseInt(data.properties.rdRoadPid)) {
                                            for (var j = 0; j < selectCRFData[i].highLightId.length; j++) {
                                                for (var k = 0; k < highRenderCtrl.highLightFeatures.length; k++) {
                                                    if (parseInt(highRenderCtrl.highLightFeatures[k].id) == selectCRFData[i].highLightId[j]) {
                                                        highRenderCtrl.highLightFeatures.splice(k, 1);
                                                        k--;
                                                    }
                                                }
                                            }
                                            selectCRFData.splice(i, 1);
                                            i--;
                                            crfPids.splice(crfPids.indexOf(data.properties.rdRoadPid), 1);
                                        }
                                    }
                                }
                            }
                            shapeCtrl.setEditingType('UPDATERDOBJECT'); // 设置热键修改时的监听类型;
                            tooltipsCtrl.setCurrentTooltip('点击空格保存修改！'); // 退出线选完后的鼠标提示;
                            highRenderCtrl.drawHighlight();
                            featCodeCtrl.setFeatCode({
                                selectCRFData: selectCRFData,
                                objData: objData,
                                crfPids: crfPids,
                                pid: objCtrl.data.pid
                            });
                        }
                    });
                    return;
                } else if (type.indexOf('BRANCH') > -1) {
                    // 地图选择配置;
                    map.currentTool = new fastmap.uikit.SelectPath({
                        map: map,
                        currentEditLayer: rdLink,
                        linksFlag: true,
                        shapeEditor: shapeCtrl,
                        showMenu: false
                    });
                    map.currentTool.enable();
                    if (type.split('_')[1] === 'OUT') {
                        tooltipsCtrl.setCurrentTooltip('开始修改退出线！');
                        eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                            highRenderCtrl._cleanHighLight();
                            highRenderCtrl.highLightFeatures = [];
                            // 进入线;
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
                                type: 'node',
                                style: {
                                    color: 'yellow'
                                }
                            });
                            // 退出线;
                            highRenderCtrl.highLightFeatures.push({
                                id: data.id,
                                layerid: 'rdLink',
                                type: 'line',
                                style: {}
                            });
                            // 绘制当前的退出线和原来的进入线;
                            highRenderCtrl.drawHighlight();
                            // 设置热键修改时的监听类型;
                            shapeCtrl.setEditingType('UPDATEBRANCH');
                            // 退出线选完后的鼠标提示;
                            tooltipsCtrl.setCurrentTooltip('点击空格保存修改！');
                            // 设置修改确认的数据;
                            featCodeCtrl.setFeatCode({
                                nodePid: objCtrl.data.nodePid.toString(),
                                inLinkPid: objCtrl.data.inLinkPid.toString(),
                                outLinkPid: data.id.toString(),
                                pid: objCtrl.data.pid.toString(),
                                objStatus: 'UPDATE',
                                branchType: $scope.selectedFeature.branchType,
                                childId: $scope.selectedFeature.id
                            });
                        });
                    } else if (type.split('_')[1] === 'THROUGH') {
                        if (objCtrl.data.relationshipType == 2) {
                            tooltipsCtrl.setCurrentTooltip('开始修改经过线！');
                        } else {
                            tooltipsCtrl.setCurrentTooltip('该关系类型为路口没有经过线！');
                            var timer = setTimeout(function () {
                                tooltipsCtrl.onRemoveTooltip();
                                clearTimeout(timer);
                            }, 2000);
                            return;
                        }
                        var vialinkArr = [];
                        var linkLastNode = objCtrl.data.nodePid;
                        var tempArr = [];
                        var outInArr = [objCtrl.data.outLinkPid, objCtrl.data.inLinkPid];
                        function isSelectOk(params) {
                            if ((params.properties.direct == 1 && (params.properties.snode == linkLastNode || params.properties.enode == linkLastNode)) || (params.properties.direct == 2 && params.properties.snode == linkLastNode) || (params.properties.direct == 3 && params.properties.enode == linkLastNode)) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                            if (outInArr.indexOf(parseInt(data.id)) != -1) {
                                // 经过线不能选择成退出线和进入线；
                                tooltipsCtrl.setCurrentTooltip('经过线不能为退出线或进入线！');
                            } else if (isSelectOk(data)) {
                                if (objCtrl.data.vias.indexOf(data.properties.id) != -1) {
                                    objCtrl.data.vias.splice(objCtrl.data.vias.indexOf(data.properties.id));
                                    console.log('repeat');
                                } else {
                                        // objCtrl.data.vias.splice(objCtrl.data.vias.indexOf(data.properties.id)+1);
                                    objCtrl.data.vias.push(data.properties.id);
                                    linkLastNode = (data.properties.snode == linkLastNode) ? data.properties.enode : data.properties.snode;
                                }
                                tempArr.push({
                                    id: data.properties.id.toString(),
                                    layerid: 'rdLink',
                                    type: 'line',
                                    style: { color: 'blue', strokeWidth: 3 }
                                });
                                highRenderCtrl.highLightFeatures = angular.copy(tempArr);
                                    // 绘制当前的退出线和原来的进入线;
                                highRenderCtrl._cleanHighLight();
                                highRenderCtrl.drawHighlight();
                            } else {
                                console.log('error');
                            }
                        });
                    }
                    return;
                } else if (type === 'MODIFYVARIABLESPEED') {
                    map.currentTool = new fastmap.uikit.SelectPath({
                        map: map,
                        currentEditLayer: rdLink,
                        linksFlag: false,
                        shapeEditor: shapeCtrl
                    });
                    map.currentTool.enable();
                    // 热键操作设置;
                    shapeCtrl.setEditingType('UPDATEVARIABLESPEED');
                    // 添加自动吸附的图层
                    map.currentTool.snapHandler.addGuideLayer(rdLink);
                    tooltipsCtrl.setEditEventType('rdvariable');
                    tooltipsCtrl.setCurrentTooltip('开始修改退出线和接续线!');
                    // 获取一条link对象;
                    $scope.getSelectLinkInfos = function (param) {
                        var defer = $q.defer();
                        dsEdit.getByPid(param, 'RDLINK').then(function (data) {
                            if (data) {
                                defer.resolve(data);
                            }
                        });
                        return defer.promise;
                    };
                        // 可变限速当前数据模型的拷贝;
                    var tempObj = objCtrl.data.getIntegrate();
                    $scope.linkNodes = [], $scope.links = [];
                    // 将临时接续线对象数组改为pid的数组;
                    function uniqueArray(arr) {
                        var result = [],
                            hash = {};
                        for (var i = 0, elem;
                            (elem = arr[i]) != null; i++) {
                            if (!hash[elem]) {
                                result.push(elem);
                                hash[elem] = true;
                            }
                        }
                        return result;
                    }
                    if (!objCtrl.data.vias.length) {
                        // 如果没有经过线node数组只有进入点和退出线的退出点;
                        $scope.links.push(tempObj.inLinkPid);
                        $scope.links.push(tempObj.outLinkPid);
                    } else {
                        // 如果有进入线node数组有进入点和退出线的退出点以及接续link的点;
                        $scope.links.push(tempObj.inLinkPid);
                        $scope.links.push(tempObj.outLinkPid);
                        for (var i = 0; i < tempObj.vias.length; i++) {
                            $scope.links.push(tempObj.vias[i].linkPid);
                        }
                    }
                    for (var i = 0; i < tempObj.vias.length; i++) {
                        tempObj.vias[i] = tempObj.vias[i].linkPid;
                    }
                    $scope.linkNodes.push(tempObj.nodePid);
                    /* -------------------获取所有点数组------------------*/
                    var currentIndex = 1;

                    function requestfn() {
                        if (currentIndex >= $scope.links.length) {
                            return;
                        }
                        $scope.getSelectLinkInfos($scope.links[currentIndex]).then(function (data) {
                            currentIndex++;
                            $scope.linkNodes.push(data.sNodePid);
                            $scope.linkNodes.push(data.eNodePid);
                            $scope.linkNodes = uniqueArray($scope.linkNodes);
                            requestfn();
                        });
                    }
                    requestfn();
                    /* -------------------获取所有点数组------------------*/
                    // 修改退出线时高亮所有选中要素的方法;
                    function hightlightOutLink() {
                        highRenderCtrl.highLightFeatures.splice(2);
                        highRenderCtrl.highLightFeatures.push({
                            id: parseInt(tempObj.outLinkPid).toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {}
                        });
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltipText('已选择一条退出线!');
                    }
                    // 高亮接续线方法;
                    function hightlightViasLink() {
                        highRenderCtrl.highLightFeatures.splice(3);
                        for (var i = 0; i < tempObj.vias.length; i++) {
                            highRenderCtrl.highLightFeatures.push({
                                id: parseInt(tempObj.vias[i]).toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {
                                    color: 'blue'
                                }
                            });
                        }
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.drawHighlight();
                        tooltipsCtrl.setCurrentTooltipText('已选接续线!');
                    }
                    eventController.off(eventController.eventTypes.GETOUTLINKSPID);
                    eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (dataresult) {
                        var selectIndex = $scope.links.indexOf(parseInt(dataresult.id));
                        if (selectIndex == -1) {
                            selectIndex = $scope.links.length - 1;
                        }
                        // 如果是修改退出线;
                        if (dataresult.properties.enode == $scope.linkNodes[0] && dataresult.properties.direct == 3 && $scope.links[0] != dataresult.id) {
                            tempObj.outLinkPid = dataresult.id;
                            tempObj.vias = [];
                            // 对于node和link数组的维护;
                            $scope.links.splice(1);
                            $scope.links.push(parseInt(dataresult.id));
                            $scope.linkNodes.splice(1);
                            $scope.linkNodes.push(parseInt(dataresult.properties.snode));
                            hightlightOutLink();
                        } else if (dataresult.properties.snode == $scope.linkNodes[0] && dataresult.properties.direct == 2 && $scope.links[0] != dataresult.id) {
                            tempObj.outLinkPid = dataresult.id;
                            tempObj.vias = [];
                            // 对于node和link数组的维护;
                            $scope.links.splice(1);
                            $scope.links.push(parseInt(dataresult.id));
                            $scope.linkNodes.splice(1);
                            $scope.linkNodes.push(parseInt(dataresult.properties.enode));
                            hightlightOutLink();
                        } else if ($scope.links[0] != dataresult.id && (dataresult.properties.enode == $scope.linkNodes[0] || dataresult.properties.snode == $scope.linkNodes[0]) && dataresult.properties.direct == 1) {
                            tempObj.outLinkPid = dataresult.id;
                            tempObj.vias = [];
                            // 对于node和link数组的维护;
                            $scope.links.splice(1);
                            $scope.links.push(parseInt(dataresult.id));
                            $scope.linkNodes.splice(1);
                            (dataresult.properties.enode == $scope.linkNodes[0]) ? $scope.linkNodes.push(parseInt(dataresult.properties.snode)) : $scope.linkNodes.push(parseInt(dataresult.properties.enode));
                            hightlightOutLink();
                        }
                        // else {
                        //     tooltipsCtrl.setCurrentTooltipText("退出线与进入点不连续或方向错误!");
                        // }
                        /* 判断接续线是否能与进入线重合，原则上不能重合*/
                        if (dataresult.id == $scope.links[0]) {
                            tooltipsCtrl.setCurrentTooltipText('接续线不能与进入线重合!');
                            return;
                        }
                        /* 如果没有接续线接续线直接跟退出线挂接;*/
                        if (tempObj.vias.indexOf(parseInt(dataresult.id)) == -1) {
                            if (dataresult.properties.enode == $scope.linkNodes[$scope.linkNodes.length - 1] && dataresult.properties.direct == 3 && $scope.links[1] != dataresult.id) {
                                tempObj.vias.push(parseInt(dataresult.id));
                                // 对于node和link数组的维护;
                                $scope.links.push(parseInt(dataresult.id));
                                $scope.linkNodes.push(parseInt(dataresult.properties.snode));
                                hightlightViasLink();
                            } else if (dataresult.properties.snode == $scope.linkNodes[$scope.linkNodes.length - 1] && dataresult.properties.direct == 2 && $scope.links[1] != dataresult.id) {
                                tempObj.vias.push(parseInt(dataresult.id));
                                // 对于node和link数组的维护;
                                $scope.links.push(parseInt(dataresult.id));
                                $scope.linkNodes.push(parseInt(dataresult.properties.enode));
                                hightlightViasLink();
                            } else if ($scope.links[1] != dataresult.id && (dataresult.properties.enode == $scope.linkNodes[$scope.linkNodes.length - 1] || dataresult.properties.snode == $scope.linkNodes[$scope.linkNodes.length - 1]) && dataresult.properties.direct == 1) {
                                // 对于node和link数组的维护;
                                $scope.links.push(parseInt(dataresult.id));
                                tempObj.vias.push(parseInt(dataresult.id));
                                (dataresult.properties.enode == $scope.linkNodes[$scope.linkNodes.length - 1]) ? $scope.linkNodes.push(parseInt(dataresult.properties.snode)) : $scope.linkNodes.push(parseInt(dataresult.properties.enode));
                                hightlightViasLink();
                            } else if (dataresult.id != tempObj.outLinkPid) { tooltipsCtrl.setCurrentTooltipText('您选择的接续线与上一条不连续或方向错误!'); }
                        } else {
                            $scope.links.splice(selectIndex);
                            $scope.linkNodes.splice(selectIndex);
                            tempObj.vias.splice(selectIndex - 2);
                            hightlightViasLink();
                        }
                        // 设置修改确认的数据;
                        featCodeCtrl.setFeatCode({
                            pid: tempObj.pid.toString(),
                            nodePid: tempObj.nodePid.toString(),
                            inLinkPid: tempObj.inLinkPid.toString(),
                            outLinkPid: tempObj.outLinkPid.toString(),
                            vias: tempObj.vias
                        });
                    });
                    return;
                } else if (type === 'CHANGELEVEL') {
                    /* 重绘link颜f色*/
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures = [];
                    objCtrl.data.links.sort(function (a, b) {
                        return a.zlevel - b.zlevel;
                    });
                    for (var i = 0; i < objCtrl.data.links.length; i++) {
                        var tempObj = {
                            RD_LINK: 'rdLink',
                            RW_LINK: 'rwLink',
                            LC_LINK: 'lcLink'
                        };
                        var COLORTABLE = ['#14B7FC', '#4FFFB6', 'F8B19C', '#FCD6A4'];
                        highRenderCtrl.highLightFeatures.push({
                            id: objCtrl.data.links[i].linkPid.toString(),
                            layerid: tempObj[objCtrl.data.links[i].tableName],
                            type: 'line',
                            index: i,
                            style: {
                                strokeWidth: 5,
                                strokeColor: COLORTABLE[i]
                            }
                        });
                    }
                    highRenderCtrl.drawHighlight();
                    $scope.changeLevel();
                    /* if (selectCtrl.selectedFeatures) {
                        tooltipsCtrl.setEditEventType('moveDot');
                        tooltipsCtrl.setCurrentTooltip('点击link调整层级关系！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('先选择行政区划代表点！');
                        return;
                    }*/
                    return;
                }
                if (!selectCtrl.selectedFeatures) {
                    return;
                }
                feature = selectCtrl.selectedFeatures.geometry;
                layerCtrl.pushLayerFront('edit');
                var sObj = shapeCtrl.shapeEditorResult;
                if (type === 'TRANSFORMDIRECT') {
                    editLayer.drawGeometry = selectCtrl.selectedFeatures;
                    editLayer.draw(selectCtrl.selectedFeatures, editLayer);
                    sObj.setOriginalGeometry(feature);
                    sObj.setFinalGeometry(feature);
                    shapeCtrl.editType = 'transformDirect';
                } else if (type.split('_')[0] === 'PATHDEPARTNODE') {
                    editLayer.drawGeometry = feature; // 获取需要编辑几何体的geometry
                    editLayer.draw(feature, editLayer); // 把需要编辑的几何体画在editLayer上
                    sObj.setOriginalGeometry(feature);
                    sObj.setFinalGeometry(feature);
                    shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType[type.split('_')[0]]); // 设置编辑状态
                    shapeCtrl.startEditing();
                    shapeCtrl.editFeatType = 'pathDepartNode';
                    selectCtrl.workLinkPid = $scope.selectedFeature.id;
                    var guideNode = '',guideLink = '';
                    switch(type.split('_')[1]){
                        case 'RDLINK':
                            guideNode = 'rdNode',guideLink = 'rdLink';
                            break;
                        case 'RWLINK':
                            guideNode = 'rwNode',guideLink = 'rwLink';
                            break;
                        case 'ADLINK':
                            guideNode = 'adNode',guideLink = 'adLink';
                            break;
                        case 'LULINK':
                            guideNode = 'luNode',guideLink = 'luLink';
                            break;
                        case 'LCLINK':
                            guideNode = 'lcNode',guideLink = 'lcLink';
                            break;
                        case 'ZONELINK':
                            guideNode = 'zoneNode',guideLink = 'zoneLink';
                            break;
                    }
                    map.currentTool = shapeCtrl.getCurrentTool();
                    map.currentTool.snapHandler.addGuideLayer(new fastmap.uikit.LayerController().getLayerById(guideNode));
                    map.currentTool.snapHandler.addGuideLayer(new fastmap.uikit.LayerController().getLayerById(guideLink));
                } else {
                    editLayer.drawGeometry = feature; // 获取需要编辑几何体的geometry
                    editLayer.draw(feature, editLayer); // 把需要编辑的几何体画在editLayer上
                    sObj.setOriginalGeometry(feature);
                    sObj.setFinalGeometry(feature);
                    shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType[type]); // 设置编辑状态
                    shapeCtrl.startEditing();
                    // shapeCtrl.editFeatType = "rdLink";
                    // map.currentTool = shapeCtrl.getCurrentTool();
                    // map.currentTool.snapHandler.addGuideLayer(rdLink);
                    // modified by chenx
                    shapeCtrl.editFeatType = $scope.selectedFeature.optype;
                    map.currentTool = shapeCtrl.getCurrentTool();
                    map.currentTool.snapHandler.addGuideLayer(layerCtrl.getLayerByFeatureType($scope.selectedFeature.optype)); // 捕捉图层
                }
                shapeCtrl.on('startshapeeditresultfeedback', saveOrEsc);
                shapeCtrl.on('stopshapeeditresultfeedback', function () {
                    shapeCtrl.off('startshapeeditresultfeedback', saveOrEsc);
                });

                function saveOrEsc(event) {
                    if (event.changeTooltips) {
                        tooltipsCtrl.setChangeInnerHtml('点击空格键保存操作或者按ESC键取消!');
                    }
                }
            }
        };
        // 线限速相关逻辑
        $scope.getLinkSpeedLimit = function (data, type, ctrl, tpl) {
            if (data.direct == 0) {
                swal('提示', '点限速方向为：未调查！', 'info');
                return;
            }
            if (parseInt(data.speedType) == 3) {
                swal('提示', '暂时不支持条件线限速哦！', 'info');
                return;
            }
            var linkSpeedLimit = {
                linkPid: data.linkPid,
                speedType: parseInt(data.speedType)
            };
            var linkPids = [];
            var obj = {
                queryType: type,
                linkPid: parseInt(data.linkPid),
                direct: data.direct
            };
            var param = {
                dbId: App.Temp.dbId,
                type: 'RDLINK',
                data: obj
            };
            if (data.direct == 2) {
                linkSpeedLimit.fromSpeedLimit = parseInt(data.speedValue);
                linkSpeedLimit.fromLimitSrc = parseInt(data.fromLimitSrc);
            } else if (data.direct == 3) {
                linkSpeedLimit.toSpeedLimit = parseInt(data.speedValue);
                linkSpeedLimit.toLimitSrc = parseInt(data.toLimitSrc);
            }
            if (parseInt(data.speedType) == 3) { // 条件限速
                linkSpeedLimit.speedDependent = parseInt(data.condition);
            }
            dsEdit.getByCondition(param).then(function (links) { // 查找link串
                var linkArrays = [],
                    speedLimitInfo = {};
                if (links.errcode == 0) {
                    if (links.data) {
                        linkArrays = links.data[0];
                        speedLimitInfo = links.data[1];
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        for (var i = 0; i < linkArrays.length; i++) {
                            linkPids.push(linkArrays[i]);
                            highRenderCtrl.highLightFeatures.push({
                                id: linkArrays[i].toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {}
                            });
                        }
                        highRenderCtrl.drawHighlight();
                        objCtrl.setCurrentObject('RDLINKSPEEDLIMIT', linkSpeedLimit);
                        $scope.$emit('transitCtrlAndTpl', {
                            type: 'refreshPage',
                            loadType: 'attrTplContainer',
                            propertyCtrl: ctrl,
                            propertyHtml: tpl
                        });
                        dsEdit.getByPid(linkArrays[linkArrays.length - 1], 'RDLINK').then(function (linkDetail) {
                            var linkNodes = [];
                            linkNodes.push(linkDetail.eNodePid);
                            linkNodes.push(linkDetail.sNodePid);
                            // 增加或者删除link
                            map.currentTool.disable();
                            map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                                map: map,
                                shapeEditor: shapeCtrl,
                                selectLayers: [rdLink],
                                snapLayers: [rdLink]
                            });
                            map.currentTool.enable();
                            tooltipsCtrl.setCurrentTooltip('请选择需要增加或者删除的线！');
                            featCodeCtrl.setFeatCode({ // 设置修改确认的数据;
                                direct: data.direct,
                                linkPids: linkPids
                            });
                            eventController.off(eventController.eventTypes.GETRELATIONID);
                            eventController.on(eventController.eventTypes.GETFEATURE, function (selectLink) {
                                highRenderCtrl._cleanHighLight();
                                if (selectLink.optype == 'RDLINK') {
                                    if (linkPids.indexOf(parseInt(selectLink.id)) < 0) { // 不在当前的link串里
                                        if (linkNodes.indexOf(parseInt(selectLink.properties.snode)) > -1 || linkNodes.indexOf(parseInt(selectLink.properties.enode)) > -1) { // 选择的link是link串里最后一条的挂接link
                                            if ((linkNodes.indexOf(parseInt(selectLink.properties.snode)) > -1 && ((parseInt(selectLink.properties.direct) == 2) || (parseInt(selectLink.properties.direct) == 1))) || (linkNodes.indexOf(parseInt(selectLink.properties.enode)) > -1 && ((parseInt(selectLink.properties.direct) == 3) || (parseInt(selectLink.properties.direct) == 1)))) {
                                                linkPids.push(parseInt(selectLink.id));
                                                linkNodes = [];
                                                linkNodes.push(parseInt(selectLink.properties.snode));
                                                linkNodes.push(parseInt(selectLink.properties.enode));
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
                                    } else { // 在当前的link串里
                                        if (linkPids.indexOf(parseInt(selectLink.id)) > 0) { // 不能删除第一个
                                            linkPids.length = linkPids.indexOf(parseInt(selectLink.id));
                                            highRenderCtrl.highLightFeatures = [];
                                            for (var i = 0; i < linkPids.length; i++) {
                                                highRenderCtrl.highLightFeatures.push({
                                                    id: linkPids[i].toString(),
                                                    layerid: 'rdLink',
                                                    type: 'line',
                                                    style: {}
                                                });
                                            }
                                            dsEdit.getByPid(linkPids[linkPids.length - 1], 'RDLINK').then(function (lastLinkDetail) {
                                                linkNodes = [];
                                                linkNodes.push(lastLinkDetail.eNodePid);
                                                linkNodes.push(lastLinkDetail.sNodePid);
                                            });
                                        }
                                    }
                                }
                                highRenderCtrl.drawHighlight();
                                featCodeCtrl.setFeatCode({ // 设置修改确认的数据;
                                    direct: data.direct,
                                    linkPids: linkPids
                                });
                            });
                        });
                    }
                }
            });
        };
        $scope.getFeatDataCallback = function (selectedData, id, type, ctrl, tpl, toolsObj) {
            if (type == 'RDBRANCH') {
                if (selectedData.branchType == 5 || selectedData.branchType == 7) {
                    dsEdit.getBranchByRowId(selectedData.id, selectedData.branchType).then(function (data) {
                        getByPidCallback(type, ctrl, tpl, data, selectedData, toolsObj);
                    });
                } else {
                    dsEdit.getBranchByDetailId(selectedData.id, selectedData.branchType).then(function (data) {
                        getByPidCallback(type, ctrl, tpl, data, selectedData, toolsObj);
                    });
                }
            } else {
                dsEdit.getByPid(id, type, false).then(function (data) {
                    getByPidCallback(type, ctrl, tpl, data, selectedData, toolsObj);
                });
            }
            // 高亮poi并放入selectCtrl
            function initPoiData(selectedData, data) {
                if (data.status == 3 || data.state == 2) {
                    swal('提示', '数据已提交或者删除，不能修改几何！', 'info');
                    return;
                }
                var locArr = data.geometry.coordinates;
                // var guideArr = data.guide.coordinates;
                var points = [];
                points.push(fastmap.mapApi.point(locArr[0], locArr[1]));
                points.push(fastmap.mapApi.point(data.xGuide, data.yGuide));
                selectCtrl.onSelected({ // 记录选中点信息
                    geometry: points,
                    id: data.pid,
                    linkPid: data.linkPid
                });
                // //高亮POI点
                // var highLightFeatures = [];
                // highLightFeatures.push({
                //     id: data.pid.toString(),
                //     layerid: 'poi',
                //     type: 'IXPOI'
                // });
                // highRenderCtrl.highLightFeatures = highLightFeatures;
                // highRenderCtrl.drawHighlight();
            }

            function getByPidCallback(type, ctrl, tpl, data, selectedData, toolsObj) {
                objCtrl.setCurrentObject(type, data);
                if (type == 'IXPOI') {
                    $scope.getCurrentKindByLittle(data); // 获取当前小分类所对应的大分类下的所有小分类
                    $scope.$emit('transitCtrlAndTpl', {
                        loadType: 'tipsTplContainer',
                        propertyCtrl: appPath.poi + 'ctrls/attr-tips/poiPopoverTipsCtl',
                        propertyHtml: appPath.root + appPath.poi + 'tpls/attr-tips/poiPopoverTips.html'
                    });
                    $scope.$emit('transitCtrlAndTpl', {
                        loadType: 'attrTplContainer',
                        propertyCtrl: ctrl,
                        propertyHtml: tpl
                    });
                    eventController.fire(eventController.eventTypes.SELECTBYATTRIBUTE, {
                        feature: objCtrl.data
                    });
                    $scope.$emit('clearAttrStyleUp'); // 清除属性样式
                    highlightPoiByPid();

                    $scope.$emit('highLightPoi', data.pid); // 高亮OI并且重置上传组件的PID
                    $scope.$emit('refreshPhoto', true);

                    initPoiData(selectedData, data);
                } else {
                    $scope.$emit('transitCtrlAndTpl', {
                        loadType: 'attrTplContainer',
                        propertyCtrl: ctrl,
                        propertyHtml: tpl
                    });
                }
                tooltipsCtrl.onRemoveTooltip();
                if (!map.floatMenu && toolsObj) {
                    map.floatMenu = new L.Control.FloatMenu('000', selectedData.event.originalEvent, toolsObj);
                    map.addLayer(map.floatMenu);
                    map.floatMenu.setVisible(true);
                }
            }
        };
        $scope.modifyPoi = function (event) {
            var type = event.currentTarget.type; // 按钮的类型
            if (type === 'POILOCMOVE') {
                if (selectCtrl.selectedFeatures) {
                    tooltipsCtrl.setCurrentTooltip('开始移动POI显示坐标点！');
                } else {
                    tooltipsCtrl.setCurrentTooltip('先选择POI显示坐标点！');
                    return;
                }
            } else if (type === 'POIGUIDEMOVE') {
                if (selectCtrl.selectedFeatures) {
                    tooltipsCtrl.setCurrentTooltip('开始移动POI引导坐标点！');
                } else {
                    tooltipsCtrl.setCurrentTooltip('先选择POI引导坐标点！');
                    return;
                }
            } else if (type === 'POIAUTODRAG') {
                if (selectCtrl.selectedFeatures) {
                    tooltipsCtrl.setCurrentTooltip('开始移动POI显示坐标点！');
                } else {
                    tooltipsCtrl.setCurrentTooltip('先选择POI显示坐标点！');
                    return;
                }
            } else if (type === 'RESETPOI') {
                if (selectCtrl.selectedFeatures) {
                    if (tooltipsCtrl.getCurrentTooltip()) {
                        tooltipsCtrl.onRemoveTooltip();
                    }
                    map.currentTool.disable();
                    selectCtrl.selectedFeatures.geometry.components[0].y = objCtrl.data.geometry.coordinates[1];
                    selectCtrl.selectedFeatures.geometry.components[0].x = objCtrl.data.geometry.coordinates[0];
                    selectCtrl.selectedFeatures.geometry.components[1].y = objCtrl.data.yGuide;
                    selectCtrl.selectedFeatures.geometry.components[1].x = objCtrl.data.xGuide;
                    delete selectCtrl.selectedFeatures.lastLocGeo;
                    editLayer.clear();
                    setTimeout(function () {
                        editLayer._redraw();
                    }, 100);
                } else {
                    tooltipsCtrl.setCurrentTooltip('坐标无变化！');
                }
                return;
            } else if (type === 'POISAME') {
                map.closePopup();
                tooltipsCtrl.setCurrentTooltip('请框选地图上的POI点！');
                eventController.off(eventController.eventTypes.GETBOXDATA);
                eventController.on(eventController.eventTypes.GETBOXDATA, function (event) {
                    var data = event.data,
                        highlightFeatures = [],
                        rectangleData = { // 矩形框信息geoJson
                            type: 'Polygon',
                            coordinates: [
                                []
                            ]
                        },
                        latArr = event.border._latlngs;
                    /* 过滤框选后的数组，去重*/
                    var newData = []; // 去重后的数据
                    var repeatIdArr = [];
                    for (var i = 0, len = data.length; i < len; i++) {
                        if (repeatIdArr.indexOf(data[i].properties.id) < 0) {
                            repeatIdArr.push(data[i].properties.id);
                            newData.push(data[i]);
                        }
                    }
                    // 去除自己
                    for (var i = 0; i < newData.length; i++) {
                        if (parseInt(newData[i].properties.id) == objCtrl.data.pid) {
                            newData.splice(i, 1);
                            i--;
                        }
                    }
                    // /*高亮link*/
                    // for (var i = 0, lenI = newData.length; i < lenI; i++) {
                    //     highlightFeatures.push({
                    //         id: newData[i].properties.id.toString(),
                    //         layerid: 'poi',
                    //         type: 'IXPOI'
                    //     })
                    // }
                    highRenderCtrl.highLightFeatures = highlightFeatures;
                    highRenderCtrl.drawHighlight();
                    // 判断相交点数
                    if (newData.length == 0) {
                        tooltipsCtrl.setCurrentTooltip('所选区域无合适的POI点，请重新选择！');
                    } else {
                        var relationShap = {
                            rectData: newData,
                            loadType: 'sameRelationShapTplContainer',
                            propertyCtrl: appPath.poi + 'ctrls/attr-tips/poiSameCtrl',
                            propertyHtml: appPath.root + appPath.poi + 'tpls/attr-tips/poiSameTpl.html',
                            callback: function () {
                                $scope.$emit('showSamePoi');
                            }
                        };
                        $scope.$emit('transitCtrlAndTpl', relationShap);
                    }
                });
                // return;
            } else if (type === 'SELECTPARENT') {
                map.closePopup();
                tooltipsCtrl.setCurrentTooltip('请框选地图上的POI点！');
                eventController.off(eventController.eventTypes.GETBOXDATA);
                eventController.on(eventController.eventTypes.GETBOXDATA, function (event) {
                    var data = event.data,
                        highlightFeatures = [],
                        rectangleData = { // 矩形框信息geoJson
                            type: 'Polygon',
                            coordinates: [
                                []
                            ]
                        },
                        latArr = event.border._latlngs;
                    /* 过滤框选后的数组，去重*/
                    var newData = []; // 去重后的数据
                    var repeatIdArr = [];
                    for (var i = 0, len = data.length; i < len; i++) {
                        if (repeatIdArr.indexOf(data[i].properties.id) < 0 && (parseInt(data[i].properties.id) != objCtrl.data.pid)) {
                            repeatIdArr.push(data[i].properties.id);
                            newData.push(data[i]);
                        }
                    }
                    // 充电桩充电站只能以充电站为父
                    if (objCtrl.data.kindCode == '230218' || objCtrl.data.kindCode == '230227') {
                        for (var i = 0; i < newData.length; i++) {
                            if (newData[i].properties.kindCode != '230218') {
                                newData.splice(i, 1);
                                i--;
                            }
                        }
                    } else { // 其他poi不能以充电站为父
                        for (var i = 0; i < newData.length; i++) {
                            if (newData[i].properties.kindCode == '230218' || newData[i].properties.kindCode == '230227') {
                                newData.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    if (objCtrl.data.indoor == 0) { // 外部poi，只能以parent=1的poi为父
                        for (var i = 0; i < newData.length; i++) {
                            if ($scope.metaData.kindFormat[newData[i].properties.kindCode].parentFlag != 1) {
                                newData.splice(i, 1);
                                i--;
                            }
                        }
                    } else { // 内部poi，只能以parent=1 和2的poi为父
                        for (var i = 0; i < newData.length; i++) {
                            if (!($scope.metaData.kindFormat[newData[i].properties.kindCode].parentFlag == 1 || $scope.metaData.kindFormat[newData[i].properties.kindCode].parentFlag == 2)) {
                                newData.splice(i, 1);
                                i--;
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
                    // highRenderCtrl._cleanHighLight();
                    // highRenderCtrl.highLightFeatures = [];
                    // highlightFeatures.push({
                    //     id: objCtrl.data.pid.toString(),
                    //     layerid: 'poi',
                    //     type: 'IXPOI'
                    // });
                    // /*高亮link*/
                    // for (var i = 0, lenI = newData.length; i < lenI; i++) {
                    //     highlightFeatures.push({
                    //         id: newData[i].properties.id.toString(),
                    //         layerid: 'poi',
                    //         type: 'IXPOI'
                    //     })
                    // }
                    // highRenderCtrl.highLightFeatures = highlightFeatures;
                    // highRenderCtrl.drawHighlight();
                    // 判断相交点数
                    if (newData.length == 0) {
                        tooltipsCtrl.setCurrentTooltip('所选区域无合适的POI点，请重新选择！');
                    } else {
                        tooltipsCtrl.setCurrentTooltip('请编辑父子关系！');
                        var html = '<ul id="layerpopup">';
                        // this.overlays = this.unique(this.overlays);
                        for (var item in newData) {
                            var index = parseInt(item) + 1;
                            if (objCtrl.data.parents.length > 0 && newData[item].properties.id == objCtrl.data.parents[0].parentPoiPid) { // 当前父
                                html += '<li><a href="#" id="' + newData[item].properties.id + '">' + index + '、' + newData[item].properties.name + '</a>' + '&nbsp;&nbsp;' + '<label class="label label-primary">' + $scope.metaData.kindFormat[newData[item].properties.kindCode].kindName + '</label>' + '&nbsp;&nbsp;' + '<label class="label label-default">' + '当前父' + '</label>' + '&nbsp;&nbsp;' + '<input class="btn btn-warning btn-xs" type="button" onclick="changePoiParent(' + newData[item].properties.id + ')" value="解除父">' + '</li>';
                            } else {
                                html += '<li><a href="#" id="' + newData[item].properties.id + '">' + index + '、' + newData[item].properties.name + '</a>' + '&nbsp;&nbsp;' + '<label class="label label-primary">' + $scope.metaData.kindFormat[newData[item].properties.kindCode].kindName + '</label>' + '&nbsp;&nbsp;' + '<label class="label label-info">' + '可为父' + '</label>' + '&nbsp;&nbsp;' + '<input class="btn btn-success btn-xs" type="button" onclick="changePoiParent(' + newData[item].properties.id + ')" value="作为父">' + '</li>';
                            }
                            // html += '<li><a href="#" id="' + data[item].properties.id+'">'+ index + '、' +data[item].properties.name + '<label class="label label-primary">'+$scope.metaData.kindFormat[data[item].properties.kindCode].kindName+'</label>'+ '<input type="button">' + '</a></li>';
                        }
                        html += '</ul>';
                        popup.setLatLng([newData[item].point.y, newData[item].point.x]).setContent(html);
                        if (newData && newData.length >= 1) {
                            setTimeout(function () {
                                map.openPopup(popup);
                            }, 200);
                        }
                    }
                });
            }
            if (!selectCtrl.selectedFeatures) {
                return;
            }
            var feature = null;
            if (map.currentTool) {
                map.currentTool.disable();
            }
            if (shapeCtrl.shapeEditorResult) {
                feature = selectCtrl.selectedFeatures.geometry; // 获取要编辑的几何体的geometry
                feature.components = [];
                feature.points = [];
                feature.components.push(feature[0]);
                feature.components.push(feature[1]);
                feature.points.push(feature[0]);
                feature.points.push(feature[1]);
                feature.type = 'IXPOI';
                layerCtrl.pushLayerFront('edit'); // 使编辑图层置顶
                var sObj = shapeCtrl.shapeEditorResult;
                editLayer.drawGeometry = feature;
                editLayer.draw(feature, editLayer); // 在编辑图层中画出需要编辑的几何体
                sObj.setOriginalGeometry(feature);
                sObj.setFinalGeometry(feature);
            }
            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType[type]); // 设置编辑的类型
            shapeCtrl.startEditing(); // 开始编辑
            map.currentTool = shapeCtrl.getCurrentTool();
            if (type === 'POILOCMOVE') {
                shapeCtrl.editFeatType = 'IXPOI';
                map.currentTool.captureHandler._guides = [];
                map.currentTool.captureHandler.addGuideLayer(poiLayer); // 把点图层放到捕捉工具中
            } else if (type === 'POIGUIDEMOVE') {
                shapeCtrl.editFeatType = 'IXPOI';
                map.currentTool.captureHandler._guides = [];
                map.currentTool.captureHandler.addGuideLayer(rdLink); // 把线图层放到捕捉工具中
            } else if (type === 'POIAUTODRAG') {
                shapeCtrl.editFeatType = 'IXPOI';
                map.currentTool.captureHandler._guides = [];
                map.currentTool.captureHandler.addGuideLayer(rdLink); // 把线图层放到捕捉工具中
            } else if (type === 'SELECTPARENT') {
                map.currentTool.snapHandler._guides = [];
            }
            eventController.on(eventController.eventTypes.SHOWRAWPOI, function (data) {
                var html = '<div style="height:auto;float: left">' +
                    '<span>移动的距离是' + data.distance.toFixed(1) + '米，确定要移动吗？确认选择移动原因并点击是，否则请点击否。' +
                    '</span>' +
                    '<div>' +
                    '<div style="height:auto;float: left">' +
                    '<input type="radio" class="form-control" style="display:inline-block;width:20px;height: 15px;" name="rawFied" checked/>与道路逻辑关系调整' +
                    '<div>' +
                    '<div style="height:auto;float: left">' +
                    '<input type="radio" class="form-control" style="display:inline-block;width:20px;height: 15px;" name="rawFied"/>与设施逻辑关系调整' +
                    '<div>' +
                    '<div style="height:auto;float: left">' +
                    '<input type="radio" class="form-control" style="display:inline-block;width:20px;height: 15px;" name="rawFied"/>精度调整' +
                    '<div>';
                swal({
                    title: '移位提醒',
                    text: html,
                    html: true,
                    animation: 'slide-from-top',
                    showCancelButton: true,
                    closeOnConfirm: true,
                    confirmButtonText: '是',
                    cancelButtonText: '否'
                }, function (f) {
                    if (f) { // 执行是操作

                    } else { // 执行否操作
                        if (selectCtrl.selectedFeatures) {
                            selectCtrl.selectedFeatures.geometry.components[0].y = parseFloat(selectCtrl.selectedFeatures.secLocGeo.lat);
                            selectCtrl.selectedFeatures.geometry.components[0].x = parseFloat(selectCtrl.selectedFeatures.secLocGeo.lng);
                            selectCtrl.selectedFeatures.geometry.components[1].y = parseFloat(selectCtrl.selectedFeatures.secGuideGeo.lat);
                            selectCtrl.selectedFeatures.geometry.components[1].x = parseFloat(selectCtrl.selectedFeatures.secGuideGeo.lng);
                            selectCtrl.selectedFeatures.lastLocGeo = new L.latLng(selectCtrl.selectedFeatures.geometry[0].y, selectCtrl.selectedFeatures.geometry[0].x);
                            selectCtrl.selectedFeatures.lastGuideGeo = new L.latLng(selectCtrl.selectedFeatures.geometry[1].y, selectCtrl.selectedFeatures.geometry[1].x);
                            editLayer.clear();
                            setTimeout(function () {
                                editLayer._redraw();
                            }, 100);
                        }
                    }
                });
            });
        };
        /**
         * 查找poi
         */
        $scope.getPoi = function (pid) {
            dsEdit.getByPid(pid, 'IXPOI').then(function (rest) {
                if (rest) {
                    objCtrl.setCurrentObject('IXPOI', rest);
                    $scope.$emit('transitCtrlAndTpl', {
                        loadType: 'tipsTplContainer',
                        propertyCtrl: appPath.poi + 'ctrls/attr-tips/poiPopoverTipsCtl',
                        propertyHtml: appPath.root + appPath.poi + 'tpls/attr-tips/poiPopoverTips.html'
                    });
                    $scope.$emit('transitCtrlAndTpl', {
                        loadType: 'attrTplContainer',
                        propertyCtrl: appPath.poi + 'ctrls/attr-base/generalBaseCtl',
                        propertyHtml: appPath.root + appPath.poi + 'tpls/attr-base/generalBaseTpl.html'
                    });
                }
            });
        };
        /*
         变更父子关系
         */
        changePoiParent = function (parentId) {
            var myPid = objCtrl.data.pid;
            var myParent = objCtrl.data.parents;
            if (myParent.length > 0) {
                if (myParent[0].parentPoiPid == parentId) { // 解除
                    dsEdit.deleteParent(myPid).then(function (data) {
                        $scope.getPoi(myPid);
                    });
                } else { // 更新
                    dsEdit.updateParent(myPid, parentId).then(function (data) {
                        $scope.getPoi(myPid);
                    });
                }
            } else { // 新增
                dsEdit.createParent(myPid, parentId).then(function (data) {
                    $scope.getPoi(myPid);
                });
            }
            map.closePopup();
            if (tooltipsCtrl.getCurrentTooltip()) {
                tooltipsCtrl.onRemoveTooltip();
            }
        };
        // 高亮显示左侧列表的poi
        highlightPoiByPid = function () {
            var pid = objCtrl.data.pid;
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures.length = 0;
            var highLightFeatures = [];
            highLightFeatures.push({
                id: pid,
                layerid: 'poi',
                type: 'IXPOI',
                style: {}
            });
            // 高亮
            highRenderCtrl.highLightFeatures = highLightFeatures;
            highRenderCtrl.drawHighlight();
            // wt改，注释前会因为地图移动导致弹出工具条位置有偏移
            // map.setView([objCtrl.data.geometry.coordinates[1], objCtrl.data.geometry.coordinates[0]]);
            // console.log('-----------------'+[objCtrl.data.geometry.coordinates[1], objCtrl.data.geometry.coordinates[0]])
        };
    }
]);
