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
            $scope.eventController = fastmap.uikit.EventController();
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
            })
            /*清除图层*/
            $scope.clearLayer = function(v){
                v.flag = false;
                delete $scope.tipsObj[v.id] ;
            }
            /*全选、反选事件*/
            $scope.showAllLayers = function(typeName,typeArr){
                if($scope[typeName]){
                    $.each($scope.items,function(i,v){
                        $scope.clearLayer(v);
                    });
                    $scope.workPoint.requestType = [0];
                    $scope.gpsLine.requestType = [0];
                    $scope.workPoint.redraw();
                    $scope.gpsLine.redraw();
                    $scope[typeName] = false;
                }else{
                    $.each($scope.items,function(i,v){
                        v.flag = true;
                        $scope.changeList(typeArr);
                    });
                    $scope[typeName] = true;
                }
            }
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
                $scope.showAll = true;
                $scope.showAllPre = true;
                $scope.showAllYet = true;
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
                if($scope.$parent.$parent.panelFlag) {
                    $scope.$parent.$parent.panelFlag = false;
                    $scope.$parent.$parent.objectFlag = false;
                }
                if(!$scope.$parent.$parent.outErrorArr[3]) {
                    $scope.$parent.$parent.outErrorArr[0]=false;
                    $scope.$parent.$parent.outErrorArr[1]=false;
                    $scope.$parent.$parent.outErrorArr[2]=false;
                    $scope.$parent.$parent.outErrorArr[3]=true;
                    $scope.$parent.$parent.outErrorUrlFlag = !$scope.$parent.$parent.outErrorUrlFlag;
                }
                if($scope.$parent.$parent.suspendFlag) {
                    $scope.$parent.$parent.suspendFlag = false;
                }
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
                            $scope.allStyleArr = [];
                            for(var i= 0,len=$scope.allSubItems.length;i<len;i++) {
                                $scope.allStyleArr[i] = false;
                            }
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
                            $scope.pendingStyleArr = [];
                            for(var j= 0,lenJ=$scope.pendSubItems.length;j<lenJ;j++) {
                                $scope.pendingStyleArr[j] = false;
                            }
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
                            $scope.solvedStyleArr = [];
                            for(var k= 0,lenK=$scope.solvedSubItems.length;k<lenK;k++) {
                                $scope.solvedStyleArr[k] = false;
                            }
                        });
                    }

                })
            };
            $scope.changeStyleArr=function(arr,index) {
                for(var i= 0,len=arr.length;i<len;i++) {
                    if(i===index) {
                        arr[i] = true;
                    }else{
                        arr[i] = false;
                    }
                }
            };
            //点击列表需要的方法
            $scope.showTab = function (item, e, pItemId,index) {
                $scope.$parent.$parent.objectFlag=false;
                $scope.$parent.$parent.panelFlag=false;
                //$("#dataList>li>ul>li").removeClass("selected")
                //$("#dataList>li>ul>li").addClass("selected");
               if($scope.allStyleArr&&$scope.allStyleArr.length>=1) {
                   $scope.changeStyleArr($scope.allStyleArr, index);
               }
                if($scope.pendingStyleArr&&$scope.pendingStyleArr.length>=1) {
                   $scope.changeStyleArr($scope.pendingStyleArr, index);
               }
                if($scope.solvedStyleArr&&$scope.solvedStyleArr.length>=1) {
                   $scope.changeStyleArr($scope.solvedStyleArr, index);
               }

                $("#tipsSubPanel").removeClass("normal").addClass("selected");
                if ($scope.$parent.$parent.dataTipsURL) {
                    $scope.$parent.$parent.dataTipsURL = "";
                }
                if ($scope.$parent.$parent.objectEditURL) {
                    $scope.$parent.$parent.objectEditURL = "";
                    $ocLazyLoad.load('ctrl/blankCtrl').then(function () {
                        $scope.$parent.$parent.objectEditURL = 'js/tepl/blankTepl.html';})

                }

                $scope.$parent.$parent.tipsType = pItemId;
                $("#popoverTips").css("display", "block");
                Application.functions.getTipsResult(item.i, function (data) {
                    if (data.rowkey === "undefined") {
                        return;
                    }
                    $scope.$parent.$parent.rowkeyOfDataTips = data.rowkey;
                    $scope.eventController.fire( $scope.eventController.eventTypes.SELECTBYATTRIBUTE, {feather: data});
                    if(pItemId==="1101") {//限速
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        var speedLimitId = data.id;
                        $scope.showTipsOrProperty(data, "RDSPEEDLIMIT", objCtrl, speedLimitId, "ctrl/speedLimitCtrl", "js/tepl/speedLimitTepl.html");
                    } else if (pItemId === "1201") {//道路种别
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        $scope.showTipsOrProperty(data, "RDSPEEDLIMIT", objCtrl, speedLimitId, "ctrl/linkObjectCtrl", "js/tepl/linkObjTepl/linkObjectTepl.html");
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
                                map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                                var line = fastmap.mapApi.lineString(points);
                                selectCtrl.onSelected({geometry: line, id: $scope.dataId});
                                objCtrl.setCurrentObject("RDLINK", d.data);
                                if (objCtrl.updateObject !== "") {
                                    objCtrl.updateObject();
                                }
                                $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                                    $scope.$parent.$parent.objectEditURL = "js/tepl/linkObjTepl/linkObjectTepl.html";
                                    if(! $scope.$parent.$parent.panelFlag ) {
                                        $scope.$parent.$parent.panelFlag = true;
                                        $scope.$parent.$parent.objectFlag = true;
                                        $scope.$parent.$parent.outErrorArr[3]=false;
                                        $scope.$parent.$parent.outErrorArr[1]=true;
                                    }
                                });
                            });
                        }

                    } else if (pItemId === "1301") {//车信
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        $scope.showTipsOrProperty(data, "RDLANECONNEXITY", objCtrl,  data.id, "ctrl/connexityCtrl/rdLaneConnexityCtrl", "js/tepl/connexityTepl/rdLaneConnexityTepl.html");
                    } else if (pItemId === "1302") {//交限
                        $scope.showTipsOrProperty(data, "RDRESTRICTION", objCtrl,  data.id, "ctrl/restrictionCtrl/rdRestriction", "js/tepl/restrictTepl/trafficLimitOfNormalTepl.html");
                    } else if (pItemId === "1407") {//高速分歧
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                        });
                        if(data.brId.length != 0){
                            $scope.$parent.$parent.objectFlag = true;
                            $scope.$parent.$parent.panelFlag = true;
                            $scope.$parent.$parent.outErrorArr[3]=false;
                            $scope.$parent.$parent.outErrorArr[1]=true;
                            $ocLazyLoad.load("ctrl/branchCtrl/namesOfBranchCtrl").then(function () {
                                $scope.$parent.$parent.objectEditURL = "js/tepl/branchTepl/namesOfBranch.html";
                            });
                        }else{
                            $scope.$parent.$parent.objectFlag = false;
                            $scope.$parent.$parent.panelFlag = false;
                            $scope.$parent.$parent.outErrorArr[3]=true;
                            $scope.$parent.$parent.outErrorArr[1]=false;
                        }
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
                            map.panTo({lat: points[0].y, lon: points[0].x});
                            var line = fastmap.mapApi.lineString(points);
                            selectCtrl.onSelected({geometry: line, id: data.f_array[0].id});
                            objCtrl.setCurrentObject("RDLINK", d.data);
                            $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                                if(! $scope.$parent.$parent.panelFlag ) {
                                    $scope.$parent.$parent.panelFlag = true;
                                    $scope.$parent.$parent.objectFlag = true;
                                    $scope.$parent.$parent.outErrorArr[3]=false;
                                    $scope.$parent.$parent.outErrorArr[1]=true;
                                }
                                $scope.$parent.$parent.objectEditURL = "js/tepl/linkObjTepl/linkObjectTepl.html";
                            });
                        });

                    } else if (pItemId === "1604") {//区域内道路

                        map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 20)
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                        });
                        if (data.f_array.length > 0) {
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
                                objCtrl.setCurrentObject("RDLINK",data.data);
                                $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                                    if(! $scope.$parent.$parent.panelFlag ) {
                                        $scope.$parent.$parent.panelFlag = true;
                                        $scope.$parent.$parent.objectFlag = true;
                                        $scope.$parent.$parent.outErrorArr[3]=false;
                                        $scope.$parent.$parent.outErrorArr[1]=true;
                                    }
                                    $scope.$parent.$parent.objectEditURL = "js/tepl/linkObjectTepl.html";
                                });
                            });
                        }

                    } else if (pItemId === "1704") {//交叉路口
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20)
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                            if (data.f.id) {
                                var obj = {"nodePid": parseInt(data.f.id)};
                                var param = {
                                    "projectId": Application.projectid,
                                    "type": "RDCROSS",
                                    "data": obj
                                }
                                Application.functions.getByCondition(JSON.stringify(param), function (data) {
                                    if (data.errcode === -1) {
                                       $timeout(function(){
                                            $.showPoiMsg(data.errmsg,e);
                                            $scope.$apply();
                                        })
                                        return;
                                    } else {
                                        objCtrl.setCurrentObject("RDCROSS",data.data[0]);
                                        $ocLazyLoad.load('ctrl/crossCtrl/rdCrossCtrl').then(function () {
                                            if(! $scope.$parent.$parent.panelFlag ) {
                                                $scope.$parent.$parent.panelFlag = true;
                                                $scope.$parent.$parent.objectFlag = true;
                                                $scope.$parent.$parent.outErrorArr[3]=false;
                                                $scope.$parent.$parent.outErrorArr[1]=true;
                                            }
                                            $scope.$parent.$parent.objectEditURL = "js/tepl/crossTepl/rdCrossTepl.html";

                                        });
                                    }
                                });
                            }

                        });


                    } else if (pItemId === "1801") {//挂接
                        $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneHangingTepl.html";
                    } else if (pItemId === "1901") {//道路名
                        map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 19);

                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                        });


                    } else if (pItemId === "2001") {//测线
                        map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 20)
                        $scope.showTipsOrProperty(data, "RDLINK", objCtrl, data.id, "ctrl/linkObjectCtrl", "js/tepl/linkObjTepl/linkObjectTepl.html");

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
                            if(data.errcode===-1){
                                return;
                            }
                            objCtrl.setCurrentObject(type,data.data);
                            $ocLazyLoad.load(propertyCtrl).then(function () {
                                if(!$scope.$parent.$parent.panelFlag ) {
                                    $scope.$parent.$parent.panelFlag = true;
                                    $scope.$parent.$parent.objectFlag = true;
                                }
                                $scope.$parent.$parent.objectEditURL = propertyTepl;

                            });
                        });
                    } else {
                        var stageLen = data.t_trackInfo.length;
                        var stage = data.t_trackInfo[stageLen - 1];
                        if (stage.stage === 1) {
                            if (data.t_lifecycle === 1) {
                                Application.functions.getRdObjectById(propertyId, type, function (data) {
                                    if(data.errcode===-1){
                                        return;
                                    }
                                    objCtrl.setCurrentObject(type,data.data);
                                    $ocLazyLoad.load(propertyCtrl).then(function () {
                                        if(!$scope.$parent.$parent.panelFlag ) {
                                            $scope.$parent.$parent.panelFlag = true;
                                            $scope.$parent.$parent.objectFlag = true;
                                        }
                                        $scope.$parent.$parent.objectEditURL = propertyTepl;

                                    });
                                });
                            }

                        } else if (stage.stage === 3) {
                            if (data.t_lifecycle === 3) {
                                Application.functions.getRdObjectById(propertyId, type, function (data) {
                                    if(data.errcode===-1){
                                        return;
                                    }
                                    objCtrl.setCurrentObject(type,data.data);
                                    $ocLazyLoad.load(propertyCtrl).then(function () {
                                        if(!$scope.$parent.$parent.panelFlag ) {
                                            $scope.$parent.$parent.panelFlag = true;
                                            $scope.$parent.$parent.objectFlag = true;
                                        }
                                        if($scope.$parent.$parent.dataTipsURLFlag) {
                                            $scope.$parent.$parent.dataTipsURLFlag = false;
                                        }
                                        $scope.$parent.$parent.objectEditURL = propertyTepl;

                                    });
                                });
                            }else{
                                if($scope.$parent.$parent.panelFlag) {
                                    $scope.$parent.$parent.panelFlag = false;
                                    $scope.$parent.$parent.objectFlag = false;
                                }
                            }
                        }else{
                            if($scope.$parent.$parent.panelFlag) {
                                $scope.$parent.$parent.panelFlag = false;
                                $scope.$parent.$parent.objectFlag = false;
                            }
                        }
                    }
                });
            }
        }
    ]
)