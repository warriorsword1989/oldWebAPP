angular.module("dataService").service("dsPoi", ["$http", "$q", "ajax", function($http, $q, ajax) {
    this.getPoiByPid = function(param) {
        var defer = $q.defer();
        var params = {
            "dbId": param.dbId,
            "type": param.type,
            "pid": param.pid
        };
        ajax.get("edit/getByPid", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                var poi = new FM.dataApi.IxPoi(data.data);
                defer.resolve(poi);
            } else {
                alert("查询poi详情出错：" + data.errmsg);
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*获取poi列表*/
    this.getPoiList = function(params) {
        var defer = $q.defer();
        ajax.get("edit/poi/base/list", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("查询Poi列表信息出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*忽略检查项*/
    this.ignoreCheck = function(data, fid) {
        var defer = $q.defer();
        var param = {
            fid: fid,
            project_id: 2016013086,
            ckException: {
                errorCode: data.errorCode,
                description: data.errorMsg
            }
        };
        ajax.get("check/poi/ignore/", {
            parameter: JSON.stringify(param)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("忽略检查项出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*获取检查结果*/
    this.getCheckData = function(num) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            pageNum: num,
            pageSize: 5,
            grids: App.Temp.meshList
        };
        ajax.get("edit/check/get", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("查找检查结果信息出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*获取检查结果条数*/
    this.getCheckDataCount = function() {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            grids: App.Temp.meshList
        };
        ajax.get("edit/check/count", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("查找检查结果条数出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    //获取检查状态
    this.updateCheckType = function(id, type) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            type: type,
            id: id
        };
        ajax.get("edit/check/update", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("获取检查状态出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /***以下是获取测试数据接口******************/
    this.queryParentPoi = function(pid) {
        var defer = $q.defer();
        ajax.getLocalJson("../service/poiParent.json").success(function(data) {
            if (data) {
                defer.resolve(data);
            } else {
                defer.resolve(null);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.queryChildren = function(pid) {
        var defer = $q.defer();
        ajax.getLocalJson("../service/poiChildren.json").success(function(data) {
            if (data) {
                defer.resolve(data);
            } else {
                defer.resolve(null);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);