/**
 * Created by liwanchong on 2015/10/29.
 */
var zonePeopertyApp = angular.module("lazymodule", []);
zonePeopertyApp.controller("zonePeopertyController",function($scope,$timeout,$ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.zoneData =  objCtrl.data;
    $scope.typeoption=[
        {"id":0,"label":"未分类"},
        {"id":1,"label":"AOIZone"},
        {"id":2,"label":"KDZone"},
        {"id":3,"label":"GCZone"}
    ];
    $scope.showZoneWin=function(item){
        if(! $scope.$parent.$parent.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.$parent.$parent.suspendFlag = true;
        }
        $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
        $scope.linkData["oridiRowId"] = item.rowId;
        $ocLazyLoad.load('ctrl/linkCtrl/infoOfZoneCtrl').then(function () {
            $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/infoOfZoneTepl.html";
        })
    }

})