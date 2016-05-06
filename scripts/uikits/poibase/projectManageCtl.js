angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('projectManageCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', function($scope, $ocll, $rs, $q) {
	$ocll.load("components/poi/ctrls/data-list/headCtl").then(function() {
        $scope.headTpl = "../../scripts/components/poi/tpls/data-list/header.html";
    });
	$scope.isActive = 'common';
	$scope.menuChange = function(menuName){
		switch(menuName){
			case 'common':
				$ocll.load('').then(function(){
                    $scope.tagContent = '';
                });
                break;
			case 'agent': 
				$ocll.load('').then(function(){
                    $scope.tagContent = '';
                });
                break;
			case 'spec':
				$ocll.load('').then(function(){
                    $scope.tagContent = '';
                });
                break; 
			case 'userProfile':
//				$ocll.load('').then(function(){
                    $scope.tagContent = '../../scripts/components/poi/tpls/data-list/userProfile.html';
//                });
                break;
			case 'userMessage':
//				$ocll.load('').then(function(){
                    $scope.tagContent = '../../scripts/components/poi/tpls/data-list/userMessage.html';
//                });
                break;
		}
		$scope.isActive = menuName;
	};
	$scope.menuChange('common');
}]);