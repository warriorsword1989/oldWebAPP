/**
 * Created by mali on 2016/7/21.
 */

angular.module("app").controller("limitOfGateController",function($scope,$timeout,$ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.rdGateData = objCtrl.data;
//回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
    if($scope.gateLimitForm) {
        $scope.gateLimitForm.$setPristine();
    }
    $scope.limitDirOptions = [
        {"id": 0, "label": "未调查"},
        {"id": 1, "label": "双方向"},
        {"id": 2, "label": "顺方向"},
        {"id": 3, "label": "逆方向"},
        {"id": 9, "label": "不应用"}
    ];
    for(var i= 0,len=$scope.rdGateData.gateLimits.length;i<len;i++) {
        if($scope.rdGateData["truckRowId"]===$scope.rdGateData.gateLimits[i]["rowId"]) {
            $scope.gateLimit = $scope.rdGateData.gateLimits[i];
            $scope.limitNum = i;
        }
    }
    $timeout(function(){
        $ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function () {
            $scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
            $timeout(function(){
                $scope.fmdateTimer($scope.rdGateData.gateLimits[$scope.limitNum].timeDomain);
                $scope.$broadcast('set-code',$scope.rdGateData.gateLimits[$scope.limitNum].timeDomain);
                $scope.$apply();
            },100);
        });
    });
    /*时间控件*/
    $scope.fmdateTimer = function(str){
        $scope.$on('get-date', function(event,data) {
            $scope.rdGateData.gateLimits[$scope.limitNum].timeDomain = data;
        });
        $timeout(function(){
            $scope.$broadcast('set-code',str);
            $scope.rdGateData.gateLimits[$scope.limitNum].timeDomain = str;
            $scope.$apply();
        },100);
    };
});