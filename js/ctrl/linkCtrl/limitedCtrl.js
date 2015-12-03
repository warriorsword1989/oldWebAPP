/**
 * Created by liwanchong on 2015/10/29.
 */
var limitedApp = angular.module("lazymodule", []);
limitedApp.controller("limitedController",function($scope) {
    $scope.linkLimitData = $scope.linkData;
    $scope.truckFlagarray=[];
    $scope.truckFlagarray.push($scope.linkLimitData.truckFlag);
    if($scope.linkLimitData.limitTrucks.length===0) {
        if($("#trafficLimitedDiv").hasClass("in")) {
            $("#trafficLimitedDiv").removeClass("in");
        }
    }
    if($scope.linkLimitData.limits.length===0) {
        if($("#popularLimitedDiv").hasClass("in")) {
            $("#popularLimitedDiv").removeClass("in");
        }

    }
    setTimeout(function(){
        for(var sitem in $scope.linkLimitData.limits){
            var flag=$scope.linkLimitData.limits[sitem].processFlag;
            $("#processFlag"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
        }

        for(var l in  $scope.truckFlagarray) {
            $("#truckFlag" +  $scope.truckFlagarray[l] + "_" + l).removeClass("btn btn-default").addClass("btn btn-primary");
        }

        for(var sitem in $scope.linkLimitData.limitTrucks){
            var flag=$scope.linkLimitData.limitTrucks[sitem].resTrailer;
            var resOutflag=$scope.linkLimitData.limitTrucks[sitem].resOut;
                $("#resTrailer"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#resOut"+resOutflag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
          }
    },10)

    $scope.appInfoOptions = [
        {"id": 0, "label": "调查中"},
        {"id": 1, "label": "可以通行"},
        {"id": 2, "label": "不可通行"},
        {"id": 3, "label": "未供用"},
        {"id": 5, "label": "计划"},
    ];
    $scope.typeOptions = [
        {"id": 0, "label": "道路维修中"},
        {"id": 1, "label": "单行限制"},
        {"id": 2, "label": "车辆限制"},
        {"id": 3, "label": "穿行限制"},
        {"id": 4, "label": "施工中不开放"},
        {"id": 5, "label": "季节性关闭道路"},
        {"id": 6, "label": "Usage Fee Required"},
        {"id": 8, "label": "外地车限行"},
        {"id": 9, "label": "尾号限行"}
    ];
    $scope.limitDirOptions = [
        {"id": 0, "label": "未调查"},
        {"id": 1, "label": "双方向"},
        {"id": 2, "label": "顺方向"},
        {"id": 3, "label": "逆方向"},
        {"id": 9, "label": "不应用"}
    ];
    $scope.tollTypeOptions = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "收费道路"},
        {"id": 2, "label": "桥"},
        {"id": 3, "label": "隧道"},
        {"id": 4, "label": "公园"},
        {"id": 5, "label": "山径"},
        {"id": 6, "label": "风景路线"},
        {"id": 9, "label": "不应用"}
    ];
    $scope.weatherOptions = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "雨天"},
        {"id": 2, "label": "雪天"},
        {"id": 3, "label": "雾天"},
        {"id": 9, "label": "不应用"}
    ];

    $scope.addLimit=function() {
        if(!$("#popularLimitedDiv").hasClass("in")) {
            $("#popularLimitedDiv").addClass("in");
        }
        $scope.linkLimitData.limits.unshift( {
            //appInfo: 1,
            type: 1,
            limitDir: 1,
            tollType: 1,
            weather: 1,
            processFlag: 1,
            linkPid:0
        });
    };

    $scope.minusLimit=function(id) {
        $scope.linkLimitData.limits.splice(id, 1);
        setTimeout(function() {
            for (var sq in $scope.linkLimitData.limitTrucks) {
                var flag = $scope.linkLimitData.limitTrucks[sq].resTrailer;
                var resOutflag = $scope.linkLimitData.limitTrucks[sq].resOut;
                $("#resTrailer" + flag + "_" + sq).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#resOut" + resOutflag + "_" + sq).removeClass("btn btn-default").addClass("btn btn-primary");
            }
        });
    };
    $scope.addLimitTruck = function () {
        if(!$("#trafficLimitedDiv").hasClass("in")) {
            $("#trafficLimitedDiv").addClass("in");
        }

        $scope.linkLimitData.limitTrucks.unshift(
            {
               // truckFlag: 0,
                limitDir: 1,
                resTrailer: 1,
                resWeigh: 0,
                resAxleLoad: 0,
                resAxleCount: 0,
                resOut: 0,
                rowId:"",
                linkPid:0
            }
        )
        $scope.truckFlagarray.push(0);
          setTimeout(function() {
              for(var l in  $scope.truckFlagarray) {
                  $("#truckFlag" +  $scope.truckFlagarray[l] + "_" + l).removeClass("btn btn-default").addClass("btn btn-primary");
              }

            for (var sq in $scope.linkLimitData.limitTrucks) {
                var flag = $scope.linkLimitData.limitTrucks[sq].resTrailer;
                var resOutflag = $scope.linkLimitData.limitTrucks[sq].resOut;
                $("#resTrailer" + flag + "_" + sq).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#resOut" + resOutflag + "_" + sq).removeClass("btn btn-default").addClass("btn btn-primary");
            }
        });
    };
    $scope.minusLimitTruck=function(id) {
        $scope.linkLimitData.limitTrucks.splice(id, 1);
        if($scope.linkLimitData.limitTrucks.length===0) {
            if($("#trafficLimitedDiv").hasClass("in")) {
                $("#trafficLimitedDiv").removeClass("in");
            }
        }
        $scope.truckFlagarray.splice(id, 1);
        setTimeout(function() {
            for(var l in  $scope.truckFlagarray) {
                $("#truckFlag" +  $scope.truckFlagarray[l] + "_" + l).removeClass("btn btn-default").addClass("btn btn-primary");
            }

            for (var sq in $scope.linkLimitData.limitTrucks) {
                var flag = $scope.linkLimitData.limitTrucks[sq].resTrailer;
                var resOutflag = $scope.linkLimitData.limitTrucks[sq].resOut;
                $("#resTrailer" + flag + "_" + sq).removeClass("btn btn-default").addClass("btn btn-primary");
                $("#resOut" + resOutflag + "_" + sq).removeClass("btn btn-default").addClass("btn btn-primary");
            }
        });
    };

    $scope.checkprocessFlag=function(flag,item,index){
        $("#processFlagdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#processFlag"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.processFlag=flag;
    }

    $scope.checktruckFlag=function(flag,item,index){
        $("#truckFlagdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#truckFlag"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.truckFlag=flag;
    }

    $scope.checkresTrailer=function(flag,item,index){
        $("#resTrailerdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#resTrailer"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.resTrailer=flag;
    }
    $scope.checkresOut=function(flag,item,index){
        $("#resOutdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#resOut"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.resOut=flag;
    }
})