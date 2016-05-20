angular.module("dataService").service("dsMeta", ["$http", "$q", "ajax", function($http, $q, ajax) {
    this.getKindList = function() {
        var defer = $q.defer();
        var param = {
            region:0
        };
        ajax.get("meta/queryKind/", param).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("获取分类出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.getAllBrandList = function (){
        var defer = $q.defer();
        ajax.get("meta/queryChain/", {}).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("获取分类出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.getChainLevel = function (kindCode,chainCode){
        var defer = $q.defer();
        var param = {
            kindCode:kindCode,
            chainCode:chainCode
        };
        ajax.get("meta/chainLevel/", param).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("获取等级出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.getCiParaIcon = function (fid){
        var defer = $q.defer();
        var param = {
            idCode: fid
        };
        ajax.get("meta/queryCiParaIcon/", {parameter: JSON.stringify(param)}).success(function(data) {
            if (data.errcode == 0) {
                if (data.data){
                    defer.resolve(true);
                } else {
                    defer.resolve(false);
                }
            } else {
                defer.resolve(false);
            }
        });

        return defer.promise;
    }
    /*获取fidlist*/
    this.getParentFidList = function() {
        var defer = $q.defer();
        ajax.get("/meta/queryFocus/", {}).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("获取数据出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
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
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);