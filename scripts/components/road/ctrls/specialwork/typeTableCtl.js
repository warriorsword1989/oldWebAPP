/**
 * Created by mali on 2016/8/17.
 */
angular.module('app').controller("typeTableCtl", ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'appPath', '$interval', 'dsEdit', 'dsMeta',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, appPath, $interval, dsEdit, dsMeta) {
		
		$scope.loadTableDataMsg = '数据加载中...';
		//初始化ng-table表头
		$scope.typeTableCols = [
			  {
				  field: "num_index",
				  title: "序号",
				  width: '35px',
				  show: true
			  },
			  {
				  field: "name",
				  title: "名称",
				  width: '35px',
				  show: true
			  },
			  {
				  field: "py",
				  title: "拼音",
				  width: '35px',
				  show: true
			  },
			  {
				  field: "englishname",
				  title: "英文",
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
		function initTypeTable() {
			$scope.typeTableParams = new NgTableParams({
                page: 1,
                count: 10,
                filter: $scope.filters
            }, {
                counts: [],
                getData: function($defer, params) {
                    var parameter = {
                        pageNum: params.page(),
                        pageSize: params.count(),
                        sortby: params.orderBy().length == 0 ? "" : params.orderBy().join(""),
//                        params: {"name":params.filter().name}
                        name: params.filter().name
                    };
                    dsMeta.nametypeList(parameter).then(function(data) {
                        $scope.loadTableDataMsg = '列表无数据';
                        $scope.typeList = data.data;
                        $scope.typeTableParams.total(data.total);
                        $defer.resolve(data.data);
                    });
                }
            });
        };
        initTypeTable();
        //给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function() {
            $scope.itemActive = -1;
            angular.forEach($scope.typeTableParams.data, function(data, index) {
                data.num_index = ($scope.typeTableParams.page() - 1) * $scope.typeTableParams.count() + index + 1;
            });
        });
	}
]);