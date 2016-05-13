angular.module('app').controller('generalDataListCtrl', ['$scope', 'uibButtonConfig', 'NgTableParams','$timeout','$sce','ngTableEventsChannel',  function (scope, uibBtnCfg, NgTableParams,$timeout,$sce,ngTableEventsChannel) {
    var _self = scope;
    uibBtnCfg.activeClass = "btn-success";
    scope.radioModel = 'workWait';
    scope.radio_select = '状态';

    //切换搜索条件清空输入;
    scope.$watch('radio_select',function(newValue,oldValue,scope){
        scope.search_text = '';
    })
    //动态计算表格列数;
    scope.gitVisibleFieldNum = function(){
        var count = 0;
        if(_self.cols!='undefined'){
            for(var i=0;i<_self.cols.length;i++){
                if(_self.cols[i].show){
                    count+=1;
                }
            }
            return count;
        }
    }
    //scope.constructTable = function(){
        scope.$watch('radioModel',function(newValue,oldValue,scope){
            //初始化ng-table;
            _self.cols = [
                { field: "num_index", title: "序号", sortable: "num_index", show: false},
                { field: "fid", title: "FID", sortable: "fid", show: false},
                { field: "pid", title: "PID", sortable: "pid", show: false},
                { field: "lifecycle", title: "状态", sortable: "lifecycle", show: true,getValue:formatStatus},
                { field: "name", title: "名称", sortable: "name", show: true,getValue:handleName},
                { field: "kindCode", title: "分类	", sortable: "kindCode", show: true, getValue:formatKindCode},
                { field: "auditStatus", title: "审核状态", sortable: "auditStatus", show: true,getValue:formatAuditStatus},
                { field: "checkResultNum", title: "检查错误", sortable: "checkResultNum", show: true},
                { field: "checkResults", title: "错误类型", sortable: "checkResults", show: true,getValue:formatCheckResults},
                { field: "rawFields", title: "标记", sortable: "rawFields", show: false,getValue:formatRawFields},
                { field: "attachments", title: "照片", sortable: "editSupportId", show: false,getValue:formatPhoto},
                { field: "attachments", title: "备注", sortable: "editSupportId", show: false,getValue:formatRemark},
                { field: "evaluateComment", title: "监察问题", sortable: "evaluateComment", show: false,getValue:formatEvaluateComment},
                { field: "quesState", title: "问题状态", sortable: "quesState", show: true,getValue:formatQuesState},
                { field: "fieldDate", title: "采集时间", sortable: "fieldDate", show: true,getValue:formatTime},
                { field: "inputDate", title: "预处理时间", sortable: "inputDate", show: true,getValue:formatTime},
                { field: "freshnessVerification", title: "鲜度验证", sortable: "freshnessVerification", show: true,getValue:formatFreshnessVerification}
            ];
            if(newValue=='workWait'){
                console.log('workWait')
                _self.tableParams = new NgTableParams({page:1,count:15,filter:{'name':''}}, {total:0,counts: [10,15,20],paginationMaxBlocks:13,paginationMinBlocks: 2,getData:function($defer, params){
                    var rawDataParam = {
                        projectId: "2016013086",
                        condition: {handler: "2925", auditStatus: 1},
                        sortby: [["latestMergeDate", -1]],
                        phase: "4",
                        featcode: "poi",
                        type: "snapshot",
                        pagesize: params.count(),
                        pageno:params.page()
                    };
                    scope.$emit("getPageData",rawDataParam);
                    scope.$on('getPageDataResult',function(event, data){
                        _self.tableParams.total(data.total);
                        if(data.data.length){
                            $defer.resolve(data.data);
                        }else{
                            $defer.resolve(null);
                        }
                    });
                }});
            }else if(newValue=='submitWait'){
                _self.tableParams = new NgTableParams({count:10,filter:{'name':''}}, {counts: [10,15,20],paginationMaxBlocks:13,paginationMinBlocks: 2,getData:function($defer, params){
                    var dealedDataParam = {
                        projectId: "2016013086",
                        condition: {handler: "2925", auditStatus: {'$in': [2, 5]}},
                        sortby: [["latestMergeDate", -1]],
                        phase: "4",
                        featcode: "poi",
                        type: "snapshot",
                        pagesize: params.count(),
                        pageno:params.page()
                    };
                    scope.$emit("getPageData",dealedDataParam);
                    scope.$on('getPageDataResult',function(event, data){
                        _self.tableParams.total(data.total);
                        $defer.resolve(data.data);
                    });
                }});

            }else{
                _self.tableParams = new NgTableParams({count:10,filter:{'name':''}}, {counts: [10,15,20],paginationMaxBlocks:13,paginationMinBlocks: 2,getData:function($defer, params){
                    var submitedDataParam = {
                        projectId: "2016013086",
                        condition: {handler: "2925", auditStatus: 0, submitStatus: 1},
                        sortby: [["latestMergeDate", -1]],
                        phase: "4",
                        featcode: "poi",
                        type: "snapshot",
                        pagesize: params.count(),
                        pageno:params.page()
                    };
                    scope.$emit("getPageData",submitedDataParam);
                    scope.$on('getPageDataResult',function(event, data){
                        _self.tableParams.total(data.total);
                        $defer.resolve(data.data);
                    });
                }});
            }

            var timeout = null;
            scope.$watch('search_text',function(newValue,oldValue,scope){
                var search_type = '';
                if(timeout)$timeout.cancel(timeout);
                if(newValue!=oldValue){
                    console.log('变化了')
                    timeout = $timeout(function() {
                        if(scope.radio_select=='全局搜索'){
                            _self.tableParams.filter({$: _self.search_text});
                        }else{
                            var filter = {};
                            switch (scope.radio_select){
                                case 'FID':search_type = 'fid';break;
                                case 'PID':search_type = 'pid';break;
                                case '状态':search_type = 'lifecycle';break;
                                case '名称':search_type = 'name';break;
                                case '分类':search_type = 'kindCode';break;
                                case '审核状态':search_type = 'auditStatus';break;
                                case '检查错误':search_type = 'checkResultNum';break;
                                case '错误类型':search_type = 'checkResults';break;
                                case '标记':search_type = 'rawFields';break;
                                case '照片':search_type = 'attachments';break;
                                case '备注':search_type = 'attachments';break;
                                case '监察问题':search_type = 'evaluateComment';break;
                                case '问题状态':search_type = 'quesState';break;
                                case '采集时间':search_type = 'fieldDate';break;
                                case '预处理时间':search_type = 'inputDate';break;
                                case '鲜度验证':search_type = 'freshnessVerification';break;
                            }
                            filter[search_type] = newValue;
                            angular.extend(_self.tableParams.filter(), filter);
                        }
                    }, 30);
                }

            })
        })
    //}

    /*-----------------------------------公共函数部分----------------------------------*/
    //格式化项目名称
    function handleName($scope,row){
        var value = row[this.field];
        var newvalue = value.length>8?value.substr(0,8)+'...':value;
        if(value.length>8){
            var html = '<a uib-tooltip="Hello, World!" title="'+value+'" tooltip-trigger="mouseover" href="../../apps/poibase/dataList.html?access_token='+App.Config.accessToken+'&projectId='+row.projectId+'" target="_blank">'+newvalue+'</a>'
        }else{
            var html = '<a uib-tooltip="Hello, World!" tooltip-trigger="mouseover" href="../../apps/poibase/dataList.html?access_token='+App.Config.accessToken+'&projectId='+row.projectId+'" target="_blank">'+newvalue+'</a>'
        }
        return $sce.trustAsHtml(html);
    }
    //格式化状态
    function formatStatus($scope,row) {
        var retStr = row.lifecycle;
        switch (retStr) {
            case 0: retStr = '无';break;
            case 1: retStr = '<img src="../../images/poi/icon/lifecycle_del.png" title="删除" />';break;
            case 2: retStr = '<img src="../../images/poi/icon/lifecycle_mod.png" title="更新" />';break;
            case 3: retStr = '<img src="../../images/poi/icon/lifecycle_add.png" title="新增" />';break;
        }
        return $sce.trustAsHtml(retStr);
    }
    // 格式化审核状态显示
    function formatAuditStatus($scope,row) {
        var retStr = row.auditStatus;
        switch (retStr) {
            case 0: retStr = '无';break;
            case 1: retStr = '待审核';break;
            case 2: retStr = '已审核';break;
            case 3: retStr = '审核不通过';break;
            case 4: retStr = '外业验证';break;
            case 5: retStr = '鲜度验证';break;
        }
        return retStr;
    }
    //格式化标记
    function formatRawFields($scope,row) {
        //console.log(value)
        if (row.rawFields) return '是';
        return '否'
    }
    //格式化备注显示
    function formatRemark($scope,row) {
        var remark = "无";
        if (row.attachments && row.attachments.length > 0) {
            for (var i = 0; i < row.attachments.length; i++) {
                if (row.attachments[i].type == 4) {
                    remark = "有";
                    break;
                }
            }
        }
        return remark;
    }
    //格式化鲜度验证显示
    function formatFreshnessVerification($scope,row) {
        return row.freshnessVerification?'是':'否';
    }
    //格式化照片显示
    function formatPhoto($scope,row) {
        var n = 0;
        if (!row.attachments) {
            return 0;
        } else {
            for (var i = 0; i < row.attachments.length; i++) {
                if (row.attachments[i].type == 1) {
                    n = n + 1;
                }
            }
            return n;
        }
    }
    //格式化时间显示
    function formatTime($scope,row) {
        var value = row[this.field]
        if (value) {
            return toTime(value);

        } else {
            return null;
        }
    }
    function toTime(str) {
        var ret;
        if (str.length < 14) {
            ret = str;
        } else { // yyyy-mm-dd hh:mi:ss
            ret = str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2) + " " + str.substr(8, 2) + ":" + str.substr(10, 2) + ":" + str.substr(12, 2);
        }
        return ret;
    }
    //格式化监察问题
    function formatEvaluateComment($scope,row) {
        if (!row[this.field]) {
            return 0;
        } else {
            return row[this.field].length;
        }
    }
    //格式化问题状态
    function formatQuesState($scope,row) {
        var ifConfirm = '已确认';
        var evaluateComment = row[this.field];
        if (evaluateComment && evaluateComment.length > 0) {
            for (var i = 0; i < evaluateComment.length; i++) {
                if (evaluateComment[i].problemStatus != 2) {
                    ifConfirm = '未确认';
                    continue;
                }
            }
        }
        return ifConfirm;
    }
    //格式化错误类型;
    function formatCheckResults($scope,row) {
        var value = row[this.field];
        var ret = "无";
        if (value && value.length > 0) {
            var flag = 0;
            var tmp;
            for (var i = 0; i < value.length; i++) {
                tmp = $scope.checkRuleObj[value[i].errorCode].ruleType;
                if (tmp == 1) {
                    if (flag == 2 || flag == 3) {
                        flag = 3;
                        break;
                    } else {
                        flag = 1;
                    }
                } else if (tmp == 2) {
                    if (flag == 1 || flag == 3) {
                        flag = 3;
                        break;
                    } else {
                        flag = 2;
                    }
                } else if (tmp == 3) {
                    flag = 3;
                    break;
                }
            }
            if (flag == 0) {
                ret = "未分类";
            } else if (flag == 1) {
                ret = "内容错误";
            } else if (flag == 2) {
                ret = "关系错误";
            } else {
                ret = "两者都有";
            }
        }
        return ret;
    }
    // 格式化分类显示
    function formatKindCode($scope,row) {
        var value = row[this.field];
        console.log(value)
        var temp = $scope.checkRuleObj[value];
        if (temp) {
            return temp.kindName;
        } else {
            return value;
        }
    }

}]);

