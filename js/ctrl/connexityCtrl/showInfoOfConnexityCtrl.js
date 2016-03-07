/**
 * Created by liwanchong on 2016/3/1.
 */
var infoOfConnexityApp = angular.module("myApp", []);
infoOfConnexityApp.controller("infoOfConnexityController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.infoData = objCtrl.data;
    $scope.outLanesArr = [];
    $scope.laneNum = $scope.infoData["laneInfo"].split(",").length;
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
    for (var i = 0, len = $scope.infoData["topos"].length; i < len; i++) {
        var arrOfDecimal = $scope.decimalToArr($scope.infoData["topos"][i]["inLaneInfo"]);
        var lenOfInfo =(16- arrOfDecimal.length);
        if (lenOfInfo=== $scope.infoData["index"]) {

            $scope.outLanesArr.push($scope.infoData["topos"][i]);
        }

    }
})