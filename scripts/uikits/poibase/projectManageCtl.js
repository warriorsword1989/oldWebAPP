angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'ngTable']).controller('projectManageCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', function($scope, $ocll, $rs, $q) {
	$ocll.load("components/poi/ctrls/data-list/headCtl").then(function() {
        $scope.headTpl = "../../scripts/components/poi/tpls/data-list/header.html";
    });
	$scope.isActive = 'common';
	$scope.menuChange = function(menuName){
		switch(menuName){
			case 'common':
				$ocll.load('../../scripts/components/poi/ctrls/data-list/commonCtrl.js').then(function(){
					$scope.tagContent = '../../scripts/components/poi/tpls/data-list/common.html';
				});
                break;
			case 'agent': 
				$ocll.load('').then(function(){
                    $scope.agentProject = '';
                });
                break;
			case 'spec':
				$ocll.load('').then(function(){
                    $scope.specialProject = '';
                });
                break; 
		}
		$scope.isActive = menuName;
	}

}]);