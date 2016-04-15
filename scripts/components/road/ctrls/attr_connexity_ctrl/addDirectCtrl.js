/**
 * Created by liwanchong on 2016/3/9.
 */
/**
 * Created by liwanchong on 2016/3/4.
 */
var addDirectConnexityApp = angular.module("mapApp", []);
addDirectConnexityApp.controller("addDirectOfConnexityController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var hLayer = layerCtrl.getLayerById('highlightlayer');
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
        var highLightFeatures = [];
        highLightFeatures.push({
            id: objCtrl.data["inLinkPid"].toString(),
            layerid:'referenceLine',
            type:'line',
            style:{}
        })
        var highLightLinks = new fastmap.uikit.HighLightRender(hLayer)
        highLightLinks.drawHighlight();
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
    $scope.addLaneConnexity=function() {
        var lastLane= $scope.lanesArr[$scope.lanesArr.length-1].split("");
        var zeroLane = $scope.lanesArr[0].split("");
        if( $scope.laneInfo["selectNum"]) {
            var selectLane = $scope.lanesArr[$scope.laneInfo["selectNum"]].split("");
            var selObj={
                "busLaneInfo": 0,
                "connexityPid": $scope.laneInfo["pid"],
                "inLaneInfo": parseInt($scope.intToDecial($scope.laneInfo["selectNum"]+1)),
                "outLinkPid": 0,
                "reachDir": $scope.changeData($scope.item.id),
                "relationshipType": 1
            }
            for (var m= 0,lenM=$scope.laneInfo["topos"].length;m<lenM;m++) {
                var decimalArr = $scope.decimalToArr($scope.laneInfo["topos"][m]["inLaneInfo"]);
                var infoLen =(16- decimalArr.length);
                for(var n=$scope.laneInfo["selectNum"]+2,lenN=($scope.lanesArr.length-$scope.laneInfo["selectNum"]+1);n<=lenN;n++) {
                    if(n===infoLen) {
                        $scope.laneInfo["topos"][m]["inLaneInfo"]=parseInt($scope.intToDecial(n+1))
                    }
                }
            }
            $scope.lanesArr.splice($scope.laneInfo["selectNum"]+1, 0, $scope.item.id);
            $scope.laneInfo["laneInfo"] = $scope.lanesArr.join(",");
            $scope.laneInfo["laneNum"] += 1;
            $scope.laneInfo["topos"].unshift(selObj);
            $scope.laneInfo["selectNum"] = undefined;
        }else{
            if(lastLane[lastLane.length-1]==="]") {
                for(var j=0,lenJ=$scope.laneInfo["topos"].length;j<lenJ;j++) {
                    var arrOfDecimal = $scope.decimalToArr($scope.laneInfo["topos"][j]["inLaneInfo"]);
                    var lenOfInfo =(16- arrOfDecimal.length);
                    if((lenJ)===lenOfInfo) {
                        $scope.laneInfo["topos"][j]["inLaneInfo"]=parseInt($scope.intToDecial(lenJ))
                    }
                }
                var newObj={
                    "busLaneInfo": 0,
                    "connexityPid": $scope.laneInfo["pid"],
                    "inLaneInfo": parseInt($scope.intToDecial($scope.laneInfo["topos"].length-1)),
                    "outLinkPid": 0,
                    "reachDir": $scope.changeData($scope.item.id),
                    "relationshipType": 1
                }
                $scope.lanesArr.splice($scope.lanesArr.length - 1, 0, $scope.item.id);
                $scope.laneInfo["laneInfo"] = $scope.lanesArr.join(",");
                $scope.laneInfo["laneNum"] += 1;
                $scope.laneInfo["topos"].unshift(newObj);
            }else{
                if($scope.laneInfo["laneInfo"]) {
                    $scope.laneInfo["laneInfo"] += ",";
                }
                $scope.laneInfo["laneInfo"] += $scope.item.id;
                $scope.laneInfo["laneNum"] += 1;
                var laneNum = "";
                if($scope.lanesArr[0]==="") {
                    laneNum =0;
                }else{
                    laneNum = $scope.lanesArr.length;
                }
                var newNum = parseInt($scope.intToDecial(laneNum));
                var obj={
                    "busLaneInfo": 0,
                    "connexityPid": $scope.laneInfo["pid"],
                    "inLaneInfo":newNum,
                    "outLinkPid": 0,
                    "reachDir": $scope.changeData($scope.item.id),
                    "relationshipType": 1
                }
                $scope.laneInfo["topos"].unshift(obj);
            }

        }

        objCtrl.rdLaneObject(false);
        $scope.$emit("SWITCHCONTAINERSTATE",{"subAttrContainerTpl":false})
    };
    $scope.selectLaneInfo = function (item, index) {
        $scope.item = item;
        $scope.addLaneConnexity();
    }
});