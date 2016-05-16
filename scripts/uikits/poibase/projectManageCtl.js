angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'ngTable', 'dataService','ngSanitize']).controller('projectManageCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi','$timeout',function($scope, $ocll, $rs, $q, poi ,$timeout) {
	$ocll.load("components/poi/ctrls/data-list/headCtl").then(function() {
        $scope.headTpl = "../../scripts/components/poi/tpls/data-list/header.html";
    });
	var promises = [];
	promises.push(poi.queryUser().then(function(data) {
		$scope.userInfo = data;
    }));
	$q.all(promises).then(function(){
		$scope.isActive = 'common';
		$scope.menuChange = function(menuName){
			switch(menuName){
				case 'common':
					$ocll.load('../../scripts/components/poi/ctrls/data-list/generalProjectListCtrl.js').then(function(){
	                    $scope.tagContent = '../../scripts/components/poi/tpls/data-list/generalProjectListTpl.html';
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
					$ocll.load('../../scripts/components/poi/ctrls/data-list/userProfileCtrl.js').then(function(){
	                    $scope.tagContent = '../../scripts/components/poi/tpls/data-list/userProfile.html';
	        				poi.queryUser(null,function(data){
	        					$scope.userInfo = data;
	        				});
	                });
	                break;
				case 'userMessage':
//					$ocll.load('').then(function(){
	                    $scope.tagContent = '../../scripts/components/poi/tpls/data-list/userMessage.html';
//	                });
	                break;
			}
			$scope.isActive = menuName;
		};
		$scope.menuChange('common');
	});
	
	$scope.$on('getPageData',function(event, param){
		poi.getProjectList(param).then(function(data){
			$scope.$broadcast("getPageDataResult", data);
		});
    });
}]);