angular.module('app').controller('SearchResultCtl', ['$scope', function($scope) {

    $scope.theadInfo = ['序号','要素PID','要素类型','名称','属性1','属性2'];
    
    /*显示关联poi数据*/
    $scope.showCRRefFtInMap = function(index){
        $scope.$emit('getRefFtInMap',$scope.poi.checkResultData[index].refFeatures);
    }
}]);