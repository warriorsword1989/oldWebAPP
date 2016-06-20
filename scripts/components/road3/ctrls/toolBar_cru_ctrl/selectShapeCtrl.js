/**
 * Created by liwanchong on 2015/10/28.
 */
var selectApp = angular.module("app", ['oc.lazyLoad']);
selectApp.controller("selectShapeController", ["$scope", '$ocLazyLoad', '$rootScope','dsFcc','dsRoad', function ($scope, $ocLazyLoad, $rootScope,dsFcc,dsRoad) {
    var selectCtrl = fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var rdNode = layerCtrl.getLayerById('referenceNode');
    var workPoint = layerCtrl.getLayerById('workPoint');
    var editLayer = layerCtrl.getLayerById('edit');
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.toolTipText = "";
    //重新设置选择工具
    $scope.resetToolAndMap = function () {
        if (map.currentTool) {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获

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
    $scope.showTipsOrProperty = function (data, type, objCtrl, propertyId, propertyCtrl, propertyTpl) {
        var ctrlAndTplParams = {
            loadType: 'tipsTplContainer',
            propertyCtrl: "components/road/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
            propertyHtml: "../../scripts/components/road/tpls/attr_tips_tpl/sceneAllTipsTpl.html",
            callback: function () {
                if (data.t_lifecycle === 2) { //外业修改直接打开相关的属性栏
                    $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                }
                else {//3新增或1删除
                    var stageLen = data.t_trackInfo.length;
                    var stage = parseInt(data.t_trackInfo[stageLen - 1]["stage"]);
                    if (stage === 1) { // 未作业 当是删除时 可以打开右侧属性栏
                        if (data.t_lifecycle === 1) {
                            $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                        }

                    } else if (stage === 3) {  //已作业 新添加的可以打开右侧属性栏
                        if (data.t_lifecycle === 3) {
                            if (data.f) {
                                $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                            }
                        }
                    }
                }
            }
        }
        //先load Tips面板和控制器
        $scope.$emit("transitCtrlAndTpl", ctrlAndTplParams);
    }
    $scope.selectShape = function (type, num) {
        //大于17级才可以选择地图上各种geometry
        if (map.getZoom() < 17) {
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
        $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
        $scope.subAttrTplContainerSwitch(false);
        $("#popoverTips").hide();

        //点击按钮后样式的修改
        $scope.changeBtnClass(num);

        //连续点击同一个按钮的操作
        if (!$scope.classArr[num]) {
            map.currentTool.disable();
            map._container.style.cursor = '';
            return;
        }
        if (type === "RDLINK") { // 选择线
            layerCtrl.pushLayerFront('edit'); //置顶editLayer

            //初始化选择线的工具
            map.currentTool = new fastmap.uikit.SelectPath(
                {
                    map: map,
                    currentEditLayer: rdLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
            map.currentTool.enable();
            //初始化鼠标提示
            $scope.toolTipText = '请选择线！';

            //把要捕捉的线图层添加到捕捉工具中
            map.currentTool.snapHandler.addGuideLayer(rdLink);
            rdLink.options.editable = true;
            eventController.off(eventController.eventTypes.GETLINKID, $scope.selectObjCallback);
            eventController.on(eventController.eventTypes.GETLINKID, $scope.selectObjCallback);
        }
        else if (type === "node") { //选择点

            layerCtrl.pushLayerFront('edit'); //置顶editLayer

            //初始化选择点工具
            map.currentTool = new fastmap.uikit.SelectNode({
                map: map,
                nodesFlag: true,
                currentEditLayer: rdNode,
                shapeEditor: shapeCtrl
            });
            map.currentTool.enable();
            //需要捕捉的图层
            map.currentTool.snapHandler.addGuideLayer(rdNode);
            $scope.toolTipText = '请选择node！';
            eventController.off(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
            eventController.on(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
        }
        else if (type === "relation") {
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
        }
        else if (type === "tips") {

            layerCtrl.pushLayerFront('workPoint');//置顶editLayer
            //初始化选择tips的工具
            map.currentTool = new fastmap.uikit.SelectDataTips({
                map: map,
                dataTipsFlag: true,
                currentEditLayer: workPoint
            });
            map.currentTool.enable();
            $scope.toolTipText = '请选择tips！';
            eventController.on(eventController.eventTypes.GETTIPSID, $scope.selectObjCallback);
            eventController.on(eventController.eventTypes.GETTIPSID, $scope.selectObjCallback)
        }
        tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
    };
    /**
     * 根据选择的geomtry从后台返回的数据 打开不同的属性面板
     * @param data
     */
    $scope.selectObjCallback = function (data) {
        $scope.$emit("SWITCHCONTAINERSTATE", {"subAttrContainerTpl": false})
        //地图小于17级时不能选择
        if (map.getZoom < 17) {
            return;
        }
        //清除上一个选择的高亮
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;

        var ctrlAndTmplParams = {
            propertyCtrl: "",
            propertyHtml: ""
        }, toolsObj = null;
        switch (data.optype) {
            case "LINK":
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
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
                }
                  //当在移动端进行编辑时,弹出此按钮
                if (L.Browser.touch) {
                    toolsObj.items.push({
                        'text': "<a class='glyphicon glyphicon-floppy-disk' type=''></a>",
                        'title': "保存",
                        'type': shapeCtrl.editType,
                        'class': "feaf",
                        callback: function () {
                            var e = $.Event("keydown");
                            e.keyCode = 32;
                            $(document).trigger(e);
                        }
                    })
                }

                selectCtrl.onSelected({
                    point: data.point
                });
                ctrlAndTmplParams.propertyCtrl = 'scripts/components/road3/ctrls/attr_link_ctrl/rdLinkCtrl';
                ctrlAndTmplParams.propertyHtml = "../../../scripts/components/road3/tpls/attr_link_tpl/rdLinkTpl.html";
                $scope.getFeatDataCallback(data, data.id, "RDLINK", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case "NODE":
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                toolsObj = {
                    items: [{
                        'text': "<a class='glyphicon glyphicon-move'></a>",
                        'title': "移动端点",
                        'type': "PATHNODEMOVE",
                        'class': "feaf",
                        callback: $scope.modifyTools
                    }]
                }
                //当在移动端进行编辑时,弹出此按钮
                if (L.Browser.touch) {
                    toolsObj.items.push({
                        'text': "<a class='glyphicon glyphicon-floppy-disk' type=''></a>",
                        'title': "保存",
                        'type': shapeCtrl.editType,
                        'class': "feaf",
                        callback: function () {
                            var e = $.Event("keydown");
                            e.keyCode = 32;
                            $(document).trigger(e);
                        }
                    })
                }

                ctrlAndTmplParams.propertyCtrl = 'scripts/components/road3/ctrls/attr_node_ctrl/rdNodeFromCtrl';
                ctrlAndTmplParams.propertyHtml = "../../../scripts/components/road3/tpls/attr_node_tpl/rdNodeFromTpl.html";
                $scope.getFeatDataCallback(data, data.id, "RDNODE", ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDRESTRICTION':
                //if (data.restrictionType === 1) {
                ctrlAndTmplParams.propertyCtrl = "scripts/components/road3/ctrls/attr_restriction_ctrl/rdRestriction";
                ctrlAndTmplParams.propertyHtml = "../../../scripts/components/road3/tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html";
                //}
                //else {
                //    ctrlAndTmplParams.propertyCtrl = "components/road/ctrls/attr_restriction_ctrl/rdRestriction";
                //    ctrlAndTmplParams.propertyHtml = "../../scripts/components/road/tpls/attr_restrict_tpl/rdRestrictOfTruckTpl.html";
                //}
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDLANECONNEXITY':
                ctrlAndTmplParams.propertyCtrl = 'scripts/components/road3/ctrls/attr_connexity_ctrl/rdLaneConnexityCtrl';
                ctrlAndTmplParams.propertyHtml = "../../../scripts/components/road3/tpls/attr_connexity_tpl/rdLaneConnexityTpl.html";
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDSPEEDLIMIT':
                ctrlAndTmplParams.propertyCtrl = 'scripts/components/road3/ctrls/attr_speedLimit_ctrl/speedLimitCtrl';
                ctrlAndTmplParams.propertyHtml = "../../../scripts/components/road3/tpls/attr_speedLimit_tpl/speedLimitTpl.html";
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDCROSS':
                ctrlAndTmplParams.propertyCtrl = 'scripts/components/road3/ctrls/attr_cross_ctrl/rdCrossCtrl';
                ctrlAndTmplParams.propertyHtml = "../../../scripts/components/road3/tpls/attr_cross_tpl/rdCrossTpl.html";
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDGSC':
                alert('RDGSC')
                ctrlAndTmplParams.propertyCtrl = 'scripts/components/road3/ctrls/attr_rdgsc_ctrl/rdGscCtrl';
                ctrlAndTmplParams.propertyHtml = "../../../scripts/components/road3/tpls/attr_gsc_tpl/rdGscTpl.html";
                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case 'RDBRANCH':
                alert('RDBRANCH')
                shapeCtrl.editFeatType = 0;
                ctrlAndTmplParams.propertyCtrl = "scripts/components/road3/ctrls/attr_branch_ctrl/rdBranchCtrl";
                ctrlAndTmplParams.propertyHtml = "../../../scripts/components/road3/tpls/attr_branch_Tpl/namesOfBranch.html";
                $scope.getFeatDataCallback(data, null, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
                break;
            case "TIPS":
                $("#popoverTips").css("display", "block");
                dsFcc.getTipsResult(data.id, function (result) {
                    if (result.rowkey === "undefined") {
                        return;
                    }
                    var options11 = {
                        "loadType": 'attrTplContainer',
                        "propertyCtrl": "scripts/components/road/ctrls/blank_ctrl/blankCtrl",
                        "propertyHtml": "../../../scripts/components/road/tpls/blank_tpl/blankTpl.html"
                    }
                    $scope.$emit("transitCtrlAndTpl", options11);
                    $scope.$emit("SWITCHCONTAINERSTATE",
                        {
                            "attrContainerTpl": false
                        });
                    eventController.fire(eventController.eventTypes.SELECTBYATTRIBUTE, {feather: result});
                    switch (result.s_sourceType) {
                        case "2001"://测线
                            $scope.showTipsOrProperty(result, "RDLINK", objCtrl, result.id, "scripts/components/road/ctrls/attr_link_ctrl/rdLinkCtrl", "../../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html");
                            break;
                        case "1101"://点限速
                            $scope.showTipsOrProperty(result, "RDSPEEDLIMIT", objCtrl, result.id, "scripts/components/road/ctrls/attr_speedLimit_ctrl/speedLimitCtrl", "../../../scripts/components/road/tpls/attr_speedLimit_tpl/speedLimitTpl.html");
                            break;
                        case "1203"://道路方向
                            var ctrlAndTplOfDirect = {
                                "loadType": "tipsTplContainer",
                                "propertyCtrl": "components/road/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                "propertyHtml": "../../scripts/components/road/tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                callback: function () {
                                    if (result.f.type == 1) {
                                        $scope.getFeatDataCallback(result, result.f.id, "RDLINK", "scripts/components/road/ctrls/attr_link_ctrl/rdLinkCtrl", "../../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html")
                                    }
                                }
                            }
                            $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfDirect);
                            break;
                        case "1201"://种别
                            $scope.showTipsOrProperty(result, "RDLINK", objCtrl, result.f.id, "scripts/components/road/ctrls/attr_link_ctrl/rdLinkCtrl", "../../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html");
                            break;
                        case "1301"://车信
                            $scope.showTipsOrProperty(result, "RDLANECONNEXITY", objCtrl, result.id, "scripts/components/road/ctrls/attr_connexity_ctrl/rdLaneConnexityCtrl", "../../../scripts/components/road/tpls/attr_connexity_tpl/rdLaneConnexityTpl.html");
                            break;
                        case "1302"://交限
                            $scope.showTipsOrProperty(result, "RDRESTRICTION", objCtrl, result.id, "scripts/components/road/ctrls/attr_restriction_ctrl/rdRestriction", "../../../scripts/components/road/tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html");
                            break;
                        case "1407"://分歧
                            $scope.showTipsOrProperty(result, "RDBRANCH", objCtrl, result.brID ? result.brID[0].id : '', "scripts/components/road/ctrls/attr_branch_ctrl/rdBranchCtrl", "../../../scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html");
                            break;
                        case "1510"://桥
                            var ctrlAndTplOfBridge = {
                                "loadType": "tipsTplContainer",
                                "propertyCtrl": "scripts/components/road/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                "propertyHtml": "../../../scripts/components/road/tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                callback: function () {
                                    $scope.brigeLinkArray = result.f_array;
                                    $scope.getFeatDataCallback(result, result.f_array[0].id, "RDLINK", "scripts/components/road/ctrls/attr_link_ctrl/rdLinkCtrl", "../../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html")
                                }
                            }
                            $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfBridge);
                            break;
                        case "1514"://施工
                            var ctrlAndTplOfMend = {
                                "loadType": "tipsTplContainer",
                                "propertyCtrl": "scripts/components/road/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                "propertyHtml": "../../../scripts/components/road/tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                callback: function () {
                                    $scope.brigeLinkArray = result.f_array;
                                    $scope.getFeatDataCallback(result, result.f_array[0].id, "RDLINK", "components/road/ctrls/attr_link_ctrl/rdLinkCtrl", "../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html")
                                }
                            }
                            $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfMend);
                            break;
                        case "1604"://区域内道路
                            break;
                        case  "1704"://交叉路口
                            var ctrlAndTplOfCross = {
                                "loadType": "tipsTplContainer",
                                "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                callback: function () {
                                    if (result.f.id) {
                                        var obj = {"nodePid": parseInt(result.f.id)};
                                        var param = {
                                            "dbId": App.Temp.dbId,
                                            "type": "RDCROSS",
                                            "data": obj
                                        }
                                        dsRoad.getByCondition(JSON.stringify(param), function (data) {

                                            var crossCtrlAndTpl = {
                                                propertyCtrl: appPath.road + "ctrls/attr_cross_ctrl/rdCrossCtrl",
                                                propertyHtml: appPath.root + appPath.road + "tpls/attr_cross_tpl/rdCrossTpl.html"
                                            }
                                            objCtrl.setCurrentObject("RDCROSS", result.data[0]);
                                            $scope.$emit("transitCtrlAndTpl", crossCtrlAndTpl);
                                        });
                                    }
                                }
                            }
                            $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfCross);
                            break;
                        case "1803"://挂接
                            var ctrlAndTplOfOfGJ = {
                                "loadType": "tipsTplContainer",
                                "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                            }
                            $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfOfGJ);
                            break;
                        case "1501"://上下线分离
                            var ctrlAndTplOfUpAndDown = {
                                "loadType": "tipsTplContainer",
                                "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                                callback: function () {
                                    $scope.getFeatDataCallback(result, result.f_array[0].id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                                }
                            }
                            $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfUpAndDown);
                            break;
                        case "1901"://道路名
                            var ctrlAndTplOfName = {
                                "loadType": "tipsTplContainer",
                                "propertyCtrl": appPath.road + "/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                                "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                            }
                            $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfName);
                            break;
                    }
                })
                break;
        }
        if (!map.floatMenu && toolsObj) {
            map.floatMenu = new L.Control.FloatMenu("000", data.event.originalEvent, toolsObj)
            map.addLayer(map.floatMenu);
            map.floatMenu.setVisible(true);
        }
    }
    $scope.sign = 0;//初始值
    /**
     * 修改方向
     * @param direct
     * @returns {*}
     */
    $scope.changeDirect = function (direct) {
        var orientation;
        switch (direct) {
            case 1: //双方向
                if ($scope.sign === 0) {
                    orientation = 3;//向左
                } else if (this.sign === 1) {
                    orientation = 2;//向右
                }
                break;
            case 2://顺方向
                orientation = 1;
                $scope.sign = 0;
                break;
            case 3://逆方向
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
    $scope.modifyTools = function (event) {
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
            if (type === "PATHVERTEXINSERT") {
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
                    $scope.$apply();
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
                editLayer.draw(feature, editLayer);//把需要编辑的几何体画在editLayer上
                sObj.setOriginalGeometry(feature);
                sObj.setFinalGeometry(feature);
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType[type]); //设置编辑状态
                shapeCtrl.startEditing();
                map.currentTool = shapeCtrl.getCurrentTool();
                shapeCtrl.editFeatType = "rdLink";
                map.currentTool.snapHandler.addGuideLayer(rdLink); //捕捉图层

            }
            shapeCtrl.on("startshapeeditresultfeedback", saveOrEsc);
            shapeCtrl.on("stopshapeeditresultfeedback", function () {
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
    $scope.getFeatDataCallback = function (selectedData, id, type, ctrl, tpl) {
        dsRoad.getRdObjectById(id, type, selectedData.id).then(function (data) {
            if (data.errcode === -1) {
                return;
            }
            objCtrl.setCurrentObject(type, data.data);
            tooltipsCtrl.onRemoveTooltip();
            var options = {
                "loadType": 'attrTplContainer',
                //"loadType": 'generalBaseTpl',
                "propertyCtrl": ctrl,
                "propertyHtml": tpl
            }
            $scope.$emit("transitCtrlAndTpl", options);
        });
    }
}])