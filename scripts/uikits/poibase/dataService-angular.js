angular.module("dataService", []).service("poi", ["$http", "$q", function($http, $q) {
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
    
    this.getProjectList = function(param){
    	var defer = $q.defer();
	    FM.dataApi.ajax.get("project/list/", param, function(data) {
	    	defer.resolve(data.data);
	    });
	    return defer.promise;
    };
    this.getProjectInfo = function(projId){
    	var defer = $q.defer();
        FM.dataApi.ajax.get("project/query/", {projectId: projId}, function(data) {
        	defer.resolve(data.data);
        });
        return defer.promise;
    };
    /*忽略检查项*/
    this.ignoreCheck = function(param, callback){
        FM.dataApi.ajax.get("check/poi/ignore/", param, function(data) {
            var ret = [];
            if (data.errcode == 0) {
                ret = data.data;
            }
            callback(ret);
        });
    };
    /*锁定检查结果*/
    this.lockSingleData = function(param, callback){
        FM.dataApi.ajax.get("editsupport/handler/locksingle/", param, function(data) {
            var ret = [];
            if (data.errcode == 0) {
                ret = data.data;
            }
            callback(ret);
        });
    };
    this.getOperSeason = function(projId){
    	var defer = $q.defer();
        FM.dataApi.ajax.get("project/queryOperSeason/", {projectId: projId}, function(data) {
            defer.resolve(data.data);
        });
        return defer.promise;
    };
    this.getPoiInfo = function(param){
    	var defer = $q.defer();
        FM.dataApi.ajax.get("editsupport/poi/query", param, function(data) {
        	defer.resolve(data.data);
        });
        return defer.promise;
    };
    this.queryUser = function(userId){
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
    this.getTopKindList = function(){
    	var defer = $q.defer();
    	FM.dataApi.IxPoiTopKind.getList(function(data){
    		defer.resolve(data);
    	});
    	return defer.promise;
    };

}]).service("meta", ["$http", "$q", function($http, $q) {
    this.getKindList = function() {
        var deferred = $q.defer();
        var param = {
            region:0
        };
        FM.dataApi.ajax.get("meta/queryKind/", param, function(data) {
            var ret = [];
            if (data.errcode == 0) {
                for (var i = 0; i < data.data.length; i++) {
                    ret.push(data.data[i]);
                }
                deferred.resolve(ret);
            } else {
                deferred.reject(data.errmsg);
            }
        });
        return deferred.promise;
    };
    this.getAllBrandList = function (){
        var deferred = $q.defer();
        FM.dataApi.ajax.get("meta/queryChain/", {}, function(data) {
            var ret ;
            if (data.errcode == 0) {
                ret = data.data
                deferred.resolve(ret);
            } else {
                deferred.reject(data.errmsg);
            }
        });
        return deferred.promise;
    }
    this.getCiParaIcon = function (fid){
        var deferred = $q.defer();
        var param = {
            idCode: fid
        };
        FM.dataApi.ajax.get("meta/queryCiParaIcon/", param, function(data) {
            var ret = [];
            if (data.errcode == 0) {
                if (data.data){
                    deferred.resolve(true);
                } else {
                    deferred.resolve(false);
                }
            } else {
                deferred.reject(false);
            }
        });
        return deferred.promise;
    }
}]);