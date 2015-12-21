/**
 * Created by liuzhaoxia on 2015/12/11.
 */
//var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
var selectApp = angular.module("speedLimitApp",[]);
selectApp.controller("speedlimitTeplController",function ($scope) {

    $scope.speedTypeOptions=[
        {"id":0,"label":"0  普通(General)"},
        {"id": 1, "label": "1 指示牌(Advisory)"},
        {"id": 3, "label": "3 特定条件(Dependent)"},
        {"id": 4, "label": "4 车道限速"}
    ];
    $scope.speedDirectTypeOptions=[
        {"id":0,"label":"0  未调查"},
        {"id": 2, "label": "2 顺方向"},
        {"id": 3, "label": "3 逆方向"}
    ];
    $scope.speedDependentOption=[
        {"id": 0, "label":"0  无"},
        {"id": 1, "label": "1 雨天(Rain)"},
        {"id": 2, "label": "2 雪天(Snow)"},
        {"id": 3, "label": "3 雾天(Fog)"},
        {"id": 6, "label": "6 学校(School)"},
        {"id": 10, "label": "10 时间限制(Time-Dependent)"},
        {"id": 11, "label": "11 车道限制(Lane-Dependent)"},
        {"id": 12, "label": "12 季节时段(Approximate Seasonal Time)"},
        {"id": 13, "label": "13 医院"},
        {"id": 14, "label": "14 购物"},
        {"id": 15, "label": "15 居民区"},
        {"id": 16, "label": "16 企事业单位"},
        {"id": 17, "label": "17 景点景区"},
        {"id": 18, "label": "18 交通枢纽"}
    ];
    $scope.limitSrcOption=[
        {"id": 0, "label":"0  无"},
        {"id": 1, "label": "1 现场标牌"},
        {"id": 2, "label": "2 城区标识"},
        {"id": 3, "label": "3 高速标识"},
        {"id": 4, "label": "4 车道限速"},
        {"id": 5, "label": "5 方向限速"},
        {"id": 6, "label": "6 机动车限速"},
        {"id": 7, "label": "7 匝道未调查"},
        {"id": 8, "label": "8 缓速行驶"},
        {"id": 9, "label": "9 未调查"}
    ];

    //var flag=$scope.speedLimitData.speedFlag;
    //$("#speedFlag"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
    //var  gaptureFlag=$scope.speedLimitData.gaptureFlag;
    //$("#gaptureFlag"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
    //var  tollgateFlag=$scope.speedLimitData.tollgateFlag;
    //$("#tollgateFlag"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
    $scope.checkspeedFlag=function(flag){
        $("#speedFlagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#speedFlag"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        //$scope.speedLimitData.speedFlag=flag;
    }

    $scope.checkgaptureFlag=function(flag){
        $("#gaptureFlagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#gaptureFlag"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        //$scope.speedLimitData.gaptureFlag=flag;
    }

    $scope.checktollgateFlag=function(flag){
        $("#tollgateFlagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#tollgateFlag"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        //$scope.speedLimitData.gaptureFlag=flag;
    }

});
