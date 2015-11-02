/**
 * Created by liwanchong on 2015/10/29.
 */
var pedestrianNaviApp = angular.module("lazymodule", []);
pedestrianNaviApp.controller("pedestrianNaviController",function($scope) {
    $scope.naviData =  $scope.linkData.data;
    $scope.minusSideWalk = function () {
        $scope.naviData.sideWalkData = undefined;
        if($("#sideWalkDiv").hasClass("in")) {
            $("#sideWalkDiv").removeClass("in");
        }
    };

    $scope.addStairWalk = function () {
        if(!$("#humanLadderDiv").hasClass("in")) {
            $("#humanLadderDiv").addClass("in");
        }
        $scope.naviData.walkStairData = {
            stairLoc: "2",
            stairFlag: "1",
            workDir: "1",
            captureFlag: "1"
        }
    };
    $scope.minusStairWalk=function() {
        $scope.naviData.walkStairData = undefined;
        if($("#humanLadderDiv").hasClass("in")) {
            $("#humanLadderDiv").removeClass("in");
        }
    };
})