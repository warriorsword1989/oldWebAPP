/**
 * Created by liwanchong on 2015/9/25.
 */
var filedsModule = angular.module('app');
filedsModule.controller('FieldsResultController', ['$rootScope', '$scope', '$ocLazyLoad', '$timeout','dsFcc','dsRoad','dsMeta','appPath',
        function ($rootScope, $scope, $ocLazyLoad, $timeout,dsFcc,dsRoad,dsMeta,appPath) {
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
            $("#fm-dataList-btnGroup button").click(function () {
                $("#fm-dataList-btnGroup button").removeClass("active");
                $(this).addClass("active");
            });
            /*清除图层*/
            $scope.clearLayer = function (v) {
                v.flag = false;
                delete $scope.tipsObj[v.id];
            };
            /*全选、反选事件*/
            $scope.showAllLayers = function (typeName, typeArr) {
                if ($scope[typeName]) {
                    $.each($scope.items, function (i, v) {
                        $scope.clearLayer(v);
                    });
                    $scope.workPoint.url.parameter["types"] = [0];
                    $scope.workPoint.redraw();
                    $scope[typeName] = false;
                } else {
                    $.each($scope.items, function (i, v) {
                        v.flag = true;
                        $scope.changeList(typeArr);
                    });
                    $scope[typeName] = true;
                }
            };
            dsFcc.getTipsStatics([1, 3]).then(function (data) {
                var arr = [], transArr = [];
                transArr = data.data.rows;
                for (var i = 0, len = transArr.length; i < len; i++) {
                    var obj = {}, objArr = {};
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
            var selectCtrl = new fastmap.uikit.SelectController();
            //切换处理 待处理 已处理 页面
            $scope.changeList = function (stage) {
                $scope.showOrHideId = "";
                $scope.showAll = true;
                $scope.showAllPre = true;
                $scope.showAllYet = true;
                if ($scope.workPoint.url.parameter["types"]) {
                    delete $scope.workPoint.url.parameter["types"]
                    $scope.workPoint.redraw();
                }
                dsFcc.getTipsStatics(stage).then(function (data) {
                    var arr = [], transArr = [];
                    transArr = data.data.rows;
                    for (var i = 0, len = transArr.length; i < len; i++) {
                        var obj = {}, objArr = {};
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


            //点击下拉框的时  显示内容
            $scope.showContent = function (item, arr, stage, event) {
                $("#dataTipsOriginModal").css("display", "none");
                $("#dataTipsVideoModal").css("display", "none");
                event.stopPropagation();
                $scope.$emit("SWITCHCONTAINERSTATE",{"attrContainerTpl":false,"subAttrContainerTpl":false})
                if ($scope.showOrHideId !== "") {
                    if ($("#" + $scope.showOrHideId).hasClass("selected")) {
                        $("#" + $scope.showOrHideId).removeClass("selected");
                        $("#" + $scope.showOrHideId).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                    }
                    else {
                        $("#" + $scope.showOrHideId).addClass("selected")
                        $("#" + $scope.showOrHideId).find("i").addClass("glyphicon-folder-open").removeClass("glyphicon-folder-close")
                    }
                    if ($scope.showOrHideId === item.id) {
                        $scope.showOrHideId = "";
                        return;
                    }
                }
                if ($scope.showOrHideIdOfPending !== "") {
                    if ($("#" + $scope.showOrHideIdOfPending).hasClass("selected")) {
                        $("#" + $scope.showOrHideIdOfPending).removeClass("selected");
                        $("#" + $scope.showOrHideIdOfPending).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                    }
                    else {
                        $("#" + $scope.showOrHideIdOfPending).addClass("selected")
                        $("#" + $scope.showOrHideIdOfPending).find("i").addClass("glyphicon-folder-open").removeClass("glyphicon-folder-close")
                    }
                    if ($scope.showOrHideIdOfPending === (item.id + "Pending")) {
                        $scope.showOrHideIdOfPending = "";
                        return;
                    }
                }
                if ($scope.showOrHideIdOfPended !== "") {
                    if ($("#" + $scope.showOrHideIdOfPended).hasClass("selected")) {
                        $("#" + $scope.showOrHideIdOfPended).removeClass("selected");
                        $("#" + $scope.showOrHideIdOfPended).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                    }
                    else {
                        $("#" + $scope.showOrHideIdOfPended).addClass("selected")
                        $("#" + $scope.showOrHideIdOfPended).find("i").addClass("gglyphicon-folder-open").removeClass("glyphicon-folder-close")
                    }
                    if ($scope.showOrHideIdOfPended === (item.id + "Pended")) {
                        $scope.showOrHideIdOfPended = "";
                        return;
                    }
                }

                //Application.functions.getTipsListItems([60560301, 60560302, 60560303, 60560304], arr, item.id, function (data) {
                dsFcc.getTipsListItems(arr, item.id).then(function (data) {

                    if (stage === 0) {
                        $scope.showOrHideId = item.id;
                        if ($("#" + $scope.showOrHideId).hasClass("selected")) {
                            $("#" + $scope.showOrHideId).removeClass("selected");
                            $("#" + $scope.showOrHideId).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                        }
                        else {
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
                        }
                        else {
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
                        }
                        else {
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
            $scope.changeStyleArr = function (arr, index) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (i === index) {
                        arr[i] = true;
                    } else {
                        arr[i] = false;
                    }
                }
            };
            //点击列表需要的方法
            $scope.showTab = function (item, e, pItemId, index) {
                $scope.$emit('closePopoverTips',false);
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
                dsFcc.getTipsResult(item.i).then(function (data) {
                    if (data.rowkey === "undefined") {
                        return;
                    }
                    $scope.eventController.fire($scope.eventController.eventTypes.SELECTBYATTRIBUTE, {feather: data});
                    if (pItemId === "1101") {//限速
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        $scope.showTipsOrProperty(data, "RDSPEEDLIMIT", objCtrl, data.id, appPath.road + "ctrls/attr_speedLimit_ctrl/speedLimitCtrl", appPath.root + appPath.road + "tpls/attr_speedLimit_tpl/speedLimitTpl.html");
                    } else if (pItemId === "1201") {//道路种别
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                        $scope.showTipsOrProperty(data, "RDLINK", objCtrl, data.f.id, appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                    } else if (pItemId === "1203") {//道路方向
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                        var ctrlAndTplOfDirect={
                            "loadType":"tipsTplContainer",
                            "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml": appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                            callback:function(){
                                if (data.f.type == 1) {
                                    $scope.getFeatDataCallback(data,data.f.id,"RDLINK",appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl",appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html")
                                }
                            }
                        };
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfDirect);

                    } else if (pItemId === "1301") {//车信
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        $scope.showTipsOrProperty(data, "RDLANECONNEXITY", objCtrl, data.id, "scripts/components/road3/ctrls/attr_connexity_ctrl/rdLaneConnexityCtrl", "../../../scripts/components/road3/tpls/attr_connexity_tpl/rdLaneConnexityTpl.html");
                    } else if (pItemId === "1302") {//交限
                        $scope.showTipsOrProperty(data, "RDRESTRICTION", objCtrl, data.id, "scripts/components/road3/ctrls/attr_restriction_ctrl/rdRestriction", "../../../scripts/components/road3/tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html");
                    } else if(pItemId==="1403") {//3D
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        var ctrlAndTplOfD= {

                            "loadType":"tipsTplContainer",
                            "propertyCtrl":"scripts/components/road3/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml":"../../scripts/components/road3/tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        }
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfD);
                    } else if (pItemId === "1407") {//高速分歧
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        $scope.showTipsOrProperty(data, "RDBRANCH", objCtrl, data.brID?data.brID[0].id:'', "scripts/components/road3/ctrls/attr_branch_ctrl/rdBranchCtrl", "../../../scripts/components/road3/tpls/attr_branch_Tpl/namesOfBranch.html");
                    } else if(pItemId === "1409"){ //普通路口模式图
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        var ctrlAndTplOfD= {
                            "loadType":"tipsTplContainer",
                            "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml":appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        };
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfD);
                    } else if(pItemId==="1501") {//上下线分离
                        if(data.geo!=null){
                            map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 18);
                        }else{
                            map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 18);
                        }
                        var ctrlAndTplOfUpAndLower= {
                            "loadType":"tipsTplContainer",
                            "propertyCtrl":"scripts/components/road3/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml":"../../scripts/components/road3/tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                            callback:function(){
                                if (data.f_array.length != 0) {
                                    $scope.brigeLinkArray = data.f_array;
                                    $scope.getFeatDataCallback(data,data.f_array[0].id,"RDLINK","scripts/components/road3/ctrls/attr_link_ctrl/rdLinkCtrl","../../../scripts/components/road3/tpls/attr_link_tpl/rdLinkTpl.html")
                                }
                            }
                        }
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfUpAndLower);
                    } else if (pItemId === "1510") {//桥1510
                        var points = [];
                        var endPoint = L.latLng(data.gELoc.coordinates[1], data.gELoc.coordinates[0]);
                        var startPoint = L.latLng(data.gSLoc.coordinates[1], data.gSLoc.coordinates[0]);
                        points.push(endPoint);
                        points.push(startPoint);
                        var line = new L.polyline(points);
                        var bounds = line.getBounds();
                        map.fitBounds(bounds, {"maxZoom": 18});

                        var ctrlAndTplOfBridge={
                            "loadType":"tipsTplContainer",
                            "propertyCtrl":"scripts/components/road3/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml":"../../../scripts/components/road3/tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                            callback:function(){
                                if (data.f_array.length != 0) {
                                    $scope.brigeLinkArray = data.f_array;
                                    $scope.getFeatDataCallback(data,data.f_array[0].id,"RDLINK","scripts/components/road3/ctrls/attr_link_ctrl/rdLinkCtrl","../../../scripts/components/road3/tpls/attr_link_tpl/rdLinkTpl.html")
                                }
                            }
                        };
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfBridge);

                    } else if(pItemId==="1514") {//施工
                        var points = [];
                        var endPoint = L.latLng(data.gELoc.coordinates[1], data.gELoc.coordinates[0]);
                        var startPoint = L.latLng(data.gSLoc.coordinates[1], data.gSLoc.coordinates[0]);
                        points.push(endPoint);
                        points.push(startPoint);
                        var line = new L.polyline(points);
                        var bounds = line.getBounds();
                        map.fitBounds(bounds, {"maxZoom": 18});
                        var ctrlAndTplOfConstruction= {
                            "loadType":"tipsTplContainer",
                            "propertyCtrl":"scripts/components/road3/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml":"../../scripts/components/road3/tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                            callback:function(){
                                if (data.f_array.length != 0) {
                                    $scope.brigeLinkArray = data.f_array;
                                    $scope.getFeatDataCallback(data,data.f_array[0].id,"RDLINK","scripts/components/road3/ctrls/attr_link_ctrl/rdLinkCtrl","../../../scripts/components/road3/tpls/attr_link_tpl/rdLinkTpl.html")
                                }
                            }
                        }
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfConstruction);
                    } else if(pItemId === "1515"){
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        var ctrlAndTplOfD= {
                            "loadType":"tipsTplContainer",
                            "propertyCtrl": appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml":appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        };
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfD);
                    }  else if (pItemId === "1604") {//区域内道路

                        map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 18);
                        var ctrlAndTplOfRoad={
                            "loadType":"tipsTplContainer",
                            "propertyCtrl":"scripts/components/road3/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml":"../../../scripts/components/road3/tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                            callback:function(){
                                if (data.f_array.length > 0) {
                                    $scope.getFeatDataCallback(data,data.f_array[0].id,"RDLINK","scripts/components/road3/ctrls/attr_link_ctrl/rdLinkCtrl","../../../scripts/components/road3/tpls/attr_link_tpl/rdLinkTpl.html")
                                }
                            }
                        };
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfRoad);

                    } else if (pItemId === "1704") {//交叉路口
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20)
                        var ctrlAndTplOfCross={
                            "loadType":"tipsTplContainer",
                            "propertyCtrl":"scripts/components/road3/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml":"../../../scripts/components/road3/tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                            callback:function(){
                                if (data.f.id) {
                                    var obj = {"nodePid": parseInt(data.f.id)};
                                    var param = {
                                        "dbId": App.Temp.dbId,
                                        "type": "RDCROSS",
                                        "data": obj
                                    }
                                    dsRoad.getByCondition(JSON.stringify(param), function (data) {
                                        var crossCtrlAndTpl={
                                            propertyCtrl:"components/road3/ctrls/attr_cross_ctrl/rdCrossCtrl",
                                            propertyHtml:"../../scripts/components/road3/tpls/attr_cross_tpl/rdCrossTpl.html",
                                        }
                                        objCtrl.setCurrentObject('RDCROSS',data.data[0]);
                                        $scope.$emit("transitCtrlAndTpl", crossCtrlAndTpl);
                                    });
                                }
                            }
                        }
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfCross);


                    } else if(pItemId==="1801") {//立交
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 17);
                        var ctrlAndTplOfOverPass= {
                            "loadType":"tipsTplContainer",
                            "propertyCtrl":"scripts/components/road3/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml":"../../scripts/components/road3/tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                        }
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfOverPass);
                    } else if (pItemId === "1803") {//挂接
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        var ctrlAndTplOfOfGJ= {
                            "loadType":"tipsTplContainer",
                            "propertyCtrl": "scripts/components/road3/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml": "../../scripts/components/road3/tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                        }
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfOfGJ);

                    } else if (pItemId === "1806") {//草图
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        var ctrlAndTplOfOfGJ= {
                            "loadType":"tipsTplContainer",
                            "propertyCtrl": "scripts/components/road3/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml": "../../scripts/components/road3/tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                        }
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfOfGJ);

                    } else if (pItemId === "1901") {//道路名
                        map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 20);
                        var ctrlAndTplOfOfGJ= {
                            "loadType":"tipsTplContainer",
                            "propertyCtrl": "scripts/components/road3/ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                            "propertyHtml": "../../scripts/components/road3/tpls/attr_tips_tpl/sceneAllTipsTpl.html"
                        }
                        $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfOfGJ);
                    } else if (pItemId === "2001") {//测线
                        map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 18)
                        $scope.showTipsOrProperty(data, "RDLINK", objCtrl, data.id, "scripts/components/road3/ctrls/attr_link_ctrl/rdLinkCtrl", "../../../scripts/components/road3/tpls/attr_link_tpl/rdLinkTpl.html");

                    }
                });
            };
            //checkbox中的处理方法
            $scope.showLayers = function (item, event) {
                event.stopPropagation();
                var param = $scope.workPoint.url.parameter;
                item.flag = !item.flag;
                if (!item.flag) {
                    delete $scope.tipsObj[item.id];
                } else {
                    $scope.tipsObj[item.id] = true;
                }
                if(Object.keys($scope.tipsObj).length===0) {
                    param["types"] = [0];
                }else{
                    param["types"]= Object.keys($scope.tipsObj);
                }

                $scope.workPoint.redraw();
                //$scope.guideLayer._redraw();

            };
            $scope.getFeatDataCallback = function (selectedData, id, type, ctrl, tpl) {
                dsRoad.getRdObjectById(id, type, function (data) {
                    if (data.errcode === -1) {
                        return;
                    }
                    if(type==="RDLINK") {
                        var linkArr = data.data.geometry.coordinates, points = [];
                        for (var i = 0, len = linkArr.length; i < len; i++) {
                            var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                            points.push(point);
                        }
                       /* map.panTo({lat: points[0].y, lon: points[0].x});*/
                        var line = fastmap.mapApi.lineString(points);
                        selectCtrl.onSelected({geometry: line, id: $scope.dataId});
                    }

                    objCtrl.setCurrentObject(type, data.data);
                    var options = {
                        "loadType": 'attrTplContainer',
                        "propertyCtrl": ctrl,
                        "propertyHtml": tpl
                    }
                    $scope.$emit("transitCtrlAndTpl", options);
                }, selectedData.detailid);
            }
            $scope.showTipsOrProperty = function (data, type, objCtrl, propertyId, propertyCtrl, propertyTpl) {
                var ctrlAndTplParams = {
                    loadType: 'tipsTplContainer',
                    propertyCtrl: appPath.road + "ctrls/attr_tips_ctrl/sceneAllTipsCtrl",
                    propertyHtml: appPath.root + appPath.road + "tpls/attr_tips_tpl/sceneAllTipsTpl.html",
                    callback: function () {
                        if (data.t_lifecycle === 2) { //修改
                            $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                        } else {//1删除 3新增
                            var stageLen = data.t_trackInfo.length;
                            var stage = data.t_trackInfo[stageLen - 1];
                            if (stage.stage === 1) { //未作业
                                if (data.s_sourceType === "1201") { //道路种别 无论作业未作业 道路种别相关的属性页面都要弹出
                                    $scope.getFeatDataCallback(data,propertyId,type,propertyCtrl,propertyTpl);
                                } else {
                                    if (data.t_lifecycle === 1) {
                                        $scope.getFeatDataCallback(data,propertyId,type,propertyCtrl,propertyTpl);
                                    }
                                }
                                $scope.$emit("SWITCHCONTAINERSTATE",{"attrContainerTpl":false})
                            } else if (stage.stage === 3) {
                                if (data.t_lifecycle === 3) {
                                    $scope.getFeatDataCallback(data, propertyId, type, propertyCtrl, propertyTpl);
                                } else {
                                    $scope.$emit("SWITCHCONTAINERSTATE",{"attrContainerTpl":false})
                                }
                            } else {
                                $scope.$emit("SWITCHCONTAINERSTATE",{"attrContainerTpl":false})
                            }
                        }
                    }
                }
                //先load Tips面板和控制器
                $scope.$emit("transitCtrlAndTpl", ctrlAndTplParams);
            }
        }
    ])