/**
 * Created by liwanchong on 2015/10/29.
 */
var realtimeTrafficApp = angular.module("lazymodule", []);
realtimeTrafficApp.controller("realtimeTrafficController",function($scope) {
    $scope.rticData = rticTest;
    $scope.minusIntRtic = function (id) {
        $scope.rticData.intRticData.splice(id, 1);
        if($scope.rticData.intRticData.length===0) {
            if($("#wideRTICDiv").hasClass("in")) {
                $("#wideRTICDiv").removeClass("in");
            }
        }
    };
    $scope.addIntRtic = function () {
        if(!$("#wideRTICDiv").hasClass("in")) {
            $("#wideRTICDiv").addClass("in");
        }
        $scope.rticData.intRticData.unshift(
            {
                code: "0",
                rank: "0",
                rticDr: "2",
                updownFlag: "0",
                rangeType: "1"
            }
        )
    };
    $scope.addCarRtic = function () {
        if(!$("#carRTICDiv").hasClass("in")) {
            $("#carRTICDiv").addClass("in");
        }
        $scope.rticData.carRticData.unshift(
            {
                code: "1",
                rank: "1",
                rticDir: "2",
                updownFlag: "1",
                rangeType: "1"
            }
        )
    };
    $scope.minusCarRtic=function(id){
        $scope.rticData.carRticData.splice(id, 1);
        if($scope.rticData.carRticData.length) {
            if($("#carRTICDiv").hasClass("in")) {
                $("#carRTICDiv").removeClass("in");
            }

        }
    }
})