angular.module('app').controller('PoiDataListCtl', ['$scope', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath','$interval','$timeout',
    function(scope, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath,$interval,$timeout) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var evtCtrl = fastmap.uikit.EventController();
        var layerCtrl = fastmap.uikit.LayerController();
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
            refreshData();
        };
        /*选择数据查找poi详情*/
        scope.selectData = function(data, index) {
            dsEdit.getByPid(data.pid, "IXPOI").then(function(rest) {
                if (rest) {
                    objCtrl.setCurrentObject('IXPOI', rest);
                    objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                    evtCtrl.fire(evtCtrl.eventTypes.SELECTBYATTRIBUTE, {
                        feature: objCtrl.data
                    });
                    scope.$emit("SWITCHCONTAINERSTATE", {});
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
                    scope.$emit("highLightPoi", rest.pid);
                    scope.$emit("refreshPhoto",true);
                }
            });
            scope.itemActive = index;
        };

        /**
         * 删除、保存POI之后需要把POI从表格中删除
         */
        evtCtrl.off(evtCtrl.eventTypes.CHANGEPOILIST);
        evtCtrl.on(evtCtrl.eventTypes.CHANGEPOILIST, function (poi){
            if(scope.dataListType == 1){ //表示的是待作业
                for (var i = 0 ,len = scope.tableParams.data.length;i<len;i++){
                    if(scope.tableParams.data[i].pid == poi.pid){
                        scope.tableParams.data.splice(i,1);
                        break;
                    }
                }
                scope.selectData(scope.tableParams.data[i],i);
                // $timeout(function(){
                //     scope.$apply();
                //     scope.selectData(scope.tableParams.data[i],i);
                //     //scope.$apply();
                // });
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
            width: '35px',
            show: true
        }, {
            field: "name",
            title: "名称",
            width: '135px',
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
            field: "uRecord",
            title: "更新记录",
            width: '60px',
            sortable: "uRecord",
            show: false
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
                        pid: parseInt(params.filter().pid)
                    };
                    dsEdit.getPoiList(param).then(function(data) {
                        scope.poiListTableMsg = '列表无数据';
                        scope.poiList = data.rows;
                        _self.tableParams.total(data.total);
                        $defer.resolve(data.rows);
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
            return $sce.trustAsHtml(scope.metaData.kindFormat[row.kindCode].kindName);
        }
        /**
         * POI提交
         * 返回成功后刷新POI列表，重新绘制POI图层
         */
        scope.doSubmitData = function (){
            swal({
                title: "确认提交？",
                type: "warning",
                animation: 'slide-from-top',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: "是的，我要提交",
                cancelButtonText: "取消"
            }, function(f) {
                if(f){
                    scope.$emit("SWITCHCONTAINERSTATE",{ attrContainerTpl:false,subAttrContainerTpl:false });
                    scope.$parent.$parent.showLoading = true;
                    var param = {
                        dbId:App.Temp.dbId,
                        gridIds:App.Temp.gridList
                    };
                    dsEdit.submitData(param).then(function (jobId){
                        if(jobId){
                            var timer = $interval(function(){
                                dsEdit.queryByJobId(jobId).then(function (data){
                                    if(data.status == 3 || data.status == 4){//3-成功 4-失败
                                        scope.$parent.$parent.showLoading = false;
                                        refreshData();
                                        poiLayer.redraw();
                                        $interval.cancel(timer);
                                        if(data.status == 3){
                                            swal("提交提示", '提交完成', "info");
                                        } else {
                                            swal("提交提示", '提交失败,'+data.latestStepMsg, "warning");
                                        }

                                    }
                                });
                            },500);

                        }
                    });
                }
            });

        }
    }
]);