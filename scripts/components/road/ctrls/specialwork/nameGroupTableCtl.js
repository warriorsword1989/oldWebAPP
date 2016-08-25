/**
 * Created by mali on 2016/8/15.
 */
angular.module('app').controller("nameGroupTableCtl", ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'appPath', '$interval', 'dsEdit', 'dsMeta',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, appPath, $interval, dsEdit, dsMeta) {
		
		$scope.loadTableDataMsg = '数据加载中...';
		//初始化ng-table表头
		$scope.nameGroupTableCols = [
			  {
				  field: "num_index",
				  title: "序号",
				  width: '35px',
				  show: true
			  },
			  {
				  field: "nameId",
				  title: "道路名ID",
				  width: '35px',
				  show: true
			  },
			  {
				  field: "nameGroupid",
				  title: "道路名组ID",
				  width: '35px',
				  show: true
			  },
			  {
				  field: "name",
				  title: "道路名称",
				  width: '35px',
				  show: true
			  },
			  {
				  field: "langCode",
				  title: "语言类型",
				  width: '35px',
				  show: true
			  },
			  {
				  field: "adminId",
				  title: "行政区划",
				  width: '35px',
				  show: true
			  },
			  {
				  field: "adminName",
				  title: "行政区划",
				  width: '35px',
				  show: true
			  }
		 ];
		//表格配置搜索;
        $scope.filters = {
    			name : ""
    	 };
		//初始化ng-table表格
		function initNameGroupTable() {
			$scope.nameGroupTableParams = new NgTableParams({
                page: 1,
                count: 10,
                filter: $scope.filters
            }, {
                counts: [],
                getData: function($defer, params) {
                    var parameter = {
                        subtaskId: parseInt(App.Temp.subTaskId),
                        pageNum: params.page(),
                        pageSize: params.count(),
                        sortby: params.orderBy().length == 0 ? "" : params.orderBy().join(""),
                        params:{"langCode":"CHI","name":params.filter().name}
                    };
                    dsMeta.roadNameList(parameter).then(function(data) {
                        $scope.loadTableDataMsg = '列表无数据';
                        $scope.nameGroupList = data.data;
                        $scope.nameGroupTableParams.total(data.total);
                        $defer.resolve(data.data);
                    });
                }
            });
        };
        initNameGroupTable();
        //给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function() {
            $scope.itemActive = -1;
            angular.forEach($scope.nameGroupTableParams.data, function(data, index) {
                data.num_index = ($scope.nameGroupTableParams.page() - 1) * $scope.nameGroupTableParams.count() + index + 1;
            });
        });
        //向主界面发送当前查询的子界面类型
        $scope.selectVal = function(row, index, type) {
        	$scope.$emit("SUBCTLTYPECHANGE", {flag:$scope.roadNameFlag,data:row});
        };
	}
]);