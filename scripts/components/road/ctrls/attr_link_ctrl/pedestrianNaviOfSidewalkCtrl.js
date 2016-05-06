/**
 * Created by liwanchong on 2016/3/2.
 */
var sidewalkApp = angular.module("mapApp", []);
sidewalkApp.controller("sidewalkController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.sidewalkData = objCtrl.data.sidewalks;
    $scope.linkData = objCtrl.data;
    if($(".ng-dirty")) {
        $.each($('.ng-dirty'), function (i, v) {
            $scope.sideWalkForm.$setPristine();
        });

    }
    for(var i= 0,len=$scope.sidewalkData.length;i<len;i++) {
        if($scope.sidewalkData[i]["rowId"]===$scope.linkData["oridiRowId"]) {
            $scope.oridiData = $scope.sidewalkData[i];
        }
    }
    $scope.dividerTypeoptions=[
        {"id": 0, "label":"未调查"},
        {"id": 1, "label":"高度差隔离(马路涯)"},
        {"id": 2, "label":"物理栅栏隔离"},
        {"id": 3, "label":"划线隔离"},
        {"id": 4, "label":"无隔离"}
    ];
    $scope.sidewalkLocoptions=[
        {"id": 0, "label":"无"},
        {"id": 1, "label":"右侧"},
        {"id": 2, "label":"中间"},
        {"id": 3, "label":"右侧+中间"},
        {"id": 4, "label":"左侧"},
        {"id": 5, "label":"右侧+左侧"},
        {"id": 6, "label":"左侧+中间"},
        {"id": 7, "label":"右侧+左侧+中间"},
        {"id": 8, "label":"混合"}
    ];
    $scope.minusSideWalk = function (id) {
        $scope.sidewalkData.splice(id, 1);
    };
    $scope.changeColor=function(ind){
        $("#sideWalkSpan"+ind).css("color","#FFF");
    }
    $scope.backColor=function(ind){
        $("#sideWalkSpan"+ind).css("color","darkgray");
    }
    $scope.changeStrToInt=function(item) {
        $scope.oridiData[item] = parseInt($scope.oridiData[item]);
    };
})