/**
 * Created by mali on 2016/8/15.
 */
angular.module('app').controller("SearchSubModalCtl", ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsEdit',
    function($scope, $ocLazyLoad, appPath, $interval, dsEdit) {
		$scope.param = {
			"name" : "",
			"nameGroupid": "",
 			"adminId": ""
		};
		$scope.admin = "";
		$scope.doSearch = function(){
			if(!$scope.param.name && !$scope.param.adminId && !$scope.param.nameGroupid){
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
	            	$scope.subSearchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/nameGroupTableSearchTpl.htm';
	            });
       	 	}else if("admin" == type) {
	       	 	$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/adminTableCtl.js').then(function () {
	            	$scope.subSearchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/adminTableSearchTpl.htm';
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
        /***
         * 道路组名，行政区划名参数
         */
        $scope.selectedVal = function(row, index, type) {
	       	 if(type == "admin"){
       			$scope.admin = row.whole;
       			$scope.param.adminId = row.adminareacode;
       			$scope.admin = row.whole;
          		$scope.subSearchModal = false;
	       	 }else if(type == "namegroup"){
	   			$scope.param.nameGroupid = row.nameGroupid;
	   			$scope.subSearchModal = false;
	       	 }
        };
	}
]);