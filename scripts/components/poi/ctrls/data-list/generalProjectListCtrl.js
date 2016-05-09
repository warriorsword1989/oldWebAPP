angular.module('app').controller('commonCtrl', ['$scope', 'uibButtonConfig', 'NgTableParams','$timeout',  function (scope, uibBtnCfg, NgTableParams,$timeout) {
    var _self = scope;
    console.log(scope)
    uibBtnCfg.activeClass = "btn-success";
    scope.radioModel = 'myProject';
    scope.radio_select = '全局搜索';

    scope.ctrl_cols=function(obj){
        obj.item.show = !obj.item.show;
    }

    scope.$watch('radioModel',function(newValue,oldValue,scope){
        if(newValue=='myProject'){
            var data = [{"projectType": 1, "projectManagerId": 4589, "deep": null, "editSupportId": "2015062391", "projectPhase": 3, "projectScheduleFinish": "2015-12-30 00:00:00", "projectScheduleCreate": "2016-02-17 08:52:58", "workVersion": "15冬", "projectDbTotal": null, "projectFinishCount": null, "projectActualFinish": null, "quality": null, "projectId": 2016013086, "projectActualBegin": "2016-02-17 08:52:58", "regionCode": "010", "telLength": "12", "projectCode": "", "scheduleOrder": null, "projectPlanningCount": 228350, "projectConfig": "{\"project_alias\": \"15Win-NI-069\", \"region\": 1, \"regionCode\": \"010\", \"pedestrianNavEnable\": 0, \"block_match_id\": \"12370\", \"telLength\": \"12\"}", "projectName": "15冬-北京市-北京市-城区-城区(POI)-更新", "scheduleSwitch": 0, "releaseSequence": "第二批", "outdoorLeader": 1834, "projectManagerName": "程雪峰", "columnAssign": 0, "planningId": 2111110082, "projectFeatcode": "poi", "refProjectId": null, "productCycle": 1, "indoorLeader": 2797, "projectScheduleBegin": "2015-08-05 00:00:00"}, {"projectType": 1, "projectManagerId": 4589, "deep": null, "editSupportId": "2015062381", "projectPhase": 3, "projectScheduleFinish": "2015-12-30 00:00:00", "projectScheduleCreate": "2016-02-02 13:43:30", "workVersion": "15冬", "projectDbTotal": null, "projectFinishCount": null, "projectActualFinish": null, "quality": null, "projectId": 2016013075, "projectActualBegin": "2016-02-02 13:43:30", "regionCode": "010", "telLength": "12", "projectCode": "", "scheduleOrder": null, "projectPlanningCount": 217686, "projectConfig": "{\"project_alias\": \"15Win-NI-069\", \"region\": 1, \"regionCode\": \"010\", \"pedestrianNavEnable\": 0, \"block_match_id\": \"12370\", \"telLength\": \"12\"}", "projectName": "15冬-北京市-北京市-城区-城区(POI)-更新", "scheduleSwitch": 0, "releaseSequence": "第二批", "outdoorLeader": 1834, "projectManagerName": "程雪峰", "columnAssign": 0, "planningId": 2111110074, "projectFeatcode": "poi", "refProjectId": null, "productCycle": 1, "indoorLeader": 2797, "projectScheduleBegin": "2015-08-05 00:00:00"}, {"projectType": 1, "projectManagerId": 2797, "deep": null, "editSupportId": "2015062380", "projectPhase": 3, "projectScheduleFinish": "2015-09-17 00:00:00", "projectScheduleCreate": "2016-02-02 13:29:47", "workVersion": "15冬", "projectDbTotal": null, "projectFinishCount": null, "projectActualFinish": null, "quality": null, "projectId": 2016013073, "projectActualBegin": "2016-02-02 13:29:47", "regionCode": "010", "telLength": "12", "projectCode": "", "scheduleOrder": null, "projectPlanningCount": 7055, "projectConfig": "{\"project_alias\": \"15Win-NI-065\", \"region\": 1, \"regionCode\": \"010\", \"pedestrianNavEnable\": 0, \"block_match_id\": \"12366\", \"telLength\": \"12\"}", "projectName": "15冬-北京市-北京市-门头沟区-郊区-郊区详细化(POI)-更新", "scheduleSwitch": 0, "releaseSequence": "第二批", "outdoorLeader": 1834, "projectManagerName": "徐灵芸", "columnAssign": 0, "planningId": 2111110055, "projectFeatcode": "poi", "refProjectId": null, "productCycle": 1, "indoorLeader": 1834, "projectScheduleBegin": "2015-08-05 00:00:00"}, {"projectType": 1, "projectManagerId": 2797, "deep": null, "editSupportId": "2015062386", "projectPhase": 3, "projectScheduleFinish": "2015-09-17 00:00:00", "projectScheduleCreate": "2016-01-27 11:23:58", "workVersion": "15冬", "projectDbTotal": null, "projectFinishCount": null, "projectActualFinish": null, "quality": null, "projectId": 2016012959, "projectActualBegin": "2016-01-27 11:23:58", "regionCode": "010", "telLength": "12", "projectCode": "", "scheduleOrder": null, "projectPlanningCount": 100000, "projectConfig": "{\"project_alias\": \"15Win-NI-065\", \"region\": 1, \"regionCode\": \"010\", \"pedestrianNavEnable\": 0, \"block_match_id\": \"12366\", \"telLength\": \"12\"}", "projectName": "展开项目测试10W", "scheduleSwitch": 0, "releaseSequence": null, "outdoorLeader": 1834, "projectManagerName": "徐灵芸", "columnAssign": 0, "planningId": 1234620003, "projectFeatcode": "poi", "refProjectId": null, "productCycle": 1, "indoorLeader": 1834, "projectScheduleBegin": "2015-08-05 00:00:00"}, {"projectType": 1, "projectManagerId": 2797, "deep": null, "editSupportId": "2015062384", "projectPhase": 3, "projectScheduleFinish": "2015-09-17 00:00:00", "projectScheduleCreate": "2016-01-26 16:48:56", "workVersion": "15冬", "projectDbTotal": null, "projectFinishCount": null, "projectActualFinish": null, "quality": null, "projectId": 2016012957, "projectActualBegin": "2016-01-26 16:48:56", "regionCode": "010", "telLength": "12", "projectCode": "", "scheduleOrder": null, "projectPlanningCount": 19820, "projectConfig": "{\"project_alias\": \"15Win-NI-065\", \"region\": 1, \"regionCode\": \"010\", \"pedestrianNavEnable\": 0, \"block_match_id\": \"12366\", \"telLength\": \"12\"}", "projectName": "展开项目测试2W", "scheduleSwitch": 0, "releaseSequence": null, "outdoorLeader": 1834, "projectManagerName": "徐灵芸", "columnAssign": 0, "planningId": 1234621002, "projectFeatcode": "poi", "refProjectId": null, "productCycle": 1, "indoorLeader": 1834, "projectScheduleBegin": "2015-08-05 00:00:00"}, {"projectType": 1, "projectManagerId": 9988888, "deep": null, "editSupportId": "2015062336", "projectPhase": 3, "projectScheduleFinish": "2015-09-17 00:00:00", "projectScheduleCreate": "2016-01-26 15:33:31", "workVersion": "15冬", "projectDbTotal": null, "projectFinishCount": null, "projectActualFinish": null, "quality": null, "projectId": 2016012955, "projectActualBegin": "2016-01-26 15:33:31", "regionCode": "010", "telLength": "12", "projectCode": "", "scheduleOrder": null, "projectPlanningCount": 6284, "projectConfig": "{\"project_alias\": \"15Win-NI-068\", \"region\": 1, \"regionCode\": \"010\", \"pedestrianNavEnable\": 0, \"block_match_id\": \"12369\", \"telLength\": \"12\"}", "projectName": "15冬-北京市-北京市-延庆县-郊区-郊区详细化(POI)-更新", "scheduleSwitch": 0, "releaseSequence": "第二批", "outdoorLeader": 1834, "projectManagerName": "王君", "columnAssign": 0, "planningId": 2111110061, "projectFeatcode": "poi", "refProjectId": null, "productCycle": 1, "indoorLeader": 9988888, "projectScheduleBegin": "2015-08-05 00:00:00"}, {"projectType": 1, "projectManagerId": 2797, "deep": null, "editSupportId": "2015062389", "projectPhase": 7, "projectScheduleFinish": "2015-09-17 00:00:00", "projectScheduleCreate": "2016-01-25 18:46:54", "workVersion": "15冬", "projectDbTotal": null, "projectFinishCount": null, "projectActualFinish": null, "quality": null, "projectId": 2016012843, "projectActualBegin": "2016-01-25 18:46:54", "regionCode": "010", "telLength": "12", "projectCode": "", "scheduleOrder": null, "projectPlanningCount": 1000000, "projectConfig": "{\"project_alias\": \"15Win-NI-065\", \"region\": 1, \"regionCode\": \"010\", \"pedestrianNavEnable\": 0, \"block_match_id\": \"12366\", \"telLength\": \"12\"}", "projectName": "展开项目测试100W", "scheduleSwitch": 0, "releaseSequence": null, "outdoorLeader": 1834, "projectManagerName": "徐灵芸", "columnAssign": 0, "planningId": 1234620007, "projectFeatcode": "poi", "refProjectId": null, "productCycle": 1, "indoorLeader": 1834, "projectScheduleBegin": "2015-08-05 00:00:00"}, {"projectType": 1, "projectManagerId": 4589, "deep": null, "editSupportId": "2015062388", "projectPhase": 7, "projectScheduleFinish": "2015-09-17 00:00:00", "projectScheduleCreate": "2016-01-23 17:43:45", "workVersion": "15冬", "projectDbTotal": null, "projectFinishCount": null, "projectActualFinish": null, "quality": null, "projectId": 2016012723, "projectActualBegin": "2016-01-23 17:43:45", "regionCode": "010", "telLength": "12", "projectCode": "", "scheduleOrder": null, "projectPlanningCount": 500000, "projectConfig": "{\"project_alias\": \"15Win-NI-065\", \"region\": 1, \"regionCode\": \"010\", \"pedestrianNavEnable\": 0, \"block_match_id\": \"12366\", \"telLength\": \"12\"}", "projectName": "展开项目测试50W", "scheduleSwitch": 0, "releaseSequence": null, "outdoorLeader": 1834, "projectManagerName": "程雪峰", "columnAssign": 0, "planningId": 1234620005, "projectFeatcode": "poi", "refProjectId": null, "productCycle": 1, "indoorLeader": 4589, "projectScheduleBegin": "2015-08-05 00:00:00"}, {"projectType": 1, "projectManagerId": 4589, "deep": null, "editSupportId": "2015062076", "projectPhase": 7, "projectScheduleFinish": "2015-10-18 00:00:00", "projectScheduleCreate": "2016-01-18 14:34:22", "workVersion": "15冬", "projectDbTotal": null, "projectFinishCount": null, "projectActualFinish": null, "quality": null, "projectId": 2015111377, "projectActualBegin": "2016-01-18 14:34:22", "regionCode": "0755", "telLength": "13", "projectCode": "", "scheduleOrder": null, "projectPlanningCount": 25618, "projectConfig": "{\"project_alias\": \"15Win-NI-042\", \"region\": 1, \"regionCode\": \"0755\", \"pedestrianNavEnable\": 0, \"block_match_id\": \"12941\", \"telLength\": \"13\"}", "projectName": "15冬-广东省-深圳市-城区-南山区-城区(POI)-更新", "scheduleSwitch": 0, "releaseSequence": "第二批", "outdoorLeader": 1834, "projectManagerName": "程雪峰", "columnAssign": 0, "planningId": 1234618613, "projectFeatcode": "poi", "refProjectId": null, "productCycle": 1, "indoorLeader": 4589, "projectScheduleBegin": "2015-09-18 00:00:00"}, {"projectType": 1, "projectManagerId": 2797, "deep": null, "editSupportId": "2015062068", "projectPhase": 7, "projectScheduleFinish": "2015-09-17 00:00:00", "projectScheduleCreate": "2016-01-16 12:33:00", "workVersion": "15冬", "projectDbTotal": null, "projectFinishCount": null, "projectActualFinish": null, "quality": null, "projectId": 2015111347, "projectActualBegin": "2016-01-16 12:33:00", "regionCode": "00852", "telLength": "14", "projectCode": "", "scheduleOrder": null, "projectPlanningCount": 222217, "projectConfig": "{\"project_alias\": \"15Win-TGY-003\", \"region\": 2, \"regionCode\": \"00852\", \"pedestrianNavEnable\": 0, \"block_match_id\": \"13648\", \"telLength\": \"14\"}", "projectName": "15冬-香港特別行政區-香港特别行政區-全境-全境(POI)-更新测评", "scheduleSwitch": 0, "releaseSequence": "第二批", "outdoorLeader": 1834, "projectManagerName": "徐灵芸", "columnAssign": 0, "planningId": 1234618604, "projectFeatcode": "poi", "refProjectId": null, "productCycle": 1, "indoorLeader": 2797, "projectScheduleBegin": "2015-08-05 00:00:00"}, {"projectType": 1, "projectManagerId": 4377, "deep": null, "editSupportId": "2015062045", "projectPhase": 3, "projectScheduleFinish": "2015-09-17 00:00:00", "projectScheduleCreate": "2016-01-12 10:22:47", "workVersion": "15冬", "projectDbTotal": null, "projectFinishCount": null, "projectActualFinish": null, "quality": null, "projectId": 2015111261, "projectActualBegin": "2016-01-12 10:22:47", "regionCode": "010", "telLength": "12", "projectCode": "", "scheduleOrder": null, "projectPlanningCount": 8278, "projectConfig": "{\"project_alias\": \"15Win-NI-063\", \"region\": 1, \"regionCode\": \"010\", \"pedestrianNavEnable\": 0, \"block_match_id\": \"12364\", \"telLength\": \"12\"}", "projectName": "15冬-北京市-北京市-大兴区-城区-郊区详细化(POI)-更新", "scheduleSwitch": 0, "releaseSequence": "第二批", "outdoorLeader": 1834, "projectManagerName": "邰高阳", "columnAssign": 0, "planningId": 1234618569, "projectFeatcode": "poi", "refProjectId": null, "productCycle": 1, "indoorLeader": 4589, "projectScheduleBegin": "2015-08-05 00:00:00"}];
            for(var i=1;i<=data.length;i++){
                //data[i]['num'] = i;
                //data[i]['num']=i
            }

            _self.cols = [
                { field: "num", title: "序号", sortable: "num", show: true},
                { field: "projectId", title: "项目编号", sortable: "projectId", show: true},
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
            _self.tableParams = new NgTableParams({count:5,filter:{'projectName':''}}, {counts: [],paginationMaxBlocks:13,paginationMinBlocks: 2,dataset: data});
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

}]);

