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
    this.savePoi = function (param, callback){
        delete param.data._initHooksCalled;
        FM.dataApi.ajax.httpPost($http,"editsupport/poi/save/",param,function (data){
            var ret = [];
            if (data.errcode == 0) {
                ret = data.data;
            }
            callback(ret);
        });

    }
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
    this.ignoreCheck = function(param){
        var defer = $q.defer();
        FM.dataApi.ajax.get("check/poi/ignore/", param, function(data) {
            defer.resolve(data.data);
        });
        return defer.promise;
    };
    /*锁定检查结果*/
    this.lockSingleData = function(param){
        var defer = $q.defer();
        /*$http({
            method: 'POST',
            url: App.Config.serviceUrl + '/editsupport/handler/locksingle',
            data: param,
            transformRequest:function(obj){
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));
                }
                return str.join("&");
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // 跨域设置
            }
        }).success(function(data){
            defer.resolve(data.data);
        });*/
        FM.dataApi.ajax.post($http,'/editsupport/handler/locksingle',param,function(data){
            defer.resolve(data.data);
        });
        return defer.promise;
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