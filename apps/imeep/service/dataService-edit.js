angular.module('dataService').service('dsEdit', ['$http', '$q', 'ajax', 'dsOutput', function ($http, $q, ajax, dsOutput) {
    /**
     * add by chenx on 2016-10-19，用于控制主页面loadingbar的显示/隐藏
     */
    var showLoading; // 主页面控制Loading的开关的引用
    // 利用对象引用的特性，将本地变量showLoading指向主scope中的控制loadingbar显隐的开关对象
    // 主页面初始化的时候绑定一次即可
    this.referenceLoadingSwitch = function (loadingSwitch) {
        showLoading = loadingSwitch;
    };
    // 私有函数，修改loadingbar开关的状态
    var toggleLoading = function (flag) {
        showLoading.flag = flag;
    };
    /**
     * 根据pid获取要素详细属性
     * @param id     要素PID
     * @param type   要素类型
     * @param alertError   是否弹出错误信息
     */
    this.getByPid = function (pid, type, alertError) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            type: type,
            pid: pid
        };
        if (alertError === undefined) {
            alertError = true;
        }
        ajax.get('edit/getByPid', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                if (alertError) {
                    swal('根据Pid查询' + type + '数据出错：', data.errmsg, 'error');
                }
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 根据道路id获得分歧的详细属性(branchType = 0、1、2、3、4、6、8、9)
     * @param detailId     分歧的DetailId
     * @param branchType   分歧类型
     */
    this.getBranchByDetailId = function (detailId, branchType) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            type: 'RDBRANCH',
            detailId: detailId,
            rowId: '',
            branchType: branchType
        };
        ajax.get('edit/getByPid', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                data.data.branchType = branchType;
                defer.resolve(data.data);
            } else {
                swal('查询分歧数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 根据道路id获得分歧的详细属性(branchType = 5、7)
     * @param rowId        分歧的rowId
     * @param branchType   分歧类型
     */
    this.getBranchByRowId = function (rowId, branchType) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            type: 'RDBRANCH',
            detailId: 0,
            rowId: rowId,
            branchType: branchType
        };
        ajax.get('edit/getByPid', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                data.data.branchType = branchType;
                defer.resolve(data.data);
            } else {
                swal('查询分歧数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 根据接口getByCondition获取相关数据
     */
    this.getByCondition = function (param) {
        var defer = $q.defer();
        ajax.get('edit/getByCondition', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('根据条件查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 消息推送
     */
    this.getMsgNotify = function () {
        var defer = $q.defer();
        ajax.get('sys/sysmsg/unread/get', {
            parameter: ''
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('消息推送查询出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 获取poi列表*/
    this.getPoiList = function (params) {
        var defer = $q.defer();
        ajax.get('editrow/poi/base/list', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询POI列表出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 获取检查结果
    this.getCheckData = function (num) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            pageNum: num,
            subtaskType: App.Temp.taskType,
            pageSize: 5,
            subtaskId: App.Util.getUrlParam('subtaskId'),
            grids: App.Temp.gridList ? App.Temp.gridList : []
        };
        ajax.get('edit/check/list', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查找检查结果信息出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /* 获取检查结果条数*/
    this.getCheckDataCount = function () {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            grids: App.Temp.gridList
        };
        ajax.get('edit/check/count', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('查找检查结果条数出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 获取检查状态
    this.updateCheckType = function (id, type) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            type: type,
            id: id
        };
        ajax.get('edit/check/update', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
                dsOutput.push({
                    op: '修改 pid 为 ' + id + ' 的数据状态操作成功',
                    type: 'succ',
                    pid: '0',
                    childPid: ''
                });
            } else {
                dsOutput.push({
                    op: '修改 pid 为 ' + id + ' 的数据状态操作失败，失败原因：' + data.errmsg,
                    type: 'fail',
                    pid: '0',
                    childPid: ''
                });
                swal('获取检查状态出错：', data.errmsg, 'error');
                defer.resolve('获取检查状态出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 创建对象
     */
    this.create = function (type, data) {
        var param = {
            command: 'CREATE',
            dbId: App.Temp.dbId,
            type: type,
            data: data
        };
        return this.save(param);
    };
    /** *
     * 修改对象属性
     */
    this.update = function (pid, type, data) {
        var param = {
            command: 'UPDATE',
            dbId: App.Temp.dbId,
            type: type,
            objId: pid,
            data: data
        };
        return this.save(param);
    };
    /**
     * 删除要素
     * @param pid          要素PID
     * @param branchType   要素类型
     * @param infect       前检查标识，为1时表示要进行删除前的检查，确认要执行删除操作后，再执行具体的删除操作；
     不传或为0时表示直接执行删除操作
     */
    this.delete = function (pid, type, infect) {
        var param = {
            command: 'DELETE',
            dbId: App.Temp.dbId,
            type: type,
            objId: pid
        };
        if (infect) {
            var that = this;
            var defer = $q.defer();
            param.infect = infect;
            this.save(param).then(function (data) {
                if (data) {
                    var test = data.result;
                    var html = [],
                      temp;
                    for (var key in test) {
                        html.push("<p style='text-align:left;font-weight:bold;'>" + key + '：</p>');
                        temp = test[key];
                        html.push("<ul style='text-align:left;padding:5px 25px;margin:0px;list-style-type:decimal;'>");
                        for (var i = 0; i < temp.length; i++) {
                            html.push('<li>' + temp[i].objType + '|' + temp[i].pid + '|' + temp[i].status + '</li>');
                        }
                        html.push('</ul>');
                    }
                    // by liwanchong:加上setTimeout是为了解决在mac下不能正常提示的问题
                    setTimeout(function () {
                        swal({
                            title: '以下操作将会执行，是否继续？',
                            text: html.join(''),
                            html: true,
                            showCancelButton: true,
                            allowEscapeKey: false,
                            confirmButtonText: '是的，我要删除',
                            confirmButtonColor: '#ec6c62'
                        }, function (f) {
                            if (f) { // 执行删除操作
                                delete param.infect; // 去掉检查标识，执行删除操作
                                that.save(param).then(function (data) {
                                    defer.resolve(data);
                                });
                            } else { // 取消删除
                                defer.resolve(null);
                            }
                        });
                    }, 1000);
                } else { // 服务端返回错误信息，结束执行
                    defer.resolve(null);
                }
            });
            return defer.promise;
        } else {
            return this.save(param);
        }
    };
    /**
     * 根据道路rowId获得分歧的详细属性(branchType = 5、7)
     * @param detailid
     * @param branchType
     */
    this.deleteBranchByRowId = function (detailid, branchType) {
        var defer = $q.defer();
        var params = {
            command: 'DELETE',
            dbId: App.Temp.dbId,
            type: 'RDBRANCH',
            detailId: 0,
            rowId: detailid,
            branchType: branchType
        };
        return this.save(params);
    };
    /**
     * 根据道路detailId获得分歧的详细属性(branchType = 除了5、7)
     * @param detailid
     * @param branchType
     */
    this.deleteBranchByDetailId = function (detailid, branchType) {
        var defer = $q.defer();
        var params = {
            command: 'DELETE',
            dbId: App.Temp.dbId,
            type: 'RDBRANCH',
            detailId: detailid,
            rowId: '',
            branchType: branchType
        };
        return this.save(params);
    };
    /** *
     * 移动点要素位置
     * 适用于rdnode，adNode，poi等
     */
    this.move = function (pid, type, data) {
        var param = {
            command: 'MOVE',
            dbId: App.Temp.dbId,
            type: type,
            objId: pid,
            data: data
        };
        return this.save(param);
    };
    /** *
     * 线要素修形
     * 适用于rdlink、adlink等
     */
    this.repair = function (pid, type, data) {
        var param = {
            command: 'REPAIR',
            dbId: App.Temp.dbId,
            type: type,
            objId: pid,
            data: data
        };
        return this.save(param);
    };
    /** *
     * 打断link
     * 适用于rdlink、adlink等
     */
    this.break = function (pid, type, data) {
        var param = {
            command: 'BREAK',
            dbId: App.Temp.dbId,
            type: type,
            objId: pid,
            data: data
        };
        return this.save(param);
    };
    /** *
     * poi要素创建父poi
     */
    this.createParent = function (pid, newParentPid) {
        var param = {
            command: 'CREATE',
            dbId: App.Temp.dbId,
            type: 'IXPOIPARENT',
            objId: pid,
            parentPid: newParentPid
        };
        return this.save(param);
    };
    /** *
     * poi要素修改父poi
     */
    this.updateParent = function (pid, newParentPid) {
        var param = {
            command: 'UPDATE',
            dbId: App.Temp.dbId,
            type: 'IXPOIPARENT',
            objId: pid,
            parentPid: newParentPid
        };
        return this.save(param);
    };
    /** *
     * poi要素删除父poi
     */
    this.deleteParent = function (pid) {
        var param = {
            command: 'DELETE',
            dbId: App.Temp.dbId,
            type: 'IXPOIPARENT',
            objId: pid
        };
        return this.save(param);
    };
    this.updateTopo = function (pid, type, data) {
        var param = {
            command: 'UPDATETOPO',
            dbId: App.Temp.dbId,
            type: type,
            objId: pid,
            data: data
        };
        return this.save(param);
    };
    /** *
     * 属性和几何编辑相关 editGeometryOrProperty
     * @param param
     * @param func
     */
    this.save = function (param) {
        toggleLoading(true); // 打开主页面的loadingbar
        var opDesc = {
            CREATE: '创建' + [param.type],
            UPDOWNDEPART: '创建上下线分离',
            BREAK: '打断' + [param.type],
            UPDATE: '更新' + [param.type] + '属性',
            DELETE: '删除' + [param.type],
            MOVE: '移动' + [param.type] + '点位',
            BATCH: '批量操作' + [param.type],
            REPAIR: [param.type] + '修形',
            CREATEPARENT: 'POI增加父',
            UPDATEPARENT: 'POI更新父',
            DELETEPARENT: 'POI解除父',
            UPDATETOPO: '更新' + [param.type] + '拓扑',
            DEPART: '分离节点'
        }[param.command];
        if (param.type == 'IXPOI' && param.data) { // poi属性不修改也可进行保存，所以需要进行特殊处理
            var keys = Object.keys(param.data);
            if (keys.length == 3 && param.data.rowId && param.data.objStatus && param.data.pid) {
                opDesc = param.type;
            }
        }
        if (param.command === 'UPDATETOPO') {
            param.command = 'UPDATE';
        }
        var defer = $q.defer();
        var url = 'edit/run/';
        if (param.type == 'IXPOI' || param.type == 'IXPOIPARENT' || param.type == 'IXSAMEPOI') {
            url = 'editrow/run/';
        }
        param = JSON.stringify(param);
        ajax.get(url, {
            parameter: param // .replace(/\+/g, '%2B')
        }).success(function (data) {
            if (data.errcode == 0) { // 操作成功
                dsOutput.pushAll(data.data.log);
                dsOutput.push({
                    op: opDesc + '操作成功',
                    type: 'succ',
                    pid: '0',
                    childPid: ''
                });
                // 由于直接弹出提示然后执行后续操作会导致uilayout的布局有问题，因此改成回调方式执行后续操作
                // swal(opDesc + "操作成功", "", "success");
                // 2016-9-29 by chenx:各位老大要求操作成功时不进行弹出提示了
                // swal({
                //     title: opDesc + "操作成功",
                //     type: "success",
                //     timer: 2000,
                //     showConfirmButton: false,
                //     allowEscapeKey: false
                // }, function() {
                //     swal.close();
                defer.resolve(data.data);
                // });
            } else if (data.errcode == 999) { // 删除前的检查返回的确认信息
                defer.resolve(data.data);
            } else if (data.errcode < 0) { // 操作失败
                dsOutput.push({
                    op: opDesc + '操作出错：' + data.errmsg,
                    type: 'fail',
                    pid: data.errcode,
                    childPid: ''
                });
                // swal(opDesc + "操作出错：", data.errmsg, "error");
                swal({
                    title: opDesc + '操作出错：' + data.errmsg,
                    type: 'error',
                    // timer: 2000,
                    // showConfirmButton: false,
                    allowEscapeKey: false
                }, function () {
                    defer.resolve(null);
                });
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false); // 关闭主页面的loadingbar
        });
        return defer.promise;
    };
    /** *
     * 申请Pid
     */
    this.applyPid = function (type) {
        var defer = $q.defer();
        ajax.get('edit/applyPid', {
            parameter: JSON.stringify({
                type: type
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('申请Pid出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 执行检查信息
     * @returns {Promise}
     */
    this.runCheck = function (checkType) {
        var defer = $q.defer();
        var params = {
            subtaskId: App.Temp.subTaskId,
            checkType: checkType // 0 poi行编，1poi精编, 2道路
        };
        ajax.get('edit/check/run', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('执行检查信息出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * POI提交接口
     * @param param
     * @returns {Promise}
     */
    this.submitPoi = function (param) {
        var defer = $q.defer();
        ajax.get('editrow/poi/base/release', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                dsOutput.push({
                    op: 'POI提交操作成功',
                    type: 'succ',
                    pid: '0',
                    childPid: ''
                });
                defer.resolve(data.data);
            } else {
                dsOutput.push({
                    op: 'POI提交操作失败',
                    type: 'fail',
                    pid: '0',
                    childPid: ''
                });
                defer.resolve('提交POI出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 创建后台任务
     * @param jobId
     * @returns {Promise}
     */
    this.createJob = function (jobType, requestParam) {
        var defer = $q.defer();
        ajax.get('job/create/', {
            parameter: JSON.stringify({
                jobType: jobType,
                request: requestParam
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('创建后台任务失败：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 查询后台任务进度
     * @param jobId
     * @returns {Promise}
     */
    this.getJobById = function (jobId) {
        var defer = $q.defer();
        ajax.get('job/get/', {
            parameter: JSON.stringify({
                jobId: jobId
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('查看后台任务进度失败：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 搜索
    this.getSearchData = function (num, sType, content) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            pageNum: num,
            pageSize: 5,
            data: {}
        };
        if (sType == 'linkPid') {
            params.type = 'RDLINK';
        } else if (sType == 'rdName') {
            sType = 'name';
            params.type = 'RDLINK';
        } else if (sType == 'pid') {
            params.type = 'IXPOI';
        } else if (sType == 'name') {
            params.type = 'IXPOI';
        }
        params.data[sType] = content;
        ajax.get('edit/getByElementCondition', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('搜索信息出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 面批处理;
    this.PolygonBatchWork = function (params) {
        var defer = $q.defer();
        var param = {
            command: 'ONLINEBATCH',
            type: 'FACE',
            dbId: App.Temp.dbId,
            pid: params.pid,
            ruleId: params.ruleId
        };
        ajax.get('edit/run', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查看后台任务进度失败：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 搜索批处理包;
    this.batchBox = function (params) {
        var defer = $q.defer();
        var param = {
            pageSize: params.pageNumber,
            pageNum: params.currentPage,
            type: params.batchType
        };
        ajax.get('edit/batch/getBatchRules', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('搜索信批处理包出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 执行批处理;
    this.exeOnlinebatch = function (params) {
        var defer = $q.defer();
        var param = {
            subtaskId: params.taskId,
            batchRules: params.ruleCode,
            batchType: params.type
        };
        ajax.get('edit/batch/run', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('执行批处理出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 搜索檢查;
    this.seachCheckBox = function (params) {
        var defer = $q.defer();
        var param = {
            pageSize: params.pageNumber,
            pageNum: params.currentPage,
            type: params.checkType
        };
        ajax.get('edit/check/getCkRules', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('查询检查包出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    // 执行檢查;
    this.exeOnlineSearch = function (params) {
        var defer = $q.defer();
        var param = {
            subtaskId: params.taskId,
            ckRules: params.ruleCode,
            checkType: params.type
        };
        ajax.get('edit/check/run', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('执行检查出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 修改对象属性
     */
    this.batchUpdate = function (linkPids, type, data) {
        delete data['pids'];
        delete data['pid'];

        var param = {
            command: 'BATCH',
            dbId: App.Temp.dbId,
            type: type,
            data: data,
            linkPids: linkPids
        };
        return this.save(param);
    }
    /**
     * 根据pids获取要素详细属性
     * @param id     要素PID
     * @param type   要素类型
     * @param alertError   是否弹出错误信息
     */
    this.getByPids = function (pids, type, alertError) {
        var defer = $q.defer();
        var params = {
            dbId: App.Temp.dbId,
            type: type,
            pids: pids
        };
        if (alertError === undefined) {
            alertError = true;
        }
        ajax.get('edit/getByPids', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode === 0) {
                defer.resolve(data.data);
            } else {
                if (alertError) {
                    swal('根据Pids查询' + type + '数据出错：', data.errmsg, 'error');
                }
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 道路名库檢查;
     * @param num
     * @returns {Promise}
     */
    this.getRoadNameCheckResult = function (num) {
        var defer = $q.defer();
        var param = {
            subtaskId: parseInt(App.Util.getUrlParam('subtaskId')),
            pageSize: 5,
            pageNum: num,
            type:2
        };
        ajax.get('edit/check/listRdnResult/', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询检查结果出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     * 修改道路名库检查结果状态
     * @param id
     * @param type
     * @returns {Promise}
     */
    this.updateRdNCheckType = function (id , type) {
        var defer = $q.defer();
        var param = {
            id: id,
            type: type
        };
        ajax.get('edit/check/updateRdnResult/', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('修改检查结果状态出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);