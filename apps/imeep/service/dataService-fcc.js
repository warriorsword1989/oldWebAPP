angular.module("dataService").service("dsFcc", ["$http", "$q", "ajax", function($http, $q, ajax) {
    /***
     * 根据getStats接口获取相关数据
     * @param stage 1：待作业；3：已作业
     * @param func
     */
    this.getTipsStatics = function(stage) {
        var defer = $q.defer();
        var params = {
            "grids": App.Temp.meshList,
            "stage": stage
        };
        ajax.get("fcc/tip/getStats", {
            parameter: JSON.stringify(params)
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
    /*查询该要素下tips列表信息*/
    this.getTipsListItems = function(stage, type) {
        var defer = $q.defer();
        var params = {
            "grids": App.Temp.meshList,
            "stage": stage,
            "type": type,
            "dbId": App.Temp.dbId
        };
        ajax.get("fcc/tip/getSnapshot", {
            parameter: JSON.stringify(params)
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
    /*获取tips信息*/
    this.getTipsResult = function(rowkey) {
        var defer = $q.defer();
        var params = {
            "rowkey": rowkey
        };
        ajax.get("fcc/tip/getByRowkey", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal("查询数据出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     *  保存datatips数据
     * @param param
     * @param func
     */
    this.changeDataTipsState = function(param) {
        var defer = $q.defer();
        ajax.get("/fcc/tip/edit", {
            parameter: param
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
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