angular.module("dataService").service("dsMeta", ["$http", "$q", "ajax", function($http, $q, ajax) {
    this.getKindList = function() {
        var defer = $q.defer();
        var param = {
            region:0
        };
        ajax.get("meta/queryKind/", param).success(function(data) {
            var ret = [];
            if (data.errcode == 0) {
                for (var i = 0; i < data.data.length; i++) {
                    ret.push(data.data[i]);
                }
                defer.resolve(ret);
            } else {
                defer.resolve("获取分类出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.getAllBrandList = function (){
        var defer = $q.defer();
        ajax.get("meta/queryChain/", {}).success(function(data) {
            var ret = [];
            if (data.errcode == 0) {
                for (var i = 0; i < data.data.length; i++) {
                    ret.push(data.data[i]);
                }
                defer.resolve(ret);
            } else {
                defer.resolve("获取分类出错：" + data.errmsg);
            }
        });
        return defer.promise;
    }
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
        });
        return defer.promise;
    };
}]);