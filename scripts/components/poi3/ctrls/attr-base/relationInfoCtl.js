angular.module('app').controller('relationInfoCtl', ['$scope', function($scope) {

    $scope.showChildrenPoisInMap = function (pid){
        $scope.$emit('emitChildren', pid);
    }
    $scope.showParentPoiInMap = function(pid) {
        $scope.$emit('emitParent', pid);
    };

}]);