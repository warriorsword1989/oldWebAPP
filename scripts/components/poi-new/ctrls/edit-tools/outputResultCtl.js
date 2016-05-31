angular.module('app').controller('OutputResultCtl', ['$scope', function($scope) {

    $scope.theadInfo = ['操作','类型','编号'];
    /*检查结果忽略操作*/
    $scope.ignoreCheckResult = function(item){
        $scope.$emit('ignoreItem',item);
    }
    /*显示关联poi数据*/
    $scope.showCRRefFtInMap = function(index){
        $scope.$emit('getRefFtInMap',$scope.poi.checkResultData[index].refFeatures);
    }
}]);