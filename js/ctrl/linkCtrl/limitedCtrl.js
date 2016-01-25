/**
 * Created by liwanchong on 2015/10/29.
 */
/*var limitedApp = angular.module("lazymodule", []);
limitedApp.controller("limitedController",function($scope) {*/
var limitedApp = angular.module("mapApp", ['oc.lazyLoad']);
limitedApp.controller("limitedController", function ($scope,$timeout,$ocLazyLoad) {
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
            //车辆类型为10进制数转为二进制数
            //var towbin=$scope.dec2bin($scope.rdSubRestrictData.vehicleExpression);
            //var towbin=dec2bin($scope.linkLimitData.limits[sitem].vehicle);
           // var towbin=dec2bin("2147483655");
            $scope.showvehicle("2147483655",sitem);
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


    $scope.showvehicle=function(vehicle,sitem){
        var towbin=dec2bin(vehicle);

        //循环车辆值域，根据数据库数据取出新的数组显示在页面
        var originArray=[];
        $scope.checkValue=false;
        var len=towbin.length-1;
        //长度小于32即是没有选中checkbox，不允许
        if(towbin.length<32){
            $scope.checkValue=false;
        }else{
            len=towbin.length-2;
            $scope.checkValue=true;
        }
        for(var i=len;i>=0;i--){
            if(towbin.split("").reverse().join("")[i]==1){
                originArray.push($scope.vehicleOptions[i]);
            }
        }
        //初始化数据
        initOrig(originArray,$scope.vehicleOptions,"vehicleExpressiondiv"+sitem);
        //点击内容显示框时，关闭下拉，保存数据
        $("#vehicleExpressiondiv"+sitem).click(function(){
            $("#vehicleExpressiondiv"+sitem).popover('hide');
            $scope.linkLimitData.limits[sitem].vehicle=getEndArray();
        });
    }

    $scope.showPopover=function(ind){
        $('#vehicleExpressiondiv'+ind).popover('show');
    }
    $scope.vehicleOptions = [
        {"id": 0, "label": "客车(小汽车)"},
        {"id": 1, "label": "配送卡车"},
        {"id": 2, "label": "运输卡车"},
        {"id": 3, "label": "步行车"},
        {"id": 4, "label": "自行车"},
        {"id": 5, "label": "摩托车"},
        {"id": 6, "label": "机动脚踏两用车"},
        {"id": 7, "label": "急救车"},
        {"id": 8, "label": "出租车"},
        {"id": 9, "label": "公交车"},
        {"id": 10, "label": "工程车"},
        {"id": 11, "label": "本地车辆"},
        {"id": 12, "label": "自用车辆"},
        {"id": 13, "label": "多人乘坐车辆"},
        {"id": 14, "label": "军车"},
        {"id": 15, "label": "有拖车的车"},
        {"id": 16, "label": "私营公共汽车"},
        {"id": 17, "label": "农用车"},
        {"id": 18, "label": "载有易爆品的车辆"},
        {"id": 19, "label": "载有水污染品的车辆"},
        {"id": 20, "label": "载有其他污染品的车辆"},
        {"id": 21, "label": "电车"},
        {"id": 22, "label": "轻轨"},
        {"id": 23, "label": "校车"},
        {"id": 24, "label": "四轮驱动车"},
        {"id": 25, "label": "装有防雪链的车"},
        {"id": 26, "label": "邮政车"},
        {"id": 27, "label": "槽罐车"},
        {"id": 28, "label": "残疾人车"},
        {"id": 29, "label": "预留"},
        {"id": 30, "label": "预留"},
        {"id": 31, "label": "标志位,禁止/允许(0/1)"}
    ];



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

    $timeout(function(){
        $ocLazyLoad.load('ctrl/fmdateTimer').then(function () {
            $scope.dateURL = 'js/tepl/fmdateTimer.html';
        console.log($scope.linkLimitData.limitTrucks)
            /*查询数据库取出时间字符串*/
            var tmpStr = (!$scope.linkLimitData.limitTrucks[0].timeDomain)?'':$scope.linkLimitData.limitTrucks[0].timeDomain;
            // var tmpStr = '[[(h7m40)(h8m0)]+[(h11m30)(h12m0)]+[(h13m40)(h14m0)]+[(h17m40)(h18m0)]+[(h9m45)(h10m5)]+[(h11m45)(h12m5)]+[(h14m45)(h15m5)]+[[(M6d1)(M8d31)]*[(h0m0)(h5m0)]]+[[(M1d1)(M2d28)]*[(h0m0)(h6m0)]]+[[(M12d1)(M12d31)]*[(h0m0)(h6m0)]]+[[(M1d1)(M2d28)]*[(h23m0)(h23m59)]]+[[(M12d1)(M12d31)]*[(h23m0)(h23m59)]]]';
            $scope.fmdateTimer(tmpStr);
        });
    })
    /*时间控件*/
    $scope.fmdateTimer = function(str){
        $scope.$on('get-date', function(event,data) {
            $scope.codeOutput = data;
            $scope.linkLimitData.limitTrucks[0].timeDomain = data;
        });
        $timeout(function(){
            $scope.$broadcast('set-code',str);
            $scope.codeOutput = str;
            $scope.linkLimitData.limitTrucks[0].timeDomain = str;
            $scope.$apply();
        },100);
    }
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
            linkPid:0,
            vehicle:6
        });

        setTimeout(function() {
            $scope.showvehicle($scope.linkLimitData.limits[$scope.linkLimitData.limits.length - 1].vehicle, $scope.linkLimitData.limits.length - 1);
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