/**
 * Created by liwanchong on 2015/10/29.
 */
var limitedApp = angular.module("lazymodule", []);
limitedApp.controller("limitedController",function($scope) {
    $scope.linkLimitData = limitTest;
    $scope.addLimit=function() {
        if(!$("#popularLimitedDiv").hasClass("in")) {
            $("#popularLimitedDiv").addClass("in");
        }
        $scope.linkLimitData.linkLimit.unshift( {
            appInfo: "1",
            type: "1",
            limitDir: "1",
            tollType: "1",
            weather: "1",
            processFlag: "1"
        });
    };
    $scope.minusLimit=function(id) {
        $scope.linkLimitData.linkLimit.splice(id, 1);

    };
    $scope.addLimitTruck = function () {
        if(!$("#trafficLimitedDiv").hasClass("in")) {
            $("#trafficLimitedDiv").addClass("in");
        }

        $scope.linkLimitData.linkLimitTruck.unshift(
            {
                truckFlag: "1",
                limitDir: "1",
                resTrailer: "1",
                resWeigh: "0",
                resAxleLoad: "0",
                resAxleCount: "0",
                resOut: "0"
            }
        )
    };
    $scope.minusLimitTruck=function(id) {
        $scope.linkLimitData.linkLimitTruck.splice(id, 1);
        if($scope.linkLimitData.linkLimitTruck.length===0) {
            if($("#trafficLimitedDiv").hasClass("in")) {
                $("#trafficLimitedDiv").removeClass("in");
            }

        }
    };
})