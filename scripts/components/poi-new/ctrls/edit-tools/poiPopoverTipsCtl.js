angular.module('app').controller('PoiPopoverTipsCtl', ['$scope', function($scope) {
    initData();
    function initData(){
    }
    $scope.closeTips = function(){
        $scope.$emit('closePopoverTips',true);
    }
}]);