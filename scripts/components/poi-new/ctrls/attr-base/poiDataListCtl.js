angular.module('app').controller('PoiDataListCtl', ['$scope', 'NgTableParams','ngTableEventsChannel',  function (scope, NgTableParams,ngTableEventsChannel) {
	var _self = scope;
	_self.items = [
		'The first choice!',
		'And another choice for you.',
		'but wait! A third!'
	];
	//当前表格数据;
	scope.finalData = null;
	//初始化ng-table表头;
	scope.cols = [
		{field: "num_index", title: "序号", show: true},
		{field: "name", title: "名称", sortable: "name", show: true},
		{field: "kindCode", title: "分类", sortable: "kindCode", show: true},
		{field: "uRecord", title: "更新记录", sortable: "uRecord", show: false},
		{field: "collectTime", title: "采集时间", sortable: "collectTime", show: false},
		{field: "pid", title: "PID", sortable: "pid", show: false},
		{field: "geometry", title: "几何", sortable: "geometry", show: false},
		{field: "freshnessVerification", title: "鲜度验证", sortable: "freshnessVerification", show: false}
	];
	//初始化显示表格字段方法;
	scope.initShowField = function(params){
		for(var i=0;i<scope.cols.length;i++){
			for(var j=0;j<params.length;j++){
				if(scope.cols[i].title==params[j]){
					scope.cols[i].show = true;
				}
			}
		}
	}

	//重置表格字段显示方法;
	scope.resetTableField = function(){
		for(var i=0;i<scope.cols.length;i++){
			if(scope.cols[i].show){
				scope.cols[i].show = !scope.cols[i].show;
			}
		}
	}
	//刷新表格方法;
	scope.refreshData = function(){
		_self.tableParams.reload();
	}

	scope.intit = function(){
		_self.tableParams = new NgTableParams({count:10,filter: scope.filters}, {counts:[],getData:function($defer, params){
			var param = {
				dbId: App.Temp.dbId,
				// type: [1,2,3],
				pageNum: params.page(),
				pageSize: params.count()
			};
			scope.$emit("getPoiListData",param);
			_self.tableParams.total(scope.poiListTotal);
			scope.$on('getPoiDataResult',function(event, data){
				return data.rows;
			});
			console.log(scope.poiList)
			return scope.poiList;
		}});
	}

	//给每条数据安排序号;
	ngTableEventsChannel.onAfterReloadData(function(){
		angular.forEach(scope.tableParams.data,function(data,index){
			data.num_index = (scope.tableParams.page()-1)*scope.tableParams.count()+index+1;
		})
	})

	/*选择数据弹出tips*/
	/*self.selectData = function(item,$index){
		var temp = {
			item:item,
			index:$index
		}
		self.$emit('getSelectData',temp);
	}*/
	/*-----------------------------------格式化函数部分----------------------------------*/

	scope.intit();
}]);

