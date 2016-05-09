angular.module('app',['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('EditHistoryCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', function($scope, $ocll, $rs, $q, poi) {
    $scope.theadInfo = ['序号','作业员','操作时间','操作描述','平台'];
    $scope.$on("editHistoryData", function(event, data) {
        $scope.editHistory = data;
        // console.log(data)
    });
}]);