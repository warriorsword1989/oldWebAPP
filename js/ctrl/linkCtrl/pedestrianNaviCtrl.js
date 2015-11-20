/**
 * Created by liwanchong on 2015/10/29.
 */
var pedestrianNaviApp = angular.module("lazymodule", []);
pedestrianNaviApp.controller("pedestrianNaviController",function($scope) {
    $scope.naviData =  $scope.linkData;
    $("#diciTypebtn"+$scope.linkData.diciType).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#sidewalkFlagbtn"+$scope.linkData.sidewalkFlag).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#walkstairFlagbtn"+$scope.linkData.walkstairFlag).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#walkFlagbtn"+$scope.linkData.walkFlag).removeClass("btn btn-default").addClass("btn btn-primary");

    setTimeout(function(){
        for(var sitem in $scope.naviData.sidewalks){
            var flag=$scope.naviData.sidewalks[sitem].workDir;
            var processFlagflag=$scope.naviData.sidewalks[sitem].processFlag;
            var captureFlagflag=$scope.naviData.sidewalks[sitem].captureFlag;
            $("#workDir"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            $("#processFlag"+processFlagflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            $("#captureFlag"+captureFlagflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
        }
        for(var sitem in $scope.naviData.walkstairs){
            var flag=$scope.naviData.walkstairs[sitem].workDir;
            var stairFlagflag=$scope.naviData.walkstairs[sitem].stairFlag;
            var captureFlagflag=$scope.naviData.walkstairs[sitem].captureFlag;
            $("#walkstairsworkDir"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            $("#stairFlag"+stairFlagflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            $("#walkstairscaptureFlag"+captureFlagflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
        }
    },10)

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

    $scope.dividerTypeoptions=[
        {"id": 0, "label":"未调查"},
        {"id": 1, "label":"高度差隔离(马路涯)"},
        {"id": 2, "label":"物理栅栏隔离"},
        {"id": 3, "label":"划线隔离"},
        {"id": 4, "label":"无隔离"}
    ];
    $scope.addSideWalk=function(){
        if(!$("#sideWalkDiv").hasClass("in")) {
            $("#sideWalkDiv").addClass("in");
        }
        $scope.naviData.sidewalks.unshift({
            captureFlag: 1,
            dividerType: 0,
            linkPid: 0,
            processFlag: 0,
            rowId: "",
            sidewalkLoc: 2,
            workDir: 1
        });
        setTimeout(function(){
            for(var sitem in $scope.naviData.sidewalks){
                var flag=$scope.naviData.sidewalks[sitem].workDir;
                var processFlagflag=$scope.naviData.sidewalks[sitem].processFlag;
                var captureFlagflag=$scope.naviData.sidewalks[sitem].captureFlag;

                $("#workDir"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#processFlag"+processFlagflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#captureFlag"+captureFlagflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            }
        },10)

    }
    $scope.minusSideWalk = function (id) {
        $scope.naviData.sidewalks.splice(id, 1);
        if($scope.naviData.sidewalks.length==0){
            if($("#sideWalkDiv").hasClass("in")) {
                $("#sideWalkDiv").removeClass("in");
            }
        }
        setTimeout(function(){
            for(var sitem in $scope.naviData.sidewalks){
                var flag=$scope.naviData.sidewalks[sitem].workDir;
                var processFlagflag=$scope.naviData.sidewalks[sitem].processFlag;
                var captureFlagflag=$scope.naviData.sidewalks[sitem].captureFlag;
                $("#workDir"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#processFlag"+processFlagflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#captureFlag"+captureFlagflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            }
        },1000)
    };

    $scope.addStairWalk = function () {
        if(!$("#humanLadderDiv").hasClass("in")) {
            $("#humanLadderDiv").addClass("in");
        }
        $scope.naviData.walkstairs.unshift({
            captureFlag: 1,
            stairFlag: 1,
            stairLoc: 2,
            workDir: 1,
            linkPid:0
        })
        setTimeout(function(){
            for(var sitem in $scope.naviData.walkstairs){
                var flag=$scope.naviData.walkstairs[sitem].workDir;
                var stairFlagflag=$scope.naviData.walkstairs[sitem].stairFlag;
                var captureFlagflag=$scope.naviData.walkstairs[sitem].captureFlag;
                $("#walkstairsworkDir"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#stairFlag"+stairFlagflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#walkstairscaptureFlag"+captureFlagflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            }
        },10 )

    };
    $scope.minusStairWalk=function(id) {
        $scope.naviData.walkstairs.splice(id, 1);;
        if($scope.naviData.walkstairs.length==0){
            if($("#humanLadderDiv").hasClass("in")) {
                $("#humanLadderDiv").removeClass("in");
            }
        }
        setTimeout(function(){
            for(var sitem in $scope.naviData.walkstairs){
                var flag=$scope.naviData.walkstairs[sitem].workDir;
                var stairFlagflag=$scope.naviData.walkstairs[sitem].stairFlag;
                var captureFlagflag=$scope.naviData.walkstairs[sitem].captureFlag;
                $("#walkstairsworkDir"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#stairFlag"+stairFlagflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#walkstairscaptureFlag"+captureFlagflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
            }
        },1000 )
    };
    $scope.checkdiciType= function (flag) {
        $("#diciTypediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#diciTypebtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.linkData.diciType=flag;
    }

    $scope.checksidewalkFlag=function(flag){

        $("#sidewalkFlagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#sidewalkFlagbtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.linkData.sidewalkFlag=flag;
    }

    $scope.checkwalkstairFlag=function(flag){

        $("#walkstairFlagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#walkstairFlagbtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.linkData.walkstairFlag=flag;
    }

    $scope.checkwalkFlag=function(flag){
        $("#walkFlagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#walkFlagbtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.linkData.walkFlag=flag;
    }

    $scope.checkworkDir=function(flag,item,index){
        $("#workDirdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#workDir"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.workDir=flag;
    }
    $scope.checkprocessFlag=function(flag,item,index){
        $("#processFlagdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#processFlag"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.processFlag=flag;
    }

    $scope.checkcaptureFlag=function(flag,item,index){
        $("#captureFlagdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#captureFlag"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.captureFlag=flag;
    }

    $scope.checkstairFlag=function(flag,item,index){
        $("#stairFlagdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#stairFlag"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.stairFlag=flag;
    }
    $scope.checkwalkstairsworkDir=function(flag,item,index){
        $("#walkstairsworkDirdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#walkstairsworkDir"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.workDir=flag;
    }

    $scope.checkwalkstairscaptureFlag=function(flag,item,index){
        $("#walkstairscaptureFlagdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#walkstairscaptureFlag"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.captureFlag=flag;
    }

})