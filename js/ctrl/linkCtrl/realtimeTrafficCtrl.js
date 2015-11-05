/**
 * Created by liwanchong on 2015/10/29.
 */
var realtimeTrafficApp = angular.module("lazymodule", []);
realtimeTrafficApp.controller("realtimeTrafficController",function($scope) {
    $scope.rticData =  $scope.linkData;


    $scope.rticDroption =[
        {"id": 0,"label":"无"},
        {"id": 1,"label":"顺方向"},
        {"id": 2,"label":"逆方向"}
    ];
    $scope.rankoption=[
        {"id": 0,"label":"无"},
        {"id": 1,"label":"高速"},
        {"id": 2,"label":"城市高速"},
        {"id": 3,"label":"干线道路"},
        {"id": 4,"label":"其他道路"}
    ];

    $scope.minusIntRtic = function (id) {
        $scope.rticData.intRtics.splice(id, 1);
        if($scope.rticData.intRtics.length===0) {
            if($("#wideRTICDiv").hasClass("in")) {
                $("#wideRTICDiv").removeClass("in");
            }
        }
    };
    $scope.addIntRtic = function () {
        if(!$("#wideRTICDiv").hasClass("in")) {
            $("#wideRTICDiv").addClass("in");
        }
        $scope.rticData.intRtics.unshift(
            {
                code: "1",
                rank: "1",
                rticDr: "1",
                updownFlag: "1",
                rangeType: "0"
            }
        )
    };
    $scope.addCarRtic = function () {
        if(!$("#carRTICDiv").hasClass("in")) {
            $("#carRTICDiv").addClass("in");
        }
        $scope.rticData.rtics.unshift(
            {
                code: 0,
                linkPid: 0,
                rangeType: 1,
                rank: 2,
                rowId: "",
                rticDir: 2,
                updownFlag: 0
            }
        )
    };
    $scope.minusCarRtic=function(id){
        $scope.rticData.rtics.splice(id, 1);
        if($scope.rticData.rtics.length) {
            if($("#carRTICDiv").hasClass("in")) {
                $("#carRTICDiv").removeClass("in");
            }

        }
    }
})