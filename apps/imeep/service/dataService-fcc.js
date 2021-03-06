angular.module('dataService').service('dsFcc', ['$http', '$q', 'ajax', 'dsOutput', function ($http, $q, ajax, dsOutput) {
    /** *
     * 根据getStats接口获取相关数据
     * @param stage 1：待作业；3：已作业
     * @param func
     */
    this.getTipsStatics = function (stage) {
        var defer = $q.defer();
        var params = {
            grids: App.Temp.gridList,
            stage: stage
        };
        ajax.get('fcc/tip/getStats', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 查询该要素下tips列表信息*/
    this.getTipsListItems = function (stage, type) {
        var defer = $q.defer();
        var params = {
            grids: App.Temp.gridList,
            stage: stage,
            mdFlag: App.Temp.mdFlag,
            type: type,
            dbId: App.Temp.dbId
        };
        ajax.get('fcc/tip/getSnapshot', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 获取tips信息*/
    this.getTipsResult = function (rowkey) {
        var defer = $q.defer();
        var params = {
            rowkey: rowkey
        };
        ajax.get('fcc/tip/getByRowkey', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 查询已读消息*/
    this.getReadMsg = function (param) {
        var defer = $q.defer();
        ajax.get('sys/sysmsg/read/get', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 查询未读消息详情*/
    this.getDetailCheck = function (param) {
        var defer = $q.defer();
        ajax.get('sys/sysmsg/readDetail/check', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 查询已读消息详情*/
    this.getReadCheck = function (param) {
        var defer = $q.defer();
        ajax.get('sys/sysmsg/detail/check', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     *  保存datatips数据
     * @param param
     * @param func
     */
    this.changeDataTipsState = function (param) {
        var defer = $q.defer();
        ajax.get('fcc/tip/edit', {
            parameter: param
        }).success(function (data) {
            if (data.errcode == 0) {
                dsOutput.push({
                    op: 'Tips状态修改成功',
                    type: 'succ',
                    pid: '0',
                    childPid: ''
                });
                swal('Tips状态修改成功', '', 'success');
                defer.resolve(1);
            } else {
                dsOutput.push({
                    op: 'Tips状态修改出错：' + data.errmsg,
                    type: 'fail',
                    pid: data.errcode,
                    childPid: ''
                });
                swal('Tips状态修改出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 自动录入*/
    this.runAutomaticInput = function (types) {
        var defer = $q.defer();
        var params = {
            jobType: 'niRobot',
            request: {
                grids: App.Temp.gridList,
                targetDbId: App.Temp.dbId,
                types: types
            },
            descp: ''
        };
        ajax.get('job/create/', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode === 0) {
                defer.resolve(data);
            } else {
                swal('创建Job出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);
