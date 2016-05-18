angular.module("dataServiceMeta", []).service("dsMeta", ["$http", "$q", function($http, $q) {
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