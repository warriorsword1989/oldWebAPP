/**
 * Created by liwanchong on 2015/10/29.
 */
var myApp = angular.module("mapApp", ['oc.lazyLoad']);
myApp.controller('linkObjectCtroller', ['$scope', '$ocLazyLoad', function ($scope,$ocLazyLoad) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    objectCtrl.setOriginalData( $.extend(true,{},objectCtrl.data.data));
    $scope.linkData= objectCtrl.data.data;
    $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
        $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
    });
    $scope.$parent.$parent.updateLinkData=function(data) {
        $scope.linkData= data.data;
    };
    $scope.changeModule = function (url) {
        if (url === "basicModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
            });
        } else if (url === "paginationModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/pedestrianNaviCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/pedestrianNaviTepl.html";
            });
        } else if (url === "realtimeModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/realtimeTrafficCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/realtimeTrafficTepl.html";
            });
        } else if (url === "zoneModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/zonePeopertyCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/zonePeopertyTepl.html";
            });
        } else if (url === "limitedModule") {
            $ocLazyLoad.load('ctrl/linkCtrl/limitedCtrl').then(function () {
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
    $scope.$parent.$parent.save=function() {
        objectCtrl.setCurrentObject($scope.linkData);
        objectCtrl.save();
        var param = {
            "command": "updatelink",
            "projectId": 1,
            "data": objectCtrl.changedProperty
        };

        Application.functions.saveLinkGeometry(JSON.stringify(param),function(data){
            console.log(data);
        })
    };
     $scope.$parent.$parent.delete=function(){

     }
}])