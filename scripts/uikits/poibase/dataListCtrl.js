angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'ngTable', 'dataService','ngSanitize']).controller('DataListCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi',function($scope, $ocll, $rs, $q, poi ) {
	$ocll.load("components/poi/ctrls/data-list/headCtl").then(function() {
        $scope.headTpl = "../../scripts/components/poi/tpls/data-list/header.html";
    });
//	$ocll.load("components/poi/ctrls/data-list/headCtl").then(function() {
        $scope.projectInfoTpl = "../../scripts/components/poi/tpls/data-list/projectInfo.html";
//    });
	var promises = [];
}]);