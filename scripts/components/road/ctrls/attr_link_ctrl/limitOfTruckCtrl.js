/**
 * Created by liwanchong on 2016/3/2.
 */
var truckLimitApp = angular.module("mapApp");
truckLimitApp.controller("truckLimitInfoController",function($scope,$timeout,$ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.linkData = objCtrl.data;
    if($(".ng-dirty")) {
        $.each($('.ng-dirty'), function (i, v) {
            if($scope.truckLimitForm!=undefined) {
                $scope.truckLimitForm.$setPristine();
            }
        });
    }
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
            $scope.limitNum = i;
        }
    }
    $timeout(function(){
        $ocLazyLoad.load('components/tools/fmTimeComponent/fmdateTimer').then(function () {
            $scope.dateURL = '../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
            $timeout(function(){
                $scope.fmdateTimer($scope.linkData.limitTrucks[$scope.limitNum].timeDomain);
                $scope.$broadcast('set-code',$scope.linkData.limitTrucks[$scope.limitNum].timeDomain);
                $scope.$apply();
            },100);
        });
    })
    /*时间控件*/
    $scope.fmdateTimer = function(str){
        $scope.$on('get-date', function(event,data) {
            $scope.linkData.limitTrucks[$scope.limitNum].timeDomain = data;
        });
        $timeout(function(){
            $scope.$broadcast('set-code',str);
            $scope.linkData.limitTrucks[$scope.limitNum].timeDomain = str;
            $scope.$apply();
        },100);
    }
})