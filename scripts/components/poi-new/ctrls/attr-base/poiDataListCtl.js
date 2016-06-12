angular.module('app').controller('PoiDataListCtl', ['$scope', 'NgTableParams','ngTableEventsChannel','uibButtonConfig','$sce',  function (scope, NgTableParams,ngTableEventsChannel,uibBtnCfg,$sce) {
	var _self = scope;
	uibBtnCfg.activeClass = "btn-success";
	scope.radio_select = '全局';
	//当前表格数据;
	scope.finalData = null;
	//初始化ng-table表头;
	scope.cols = [
		{field: "num_index", title: "序号", show: true},
		{field: "name", title: "名称", sortable: "name", show: true},
		{field: "kindCode", title: "分类", sortable: "kindCode", show: true},
		{field: "uRecord", title: "更新记录", sortable: "uRecord", show: false},
		{field: "collectTime", title: "采集时间", sortable: "collectTime", show: false,getValue:getCollectTime},
		{field: "pid", title: "PID", sortable: "pid", show: false},
		// {field: "geometry", title: "几何", sortable: "geometry", show: false},
		{field: "freshnessVefication", title: "鲜度验证", sortable: "freshnessVefication", show: false,getValue:getFreshnessVefication}
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
	//表格配置搜索;
	scope.filters = {
		value:''
	};
	//切换搜索条件清空输入;
	scope.$watch('radio_select',function(newValue,oldValue,scope){
		scope.filters.value = '';
	})
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
				$defer.resolve(data.rows);
			});
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
	/*采集时间*/
	function getCollectTime(scope,row){
		return $sce.trustAsHtml(App.Util.dateFormat(row.collectTime));
	}
	/*新鲜度验证*/
	function getFreshnessVefication(scope,row){
		return $sce.trustAsHtml(row.freshnessVefication==0?'否':'是');
	}
}]);

