/**
 * Created by mali on 2016/8/15.
 */
angular.module('app').controller("SearchSubModalCtl", ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsEdit',
    function($scope, $ocLazyLoad, appPath, $interval, dsEdit) {
		$scope.param = {
			"name" : "",
			"nameGroupid": "",
 			"adminId": 0,
 			"flag" : -1
		};
		$scope.admin = "";
		$scope.doSearch = function(){
//			if(!$scope.param.name && !$scope.param.adminId && !$scope.param.nameGroupid){
//				swal("请先输入查询条件", "", "info");
//				return;
//			}
			$scope.$emit("FITERPARAMSCHANGE", $scope.param);
			//关闭窗口
			$scope.$emit("CLOSECURRENTPANEL");
		};
		$scope.adminOpt = [
		        {"id": 0, "label":"----请选择行政区划----"},
       		    {"id": 214, "label": "全国"},
       		    {"id": 110000, "label": "北京"},
       		    {"id": 120000, "label": "天津"},
       		    {"id": 130000, "label": "河北"},
       		    {"id": 140000, "label": "山西"},
       		    {"id": 150000, "label": "内蒙古"},
       		    {"id": 210000, "label": "辽宁"},
       		    {"id": 220000, "label": "吉林"},
       		    {"id": 230000, "label": "黑龙江"},
       		    {"id": 310000, "label": "上海"},
       		    {"id": 320000, "label": "江苏"},
       		    {"id": 330000, "label": "浙江"},
       		    {"id": 340000, "label": "安徽"},
       		    {"id": 350000, "label": "福建"},
       		    {"id": 360000, "label": "江西"},
       		    {"id": 370000, "label": "山东"},
       		    {"id": 410000, "label": "河南"},
       		    {"id": 420000, "label": "湖北"},
       		    {"id": 430000, "label": "湖南"},
       		    {"id": 440000, "label": "广东"},
       		    {"id": 450000, "label": "广西"},
       		    {"id": 460000, "label": "海南"},
       		    {"id": 500000, "label": "重庆"},
       		    {"id": 510000, "label": "四川"},
       		    {"id": 520000, "label": "贵州"},
       		    {"id": 530000, "label": "云南"},
       		    {"id": 540000, "label": "西藏"},
       		    {"id": 610000, "label": "陕西"},
       		    {"id": 620000, "label": "甘肃"},
       		    {"id": 630000, "label": "青海"},
       		    {"id": 640000, "label": "宁夏"},
       		    {"id": 650000, "label": "新疆"},
       		    {"id": 810000, "label": "香港"},
       		    {"id": 820000, "label": "澳门"}
       		];
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