angular.module('app').controller('CheckResultCtl', ['$scope', function($scope) {

    $scope.theadInfo = ['序号','规则编码','错误描述','操作','关联POI'];
    $scope.$on("checkResultData", function(event, data) {
        $scope.checkResults = data;
    });
    /*检查结果忽略操作*/
    $scope.ignoreCheckResult = function(item){
        $scope.$emit('ignoreItem',item);
    }
    /*显示关联poi数据*/
    $scope.showCRRefFtInMap = function(index){
        $scope.$emit('getRefFtInMap',$scope.checkResults[index].refFeatures);
    }
}]);