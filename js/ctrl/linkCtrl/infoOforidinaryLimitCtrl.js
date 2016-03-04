/**
 * Created by liwanchong on 2016/3/2.
 */
var oridinaryInfoApp = angular.module("myApp", []);
oridinaryInfoApp.controller("oridinaryLimitController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.linkData = objCtrl.data.data;
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
    $scope.limitDirOptions = [
        {"id": 0, "label": "未调查"},
        {"id": 1, "label": "双方向"},
        {"id": 2, "label": "顺方向"},
        {"id": 3, "label": "逆方向"},
        {"id": 9, "label": "不应用"}
    ];
    $scope.weatherOptions = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "雨天"},
        {"id": 2, "label": "雪天"},
        {"id": 3, "label": "雾天"},
        {"id": 9, "label": "不应用"}
    ];
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
    for(var i= 0,len=$scope.linkData.limits.length;i<len;i++) {
        if($scope.linkData.limits[i]["rowId"]===$scope.linkData["oridiRowId"]) {
            $scope.oridiData = $scope.linkData.limits[i];
        }

    }
    $scope.showvehicle=function(vehicle){
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
        initOrig(originArray,$scope.vehicleOptions,"vehicleExpressiondiv");
        //点击内容显示框时，关闭下拉，保存数据
        //$("#vehicleExpressiondiv"+sitem).click(function(){
        //    $("#vehicleExpressiondiv"+sitem).popover('hide');
        //    $scope.linkLimitData.limits[sitem].vehicle=getEndArray();
        //});
    }

    $scope.showPopover=function(ind,vehicle){
        initdiv('vehicleExpressiondiv'+ind);
        $('#vehicleExpressiondiv').popover('show');

    }
    $scope.showvehicle("2147483655");
})