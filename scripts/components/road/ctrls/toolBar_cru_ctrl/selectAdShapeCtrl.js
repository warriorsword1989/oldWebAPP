/**
 * Created by zhaohang on 2016/4/12.
 */
var selectAdApp = angular.module("mapApp", ['oc.lazyLoad']);
selectAdApp.controller("selectAdShapeController", ["$scope", '$ocLazyLoad', '$rootScope', function ($scope, $ocLazyLoad, $rootScope) {
    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    var adLink = layerCtrl.getLayerById('adLink');
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
            propertyHtml: "../../scripts/components/road/tpls/attr_tips_tpl/sceneAllTipsTpl.html",
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
    $scope.selectAddShape = function (type, num) {
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
                    currentEditLayer: adLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
            map.currentTool.enable();
            //初始化鼠标提示
            $scope.toolTipText = '请选择线！';
            adLink.options.selectType = 'link';
            adLink.options.editable = true;
            eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                selectCtrl.onSelected({
                    point: data.point
                });
                $scope.getFeatDataCallback(data, data.id, "ADLINK", 'components/road/ctrls/attr_administratives_ctrl/adLinkCtrl', "../../scripts/components/road/tpls/attr_adminstratives_tpl/adLinkTpl.html");
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
                $scope.getFeatDataCallback(data, data.id, "RDNODE", 'components/road/ctrls/attr_node_ctrl/rdNodeFromCtrl', "../../scripts/components/road/tpls/attr_node_tpl/rdNodeFromTpl.html");
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
                            ctrlAndTmplParams.propertyCtrl = "components/road/ctrls/attr_restriction_ctrl/rdRestriction";
                            ctrlAndTmplParams.propertyHtml = "../../scripts/components/road/tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html";
                        }
                        else {
                            ctrlAndTmplParams.propertyCtrl = "components/road/ctrls/attr_restriction_ctrl/rdRestriction";
                            ctrlAndTmplParams.propertyHtml = "../../scripts/components/road/tpls/attr_restrict_tpl/rdRestrictOfTruckTpl.html";
                        }
                        break;
                    case 'RDLANECONNEXITY':
                        ctrlAndTmplParams.propertyCtrl = 'components/road/ctrls/attr_connexity_ctrl/rdLaneConnexityCtrl';
                        ctrlAndTmplParams.propertyHtml = "../../scripts/components/road/tpls/attr_connexity_tpl/rdLaneConnexityTpl.html";
                        break;
                    case 'RDSPEEDLIMIT':
                        ctrlAndTmplParams.propertyCtrl = 'components/road/ctrls/attr_speedLimit_ctrl/speedLimitCtrl';
                        ctrlAndTmplParams.propertyHtml = "../../scripts/components/road/tpls/attr_speedLimit_tpl/speedLimitTpl.html";
                        break;
                    case 'RDCROSS':
                        ctrlAndTmplParams.propertyCtrl = 'components/road/ctrls/attr_cross_ctrl/rdCrossCtrl';
                        ctrlAndTmplParams.propertyHtml = "../../scripts/components/road/tpls/attr_cross_tpl/rdCrossTpl.html";
                        break;
                    case 'RDBRANCH':
                        ctrlAndTmplParams.propertyCtrl = "components/road/ctrls/attr_branch_ctrl/rdBranchCtrl";
                        ctrlAndTmplParams.propertyHtml = "../../scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html";
                        break;
                }

                $scope.getFeatDataCallback(data, data.id, data.optype, ctrlAndTmplParams.propertyCtrl, ctrlAndTmplParams.propertyHtml);
            })
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