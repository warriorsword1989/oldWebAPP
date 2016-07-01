angular.module("dataService").service("dsEdit", ["$http", "$q", "ajax", "dsOutput", function($http, $q, ajax, dsOutput) {
    /**
     * 根据pid获取要素详细属性
     * @param id
     * @param type
     * @param detailId
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
     * 根据道路id获得分歧的详细属性(branchType = 0、1、2、3、4、6、8、9)
     * @param id
     * @param type
     * @param func
     */
    this.getBranchByDetailId = function(detailId, branchType) {
        var defer = $q.defer();
        var params = {
            "dbId": App.Temp.dbId,
            "type": 'RDBRANCH',
            "detailId": detailId,
            "rowId": "",
            "branchType": branchType
        };
        ajax.get("edit/getByPid", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                data.data['branchType'] = branchType;
                defer.resolve(data.data);
            } else {
                swal("查询分歧数据出错：", data.errmsg, "error");
                defer.resolve(-1);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 根据道路id获得分歧的详细属性(branchType = 5、7)
     * @param id
     * @param type
     * @param func
     */
    this.getBranchByRowId = function(rowId, branchType) {
        var defer = $q.defer();
        var params = {
            "dbId": App.Temp.dbId,
            "type": 'RDBRANCH',
            "detailId": 0,
            "rowId": rowId,
            "branchType": branchType
        };
        ajax.get("edit/getByPid", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                data.data['branchType'] = branchType;
                defer.resolve(data.data);
            } else {
                swal("查询分歧数据出错：", data.errmsg, "error");
                defer.resolve(-1);
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
    /**
     * 根据道路rowId获得分歧的详细属性(branchType = 5、7)
     * @param detailid
     * @param branchType
     */
    this.deleteBranchByRowId = function(detailid, branchType) {
        var defer = $q.defer();
        var params = {
            "command": "DELETE",
            "dbId": App.Temp.dbId,
            "type": 'RDBRANCH',
            "detailId": 0,
            "rowId": detailid,
            "branchType": branchType
        };
        return this.save(params);
    };
    /**
     * 根据道路detailId获得分歧的详细属性(branchType = 除了5、7)
     * @param detailid
     * @param branchType
     */
    this.deleteBranchByDetailId = function(detailid, branchType) {
        var defer = $q.defer();
        var params = {
            "command": "DELETE",
            "dbId": App.Temp.dbId,
            "type": 'RDBRANCH',
            "detailId": detailid,
            "rowId": "",
            "branchType": branchType
        };
        return this.save(params);
    };
    /***
     * 移动点要素位置
     * 适用于rdnode，adNode，poi等
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
            "command": "CREATE",
            "dbId": App.Temp.dbId,
            "type": "IXPOIPARENT",
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
            "command": "UPDATE",
            "dbId": App.Temp.dbId,
            "type": "IXPOIPARENT",
            "objId": pid,
            "parentPid": newParentPid
        }
        return this.save(param);
    };
    /***
     * poi要素删除父poi
     */
    this.deleteParent = function(pid) {
        var param = {
            "command": "DELETE",
            "dbId": App.Temp.dbId,
            "type": "IXPOIPARENT",
            "objId": pid
        }
        return this.save(param);
    };
    this.updateTopo = function(pid, type, data){
        var param = {
            "command": "UPDATETOPO",
            "dbId": App.Temp.dbId,
            "type": type,
            "objId": pid,
            "data": data
        }
        return this.save(param);
    }
    /***
     * 属性和几何编辑相关 editGeometryOrProperty
     * @param param
     * @param func
     */
    this.save = function(param) {
        var opDesc = {
            "CREATE": "创建" + [param.type],
            "BREAK" : "新增" + [param.type],
            "UPDATE": "更新" + [param.type] + "属性",
            "DELETE": "删除" + [param.type],
            "MOVE": "移动" + [param.type] + "点位",
            "REPAIR": [param.type] + "修形",
            "CREATEPARENT": "POI增加父",
            "UPDATEPARENT": "POI更新父",
            "DELETEPARENT": "POI解除父",
            "UPDATETOPO":"更新"+[param.type]+"拓扑"
        }[param.command];
        if(param.command==='UPDATETOPO'){
            param.command='UPDATE'
        }
        param = JSON.stringify(param);
        var defer = $q.defer();
        ajax.get("edit/run/", {
            parameter: param.replace(/\+/g, '%2B')
        }).success(function(data) {
            if (data.errcode == 0) {
                dsOutput.push({
                    "op": opDesc + "操作成功",
                    "type": "succ",
                    "pid": "0",
                    "childPid": ""
                });
                dsOutput.pushAll(data.data.log);
                swal(opDesc + "操作成功", "", "success");
                defer.resolve(data.data);
            } else {
                dsOutput.push({
                    "op": opDesc + "操作出错：" + data.errmsg,
                    "type": "fail",
                    "pid": data.errcode,
                    "childPid": ""
                });
                swal(opDesc + "操作出错：", data.errmsg, "error");
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