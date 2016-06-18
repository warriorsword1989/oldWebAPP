/**
 * Created by liwanchong on 2015/10/29.
 */
var realtimeTrafficApp = angular.module("app");
realtimeTrafficApp.controller("realtimeTrafficController", function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = new fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var rdCross = layerCtrl.getLayerById("relationdata")
    var workPoint = layerCtrl.getLayerById('workPoint');
    var editLayer = layerCtrl.getLayerById('edit');
    $scope.rticData =  objCtrl.data;


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
    $scope.rticDroption = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "顺方向"},
        {"id": 2, "label": "逆方向"}
    ];
    $scope.rankoption = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "高速"},
        {"id": 2, "label": "城市高速"},
        {"id": 3, "label": "干线道路"},
        {"id": 4, "label": "其他道路"}
    ];

    $scope.minusIntRtic = function (id) {
        $scope.rticData.intRtics.splice(id, 1);
        if ($scope.rticData.intRtics.length === 0) {

        }
    };
    $scope.addIntRtic = function () {
        var newIntRtic = fastmap.dataApi.rdLinkIntRtic({"linkPid": $scope.rticData.pid});
        $scope.rticData.intRtics.unshift(newIntRtic)

    };
    $scope.addCarRtic = function () {
        var newRtic = fastmap.dataApi.rdLinkRtic({"linkPid": $scope.rticData.pid});
        $scope.rticData.rtics.unshift(newRtic)
    };
    $scope.minusCarRtic = function (id) {
        $scope.rticData.rtics.splice(id, 1);
        if ($scope.rticData.rtics.length === 0) {

        }
    }


    $scope.showRticsInfo= function (item) {
        $scope.linkData["oridiRowId"] = item.rowId;
        var showRticsInfoObj = {
            "loadType": "subAttrTplContainer",
            "propertyCtrl": 'components/road/ctrls/attr_link_ctrl/rticOfIntCtrl',
            "propertyHtml": '../../scripts/components/road/tpls/attr_link_tpl/rticOfIntTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showRticsInfoObj);
    }

    $scope.showCarInfo = function (cItem) {
        $scope.linkData["oridiRowId"] = cItem.rowId;
        var showCarInfoObj = {
            "loadType": "subAttrTplContainer",
            "propertyCtrl": 'components/road/ctrls/attr_link_ctrl/rticOfCar',
            "propertyHtml": '../../scripts/components/road/tpls/attr_link_tpl/rticOfCarTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showCarInfoObj);
    }


    $scope.changeColor = function (ind, ord) {
        if (ord == 1) {
            $("#rticSpan" + ind).css("color", "#FFF");
        } else {
            $("#carSpan" + ind).css("color", "#FFF");
        }
    }
    $scope.backColor = function (ind, ord) {
        if (ord == 1) {
            $("#rticSpan" + ind).css("color", "darkgray");
        } else {
            $("#carSpan" + ind).css("color", "darkgray");
        }
    }


    $scope.intitRticData = function () {

        if ($scope.rticData.intRtics.length > 0) {
        }else{
            var newIntRtic = fastmap.dataApi.rdLinkIntRtic({"linkPid": $scope.rticData.pid,"rowId":"0"});
            $scope.rticData.intRtics.unshift(newIntRtic)
        }
        objCtrl.data["oridiRowId"] = $scope.rticData.intRtics[0].rowId;
        var showRticsInfoObj = {
            "loadType": "subAttrTplContainer",
            "propertyCtrl": 'components/road/ctrls/attr_link_ctrl/rticOfIntCtrl',
            "propertyHtml": '../../scripts/components/road/tpls/attr_link_tpl/rticOfIntTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showRticsInfoObj);
        $scope.resetToolAndMap();
        //初始化鼠标提示
        $scope.toolTipText = '请选择方向！';
        tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
        map.currentTool.disable();
    };

    if (objCtrl.data) {
        $scope.intitRticData();
    }
    objCtrl.updateObject = function () {
        $scope.intitRticData();
    };
})