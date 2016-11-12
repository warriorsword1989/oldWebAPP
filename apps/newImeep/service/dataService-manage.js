angular.module("dataService").service("dsManage", ["$http", "$q", "ajax", function($http, $q, ajax) {
    //根据用户名查找子任务列表;
    this.login = function(userName, passwd) {
        var defer = $q.defer();
        ajax.get("man/userInfo/login/", {
            parameter: {
                "userNickName": userName,
                "userPassword": passwd
            }
        }).success(function(data) {
            if (data.errcode == 0) {
                if (data.data.access_token) { // 登陆成功
                    defer.resolve(data.data);
                } else { // 用户名或密码错误
                    defer.resolve(data.errmsg);
                }
            } else {
                //swal("登陆出错", data.errmsg, "error");
                defer.resolve(data.errmsg);
            }
        }).error(function(rejection) {
            ajax.error(defer, rejection);
        });
        return defer.promise;
    };
    //根据用户名查找子任务列表;
    this.getSubtaskListByUser = function(paramObj) {
        var defer = $q.defer();
        ajax.get("man/subtask/listByUser", {
            parameter: JSON.stringify(paramObj)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data.result || []);
            } else if (data.errcode == -100) {
                ajax.tokenExpired();
            } else {
                swal("查询子任务列表出错", data.errmsg, "error");
                defer.resolve([]);
            }
        }).error(function(rejection) {
            ajax.error(defer, rejection);
        });
        return defer.promise;
    };
    //根据子任务Id查找子任务概要信息;
    this.getSubtaskSummaryById = function(paramObj) {
        var defer = $q.defer();
        ajax.get("man/statics/subtask/query", {
            parameter: JSON.stringify({
                "subtaskId": paramObj
            })
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else if (data.errcode == -100) {
                ajax.tokenExpired();
            } else {
                swal("查询子任务统计信息出错", data.errmsg, "error");
                defer.resolve([]);
            }
        }).error(function(rejection) {
            ajax.error(defer, rejection);
        });
        return defer.promise;
    };
    //根据用户名查找子任务列表;
    this.getSubtaskById = function(subtaskId) {
        var defer = $q.defer();
        ajax.get("man/subtask/query/", {
            parameter: JSON.stringify({
                "subtaskId": subtaskId
            })
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else if (data.errcode == -100) {
                ajax.tokenExpired(defer);
            } else {
                swal("查询子任务信息出错", data.errmsg, "error");
                defer.resolve(null);
            }
        }).error(function(rejection) {
            ajax.error(defer, rejection);
        });
        return defer.promise;
    },

    //提交子任务方法；；
    this.submitTask = function(subtaskId) {
        var defer = $q.defer();
        ajax.get("edit/road/base/release/", {
            parameter: JSON.stringify({
                "subtaskId": subtaskId
            })
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else if (data.errcode == -100) {
                ajax.tokenExpired(defer);
            } else {
                swal("提交子任务出错", data.errmsg, "error");
                defer.resolve(null);
            }
        }).error(function(rejection) {
            ajax.error(defer, rejection);
        });
        return defer.promise;
    }
}]);


// angular.module("webeditor").service("dsManage",['$http','$q', function($http, $q) {
//     //根据用户名查找子任务列表;
//     //根据用户名查找子任务列表;
//     this.login = function(userName, passwd) {
//         var defer = $q.defer();
//         ajax.get("man/userInfo/login/", {
//             parameter: {
//                 "userNickName": userName,
//                 "userPassword": passwd
//             }
//         }).success(function(data) {
//             if (data.errcode == 0) {
//                 if (data.data.access_token) { // 登陆成功
//                     defer.resolve(data.data);
//                 } else { // 用户名或密码错误
//                     defer.resolve(data.errmsg);
//                 }
//             } else {
//                 //swal("登陆出错", data.errmsg, "error");
//                 defer.resolve(data.errmsg);
//             }
//         }).error(function(rejection) {
//             ajax.error(defer, rejection);
//         });
//         return defer.promise;
//     };
//     //根据用户名查找子任务列表;
//     this.getSubtaskListByUser = function(paramObj) {
//         var defer = $q.defer();
//         ajax.get("man/subtask/listByUser", {
//             parameter: JSON.stringify(paramObj)
//         }).success(function(data) {
//             if (data.errcode == 0) {
//                 defer.resolve(data.data.result || []);
//             } else if (data.errcode == -100) {
//                 ajax.tokenExpired();
//             } else {
//                 swal("查询子任务列表出错", data.errmsg, "error");
//                 defer.resolve([]);
//             }
//         }).error(function(rejection) {
//             ajax.error(defer, rejection);
//         });
//         return defer.promise;
//     };
//     //根据子任务Id查找子任务概要信息;
//     this.getSubtaskSummaryById = function(paramObj) {
//         var defer = $q.defer();
//         ajax.get("man/statics/subtask/query", {
//             parameter: JSON.stringify({
//                 "subtaskId": paramObj
//             })
//         }).success(function(data) {
//             if (data.errcode == 0) {
//                 defer.resolve(data.data);
//             } else if (data.errcode == -100) {
//                 ajax.tokenExpired();
//             } else {
//                 swal("查询子任务统计信息出错", data.errmsg, "error");
//                 defer.resolve([]);
//             }
//         }).error(function(rejection) {
//             ajax.error(defer, rejection);
//         });
//         return defer.promise;
//     };
//     //根据用户名查找子任务列表;
//     this.getSubtaskById = function(subtaskId) {
//         var defer = $q.defer();
//         ajax.get("man/subtask/query/", {
//             parameter: JSON.stringify({
//                 "subtaskId": subtaskId
//             })
//         }).success(function(data) {
//             if (data.errcode == 0) {
//                 defer.resolve(data.data);
//             } else if (data.errcode == -100) {
//                 ajax.tokenExpired(defer);
//             } else {
//                 swal("查询子任务信息出错", data.errmsg, "error");
//                 defer.resolve(null);
//             }
//         }).error(function(rejection) {
//             ajax.error(defer, rejection);
//         });
//         return defer.promise;
//     }
// }]);
