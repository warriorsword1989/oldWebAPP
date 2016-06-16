angular.module("dataService").service("dsPoi", ["$http", "$q", "ajax", function($http, $q, ajax) {
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

        ajax.get("editsupport/poi/query", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                var poi = new FM.dataApi.IxPoi(data.data.data[0]);
                defer.resolve(poi);
            } else {
                defer.resolve("查询poi详情出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });

        return defer.promise;
    };

    this.getPoiByPid = function (param){
        var defer = $q.defer();
        var params = {
            "dbId" : param.dbId,
            "type" : param.type,
            "pid" : param.pid
        };

        ajax.get("edit/getByPid", {
            parameter: JSON.stringify(params),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                var poi = new FM.dataApi.IxPoi(data.data);
                defer.resolve(poi);
            } else {
                alert("查询poi详情出错：" + data.errmsg);
                defer.resolve(0);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });

        return defer.promise;
    }
    this.queryParentPoi = function (pid){
        var defer = $q.defer();
        ajax.getLocalJson("../service/poiParent.json").success(function(data) {
            if (data) {
                defer.resolve(data);
            } else {
                defer.resolve(null);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.queryChildren = function (pid){
        var defer = $q.defer();
        ajax.getLocalJson("../service/poiChildren.json").success(function(data) {
            if (data) {
                defer.resolve(data);
            } else {
                defer.resolve(null);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.getPoiSnapshot = function (fid) {
        var defer = $q.defer();
        var param = {
            projectId: 2016013086,
            condition: { fid: fid },
            phase: "4",
            featcode: "poi",
            type: "snapshot",
            pagesize: 0
        };
        ajax.get("editsupport/poi/query", {
            parameter: JSON.stringify(param)
        }).success(function(data) {
            if (data.errcode == 0) {
                var poi = new FM.dataApi.IxPoiSnapShot(data.data.data[0]);
                defer.resolve(poi);
            } else {
                defer.resolve("查询poi部分信息出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.getProjectList = function (param) {
        var defer = $q.defer();
        ajax.get("project/list/",{parameter: JSON.stringify(param)}).success(function(data){
            if(data.errcode == 0){
                defer.resolve(data.data);
            }else{
                defer.resolve("查询项目列表信息出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.getProjectInfo = function (projId) {
        var defer = $q.defer();
        ajax.get("project/query/",{parameter:{ projectId: projId}}).success(function(data){
            if(data.errcode == 0){
                defer.resolve(data.data);
            }else{
                defer.resolve("查询项目信息出错："+data.errmsg);
            }
        });
        return defer.promise;
    };
    /*忽略检查项*/
    this.ignoreCheck = function(data,fid) {
        var defer = $q.defer();
        var param = {
            fid: fid,
            project_id: 2016013086,
            ckException: {
                errorCode: data.errorCode,
                description: data.errorMsg
            }
        };
        ajax.get("check/poi/ignore/", {
            parameter: JSON.stringify(param)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("忽略检查项出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*锁定检查结果*/
    this.lockSingleData = function(fid) {
        var defer = $q.defer();
        var param = {
            fid: fid,
            projectId: 2016013086,
            featcode: "poi",
            access_token:App.Config.accessToken
        };
        ajax.post("editsupport/handler/locksingle", param).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("锁定POI出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.getOperSeason = function (projId) {
        var defer = $q.defer();
        ajax.get("project/queryOperSeason/", {
            parameter: JSON.stringify({projectId: projId})
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("查询当前作业季信息出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.getPoiInfo = function (param) {
        var defer = $q.defer();
        ajax.get("editsupport/poi/query", {
            parameter: JSON.stringify(param)
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("查询poi相关信息出错：" + data.errmsg);
            }
        });
        return defer.promise;
    };
    this.queryUser = function (userId) {
        var defer = $q.defer();
        var param = {
            parameter: "{}"
        };
        if (userId != null) {
            param.parameter = JSON.stringify({
                userId: userId
            });
        }
        ajax.get("user/query/", param).success(function(data){
            if(data.errcode == 0){
                defer.resolve(data.data.rows[0]);
            }else{
                defer.resolve("查询用户信息出错：" +data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.getKindList = function () {
        var defer = $q.defer();
        ajax.get("meta/queryKind/",{}).success(function(data){
            if(data.errcode == 0){
                defer.resolve(data);
            }else{
                defer.resolve("查询分类信息出错："+data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.getRoadList = function (cond) {
        var defer = $q.defer();
        ajax.hbaseGet("poi/getlink", {
            parameter: cond
        }).success(function (data) {
            defer.resolve(data);
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.getPoiByFid = function (fid) {
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
        ajax.get("editsupport/poi/query", {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data.data[0]);
            } else {
                defer.resolve("查询POI信息出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.savePoi = function (poi) {
        var defer = $q.defer();
        var params = {
            access_token: App.Config.accessToken,
            projectId: 2016013086,
            phase: 4,
            fid: poi.fid,
            featcode: 'poi',
            validationMethod: 1,
            data: poi
        };
        ajax.post("editsupport/poi/save/", JSON.stringify(params)).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("保存POI信息出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    this.queryChargeChain = function (kindCode){
        var defer = $q.defer();
        var params = {
            "kindCode": kindCode,
        };
        ajax.get("charge/row_edit/queryChain/", {
            parameter: params
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("加载品牌信息出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*获取检查结果*/
    this.getCheckData = function(num){
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            pageNum: num,
            pageSize: 5,
            grids: App.Temp.meshList
        };
        ajax.get("edit/check/get", {
            parameter:JSON.stringify(params),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("查找检查结果信息出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*获取检查结果条数*/
    this.getCheckDataCount = function(){
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            grids: App.Temp.meshList
        };
        ajax.get("edit/check/count", {
            parameter:JSON.stringify(params),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("查找检查结果条数出错：" + data.errmsg);
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
     */
    this.getRdObjectById = function(id,type){
        var defer = $q.defer();
        var params = {
            projectId: App.Temp.dbId,
            type: type,
            pid: id
        };
        ajax.get("edit/getByPid", {
            parameter:JSON.stringify(params),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("查找道路属性信息出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    //获取检查状态
    this.updateCheckType = function(id,type){
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            type: type,
            id: id
        };
        ajax.get("edit/check/update", {
            parameter:JSON.stringify(params),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("获取检查状态出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /*获取poi列表*/
    this.getPoiList = function (params) {
        var defer = $q.defer();
        ajax.get("edit/poi/base/list", {
            parameter:JSON.stringify(params),
            urlType:'general'
        }).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("查询poi列表信息出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    //根据用户名查找子任务列表;
    this.querySubtaskByUser = function(paramObj){
        var defer = $q.defer();
        //var params = {
        //    'userId':paramObj.userId?paramObj.userId:1,
        //    'snapshot':paramObj.snapshot?paramObj:0,
        //};
        ajax.get("man/subtask/listByUser", {
            parameter:JSON.stringify(paramObj),
            urlType:'general'
        }).success(function(data){
            if(data.errcode == 0){
                defer.resolve(data.data.result);
            }else{
                defer.resolve("查询子任务列表出错：" +data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    }
}]);