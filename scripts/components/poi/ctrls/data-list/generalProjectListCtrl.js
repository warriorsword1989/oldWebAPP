angular.module('app').controller('commonCtrl', ['$scope', 'uibButtonConfig', 'NgTableParams','$timeout','$sce',  function (scope, uibBtnCfg, NgTableParams,$timeout,$sce) {
    var _self = scope;
    uibBtnCfg.activeClass = "btn-success";
    scope.radioModel = 'myProject';
    scope.radio_select = '全局搜索';
    scope.cols = [
        { field: "num_index", title: "序号", show: false},
        { field: "projectId", title: "项目编号", sortable: "projectId", show: false},
        { field: "projectName", title: "项目名称", sortable: "projectName", show: false,getValue:handleProjectName},
        { field: "projectType", title: "类型	", sortable: "projectType", show: false,getValue:handleProjectType},
        { field: "projectScheduleCreate", title: "创建时间", sortable: "projectScheduleCreate", show: false},
        { field: "projectScheduleBegin", title: "开始时间", sortable: "projectScheduleBegin", show: false},
        { field: "projectScheduleFinish", title: "结束时间", sortable: "projectScheduleFinish", show: false},
        { field: "projectPhase", title: "状态", sortable: "projectPhase", show: false,getValue:handleProjectPhase},
        { field: "editSupportId", title: "编辑池", sortable: "editSupportId", show: false}
    ];
    //表格配置搜索;
    scope.filters = {
        value:''
    };

    //切换搜索条件清空输入;
    scope.$watch('radio_select',function(newValue,oldValue,scope){
        scope.filters.value = '';
    })

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

    //给返回数据增加序号索引;
    scope.filterData = function(data,page,count){
        for(var i=0;i<data.length;i++){
            data[i].num_index = (page-1)*count+1+i;
        }
        return data
    }

    //刷新表格方法;
    scope.refreshData = function(){
        console.log("刷新表格")
        console.log(_self.tableParams)
    }

    //构造排序参数;
    scope.constructSortParams = function(params){
        var search_obj = params.sorting();
        var temp=[];
        angular.forEach(search_obj,function(data,index){
            if(data=='asc'){
                temp[0]=index;
            }else{
                temp[0]='-'+index;
            }
        })
        return temp;
    }

    scope.$watch('radioModel',function(newValue,oldValue,scope){
        //初始化ng-table;
        if(newValue=='myProject'){
            console.log('myProject')
            _self.tableParams = new NgTableParams({page:1,count:15,filter: scope.filters}, {counts: [10,15,20],getData:function($defer, params){
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
                    _self.tableParams.total(data.total);
                    $defer.resolve(scope.filterData(data.rows,params.page(),params.count()));
                });
            }});
        }else{
            console.log('historyProject')
            _self.tableParams = new NgTableParams({count:10,filter: scope.filters}, {counts: [10,15,20],getData:function($defer, params){
                scope.initShowField(['序号','项目名称','类型','创建时间','开始时间','结束时间','状态']);
                var hisparam = {
                    from: "app",
                    projectStatus: [5],
                    projectType: [1, 3],
                    pageno: params.page(),
                    pagesize: params.count(),
                    snapshot: "snapshot",
                    orderFeild:scope.constructSortParams(params),
                    projectName:params.filter().value
                };
                scope.$emit("getPageData",hisparam);
                scope.$on('getPageDataResult',function(event, data){
                    _self.tableParams.total(data.total);
                    $defer.resolve(scope.filterData(data.rows,params.page(),params.count()));
                });
            }});
        }
    },false)


    //格式化项目名称
    function handleProjectName($scope,row){
        var value = row[this.field];
        var newvalue = value.length>20?value.substr(0,20)+'...':value;
        if(value.length>20){
            var html = '<a uib-tooltip="Hello, World!" title="'+value+'" tooltip-trigger="mouseover" href="../../apps/poibase/dataList.html?access_token='+App.Config.accessToken+'&projectId='+row.projectId+'" target="_blank">'+newvalue+'</a>'
        }else{
            var html = '<a uib-tooltip="Hello, World!" tooltip-trigger="mouseover" href="../../apps/poibase/dataList.html?access_token='+App.Config.accessToken+'&projectId='+row.projectId+'" target="_blank">'+newvalue+'</a>'
        }
        return $sce.trustAsHtml(html);
    }
    //格式化项目类型
    function handleProjectType($scope,row){
        return row.projectType==1?'常规':'监察';
    }
    //格式化项目状态
    function handleProjectPhase($scope,row){
        switch (parseInt(row.projectPhase)){
            case 1:return $sce.trustAsHtml('<span style="padding: .2em .4em .2em;" class="label label-success">以保存</span>');break;
            case 2:return $sce.trustAsHtml('<span style="padding: .2em .4em .2em;" class="label label-info">建库中</span>');break;
            case 3:return $sce.trustAsHtml('<span style="padding: .2em .4em .2em;" class="label label-primary">未作业</span>');break;
            case 4:return $sce.trustAsHtml('<span style="padding: .2em .4em .2em;" class="label label-danger">建库失败</span>');break;
            case 5:return $sce.trustAsHtml('<span style="padding: .2em .4em .2em;" class="label label-default">项目关闭</span>');break;
            case 6:return $sce.trustAsHtml('<span style="padding: .2em .4em .2em;" class="label label-warning">项目延期</span>');break;
            case 7:return $sce.trustAsHtml('<span style="padding: .2em .4em .2em;" class="label label-success">作业中</span>');break;
            default: return '未定义';
        }
    }
}]);

