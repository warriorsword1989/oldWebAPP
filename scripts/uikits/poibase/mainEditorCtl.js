angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('mainEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', 'meta', 'uibButtonConfig','NgTableParams', function($scope, $ocll, $rs, $q, poi, meta, uibBtnCfg) {
    uibBtnCfg.activeClass = "btn-success";
    $scope.meta = {};
    var promises = [];
    promises.push(meta.getKindList().then(function(data) {
        $scope.meta.kindList = data;
    }));
    promises.push(poi.getPoiDetailByFid("0010060815LML01353").then(function(data) {
        $scope.poi = data;
        $scope.snapshotPoi = data.getSnapShot();
    }));
    promises.push(poi.getPoiList().then(function(data) {
        $scope.poiList = data;
    }));
    $scope.test = function() {
        console.log("main test");
        poi.test();
    };
    $q.all(promises).then(function() {
        $ocll.load('../../scripts/components/poi/ctrls/attr-base/generalBaseCtl.js').then(function() {
            $scope.baseInfoTpl = '../../scripts/components/poi/tpls/attr-base/generalBaseTpl.html';
            $scope.$on('$includeContentLoaded', function($event) {
                $scope.$broadcast("loadup", $scope.poi);
            });
            $ocll.load('../scripts/components/poi/ctrls/edit-tools/OptionBarCtl').then(function() {
                $scope.optionBarTpl = '../../scripts/components/poi/tpls/edit-tools/optionBarTpl.html';
                $scope.$on('$includeContentLoaded', function($event) {
                    $scope.$broadcast("loadup", $scope.poi);
                });
            });
            $ocll.load('../scripts/components/poi/ctrls/attr-map/poiMapCtl').then(function() {
                $scope.mapTpl = '../../scripts/components/poi/tpls/attr-map/poiMapTpl.html';
                $scope.$on('$includeContentLoaded', function($event) {
                    $scope.$broadcast("loadup_poiMap", $scope.snapshotPoi);
                });
            });
        });
    });
    $scope.nextPoi = function() {
        ds.getPoiDetailByFid("0010060815LML01353").then(function(data) {
            $scope.poi = data;
            $scope.$broadcast("loadup", $scope.poi);
        });
    };
    $scope.doSave = function() {
        $scope.$broadcast("save", $scope.meta.kindList);
    };

    function realSave(evt, data) {
        console.log(data);
        $scope.test();
    };

    $scope.$on('showParentPoiInMap',function (obj){
        alert("显示父");
    })
    $scope.$on('showChildrenPoisInMap',function (obj){
        alert("显示子");
    })
    $scope.loadAdditionInfo = function() {
        $scope.additionInfoTpl = $scope.radioModel;
    };
    // $scope.$on("kindChange", function(event, data) {
    //     console.log($scope.poi.fid);
    //     $scope.poi.parkings = {
    //         tollStd: "1|2|3",
    //         buildingType: 4,
    //     };
    //     if (data.extend > 0) {
    //         $ocll.load("components/poi/ctrls/attr-deep/generalParkingsCtl").then(function() {
    //             $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/generalParkingsTpl.html";
    //             // $scope.$on("$includeContentLoaded", function() {
    //             //     $scope.$broadcast("loadup", $scope.poi);
    //             // });
    //         });
    //     } else {
    //         $scope.deepInfoTpl = '';
    //     }
    // });
    $scope.$on("kindChange", function(event, data) {
        switch (data.extend) {
            case 1: //停车场
                $ocll.load("components/poi/ctrls/attr-deep/parkingCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/parkingTpl.html";
                });
                break;
            case 2: //加油站
                $ocll.load("components/poi/ctrls/attr-deep/oilStationCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/oilStationTpl.html";
                });
                break;
            case 3: //充电站
                $ocll.load("components/poi/ctrls/attr-deep/chargingStationCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingStationTpl.html";
                });
                break;
            case 4: //宾馆酒店
                $ocll.load("components/poi/ctrls/attr-deep/hotelCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/hotelTpl.html";
                });
                break;
            case 5: //运动场馆
                $ocll.load("components/poi/ctrls/attr-deep/sportsVenuesCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/sportsVenuesTpl.html";
                });
                break;
            case 6: //餐馆
                $ocll.load("components/poi/ctrls/attr-deep/foodTypeCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/foodTypeTpl.html";
                });
                break;
            case 7: //加气站
                $ocll.load("components/poi/ctrls/attr-deep/gasStationCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingPoleTpl.html";
                });
                break;
            case 8: //旅游景点
                $ocll.load("components/poi/ctrls/attr-deep/chargingPoleCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingPoleTpl.html";
                });
                break;
            case 9:
                $ocll.load("components/poi/ctrls/attr-deep/chargingPoleCtl").then(function() {
                    // $ocll.load("components/poi/drtvs/directives/select2_drtv").then(function() {
                        $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingPoleTpl.html";
                        $scope.$on('$includeContentLoaded', function($event) {
                            $scope.$broadcast("loaded", data);
                        });
                    // });
                });
                break;
            default:
                $scope.deepInfoTpl = "";
                break;
        }
    });
    $scope.$on("saveMe", realSave);
}]).directive("myResize", ["$timeout", function($timeout) {
    function _resize(elem) {
        var vh = 0;
        if (window.innerHeight) {
            vh = window.innerHeight;
        } else if (document.documentElement.clientHeight) {
            vh = document.documentElement.clientHeight;
        } else {
            vh = document.getElementsByTagName("body")[0].clientHeight;
        }
        var h = vh - elem.offsetTop - 56;
        console.log("window height:" + vh);
        console.log("elem.offsetTop:" + elem.offsetTop);
        console.log("elem.scrollHeight:" + elem.scrollHeight);
        if (h > 0) {
            if (h < elem.scrollHeight) {
                elem.style.height = h + "px";
            } else if (h >= elem.scrollHeight) {
                elem.style.height = elem.scrollHeight + "px";
            }
        }
    }
    return {
        restrict: 'A',
        scope: true,
        controller: function($scope, $element) {
            $scope.$on("$includeContentLoaded", function() {
                // 稍微延迟一下下，为htm片段加载生成高度信息提供时间
                $timeout(function() {
                    $element.triggerHandler("resize");
                }, 1);
            });
        },
        link: function(scope, element) {
            element.on("resize", function() {
                _resize(element[0]);
            });
        }
    };
}]);