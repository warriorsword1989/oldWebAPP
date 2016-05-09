angular.module('app').controller('commonCtrl', ['$scope', 'uibButtonConfig', 'NgTableParams','$timeout',  function (scope, uibBtnCfg, NgTableParams,$timeout) {
    var _self = scope;
    console.log(scope)
    uibBtnCfg.activeClass = "btn-success";
    scope.radioModel = 'myProject';
    scope.radio_select = '全局搜索';

    scope.$on("currentProjectList", function(event, data) {
        _self.currentData = data;
        for(var i=0;i<data.length;i++){
            data[i].num_index = i+1;
        }
        console.log(data)
        scope.$watch('radioModel',function(newValue,oldValue,scope){
            if(newValue=='myProject'){
                _self.cols = [
                    { field: "num", title: "序号", sortable: "num", show: false},
                    { field: "projectId", title: "项目编号", sortable: "projectId", show: false},
                    { field: "projectName", title: "项目名称", sortable: "projectName", show: true},
                    { field: "projectType", title: "项目类型	", sortable: "projectType", show: true },
                    { field: "projectScheduleCreate", title: "创建时间", show: true },
                    { field: "projectScheduleBegin", title: "开始时间", show: true },
                    { field: "projectScheduleFinish", title: "结束时间", show: true },
                    { field: "projectPhase", title: "状态", show: true },
                    { field: "editSupportId", title: "编辑池", show: true },
                ];
                console.log(scope.radio_select)
                //初始化ng-table;

                _self.tableParams = new NgTableParams({count:10,filter:{'projectName':''}}, {counts: [],paginationMaxBlocks:13,paginationMinBlocks: 2,dataset: _self.currentData});
                var timeout = null;
                scope.$watch('search_text',function(newValue,oldValue,scope){
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

