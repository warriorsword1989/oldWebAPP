angular.module("dataService").service("dsEdit", ["$http", "$q", "ajax", function($http, $q, ajax) {
    /**
     * 根据pid获取要素详细属性
     * @param id
     * @param type
     * @param func
     */
    this.getByPid = function(pid, type) {
        var defer = $q.defer();
        var params = {
            "dbId": App.Temp.dbId,
            "type": type,
            "pid": pid
        };
        ajax.get("edit/getByPid", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal("根据Pid查询" + type + "数据出错：", data.errmsg, "error");
                defer.resolve(null);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 根据detailId获取要素详细属性
     * @param id
     * @param type
     * @param func
     */
    this.getByDetailId = function(detailId, type) {
        var defer = $q.defer();
        var params = {
            "dbId": App.Temp.dbId,
            "type": type,
            "detailId": detailId
        };
        ajax.get("edit/getByPid", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("根据DetailId查询" + type + "数据出错：", data.errmsg, "error");
                defer.resolve(null);
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
    this.getRdObjectById = function(id, type, detailid,branchType) {
        var defer = $q.defer();
        var params = {};
        if (!id) {
            if(branchType == 5 || branchType == 7){
                params = {
                    "dbId": App.Temp.dbId,
                    "type": type,
                    "detailId": 0,
                    "rowId":detailid,
                    "branchType":branchType
                }
            }else{
                params = {
                    "dbId": App.Temp.dbId,
                    "type": type,
                    "detailId": detailid,
                    "rowId":"",
                    "branchType":branchType
                }
            }
        } else {
            params = {
                "dbId": App.Temp.dbId,
                "type": type,
                "pid": id
            };
        }
        ajax.get("edit/getByPid", {
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
     * 根据接口getByCondition获取相关数据
     */
    this.getByCondition = function(param) {
        var defer = $q.defer();
        ajax.get("edit/getByCondition", {
            parameter: JSON.stringify(param)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("根据条件查询数据出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*获取poi列表*/
    this.getPoiList = function(params) {
        var defer = $q.defer();
        ajax.get("edit/poi/base/list", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal("查询POI列表出错：", data.errmsg, "error");
                defer.resolve([]);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /***
     * 创建对象
     */
    this.create = function(type, data) {
        var param = {
            "command": "CREATE",
            "dbId": App.Temp.dbId,
            "type": type,
            "data": data
        }
        return this.save(param);
    };
    /***
     * 修改对象属性
     */
    this.update = function(pid, type, data) {
        var param = {
            "command": "UPDATE",
            "dbId": App.Temp.dbId,
            "type": type,
            "objId": pid,
            "data": data
        }
        return this.save(param);
    };
    /***
     * 删除对象
     */
    this.delete = function(pid, type) {
        var param = {
            "command": "DELETE",
            "dbId": App.Temp.dbId,
            "type": type,
            "objId": pid
        }
        return this.save(param);
    };
    /***
     * 移动点要素位置
     * 适用于rdnode，adnode，poi等
     */
    this.move = function(pid, type, data) {
        var param = {
            "command": "MOVE",
            "dbId": App.Temp.dbId,
            "type": type,
            "objId": pid,
            "data": data
        }
        return this.save(param);
    };
    /***
     * 线要素修形
     * 适用于rdlink、adlink等
     */
    this.repair = function(pid, type, data) {
        var param = {
            "command": "REPAIR",
            "dbId": App.Temp.dbId,
            "type": type,
            "objId": pid,
            "data": data
        }
        return this.save(param);
    };
    /***
     * poi要素创建父poi
     */
    this.createParent = function(pid, newParentPid) {
        var param = {
            "command": "CREATEPARENT",
            "dbId": App.Temp.dbId,
            "type": type,
            "objId": pid,
            "parentPid": newParentPid
        }
        return this.save(param);
    };
    /***
     * poi要素修改父poi
     */
    this.updateParent = function(pid, newParentPid) {
        var param = {
            "command": "UPDATEPARENT",
            "dbId": App.Temp.dbId,
            "type": type,
            "objId": pid,
            "parentPid": newParentPid
        }
        return this.save(param);
    };
    /***
     * poi要素删除父poi
     */
    this.deleteParent = function(pid, parentPid) {
        var param = {
            "command": "DELETEPARENT",
            "dbId": App.Temp.dbId,
            "type": type,
            "objId": pid,
            "parentPid": newParentPid
        }
        return this.save(param);
    };
    /***
     * 属性和几何编辑相关 editGeometryOrProperty
     * @param param
     * @param func
     */
    this.save = function(param) {
        param = JSON.stringify(param);
        var defer = $q.defer();
        ajax.get("edit/run/", {
            parameter: param.replace(/\+/g, '%2B')
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal("操作出错：", data.errmsg, "error");
                defer.resolve(null);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /***
     * 申请Pid
     */
    this.applyPid = function(type) {
        var defer = $q.defer();
        ajax.get("edit/applyPid", {
            parameter: JSON.stringify({
                "type": type
            })
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal("申请Pid出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);