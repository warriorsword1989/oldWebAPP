angular.module('app').controller('PoiPopoverTipsCtl', ['$scope', function($scope) {
    initData();
    function initData(){
        console.log($scope.poi)
    }

}]);