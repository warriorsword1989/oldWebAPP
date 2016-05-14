angular.module('app').controller('ConfusionResultCtl', ['$scope', function($scope) {
    $scope.theadInfo = ['序号','规则编码','错误描述','操作','关联POI'];
    function initData(){
        $scope.confusionInfo = $scope.optionData.confusionInfoData;
    }
    initData();
    /*检查结果忽略操作*/
    $scope.ignoreConfusionResult = function(item){
        $scope.$emit('ignoreItem',item);
    }
    /*显示关联poi数据*/
    $scope.showConflictInMap = function(index){
        var confData = $scope.confusionInfo[index],
            confDataObj = {
                poiType:confData.poiType,
                refData:confData.refFeatures[0]
            }
        $scope.$emit('getConflictInMap',confDataObj);
    }
}]);