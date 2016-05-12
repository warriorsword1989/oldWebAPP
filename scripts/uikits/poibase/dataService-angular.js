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
    
    this.getProjectList = function(param, callback){
        FM.dataApi.ajax.get("project/list/", param, function(data) {
        	var ret = [];
        	if (data.errcode == 0) {
                ret = data.data.rows;
            }
        	callback(ret);
        });
    };
    this.getProjectInfo = function(projId, callback){
        FM.dataApi.ajax.get("project/query/", {projectId: projId}, function(data) {
        	var ret = [];
        	if (data.errcode == 0) {
                ret = data.data;
            }
        	callback(ret);
        });
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
    this.getOperSeason = function(projId, callback){
        FM.dataApi.ajax.get("project/queryOperSeason/", {projectId: projId}, function(data) {
        	var ret = [];
        	if (data.errcode == 0) {
                ret = data.data;
            }
        	callback(ret);
        });
    };
    this.getPoiInfo = function(param, callback){
        FM.dataApi.ajax.get("editsupport/poi/query", param, function(data) {
        	var ret;
        	if (data.errcode == 0) {
                ret = data.data;
            }
        	callback(ret);
        });
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