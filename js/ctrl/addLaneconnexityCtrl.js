/**
 * Created by liwanchong on 2016/1/25.
 */
var laneConnexityApp = angular.module("mapApp", ['oc.lazyLoad']);
laneConnexityApp.controller("addLaneConnexityController", ["$scope", '$ocLazyLoad', function ($scope, $ocLazyLoad){
    var layerCtrl = fastmap.uikit.LayerController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();

    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var selectCtrl = fastmap.uikit.SelectController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    $scope.laneConnexity = {};$scope.excitLineArr=[];
    $scope.laneConnexityData = [
        {flag:13},
        {flag:23},
        {flag:33},
        {flag:43},
        {flag:53},
        {flag:63},
        {flag:73},
        {flag:83},
        {flag:93}
    ];
    $scope.isExitObj = {};
    $scope.showLaneConnexityData = [];
    $scope.addLaneConnexity=function(item,event) {
        if(!$scope.isExitObj[item.flag]) {
            $scope.isExitObj[item.flag] = true;
            $scope.showLaneConnexityData.push(item);
        }else{
            alert("已添加");
        }

    };
    $scope.minusLaneConnexity=function(item) {
        if($scope.showLaneConnexityData.length>0) {
            for(var i= 0,len=$scope.showLaneConnexityData.length;i<len;i++) {
                if(item.flag===$scope.showLaneConnexityData[i]["flag"]) {
                    $scope.showLaneConnexityData.splice(i, 1);
                    $scope.isExitObj[item.flag] = undefined;
                    break;
                }
            }
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
    rdLink.on("getId", function (data) {
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
            $scope.laneConnexity.outLinkPid = $scope.excitLineArr[0];
            tooltipsCtrl.setChangeInnerHtml("已选退出线,请选择方向或者点击空格保存!");
        }
        featCodeCtrl.setFeatCode($scope.laneConnexity);
    })
}])