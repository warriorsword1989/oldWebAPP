angular.module("dataService").service("dsEditor", ["$http", "$q", "ajax", function($http, $q, ajax) {
    /***
     * 根据getStats接口获取相关数据
     * @param stage 1：待作业；3：已作业
     * @param func
     */
    this.getTipsStatics = function(stage) {
        var defer = $q.defer();
        var params = {
            "grids": [App.Temp.meshList.toString()],
            "stage": [stage.toString()]
        };

        ajax.get(App.Config.tipsServer+"/getStats", {
            parameter: JSON.stringify(params)
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

    this.getTipsListItems = function(stage,type) {
        var defer = $q.defer();
        var params = {
            "grids": [App.Temp.meshList.toString()],
            "stage": [stage.toString()],
            "type":type,
            "dbId":App.Temp.dbId
        };

        ajax.get(App.Config.tipsServer+"/getSnapshot", {
            parameter: JSON.stringify(params)
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

    this.getTipsResult = function(rowkey) {
        var defer = $q.defer();
        var params = {
            "rowkey": rowkey
        };
        ajax.get(App.Config.tipsServer+"/getByRowkey", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
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
     *  保存datatips数据
     * @param param
     * @param func
     */
    this.changeDataTipsState = function(param) {
        var defer = $q.defer();
        ajax.get(App.Config.tipsServer+"/edit", {
            parameter: JSON.stringify(param)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
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
     * 根据道路id获得道路的详细属性
     * @param id
     * @param type
     * @param func
     */
    this.getRdObjectById = function(id,type,detailid) {
        var defer = $q.defer();
        var params = {};
        if(!id){
            params = {
                "dbId": App.Temp.dbId,
                "type":type,
                "detailId":detailid
            };
        }else {
            params = {
                "dbId": App.Temp.dbId,
                "type":type,
                "pid":id
            };
        }
        ajax.get(App.Config.editServer+"/getByPid", {
            parameter: JSON.stringify(params)
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

    /***
     * 属性和几何编辑相关 editGeometryOrProperty
     * @param param
     * @param func
     */
    this.editGeometryOrProperty = function(param) {
        var defer = $q.defer();
        ajax.get(App.Config.editServer+"/run", {
            parameter: JSON.stringify(param.replace(/\+/g,'%2B'))
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

    //获取检查结果
    this.getCheckData = function(param) {
        var defer = $q.defer();
        ajax.get(App.Config.editServer+"/check/get", {
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

    //获取检查结果总数
    this.getCheckCount = function(param) {
        var defer = $q.defer();
        ajax.get(App.Config.editServer+"/check/count", {
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

    //获取检查状态
    this.updateCheckType = function(param) {
        var defer = $q.defer();
        ajax.get(App.Config.editServer+"/check/update", {
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

    /***
     * 获取互联网rtic代码
     */
    this.getIntRticRank = function(param) {
        var defer = $q.defer();
        ajax.get(App.Config.editServer+"/applyPid", {
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

    /***
     * 根据接口getByCondition获取相关数据
     */
    this.getByCondition = function(param) {
        var defer = $q.defer();
        ajax.get(App.Config.editServer+"/getByCondition", {
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

    /**
     *  获取箭头图图片组
     * @param param
     * @param func
     */
    this.getArrowImgGroup = function(param) {
        var defer = $q.defer();
        ajax.get(App.Config.metaServer+"/patternImage/search", {
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

    /**
     *  获取箭头图图片
     * @param param
     * @param func
     */
    this.getArrowImg = function(param) {
        var defer = $q.defer();
        ajax.get(App.Config.metaServer+"/patternImage/getById", {
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

    /**
     *  高速分歧 名称发音和语音
     * @param param
     * @param func
     */
    this.getNamePronunciation = function(param) {
        var defer = $q.defer();
        ajax.get(App.Config.metaServer+"/pinyin/convert", {
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

    //根据输入的道路名模糊查询所有道路民
    this.getNamesbyName = function(param) {
        var defer = $q.defer();
        ajax.get(App.Config.metaServer+"/rdname/search", {
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
}]);