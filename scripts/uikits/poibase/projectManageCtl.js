angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'ngTable', 'dataService','ngSanitize']).controller('projectManageCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi',function($scope, $ocll, $rs, $q, poi ) {
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
				var currparam = {
		                    from: "app",
		                    projectStatus: [3, 6, 7],
		                    projectType: [1, 3],
		                    pageno: null, // 取全部数据
//		                    pagesize: null,
		                    // pagesize: "20",
		                    snapshot: "snapshot"
		            };
				var hisparam = {
		                    from: "app",
		                    projectStatus: [5],
		                    projectType: [1, 3],
		                    pageno: null, // 取全部数据
//		                    pagesize: null,
		                    // pagesize: "20",
		                    snapshot: "snapshot"
		            };
				poi.getProjectList(currparam,function(data){
					$scope.currProjectList = data;
					console.log('当前项目数'+data.length);
					$scope.$broadcast("currentProjectList", $scope.currProjectList);
				});
				poi.getProjectList(hisparam,function(data){
					$scope.hisProjectList = data;
					console.log('历史项目数'+data.length);
					$scope.$broadcast("hisProjectList", $scope.hisProjectList);
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