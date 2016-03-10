/**
 * Created by liwanchong on 2016/3/2.
 */
var walkstairApp = angular.module("mapApp", []);
walkstairApp.controller("walkstairController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.walkstairData = objCtrl.data.data.walkstairs;
    $scope.walkstairLocoptions=[
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

    $scope.dividerTypeoptions=[
        {"id": 0, "label":"未调查"},
        {"id": 1, "label":"高度差隔离(马路涯)"},
        {"id": 2, "label":"物理栅栏隔离"},
        {"id": 3, "label":"划线隔离"},
        {"id": 4, "label":"无隔离"}
    ];
    $scope.addStairWalk = function () {
        $scope.walkstairData.unshift({
            captureFlag: 1,
            stairFlag: 1,
            stairLoc: 2,
            workDir: 1,
            linkPid:0
        })

    };
    $scope.minusStairWalk=function(id) {
        $scope.walkstairData.splice(id, 1);;
    };

    $scope.changeColor=function(ind){
        $("#walkstairSpan"+ind).css("color","#FFF");
    }
    $scope.backColor=function(ind){
        $("#walkstairSpan"+ind).css("color","darkgray");
    }
});