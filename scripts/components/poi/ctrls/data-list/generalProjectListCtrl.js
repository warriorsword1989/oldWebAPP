angular.module('app').controller('commonCtrl', ['$scope', 'uibButtonConfig', 'NgTableParams','$timeout','$sce',  function (scope, uibBtnCfg, NgTableParams,$timeout,$sce) {
    var _self = scope;
    console.log(scope)
    uibBtnCfg.activeClass = "btn-success";
    scope.radioModel = 'myProject';
    scope.radio_select = '全局搜索';

    scope.$on("currentProjectList", function(event, data) {
        _self.currentData = data;
        console.log('获取数据')
        for(var i=0;i<data.length;i++){
            data[i].num_index = i+1;
        }
        _self.tableParams = new NgTableParams({count:10,filter:{'projectName':''}}, {counts: [],paginationMaxBlocks:13,paginationMinBlocks: 2,dataset: _self.currentData});

        scope.$watch('radioModel',function(newValue,oldValue,scope){
            if(newValue=='myProject'){
                _self.cols = [
                    { field: "num_index", title: "序号", sortable: "num_index", show: true},
                    { field: "projectId", title: "项目编号", sortable: "projectId", show: false},
                    { field: "projectName", title: "项目名称", sortable: "projectName", show: true,getValue:handleProjectName},
                    { field: "projectType", title: "项目类型	", sortable: "projectType", show: true,getValue:handleProjectType},
                    { field: "projectScheduleCreate", title: "创建时间", sortable: "projectScheduleCreate", show: true},
                    { field: "projectScheduleBegin", title: "开始时间", sortable: "projectScheduleBegin", show: true},
                    { field: "projectScheduleFinish", title: "结束时间", sortable: "projectScheduleFinish", show: true},
                    { field: "projectPhase", title: "状态", sortable: "projectPhase", show: true,getValue:handleProjectPhase},
                    { field: "editSupportId", title: "编辑池", sortable: "editSupportId", show: false}
                ];
                //格式化项目名称
                function handleProjectName($scope,row){
                    var value = row[this.field];
                    var html = "<a href='../../apps/poibase/dataList.html?q=" + value + "' target='_blank'>" + value + "</a>";
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

                console.log(scope.radio_select)
                //初始化ng-table;

                //_self.tableParams = new NgTableParams({count:10,filter:{'projectName':''}}, {counts: [],paginationMaxBlocks:13,paginationMinBlocks: 2,dataset: _self.currentData});
                var timeout = null;
                scope.$watch('search_text',function(newValue,oldValue,scope){
                    console.log('变化')
                    var search_type = '';
                    if(timeout)$timeout.cancel(timeout);
                    if(newValue!=oldValue){
                        timeout = $timeout(function() {
                            if(scope.radio_select=='全局搜索'){
                                _self.tableParams.filter({$: _self.search_text});
                            }else{
                                var filter = {};
                                switch (scope.radio_select){
                                    case '项目名称':
                                        search_type = 'projectName';
                                        break;
                                    case '项目类型':
                                        search_type = 'projectType';
                                        break;
                                    case '项目状态':
                                        search_type = 'projectPhase';
                                        break;

                                }
                                filter[search_type] = newValue;
                                angular.extend(_self.tableParams.filter(), filter);
                            }
                        }, 500);
                    }

                })

            }else if(newValue=='historyProject'){
                console.log("初始化表2")
                var data = [{ name: '凌龍', age: 21 }, { name: '卡卡', age: 88 }];
                _self.cols = [
                    { field: "name", title: "姓名", filter: { name: "text" }, show: true },
                    { field: "age", title: "年龄", filter: { age: "number" }, show: true }
                ];
                //_self.tableParams = new NgTableParams({count: 1}, {dataset: data});
            }else{
                return false
            }
        })
    })



}]);

