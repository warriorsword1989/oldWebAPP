/**
 * Created by liwanchong on 2016/3/1.
 */
var infoOfConnexityApp = angular.module("myApp", []);
infoOfConnexityApp.controller("infoOfConnexityController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highLightLayer = fastmap.uikit.HighLightController();
    $scope.infoData = objCtrl.data;
    $scope.outLanesArr = [];
    $scope.flagNum = 0;
    $scope.laneNum = $scope.infoData["laneInfo"].split(",").length;
    var linksObj = {};//存放需要高亮的进入线和退出线的id
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    $scope.reachDirOptions = [
        {"id": 0, "label": "0 未调查"},
        {"id": 1, "label": "1 直"},
        {"id": 2, "label": "2 左"},
        {"id": 3, "label": "3 右"},
        {"id": 4, "label": "4 调"},
        {"id": 5, "label": "5 左斜前"},
        {"id": 6, "label": "6 右斜前"}
    ];
    $scope.decimalToArr = function (data) {
        var arr = [];
        arr = data.toString(2).split("");
        return arr;
    };
    //删除以前高亮的进入线和退出线
    if (highLightLayer.highLightLayersArr.length !== 0) {
        highLightLayer.removeHighLightLayers();
    }
    linksObj["inLink"] = objCtrl.data["inLinkPid"].toString();



    for (var i = 0, len = $scope.infoData["topos"].length; i < len; i++) {
            var arrOfDecimal = $scope.decimalToArr($scope.infoData["topos"][i]["inLaneInfo"]);
            var lenOfInfo =(16- arrOfDecimal.length);
            if (lenOfInfo=== $scope.infoData["index"]) {
                linksObj["outLink" + $scope.flagNum] = $scope.infoData["topos"][i].outLinkPid.toString();
                $scope.flagNum++;
                var obj = ($.extend(true, {}, $scope.infoData["topos"][i]));
                obj["enterLaneNum"] = lenOfInfo+1;
                if(obj["busLaneInfo"]!==0) {
                    obj["enterBusNum"] = lenOfInfo + 1;
                }else{
                    obj["enterBusNum"] = 0;
                }
                $scope.outLanesArr.push(obj);
            }

        }
    var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
        map: map,
        highLightFeature: "links",
        linksObj: linksObj
    })
    highLightLinks.drawOfLinksForInit();
    highLightLayer.pushHighLightLayers(highLightLinks);
})