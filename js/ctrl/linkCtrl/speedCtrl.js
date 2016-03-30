/**
 * Created by liwanchong on 2015/10/29.
 */
var realtimeTrafficApp = angular.module("lazymodule", []);
realtimeTrafficApp.controller("speedController",function($scope,$timeout,$ocLazyLoad) {
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

    $scope.speedTypeOption=[
        {"id":0,"label":"普通"},
        {"id":1,"label":"指示牌"},
        {"id":3,"label":"特定条件"}
    ];

    //普通限速
    $scope.minusoridinarySpeed = function (id) {
        //$scope.rticData.speedlimits.splice(id, 1);
    };
    $scope.addoridinarySpeed = function () {
        //var newIntRtic = fastmap.dataApi.linkspeedlimit({"linkPid": $scope.rticData.pid,"speedType":0});
        //$scope.rticData.speedlimits.unshift(newIntRtic)

    };

    //条件限速
    $scope.addspeedLimit = function () {
        var newRtic = fastmap.dataApi.linkspeedlimit({"linkPid": $scope.rticData.pid,"speedType":3});
        $scope.rticData.speedlimits.unshift(newRtic)
    };
    $scope.minusspeedLimit=function(id){
        $scope.rticData.speedlimits.splice(id, 1);
    }


    //普通限速
    $scope.showOridinarySpeedInfo= function (item) {
        $scope.linkData["oridiRowId"] = item.rowId;
        var oridinarySpeedObj = {
            "loadType":"subAttrTplContainer",
            "propertyCtrl": 'ctrl/linkCtrl/infoOfOridinarySpeedCtrl',
            "propertyHtml": 'js/tepl/linkObjTepl/infoiOfOridinarySpeedTepl.html'
        }
        $scope.$emit("transitCtrlAndTpl", oridinarySpeedObj);
    }

    //条件限速
    $scope.showspeedlimitInfo= function (cItem) {
        $scope.linkData["oridiRowId"] = cItem.rowId;
        var speedlimitInfoObj = {
            "loadType":"subAttrTplContainer",
            "propertyCtrl": 'ctrl/linkCtrl/infoOfConditionSpeedCtrl',
            "propertyHtml": 'js/tepl/linkObjTepl/infoOfConditionSpeedTepl.html'
        }
        $scope.$emit("transitCtrlAndTpl", speedlimitInfoObj);
    }



    $scope.changeColor=function(ind,ord){
        if(ord==1){
            $("#oridinarySpeedSpan"+ind).css("color","#FFF");
        }else{
            $("#speedLimitSpan"+ind).css("color","#FFF");
        }
    }
    $scope.backColor=function(ind,ord){
        if(ord==1){
            $("#oridinarySpeedSpan"+ind).css("color","darkgray");
        }else{
            $("#speedLimitSpan"+ind).css("color","darkgray");
        }
    }
})