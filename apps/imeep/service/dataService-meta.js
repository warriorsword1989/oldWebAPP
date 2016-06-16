angular.module("dataService").service("dsMeta", ["$http", "$q", "ajax", function($http, $q, ajax) {
    //大分类
    this.getTopKind = function (){
        var defer = $q.defer();
        ajax.get("metadata/queryTopKind/", {
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve(0);
            }
        });
        return defer.promise;
    };

    this.getMediumKind = function (){
        var defer = $q.defer();
        ajax.get("metadata/queryMediumKind/", {
            region:0,
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve(-1);
            }
        });
        return defer.promise;
    };
    //小分类
    this.getKindListNew = function (){
        var defer = $q.defer();
        ajax.get("metadata/queryKind/", {
            region:0,
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("获取分类出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.getFocus = function (){
        var defer = $q.defer();
        ajax.get("metadata/queryFocus/", {
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve(0);
            }
        });
        return defer.promise;
    };

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
    /*获取餐饮类型*/
    this.queryFoodType = function () {
        var defer = $q.defer();
        ajax.get("metadata/queryFoodType", {
            parameter:JSON.stringify(params),
            urlType:'general'
        }).success(function(data) {
            if(data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("加载菜品风味出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        })
        return defer.promise;
    }
}]);