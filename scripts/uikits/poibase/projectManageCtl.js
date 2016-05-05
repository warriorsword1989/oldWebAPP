angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('projectManageCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', function($scope, $ocll, $rs, $q) {
	$ocll.load("components/poi/ctrls/data-list/headCtl").then(function() {
        $scope.headTpl = "../../scripts/components/poi/tpls/data-list/header.html";
    });
	

}]);