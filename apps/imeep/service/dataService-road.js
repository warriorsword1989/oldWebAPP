angular.module("dataService").service("dsRoad", ["$http", "$q", "ajax", function($http, $q, ajax) {

    /**
     * 根据道路id获得道路的详细属性
     * @param id
     * @param type
     * @param func
     */
    this.getRdObjectById = function(id,type,detailid) {
        var defer = $q.defer();
        var params = {};
        if(!id){
            params = {
                "dbId": App.Temp.dbId,
                "type":type,
                "detailId":detailid
            };
        }else {
            params = {
                "dbId": App.Temp.dbId,
                "type":type,
                "pid":id
            };
        }
        ajax.get("/edit/getByPid", {
            parameter: JSON.stringify(params),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("查询数据出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /***
     * 属性和几何编辑相关 editGeometryOrProperty
     * @param param
     * @param func
     */
    this.editGeometryOrProperty = function(param) {
        param = JSON.stringify(param);
        var defer = $q.defer();
        ajax.get("/edit/run", {
            parameter: param.replace(/\+/g,'%2B'),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("查询数据出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    //获取检查结果
    this.getCheckData = function(param) {
        var defer = $q.defer();
        ajax.get("/edit/check/get", {
            parameter: JSON.stringify(param),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("查询数据出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    //获取检查结果总数
    this.getCheckCount = function(param) {
        var defer = $q.defer();
        ajax.get("/edit/check/count", {
            parameter: JSON.stringify(param),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("查询数据出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    //获取检查状态
    this.updateCheckType = function(param) {
        var defer = $q.defer();
        ajax.get("/edit/check/update", {
            parameter: JSON.stringify(param),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("查询数据出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /***
     * 获取互联网rtic代码
     */
    this.getIntRticRank = function(param) {
        var defer = $q.defer();
        ajax.get("/edit/applyPid", {
            parameter: JSON.stringify(param),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("查询数据出错：", data.errmsg, "error");
                defer.resolve(-1);
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
        ajax.get("/edit/getByCondition", {
            parameter: JSON.stringify(param),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("查询数据出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

}]);