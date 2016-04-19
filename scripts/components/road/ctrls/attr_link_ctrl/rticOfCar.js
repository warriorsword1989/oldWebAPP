/**
 * Created by liwanchong on 2016/3/2.
 */
var oridinaryInfoApp = angular.module("myApp", []);
oridinaryInfoApp.controller("oridinaryCarController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.realtimeData = objCtrl.data;
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

    for(var i= 0,len=$scope.realtimeData.rtics.length;i<len;i++) {
        if($scope.realtimeData.rtics[i]["rowId"]===$scope.realtimeData["oridiRowId"]) {
            $scope.oridiData = $scope.realtimeData.rtics[i];
        }
    }

})