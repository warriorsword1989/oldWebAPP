/**
 * Created by liwanchong on 2015/10/29.
 */
var realtimeTrafficApp = angular.module("lazymodule", []);
realtimeTrafficApp.controller("realtimeTrafficController",function($scope) {
    $scope.rticData =  $scope.linkData;
    if($scope.rticData.intRtics.length===0) {
        if($("#wideRTICDiv").hasClass("in")) {
            $("#wideRTICDiv").removeClass("in");
        }
    }
    if($scope.rticData.rtics.length===0) {
        if($("#carRTICDiv").hasClass("in")) {
            $("#carRTICDiv").removeClass("in");
        }

    }
    setTimeout(function(){
        for(var sitem in $scope.rticData.intRtics){
            var flag=$scope.rticData.intRtics[sitem].updownFlag;
            var rangeType=$scope.rticData.intRtics[sitem].rangeType;
            $("#updownFlag"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            $("#rangeType"+rangeType+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
        }
        for(var sitem in $scope.rticData.rtics){
            var flag=$scope.rticData.rtics[sitem].updownFlag;
            var rangeType=$scope.rticData.rtics[sitem].rangeType;
            $("#rticsupdownFlag"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            $("#rticsrangeType"+rangeType+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
        }
    },10)
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
        setTimeout(function(){
            for(var sitem in $scope.rticData.intRtics){
                var flag=$scope.rticData.intRtics[sitem].updownFlag;
                var rangeType=$scope.rticData.intRtics[sitem].rangeType;
                $("#updownFlag"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#rangeType"+rangeType+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            }
        },10)
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

        setTimeout(function(){
            for(var sitem in $scope.rticData.intRtics){
                var flag=$scope.rticData.intRtics[sitem].updownFlag;
                var rangeType=$scope.rticData.intRtics[sitem].rangeType;
                $("#updownFlag"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#rangeType"+rangeType+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            }
        },10)
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
        setTimeout(function(){
            for(var sitem in $scope.rticData.rtics){
                var flag=$scope.rticData.rtics[sitem].updownFlag;
                var rangeType=$scope.rticData.rtics[sitem].rangeType;
                $("#rticsupdownFlag"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#rticsrangeType"+rangeType+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            }
        },10)
    };
    $scope.minusCarRtic=function(id){
        $scope.rticData.rtics.splice(id, 1);
        if($scope.rticData.rtics.length===0) {
            if($("#carRTICDiv").hasClass("in")) {
                $("#carRTICDiv").removeClass("in");
            }

        }
        setTimeout(function(){
            for(var sitem in $scope.rticData.rtics){
                var flag=$scope.rticData.rtics[sitem].updownFlag;
                var rangeType=$scope.rticData.rtics[sitem].rangeType;
                $("#rticsupdownFlag"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#rticsrangeType"+rangeType+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            }
        },10)
    }

    $scope.checkupdownFlag=function(flag,item,index){
        $("#updownFlagdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#updownFlag"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.updownFlag=flag;
    }
    $scope.checkrangeType=function(flag,item,index){
        $("#rangeTypediv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#rangeType"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.rangeType=flag;
    }

    $scope.checkrticsupdownFlag=function(flag,item,index){
        $("#rticsupdownFlagdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#rticsupdownFlag"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.updownFlag=flag;
    }
    $scope.checkrticsrangeType=function(flag,item,index){
        $("#rticsrangeTypediv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#rticsrangeType"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.rangeType=flag;
    }
})