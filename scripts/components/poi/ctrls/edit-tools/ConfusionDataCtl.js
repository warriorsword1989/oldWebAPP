angular.module('app').controller('PoiInfoPopoverCtl', ['$scope', function($scope) {
    $scope.$on('poiInfoData',function(event,data){
        console.log(data)
       $scope.poiInfo = data;
    });
    
}]);