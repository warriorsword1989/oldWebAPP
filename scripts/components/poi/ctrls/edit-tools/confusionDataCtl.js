angular.module('app').controller('ConfusionDataCtl', ['$scope', function($scope) {
    $scope.$on('confusionData',function(event,data){
        console.log(data)
       $scope.confusionData = data;
    });
    
}]);