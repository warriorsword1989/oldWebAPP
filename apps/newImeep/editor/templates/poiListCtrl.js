/**
 * Created by zhaohang on 2016/11/2.
 */
angular.module('webeditor').controller('poiListCtrl', ['$scope', 'ngDialog', function ($scope, ngDialog) {
    $scope.ruleWork = 'tab-pane fade in active';
    $scope.qualityWork = 'tab-pane fade';
    $scope.swithchWork = function (switchId) {
        if (switchId === 0) {
            $scope.ruleWork = 'tab-pane fade in active';
            $scope.qualityWork = 'tab-pane fade';
        } else {
            $scope.ruleWork = 'tab-pane fade';
            $scope.qualityWork = 'tab-pane fade in active';
        }
    };
}]);
