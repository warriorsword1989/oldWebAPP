angular.module("dataService").service("dsFcc", ["$http", "$q", "ajax", function($http, $q, ajax) {
    /********************************** begin 道路相关 *****************************************/
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

    this.getTipsListItems = function(stage,type) {
        var defer = $q.defer();
        var params = {
            "grids": App.Temp.meshList,
            "stage": stage,
            "type":type,
            "dbId":App.Temp.dbId
        };

        ajax.get("fcc/tip/getSnapshot", {
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

    this.getTipsResult = function(rowkey) {
        var defer = $q.defer();
        var params = {
            "rowkey": rowkey
        };
        ajax.get("fcc/tip/getByRowkey", {
            parameter: JSON.stringify(params),
            urlType:'general'
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
            parameter: JSON.stringify(param),
            urlType:'general'
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
    
    
    /********************************** end 道路相关 *******************************************/
    this.getPoiDetailByFid = function(fid) {
        var defer = $q.defer();
        var params = {
            "projectId": 2016013086,
            "condition": {
                "fid": fid
            },
            "type": "integrate",
            "phase": "4",
            "featcode": "poi",
            "pagesize": 0
        };

        ajax.get("editsupport/poi/query", {
            parameter: JSON.stringify(params),
        }).success(function(data) {
            if (data.errcode == 0) {
                var poi = new FM.dataApi.IxPoi(data.data.data[0]);
                defer.resolve(poi);
            } else {
                defer.resolve("查询poi详情出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });

        return defer.promise;
    };

    /*锁定检查结果*/
    this.lockSingleData = function(fid) {
        var defer = $q.defer();
        var param = {
            fid: fid,
            projectId: 2016013086,
            featcode: "poi",
            access_token:App.Config.accessToken
        };
        ajax.post("editsupport/handler/locksingle", param).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("锁定POI出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);