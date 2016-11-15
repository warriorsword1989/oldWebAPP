/**
 * 精编对应的接口文件
 */
angular.module('dataService').service('dsColumn', ['$http', '$q', 'ajax', function ($http, $q, ajax) {
    /**
     * 根据子任务以及一级作业项申请数据
     * @param taskId
     * @param firstWorkItem
     */
    this.applyPoi = function (firstWorkItem, groupId) {
        var defer = $q.defer();
        var params = {
            taskId: App.Temp.dbId,
            firstWorkItem: firstWorkItem,
            groupId: groupId
        };
        ajax.get('editcolumn/poi/deep/applyPoi', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('申请数据出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 根据子任务以及一级作业项申请数据
     * @param taskId
     * @param firstWorkItem
     */
    this.submitData = function (firstWorkItem, secondWorkItem) {
        var defer = $q.defer();
        var params = {
            taskId: App.Temp.dbId,
            firstWorkItem: firstWorkItem,
            secondWorkItem: secondWorkItem || '' // 可以为空
        };
        ajax.get('editcolumn/poi/deep/columnSubmit', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('提交数据出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 查询二级作业项统计信息
     * @param taskId
     * @param firstWorkItem
     */
    this.querySecondWorkStatistics = function (param) {
        var defer = $q.defer();
        var params = {
            taskId: App.Temp.dbId,
            firstWorkItem: param.secondWorkItem,
            taskType: param.taskType
        };
        ajax.get('editcolumn/poi/deep/secondWorkStatistics ', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询统计信息出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /* 作业数据查询(待作业、待提交)*/
    this.queryColumnDataList = function (param) {
        var defer = $q.defer();
        var params = {
            taskId: App.Temp.dbId,
            type: param.type,
            firstWorkItem: param.firstWorkItem,
            secondWorkItem: param.secondWorkItem,
            status: param.status
        };
        ajax.get('editcolumn/poi/deep/columnQuery', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('获取数据列表异常：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);
