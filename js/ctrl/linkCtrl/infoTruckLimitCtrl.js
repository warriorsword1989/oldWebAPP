/**
 * Created by liwanchong on 2016/3/2.
 */
var truckLimitApp = angular.module("myApp", []);
truckLimitApp.controller("truckLimitInfoController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.linkData = objCtrl.data.data;
    $scope.limitDirOptions = [
        {"id": 0, "label": "未调查"},
        {"id": 1, "label": "双方向"},
        {"id": 2, "label": "顺方向"},
        {"id": 3, "label": "逆方向"},
        {"id": 9, "label": "不应用"}
    ];
    for(var i= 0,len=$scope.linkData.limitTrucks.length;i<len;i++) {
        if($scope.linkData["truckRowId"]===$scope.linkData.limitTrucks[i]["rowId"]) {
            $scope.truckLimit = $scope.linkData.limitTrucks[i];
        }
    }
})