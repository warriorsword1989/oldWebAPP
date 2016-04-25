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
    var adFace = layerCtrl.getLayerById('adface');
    var workPoint = layerCtrl.getLayerById('workPoint');
    var editLayer = layerCtrl.getLayerById('edit');
    var adAdmin=layerCtrl.getLayerById('adAdmin');
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

        if (type === "adLink") {
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
        else if (type === "adAdmin") {
            layerCtrl.pushLayerFront('edit');
            map.currentTool = new fastmap.uikit.SelectNode({
                map: map,
                nodesFlag: true,
                currentEditLayer: adAdmin,
                shapeEditor: shapeCtrl
            });
            map.currentTool.enable();
            $scope.toolTipText = '请选择行政区划代表点！';
            eventController.on(eventController.eventTypes.GETADADMINNODEID, function (data) {
                $scope.getFeatDataCallback(data, data.id, "ADADMIN", 'components/road/ctrls/attr_administratives_ctrl/adAdminCtrl', "../../scripts/components/road/tpls/attr_adminstratives_tpl/adAdminTpl.html");
            });
        }
       else if (type === "adFace") {
           /* layerCtrl.pushLayerFront('edit');*/
            map.currentTool = new fastmap.uikit.SelectPolygon(
                {
                    map: map,
                    currentEditLayer: adFace,
                    shapeEditor: shapeCtrl
                });
            map.currentTool.enable();
            editLayer.bringToBack();
            //初始化鼠标提示
            $scope.toolTipText = '请选择面！';
           /* adFace.options.selectType = 'face';
            adFace.options.editable = true;*/
            eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                $scope.getFeatDataCallback(data, data.id, "ADFACE", 'components/road/ctrls/attr_administratives_ctrl/adFaceCtrl', "../../scripts/components/road/tpls/attr_adminstratives_tpl/adFaceTpl.html");
            })
        }else if(type==="adNode") {
          /*  layerCtrl.pushLayerFront('edit');*/
            adLink.options.selectType = 'node';
            adLink.options.editable = true;
            map.currentTool = new fastmap.uikit.SelectNode({
                map: map,
                nodesFlag: true,
                currentEditLayer: adLink,
                shapeEditor: shapeCtrl
            });
            map.currentTool.enable();
            $scope.toolTipText = '请选择node！';
            eventController.on(eventController.eventTypes.GETNODEID, function (data) {
                $scope.getFeatDataCallback(data, data.id, "ADNODE", 'components/road/ctrls/attr_administratives_ctrl/adNodeCtrl', "../../scripts/components/road/tpls/attr_adminstratives_tpl/adNodeTpl.html");
            });
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