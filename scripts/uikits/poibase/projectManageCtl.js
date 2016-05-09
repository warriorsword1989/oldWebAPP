angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'ngTable', 'dataService']).controller('projectManageCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi',function($scope, $ocll, $rs, $q, poi ) {
	$ocll.load("components/poi/ctrls/data-list/headCtl").then(function() {
        $scope.headTpl = "../../scripts/components/poi/tpls/data-list/header.html";
    });
	var promises = [];
	$scope.isActive = 'common';
	$scope.menuChange = function(menuName){
		switch(menuName){
			case 'common':
				$ocll.load('../../scripts/components/poi/ctrls/data-list/generalProjectListCtrl.js').then(function(){
                    $scope.tagContent = '../../scripts/components/poi/tpls/data-list/generalProjectListTpl.html';
                });
				poi.getProjectList("","","",function(data){
					$scope.projectList = data;
					$scope.$broadcast("currentProjectList", $scope.projectList);
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