/**
 * 精编对应的接口文件
 */
angular.module("dataService").service("dsColumn", ["$http", "$q", "ajax", function($http, $q, ajax) {
    /**
     * 根据子任务以及一级作业项申请数据
     * @param taskId
     * @param firstWorkItem
     */
    this.applyPoi = function(taskId, firstWorkItem) {
        var defer = $q.defer();
        var params = {
            "taskId": taskId,
            "firstWorkItem": firstWorkItem
        };
        ajax.get("edit/poi/deep/applyPoi", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal("申请数据出错：", data.errmsg, "error");
                defer.resolve(null);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 根据子任务以及一级作业项申请数据
     * @param taskId
     * @param firstWorkItem
     */
    this.submitData = function(taskId, firstWorkItem) {
        var defer = $q.defer();
        var params = {
            "taskId": taskId,
            "firstWorkItem": firstWorkItem
        };
        ajax.get("edit/poi/deep/applyPoi", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal("申请数据出错：", data.errmsg, "error");
                defer.resolve(null);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };



}]);