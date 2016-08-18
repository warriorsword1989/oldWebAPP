/**
 * Created by mali on 2016/8/15.
 */
angular.module('app').controller("SearchSubModalCtl", ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsEdit',
    function($scope, $ocLazyLoad, appPath, $interval, dsEdit) {
		$scope.param = {
			"name" : "",
			"nameGroupid": "",
 			"admin": "",
 			"sql":""
		};
		
		$scope.doSearch = function(){
			if(!$scope.param.name && !$scope.param.admin && !$scope.param.nameGroupId && !$scope.param.admin){
				swal("请先输入查询条件", "", "info");
				return;
			}
			$scope.$emit("FITERPARAMSCHANGE", $scope.param);
			//关闭窗口
			$scope.$emit("CLOSECURRENTPANEL");
		};
		
		/***
         * 弹出编辑面板
         */
        $scope.subSearchModal = false;
        $scope.openSubSearchModal = function(type){
       	 	$scope.subSearchModal = true;
       	 	if("nameGroup" == type) {
	       	 	$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/nameGroupTableCtl.js').then(function () {
	            	$scope.subSearchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/nameGroupTableTpl.htm';
	            });
       	 	}else if("admin" == type) {
	       	 	$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/adminTableCtl.js').then(function () {
	            	$scope.subSearchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/adminTableTpl.htm';
	            });
       	 	}else{
       	 		return;
       	 	}
        };
        /***
         * 关闭弹出的查询框
         */
        $scope.closeSubSearchModal = function(){
        	$scope.subSearchModal = false;
        };
	}
]);