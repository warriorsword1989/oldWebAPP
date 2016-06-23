angular.module("dataService").service("dsEdit", ["$http", "$q", "ajax", function($http, $q, ajax) {
    /**
     * 根据pid获取要素详细属性
     * @param id
     * @param type
     * @param func
     */
    this.getByPid = function(pid, type) {
        var defer = $q.defer();
        var params = {
            "dbId": App.Temp.dbId,
            "type": type,
            "pid": pid
        };
        ajax.get("edit/getByPid", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal("根据Pid查询" + type + "数据出错：", data.errmsg, "error");
                defer.resolve(null);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 根据detailId获取要素详细属性
     * @param id
     * @param type
     * @param func
     */
    this.getByDetailId = function(detailId, type) {
        var defer = $q.defer();
        var params = {
            "dbId": App.Temp.dbId,
            "type": type,
            "detailId": detailId
        };
        ajax.get("edit/getByPid", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("根据DetailId查询" + type + "数据出错：", data.errmsg, "error");
                defer.resolve(null);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /***
     * 根据接口getByCondition获取相关数据
     */
    this.getByCondition = function(param) {
        var defer = $q.defer();
        ajax.get("edit/getByCondition", {
            parameter: JSON.stringify(param)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("根据条件查询数据出错：", data.errmsg, "error");
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
                swal("查询POI列表出错：", data.errmsg, "error");
                defer.resolve([]);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*
     *几何编辑保存
     */
    this.saveGeometry = function(param) {
        param = JSON.stringify(param);
        var defer = $q.defer();
        ajax.post("edit/run/", {
            parameter: param.replace(/\+/g, '%2B')
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("保存数据出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*
     * 保存
     */
    this.save = function(param) {};
    /*
     * 删除
     */
    this.delete = function(param) {};
    /***
     * 属性和几何编辑相关 editGeometryOrProperty
     * @param param
     * @param func
     */
    this.editGeometryOrProperty = function(param) {
        param = JSON.stringify(param);
        var defer = $q.defer();
        ajax.get("edit/run/", {
            parameter: param.replace(/\+/g, '%2B')
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("保存数据出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /***
     * 申请Pid
     */
    this.applyPid = function(type) {
        var defer = $q.defer();
        ajax.get("edit/applyPid", {
            parameter: JSON.stringify({
                "type": type
            })
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("申请Pid出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);