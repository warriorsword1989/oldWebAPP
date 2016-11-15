angular.module('app').controller('CheckResultCtl', ['$scope', function ($scope) {
    $scope.theadInfo = ['序号', '规则编码', '错误描述', '操作', '关联POI'];
    /* 检查结果忽略操作*/
    $scope.ignoreCheckResult = function (item) {
        $scope.$emit('ignoreItem', item);
    };
    /* 显示关联poi数据*/
    $scope.showCRRefFtInMap = function (index) {
        $scope.$emit('getRefFtInMap', $scope.poi.checkResultData[index].refFeatures);
    };
}]);
