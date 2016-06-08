angular.module('app').controller('PoiDataListCtl', ['$scope', 'NgTableParams', 'ngTableEventsChannel', function ($scope, NgTableParams, ngTableEventsChannel) {
	initData();
	function initData() {
		console.log($scope.poiList)
		// $scope.tableParams = new NgTableParams({count: 10, dataset: $scope.poiList});
		$scope.tableParams = new NgTableParams({page:1,count:10}, {getData:function($defer, params){
			scope.initShowField(['序号','项目名称','类型','创建时间','开始时间','结束时间','状态']);
			var currparam = {
				from: "app",
				projectStatus: [3, 6, 7],
				projectType: [1, 3],
				pageno: params.page(),
				pagesize: params.count(),
				snapshot: "snapshot",
				orderFeild:scope.constructSortParams(params),
				projectName:params.filter().value
			};
			scope.$emit("getPageData",currparam);
			scope.$on('getPageDataResult',function(event, data){
				$scope.tableParams.total(data.total);
				$defer.resolve($scope.filterData(data.rows,params.page(),params.count()));
			});
		}});
	}

	//初始化ng-table表头;
	$scope.cols = [
		{field: "num_index", title: "序号", show: true},
		{field: "name", title: "名称", sortable: "name", show: true},
		{field: "kindCode", title: "分类", sortable: "kindCode", show: true},
		{field: "uRecord", title: "更新记录", sortable: "uRecord", show: true},
		{field: "collectTime", title: "采集时间", sortable: "collectTime", show: false, getValue: formatCollectDate},
		{field: "pid", title: "PID", sortable: "pid", show: false},
		{field: "geometry", title: "几何", sortable: "geometry", show: false, getValue: formatGeometry},
		{field: "freshnessVerification", title: "鲜度验证", sortable: "freshnessVerification", show: false}
	];
	//初始化显示表格字段方法;
	$scope.initShowField = function (params) {
		for (var i = 0; i < $scope.cols.length; i++) {
			for (var j = 0; j < params.length; j++) {
				if ($scope.cols[i].title == params[j]) {
					$scope.cols[i].show = true;
				}
			}
		}
	}
	//重置表格字段显示方法;
	$scope.resetTableField = function () {
		for (var i = 0; i < $scope.cols.length; i++) {
			if ($scope.cols[i].show) {
				$scope.cols[i].show = !$scope.cols[i].show;
			}
		}
	}
	//给每条数据安排序号;
	ngTableEventsChannel.onAfterReloadData(function () {
		console.log($scope.tableParams.page())
		angular.forEach($scope.tableParams.data, function (data, index) {
			data.num_index = ($scope.tableParams.page() - 1) * $scope.tableParams.count() + index + 1;
		})
	});
	/*日期格式化*/
	function formatCollectDate($scope, row) {
		return row.formatBatchDate;
	}

	/*几何格式化*/
	function formatGeometry($scope, row) {
		return row.geometry;
	}
}]);