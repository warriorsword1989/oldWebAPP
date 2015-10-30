/**
 * Created by liwanchong on 2015/10/29.
 */
var myApp = angular.module("mapApp", ['oc.lazyLoad']);
myApp.controller('linkObjectCtroller', ['$scope', '$ocLazyLoad', function ($scope,$ocLazyLoad) {

    $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
        $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
    });
    $scope.changeModule = function (url) {
        if (url === "basicModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
            });
        } else if (url === "paginationModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/pedestrianNaviTepl.html";
            });
        } else if (url === "realtimeModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/realtimeTrafficTepl.html";
            });
        } else if (url === "zoneModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/zonePeopertyTepl.html";
            });
        } else if (url === "limitedModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/limitedTepl.html";
            });
        }

    }

    $scope.changeDirect = function (direc) {
        alert("dddd");
    };

    $scope.addSideWalk = function () {
        if (!$("#sideWalkDiv").hasClass("in")) {
            $("#sideWalkDiv").addClass("in");
        }
        $scope.naviData.sideWalkData = {
            sidewalkLoc: "4",
            dividerType: "2",
            workDir: "2",
            processFlag: "1",
            captureFlag: "1"
        }
    };


}])