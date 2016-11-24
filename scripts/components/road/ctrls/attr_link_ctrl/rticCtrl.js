/**
 * Created by liwanchong on 2015/10/29.
 */
var realtimeTrafficApp = angular.module('app');
realtimeTrafficApp.controller('realtimeTrafficController', function ($scope, dsMeta ,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = new fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var rdNode = layerCtrl.getLayerById('rdNode');
    var rdCross = layerCtrl.getLayerById('relationData');
    var workPoint = layerCtrl.getLayerById('workPoint');
    var editLayer = layerCtrl.getLayerById('edit');
    var tmcLayer = layerCtrl.getLayerById('tmcData');
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.rticData = objCtrl.data;
    $scope.tmcTreeData = [];
    $scope.expandedNodes = [];

    $scope.resetToolAndMap = function () {
        // if (typeof map.currentTool.cleanHeight === "function") {
        //     map.currentTool.cleanHeight();
        // }
        // if (tooltipsCtrl.getCurrentTooltip()) {
        //     tooltipsCtrl.onRemoveTooltip();
        // }
        editLayer.drawGeometry = null;
        shapeCtrl.stopEditing();
        editLayer.bringToBack();
        $(editLayer.options._div).unbind();
        // $scope.changeBtnClass("");
        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
        editLayer.clear();
    };
    $scope.rticDroption = [
        { id: 0, label: '无' },
        { id: 1, label: '顺方向' },
        { id: 2, label: '逆方向' }
    ];
    $scope.rankoption = [
        { id: 0, label: '无' },
        { id: 1, label: '高速' },
        { id: 2, label: '城市高速' },
        { id: 3, label: '干线道路' },
        { id: 4, label: '其他道路' }
    ];

    $scope.minusIntRtic = function (id) {
        $scope.rticData.intRtics.splice(id, 1);
        if ($scope.rticData.intRtics.length === 0) {

        }
    };
    $scope.addIntRtic = function () {
        var newIntRtic = fastmap.dataApi.rdLinkIntRtic({ linkPid: $scope.rticData.pid });
        $scope.rticData.intRtics.unshift(newIntRtic);
    };
    $scope.addCarRtic = function () {
        var newRtic = fastmap.dataApi.rdLinkRtic({ linkPid: $scope.rticData.pid });
        $scope.rticData.rtics.unshift(newRtic);
    };
    // 选择TMCPoint方法
    $scope.selectTmcCallback = function (data) {
        $scope.selectedFeature = data;
        // 地图小于17级时不能选择
        if (map.getZoom < 17) {
            return;
        }
        console.log(data);
    };
    // 新增TMC匹配信息
    $scope.addTmcLocation = function () {
        highRenderCtrl.highLightFeatures.push({
            id: $scope.rticData.pid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {}
        });
        highRenderCtrl.drawHighlight();
        tooltipsCtrl.setCurrentTooltip('开始TMC匹配信息起点！');

        map.currentTool.disable();
        // 初始化选择关系的工具
        map.currentTool = new fastmap.uikit.SelectRelation({
            map: map,
            relationFlag: true
        });
        map.currentTool.enable();
        editLayer.bringToBack();
        $scope.toolTipText = '请选择关系！';
        eventController.off(eventController.eventTypes.GETRELATIONID);
        eventController.on(eventController.eventTypes.GETRELATIONID, $scope.selectTmcCallback);
        if (shapeCtrl.shapeEditorResult) {
            shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.point(0, 0));
            selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
            layerCtrl.pushLayerFront('edit');
        }
        // shapeCtrl.setEditingType('addTmcLocation');
        // shapeCtrl.startEditing();
        // map.currentTool = shapeCtrl.getCurrentTool();
        tooltipsCtrl.setEditEventType('addTmcLocation');
        tooltipsCtrl.setChangeInnerHtml('点击空格保存,或者按ESC键取消!');
    };
    /* 递归查询select节点 */
    $scope.getSelectObject = function (array) {
        $scope.expandedNodes = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].type === 'TMCPOINT') {
                $scope.expandedNodes = [array[i]];
                return;
            } else if (i === array.length - 1) {
                if (array[i].children) {
                    $scope.getSelectObject(array[i].children);
                }
            }
        }
    };
    /* 查询TMC树形结构 */
    $scope.getTmcTree = function (tmcPoints) {
        var param = {
            tmcIds: tmcPoints
        };
        dsMeta.queryTmcTree(param).then(function (data) {
            $scope.tmcTreeData = [data.data];
            // $scope.expandedNodes = [$scope.tmcTreeData[0]];
            // $scope.getSelectObject($scope.tmcTreeData);
            // console.log($scope.expandedNodes)
        });
    };
    /* 加载二级面板 */
    $scope.loadChildPanel = function (res, ctrl, html) {
        var showNameInfoObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var showNameObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: ctrl,
                    propertyHtml: html
                };
                $scope.$emit('transitCtrlAndTpl', showNameObj);
            }
        };
        objCtrl.tmcInfos = res;
        $scope.$emit('transitCtrlAndTpl', showNameInfoObj);
    };
    // 选择树子节点查询
    $scope.showTreeSelected = function (sel) {
        console.log(sel);
        var param = {
            tmcId: sel.tmcId,
            type: sel.type
        };
        if (sel.type === 'TMCPOINT') {
            dsMeta.queryTmcData(param).then(function (data) {
                $scope.loadChildPanel(fastmap.dataApi.tmcPoint(data.data), 'scripts/components/road/ctrls/attr_link_ctrl/tmcPointCtrl', '../../../scripts/components/road/tpls/attr_link_tpl/tmcPointTpl.html');
            });
        } else if (sel.type === 'TMCLINE') {
            dsMeta.queryTmcData(param).then(function (data) {
                $scope.loadChildPanel(fastmap.dataApi.tmcLine(data.data), 'scripts/components/road/ctrls/attr_link_ctrl/tmcLineCtrl', '../../../scripts/components/road/tpls/attr_link_tpl/tmcLineTpl.html');
            });
        } else {
            $scope.$emit('SWITCHCONTAINERSTATE', {
                subAttrContainerTpl: false,
                attrContainerTpl: true
            });
        }
    };
    // 框选TMCPoint
    $scope.selectTmcPoint = function () {
        map.currentTool = new fastmap.uikit.SelectForRectang({
            map: map,
            shapeEditor: shapeCtrl,
            LayersList: [tmcLayer]
        });
        map.currentTool.enable();
        eventController.off(eventController.eventTypes.GETRECTDATA);
        eventController.on(eventController.eventTypes.GETRECTDATA, function (data) {
            var tmcPointArray = [];
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures = [];
            if (data && data.data && data.data.length == 0) {
                tooltipsCtrl.setCurrentTooltip('请重新框选TMCPoint！');
                return;
            }
            // 筛选排除非TMCPoint要素
            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].data && data.data[i].data.properties.featType == 'TMCPOINT') {
                    if (data.data[i].data.properties.id !== undefined) {
                        tmcPointArray.push(data.data[i].data.properties.id);
                        highRenderCtrl.highLightFeatures.push({
                            id: data.data[i].data.properties.id.toString(),
                            layerid: 'tmcData',
                            type: 'TMCPOINT',
                            style: {}
                        });
                    }
                }
            }
            tmcPointArray = Utils.distinctArr(tmcPointArray);
            highRenderCtrl.drawHighlight();
            tooltipsCtrl.setCurrentTooltip('空格查询TMC！');
            // console.info(Utils.distinctArr(tmcPointArray));
            $scope.getTmcTree(tmcPointArray);
            map.currentTool.disable();
        });
    };
    /* 删除TMC信息 */
    $scope.removeTmcLoc = function (item) {
        swal({
            title: '确认删除TMC？',
            type: 'warning',
            animation: 'slide-from-top',
            showCancelButton: true,
            confirmButtonText: '是的，我要删除',
            confirmButtonColor: '#ec6c62'
        }, function (f) {
            if (f) {
                var param = {
                    command: 'DELETE',
                    type: 'RDTMCLOCATION',
                    dbId: App.Temp.dbId,
                    objId: item.pid
                };
                dsEdit.save(param).then(function (data) {
                    if (data) {
                        $scope.refreshLinkData();
                        $scope.$emit('SWITCHCONTAINERSTATE', {
                            subAttrContainerTpl: false,
                            attrContainerTpl: true
                        });
                    }
                });
            }
        });
    };
    /* 刷新rdlink数据 */
    $scope.refreshLinkData = function () {
        dsEdit.getByPid(parseInt($scope.rticData.pid), 'RDLINK').then(function (data) {
            if (data) {
                objCtrl.setCurrentObject('RDLINK', data);
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
            }
        });
    };
    /* 追踪link方法 */
    $scope.getTruckLinks = function () {
        if ($scope.tmcRelation.nodePid) {
            var param = {
                command: 'CREATE',
                dbId: App.Temp.dbId,
                type: 'RDLINK',
                data: {
                    linkPid: $scope.rticData.pid,
                    nodePidDir: $scope.tmcRelation.nodePid,
                    maxNum: 30
                }
            };
            dsEdit.getByCondition(param).then(function (data) {
                console.log(data)
            });
        }
    };
    /* 追踪link操作 */
    $scope.linkOfTruck = function () {
        $scope.autoTrack = !$scope.autoTrack;
        // 初始化新增数据;
        $scope.tmcRelation = {
            tmcId: '',
            locDirect: '',
            loctableId: '',
            direct: '',
            inLinkPid: '',
            outLinkPid: '',
            nodePid: '',
            linkPids: [],
            pointPids: []
        };
        $scope.linkNodes = [];
        $scope.links = [];
        if ($scope.autoTrack) {
            // 如果进入线是单方向道路，自动选择进入点;
            if ($scope.rticData.direct == 2 || $scope.rticData.direct == 3) {
                $scope.tmcRelation.nodePid = parseInt($scope.rticData.direct == 2 ? $scope.rticData.eNodePid : $scope.rticData.sNodePid);
                $scope.linkNodes.push($scope.tmcRelation.nodePid);
                highRenderCtrl.highLightFeatures.push({
                    id: $scope.tmcRelation.nodePid.toString(),
                    layerid: 'rdLink',
                    type: 'node',
                    style: {
                        color: 'yellow'
                    }
                });
                highRenderCtrl.drawHighlight();
                $scope.getTruckLinks();
            } else {
                // 如果双方向则先选择方向
                // $scope.resetOperator('addRelation', type);
                // 保存所有需要高亮的图层数组;
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.TMCLOCATION);
                // 地图编辑相关设置;
                tooltipsCtrl.setCurrentTooltip('选择进入点！');
                // 初始化选择点工具
                map.currentTool = new fastmap.uikit.SelectNode({
                    map: map,
                    nodesFlag: true,
                    shapeEditor: shapeCtrl
                });
                map.currentTool.enable();
                // 需要捕捉的图层
                eventController.off(eventController.eventTypes.GETNODEID, selectObjCallback);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    // 如果进入线是双方向的，则根据用户的选择高亮进入点;
                    $scope.tmcRelation.nodePid = parseInt(data.id);
                    $scope.linkNodes.push($scope.tmcRelation.nodePid);
                    highRenderCtrl.highLightFeatures.push({
                        id: $scope.tmcRelation.nodePid.toString(),
                        layerid: 'rdLink',
                        type: 'node',
                        style: {
                            color: 'yellow'
                        }
                    });
                    highRenderCtrl.drawHighlight();
                    tooltipsCtrl.setCurrentTooltip('已经选择进入点!');
                    setTimeout(function() {
                        tooltipsCtrl.setCurrentTooltip('请选择接续线!');
                    });
                    map.currentTool.snapHandler.addGuideLayer(rdLink);
                    $scope.getTruckLinks();
                });
            }
        }
    };
    $scope.minusCarRtic = function (id) {
        $scope.rticData.rtics.splice(id, 1);
        if ($scope.rticData.rtics.length === 0) {

        }
    };
    $scope.showScene = function (id) {
        for (var layer in layerCtrl.layers) {
            if (id === 1) {
                if (layerCtrl.layers[layer].options.requestType === 'RDLINKINTRTIC') {
                    layerCtrl.layers[layer].options.isUpDirect = false;
                    layerCtrl.layers[layer].options.visible = true;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                } else if (layerCtrl.layers[layer].options.requestType === 'RDLINKRTIC') {
                    layerCtrl.layers[layer].options.isUpDirect = true;
                    layerCtrl.layers[layer].options.visible = false;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                }
            } else if (id === 2) {
                if (layerCtrl.layers[layer].options.requestType === 'RDLINKRTIC') {
                    layerCtrl.layers[layer].options.isUpDirect = false;
                    layerCtrl.layers[layer].options.visible = true;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                } else if (layerCtrl.layers[layer].options.requestType === 'RDLINKINTRTIC') {
                    layerCtrl.layers[layer].options.isUpDirect = true;
                    layerCtrl.layers[layer].options.visible = false;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                }
            } else if (id === 3) {
                if (layerCtrl.layers[layer].options.id === 'tmcData') {
                    layerCtrl.layers[layer].options.visible = true;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                }
                if (layerCtrl.layers[layer].options.requestType === 'RDLINKRTIC') {
                    layerCtrl.layers[layer].options.isUpDirect = false;
                    layerCtrl.layers[layer].options.visible = false;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                } else if (layerCtrl.layers[layer].options.requestType === 'RDLINKINTRTIC') {
                    layerCtrl.layers[layer].options.isUpDirect = false;
                    layerCtrl.layers[layer].options.visible = false;
                    eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                        layerArr: layerCtrl.layers
                    });
                }
            }
        }
    };

    $scope.showRticsInfo = function (item) {
        $scope.linkData.oridiRowId = item.rowId;

        var showRticsInfoObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var rticObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/rticOfIntCtrl',
                    propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/rticOfIntTpl.html'
                };
                $scope.$emit('transitCtrlAndTpl', rticObj);
            }
        };
        $scope.$emit('transitCtrlAndTpl', showRticsInfoObj);
    };

    $scope.showCarInfo = function (cItem) {
        $scope.linkData.oridiRowId = cItem.rowId;

        var showCarInfoObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var rticObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/rticOfCar',
                    propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/rticOfCarTpl.html'
                };
                $scope.$emit('transitCtrlAndTpl', rticObj);
            }
        };
        $scope.$emit('transitCtrlAndTpl', showCarInfoObj);
    };

    /* 查看TMC信息详情 */
    $scope.showTmcInfo = function (item) {
        $scope.loadChildPanel(item, 'scripts/components/road/ctrls/attr_link_ctrl/tmcLocationCtrl', '../../../scripts/components/road/tpls/attr_link_tpl/tmcLocationTpl.html');
    };
    $scope.changeColor = function (ind, ord) {
        if (ord === 1) {
            $('#rticSpan' + ind).css('color', '#FFF');
        } else if (ord === 2) {
            $('#carSpan' + ind).css('color', '#FFF');
        } else {
            $('#tmcSpan' + ind).css('color', '#FFF');
        }
    };
    $scope.backColor = function (ind, ord) {
        if (ord === 1) {
            $('#rticSpan' + ind).css('color', 'darkgray');
        } else if (ord === 2) {
            $('#carSpan' + ind).css('color', 'darkgray');
        } else {
            $('#tmcSpan' + ind).css('color', 'darkgray');
        }
    };


    $scope.intitRticData = function () {
        if ($scope.rticData.intRtics.length > 0) {
        } else {
            var newIntRtic = fastmap.dataApi.rdLinkIntRtic({ linkPid: $scope.rticData.pid, rowId: '0' });
            $scope.rticData.intRtics.unshift(newIntRtic);
        }
        objCtrl.data.oridiRowId = $scope.rticData.intRtics[0].rowId;
        // 默认不追踪link
        $scope.autoTrack = false;
        /*var showRticsInfoObj = {
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/attr_link_ctrl/rticOfIntCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/attr_link_tpl/rticOfIntTpl.html'
        };
        $scope.$emit('transitCtrlAndTpl', showRticsInfoObj);*/
        $scope.resetToolAndMap();
        // 初始化鼠标提示
        // $scope.toolTipText = '';
        // tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
        map.currentTool.disable();
    };

    if (objCtrl.data) {
        $scope.intitRticData();
    }
    objCtrl.updateObject = function () {
        $scope.intitRticData();
    };
});
