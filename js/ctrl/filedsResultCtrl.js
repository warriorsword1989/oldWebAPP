/**
 * Created by liwanchong on 2015/9/25.
 */
var filedsModule = angular.module('mapApp', ['oc.lazyLoad']);
filedsModule.controller('fieldsResultController', ['$rootScope', '$scope', '$ocLazyLoad',
        function ($rootScope, $scope, $ocLazyLoad) {
           // Application.functions.getTipsStatics([60560301, 60560302, 60560303, 60560304], [1, 3], function (data) {
            Application.functions.getTipsStatics([59567201], [1, 3], function (data) {
                $scope.$apply(function () {
                    var arr = [], transArr = [];
                   // data.data.rows.push({"1101":10});
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
                Application.functions.getTipsStatics([59567201], stage, function (data) {
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
                    //Application.functions.getTipsListItems([60560301, 60560302, 60560303, 60560304], arr, item.id, function (data) {
                    Application.functions.getTipsListItems([59567201], arr, item.id, function (data) {
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
            $scope.showTab = function (item,pItemId) {
                if ($scope.$parent.$parent.dataTipsURL) {
                    $scope.$parent.$parent.dataTipsURL = "";
                }
                if ($scope.$parent.$parent.objectEditURL) {
                    $scope.$parent.$parent.objectEditURL = "";
                }
                $("#popoverTips").css("display", "block");
                map.panTo({lat: item["g"][1], lon: item["g"][0]});
                Application.functions.getTipsResult(item.i, function (data) {
                    selectCtrl.fire("selectByAttribute", {feather: data});
                    if (data.rowkey === "undefined") {
                        return;
                    }
                    $scope.$parent.$parent.rowkeyOfDataTips = data.rowkey;
                    //if ($scope.$parent.$parent.updateDataTips !== "") {
                    //    $scope.$parent.$parent.updateDataTips(data);
                    //}
                    selectCtrl.fire("selectByAttribute", {feather: data});
                    if(pItemId==="1101") {//限速
                        //$scope.$parent.$parent.speedLimitDatas = $scope.speedLimitDate[ind];
                        //$scope.$parent.$parent.speedLimitGeometryDatas = $scope.speedLimitDate[ind];

                        Application.functions.getRdObjectById(data.id, "RDSPEEDLIMIT", function (data) {
                            objCtrl.setCurrentObject(data.data);
                            $ocLazyLoad.load('ctrl/speedLimitCtrl').then(function () {
                                $scope.$parent.$parent.objectEditURL = "js/tepl/speedLimitTepl.html";
                                $ocLazyLoad.load('ctrl/sceneSpeedLimitCtrl').then(function () {
                                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneSpeedLimitTepl.html";
                                });
                            });
                        });
                    }else if(pItemId==="1201"){//道路种别
                       // Application.functions.getRdObjectById(data.id, "", function (data) {
                            //$ocLazyLoad.load('ctrl/speedLimitCtrl').then(function () {
                            //$scope.$parent.$parent.objectEditURL = "";
                            // $ocLazyLoad.load('ctrl/sceneSpeedLimitCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneKindTepl.html";
                            // });
                            //});
                        //});
                    }else if(pItemId==="1203"){//道路方向

                        //Application.functions.getRdObjectById(data.id, "", function (data) {
                           // objCtrl.setCurrentObject(data);
                            $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                                $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                                // $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
                                $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneRdDirectTips.html";
                                //});
                            });
                        //});
                    }else if(pItemId==="1301"){//车信
                        Application.functions.getRdObjectById(data.id, "RDLANECONNEXITY", function (data) {
                            objCtrl.setCurrentObject(data.data);
                            $ocLazyLoad.load("ctrl/rdLaneConnexityCtrl").then(function () {
                                $scope.$parent.$parent.objectEditURL = "js/tepl/rdLaneConnexityTepl.html";
                                $ocLazyLoad.load('ctrl/sceneRdLaneTipsCtrl').then(function () {
                                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneRdLaneTepl.html";
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
                                    $ocLazyLoad.load("ctrl/objectEditCtrl").then(function () {
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
                                    $ocLazyLoad.load("ctrl/objectEditCtrl").then(function () {
                                        $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                                        $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";
                                        });
                                    });
                                })
                            }
                        }

                    }else if(pItemId==="1407"){//高速分歧
                        Application.functions.getRdObjectById(data.id, "RDBRANCH", function (data) {
                            objCtrl.setCurrentObject(data.data);
                            $ocLazyLoad.load("ctrl/rdBanchCtrl").then(function () {
                                $scope.$parent.$parent.objectEditURL = "js/tepl/rdBranchTep.html";
                                $ocLazyLoad.load('ctrl/sceneHightSpeedDiverTeplCtrl').then(function () {
                                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneHightSpeedDiverTepl.html";
                                });
                            });
                        });
                    }else if(pItemId==="1510"){//桥1510
                        Application.functions.getRdObjectById(data.id, "RDLINK", function (data) {
                            if (data.errcode === -1) {
                                return;
                            }
                            objCtrl.setCurrentObject(data.data);
                            $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                                $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                                $ocLazyLoad.load('ctrl/sceneBridgeTipsCtrl').then(function () {
                                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneBridgeTepl.html";
                                });
                            });
                        });
                    }else if(pItemId==="1604"){//区域内道路
                        $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneRegionalRoadTepl.html";
                    }else if(pItemId==="1704"){//交叉路口
                        Application.functions.getRdObjectById(data.id, "RDCROSS", function (data) {
                            objCtrl.setCurrentObject(data.data);
                            $ocLazyLoad.load('ctrl/rdCrossCtrl').then(function () {
                                $scope.$parent.$parent.objectEditURL = "js/tepl/rdCrossTepl.html";
                                $ocLazyLoad.load('ctrl/sceneRoadTipsCtrl').then(function () {
                                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneRoadTipsTepl.html";
                                });
                            });
                        });
                    }else if(pItemId==="1801"){//挂接
                        $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneHangingTepl.html";
                    }else if(pItemId==="1901"){//道路名
                        $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneIntersectionTepl.html";
                    }else if(pItemId==="2001"){//测线
                        $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneMeasuringLine.html";
                    }
                })
            };

            //checkbox中的处理方法
            $scope.showLayers = function (item) {
                item.choose = !item.choose;
                console.log($scope.items);
            };
        }

    ]
)
