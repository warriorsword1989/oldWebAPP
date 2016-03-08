/**
 * Created by liwanchong on 2016/3/4.
 */
var directConnexityApp = angular.module("mapApp", []);
directConnexityApp.controller("directOfConnexityController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.addRdLancdData = [
        {"id": '0', "class": false},
        {"id": '1', "class": false},
        {"id": '2', "class": false},
        {"id": '3', "class": false},
        {"id": '4', "class": false},
        {"id": '5', "class": false},
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
        {"id": 'o', "class": false},
        {"id": 'r', "class": false},
        {"id": 's', "class": false},
        {"id": 't', "class": false},
        {"id": 'u', "class": false},
        {"id": 'v', "class": false},
        {"id": 'w', "class": false},
        {"id": 'x', "class": false},
        {"id": 'y', "class": false}
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
    $scope.laneInfo = objCtrl.data;
    if($scope.laneInfo["selectNum"]) {
        $scope.showName = "改 变";
    }else{
        $scope.showName = "增 加";
    }
    $scope.lanesArr = $scope.laneInfo["laneInfo"].split(",");
    $scope.selectLaneInfo = function (item, index) {
        $scope.item = item;
    }
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
            if($scope.laneInfo["selectNum"]===0) {
                if($scope.lanesArr[0].indexOf("[")!==-1) {
                    selectLane[1] = $scope.item.id;
                }
            }else if($scope.laneInfo["selectNum"]===($scope.lanesArr.length-1)){
                if($scope.lanesArr[$scope.laneInfo["selectNum"]].indexOf("[")!==-1) {
                    selectLane[1] = $scope.item.id;
                }

            }else{
                selectLane[0] = $scope.item.id;
                $scope.changeInfo($scope.laneInfo["selectNum"], $scope.item);
            }
            $scope.lanesArr[$scope.laneInfo["selectNum"]] = selectLane.join("");
            $scope.laneInfo["laneInfo"] = $scope.lanesArr.join(",");
            $scope.laneInfo["selectNum"] = undefined;
        }else{
            if(lastLane[lastLane.length-1]==="]"||lastLane[lastLane.length-1]===">") {
                 for(var j=0,lenJ=$scope.laneInfo["topos"].length-1;j<lenJ;j++) {
                     var arrOfDecimal = $scope.decimalToArr($scope.infoData["topos"][i]["inLaneInfo"]);
                     var lenOfInfo =(16- arrOfDecimal.length);
                     if((lenJ-1)===lenOfInfo) {
                         $scope.infoData["topos"][i]["inLaneInfo"]=parseInt($scope.intToDecial(lenJ))
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
                $scope.laneInfo["topos"].splice($scope.laneInfo["topos"].length-2,0,newObj);
            }else{
                if($scope.laneInfo["laneInfo"]) {
                    $scope.laneInfo["laneInfo"] += ",";
                }
                $scope.laneInfo["laneInfo"] += $scope.item.id;
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
                $scope.laneInfo["topos"].push(obj);
            }

        }

        objCtrl.rdLaneObject();
        if ($scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = false;
        }
    };

});