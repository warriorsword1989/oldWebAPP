angular.module('app').controller('PoiDataListCtl', ['$scope', '$rootScope','NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout','dsOutput',
    function(scope, $rootScope, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout,dsOutput) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var evtCtrl = fastmap.uikit.EventController();
        var layerCtrl = fastmap.uikit.LayerController();
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var poiLayer = layerCtrl.getLayerById('poi');
        var _self = scope;
        scope.radio_select = '名称';
        //当前表格数据;
        scope.finalData = null;
        /*初始化显示table提示*/
        scope.poiListTableMsg = '数据加载中...';
        /*切换poi列表类型*/
        scope.changeDataList = function(val) {
            scope.dataListType = val;
            if(scope.filters.name || scope.filters.pid ){
                scope.filters.name = ""; //当过滤条件发生变化时会自动调用表格的查询
                scope.filters.pid = null;
            } else {
                _self.tableParams.reload();
            }
            //initPoiTable();
        };
        /*选择数据查找poi详情*/
        scope.selectData = function(data, index) {
            if(!(data && data.pid)){
                return ;
            }
            //scope.$parent.$parent.selectPoiInMap = false; //表示poi是列表中选择的
            scope.rootCommonTemp.selectPoiInMap = false; //表示poi是列表中选择的
            scope.$emit('closePopoverTips', false);
            scope.$parent.$parent.showLoading = true;
            //if(data.status == 3 || data.uRecord == 3) { // 提交、删除状态的POI不允许编辑
            if(data.status == 3 || data.state == 2) { // 提交、删除状态的POI不允许编辑   state --1新增，2删除 3修改
                $rootScope.isSpecialOperation = true;
            } else {
                if(!scope.specialWork) { // 非专项作业
                    $rootScope.isSpecialOperation = false;
                }
            }
            dsEdit.getByPid(data.pid, "IXPOI").then(function(rest) {
                scope.$parent.$parent.showLoading = false;
                if (rest) {
                    scope.getCurrentKindByLittle(rest); //获取当前小分类所对应的大分类下的所有小分类

                    objCtrl.setCurrentObject('IXPOI', rest);
                    objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                    evtCtrl.fire(evtCtrl.eventTypes.SELECTBYATTRIBUTE, {
                        feature: objCtrl.data
                    });
                    //scope.$emit("SWITCHCONTAINERSTATE", {});
                    scope.$emit("transitCtrlAndTpl", {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.poi + "ctrls/attr-tips/poiPopoverTipsCtl",
                        "propertyHtml": appPath.root + appPath.poi + "tpls/attr-tips/poiPopoverTips.html"
                    });
                    scope.$emit("transitCtrlAndTpl", {
                        "loadType": "attrTplContainer",
                        "propertyCtrl": appPath.poi + "ctrls/attr-base/generalBaseCtl",
                        "propertyHtml": appPath.root + appPath.poi + "tpls/attr-base/generalBaseTpl.html"
                    });
                    scope.highlightPoi(rest.pid);
                    scope.$emit("highLightPoi", rest.pid);
                    scope.$emit("refreshPhoto", true);
                    scope.$emit("clearAttrStyleUp");//清除属性样式
                }
            });
            scope.itemActive = index;
        };
        /**
         * 删除、保存POI之后需要把POI从表格中删除
         */
        evtCtrl.off(evtCtrl.eventTypes.CHANGEPOILIST);
        evtCtrl.on(evtCtrl.eventTypes.CHANGEPOILIST, function(obj) {
            if (scope.dataListType == 1) { //表示的是待作业
                for (var i = 0, len = scope.tableParams.data.length; i < len; i++) {
                    if (scope.tableParams.data[i].pid == obj.poi.pid) {
                        scope.tableParams.data.splice(i, 1);
                        break;
                    }
                }
                if(scope.tableParams.data[i]){ //排除最后一条报错的问题
                    scope.selectData(scope.tableParams.data[i], i);
                } else { //最后一条
                    scope.$emit("reQueryByPid",{"pid":obj.poi.pid,"type":"IXPOI"});
                }
            } else if (scope.dataListType == 2) { //已作业
                // if(obj.flag == 'del'){
                //     for (var i = 0, len = scope.tableParams.data.length; i < len; i++) {
                //         if (scope.tableParams.data[i].pid == obj.poi.pid) {
                //             scope.tableParams.data.splice(i, 1);
                //             break;
                //         }
                //     }
                //     if(scope.tableParams.data[i]){
                //         scope.selectData(scope.tableParams.data[i], i);
                //     } else {//最后一条
                //         scope.$emit("reQueryByPid",{"pid":obj.poi.pid,"type":"IXPOI"});
                //     }
                // } else if (obj.flag  == "update") {
                //     for (var i = 0, len = scope.tableParams.data.length; i < len; i++) {
                //         if (scope.tableParams.data[i].pid == obj.poi.pid) {
                //             scope.tableParams.data[i].name = obj.poi.name.name;
                //             scope.tableParams.data[i].kindCode = obj.poi.kindCode;
                //             scope.tableParams.data[i].state = 3;//修改
                //             break;
                //         }
                //     }
                //     if(i < scope.tableParams.data.length -1){
                //         scope.selectData(scope.tableParams.data[i+1], i+1);
                //     } else { //最后一条
                //         scope.$emit("reQueryByPid",{"pid":obj.poi.pid,"type":"IXPOI"});
                //     }
                // }
                if (obj.flag  == "update" || obj.flag == 'del') {
                    for (var i = 0, len = scope.tableParams.data.length; i < len; i++) {
                        if (scope.tableParams.data[i].pid == obj.poi.pid) {
                            scope.tableParams.data[i].name = obj.poi.name.name;
                            scope.tableParams.data[i].kindCode = obj.poi.kindCode;
                            if(obj.flag  == "update"){
                                //scope.tableParams.data[i].state = 3;//修改 保存不会修改数据状态(不存在数据状态为无的数据)
                            } else if (obj.flag  == "del"){
                                scope.tableParams.data[i].state = 2;//删除
                            }
                            break;
                        }
                    }
                    if(i < scope.tableParams.data.length -1){
                        scope.selectData(scope.tableParams.data[i+1], i+1);
                    } else { //最后一条
                        scope.$emit("reQueryByPid",{"pid":obj.poi.pid,"type":"IXPOI"});
                    }
                }
            }
        });
        /*键盘控制poilist切换*/
        $document.bind("keyup", function(event) {
            if (event.keyCode == 34 || event.keyCode == 33) {
                if (scope.itemActive < scope.poiList.length - 1 && event.keyCode == 34) {
                    scope.itemActive++;
                    _refreshData();
                }
                if (scope.itemActive != 0 && event.keyCode == 33) {
                    scope.itemActive--;
                    _refreshData();
                }
                /*刷新poi，弹出tips*/
                function _refreshData() {
                    scope.selectData(scope.poiList[scope.itemActive], scope.itemActive);
                    scope.$apply();
                }
            }
        });
        //初始化ng-table表头;
        scope.cols = [{
                field: "num_index",
                title: "序号",
                width: '30px',
                show: true
            }, {
                field: "state",
                title: "状态",
                width: '30px',
                sortable: "state",
                getValue: getState,
                show: true
            }, {
                field: "name",
                title: "名称",
                width: '110px',
                sortable: "name",
                show: true
            }, {
                field: "kindCode",
                title: "分类",
                width: '60px',
                sortable: "kindCode",
                getValue: getKindName,
                show: true
            }, {
                field: "collectTime",
                title: "采集时间",
                width: '130px',
                sortable: "collectTime",
                show: false,
                getValue: getCollectTime
            }, {
                field: "pid",
                title: "PID",
                width: '100px',
                sortable: "pid",
                show: false
            },
            // {field: "geometry", title: "几何", sortable: "geometry", show: false},
            {
                field: "freshnessVefication",
                title: "鲜度验证",
                width: '60px',
                sortable: "freshnessVefication",
                show: false,
                getValue: getFreshnessVefication
            }
        ];

        //初始化显示表格字段方法;
        scope.initShowField = function(params) {
            for (var i = 0; i < scope.cols.length; i++) {
                for (var j = 0; j < params.length; j++) {
                    if (scope.cols[i].title == params[j]) {
                        scope.cols[i].show = true;
                    }
                }
            }
        };
        //重置表格字段显示方法;
        scope.resetTableField = function() {
            for (var i = 0; i < scope.cols.length; i++) {
                if (scope.cols[i].show) {
                    scope.cols[i].show = !scope.cols[i].show;
                }
            }
        };
        //表格配置搜索;
        scope.filters = {
            value: '',
            name: '',
            pid: 0
        };
        scope.searchType = 'name';
        /*改变搜索类型*/
        scope.changeSearchType = function(type) {
            scope.searchType = type;
            scope.filters.value = '';
            scope.filters.name = '';
            scope.filters.pid = 0;
        };
        //切换搜索条件清空输入;
        /*scope.$watch('radio_select',function(newValue,oldValue,scope){
         scope.filters.value = '';
         scope.filters.name = '';
         scope.filters.pid = 0;
         });*/
        //刷新表格方法;
        var refreshData = function() {
            _self.tableParams.reload();
        };
        scope.total = 0;
        function initPoiTable() {
            _self.tableParams = new NgTableParams({
                page: 1,
                count: 20,
                filter: scope.filters
            }, {
                counts: [],
                getData: function($defer, params) {
                    var param = {
                        dbId: App.Temp.dbId,
                        subtaskId: App.Temp.subTaskId,
                        type: scope.dataListType,
                        pageNum: params.page(),
                        pageSize: params.count(),
                        pidName: params.filter().name,
                        pid: parseInt(params.filter().pid || 0)
                    };
                    dsEdit.getPoiList(param).then(function(data) {
                        scope.poiListTableMsg = '列表无数据';
                        if(data){
                            scope.poiList = data.rows;
                            scope.total = data.total;
                            _self.tableParams.total(data.total);
                            $defer.resolve(data.rows);
                        } else {
                            scope.poiList = [];
                            scope.total = 0;
                            _self.tableParams.total(0);
                            $defer.resolve([]);
                        }
                    });
                }
            });
        };
        //给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function() {
            scope.itemActive = -1;
            angular.forEach(scope.tableParams.data, function(data, index) {
                data.num_index = (scope.tableParams.page() - 1) * scope.tableParams.count() + index + 1;
            })
        });
        /*初始化方法*/
        initPoiTable();
        /*-----------------------------------格式化函数部分----------------------------------*/
        /*采集时间*/
        function getCollectTime(scope, row) {
            var temp = '';
            if (row.collectTime) {
                temp = Utils.dateFormat(row.collectTime);
            } else {
                temp = '无';
            }
            return $sce.trustAsHtml(temp);
        }
        /*新鲜度验证*/
        function getFreshnessVefication(scope, row) {
            return $sce.trustAsHtml(row.freshnessVefication == 0 ? '否' : '是');
        }
        /*新鲜度验证*/
        function getKindName(scope, row) {
            if(row.kindCode){
                if(scope.metaData.kindFormat[row.kindCode] && scope.metaData.kindFormat[row.kindCode].kindName){
                    return $sce.trustAsHtml(scope.metaData.kindFormat[row.kindCode].kindName);
                }else {
                    return $sce.trustAsHtml("");
                }
            } else {
                return $sce.trustAsHtml("");
            }

        }
        function getState(scope, row) {
            return $sce.trustAsHtml({0:'无',1: '增', 2:'删', 3:'改'}[row.state]);
        }
        scope.highlightPoi = function(pid) {
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures.length = 0;
            // $scope.clearMap();
            var highLightFeatures = [];
            highLightFeatures.push({
                id: pid,
                layerid: 'poi',
                type: 'IXPOI',
                style: {}
            });
            //高亮
            highRenderCtrl.highLightFeatures = highLightFeatures;
            highRenderCtrl.drawHighlight();
            map.setView([objCtrl.data.geometry.coordinates[1], objCtrl.data.geometry.coordinates[0]], 18);
        };
        /**
         * POI提交
         * 返回成功后刷新POI列表，重新绘制POI图层
         */
        scope.doSubmitData = function() {
            swal({
                title: "确认提交？",
                type: "warning",
                animation: 'none',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: "是的，我要提交",
                cancelButtonText: "取消"
            }, function(f) {
                if (f) {
                    scope.$emit("SWITCHCONTAINERSTATE", {
                        attrContainerTpl: false,
                        subAttrContainerTpl: false
                    });
                    //scope.$parent.$parent.showLoading = true;
                    $timeout(function(){
                        scope.$emit("showFullLoadingOrNot",true); //初次打开必须要等待会儿
                    });
                    var param = {
                        dbId: App.Temp.dbId,
                        gridIds: App.Temp.gridList
                    };
                    dsEdit.submitPoi(param).then(function(jobId) {
                        if (jobId) {
                            var timer = $interval(function() {
                                dsEdit.getJobById(jobId).then(function(data) {
                                    scope.$emit("refreshCheckResultToMainPage"); //刷新检查结果数据

                                    if (data.status == 3 || data.status == 4) { //1-创建，2-执行中 3-成功 4-失败
                                        //scope.$parent.$parent.showLoading = false;
                                        scope.$emit("showFullLoadingOrNot",false);
                                        refreshData();
                                        poiLayer.redraw();
                                        $interval.cancel(timer);
                                        if (data.status == 3) {
                                            dsOutput.push({
                                                "op": "POI提交JOB执行成功",
                                                "type": "succ",
                                                "pid": "0",
                                                "childPid": ""
                                            });
                                            swal("提交提示", '提交完成', "info");
                                        } else {
                                            dsOutput.push({
                                                "op": "POI提交JOB执行失败",
                                                "type": "fail",
                                                "pid": "0",
                                                "childPid": ""
                                            });
                                            swal("提交提示", '提交失败,' + data.latestStepMsg, "warning");
                                        }
                                    }
                                });
                            }, 500);
                        } else {
                            scope.$emit("refreshCheckResultToMainPage"); //刷新检查结果数据
                        }
                    });
                }
            });
        }
    }
]);