/**
 * Created by liwanchong on 2016/3/4.
 */
var directConnexityApp = angular.module("mapApp", []);
directConnexityApp.controller("directOfConnexityController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var linksObj = {};//存放需要高亮的进入线和退出线的id
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    $scope.flagNum = 0;
    $scope.addRdLancdData = [
        {"id": 'a', "class": false},
        {"id": 'b', "class": false},
        {"id": 'c', "class": false},
        {"id": 'd', "class": false},
        {"id": 'e', "class": false},
        {"id": 'f', "class": false},
        {"id": 'g', "class": false},
        {"id": 'h', "class": false},
        {"id": 'i', "class": false},
        {"id": 'j', "class": false},
        {"id": 'k', "class": false},
        {"id": 'l', "class": false},
        {"id": 'm', "class": false},
        {"id": 'n', "class": false},
        {"id": 'o', "class": false}
    ];
    $scope.reachDirOptions = [
        {"id": 0, "label": "0 未调查"},
        {"id": 1, "label": "1 直"},
        {"id": 2, "label": "2 左"},
        {"id": 3, "label": "3 右"},
        {"id": 4, "label": "4 调"},
        {"id": 5, "label": "5 左斜前"},
        {"id": 6, "label": "6 右斜前"}
    ];
    $scope.changeData=function(id) {
        var lab = "";
        switch (id) {
            case "a":
                lab = 1;
                break;
            case "b":
                lab = 2;
                break;
            case "c":
                lab = 3;
                break;
            case "d":
                lab = 4;
                break;
            case "r":
                lab = 5;
                break;
            case "s":
                lab = 6;
                break;
            case "9":
                lab = 0;
                break;

        }
        return lab;
    };
    $scope.decimalToArr = function (data) {
        var arr = [];
        arr = data.toString(2).split("");
        return arr;
    };
    $scope.intToDecial=function(data) {
        var str = "1";
        for(var i=0;i<15-data;i++) {
            str += "0";
        }
        return parseInt(str,2).toString(10);
    };
    $scope.laneInfo = objCtrl.data;
    if($scope.laneInfo["selectNum"]!==undefined) {
        //删除以前高亮的进入线和退出线
        if (highLightLayer.highLightLayersArr.length !== 0) {
            highLightLayer.removeHighLightLayers();
        }
        linksObj["inLink"] = objCtrl.data["inLinkPid"].toString();
        for (var i = 0, len = $scope.laneInfo["topos"].length; i < len; i++) {
            var arrOfDecimal = $scope.decimalToArr($scope.laneInfo["topos"][i]["inLaneInfo"]);
            var lenOfInfo =(16- arrOfDecimal.length);
            if (lenOfInfo=== $scope.laneInfo["index"]) {
                linksObj["outLink" + $scope.flagNum] = $scope.laneInfo["topos"][i].outLinkPid.toString();
                $scope.flagNum++;
            }

        }
        var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
            map: map,
            highLightFeature: "links",
            linksObj: linksObj
        })
        highLightLinks.drawOfLinksForInit();
        highLightLayer.pushHighLightLayers(highLightLinks);
    }
    $scope.lanesArr = $scope.laneInfo["laneInfo"].split(",");

    $scope.changeInfo=function(num,item) {
        for (var i = 0, len = $scope.laneInfo["topos"].length; i < len; i++) {
            var arrOfDecimal = $scope.decimalToArr($scope.laneInfo["topos"][i]["inLaneInfo"]);
            var lenOfInfo =(16- arrOfDecimal.length);
            if (lenOfInfo===num) {
                $scope.laneInfo["topos"][i]["reachDir"] = $scope.changeData(item.id);
            }

        }
    };
    $scope.changeLaneConnexity=function() {
        var lastLane= $scope.lanesArr[$scope.lanesArr.length-1].split("");
        var zeroLane = $scope.lanesArr[0].split("");
        if( $scope.laneInfo["selectNum"]!==undefined) {
            var selectLane = $scope.lanesArr[$scope.laneInfo["selectNum"]].split("");
            for (var m= 0,lenM=$scope.laneInfo["topos"].length;m<lenM;m++) {
                var decimalArr = $scope.decimalToArr($scope.laneInfo["topos"][m]["inLaneInfo"]);
                var infoLen =(16- decimalArr.length);
                if($scope.laneInfo["selectNum"]===infoLen) {
                    $scope.laneInfo["topos"][m]["reachDir"] =$scope.changeData($scope.item.id);
                }
            }
            if($scope.lanesArr[$scope.laneInfo["selectNum"]].indexOf("[")!==-1) {
                $scope.lanesArr[$scope.laneInfo["selectNum"]]= "["+$scope.item.id+"]";
            }else if($scope.lanesArr[$scope.laneInfo["selectNum"]].indexOf("<")!==-1){
                var transitArr = $scope.lanesArr[$scope.laneInfo["selectNum"]].split("");
                if($scope.laneInfo["transitFlag"]) {
                    transitArr[transitArr.length - 2] = $scope.item.id;
                    $scope.laneInfo["transitFlag"] = undefined;
                }else{
                    transitArr[0] = $scope.item.id;
                }

                $scope.lanesArr[$scope.laneInfo["selectNum"]] = transitArr.join("");
            }else{
                $scope.lanesArr[$scope.laneInfo["selectNum"]]= $scope.item.id;
            }
            $scope.laneInfo["laneInfo"] = $scope.lanesArr.join(",");
            $scope.laneInfo["selectNum"] = undefined;
        }

        objCtrl.rdLaneObject();
        if ($scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = false;
        }
    };
    $scope.selectLaneInfo = function (item, index) {
        $scope.item = item;
        $scope.changeLaneConnexity();
    }
});