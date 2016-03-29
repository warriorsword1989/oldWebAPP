/**
 * Created by liwanchong on 2015/10/29.
 */
var realtimeTrafficApp = angular.module("lazymodule", []);
realtimeTrafficApp.controller("realtimeTrafficController",function($scope,$timeout,$ocLazyLoad) {
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

        }
    };
    $scope.addIntRtic = function () {
        var newIntRtic = fastmap.dataApi.linkintrtic({"linkPid": $scope.rticData.pid});
        $scope.rticData.intRtics.unshift(newIntRtic)

    };
    $scope.addCarRtic = function () {
        var newRtic = fastmap.dataApi.linkrtic({"linkPid": $scope.rticData.pid});
        $scope.rticData.rtics.unshift(newRtic)
    };
    $scope.minusCarRtic=function(id){
        $scope.rticData.rtics.splice(id, 1);
        if($scope.rticData.rtics.length===0) {

        }
    }



    $scope.showRticsInfo= function (item) {
        $scope.linkData["oridiRowId"] = item.rowId;
        var showRticsInfoObj = {
            "loadType":"subAttrTplContainer",
            "propertyCtrl": 'ctrl/linkCtrl/infoOfRealTimeRticsCtrl',
            "propertyHtml": 'js/tepl/linkObjTepl/infoOfRealTimeRticsTepl.html'
        }
        $scope.$emit("transitCtrlAndTmpl", showRticsInfoObj);
    }

    $scope.showCarInfo= function (cItem) {
        $scope.linkData["oridiRowId"] = cItem.rowId;
        var showCarInfoObj = {
            "loadType":"subAttrTplContainer",
            "propertyCtrl": 'ctrl/linkCtrl/infoOfRealTimeCarCtrl',
            "propertyHtml": 'js/tepl/linkObjTepl/infoOfRealTimeCarTepl.html'
        }
        $scope.$emit("transitCtrlAndTmpl", showCarInfoObj);
    }



    $scope.changeColor=function(ind,ord){
        if(ord==1){
            $("#rticSpan"+ind).css("color","#FFF");
        }else{
            $("#carSpan"+ind).css("color","#FFF");
        }
    }
    $scope.backColor=function(ind,ord){
        if(ord==1){
            $("#rticSpan"+ind).css("color","darkgray");
        }else{
            $("#carSpan"+ind).css("color","darkgray");
        }
    }
})