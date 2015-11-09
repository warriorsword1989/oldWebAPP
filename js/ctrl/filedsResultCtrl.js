/**
 * Created by liwanchong on 2015/9/25.
 */
var filedsModule = angular.module('mapApp', ['oc.lazyLoad']);
filedsModule.controller('fieldsResultController', ['$rootScope', '$scope', '$ocLazyLoad',
        function ($rootScope, $scope, $ocLazyLoad) {
            Application.functions.getTipsStatics([59567201], [1, 3], function (data) {
                $scope.$apply(function () {
                    var arr = [], transArr = [];
                    transArr = data.data.rows;
                    for (var i = 0, len = transArr.length; i < len; i++) {
                        var obj = {}, objArr = {};
                        obj = transArr[i];
                        for (var item in obj) {
                            switch (item) {
                                case "1":
                                    objArr.name = "道路种别";
                                    objArr.id = "1";
                                    objArr.total = obj[item];
                                    break;
                                case "2":
                                    objArr.name = "道路方向";
                                    objArr.id = "2";
                                    objArr.total = obj[item];
                                    break;
                                case "3":
                                    objArr.name = "施工中";
                                    objArr.id = "3";
                                    objArr.total = obj[item];
                                    break;
                                case "4":
                                    objArr.name = "FC";
                                    objArr.id = "4";
                                    objArr.total = obj[item];
                                    break;
                                case "5":
                                    objArr.name = "道路名";
                                    objArr.id = "5";
                                    objArr.total = obj[item];
                                    break;
                                case "6":
                                    objArr.name = "点限速";
                                    objArr.id = "6";
                                    objArr.total = obj[item];
                                    break;
                                case "7":
                                    objArr.name = "交限";
                                    objArr.id = "7";
                                    objArr.total = obj[item];
                                    break;
                                case "8":
                                    objArr.name = "电子眼";
                                    objArr.id = "8";
                                    objArr.total = obj[item];
                                    break;
                                case "9":
                                    objArr.name = "高速分歧";
                                    objArr.id = "9";
                                    objArr.total = obj[item];
                                    break;
                                case "10":
                                    objArr.name = "禁止穿行";
                                    objArr.id = "10";
                                    objArr.total = obj[item];
                                    break;
                                case "11":
                                    objArr.name = "环岛";
                                    objArr.id = "9";
                                    objArr.total = obj[item];
                                    break;
                                case "11":
                                    objArr.name = "多媒体";
                                    objArr.id = "11";
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
                Application.functions.getTipsStatics([59567201], stage, function (data) {
                    $scope.$apply(function () {
                        var arr = [], transArr = [];
                        transArr = data.data.rows;
                        for (var i = 0, len = transArr.length; i < len; i++) {
                            var obj = {}, objArr = {};
                            obj = transArr[i];
                            for (var item in obj) {
                                switch (item) {
                                    case "1":
                                        objArr.name = "道路种别";
                                        objArr.id = "1";
                                        objArr.total = obj[item];
                                        break;
                                    case "2":
                                        objArr.name = "道路方向";
                                        objArr.id = "2";
                                        objArr.total = obj[item];
                                        break;
                                    case "3":
                                        objArr.name = "施工中";
                                        objArr.id = "3";
                                        objArr.total = obj[item];
                                        break;
                                    case "4":
                                        objArr.name = "FC";
                                        objArr.id = "4";
                                        objArr.total = obj[item];
                                        break;
                                    case "5":
                                        objArr.name = "道路名";
                                        objArr.id = "5";
                                        objArr.total = obj[item];
                                        break;
                                    case "6":
                                        objArr.name = "点限速";
                                        objArr.id = "6";
                                        objArr.total = obj[item];
                                        break;
                                    case "7":
                                        objArr.name = "交限";
                                        objArr.id = "7";
                                        objArr.total = obj[item];
                                        break;
                                    case "8":
                                        objArr.name = "电子眼";
                                        objArr.id = "8";
                                        objArr.total = obj[item];
                                        break;
                                    case "9":
                                        objArr.name = "高速分歧";
                                        objArr.id = "9";
                                        objArr.total = obj[item];
                                        break;
                                    case "10":
                                        objArr.name = "禁止穿行";
                                        objArr.id = "10";
                                        objArr.total = obj[item];
                                        break;
                                    case "11":
                                        objArr.name = "环岛";
                                        objArr.id = "9";
                                        objArr.total = obj[item];
                                        break;
                                    case "11":
                                        objArr.name = "多媒体";
                                        objArr.id = "11";
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
            $scope.showContent = function (item, arr,stage) {
                Application.functions.getTipsListItems([59567201], arr, item.id, function (data) {
                    if(stage==="0"){
                        $scope.$apply(function () {
                            $scope.allSubItems = data.data;
                        });
                    }else if(stage==="1") {
                        $scope.$apply(function () {
                            $scope.pendSubItems = data.data;
                        });
                    }else if(stage==="3") {
                        $scope.solvedSubItems = data.data;
                    }



                })
            };
            //点击列表需要的方法
            var n = 0;
            $scope.showTab = function (item) {
                if ($scope.$parent.$parent.dataTipsURL) {
                    $scope.$parent.$parent.dataTipsURL = "";
                }
                if ($scope.$parent.$parent.objectEditURL) {
                    $scope.$parent.$parent.objectEditURL = "";
                }


                $("#popoverTips").css("display", "block");
                setTimeout(function () {
                    $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";

                            $ocLazyLoad.load("ctrl/objectEditCtrl").then(function () {
                                $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                            });
                        }
                    );
                }, 100)
                Application.functions.getTipsResult(item.i, function (data) {
                    selectCtrl.fire("selectByAttribute", {feather: data});
                    var id = data.resID[0].id
                    Application.functions.getRdObjectById(id, "RDRESTRICTION", function (data) {
                        objCtrl.setCurrentObject(data.data);
                        $scope.$parent.$parent.rdRestrictData = data.data;
                    })


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
