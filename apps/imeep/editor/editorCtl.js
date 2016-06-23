angular.module('app', ['oc.lazyLoad', 'ui.layout', 'ngTable', 'localytics.directives', 'dataService', 'angularFileUpload', 'angular-drag', 'ui.bootstrap', 'ngSanitize']).constant("appPath", {
    root: App.Util.getAppPath() + "/",
    meta: "scripts/components/meta/",
    road: "scripts/components/road3/",
    poi: "scripts/components/poi3/",
    tool: "scripts/components/tools/"
}).controller('EditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsPoi', 'dsMeta', 'dsRoad', 'dsFcc', 'dsEdit', '$q', 'appPath', function($scope, $ocLazyLoad, $rootScope, dsPoi, dsMeta, dsRoad, dsFcc, dsEdit, $q, appPath) {
    var eventCtrl = new fastmap.uikit.EventController();
    $scope.metaData = {}; //存放元数据
    $scope.metaData.kindFormat = {}, $scope.metaData.kindList = [], $scope.metaData.allChain = {};
    $scope.showLoading = true;
    $scope.showTab = true;
    $scope.selectedTool = 1;
    $scope.dataListType = 1;
    $scope.projectType = 1;
    $scope.outputType = 1;
    //面板显示控制开关
    $scope.editorPanelOpened = 'none';
    $scope.suspendPanelOpened = false;
    $scope.consolePanelOpened = false;
    $scope.controlFlag = {}; //用于父Scope控制子Scope
    $scope.outErrorArr = [false, true, true, false]; //输出框样式控制
    $scope.outputResult = []; //输出结果
    /*切换项目平台*/
    $scope.changeProject = function(type) {
        $scope.showLoading = true;
        $scope.showPopoverTips = false;
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
        changePoi(function() {
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
        })
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
    /**
     * 显示poi基本信息，tips信息等
     */
    var showPoiInfo = function(data) {
        $scope.$broadcast("clearBaseInfo"); //清除样式
        $scope.editorPanelOpened = true; //打开右侧面板
        specialDetail(data); //名称组和地址组特殊处理
        $scope.poi = data;
        $scope.origPoi = angular.copy(data);
        // $scope.$broadcast('initPoiPopoverTipsCtl');  //调用poiPopoverTipsCtl.js初始化方法
        // $scope.$broadcast('refreshImgsData',$scope.poi.photos);
        // /*查询3DIcon*/
        // dsMeta.getCiParaIcon(data.poiNum).then(function (data) {
        //  $scope.poi.poi3DIcon = data;
        // });
        initOcll();
    };
    /*关闭全屏查看*/
    $scope.closeFullScreen = function() {
        $scope.showFullScreen = false;
    };
    /*隐藏tips图片*/
    $scope.hideFullPic = function() {
        $scope.roadFullScreen = false;
    };
    /*接收全屏请求*/
    $scope.$on('showRoadFullScreen', function(event, data) {
        $scope.roadFullScreen = true;
    });
    /*切换POI时进行保存提醒*/
    var changePoi = function(callback) {
        if ($scope.poi) {
            var change = $scope.poi.getChanges();
            console.info("change:", change);
            if (!FM.Util.isEmptyObject(change)) {
                swal({
                    title: "数据发生了修改是否保存？",
                    type: "warning",
                    animation: 'slide-from-top',
                    showCancelButton: true,
                    closeOnConfirm: true,
                    confirmButtonText: "保存",
                    cancelButtonText: "不保存"
                }, function(f) {
                    if (f) {
                        savePoi(callback);
                    } else {
                        if (callback) {
                            callback();
                        }
                    }
                });
            } else {
                if (callback) {
                    callback();
                }
            }
        } else {
            if (callback) {
                callback();
            }
        }
    };
    /**
     * 工具按钮控制
     */
    $scope.classArr = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]; //按钮样式的变化
    $scope.changeBtnClass = function(id) {
        for (var claFlag = 0, claLen = $scope.classArr.length; claFlag < claLen; claFlag++) {
            if (claFlag === id) {
                $scope.classArr[claFlag] = !$scope.classArr[claFlag];
            } else {
                $scope.classArr[claFlag] = false;
            }
        }
    };
    /*解析分类，组成select-chosen需要的数据格式*/
    var initKindFormat = function(kindData) {
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
    };
    /**
     * 元数据接口联调测试
     * @type {Array}
     */
    //metaTest();
    function metaTest() {
        // //大分类
        // dsMeta.getTopKind().then(function (kindData) {
        //  console.info("大分类：",kindData);
        // });
        // //中分类
        // dsMeta.getMediumKind().then(function (data) {
        //  console.info("中分类：",data);
        // });
        //小分类
        var param = {
            mediumId: "",
            region: 0
        };
        dsMeta.getKindListNew(param).then(function(kindData) {
            console.info("==============", kindData);
        });
        //
        // dsMeta.getFocus().then(function (data) {
        //  console.info("focus:",data);
        // });
    }
    /**
     * 名称组可地址组特殊处理（暂时只做了大陆的控制）
     * 将名称组中的21CHI的名称放置在name中，如果不存在21CHI的数据，则给name赋值默认数据
     * 将地址组中CHI的地址放置在address中，如果不存在CHI的数据，则给address赋值默认数据
     * @param data
     */
    function specialDetail(data) {
        var flag = true;
        for (var i = 0, len = data.names.length; i < len; i++) {
            if (data.names[i].nameClass == 1 && data.names[i].nameType == 2 && data.names[i].langCode == "CHI") {
                flag = false;
                data.name = data.names[i];
                break;
            }
        }
        if (flag) {
            var name = new FM.dataApi.IxPoiName({
                langCode: "CHI",
                nameClass: 1,
                nameType: 2,
                name: ""
            });
            data.name = name;
        }
        flag = true;
        for (var i = 0, len = data.addresses.length; i < len; i++) {
            if (data.addresses[i].langCode == "CHI") {
                flag = false;
                data.address = data.addresses[i];
                break;
            }
        }
        if (flag) {
            var address = new FM.dataApi.IxPoiAddress({
                langCode: "CHI",
                fullname: ""
            });
            data.address = address;
        }
    }

    function loadMap() {
        map = L.map('map', {
            attributionControl: false,
            doubleClickZoom: false,
            zoomControl: false
        });
        map.on("zoomend", function(e) {
            document.getElementById('zoomLevelBar').innerHTML = "缩放等级:" + map.getZoom();
        });
        map.setView([40.012834, 116.476293], 17);
        //属性编辑ctrl(解析对比各个数据类型)
        var layerCtrl = new fastmap.uikit.LayerController({
            config: App.layersConfig
        });
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

    function initOcll() {
        /*弹出tips*/
        //appPath.root + appPath.road +
        $ocLazyLoad.load(appPath.poi + 'ctrls/attr-tips/poiPopoverTipsCtl').then(function() {
            $scope.poiPopoverTipsTpl = appPath.root + appPath.poi + 'tpls/attr-tips/poiPopoverTips.html';
            $scope.showPopoverTips = true;
        });
        $ocLazyLoad.load(appPath.poi + 'ctrls/attr-base/generalBaseCtl').then(function() {
            $scope.attrTplContainer = appPath.root + appPath.poi + 'tpls/attr-base/generalBaseTpl.html';
        });
    }
    var initData = function() {
        var promises = [];
        var param = {
            mediumId: "",
            region: 0
        };
        promises.push(dsMeta.getKindList(param).then(function(kindData) {
            kindData.unshift({
                "id": "0",
                "kindCode": "0",
                "kindName": "--请选择--"
            }); //在数组最前面增加
            initKindFormat(kindData);
        }));
        param = {
            kindCode: ""
        };
        //promises.push(dsMeta.getAllBrandList().then(function (chainData) {
        promises.push(dsMeta.getChainList(param).then(function(chainData) {
            $scope.metaData.allChain = chainData;
        }));
    };
    //页面初始化方法调用
    var initPage = function() {
        initData();
        loadMap();
        //选择道路要素的工具栏
        $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/selectShapeCtrl').then(function() {
            $scope.selectShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/selectShapeTpl.html';
            $ocLazyLoad.load(appPath.poi + 'ctrls/toolBar_cru_ctrl/selectPoiCtrl').then(function() {
                $scope.selectPoiURL = appPath.root + appPath.poi + 'tpls/toolBar_cru_tpl/selectPoiTpl.html';
                $ocLazyLoad.load(appPath.poi + 'ctrls/edit-tools/optionBarCtl').then(function() {
                    $scope.consoleDeskTpl = appPath.root + appPath.poi + 'tpls/edit-tools/optionBarTpl.html';
                    $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/addShapeCtrl').then(function() {
                        $scope.addShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addShapeTpl.html';
                        $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/selectAdShapeCtrl').then(function() {
                            $scope.selectAdShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/selectAdShapeTpl.html';
                            $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/addAdShapeCtrl').then(function() {
                                $scope.addAdShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addAdShapeTpl.html';
                                $ocLazyLoad.load(appPath.poi + 'ctrls/toolBar_cru_ctrl/addPoiCtrl').then(function() {
                                    $scope.addAdShapeURL = appPath.root + appPath.poi + 'tpls/toolBar_cru_tpl/addPoiTpl.html';
                                    $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/selectRwShapeCtrl').then(function() {
                                        $scope.selectRwShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/selectRwShapTpl.html';
                                        $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/addRwShapeCtrl').then(function() {
                                            $scope.addRwShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addRwShapTpl.html';
                                            /*默认显示poi作业平台*/
                                            $scope.changeProject(2);
                                            bindHotKeys($ocLazyLoad, $scope, dsRoad, appPath); //注册快捷键
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };
    /**
     * 页面初始化方法调用
     */
    initPage();
    /**
     * 保存数据
     */
    $scope.doSave = function() {
        $scope.subAttrTplContainerSwitch(false);
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
                data = {
                    type: 'RDLINK',
                    pid: 100004343,
                    childPid: "",
                    op: "道路link删除成功"
                };
                $scope.$broadcast('getConsoleInfo', data); //显示输出结果
            }
        });
    };
    /**
     * 取消编辑
     */
    $scope.doCancel = function() {
        $scope.poi = angular.copy($scope.origPoi);
        $scope.$broadcast('refreshImgsData', $scope.poi.photos);
        $scope.$broadcast("clearBaseInfo"); //清除样式
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
        } else if (data.hasOwnProperty("subAttrContainerTpl")) {
            $scope.subAttrTplContainerSwitch(data["subAttrContainerTpl"]);
        } else {
            $scope.suspendPanelOpened = false;
            $scope.editorPanelOpened = 'none';
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
                for (var k = 0, lenK = eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTBYATTRIBUTE].length; k < lenK; k++) {
                    eventCtrl.off(eventCtrl.eventTypes.SELECTBYATTRIBUTE, eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTBYATTRIBUTE][k]);
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
        $ocLazyLoad.load(data["propertyCtrl"]).then(function() {
            $scope[data["loadType"]] = data["propertyHtml"];
            if (data["callback"]) {
                data["callback"]();
            }
        });
    });
    // $scope.checkPageNow = 1;
    /*高亮检查结果poi点*/
    $scope.$on('getHighlightData', function(event, data) {
        $scope.$broadcast('highlightPoiInMap', data);
    });
    /*翻页时初始化itemActive*/
    $scope.$on('initItemActive', function(event, data) {
        initTableList();
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
    /**
     * 接收父子关系中点击子事件
     */
    $scope.$on("emitChildren", function(event, childrenPid) {
        $scope.$broadcast("highlightPoiByPid", childrenPid);
    });
    /**
     * 接收父子关系中点击父事件
     */
    $scope.$on("emitParent", function(event, parentPid) {
        $scope.$broadcast("highlightPoiByPid", parentPid);
    });
    /**
     * 接收其他子片段切换导致数据发生变化之前触发的事件
     */
    $scope.$on("changeData", function(event, data) {
        changePoi(function() {
            $scope.$broadcast("changeDataRes");
        });
    });
    /**
     * 查询POI数据
     */
    $scope.$on("getObjectById", function(event, data) {
        console.info("getObjectById");
        dsPoi.getPoiByPid({
            "dbId": App.Temp.dbId,
            "type": "IXPOI",
            "pid": data.pid
        }).then(function(da) {
            if (da) {
                showPoiInfo(da);
                $scope.$broadcast("getObjectByIdRes");
                $scope.$broadcast("refreshImgsData");
            }
        });
    });
}]);