/**
 * Created by mali on 2016/8/17.
 */
angular.module('app').controller("adminTableCtl", ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'appPath', '$interval', 'dsEdit', 'dsMeta',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, appPath, $interval, dsEdit, dsMeta) {
		
		$scope.loadTableDataMsg = '数据加载中...';
		//初始化ng-table表头
		$scope.adminTableCols = [
			  {
				  field: "num_index",
				  title: "序号",
				  width: '35px',
				  show: true
			  },
			  {
				  field: "adminareacode",
				  title: "行政区划代码",
				  width: '35px',
				  show: true
			  },
			  {
				  field: "whole",
				  title: "行政区划名称",
				  width: '35px',
				  show: true
			  }
		 ];
		//表格配置搜索;
        $scope.filters = {
    			name : "",
    			langCode : "",
    	 };
		//初始化ng-table表格
		function initAdminTable() {
			$scope.adminTableParams = new NgTableParams({
                page: 1,
                count: 20,
                filter: $scope.filters
            }, {
                counts: [],
                getData: function($defer, params) {
                    var parameter = {
                        pageNum: params.page(),
                        pageSize: params.count(),
                        sortby: params.orderBy().length == 0 ? "" : params.orderBy().join("")
                    };
                    dsMeta.adminareaList(parameter).then(function(data) {
                        $scope.loadTableDataMsg = '列表无数据';
                        $scope.adminList = data.data;
                        $scope.adminTableParams.total(data.total);
                        $defer.resolve(data.data);
                    });
                }
            });
        };
        initAdminTable();
        //给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function() {
            $scope.itemActive = -1;
            angular.forEach($scope.adminTableParams.data, function(data, index) {
                data.num_index = ($scope.adminTableParams.page() - 1) * $scope.adminTableParams.count() + index + 1;
            });
        });
	}
]);