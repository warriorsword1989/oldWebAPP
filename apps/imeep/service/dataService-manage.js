angular.module("dataService").service("mPoi", ["$http", "$q", "ajax", function($http, $q, ajax) {
    //根据用户名查找子任务列表;
    this.querySubtaskByUser = function(paramObj) {
        var defer = $q.defer();
        ajax.get("man/subtask/listByUser", {
            parameter: JSON.stringify(paramObj)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data.result);
            } else {
                defer.resolve("查询子任务列表出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    }
}]);