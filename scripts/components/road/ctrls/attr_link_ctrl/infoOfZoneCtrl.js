/**
 * Created by liwanchong on 2016/3/2.
 */
var oridinaryInfoApp = angular.module("mapApp");
oridinaryInfoApp.controller("zoneInfoController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.zoneData = objCtrl.data;
    $scope.typeoption=[
        {"id":0,"label":"未分类"},
        {"id":1,"label":"AOIZone"},
        {"id":2,"label":"KDZone"},
        {"id":3,"label":"GCZone"}
    ];
    if($(".ng-dirty")) {
        $.each($('.ng-dirty'), function (i, v) {
            if($scope.zoneInfoForm!=undefined) {
                $scope.zoneInfoForm.$setPristine();
            }
        });

    }

    for(var i= 0,len=$scope.zoneData.zones.length;i<len;i++) {

        if($scope.zoneData.zones[i]["rowId"]===$scope.zoneData["oridiRowId"]) {
            $scope.oridiData = $scope.zoneData.zones[i];
        }
    }

})