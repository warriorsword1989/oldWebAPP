/**
 * Created by liwanchong on 2015/9/25.
 */
var filedsModule = angular.module('mapApp', ['oc.lazyLoad']);
filedsModule.controller('fieldsResultController', ['$rootScope', '$scope', '$ocLazyLoad', '$timeout',
        function ($rootScope, $scope, $ocLazyLoad, $timeout) {
            var objCtrl = fastmap.uikit.ObjectEditController();
            var layerCtrl = fastmap.uikit.LayerController();
            $scope.workPoint = layerCtrl.getLayerById("workPoint");
            $scope.gpsLine = layerCtrl.getLayerById("gpsLine");
            $scope.showOrHideId= "";
            $scope.showOrHideIdOfPending = "";
            $scope.showOrHideIdOfPended = "";
            $scope.tipsObj = {};
            $("#fm-dataList-btnGroup button").click(function(){
                $("#fm-dataList-btnGroup button").removeClass("active");
                $(this).addClass("active");
            })
            Application.functions.getRdObjectById("37663","RDRESTRICTION",function(data) {
                objCtrl.setCurrentObject(data.data);
                $ocLazyLoad.load('ctrl/restrictionCtrl/rdRestriction').then(function () {
                        $scope.$parent.$parent.objectEditURL = 'js/tepl/restrictTepl/trafficLimitOfNormalTepl.html';
                    }
                );
            })
            // Application.functions.getTipsStatics([60560301, 60560302, 60560303, 60560304], [1, 3], function (data) {
            Application.functions.getTipsStatics([59567101, 59567102, 59567103, 59567104, 59567201, 60560301, 60560302, 60560303, 60560304], [1, 3], function (data) {
                $scope.$apply(function () {
                    var arr = [], transArr = [];
                    transArr = data.data.rows;
                        // console.log(data)
                    for (var i = 0, len = transArr.length; i < len; i++) {
                        var obj = {}, objArr = {};
                        obj = transArr[i];
                        for (var item in obj) {
                            switch (item) {
                                case "1101":
                                    objArr.name = "点限速";
                                    objArr.id = "1101";
                                    objArr.flag = true;
                                    $scope.tipsObj["1101"]=true;
                                    objArr.total = obj[item];
                                    break;
                                case "1201":
                                    objArr.name = "道路种别";
                                    objArr.id = "1201";
                                    objArr.flag = true;
                                    objArr.total = obj[item];
                                    $scope.tipsObj["1201"]=true;
                                    break;
                                case "1203":
                                    objArr.name = "道路方向";
                                    objArr.id = "1203";
                                    objArr.flag = true;
                                    objArr.total = obj[item];
                                    $scope.tipsObj["1203"]=true;
                                    break;
                                case "1301":
                                    objArr.name = "车信";
                                    objArr.id = "1301";
                                    objArr.flag = true;
                                    objArr.total = obj[item];
                                    $scope.tipsObj["1301"]=true;
                                    break;
                                case "1302":
                                    objArr.name = "交限";
                                    objArr.id = "1302";
                                    objArr.flag = true;
                                    objArr.total = obj[item];
                                    $scope.tipsObj["1302"]=true;
                                    break;
                                case "1407":
                                    objArr.name = "高速分歧";
                                    objArr.id = "1407";
                                    objArr.flag = true;
                                    objArr.total = obj[item];
                                    $scope.tipsObj["1407"]=true;
                                    break;
                                case "1510"://1510
                                    objArr.name = "桥";
                                    objArr.id = "1510";
                                    objArr.flag = true;
                                    objArr.total = obj[item];
                                    $scope.tipsObj["1510"]=true;
                                    break;
                                case "1604":
                                    objArr.name = "区域内道路";
                                    objArr.id = "1604";
                                    objArr.flag = true;
                                    objArr.total = obj[item];
                                    $scope.tipsObj["1604"]=true;
                                    break;
                                case "1704":
                                    objArr.name = "交叉路口名称";
                                    objArr.id = "1704";
                                    objArr.flag = true;
                                    objArr.total = obj[item];
                                    $scope.tipsObj["1704"]=true;
                                    break;
                                case "1803":
                                    objArr.name = "挂接";
                                    objArr.id = "1803";
                                    objArr.flag = true;
                                    objArr.total = obj[item];
                                    $scope.tipsObj["1803"]=true;
                                    break;
                                case "1901":
                                    objArr.name = "道路名";
                                    objArr.id = "1901";
                                    objArr.flag = true;
                                    objArr.total = obj[item];
                                    $scope.tipsObj["1901"]=true;
                                    break;
                                case "2001":
                                    objArr.name = "测线";
                                    objArr.id = "2001";
                                    objArr.flag = true;
                                    objArr.total = obj[item];
                                    $scope.tipsObj["2001"]=true;
                                    break;
                            }
                            arr.push(objArr);
                        }
                    }
                    $scope.items = arr;
                    $scope.items.total = data.data.total;
                })
            });
            var selectCtrl = new fastmap.uikit.SelectController();
            //切换处理 待处理 已处理 页面
            $scope.changeList = function (stage) {
                $scope.showOrHideId = "";
                if($scope.workPoint.requestType!=="") {
                    $scope.workPoint.requestType = "";
                    $scope.gpsLine.requestType = "";
                    $scope.workPoint.redraw();
                    $scope.gpsLine.redraw();
                }
                Application.functions.getTipsStatics([59567101, 59567102, 59567103, 59567104, 59567201, 60560301, 60560302, 60560303, 60560304], stage, function (data) {
                    $scope.$apply(function () {
                        var arr = [], transArr = [];
                        transArr = data.data.rows;
                        for (var i = 0, len = transArr.length; i < len; i++) {
                            var obj = {}, objArr = {};
                            obj = transArr[i];
                            for (var item in obj) {
                                switch (item) {
                                    case "1101":
                                        objArr.name = "点限速";
                                        objArr.id = "1101";
                                        objArr.flag = true;
                                        $scope.tipsObj["1101"]=true;
                                        objArr.total = obj[item];
                                        break;
                                    case "1201":
                                        objArr.name = "道路种别";
                                        objArr.id = "1201";
                                        objArr.flag = true;
                                        objArr.total = obj[item];
                                        $scope.tipsObj["1201"]=true;
                                        break;
                                    case "1203":
                                        objArr.name = "道路方向";
                                        objArr.id = "1203";
                                        objArr.flag = true;
                                        objArr.total = obj[item];
                                        $scope.tipsObj["1203"]=true;
                                        break;
                                    case "1301":
                                        objArr.name = "车信";
                                        objArr.id = "1301";
                                        objArr.flag = true;
                                        objArr.total = obj[item];
                                        $scope.tipsObj["1301"]=true;
                                        break;
                                    case "1302":
                                        objArr.name = "交限";
                                        objArr.id = "1302";
                                        objArr.flag = true;
                                        objArr.total = obj[item];
                                        $scope.tipsObj["1302"]=true;
                                        break;
                                    case "1407":
                                        objArr.name = "高速分歧";
                                        objArr.id = "1407";
                                        objArr.flag = true;
                                        objArr.total = obj[item];
                                        $scope.tipsObj["1407"]=true;
                                        break;
                                    case "1510"://1510
                                        objArr.name = "桥";
                                        objArr.id = "1510";
                                        objArr.flag = true;
                                        objArr.total = obj[item];
                                        $scope.tipsObj["1510"]=true;
                                        break;
                                    case "1604":
                                        objArr.name = "区域内道路";
                                        objArr.id = "1604";
                                        objArr.flag = true;
                                        objArr.total = obj[item];
                                        $scope.tipsObj["1604"]=true;
                                        break;
                                    case "1704":
                                        objArr.name = "交叉路口名称";
                                        objArr.id = "1704";
                                        objArr.flag = true;
                                        objArr.total = obj[item];
                                        $scope.tipsObj["1704"]=true;
                                        break;
                                    case "1803":
                                        objArr.name = "挂接";
                                        objArr.id = "1803";
                                        objArr.flag = true;
                                        objArr.total = obj[item];
                                        $scope.tipsObj["1803"]=true;
                                        break;
                                    case "1901":
                                        objArr.name = "道路名";
                                        objArr.id = "1901";
                                        objArr.flag = true;
                                        objArr.total = obj[item];
                                        $scope.tipsObj["1901"]=true;
                                        break;
                                    case "2001":
                                        objArr.name = "测线";
                                        objArr.id = "2001";
                                        objArr.flag = true;
                                        objArr.total = obj[item];
                                        $scope.tipsObj["2001"]=true;
                                        break;
                                }
                                arr.push(objArr);
                            }
                        }
                        $scope.items = arr;
                        $scope.items.total = data.data.total;
                    })
                });
            };


            //点击下拉框的时  显示内容
            $scope.showContent = function (item, arr, stage, event) {
                event.stopPropagation();
                if($scope.showOrHideId!=="") {
                    if ($("#" +  $scope.showOrHideId).hasClass("selected")) {
                        $("#" +  $scope.showOrHideId).removeClass("selected");
                        $("#" +  $scope.showOrHideId).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                    }
                    else {
                        $("#" +  $scope.showOrHideId).addClass("selected")
                        $("#" +  $scope.showOrHideId).find("i").addClass("glyphicon-folder-open").removeClass("glyphicon-folder-close")
                    }
                   if($scope.showOrHideId===item.id) {
                       $scope.showOrHideId = "";
                       return;
                   }
                }
                if($scope.showOrHideIdOfPending!=="") {
                    if ($("#" +  $scope.showOrHideIdOfPending).hasClass("selected")) {
                        $("#" +  $scope.showOrHideIdOfPending).removeClass("selected");
                        $("#" +  $scope.showOrHideIdOfPending).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                    }
                    else {
                        $("#" +  $scope.showOrHideIdOfPending).addClass("selected")
                        $("#" +  $scope.showOrHideIdOfPending).find("i").addClass("glyphicon-folder-open").removeClass("glyphicon-folder-close")
                    }
                    if($scope.showOrHideIdOfPending===(item.id+"Pending")) {
                        $scope.showOrHideIdOfPending= "";
                        return;
                    }
                }
                if($scope.showOrHideIdOfPended!=="") {
                    if ($("#" +  $scope.showOrHideIdOfPended).hasClass("selected")) {
                        $("#" +  $scope.showOrHideIdOfPended).removeClass("selected");
                        $("#" +  $scope.showOrHideIdOfPended).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                    }
                    else {
                        $("#" +  $scope.showOrHideIdOfPended).addClass("selected")
                        $("#" +  $scope.showOrHideIdOfPended).find("i").addClass("gglyphicon-folder-open").removeClass("glyphicon-folder-close")
                    }
                    if($scope.showOrHideIdOfPended===(item.id+"Pended")) {
                        $scope.showOrHideIdOfPended= "";
                        return;
                    }
                }

                //Application.functions.getTipsListItems([60560301, 60560302, 60560303, 60560304], arr, item.id, function (data) {
                Application.functions.getTipsListItems([59567101, 59567102, 59567103, 59567104, 59567201, 60560301, 60560302, 60560303, 60560304], arr, item.id, function (data) {
                    if (stage === 0) {
                        $scope.$apply(function () {
                            $scope.showOrHideId = item.id;
                            if ($("#" +  $scope.showOrHideId).hasClass("selected")) {
                                $("#" +  $scope.showOrHideId).removeClass("selected");
                                $("#" +  $scope.showOrHideId).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                            }
                            else {
                                $("#" +  $scope.showOrHideId).addClass("selected")
                                $("#" +  $scope.showOrHideId).find("i").addClass("glyphicon-folder-open").removeClass("glyphicon-folder-close")
                            }
                            $scope.allSubItems = data.data;
                        });
                    } else if (stage === 1) {
                        $scope.$apply(function () {
                            $scope.showOrHideIdOfPending = (item.id+"Pending");
                            if ($("#" +  $scope.showOrHideIdOfPending).hasClass("selected")) {
                                $("#" +  $scope.showOrHideIdOfPending).removeClass("selected");
                                $("#" +  $scope.showOrHideIdOfPending).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                            }
                            else {
                                $("#" +  $scope.showOrHideIdOfPending).addClass("selected")
                                $("#" +  $scope.showOrHideIdOfPending).find("i").addClass("glyphicon-folder-open").removeClass("glyphicon-folder-close")
                            }
                            $scope.pendSubItems = data.data;
                        });
                    } else if (stage === 3) {
                        $scope.$apply(function () {
                            $scope.showOrHideIdOfPended = (item.id+"Pended");
                            if ($("#" +  $scope.showOrHideIdOfPended).hasClass("selected")) {
                                $("#" +  $scope.showOrHideIdOfPended).removeClass("selected");
                                $("#" +  $scope.showOrHideIdOfPended).find("i").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close")
                            }
                            else {
                                $("#" +  $scope.showOrHideIdOfPended).addClass("selected")
                                $("#" +  $scope.showOrHideIdOfPended).find("i").addClass("glyphicon-folder-open").removeClass("glyphicon-folder-close")
                            }
                            $scope.solvedSubItems = data.data;
                        });
                    }

                })
            };
            //点击列表需要的方法
            $scope.showTab = function (item, e, pItemId) {
                $("#dataList>li>ul>li").click(function (e) {
                    e.stopPropagation()
                    $("#dataList>li>ul>li").removeClass("selected")
                    $(this).addClass("selected");
                    $("#tipsSubPanel").removeClass("normal").addClass("selected");
                })
                /*高亮显示当前选中的item*/
                //$.each($(".item-detail").find('td'), function (i, v) {
                //    $(v).removeClass('item-active');
                //})
                //$(e.target).addClass('item-active');
                if ($scope.$parent.$parent.dataTipsURL) {
                    $scope.$parent.$parent.dataTipsURL = "";
                }
                if ($scope.$parent.$parent.objectEditURL) {
                    $scope.$parent.$parent.objectEditURL = "";
                }
                $scope.$parent.$parent.tipsType = pItemId;
                $("#popoverTips").css("display", "block");
                Application.functions.getTipsResult(item.i, function (data) {
                    if (data.rowkey === "undefined") {
                        return;
                    }
                    $scope.$parent.$parent.rowkeyOfDataTips = data.rowkey;

                    selectCtrl.fire("selectByAttribute", {feather: data});
                    $("#picMapShow").css("display", "none");
                    if(pItemId==="1101") {//限速
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        console.log(data.g_location.coordinates[1]+"_"+data.g_location.coordinates[0])
                        var center=map.getCenter();
                        console.log(center["lat"],center["lng"]);
                        objCtrl.setCurrentObject(data.data);
                        var speedLimitId = data.id;
                        $scope.showTipsOrProperty(data, "RDSPEEDLIMIT", objCtrl, speedLimitId, "ctrl/speedLimitCtrl", "js/tepl/speedLimitTepl.html");
                    } else if (pItemId === "1201") {//道路种别
                        Application.functions.getRdObjectById(data.f.id, "RDLINK", function (d) {
                            $ocLazyLoad.load("ctrl/sceneAllTipsCtrl").then(function () {
                                map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20)
                                $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                                console.log(d.errcode)
                                if (d.errcode === -1) {
                                   // swal("查询失败", d.errmsg, "error");
                                   $timeout(function(){
                                        $.showPoiMsg(d.errmsg,e);
                                        $scope.$apply();
                                    })
                                    return;
                                } else {
                                    $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                                        $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                                        objCtrl.setCurrentObject(d);
                                    });
                                }
                            });
                        });
                    } else if (pItemId === "1203") {//道路方向
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                        });
                        if (data.f.type == 1) {
                            $scope.dataId = data.f.id;
                            Application.functions.getRdObjectById($scope.dataId, "RDLINK", function (d) {
                                var linkArr = d.data.geometry.coordinates || d.geometry.coordinates, points = [];
                                for (var i = 0, len = linkArr.length; i < len; i++) {
                                    var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                                    points.push(point);
                                }
                                // map.panTo({lat: points[0].y, lon: points[0].x});
                                map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                                var line = fastmap.mapApi.lineString(points);
                                selectCtrl.onSelected({geometry: line, id: $scope.dataId});
                                objCtrl.setCurrentObject(d);
                                if (objCtrl.updateObject !== "") {
                                    objCtrl.updateObject();
                                }
                                $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                                    $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                                });
                            });
                        }

                    } else if (pItemId === "1301") {//车信
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20)
                        objCtrl.setCurrentObject(data.data);
                        var connexityId = data.id;
                        $scope.showTipsOrProperty(data, "RDLANECONNEXITY", objCtrl, connexityId, "ctrl/rdLaneConnexityCtrl", "js/tepl/rdLaneConnexityTepl.html");
                    } else if (pItemId === "1302") {//交限
                        if (data.t_lifecycle === 1) {
                            var tracInfoArr = data.t_trackInfo, trackInfoFlag = false;

                            for (var trackNum = 0, trackLen = tracInfoArr.length; trackNum < trackLen; trackNum++) {
                                if (tracInfoArr[trackNum].stage === 3) {
                                    trackInfoFlag = true;
                                    break;
                                }
                            }
                            if (trackInfoFlag) {
                                $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";
                                    $scope.$parent.$parent.objectEditURL = "";
                                });
                            } else {
                                Application.functions.getRdObjectById(data.id, "RDRESTRICTION", function (data) {
                                    objCtrl.setCurrentObject(data.data);
                                    if (objCtrl.updateObject !== "") {
                                        objCtrl.updateObject();
                                    }
                                    $ocLazyLoad.load("ctrl/rdRestriction").then(function () {
                                        $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                                        $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";
                                        });
                                    });
                                })
                            }
                        } else {
                            if (data.id === undefined) {
                                $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";
                                    $scope.$parent.$parent.objectEditURL = "";
                                });
                            } else {
                                Application.functions.getRdObjectById(data.id, "RDRESTRICTION", function (data) {
                                    objCtrl.setCurrentObject(data.data);
                                    if (objCtrl.updateObject !== "") {
                                        objCtrl.updateObject();
                                    }
                                    $ocLazyLoad.load("ctrl/rdRestriction").then(function () {
                                        $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                                        $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";
                                        });
                                    });
                                })
                            }
                        }

                    } else if (pItemId === "1407") {//高速分歧
                        $("#picMapShow").css("display", "block");
                        $ocLazyLoad.load("ctrl/rdBanchCtrl").then(function () {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/rdBranchTep.html";
                            $ocLazyLoad.load('ctrl/sceneHightSpeedDiverTeplCtrl').then(function () {
                                $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneHightSpeedDiverTepl.html";
                            });
                        });
                        objCtrl.setCurrentObject(data.brID);
                        map.panTo({lat: data.g_location.coordinates[1], lon: data.g_location.coordinates[0]});
                        /*$.each(data.brID,function(i,v){
                         console.log(v.id)
                         Application.functions.getRdObjectById(v.id, "RDBRANCH", function (d) {
                         objCtrl.setCurrentObject(d.data);
                         });
                         });*/
                    } else if (pItemId === "1510") {//桥1510
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                        });
                        $scope.$parent.$parent.brigeLinkArray = data.f_array;
                        if(!data.f_array.length){
                            $timeout(function(){
                                $.showPoiMsg('f_array为空',e);
                                $scope.$apply();
                            });
                            return;
                        }
                        Application.functions.getRdObjectById(data.f_array[0].id, "RDLINK", function (d) {
                            if (d.errcode === -1) {
                                $timeout(function(){
                                    $.showPoiMsg(d.errmsg,e);
                                    $scope.$apply();
                                });
                                return;
                            }
                            var linkArr = d.data.geometry.coordinates || d.geometry.coordinates, points = [];
                            for (var i = 0, len = linkArr.length; i < len; i++) {
                                var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                                points.push(point);
                            }
                            // map.panTo({lat: (data.gSLoc.coordinates[1]+data.gELoc.coordinates[1])/2, lon: (data.gELoc.coordinates[0]+data.gSLoc.coordinates[0])/2});
                            map.panTo({lat: points[0].y, lon: points[0].x});
                            var line = fastmap.mapApi.lineString(points);
                            selectCtrl.onSelected({geometry: line, id: data.f_array[0].id});
                            objCtrl.setCurrentObject(d);
                            if (objCtrl.updateObject !== "") {
                                objCtrl.updateObject();
                            }
                            $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                                $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                            });
                        });

                    } else if (pItemId === "1604") {//区域内道路

                        map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 20)
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                        });
                        if (data.f_array.length > 0) {
                            // $scope.$parent.$parent.brigeLinkArray= data.f_array;
                            Application.functions.getRdObjectById(data.f_array[0].id, "RDLINK", function (data) {
                                if (data.errcode === -1) {
                                    return;
                                }
                                var linkArr = data.data.geometry.coordinates || data.geometry.coordinates, points = [];
                                for (var i = 0, len = linkArr.length; i < len; i++) {
                                    var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                                    points.push(point);
                                }
                                map.panTo({lat: points[0].y, lon: points[0].x});
                                var line = fastmap.mapApi.lineString(points);
                                selectCtrl.onSelected({geometry: line, id: $scope.dataId});
                                objCtrl.setCurrentObject(data);
                                if (objCtrl.updateObject !== "") {
                                    objCtrl.updateObject();
                                }
                                $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                                    $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                                });
                            });
                        }

                    } else if (pItemId === "1704") {//交叉路口
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20)
                        //map.panTo({lat: data.g_location.coordinates[1], lon: data.g_location.coordinates[0]});
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                            if (data.f.id) {
                                var obj = {"nodePid": parseInt(data.f.id)};
                                var param = {
                                    "projectId": 11,
                                    "type": "RDCROSS",
                                    "data": obj
                                }
                                Application.functions.getByCondition(JSON.stringify(param), function (data) {
                                    if (data.errcode === -1) {
                                       $timeout(function(){
                                            $.showPoiMsg('errid:'+data.errid+' ,errmsg:'+data.errmsg,e);
                                            $scope.$apply();
                                        })
                                        return;
                                    } else {
                                        objCtrl.setCurrentObject(data.data[0]);
                                        $ocLazyLoad.load('ctrl/rdCrossCtrl').then(function () {
                                            $scope.$parent.$parent.objectEditURL = "js/tepl/rdCrossTepl.html";

                                        });
                                    }
                                });
                            }

                        });


                    } else if (pItemId === "1801") {//挂接
                        $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneHangingTepl.html";
                    } else if (pItemId === "1901") {//道路名
                        //$scope.$parent.$parent.dataTipsURL = "js/tepl/sceneIntersectionTepl.html";
                        map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 19);

                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                        });


                    } else if (pItemId === "2001") {//测线
                        objCtrl.setCurrentObject(data);
                        map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 20)
                        $scope.showTipsOrProperty(data, "RDLINK", objCtrl, data.id, "ctrl/linkObjectCtrl", "js/tepl/currentObjectTepl.html");

                    }
                })
            };
            //checkbox中的处理方法
            $scope.showLayers = function (item,event) {
                event.stopPropagation();
                item.flag = !item.flag;
                if(!item.flag) {
                    delete $scope.tipsObj[item.id] ;
                }else{
                    $scope.tipsObj[item.id] = true;
                }
                var tips = Object.keys($scope.tipsObj);
                $scope.workPoint.requestType = tips;
                $scope.gpsLine.requestType = tips;
                $scope.workPoint.redraw();
                $scope.gpsLine.redraw();

            };

            $scope.showTipsOrProperty = function (data, type, objCtrl, propertyId, propertyCtrl, propertyTepl) {
                $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                    if (data.t_lifecycle === 2) {
                        Application.functions.getRdObjectById(propertyId, type, function (data) {
                            objCtrl.setCurrentObject(data.data);
                            if (objCtrl.tipsUpdateObject !== "") {
                                objCtrl.tipsUpdateObject();
                            }
                            $ocLazyLoad.load(propertyCtrl).then(function () {
                                $scope.$parent.$parent.objectEditURL = propertyTepl;

                            });
                        });
                    } else {
                        var stageLen = data.t_trackInfo.length;
                        var stage = data.t_trackInfo[stageLen - 1];
                        if (stage.stage === 1) {
                            if (data.t_lifecycle === 1) {
                                Application.functions.getRdObjectById(propertyId, type, function (data) {
                                    objCtrl.setCurrentObject(data.data);
                                    if (objCtrl.tipsUpdateObject !== "") {
                                        objCtrl.tipsUpdateObject();
                                    }
                                    $ocLazyLoad.load(propertyCtrl).then(function () {
                                        $scope.$parent.$parent.objectEditURL = propertyTepl;

                                    });
                                });
                            }

                        } else if (stage.stage === 3) {
                            if (data.t_lifecycle === 3) {
                                Application.functions.getRdObjectById(propertyId, type, function (data) {
                                    objCtrl.setCurrentObject(data.data);
                                    if (objCtrl.tipsUpdateObject !== "") {
                                        objCtrl.tipsUpdateObject();
                                    }
                                    $ocLazyLoad.load(propertyCtrl).then(function () {
                                        $scope.$parent.$parent.objectEditURL = propertyTepl;

                                    });
                                });
                            }
                        }
                    }
                });
            }
        }
    ]
)