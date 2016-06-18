/**
 * Created by liwanchong on 2015/10/29.
 */
/*var limitedApp = angular.module("lazymodule", []);
limitedApp.controller("limitedController",function($scope) {*/
var limitedApp = angular.module("app");
limitedApp.controller("limitedController", function ($scope,$timeout,$ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.linkLimitData = objCtrl.data;
    $scope.truckFlagarray=[];
    $scope.truckFlagarray.push($scope.linkLimitData.truckFlag);


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
        {"id": 28, "label": "残疾人车"}
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
    $scope.showOrdinaryInfo=function(item) {
        $scope.linkData["oridiRowId"] = item.rowId;
        var showOrdinaryObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'components/road/ctrls/attr_link_ctrl/limitOfOrdinaryCtrl',
            "propertyHtml":'../../scripts/components/road/tpls/attr_link_tpl/limitOfOrdinaryTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showOrdinaryObj);
    };
    $scope.showTrcukInfo=function(item) {
        $scope.linkData["truckRowId"] = item.rowId;
        var showTrcukObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'components/road/ctrls/attr_link_ctrl/limitOfTruckCtrl',
            "propertyHtml":'../../scripts/components/road/tpls/attr_link_tpl/limitOfTruckTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showTrcukObj);
    };
    $timeout(function(){
        $ocLazyLoad.load('components/tools/fmTimeComponent/fmdateTimer').then(function () {
            $scope.dateURL = '../../scripts/components//tools/fmTimeComponent/fmdateTimer.html';
            /*查询数据库取出时间字符串*/
            $.each($scope.linkLimitData.limits,function(i,v){
                $scope.fmdateTimer(v.timeDomain);
            })
            $.each($scope.linkLimitData.limitTrucks,function(i,v){
                $scope.fmdateTimer(v.timeDomain);
            })
        });
    })
    /*时间控件*/
    $scope.fmdateTimer = function(str){
        $scope.$on('get-date', function(event,data) {
            $scope.codeOutput = data;
        });
        $timeout(function(){
            $scope.$broadcast('set-code',str);
            $scope.codeOutput = str;
            $scope.$apply();
        },100);
    }
    /*显示编辑时间段*/
    $scope.showDomain = function(id,str){
        $.each($(".domain-well"),function(i,v){
            $(v).collapse('hide');
        });
        $('#'+id).collapse('show');
        $scope.fmdateTimer(str);
    }
    $scope.addLimit=function() {
        var newLimit = fastmap.dataApi.rdLinkLimit({"linkPid":$scope.linkLimitData.pid});
        $scope.linkLimitData.limits.unshift(newLimit);
    };
    $scope.slideShow = function(target){
        $("#popularLimitedDiv").collapse('hide');
        $("#trafficLimitedDiv").collapse('hide');
        $(target).collapse('show');
        if(target == '#popularLimitedDiv'){
            $.each($scope.linkLimitData.limits,function(i,v){
                if(v.timeDomain)
                    $scope.fmdateTimer(v.timeDomain);
                else
                    $scope.fmdateTimer('[]');
            })
        }else{
            $.each($scope.linkLimitData.limitTrucks,function(i,v){
                if(v.timeDomain)
                    $scope.fmdateTimer(v.timeDomain);
                else
                    $scope.fmdateTimer('[]');
            })
        }

    }
    $scope.minusLimit=function(id,index) {
        if(index==0){
            $scope.linkLimitData.limits.splice(id, 1);
        }else{
            $scope.linkLimitData.limitTrucks.splice(id, 1);
        }

    };
    $scope.addLimitTruck = function () {
        var newTruckLimit = fastmap.dataApi.rdLinkTruckLimit({"linkPid":$scope.linkLimitData.pid});
        $scope.linkLimitData.limitTrucks.unshift(newTruckLimit);
        $scope.truckFlagarray.push(0);
    };
    $scope.minusLimitTruck=function(id) {
        $scope.linkLimitData.limitTrucks.splice(id, 1);
        if($scope.linkLimitData.limitTrucks.length===0) {
        }
        $scope.truckFlagarray.splice(id, 1);
    };


})