angular.module('app', ['oc.lazyLoad','fastmap.uikit', 'ui.layout', 'ngTable', 'localytics.directives', 'dataService', 'angularFileUpload', 'angular-drag', 'ui.bootstrap', 'ngSanitize']).constant("appPath", {
    root: App.Util.getAppPath() + "/",
    meta: "scripts/components/meta/",
    road: "scripts/components/road/",
    poi: "scripts/components/poi/",
    tool: "scripts/components/tools/"
}).controller('EditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsMeta', 'dsFcc', 'dsEdit', 'dsManage', '$q', 'appPath', '$timeout',
    function($scope, $ocLazyLoad, $rootScope, dsMeta, dsFcc, dsEdit, dsManage, $q, appPath, $timeout) {
        var eventCtrl = new fastmap.uikit.EventController();
        $scope.appPath = appPath;
        $scope.metaData = {}; //存放元数据
        $scope.metaData.kindFormat = {}, $scope.metaData.kindList = [], $scope.metaData.allChain = {};
        $scope.showLoading = true;
        $scope.showTab = true;
        $scope.selectedTool = 1;
        $scope.dataListType = 1;
        $scope.projectType = 1; //1--POI作业，其他为道路作业
        $scope.outputType = 1;
        //面板显示控制开关
        $scope.editorPanelOpened = 'none';
        $scope.suspendPanelOpened = false;
        $scope.consolePanelOpened = false;
        $scope.selectPoiInMap = false; //false表示从poi列表选择，true表示从地图上选择
        //$scope.controlFlag = {}; //用于父Scope控制子Scope
        $scope.outErrorArr = [false, true, true, false]; //输出框样式控制
        // $scope.outputResult = []; //输出结果
        /*切换项目平台*/
        $scope.changeProject = function(type) {
            $scope.showLoading = true;
            $scope.showPopoverTips = false;
            $scope.tipsPanelOpened = false;
            if (type == 1) { //poi
                $ocLazyLoad.load(appPath.poi + 'ctrls/attr-base/poiDataListCtl').then(function() {
                    $scope.dataListTpl = appPath.root + appPath.poi + 'tpls/attr-base/poiDataListTpl.html';
                    $scope.showLoading = false;
                });
            } else { //道路
                $ocLazyLoad.load(appPath.road + 'ctrls/layers_switch_ctrl/filedsResultCtrl').then(function() {
                    $scope.dataListTpl = appPath.root + appPath.road + 'tpls/layers_switch_tpl/filedsResultTpl.html';
                    $scope.showLoading = false;
                });
            }
            $scope.projectType = type;
        };
        $scope.selectedTool = 1;
        //切换成果-场景栏中的显示内容
        $scope.changeEditTool = function(id) {
            if (id === "tipsPanel") {
                $scope.showTab = true;
                $scope.selectedTool = 1;
                $scope.changeProject($scope.projectType);
            } else if (id === "scenePanel") {
                $scope.showTab = false;
                $scope.selectedTool = 2;
                $ocLazyLoad.load(appPath.road + 'ctrls/layers_switch_ctrl/sceneLayersCtrl').then(function() {
                    $scope.dataListTpl = appPath.root + appPath.road + 'tpls/layers_switch_tpl/sceneLayers.html';
                });
            }
        };
        //属性栏开关逻辑控制
        $scope.attrTplContainerSwitch = function(flag) {
            if (flag) {
                $scope.editorPanelOpened = flag;
            } else {
                $scope.editorPanelOpened = 'none';
            }
        };
        //次属性开关逻辑控制
        $scope.subAttrTplContainerSwitch = function(flag) {
            $scope.suspendPanelOpened = flag;
        }
        $scope.changeProperty = function(val) {
            $scope.propertyType = val;
        };
        $scope.changeOutput = function(val) {
            $scope.outputType = val;
        };
        /*关闭全屏查看*/
        $scope.closeFullScreen = function() {
            $scope.showFullScreen = false;
        };
        /*隐藏tips图片*/
        $scope.hideFullPic = function() {
            $scope.roadFullScreen = false;
        };
        /**
         * 工具按钮控制
         */
        $scope.classArr = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]; //按钮样式的变化
        $scope.changeBtnClass = function(id) {
            $scope.$broadcast("resetButtons", {});
            // for (var claFlag = 0, claLen = $scope.classArr.length; claFlag < claLen; claFlag++) {
            //     if (claFlag === id) {
            //         $scope.classArr[claFlag] = !$scope.classArr[claFlag];
            //     } else {
            //         $scope.classArr[claFlag] = false;
            //     }
            // }
            $timeout(function() { //为了解决按esc键后工具条按钮不能恢复的bug
                $scope.$apply();
            }, 1);
        };

        function loadMap(data) {
            var layerCtrl = new fastmap.uikit.LayerController({
                config: App.layersConfig
            });
            map = L.map('map', {
                attributionControl: false,
                doubleClickZoom: false,
                zoomControl: false
            });
            //高亮作业区域
            var substaskGeomotry = data.geometry;
            var pointsArray = hightLightWorkArea(substaskGeomotry);
            var lineLayer = L.multiPolygon(pointsArray, {
                fillOpacity: 0
            });
            map.addLayer(lineLayer);
            map.on("zoomend", function(e) {
                document.getElementById('zoomLevelBar').innerHTML = "缩放等级:" + map.getZoom();
                // if(map.getZoom() > 16){
                //     if(map.hasLayer(lineLayer)){
                //         map.removeLayer(lineLayer);
                //     }
                // }else {
                //     if(!map.hasLayer(lineLayer)){
                //         map.addLayer(lineLayer);
                //
                //     }
                // }
            });
            map.on('resize', function() {setTimeout(function() {map.invalidateSize()},400);});
            //map.setView([40.012834, 116.476293], 17);
            map.fitBounds(lineLayer.getBounds());
            //属性编辑ctrl(解析对比各个数据类型)
            var shapeCtrl = new fastmap.uikit.ShapeEditorController();
            var tooltipsCtrl = new fastmap.uikit.ToolTipsController();
            tooltipsCtrl.setMap(map, 'tooltip');
            shapeCtrl.setMap(map);
            layerCtrl.eventController.on(eventCtrl.eventTypes.LAYERONSHOW, function(event) {
                if (event.flag == true) {
                    map.addLayer(event.layer);
                } else {
                    map.removeLayer(event.layer);
                }
            })
            for (var layer in layerCtrl.getVisibleLayers()) {
                map.addLayer(layerCtrl.getVisibleLayers()[layer]);
            }
        }
        // 加载元数据
        var loadMetaData = function() {
            var promises = [];
            // 查询全部的小分类数据
            var param = {
                mediumId: "",
                region: 0
            };
            promises.push(dsMeta.getKindList(param).then(function(kindData) {
                //在数组最前面增加
                kindData.unshift({
                    "id": "0",
                    "kindCode": "0",
                    "kindName": "--请选择--"
                });
                /*解析分类，组成select-chosen需要的数据格式*/
                for (var i = 0; i < kindData.length; i++) {
                    /**
                     * 需要排除充电桩、充电站,中分类需要查询再定
                     **/
                    $scope.metaData.kindFormat[kindData[i].kindCode] = {
                        kindId: kindData[i].id,
                        kindName: kindData[i].kindName,
                        level: kindData[i].level,
                        extend: kindData[i].extend,
                        parentFlag: kindData[i].parent,
                        chainFlag: kindData[i].chainFlag,
                        dispOnLink: kindData[i].dispOnLink,
                        mediumId: kindData[i].mediumId
                    };
                    $scope.metaData.kindList.push({
                        value: kindData[i].kindCode,
                        text: kindData[i].kindName,
                        mediumId: kindData[i].mediumId
                    });
                }
            }));
            // 查询全部的品牌数据
            param = {
                kindCode: ""
            };
            promises.push(dsMeta.getChainList(param).then(function(chainData) {
                $scope.metaData.allChain = chainData;
            }));
            return promises;
        };
        var loadToolsPanel = function(callback) {
            $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/toolbarCtrl.js').then(function() {
                $scope.mapToolbar = appPath.root + 'scripts/components/tools/tpls/toolbar-map/toolbarTpl.htm';
                if (callback) {
                    callback();
                }
            });
            $ocLazyLoad.load(appPath.poi + 'ctrls/edit-tools/optionBarCtl').then(function() {
                $scope.consoleDeskTpl = appPath.root + appPath.poi + 'tpls/edit-tools/optionBarTpl.html';
            });
            //
            // $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/selectShapeCtrl').then(function() {
            //     $scope.selectShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/selectShapeTpl.html';
            //     $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/addShapeCtrl').then(function() {
            //         $scope.addShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addShapeTpl.html';
            //         $ocLazyLoad.load(appPath.poi + 'ctrls/toolBar_cru_ctrl/selectPoiCtrl').then(function() {
            //             $scope.selectPoiURL = appPath.root + appPath.poi + 'tpls/toolBar_cru_tpl/selectPoiTpl.html';
            //             $ocLazyLoad.load(appPath.poi + 'ctrls/toolBar_cru_ctrl/addPoiCtrl').then(function() {
            //                 $scope.addPoiURL = appPath.root + appPath.poi + 'tpls/toolBar_cru_tpl/addPoiTpl.html';
            //                 $ocLazyLoad.load(appPath.poi + 'ctrls/edit-tools/optionBarCtl').then(function() {
            //                     $scope.consoleDeskTpl = appPath.root + appPath.poi + 'tpls/edit-tools/optionBarTpl.html';
            //                     $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/selectAdShapeCtrl').then(function() {
            //                         $scope.selectAdShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/selectAdShapeTpl.html';
            //                         $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/addAdShapeCtrl').then(function() {
            //                             $scope.addAdShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addAdShapeTpl.html';
            //                             $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/selectRwShapeCtrl').then(function() {
            //                                 $scope.selectRwShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/selectRwShapTpl.html';
            //                                 $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/addRwShapeCtrl').then(function() {
            //                                     $scope.addRwShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addRwShapTpl.html';
            //                                     $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/selectZoneShapeCtrl').then(function() {
            //                                         $scope.selectZoneShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/selectZoneShapeTpl.html';
            //                                         $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/addZoneShapeCtrl').then(function() {
            //                                             $scope.addZoneShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addZoneShapeTpl.html';
            //                                             if (callback) {
            //                                                 callback();
            //                                             }
            //                                         });
            //                                     });
            //                                 });
            //                             });
            //                         });
            //                     });
            //                 });
            //             });
            //         });
            //     });
            // });
        };
        //页面初始化方法调用
        var initPage = function() {
            var subtaskId = App.Util.getUrlParam("subtaskId");
            App.Temp.subTaskId = subtaskId;
            dsManage.getSubtaskById(subtaskId).then(function(data) {
                if (data) {
                    // 暂时注释
                    App.Temp.dbId = data.dbId;
                    App.Temp.gridList = data.gridIds;
                    if (data.stage == 1) { // 日编
                        App.Temp.mdFlag = "d";
                    } else if (data.stage == 2) { // 月编
                        App.Temp.mdFlag = "m";
                    } else { // 默认：日编
                        App.Temp.mdFlag = "d";
                    }
                    loadMap(data);
                    var promises = loadMetaData();
                    $q.all(promises).then(function() {
                        loadToolsPanel(function() {
                            if (data.type == 0) { // POI任务
                                $scope.changeProject(1);
                            } else { // 一体化、道路、专项任务
                                $scope.changeProject(2);
                            }
                            bindHotKeys($ocLazyLoad, $scope, dsEdit, appPath); //注册快捷键
                        });
                    });
                }
            });
        };
        //高亮作业区域方法;
        function hightLightWorkArea(substaskGeomotry) {
            var wkt = new Wkt.Wkt();
            var pointsArr = new Array();
            //读取wkt格式的集合对象;
            try {
                var polygon = wkt.read(substaskGeomotry);
                var coords = polygon.components;
                var points = [];
                var point = [];
                var poly = [];
                for (var i = 0; i < coords.length; i++) {
                    for (var j = 0; j < coords[i].length; j++) {
                        if (polygon.type == 'multipolygon') {
                            for (var k = 0; k < coords[i][j].length; k++) {
                                point.push(new L.latLng(coords[i][j][k].y, coords[i][j][k].x));
                            }
                        } else {
                            point.push(new L.latLng(coords[i][j].y, coords[i][j].x));
                        }
                    }
                    points.push(point);
                    point = [];
                }
                return points;
            } catch (e1) {
                try {
                    wkt.read(substaskGeomotry.replace('\n', '').replace('\r', '').replace('\t', ''));
                } catch (e2) {
                    if (e2.name === 'WKTError') {
                        swal("错误", 'WKT数据有误，请检查！', "error");
                        return;
                    }
                }
            }
            //function loopPolygonfunc(parmas){
            //    if(typeof parmas==='object'){
            //        if(parmas.length){
            //            for(var i=0;i<parmas.length;i++){
            //                loopPolygonfunc(parmas[i])
            //            }
            //        }else{
            //            pointsArr.push(new L.latLng(parmas.y,parmas.x))
            //        }
            //    }
            //}
            //function loopmutiPolygonfunc(){
            //
            //}
            //
            //if(polygon.type=='polygon'){
            //    loopPolygonfunc(polygon.components);
            //}else{
            //    loopPolygonfunc(polygon.components);
            //}
            //return pointsArr;
        }
        /**
         * 页面初始化方法调用
         */
        initPage();
        /**
         * 保存数据
         */
        $scope.doSave = function() {
            eventCtrl.fire(eventCtrl.eventTypes.SAVEPROPERTY);
        };
        /**
         * 删除数据
         */
        $scope.doDelete = function() {
            swal({
                title: "确认删除？",
                type: "warning",
                animation: 'slide-from-top',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: "是的，我要删除",
                cancelButtonText: "取消"
            }, function(f) {
                if (f) {
                    eventCtrl.fire(eventCtrl.eventTypes.DELETEPROPERTY);
                }
            });
        };
        /**
         * 取消编辑
         */
        $scope.doCancel = function() {
            $scope.tipsPanelOpened = false;
            //$scope.attrTplContainer = "";
            $scope.attrTplContainerSwitch(false);
            //$scope.subAttrTplContainerSwitch(false);
            //eventCtrl.fire(eventCtrl.eventTypes.CANCELEVENT)
        };
        $scope.goback = function() {
            window.location.href = appPath.root + "apps/imeep/task/taskSelection.html?access_token=" + App.Temp.accessToken;
        };
        $scope.advancedTool = null;
        $scope.openAdvancedToolsPanel = function(toolType) {
            if ($scope.advancedTool == toolType) {
                return;
            }
            switch (toolType) {
                case 'search':
                    $ocLazyLoad.load(appPath.tool + 'ctrls/assist-tools/searchPanelCtrl').then(function() {
                        $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/searchPanelTpl.html';
                    });
                    // $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/searchPanelTpl.html';
                    break;
                case 'auto':
                    $ocLazyLoad.load(appPath.tool + 'ctrls/assist-tools/autofillJobPanelCtrl').then(function() {
                        $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/autofillJobPanelTpl.html';
                    });
                    // $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/autofillJobPanelTpl.html';
                    break;
                case 'batch':
                    $ocLazyLoad.load(appPath.tool + 'ctrls/assist-tools/batchJobPanelCtrl').then(function() {
                        $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/batchJobPanelTpl.html';
                    });
                    // $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/batchJobPanelTpl.html';
                    break;
            }
            $scope.advancedTool = toolType;
        };
        $scope.closeAdvancedToolsPanel = function() {
            $scope.advancedTool = null;
        };
        /*start 事件监听*******************************************************************/
        //响应选择要素类型变化事件，清除要素页面的监听事件
        eventCtrl.on(eventCtrl.eventTypes.SELECTEDFEATURETYPECHANGE, function(data) {
            if (eventCtrl.eventTypesMap[eventCtrl.eventTypes.SAVEPROPERTY]) {
                for (var i = 0, len = eventCtrl.eventTypesMap[eventCtrl.eventTypes.SAVEPROPERTY].length; i < len; i++) {
                    eventCtrl.off(eventCtrl.eventTypes.SAVEPROPERTY, eventCtrl.eventTypesMap[eventCtrl.eventTypes.SAVEPROPERTY][i]);
                }
            }
            if (eventCtrl.eventTypesMap[eventCtrl.eventTypes.DELETEPROPERTY]) {
                for (var j = 0, lenJ = eventCtrl.eventTypesMap[eventCtrl.eventTypes.DELETEPROPERTY].length; j < lenJ; j++) {
                    eventCtrl.off(eventCtrl.eventTypes.DELETEPROPERTY, eventCtrl.eventTypesMap[eventCtrl.eventTypes.DELETEPROPERTY][j]);
                }
            }
            if (eventCtrl.eventTypesMap[eventCtrl.eventTypes.CANCELEVENT]) {
                for (var k = 0, lenK = eventCtrl.eventTypesMap[eventCtrl.eventTypes.SAVEPROPERTY].length; k < lenK; k++) {
                    eventCtrl.off(eventCtrl.eventTypes.CANCELEVENT, eventCtrl.eventTypesMap[eventCtrl.eventTypes.CANCELEVENT][k]);
                }
            }
            if (eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTEDFEATURECHANGE]) {
                for (var k = 0, lenK = eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTEDFEATURECHANGE].length; k < lenK; k++) {
                    eventCtrl.off(eventCtrl.eventTypes.SELECTEDFEATURECHANGE, eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTEDFEATURECHANGE][k]);
                }
            }
        });
        /**
         * 监听要素类型切换事件
         */
        $scope.$on("SWITCHCONTAINERSTATE", function(event, data) {
            if (data.hasOwnProperty("attrContainerTpl")) {
                $scope.attrTplContainerSwitch(data["attrContainerTpl"]);
            }
            if (data.hasOwnProperty("subAttrContainerTpl")) {
                $scope.subAttrTplContainerSwitch(data["subAttrContainerTpl"]);
            }
        });
        /**
         * 监听组件加载请求事件
         */
        $scope.$on("transitCtrlAndTpl", function(event, data) {
            if (data["loadType"] === "subAttrTplContainer") {
                $scope.subAttrTplContainerSwitch(true);
                // $scope.subAttrTplContainer = "";
            } else if (data["loadType"] === "attrTplContainer") { //右边属性面板
                $scope.attrTplContainerSwitch(true);
                // $scope.attrTplContainer = "";
            } else if (data["loadType"] === "tipsTplContainer") {
                if ($scope["tipsTplContainer"] != data["propertyHtml"]) { // tips页面切换，取消原来的SELECTBYATTRIBUTE事件绑定
                    if(eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTBYATTRIBUTE]){
                        for (var k = 0, lenK = eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTBYATTRIBUTE].length; k < lenK; k++) {
                            eventCtrl.off(eventCtrl.eventTypes.SELECTBYATTRIBUTE, eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTBYATTRIBUTE][k]);
                        }
                    }
                }
                // $scope.attrTplContainer = "";
                $scope.tipsPanelOpened = true;
            } else if (data["loadType"] === "tipsPitureContainer") {
                if ($scope[data["loadType"]]) {
                    $scope.$broadcast("TRANSITTIPSPICTURE", {})
                    return;
                }
            } else if (data["loadType"] === "tipsVideoContainer") {
                if ($scope[data["loadType"]]) {
                    $scope.$broadcast("TRANSITTIPSVIDEO", {})
                    return;
                }
            }
            if (data["data"]) {
                $scope.subAttributeData = data["data"];
            }
            $ocLazyLoad.load(data["propertyCtrl"]).then(function() {
                $scope[data["loadType"]] = data["propertyHtml"];
                if (data["callback"]) {
                    data["callback"]();
                }
            });
            if (data['data'] && data['data'].geoLiveType == 'RDTOLLGATENAME') {
                $scope.$broadcast('refreshTollgateName',{});
            }
        });
        $scope.$on("refreshPhoto", function(event, data) {
            $scope.$broadcast('refreshImgsData', true);
        });
        $scope.$on("highLightPoi", function(event, pid) {
            $scope.$broadcast("highlightPoiByPid", pid);
            $scope.$broadcast("clearQueueItem", true);
            $scope.selectPoi = pid;
        });
        // $scope.checkPageNow = 1;
        /*高亮检查结果poi点*/
        $scope.$on('getHighlightData', function(event, data) {
            $scope.showOnMap(data.pid, data.type);
        });
        /*关闭Tips面板*/
        $scope.$on('closePopoverTips', function(event, img) {
            $scope.tipsPanelOpened = false;
        });
        /*全屏显示*/
        $scope.$on('showFullScreen', function(event, img) {
            $scope.pImageNow = img;
            $scope.showFullScreen = true;
        });
        /*接收全屏请求*/
        $scope.$on('showRoadFullScreen', function(event, data) {
            $scope.roadFullScreen = true;
        });
        $scope.$on('job-autofill', function(event, data) {
            if (data.status == 'begin') {
                $scope.autofillRunning = true;
            } else if (data.status == 'end') {
                $scope.autofillRunning = false;
                // $scope.closeAdvancedToolsPanel();
            }
        });
        $scope.$on('job-batch', function(event, data) {
            if (data.status == 'begin') {
                $scope.batchRunning = true;
            } else if (data.status == 'end') {
                $scope.batchRunning = false;
                // $scope.closeAdvancedToolsPanel();
            }
        });
        $scope.$on('job-search', function(event, data) {
            if (data.status == 'begin') {
                $scope.searching = true;
            } else if (data.status == 'end') {
                $scope.searching = false;
                // $scope.closeAdvancedToolsPanel();
            }
        });
		//清除表单修改后的样式
        $scope.$on("clearAttrStyleUp", function(event, data) {
            $scope.$broadcast("clearAttrStyleDown");
        });
    }
]);