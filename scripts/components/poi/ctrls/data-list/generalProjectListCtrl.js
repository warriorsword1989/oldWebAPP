angular.module('app').controller('commonCtrl', ['$scope', 'uibButtonConfig', 'NgTableParams','$timeout','$sce',  function (scope, uibBtnCfg, NgTableParams,$timeout,$sce) {
    var _self = scope;
    uibBtnCfg.activeClass = "btn-success";
    scope.radioModel = 'myProject';
    scope.radio_select = '全局搜索';

    scope.$on("currentProjectList", function(event, data) {
        _self.currentData = data;
        console.log('获取我的项目数据')
        _self.filterData(_self.currentData)
        _self.constructTable();
    })
    scope.$on("hisProjectList", function(event, data) {
        _self.historytData = data;
        console.log('获取历史项目数据')
        _self.filterData(_self.historytData)
        _self.constructTable();
    })
    //给返回数据增加序号索引;
    scope.filterData = function(data){
        for(var i=0;i<data.length;i++){
            data[i].num_index = i+1;
        }
    }
    scope.constructTable = function(){
        scope.$watch('radioModel',function(newValue,oldValue,scope){
                _self.cols = [
                    { field: "num_index", title: "序号", sortable: "num_index", show: true},
                    { field: "projectId", title: "项目编号", sortable: "projectId", show: false},
                    { field: "projectName", title: "项目名称", sortable: "projectName", show: true,getValue:handleProjectName},
                    { field: "projectType", title: "类型	", sortable: "projectType", show: true,getValue:handleProjectType},
                    { field: "projectScheduleCreate", title: "创建时间", sortable: "projectScheduleCreate", show: true},
                    { field: "projectScheduleBegin", title: "开始时间", sortable: "projectScheduleBegin", show: true},
                    { field: "projectScheduleFinish", title: "结束时间", sortable: "projectScheduleFinish", show: true},
                    { field: "projectPhase", title: "状态", sortable: "projectPhase", show: true,getValue:handleProjectPhase},
                    { field: "editSupportId", title: "编辑池", sortable: "editSupportId", show: false}
                ];
                console.log(_self.cols)
                //格式化项目名称
                function handleProjectName($scope,row){
                    var value = row[this.field];
                    value = value.length>20?value.substr(0,20)+'...':value;
                    if(value.length>20){
                        var html = '<a uib-tooltip="Hello, World!" title="row[this.field]" tooltip-trigger="focus" href="./projectInfo.html?access_token='+App.Config.accessToken+'&projectId='+row.projectId+'" target="_blank">'+value+'</a>'
                    }else{
                        var html = '<a uib-tooltip="Hello, World!" tooltip-trigger="focus" href="./projectInfo.html?access_token='+App.Config.accessToken+'&projectId='+row.projectId+'" target="_blank">'+value+'</a>'
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
                        case 1:return '以保存';break;
                        case 2:return '建库中';break;
                        case 3:return '未作业';break;
                        case 4:return '建库失败';break;
                        case 5:return '项目关闭';break;
                        case 6:return '项目延期';break;
                        case 7:return '作业中';break;
                        default: return '未定义';
                    }
                }
                //初始化ng-table;
                if(newValue=='myProject'){
                    console.log('myProject')
                    _self.tableParams = new NgTableParams({page:1,count:15,filter:{'projectName':''}}, {counts: [],paginationMaxBlocks:13,paginationMinBlocks: 2,dataset: _self.currentData});
                }else{
                    console.log('historyProject')
                    _self.tableParams = new NgTableParams({count:10,filter:{'projectName':''}}, {counts: [],paginationMaxBlocks:13,paginationMinBlocks: 2,dataset: _self.historytData});
                }

                var timeout = null;
                scope.$watch('search_text',function(newValue,oldValue,scope){
                    var search_type = '';
                    if(timeout)$timeout.cancel(timeout);
                    if(newValue!=oldValue){
                        console.log('变化')
                        timeout = $timeout(function() {
                            if(scope.radio_select=='全局搜索'){
                                _self.tableParams.filter({$: _self.search_text});
                            }else{
                                var filter = {};
                                switch (scope.radio_select){
                                    case '项目名称':search_type = 'projectName';break;
                                    case '项目类型':search_type = 'projectType';break;
                                    case '项目状态':search_type = 'projectPhase';break;
                                }
                                filter[search_type] = newValue;
                                angular.extend(_self.tableParams.filter(), filter);
                            }
                        }, 300);
                    }

                })
        })
    }


}]);

