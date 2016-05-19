angular.module("dataService").service("dsPoi", ["$http", "$q", function($http, $q) {
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
        FM.dataApi.IxPoi.getPoiDetailByFid(params, function(data) {
            defer.resolve(data);
        });
        return defer.promise;
    };
    this.getPoiList = function() {
        var defer = $q.defer();
        var params = {
            "projectId": 6,
            "condition": {},
            "type": "integrate",
            "phase": "4",
            "featcode": "poi",
            "pagesize": 10,
            "pageno": 1
        };
        FM.dataApi.IxPoi.getList(params, function(data) {
            defer.resolve(data);
        });
        return defer.promise;
    };
    this.savePoi = function(param, callback) {
        delete param.data._initHooksCalled;
        FM.dataApi.ajax.httpPost($http, "editsupport/poi/save/", param, function(data) {
            var ret = [];
            if (data.errcode == 0) {
                ret = data.data;
            }
            callback(ret);
        });
    }
    this.getProjectList = function(param) {
        var defer = $q.defer();
        FM.dataApi.ajax.get("project/list/", param, function(data) {
            defer.resolve(data.data);
        });
        return defer.promise;
    };
    this.getProjectInfo = function(projId) {
        var defer = $q.defer();
        FM.dataApi.ajax.get("project/query/", {
            projectId: projId
        }, function(data) {
            defer.resolve(data.data);
        });
        return defer.promise;
    };
    /*忽略检查项*/
    this.ignoreCheck = function(param) {
        var defer = $q.defer();
        FM.dataApi.ajax.get("check/poi/ignore/", param, function(data) {
            defer.resolve(data.data);
        });
        return defer.promise;
    };
    /*this.ignoreCheck = function(data) {
        var defer = $q.defer();
        var param = {
            fid: $scope.poi.fid,
            project_id: 2016013086,
            ckException: {
                errorCode: data.errorCode,
                description: data.errorMsg
            }
        };
        $http.get("fos:check/poi/ignore/", {
            params: {
                parameter: JSON.stringify(params)
            }
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data.data[0]);
            } else {
                defer.resolve("忽略检查项出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };*/
    /*锁定检查结果*/
    this.lockSingleData = function(fid) {
        var defer = $q.defer();
        var param = {
            fid: fid,
            projectId: 2016013086,
            featcode: "poi",
            access_token:App.Config.accessToken
        };
        $http.post("fos:editsupport/handler/locksingle", param).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("锁定POI出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.getOperSeason = function(projId) {
        var defer = $q.defer();
        FM.dataApi.ajax.get("project/queryOperSeason/", {
            projectId: projId
        }, function(data) {
            defer.resolve(data.data);
        });
        return defer.promise;
    };
    this.getPoiInfo = function(param) {
        var defer = $q.defer();
        FM.dataApi.ajax.get("editsupport/poi/query", param, function(data) {
            defer.resolve(data.data);
        });
        return defer.promise;
    };
    this.queryUser = function(userId) {
        var defer = $q.defer();
        var param = {
            parameter: "{}"
        };
        if (userId != null) {
            param.parameter = JSON.stringify({
                userId: userId
            });
        }
        FM.dataApi.ajax.get("user/query/", param, function(data) {
            defer.resolve(data.data.rows[0]);
        });
        return defer.promise;
    };
    this.getKindList = function() {
        var defer = $q.defer();
        FM.dataApi.IxPoiKind.getList(function(data) {
            defer.resolve(data);
        });
        return defer.promise;
    };
    this.getRoadList = function(cond) {
        var defer = $q.defer();
        FM.dataApi.getFromHbase.get("poi/getlink", cond, function(data) {
            defer.resolve(data);
        });
        return defer.promise;
    };
    this.getPoiByFid = function(fid) {
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
        $http.get("fos:editsupport/poi/query", {
            params: {
                parameter: JSON.stringify(params)
            }
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data.data[0]);
            } else {
                defer.resolve("查询POI信息出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.savePoiNew = function(poi) {
        var defer = $q.defer();
        var params = {
            access_token: App.Config.accessToken,
            projectId: 2016013086,
            phase: 4,
            fid: poi.fid,
            featcode: 'poi',
            validationMethod: 1,
            data: poi
        };
        $http.post("fos:editsupport/poi/save/", JSON.stringify(params)).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("保存POI信息出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
}]);