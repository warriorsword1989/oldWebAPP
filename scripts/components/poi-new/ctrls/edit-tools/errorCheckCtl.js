angular.module('app').controller('ErrorCheckCtl', ['$scope', 'NgTableParams','ngTableEventsChannel','uibButtonConfig','$sce', function($scope, NgTableParams,ngTableEventsChannel,uibBtnCfg,$sce) {

    //初始化ng-table表头;
    $scope.cols = [
        {field: "ruleid", title: "检查规则号", show: true},
        {field: "rank", title: "错误等级", sortable: "rank", show: true},
        {field: "targets", title: "错误对象", sortable: "targets", show: true},
        {field: "information", title: "错误信息", sortable: "information", show: true},
        {field: "geometry", title: "几何信息", sortable: "geometry", show: false},
        {field: "create_date", title: "检查时间", sortable: "create_date", show: false,getValue:getCreateData},
        {field: "worker", title: "作业员", sortable: "pid", show: false},
        {field: "option", title: "检查管理", sortable: "option", show: false,getValue:getOption}
    ];
    //初始化显示表格字段方法;
    /*scope.initShowField = function(params){
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
    }*/
    /***************************** 以上为ngtable ********************************/
    $scope.theadInfo = ['检查规则号','错误等级','错误对象','错误信息','检查时间','作业员','检查管理'];
    //状态
    $scope.initTypeOptions = [
        {"id": 0, "label": " 未修改"},
        {"id": 1, "label": " 例外"},
        {"id": 2, "label": " 确认不修改"},
        {"id": 3, "label": " 确认已修改"}
    ];
    $scope.initType = 0;
    
    //修改状态
    $scope.changeType = function (selectInd, rowid) {
        /*var params = {
            "projectId": Application.projectid,
            "id": rowid,
            "type": selectInd
        };*/
        var params = {
            id:rowid,
            type:selectInd
        }
        $scope.$emit('updateCheckType',params);
        /*Application.functions.updateCheckType(JSON.stringify(params), function (data) {
            if (data.errcode == 0) {
                $scope.$apply();
                $scope.getCheckDateAndCount();
            }
        });*/
    }


    //点击数据在地图上高亮
    $scope.showOnMap = function (targets) {
        var value = targets.replace("[", "");
        var value1 = value.replace("]", "");

        var data = {
            id:value1.split(",")[1],
            type:value1.split(",")[0].replace("_", "")
        };
        //线高亮
        if (data.type == "RDLINK") {
            $scope.$emit('getRdObjectById',data);
        } else if (data.type == "RDRESTRICTION") {//交限高亮
            $scope.$emit('getRdObjectById',data);
        } else {//其他tips高亮
            layerCtrl.pushLayerFront("workPoint");
            Application.functions.getTipsResult(id, function (data) {
                map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);

                var highlightFeatures=[];
                highlightFeatures.push({
                    id:data.rowkey,
                    layerid:'workPoint',
                    type:'workPoint',
                    style:{}
                });
                highRenderCtrl.highLightFeatures = highlightFeatures;
                highRenderCtrl.drawHighlight();
            });
        }
    }


    //监听检查结果并获取
    /*eventController.on(eventController.eventTypes.CHEKCRESULT, function(event){
        $scope.rowCollection=event.errorCheckData;
    });*/
    /************** 数据格式化 **************/
    /*检查时间*/
    function getCreateData($scope,rows){
        return rows;
    }

    function getOption ($scope,rows){
        return rows;
    }
}]);