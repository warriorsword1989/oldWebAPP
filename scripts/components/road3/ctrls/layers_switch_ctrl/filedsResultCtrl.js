/**
 * Created by liwanchong on 2015/9/25.
 */
var filedsModule = angular.module('app').controller('FieldsResultController', ['$rootScope', '$scope', '$ocLazyLoad', '$timeout', 'dsFcc', 'dsEdit', 'dsMeta', 'appPath',
    function($rootScope, $scope, $ocLazyLoad, $timeout, dsFcc, dsEdit, dsMeta, appPath) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var layerCtrl = fastmap.uikit.LayerController();
        $scope.workPoint = layerCtrl.getLayerById("workPoint");
        $scope.guideLayer = layerCtrl.getLayerById("guideLineLayer");
        $scope.eventController = fastmap.uikit.EventController();
        var highCtrl = fastmap.uikit.HighRenderController();
        $scope.showOrHideId = "";
        $scope.showOrHideIdOfPending = "";
        $scope.showOrHideIdOfPended = "";
        $scope.tipsObj = {};
        $scope.showAll = true;
        $scope.showAllPre = true;
        $scope.showAllYet = true;
        $("#fm-dataList-btnGroup button").click(function() {
            $("#fm-dataList-btnGroup button").removeClass("active");
            $(this).addClass("active");
        });
        /*清除图层*/
        $scope.clearLayer = function(v) {
            v.flag = false;
            delete $scope.tipsObj[v.id];
        };
        /*全选、反选事件*/
        $scope.showAllLayers = function(typeName, type) {
            if ($scope[typeName]) {
                $.each($scope.items, function(i, v) {
                    $scope.clearLayer(v);
                });
                $scope.workPoint.url.parameter["types"] = [0];
                $scope.workPoint.redraw();
                $scope[typeName] = false;
            } else {
                $.each($scope.items, function(i, v) {
                    v.flag = true;
                    $scope.changeList(type);
                });
                $scope[typeName] = true;
            }
        };
        var selectCtrl = new fastmap.uikit.SelectController();
        //切换处理 待处理 已处理 页面
        $scope.dataListType = 1;
        $scope.changeList = function(type) {
            $scope.dataListType = type;
            $scope.showOrHideId = "";
            $scope.showAll = true;
            $scope.showAllPre = true;
            $scope.showAllYet = true;
            if ($scope.workPoint.url.parameter["types"]) {
                delete $scope.workPoint.url.parameter["types"]
                $scope.workPoint.redraw();
            }
            dsFcc.getTipsStatics({
                1: [1, 3],
                2: [1],
                3: [3]
            }[type]).then(function(data) {
                var arr = [],
                    transArr = [];
                transArr = data.data.rows;
                for (var i = 0, len = transArr.length; i < len; i++) {
                    var obj = {},
                        objArr = {};
                    obj = transArr[i];
                    for (var item in obj) {
                        objArr.name = fastmap.dataApi.FeatureConfig[item].name;
                        objArr.id = item;
                        objArr.flag = true;
                        $scope.tipsObj[item] = true;
                        objArr.total = obj[item];
                        arr.push(objArr);
                    }
                }
                $scope.items = arr;
                $scope.items.total = data.data.total;
            });
        };
        $scope.changeList(1);
        var dataLoading = true; //此变量用于控制菜单点击速度过快导致异常
        //点击下拉框的时  显示内容
        $scope.showContent = function(item, arr, stage, event) {
            if(!dataLoading){
                return ;
            }
            dataLoading = false;
            $scope.$emit('closePopoverTips', false);
            $("#dataTipsOriginModal").css("display", "none");
            $("#dataTipsVideoModal").css("display", "none");
            event.stopPropagation();
            $scope.$emit("SWITCHCONTAINERSTATE", {
                "attrContainerTpl": false,
                "subAttrContainerTpl": false
            })
            if ($scope.showOrHideId !== "") {
                if ($("#" + $scope.showOrHideId).hasClass("selected")) {
                    $("#" + $scope.showOrHideId).removeClass("selected");
                    $("#" + $scope.showOrHideId).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                } else {
                    $("#" + $scope.showOrHideId).addClass("selected")
                    $("#" + $scope.showOrHideId).find("i").addClass("glyphicon-folder-open").removeClass("glyphicon-folder-close")
                }
                if ($scope.showOrHideId === item.id) {
                    $scope.showOrHideId = "";
                    dataLoading = true;
                    return;
                }
            }
            if ($scope.showOrHideIdOfPending !== "") {
                if ($("#" + $scope.showOrHideIdOfPending).hasClass("selected")) {
                    $("#" + $scope.showOrHideIdOfPending).removeClass("selected");
                    $("#" + $scope.showOrHideIdOfPending).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                } else {
                    $("#" + $scope.showOrHideIdOfPending).addClass("selected")
                    $("#" + $scope.showOrHideIdOfPending).find("i").addClass("glyphicon-folder-open").removeClass("glyphicon-folder-close")
                }
                if ($scope.showOrHideIdOfPending === (item.id + "Pending")) {
                    $scope.showOrHideIdOfPending = "";
                    dataLoading = true;
                    return;
                }
            }
            if ($scope.showOrHideIdOfPended !== "") {
                if ($("#" + $scope.showOrHideIdOfPended).hasClass("selected")) {
                    $("#" + $scope.showOrHideIdOfPended).removeClass("selected");
                    $("#" + $scope.showOrHideIdOfPended).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                } else {
                    $("#" + $scope.showOrHideIdOfPended).addClass("selected")
                    $("#" + $scope.showOrHideIdOfPended).find("i").addClass("gglyphicon-folder-open").removeClass("glyphicon-folder-close")
                }
                if ($scope.showOrHideIdOfPended === (item.id + "Pended")) {
                    $scope.showOrHideIdOfPended = "";
                    dataLoading = true;
                    return;
                }
            }
            //Application.functions.getTipsListItems([60560301, 60560302, 60560303, 60560304], arr, item.id, function (data) {
            dsFcc.getTipsListItems(arr, item.id).then(function(data) {
                dataLoading = true;
                if (stage === 0) {
                    $scope.showOrHideId = item.id;
                    if ($("#" + $scope.showOrHideId).hasClass("selected")) {
                        $("#" + $scope.showOrHideId).removeClass("selected");
                        $("#" + $scope.showOrHideId).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                    } else {
                        $("#" + $scope.showOrHideId).addClass("selected")
                        $("#" + $scope.showOrHideId).find("i").addClass("glyphicon-folder-open").removeClass("glyphicon-folder-close")
                    }
                    $scope.allSubItems = data.data;
                    $scope.allStyleArr = [];
                    for (var i = 0, len = $scope.allSubItems.length; i < len; i++) {
                        $scope.allStyleArr[i] = false;
                    }
                } else if (stage === 1) {
                    $scope.showOrHideIdOfPending = (item.id + "Pending");
                    if ($("#" + $scope.showOrHideIdOfPending).hasClass("selected")) {
                        $("#" + $scope.showOrHideIdOfPending).removeClass("selected");
                        $("#" + $scope.showOrHideIdOfPending).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                    } else {
                        $("#" + $scope.showOrHideIdOfPending).addClass("selected")
                        $("#" + $scope.showOrHideIdOfPending).find("i").addClass("glyphicon-folder-open").removeClass("glyphicon-folder-close")
                    }
                    $scope.pendSubItems = data.data;
                    $scope.pendingStyleArr = [];
                    for (var j = 0, lenJ = $scope.pendSubItems.length; j < lenJ; j++) {
                        $scope.pendingStyleArr[j] = false;
                    }
                } else if (stage === 3) {
                    $scope.showOrHideIdOfPended = (item.id + "Pended");
                    if ($("#" + $scope.showOrHideIdOfPended).hasClass("selected")) {
                        $("#" + $scope.showOrHideIdOfPended).removeClass("selected");
                        $("#" + $scope.showOrHideIdOfPended).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                    } else {
                        $("#" + $scope.showOrHideIdOfPended).addClass("selected")
                        $("#" + $scope.showOrHideIdOfPended).find("i").addClass("glyphicon-folder-open").removeClass("glyphicon-folder-close")
                    }
                    $scope.solvedSubItems = data.data;
                    $scope.solvedStyleArr = [];
                    for (var k = 0, lenK = $scope.solvedSubItems.length; k < lenK; k++) {
                        $scope.solvedStyleArr[k] = false;
                    }
                }
            })
        };
        $scope.changeStyleArr = function(arr, index) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (i === index) {
                    arr[i] = true;
                } else {
                    arr[i] = false;
                }
            }
        };
        //点击列表需要的方法
        $scope.showTab = function(item, e, pItemId, index) {
            $scope.$emit('closePopoverTips', false);
            $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false});
            if ($scope.allStyleArr && $scope.allStyleArr.length >= 1) {
                $scope.changeStyleArr($scope.allStyleArr, index);
            }
            if ($scope.pendingStyleArr && $scope.pendingStyleArr.length >= 1) {
                $scope.changeStyleArr($scope.pendingStyleArr, index);
            }
            if ($scope.solvedStyleArr && $scope.solvedStyleArr.length >= 1) {
                $scope.changeStyleArr($scope.solvedStyleArr, index);
            }
            // $scope.$emit('closePopoverTips',true);
            $("#dataTipsOriginModal").css("display", "none");
            $("#dataTipsVideoModal").css("display", "none");
            $("#tipsSubPanel").removeClass("normal").addClass("selected");
            $("#popoverTips").css("display", "block");
            highCtrl._cleanHighLight();
            highCtrl.highLightFeatures.length = 0;
            dsFcc.getTipsResult(item.i).then(function(data) {
                if (data.rowkey === "undefined" || data == -1) {
                    return;
                }
                $scope.eventController.fire($scope.eventController.eventTypes.SELECTBYATTRIBUTE, {
                    feather: data
                });
                if (pItemId === "1101") { //限速
                    //map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    //$scope.showTipsOrProperty(data, "RDSPEEDLIMIT", objCtrl, data.id, appPath.road + "ctrls/attr_speedLimit_ctrl/speedLimitCtrl", appPath.root + appPath.road + "tpls/attr_speedLimit_tpl/speedLimitTpl.html");
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTplOfTraffic = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) { //只有新增
                                $scope.getFeatDataCallback(data, data.id ? data.id:'', "RDSPEEDLIMIT", appPath.road + "ctrls/attr_speedLimit_ctrl/speedLimitCtrl", appPath.root + appPath.road + "tpls/attr_speedLimit_tpl/speedLimitTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfTraffic);
                } else if (pItemId === "1102") { //红绿灯
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTplOfTraffic = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                // $scope.getFeatDataCallback(data, data.f_array[0].f.id ? data.f_array[0].f.id : '', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                $scope.getFeatDataCallback(data, data.f_array[0].f.id ? data.f_array[0].f.id:'', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfTraffic);
                } else if (pItemId === "1103") { //红绿灯方位
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTplOfTraffic = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                // $scope.getFeatDataCallback(data, data.in.id ? data.in.id:'', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                $scope.getFeatDataCallback(data, data.in.id ? data.in.id:'', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfTraffic);
                } else if (pItemId === "1104") { //大门
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTplOfTraffic = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                // $scope.getFeatDataCallback(data, data.in.id ? data.in.id:'', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                $scope.getFeatDataCallback(data, data.in.id ? data.in.id:'', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfTraffic);
                } else if (pItemId === "1105") { //危险信息
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                    var ctrlAndTplOfDirect = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfDirect);
                } else if (pItemId === "1106") { //坡度
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                // $scope.getFeatDataCallback(data, data.in.id ? data.in.id:'', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                $scope.getFeatDataCallback(data, data.out.id ? data.out.id:'', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1107") { //收费站
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                    var ctrlAndTplOfDirect = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfDirect);
                } else if (pItemId === "1109") {
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                    var ctrlAndTplOfSA = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfSA);
                } else if (pItemId === "1110") {    //卡车限制
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1111") {    //条件限速
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                // $scope.getFeatDataCallback(data, data.in.id ? data.in.id:'', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                $scope.getFeatDataCallback(data, data.f.id ? data.f.id:'', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1113") {    //车道限速
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                // $scope.getFeatDataCallback(data, data.in.id ? data.in.id:'', "RDLINK", appPath.road + "ctrls/attr_branch_ctrl/rdTrafficSignalCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/rdTrafficSignalTpl.html");
                                $scope.getFeatDataCallback(data, data.f.id ? data.f.id:'', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1201") { //道路种别
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                    $scope.showTipsOrProperty(data, "RDLINK", objCtrl, data.f.id, appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                } else if (pItemId === "1202") {    //车道数
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 3) {
                                $scope.getFeatDataCallback(data, data.f.id ? data.f.id:'', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1203") { //道路方向
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                    var ctrlAndTplOfDirect = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.f.type == 1) {
                                $scope.getFeatDataCallback(data, data.f.id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfDirect);
                } else if (pItemId === "1205") { //SA
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                    var ctrlAndTplOfSA = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.f) {
                                $scope.getFeatDataCallback(data, data.f.id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfSA);
                } else if (pItemId === "1206") { //PA
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                    var ctrlAndTplOfSA = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.f) {
                                $scope.getFeatDataCallback(data, data.f.id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfSA);
                } else if (pItemId === "1207") {    //匝道
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 3) {
                                $scope.getFeatDataCallback(data, data.f.id ? data.f.id:'', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1208") {    //停车场出入口Link
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            $scope.getFeatDataCallback(data, data.f.id ? data.f.id:'', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1301") { //车信
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    $scope.showTipsOrProperty(data, "RDLANECONNEXITY", objCtrl, data.id, appPath.road + "ctrls/attr_connexity_ctrl/rdLaneConnexityCtrl", appPath.root + appPath.road + "tpls/attr_connexity_tpl/rdLaneConnexityTpl.html");
                } else if (pItemId === "1302") { //交限
                    $scope.showTipsOrProperty(data, "RDRESTRICTION", objCtrl, data.id, appPath.road + "ctrls/attr_restriction_ctrl/rdRestriction", appPath.root + appPath.road + "tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html");
                } else if (pItemId === "1304") {    //禁止穿行
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                $scope.getFeatDataCallback(data, data.f.id ? data.f.id:'', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1305") {    //禁止驶入
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                $scope.getFeatDataCallback(data, data.f.id ? data.f.id:'', "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1401") { //方向看板
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                    var ctrlAndTplOfOrientation = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                $scope.getFeatDataCallback(data, data.brID ? data.brID[0].id : '', "RDBRANCH", appPath.road + "ctrls/attr_branch_ctrl/rdSignBoardCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/signBoardOfBranch.html",9);
                            }
                            //高亮进入线
                            if(data.in){
                                highCtrl.highLightFeatures.push({
                                    id:data.in.id.toString(),
                                    layerid:'rdLink',
                                    type:'line',
                                    style:{
                                        color: '#21ed25',
                                        strokeWidth:50
                                    }
                                });
                            }
                            //高亮退出线;
                            if(data.out){
                                highCtrl.highLightFeatures.push({
                                    id:data.out.id.toString(),
                                    layerid:'rdLink',
                                    type:'line',
                                    style:{
                                        color: '#CD0011'
                                    }
                                });
                            }
                            highCtrl.drawHighlight();
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfOrientation);
                } else if (pItemId === "1402") { //real sign
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20)
                    var ctrlAndTplOfRealSign = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                $scope.getFeatDataCallback(data, data.brID ? data.brID[0].id : '', "RDBRANCH", appPath.road + "ctrls/attr_branch_ctrl/rdBranchCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/namesOfBranch.html");
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfRealSign);
                } else if (pItemId === "1403") { //3D
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTplOf3d = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                $scope.getFeatDataCallback(data, data.brID ? data.brID[0].id : '', "RDBRANCH", appPath.road + 'ctrls/attr_branch_ctrl/rdRealImageCtrl', appPath.root + appPath.road + 'tpls/attr_branch_Tpl/realImageOfBranch.html',3);
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOf3d);
                } else if (pItemId === "1404") {    //提左提右
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                // $scope.getFeatDataCallback(data, data.brID ? data.brID[0].id : '', "RDBRANCH", appPath.road + 'ctrls/attr_branch_ctrl/rdBranchCtrl', appPath.root + appPath.road + 'tpls/attr_branch_Tpl/namesOfBranch.html',3);
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1405") { //一般道路方面;
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTplOfRoadClass = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.o_array.length > 0) {
                                $scope.getFeatDataCallback(data, data.in.id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfRoadClass);
                } else if (pItemId === "1406") { //实景图
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20)
                    var ctrlAndTplOfJCV = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                $scope.getFeatDataCallback(data, data.brID ? data.brID[0].id : '', "RDBRANCH", appPath.road + 'ctrls/attr_branch_ctrl/rdRealImageCtrl', appPath.root + appPath.road + 'tpls/attr_branch_Tpl/realImageOfBranch.html',5);
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfJCV);
                } else if (pItemId === "1407") { //高速分歧
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle != 3) { //3表示新增
                                $scope.getFeatDataCallback(data, data.brID ? data.brID[0].id : '', "RDBRANCH", appPath.road + "ctrls/attr_branch_ctrl/rdBranchCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/namesOfBranch.html")
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1409") { //普通路口模式图
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTplOfD = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle != 3) { //3表示新增
                                $scope.getFeatDataCallback(data, data.brID ? data.brID[0].id : '', "RDBRANCH", appPath.road + "ctrls/attr_branch_ctrl/rdBranchCtrl", appPath.root + appPath.road + "tpls/attr_branch_Tpl/namesOfBranch.html")
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfD);
                } else if (pItemId === "1501") { //上下线分离
                    if (data.geo != null) {
                        map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 18);
                    } else {
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 18);
                    }
                    var ctrlAndTplOfUpAndLower = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.f_array.length != 0) {
                                $scope.brigeLinkArray = data.f_array;
                                $scope.getFeatDataCallback(data, data.f_array[0].id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                            }
                        }
                    }
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfUpAndLower);
                } else if (pItemId === "1502") { //路面覆盖
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1503") { //高架路
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1504") { //overpass
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1505") { //underpass
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1506") { //私道
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1507") { //步行街
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1508") { //公交专用道路
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1510") { //桥1510
                    var points = [];
                    var endPoint = L.latLng(data.gELoc.coordinates[1], data.gELoc.coordinates[0]);
                    var startPoint = L.latLng(data.gSLoc.coordinates[1], data.gSLoc.coordinates[0]);
                    points.push(endPoint);
                    points.push(startPoint);
                    var line = new L.polyline(points);
                    var bounds = line.getBounds();
                    map.fitBounds(bounds, {
                        "maxZoom": 18
                    });
                    var ctrlAndTplOfBridge = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.f_array.length != 0) {
                                $scope.brigeLinkArray = data.f_array;
                                $scope.getFeatDataCallback(data, data.f_array[0].id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfBridge);
                } else if (pItemId === "1511") { //隧道
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1512") { //辅路
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1513") { //窄道
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1514") { //施工
                    var points = [];
                    var endPoint = L.latLng(data.gELoc.coordinates[1], data.gELoc.coordinates[0]);
                    var startPoint = L.latLng(data.gSLoc.coordinates[1], data.gSLoc.coordinates[0]);
                    points.push(endPoint);
                    points.push(startPoint);
                    var line = new L.polyline(points);
                    var bounds = line.getBounds();
                    map.fitBounds(bounds, {
                        "maxZoom": 18
                    });
                    var ctrlAndTplOfConstruction = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.f_array.length != 0) {
                                $scope.brigeLinkArray = data.f_array;
                                $scope.getFeatDataCallback(data, data.f_array[0].id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                            }
                        }
                    }
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfConstruction);
                } else if (pItemId === "1515") {
                    var point = [];
                    var endPoint = L.latLng(data.gELoc.coordinates[1],data.gELoc.coordinates[0]);
                    var startPoint = L.latLng(data.gSLoc.coordinates[1],data.gSLoc.coordinates[0]);
                    point.push(endPoint);
                    point.push(startPoint);
                    var line = new L.polyline(point);
                    var bounds = line.getBounds();
                    map.fitBounds(bounds,{
                        "maxZoom": 18
                    });

                    //map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTplOfD = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.f_array.length != 0) {
                                $scope.brigeLinkArray = data.f_array;
                                $scope.getFeatDataCallback(data, data.f_array[0].id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfD);
                } else if (pItemId === "1516") { //季节性关闭道路
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1517") { //Usage Fee Required
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1601") { //环岛
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1602") { //特殊交通类型
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1603") { //未定义交通类型
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1604") { //区域内道路
                    map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 18);
                    var ctrlAndTplOfRoad = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.f_array.length > 0) {
                                $scope.getFeatDataCallback(data, data.f_array[0].id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfRoad);
                } else if (pItemId === "1605") { //POI连接路
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1703") { //分叉口提示
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20)
                    var ctrlAndTplOfForks = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        // callback:function(){
                        //     if (data.id) {
                        //         $scope.getFeatDataCallback(data,data.id,"RDLINK","scripts/components/road3/ctrls/attr_link_ctrl/rdLinkCtrl","../../../scripts/components/road3/tpls/attr_link_tpl/rdLinkTpl.html")
                        //     }
                        // }
                    }
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfForks);
                } else if (pItemId === "1704") { //交叉路口
                    /*map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20)
                    var ctrlAndTplOfCross = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.f.id) {
                                var obj = {
                                    "nodePid": parseInt(data.f.id)
                                };
                                var param = {
                                    "dbId": App.Temp.dbId,
                                    "type": "RDCROSS",
                                    "data": obj
                                }
                                dsEdit.getByCondition(param, function(data) {
                                    var crossCtrlAndTpl = {
                                        propertyCtrl: appPath.road + "ctrls/attr_cross_ctrl/rdCrossCtrl",
                                        propertyHtml: appPath.root + appPath.road + "tpls/attr_cross_tpl/rdCrossTpl.html",
                                    }
                                    objCtrl.setCurrentObject('RDCROSS', data.data[0]);
                                    $scope.$emit("transitCtrlAndTpl", crossCtrlAndTpl);
                                });
                            }
                        }
                    }
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfCross);*/

                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20)
                    var crossCtrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        callback: function() {
                            if (data.t_lifecycle == 1 || data.t_lifecycle == 2) {
                                $scope.getFeatDataCallback(data, data.data ? data.data[0] : '', "RDCROSS", appPath.road + 'ctrls/attr_cross_ctrl/rdCrossCtrl', appPath.root + appPath.road + 'tpls/attr_cross_tpl/rdCrossTpl.html');
                            }
                        }
                    };
                    $scope.$emit("transitCtrlAndTpl", crossCtrlAndTpl);
                } else if (pItemId === "1801") { //立交
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                    var ctrlAndTplOfOverPass = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                    }
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfOverPass);
                } else if (pItemId === "1803") { //挂接
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTplOfOfGJ = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    }
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfOfGJ);
                } else if (pItemId === "1804") { //顺行
                    map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 18);
                    var ctrlAndTpl = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTpl);
                } else if (pItemId === "1806") { //草图
                    map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                    var ctrlAndTplOfOfGJ = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    }
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfOfGJ);
                } else if (pItemId === "1901") { //道路名
                    map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 20);
                    var ctrlAndTplOfOfGJ = {
                        "loadType": "tipsTplContainer",
                        "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                        "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                    }
                    $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfOfGJ);
                } else if (pItemId === "2001") { //测线
                    map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 18)
                    $scope.showTipsOrProperty(data, "RDLINK", objCtrl, data.id, appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                }
            });
        };
        //checkbox中的处理方法
        $scope.showLayers = function(item, event) {
            event.stopPropagation();
            var param = $scope.workPoint.url.parameter;
            item.flag = !item.flag;
            if (!item.flag) {
                delete $scope.tipsObj[item.id];
            } else {
                $scope.tipsObj[item.id] = true;
            }
            if (Object.keys($scope.tipsObj).length === 0) {
                param["types"] = [0];
            } else {
                param["types"] = Object.keys($scope.tipsObj);
            }
            $scope.workPoint.redraw();
            //$scope.guideLayer._redraw();
        };
        $scope.getFeatDataCallback = function(selectedData, id, type, ctrl, tpl,branchType) {
            if(type == 'RDBRANCH'){
                if(selectedData.branchType == 5 || selectedData.branchType == 7){
                    dsEdit.getBranchByRowId(selectedData.rowkey,branchType).then(function(data){
                        getByPidCallback(type,ctrl,tpl,data);
                    });
                }else{
                    dsEdit.getBranchByDetailId(selectedData.rowkey,branchType).then(function(data){
                        getByPidCallback(type,ctrl,tpl,data);
                    });
                }
            }else{
                dsEdit.getByPid(id, type).then(function(data){
                    if(!data){
                        return;
                    }
                    if (type === "RDLINK") {
                        var linkArr = data.geometry.coordinates,
                            points = [];
                        for (var i = 0, len = linkArr.length; i < len; i++) {
                            var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                            points.push(point);
                        }
                        /* map.panTo({lat: points[0].y, lon: points[0].x});*/
                        var line = fastmap.mapApi.lineString(points);
                        selectCtrl.onSelected({
                            geometry: line,
                            id: id
                        });
                    }
                    getByPidCallback(type,ctrl,tpl,data);
                });
            }
            function getByPidCallback(type,ctrl,tpl,data){
                var options = {
                    "loadType": 'attrTplContainer',
                    "propertyCtrl": ctrl,
                    "propertyHtml": tpl
                };
                $scope.$emit("transitCtrlAndTpl", options);
                objCtrl.setCurrentObject(type, data);
                // tooltipsCtrl.onRemoveTooltip();
            }
        }
        $scope.showTipsOrProperty = function(data, type, objCtrl, propertyId, propertyCtrl, propertyTpl) {
            var ctrlAndTplParams = {
                    loadType: 'tipsTplContainer',
                    propertyCtrl: appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                    propertyHtml: appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                    callback: function() {
                        if (data.t_lifecycle === 2) { //修改
                            $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                        } else { //1删除 3新增
                            var stageLen = data.t_trackInfo.length;
                            var stage = data.t_trackInfo[stageLen - 1];
                            if (stage.stage === 1) { //未作业
                                if (data.s_sourceType === "1201") { //道路种别 无论作业未作业 道路种别相关的属性页面都要弹出
                                    $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                                } else {
                                    if (data.t_lifecycle === 1) {
                                        $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                                    }
                                }
                                $scope.$emit("SWITCHCONTAINERSTATE", {
                                    "attrContainerTpl": false
                                })
                            } else if (stage.stage === 3) {
                                if (data.t_lifecycle === 3) {
                                    $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                                } else {
                                    $scope.$emit("SWITCHCONTAINERSTATE", {
                                        "attrContainerTpl": false
                                    })
                                }
                            } else {
                                $scope.$emit("SWITCHCONTAINERSTATE", {
                                    "attrContainerTpl": false
                                })
                            }
                        }
                    }
                }
                //先load Tips面板和控制器
            $scope.$emit("transitCtrlAndTpl", ctrlAndTplParams);
        }
    }
])