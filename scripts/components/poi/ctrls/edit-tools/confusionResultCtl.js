angular.module('app',['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('ConfusionResultCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', function($scope, $ocll, $rs, $q, poi) {
    $scope.theadInfo = ['序号','规则编码','错误描述','操作','关联POI'];
    $scope.$on("confusionInfoData", function(event, data) {
        $scope.confusionInfo = data;
    });
}]);