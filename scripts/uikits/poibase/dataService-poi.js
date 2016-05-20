angular.module("dataService").service("dsPoi", ["$http", "$q", "ajax", function($http, $q, ajax) {
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
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                var poi = new FM.dataApi.IxPoi(data.data.data[0]);
                defer.resolve(poi);
            } else {
                defer.resolve("查询poi详情出错：" + data.errmsg);
            }
        });

        return defer.promise;
    };
    this.getPoiList = function() {var defer = $q.defer();
        var params = {
            "projectId": 6,
            "condition": {},
            "type": "integrate",
            "phase": "4",
            "featcode": "poi",
            "pagesize": 10,
            "pageno": 1
        };

        ajax.get("editsupport/poi/query", {
            parameter : JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("查询poi列表信息出错：" + data.errmsg);
            }
        });

        return defer.promise;
    };
    this.getProjectList = function (param) {
    	var defer = $q.defer();
    	ajax.get("project/list/",{parameter: JSON.stringify(param)}).success(function(data){
	    	if(data.errcode == 0){
	    		defer.resolve(data.data);
	    	}else{
	    		defer.resolve("查询项目列表信息出错：" + data.errmsg);
	    	}
	    });
    	return defer.promise;
    };
    this.getProjectInfo = function (projId) {
    	var defer = $q.defer();
    	ajax.get("project/query/",{parameter:{ projectId: projId}}).success(function(data){
        	if(data.errcode == 0){
        		defer.resolve(data.data);
        	}else{
        		defer.resolve("查询项目信息出错："+data.errmsg);
        	}
        });
        return defer.promise;
    };
    /*忽略检查项*/
    this.ignoreCheck = function(data,fid) {
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
        });
        return defer.promise;
    };
    /*检查规则*/
    this.queryRule = function() {
        var defer = $q.defer();
        ajax.get("meta/queryRule/", {}).success(function(data) {
            if (data.errcode == 0) {
                var checkRules = [],
                    checkRule;
                for (var i = 0; i < data.data.length; i++) {
                    checkRule = new FM.dataApi.CheckRule(data.data[i]);
                    checkRules.push(checkRule);
                }
                defer.resolve(checkRules);
            } else {
                defer.resolve("查询检查规则出错：" + data.errmsg);
            }
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
        });
        return defer.promise;
    };
    this.getOperSeason = function (projId) {
    	var defer = $q.defer();
        ajax.get("project/queryOperSeason/", {
            parameter: JSON.stringify({projectId: projId})
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("查询当前作业季信息出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.getPoiInfo = function (param) {
    	var defer = $q.defer();
        ajax.get("editsupport/poi/query", {
            parameter: JSON.stringify(param)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("查询poi相关信息出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.queryUser = function (userId) {
    	var defer = $q.defer();
        var param = {
            parameter: "{}"
        };
        if (userId != null) {
            param.parameter = JSON.stringify({
                userId: userId
            });
        }
        ajax.get("user/query/", param).success(function(data){
        	if(data.errcode == 0){
        		defer.resolve(data.data.rows[0]);
        	}else{
        		defer.resolve("查询用户信息出错：" +data.errmsg);
        	}
        });
        return defer.promise;
    };
    this.getKindList = function () {
    	var defer = $q.defer();
    	ajax.get("meta/queryKind/",{}).success(function(data){
        	if(data.errcode == 0){
        		defer.resolve(data);
        	}else{
        		defer.resolve("查询分类信息出错："+data.errmsg);
        	}
        });
        return defer.promise;
    };
    this.getRoadList = function (cond) {
        var defer = $q.defer();
        ajax.hbaseGet("poi/getlink", {
            parameter: cond
        }).success(function (data) {
            defer.resolve(data);
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.getPoiByFid = function (fid) {
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
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data.data[0]);
            } else {
                defer.resolve("查询POI信息出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.savePoi = function (poi) {
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
        ajax.post("editsupport/poi/save/", JSON.stringify(params)).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("保存POI信息出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);