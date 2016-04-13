/**
 * Created by liwanchong on 2015/10/28.
 */
var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
selectApp.controller("selectShapeController", ["$scope", '$ocLazyLoad', '$rootScope', function ($scope, $ocLazyLoad, $rootScope) {
    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var rdCross = layerCtrl.getLayerById("rdcross")
    var workPoint = layerCtrl.getLayerById('workPoint');
    var editLayer = layerCtrl.getLayerById('edit');
    $scope.flagId = 0;
    $scope.toolTipText = "";
    $scope.resetToolAndMap = function () {
        if (typeof map.currentTool.cleanHeight === "function") {
            map.currentTool.cleanHeight();
        }
        if (tooltipsCtrl.getCurrentTooltip()) {
            tooltipsCtrl.onRemoveTooltip();
        }
        editLayer.drawGeometry = null;
        shapeCtrl.stopEditing();
        editLayer.bringToBack();
        $(editLayer.options._div).unbind();
        $scope.changeBtnClass("");
        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
        editLayer.clear();
    };

    $scope.showTipsOrProperty = function (data, type, objCtrl, propertyId, propertyCtrl, propertyTpl) {
        var ctrlAndTplParams = {
            loadType: 'tipsTplContainer',
            propertyCtrl: "ctrl/sceneAllTipsCtrl",
            propertyHtml: "js/tpl/attr_tips_tpl/sceneAllTipsTpl.html",
            callback: function () {
                if (data.t_lifecycle === 2) { //外业修改
                    $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                }
                else {//3新增或1删除
                    var stageLen = data.t_trackInfo.length;
                    var stage = parseInt(data.t_trackInfo[stageLen - 1]["stage"]);
                    if (stage === 1) { // 未作业
                        if (data.s_sourceType === "1201") {
                            $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                        } else {
                            if (data.t_lifecycle === 1) {
                                $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                            }
                        }
                    } else if (stage === 3) {  //已作业
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
        $scope.resetToolAndMap();
        $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
        $("#popoverTips").hide();
        map.currentTool.disable();//禁止当前的参考线图层的事件捕获
        $scope.changeBtnClass(num);
        if (!$scope.classArr[num]) {
            map.currentTool.disable();
            map._container.style.cursor = '';
            return;
        }

        if (type === "link") {
            layerCtrl.pushLayerFront('edit');
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
            rdLink.options.selectType = 'link';
            rdLink.options.editable = true;
            eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                selectCtrl.onSelected({
                    point: data.point
                });
                $scope.getFeatDataCallback(data, data.id, "RDLINK", 'ctrl/attr_link_ctrl/rdLinkCtrl', "js/tpl/attr_link_tpl/rdLinkTpl.html");
            })
        }
        else if (type === "node") {
            layerCtrl.pushLayerFront('edit');
            rdLink.options.selectType = 'node';
            rdLink.options.editable = true;
            map.currentTool = new fastmap.uikit.SelectNode({
                map: map,
                nodesFlag: true,
                currentEditLayer: rdLink,
                shapeEditor: shapeCtrl
            });
            map.currentTool.enable();
            $scope.toolTipText = '请选择node！';
            eventController.on(eventController.eventTypes.GETNODEID, function (data) {
                $scope.getFeatDataCallback(data, data.id, "RDNODE", 'ctrl/attr_node_ctrl/rdNodeFromCtrl', "js/tpl/attr_node_tpl/rdNodeFromTpl.html");
            });
        }
        else if (type === "relation") {
            map.currentTool = new fastmap.uikit.SelectRelation({
                map: map,
                relationFlag: true
            });
            map.currentTool.enable();

            editLayer.bringToBack();
            $scope.toolTipText = '请选择关系！';
            eventController.on(eventController.eventTypes.GETRELATIONID, function (data) {
                $scope.data = data;
                $scope.tips = data.tips;
                var ctrlAndTmplParams = {
                    propertyCtrl: "",
                    propertyHtml: ""
                }
                switch ($scope.data.optype) {
                    case 'RDRESTRICTION':
                        if ($scope.tips === 0) {
                            ctrlAndTmplParams.propertyCtrl = "ctrl/attr_restriction_ctrl/rdRestriction";
                            ctrlAndTmplParams.propertyHtml = "js/tpl/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html";
                        }
                        else {
                            ctrlAndTmplParams.propertyCtrl = "ctrl/attr_restriction_ctrl/rdRestriction";
                            ctrlAndTmplParams.propertyHtml = "js/tpl/attr_restrict_tpl/rdRestrictOfTruckTpl.html";
                        }
                        break;
                    case 'RDLANECONNEXITY':
                        ctrlAndTmplParams.propertyCtrl = 'ctrl/attr_connexity_ctrl/rdLaneConnexityCtrl';
                        ctrlAndTmplParams.propertyHtml = "js/tpl/attr_connexity_tpl/rdLaneConnexityTpl.html";
                        break;
                    case 'RDSPEEDLIMIT':
                        ctrlAndTmplParams.propertyCtrl = 'ctrl/attr_speedLimit_ctrl/speedLimitCtrl';
                        ctrlAndTmplParams.propertyHtml = "js/tpl/attr_speedLimit_tpl/speedLimitTpl.html";
                        break;
                    case 'RDCROSS':
                        ctrlAndTmplParams.propertyCtrl = 'ctrl/attr_cross_ctrl/rdCrossCtrl';
                        ctrlAndTmplParams.propertyHtml = "js/tpl/attr_cross_tpl/rdCrossTpl.html";
                        break;
                    case 'RDBRANCH':
                        ctrlAndTmplParams.propertyCtrl = "ctrl/attr_branch_ctrl/rdBranchCtrl";
                        ctrlAndTmplParams.propertyHtml = "js/tpl/attr_branch_Tpl/namesOfBranch.html";
                        break;
                }

                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
            })
        }
        else if (type === "tips") {
            $scope.toolTipText = '请选择tips！';
            layerCtrl.pushLayerFront('workPoint');
            map.currentTool = new fastmap.uikit.SelectDataTips({
                map: map,
                dataTipsFlag: true,
                currentEditLayer: workPoint
            });
            map.currentTool.enable();
            workPoint.options.selectType = 'tips';
            workPoint.options.editable = true;
            eventController.on(eventController.eventTypes.GETTIPSID, function (data) {
                    $scope.data = data;
                    $("#popoverTips").css("display", "block");
                    Application.functions.getTipsResult($scope.data.id, function (data) {
                        if (data.rowkey === "undefined") {
                            return;
                        }
                        eventController.fire(eventController.eventTypes.SELECTBYATTRIBUTE, {feather: data});
                        switch (data.s_sourceType) {
                            case "2001"://测线
                                $scope.showTipsOrProperty(data, "RDLINK", objCtrl, data.id, "ctrl/attr_link_ctrl/rdLinkCtrl", "js/tpl/attr_link_tpl/rdLinkTpl.html");
                                break;
                            case "1101"://点限速
                                $scope.showTipsOrProperty(data, "RDSPEEDLIMIT", objCtrl, data.id, "ctrl/attr_speedLimit_ctrl/speedLimitCtrl", "js/tpl/attr_speedLimit_tpl/speedLimitTpl.html");
                                break;
                            case "1203"://道路方向
                                var ctrlAndTplOfDirect = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": "ctrl/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": "js/tpl/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function () {
                                        if (data.f.type == 1) {
                                            $scope.getFeatDataCallback(data, data.f.id, "RDLINK", "ctrl/attr_link_ctrl/rdLinkCtrl", "js/tpl/attr_link_tpl/rdLinkTpl.html")
                                        }
                                    }
                                }
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfDirect);
                                break;
                            case "1201"://种别
                                $scope.showTipsOrProperty(data, "RDLINK", objCtrl, data.f.id, "ctrl/attr_link_ctrl/rdLinkCtrl", "js/tpl/attr_link_tpl/rdLinkTpl.html");
                                break;
                            case "1301"://车信
                                $scope.showTipsOrProperty(data, "RDLANECONNEXITY", objCtrl, data.id, "ctrl/attr_connexity_ctrl/rdLaneConnexityCtrl", "js/tpl/attr_connexity_tpl/rdLaneConnexityTpl.html");
                                break;
                            case "1302"://交限
                                $scope.showTipsOrProperty(data, "RDRESTRICTION", objCtrl, data.id, "ctrl/attr_restriction_ctrl/rdRestriction", "js/tpl/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html");
                                break;
                            case "1407"://分歧
                                $scope.showTipsOrProperty(data, "RDBRANCH", objCtrl, data.brID ? data.brID[0].id : '', "ctrl/attr_branch_ctrl/rdBranchCtrl", "js/tpl/attr_branch_Tpl/namesOfBranch.html");
                                break;
                            case "1510"://桥
                                var ctrlAndTmplOfBridge = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": "ctrl/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": "js/tpl/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function () {
                                        if (data.f_array.length != 0) {
                                            $scope.brigeLinkArray = data.f_array;
                                            $scope.getFeatDataCallback(data, data.f_array[0].id, "RDLINK", "ctrl/attr_link_ctrl/rdLinkCtrl", "js/tpl/attr_link_tpl/rdLinkTpl.html")
                                        }
                                    }
                                }
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTmplOfBridge);
                                break;
                            case "1604"://区域内道路
                                break;
                            case  "1704"://交叉路口
                                var ctrlAndTplOfCross = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": "ctrl/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": "js/tpl/attr_tips_tpl/sceneAllTipsTpl.html",
                                    callback: function () {
                                        if (data.f.id) {
                                            var obj = {"nodePid": parseInt(data.f.id)};
                                            var param = {
                                                "projectId": Application.projectid,
                                                "type": "RDCROSS",
                                                "data": obj
                                            }
                                            Application.functions.getByCondition(JSON.stringify(param), function (data) {
                                                var crossCtrlAndTpl = {
                                                    propertyCtrl: "ctrl/attr_cross_ctrl/rdCrossCtrl",
                                                    propertyHtml: "js/tpl/attr_cross_tpl/rdCrossTpl.html",
                                                }
                                                objCtrl.setCurrentObject("RDCROSS", data.data[0]);
                                                $scope.$emit("transitCtrlAndTpl", crossCtrlAndTpl);
                                            });
                                        }
                                    }
                                }
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfCross);
                                break;
                            case "1803"://挂接
                                break;
                            case "1901"://道路名
                                var ctrlAndTplOfName = {
                                    "loadType": "tipsTplContainer",
                                    "propertyCtrl": "ctrl/attr_tips_ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": "js/tpl/attr_tips_tpl/sceneAllTipsTpl.html"
                                }
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfName);
                                break;
                        }
                    })
                }
            )
        }
        tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
    };

    $scope.getFeatDataCallback = function (selectedData, id, type, ctrl, tpl) {
        Application.functions.getRdObjectById(id, type, function (data) {
            if (data.errcode === -1) {
                return;
            }
            objCtrl.setCurrentObject(type, data.data);
            tooltipsCtrl.onRemoveTooltip();
            var options = {
                "loadType": 'attrTplContainer',
                "propertyCtrl": ctrl,
                "propertyHtml": tpl
            }
            $scope.$emit("transitCtrlAndTpl", options);
        }, selectedData.detailid);
    }
}])