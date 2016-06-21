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
    //中分类
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
    this.getKindListNew = function (param){
        var defer = $q.defer();
        ajax.get("metadata/queryKind/", {
            parameter: JSON.stringify({
                region:param.region,
                mediumId:param.mediumId
            }),
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
    //获取品牌
    this.getChainList = function (param){
        var defer = $q.defer();
        ajax.get("metadata/queryChain/", {
            parameter: JSON.stringify({
                kindCode:param.kindCode,
            }),
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
    };

    /*****************-------------------------------道路相关----------------------------************************/

    /**
     *  获取箭头图图片组
     * @param param
     * @param func
     */
    this.getArrowImgGroup = function(param) {
        var defer = $q.defer();
        ajax.get("metadata/patternImage/search", {
            parameter: JSON.stringify(param),
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

    /**
     *  获取箭头图图片
     * @param param
     * @param func
     */
    this.getArrowImg = function(param) {
        return App.Config.generalUrl +'/metadata/patternImage/getById?parameter=' + param;
    };

    /**
     *  高速分歧 名称发音和语音
     * @param param
     * @param func
     */
    this.getNamePronunciation = function(param) {
        var defer = $q.defer();
        ajax.get("metadata/pinyin/convert", {
            parameter: JSON.stringify(param),
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

    //根据输入的道路名模糊查询所有道路民
    this.getNamesbyName = function(param) {
        var defer = $q.defer();
        ajax.get("metadata/rdname/search", {
            parameter: JSON.stringify(param)
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
    /*获取餐饮类型*/
    this.queryFoodType = function (kindCode) {
        var defer = $q.defer();
        ajax.get("metadata/queryFoodType", {
            parameter:JSON.stringify({"kindId":kindCode}),
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