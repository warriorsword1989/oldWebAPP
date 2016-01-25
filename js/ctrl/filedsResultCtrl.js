/**
 * Created by liwanchong on 2015/9/25.
 */
var filedsModule = angular.module('mapApp', ['oc.lazyLoad']);
filedsModule.controller('fieldsResultController', ['$rootScope', '$scope', '$ocLazyLoad',
        function ($rootScope, $scope, $ocLazyLoad) {
           // Application.functions.getTipsStatics([60560301, 60560302, 60560303, 60560304], [1, 3], function (data) {
            Application.functions.getTipsStatics([59567201,60560301, 60560302, 60560303, 60560304], [1, 3], function (data) {
                $scope.$apply(function () {
                    var arr = [], transArr = [];
                   // data.data.rows.push({"1901":10});
                    transArr = data.data.rows;
                    for (var i = 0, len = transArr.length; i < len; i++) {
                        var obj = {}, objArr = {};
                        obj = transArr[i];
                        for (var item in obj) {
                            switch (item) {
                                case "1101":
                                    objArr.name = "限速";
                                    objArr.id = "1101";
                                    objArr.total = obj[item];
                                    break;
                                case "1201":
                                    objArr.name = "道路种别";
                                    objArr.id = "1201";
                                    objArr.total = obj[item];
                                    break;
                                case "1203":
                                    objArr.name = "道路方向";
                                    objArr.id = "1203";
                                    objArr.total = obj[item];
                                    break;
                                case "1301":
                                    objArr.name = "车信";
                                    objArr.id = "1301";
                                    objArr.total = obj[item];
                                    break;
                                case "1302":
                                    objArr.name = "交限";
                                    objArr.id = "1302";
                                    objArr.total = obj[item];
                                    break;
                                case "1407":
                                    objArr.name = "高速分歧";
                                    objArr.id = "1407";
                                    objArr.total = obj[item];
                                    break;
                                case "1510"://1501
                                    objArr.name = "桥";
                                    objArr.id = "1510";
                                    objArr.total = obj[item];
                                    break;
                                case "1604":
                                    objArr.name = "区域内道路";
                                    objArr.id = "1604";
                                    objArr.total = obj[item];
                                    break;
                                case "1704":
                                    objArr.name = "交叉路口名称";
                                    objArr.id = "1704";
                                    objArr.total = obj[item];
                                    break;
                                case "1803":
                                    objArr.name = "挂接";
                                    objArr.id = "1803";
                                    objArr.total = obj[item];
                                    break;
                                case "1901":
                                    objArr.name = "道路名";
                                    objArr.id = "1901";
                                    objArr.total = obj[item];
                                    break;
                                case "2001":
                                    objArr.name = "测线";
                                    objArr.id = "2001";
                                    objArr.total = obj[item];
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
            var objCtrl = new fastmap.uikit.ObjectEditController();
            //切换处理 待处理 已处理 页面
            $scope.changeList = function (stage) {
               // Application.functions.getTipsStatics([60560301, 60560302, 60560303, 60560304], stage, function (data) {
                Application.functions.getTipsStatics([59567201,60560301, 60560302, 60560303, 60560304], stage, function (data) {
                    $scope.$apply(function () {
                        var arr = [], transArr = [];
                        transArr = data.data.rows;
                        for (var i = 0, len = transArr.length; i < len; i++) {
                            var obj = {}, objArr = {};
                            obj = transArr[i];
                            for (var item in obj) {
                                switch (item) {
                                    case "1101":
                                        objArr.name = "限速";
                                        objArr.id = "1101";
                                        objArr.total = obj[item];
                                        break;
                                    case "1201":
                                        objArr.name = "道路种别";
                                        objArr.id = "1201";
                                        objArr.total = obj[item];
                                        break;
                                    case "1203":
                                        objArr.name = "道路方向";
                                        objArr.id = "1203";
                                        objArr.total = obj[item];
                                        break;
                                    case "1301":
                                        objArr.name = "车信";
                                        objArr.id = "1301";
                                        objArr.total = obj[item];
                                        break;
                                    case "1302":
                                        objArr.name = "交限";
                                        objArr.id = "1302";
                                        objArr.total = obj[item];
                                        break;
                                    case "1407":
                                        objArr.name = "高速分歧";
                                        objArr.id = "1407";
                                        objArr.total = obj[item];
                                        break;
                                    case "1510"://1510
                                        objArr.name = "桥";
                                        objArr.id = "1510";
                                        objArr.total = obj[item];
                                        break;
                                    case "1604":
                                        objArr.name = "区域内道路";
                                        objArr.id = "1604";
                                        objArr.total = obj[item];
                                        break;
                                    case "1704":
                                        objArr.name = "交叉路口名称";
                                        objArr.id = "1704";
                                        objArr.total = obj[item];
                                        break;
                                    case "1803":
                                        objArr.name = "挂接";
                                        objArr.id = "1803";
                                        objArr.total = obj[item];
                                        break;
                                    case "1901":
                                        objArr.name = "道路名";
                                        objArr.id = "1901";
                                        objArr.total = obj[item];
                                        break;
                                    case "2001":
                                        objArr.name = "测线";
                                        objArr.id = "2001";
                                        objArr.total = obj[item];
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
            $scope.showContent = function (item, arr, stage) {
                for(var k  in $scope.items) {
                    if($('#'+ $scope.items[k].id).hasClass('in')) {
                        $('#'+ $scope.items[k].id).removeClass('in')
                    }
                }
                    //Application.functions.getTipsListItems([60560301, 60560302, 60560303, 60560304], arr, item.id, function (data) {
                    Application.functions.getTipsListItems([59567201,60560301, 60560302, 60560303, 60560304], arr, item.id, function (data) {
                        if (stage === 0) {
                            $scope.$apply(function () {
                                $scope.allSubItems = data.data;
                            });
                        } else if (stage === 1) {
                            $scope.$apply(function () {
                                $scope.pendSubItems = data.data;
                            });
                        } else if (stage === 3) {
                            $scope.solvedSubItems = data.data;
                        }

                    })
            };
            //点击列表需要的方法
            $scope.showTab = function (item,e,pItemId) {
                /*高亮显示当前选中的item*/
                $.each($(".item-detail").find('td'),function(i,v){
                    $(v).removeClass('item-active');
                })
                $(e.target).addClass('item-active');
                if ($scope.$parent.$parent.dataTipsURL) {
                    $scope.$parent.$parent.dataTipsURL = "";
                }
                if ($scope.$parent.$parent.objectEditURL) {
                    $scope.$parent.$parent.objectEditURL = "";
                }
                $scope.$parent.$parent.tipsType=pItemId;
                $("#popoverTips").css("display", "block");
                Application.functions.getTipsResult(item.i, function (data) {
                    if (data.rowkey === "undefined") {
                        return;
                    }
                    $scope.$parent.$parent.rowkeyOfDataTips = data.rowkey;
                    //if ($scope.$parent.$parent.updateDataTips !== "") {
                    //    $scope.$parent.$parent.updateDataTips(data);
                    //}
                    selectCtrl.fire("selectByAttribute", {feather: data});
                    $("#picMapShow").css("display", "none");
                    // console.log(data);
                    if(pItemId==="1101") {//限速
                        //$scope.$parent.$parent.speedLimitDatas = $scope.speedLimitDate[ind];
                        //$scope.$parent.$parent.speedLimitGeometryDatas = $scope.speedLimitDate[ind];
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 19)
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                            objCtrl.setCurrentObject(data.data);
                            //$scope.dataId=data.f.id;
                            //Application.functions.getRdObjectById($scope.dataId, "RDLINK", function (data) {
                            //    var linkArr = data.data.geometry.coordinates || data.geometry.coordinates, points = [];
                            //    for (var i = 0, len = linkArr.length; i < len; i++) {
                            //        var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                            //        points.push(point);
                            //    }
                            //    map.panTo({lat: points[0].y, lon: points[0].x});
                            //    var line = fastmap.mapApi.lineString(points);
                            //    selectCtrl.onSelected({geometry: line, id: $scope.dataId});
                            //    if (objCtrl.updateObject !== "") {
                            //        objCtrl.updateObject();
                            //    }
                            //});
                            $scope.showTipsOrProperty(data,"RDSPEEDLIMIT","ctrl/speedLimitCtrl","js/tepl/speedLimitTepl.html");

                        });
                    }else if(pItemId==="1201"){//道路种别
                        Application.functions.getRdObjectById(data.f.id, "RDLINK", function (d) {
                           $ocLazyLoad.load("ctrl/sceneAllTipsCtrl").then(function () {
                               map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 19)
                                $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                                if (d.errcode === -1) {
                                   swal("查询失败", d.errmsg, "error");
                                   return;
                               }else{
                                    $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                                        $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                                        objCtrl.setCurrentObject(d);
                                        //map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 18);
                                    });
                               }
                            });
                        });
                    }else if(pItemId==="1203"){//道路方向
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                        });
                        if(data.f.type==1){
                            $scope.dataId=data.f.id;
                            Application.functions.getRdObjectById($scope.dataId, "RDLINK", function (data) {
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

                    }else if(pItemId==="1301"){//车信
                        Application.functions.getRdObjectById(data.id, "RDLANECONNEXITY", function (data) {
                            objCtrl.setCurrentObject(data.data);
                            $ocLazyLoad.load("ctrl/rdLaneConnexityCtrl").then(function () {
                                $scope.$parent.$parent.objectEditURL = "js/tepl/rdLaneConnexityTepl.html";
                                $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                                });
                            });
                        });
                    }else if(pItemId==="1302") {//交限
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
                            if (data.id === 0) {
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

                    }else if(pItemId==="1407"){//高速分歧
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
                    }else if(pItemId==="1510"){//桥1510
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                        });
                        data.f_array.push({id:"413226",type:1});
                        data.f_array.push({id:"49101507",type:1});
                        $scope.$parent.$parent.brigeLinkArray= data.f_array;
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

                    }else if(pItemId==="1604"){//区域内道路
                        //$scope.$parent.$parent.dataTipsURL = "js/tepl/sceneRegionalRoadTepl.html";
                        map.setView([data.geo.coordinates[1], data.geo.coordinates[0]], 19)
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                        });
                        if(data.f_array.length>0){
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

                    }else if(pItemId==="1704"){//交叉路口
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20)
                        //map.panTo({lat: data.g_location.coordinates[1], lon: data.g_location.coordinates[0]});
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                            if(data.f.id) {
                                var obj = {"nodePid": parseInt(data.f.id)};
                                var param={
                                    "projectId":11,
                                    "type":"RDCROSS",
                                     "data":obj
                                }
                                Application.functions.getByCondition(JSON.stringify(param), function (data) {
                                    objCtrl.setCurrentObject(data.data[0]);
                                    $ocLazyLoad.load('ctrl/rdCrossCtrl').then(function () {
                                        $scope.$parent.$parent.objectEditURL = "js/tepl/rdCrossTepl.html";

                                    });
                                });
                            }

                        });


                    }else if(pItemId==="1801"){//挂接
                        $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneHangingTepl.html";
                    }else if(pItemId==="1901"){//道路名
                        //$scope.$parent.$parent.dataTipsURL = "js/tepl/sceneIntersectionTepl.html";
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 19)
                        $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                        });
                    }else if(pItemId==="2001"){//测线
                        Application.functions.getRdObjectById(data.f.id, "RDLINK", function (d) {
                           $ocLazyLoad.load("ctrl/sceneAllTipsCtrl").then(function () {
                                map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 18);
                                $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                                // objCtrl.setCurrentObject(data);
                                if (d.errcode === -1) {
                                   swal("查询失败", d.errmsg, "error");
                                   return;
                               }else{
                                    $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                                        $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                                        objCtrl.setCurrentObject(d);
                                    });
                               }
                            });
                        });
                    }
                })
            };
            //checkbox中的处理方法
            $scope.showLayers = function (item) {
                item.choose = !item.choose;
                // console.log($scope.items);
            };

            $scope.showTipsOrProperty=function(data,type,objCtrl,propertyCtrl,propertyTepl){
                $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                    if(data.t_lifecycle===2) {
                        Application.functions.getRdObjectById(data.id, type, function (data) {
                            objCtrl.setCurrentObject(data.data);
                            if (objCtrl.tipsUpdateObject !== "") {
                                objCtrl.tipsUpdateObject();
                            }
                            $ocLazyLoad.load(propertyCtrl).then(function () {
                                $scope.$parent.$parent.objectEditURL = propertyTepl;

                            });
                        });
                    }else{
                        var stageLen = data.t_trackInfo.length;
                        var stage = data.t_trackInfo[stageLen - 1];
                        if(stage===1) {
                            if(data.t_lifecycle ===1) {
                                Application.functions.getRdObjectById(data.id, type, function (data) {
                                    objCtrl.setCurrentObject(data.data);
                                    if (objCtrl.tipsUpdateObject !== "") {
                                        objCtrl.tipsUpdateObject();
                                    }
                                    $ocLazyLoad.load(propertyCtrl).then(function () {
                                        $scope.$parent.$parent.objectEditURL = propertyTepl;

                                    });
                                });
                            }

                        }else if(stage===3) {
                            if(data.t_lifecycle===3) {
                                Application.functions.getRdObjectById(data.id, type, function (data) {
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