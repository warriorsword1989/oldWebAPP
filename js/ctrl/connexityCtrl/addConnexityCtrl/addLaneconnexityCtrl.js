/**
 * Created by liwanchong on 2016/1/25.
 */
var laneConnexityApp = angular.module("mapApp", ['oc.lazyLoad']);
laneConnexityApp.controller("addLaneConnexityController", ["$scope", '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    $scope.inLaneInfoArr = [];
    $scope.directData = objCtrl.originalData;
    var rdlaneconnexity = layerCtrl.getLayerById('rdlaneconnexity');
    $scope.laneConnexity = {};
    $scope.clickFlag = true;
    $scope.excitLineArr = [];

    if(! $scope.$parent.$parent.suspendFlag) {
        $scope.$parent.$parent.suspendFlag = true;
    }

    $scope.$parent.$parent.subAttrTplContainer = "";
    $ocLazyLoad.load('ctrl/connexityCtrl/addConnexityCtrl/directOfConnexityCtrl').then(function () {
        $scope.$parent.$parent.subAttrTplContainer = "js/tepl/connexityTepl/addConnexityTepl/directOfConnexityTepl.html";
    })

    //增加公交车道方向(单击)
    $scope.addTransitData=function(item,index) {

        var obj = {},transitStr="";
        angular.extend(obj, item);
        obj.flag = obj.flag.toString()+obj.flag.toString();
        transitStr = "<" + item.flag + ">";
        $scope.directData.showTransitData[index]=obj;
        $scope.directData.inLaneInfoArr[index] += transitStr;

    };

    //删除普通车道或附加车道方向有公交车道的时候 一并删除
    $scope.minusNormalData = function (item,index,event) {
        if ( $scope.directData.showNormalData.length > 0) {

            $scope.directData.showNormalData.splice(index, 1);
            $scope.directData.showTransitData.splice(index, 1);
            $scope.directData.inLaneInfoArr.splice(index, 1);

        }

    };
    $scope.minusTransitData=function(item,index) {
        if ( $scope.directData.showNormalData.length > 0) {
            $scope.directData.showTransitData= {"flag":"test" , "log": ""};
            $scope.directData.inLaneInfoArr[index] = $scope.directData.showNormalData[index];

        }
    };

    shapeCtrl.setEditingType("rdlaneConnexity")
    map.currentTool.disable();//禁止当前的参考线图层的事件捕获
    if (typeof map.currentTool.cleanHeight === "function") {
        map.currentTool.cleanHeight();
    }
    tooltipsCtrl.setEditEventType('rdlaneConnexity');
    tooltipsCtrl.setCurrentTooltip('正要新建车信,先选择线！');
    map.currentTool = new fastmap.uikit.SelectForRestriction({map: map, currentEditLayer: rdLink});
    map.currentTool.enable();
    $scope.excitLineArr = [];
    eventController.on(eventController.eventTypes.GETLINKID, function (data) {
        if (data.index === 0) {
            $scope.laneConnexity.inLinkPid = parseInt(data.id);
            tooltipsCtrl.setStyleTooltip("color:black;");
            tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择进入点!");
        } else if (data.index === 1) {
            $scope.laneConnexity.nodePid = parseInt(data.id);
            tooltipsCtrl.setStyleTooltip("color:red;");
            tooltipsCtrl.setChangeInnerHtml("已经选择进入点,请选择方向!");
        } else if (data.index > 1) {
            $scope.excitLineArr.push(parseInt(data.id));
            $scope.laneConnexity.outLinkPids = $scope.excitLineArr;
            tooltipsCtrl.setChangeInnerHtml("已选退出线,请选择方向或者选择退出线!");
        }
        $scope.directData["laneConnexity"]=$scope.laneConnexity
    });

}])