/**
 * Created by liwanchong on 2016/3/2.
 */
var truckLimitApp = angular.module("myApp", []);
truckLimitApp.controller("truckLimitInfoController",function($scope,$timeout,$ocLazyLoad) {
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
    $timeout(function(){
        $ocLazyLoad.load('ctrl/fmdateTimer').then(function () {
            $scope.dateURL = 'js/tepl/fmdateTimer.html';
            if($scope.linkData.limitTrucks.length == 0)
                $scope.linkData.limitTrucks.push({timeDomain:''});
            if($scope.linkData.limits.length == 0)
                $scope.linkData.limits.push({timeDomain:''});
            /*查询数据库取出时间字符串*/
            $.each($scope.linkData.limits,function(i,v){
                $scope.fmdateTimer(v.timeDomain);
            })
            $.each($scope.linkData.limitTrucks,function(i,v){
                $timeout(function(){
                    $scope.$broadcast('set-code',v.timeDomain);
                    $scope.codeOutput = v.timeDomain;
                    $scope.$apply();
                },100);
            })
            // var tmpStr = (!$scope.linkLimitData.limitTrucks[0].timeDomain)?'':$scope.linkLimitData.limitTrucks[0].timeDomain;
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
})