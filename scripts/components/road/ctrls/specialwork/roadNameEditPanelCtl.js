/**
 * Created by mali on 2016/8/11.
 */
angular.module('app').controller("RoadNameEditPanelCtl", ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsEdit',
    function($scope, $ocLazyLoad, appPath, $interval, dsEdit) {
		$scope.langCodeOpt = [
            {"id": "CHI", "label": "简体中文"},
            {"id": "CHT", "label": "繁体中文"},
            {"id": "ENG", "label": "英文"},
            {"id": "POR", "label": "葡萄牙文"}
        ];
		$scope.srcFlagOpt = [
			{"id": 0, "label": "未定义"},
			{"id": 1, "label": "按规则翻译(程序赋值)"},
			{"id": 2, "label": "来自出典(手工录入)"},
			{"id": 3, "label": "现场标牌"}              
		];
		$scope.prefixOpt = [
			{"id": 0, "label": "东"},
			{"id": 1, "label": "西"},
			{"id": 2, "label": "南"},
			{"id": 3, "label": "北"},
			{"id": 4, "label": "中"},
			{"id": 5, "label": "前"},
			{"id": 6, "label": "后"},
			{"id": 7, "label": "左"},
			{"id": 8, "label": "右"}
		];
		$scope.infixOpt = [
			{"id": 0, "label": "南"},
			{"id": 1, "label": "西"},
			{"id": 2, "label": "北"},
			{"id": 3, "label": "前"},
			{"id": 4, "label": "后"},
			{"id": 5, "label": "左"},
			{"id": 6, "label": "右"},
			{"id": 7, "label": "中"},
			{"id": 8, "label": "东"},
			{"id": 9, "label": "省"},
			{"id": 10, "label": "市"},
			{"id": 11, "label": "县"},
			{"id": 12, "label": "辅"},
			{"id": 13, "label": "外"},
			{"id": 14, "label": "上"},
			{"id": 15, "label": "正"},
			{"id": 16, "label": "下"},
			{"id": 17, "label": "内"}
		];
		$scope.suffixOpt = [
			{"id": 0, "label": "东"},
			{"id": 1, "label": "西"},
			{"id": 2, "label": "南"},
			{"id": 3, "label": "北"},
			{"id": 4, "label": "中"}
		];
		$scope.roadTypeOpt = [
			{"id": 0, "label": "未区分"},
			{"id": 1, "label": "高速"},
			{"id": 2, "label": "国道"},
			{"id": 3, "label": "铁路"},
			{"id": 4, "label": "出口编号"}
		];
		$scope.codeTypeOpt = [
			{"id": 0, "label": "非国家编号"},
			{"id": 1, "label": "国家高速编号"},
			{"id": 2, "label": "国道编号"},
			{"id": 3, "label": "省道编号"},
			{"id": 4, "label": "县道编号"},
			{"id": 5, "label": "乡道编号"},
			{"id": 6, "label": "专用道编号"},
			{"id": 7, "label": "省级高速编号"}
		];
		$scope.splitFlagOpt = [
			{"id": 0, "label": "无（默认值）"},
			{"id": 1, "label": "人工拆分"},
			{"id": 2, "label": "程序拆分"}
		];
		$scope.hwInfoFlagOpt = [
			{"id": 0, "label": "是"},
			{"id": 1, "label": "否"}
		];
        /***
         * 弹出编辑面板
         */
        $scope.searchModal = false;
        $scope.openSearchModal = function(type){
       	 	$scope.searchModal = true;
       	 	if("nameGroup" == type) {
	       	 	$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/nameGroupTableCtl.js').then(function () {
	            	$scope.searchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/nameGroupTableTpl.htm';
	            });
       	 	}else if("type" == type) {
	       	 	$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/typeTableCtl.js').then(function () {
	            	$scope.searchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/typeTableTpl.htm';
	            });
       	 	}else if("admin" == type) {
	       	 	$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/adminTableCtl.js').then(function () {
	            	$scope.searchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/adminTableTpl.htm';
	            });
       	 	}else{
       	 		return;
       	 	}
       	 	
       	 	console.log("查询");
        };
        /***
         * 关闭编辑面板
         */
        $scope.closeSearchModal = function() {
        	console.log("关闭")
            $scope.searchModal = false;
        };
    }
]);