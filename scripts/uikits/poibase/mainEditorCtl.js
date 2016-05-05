angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('mainEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', 'meta', 'uibButtonConfig', function($scope, $ocll, $rs, $q, poi, meta, uibBtnCfg) {
    uibBtnCfg.activeClass = "btn-success";
    $scope.meta = {};
    var promises = [];
    promises.push(meta.getKindList().then(function(data) {
        $scope.meta.kindList = data;
    }));
    promises.push(poi.getPoiDetailByFid("00005920160427213444").then(function(data) {
        $scope.poi = data;
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
            $ocll.load('../scripts/components/poi/ctrls/edit-tools/optionBarCtl').then(function() {
                $scope.optionBarTpl = '../../scripts/components/poi/tpls/edit-tools/optionBarTpl.html';
                $scope.$on('$includeContentLoaded', function($event) {
                    $scope.$broadcast("loadup", $scope.poi);
                });
            });
        });
    });
    $scope.nextPoi = function() {
        ds.getPoiDetailByFid("00005920160427213444").then(function(data) {
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
            case 1://停车场
                $ocll.load("components/poi/ctrls/attr-deep/parkingCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/parkingTpl.html";
                });
                break;
            case 2://加油站
                $ocll.load("components/poi/ctrls/attr-deep/oilStationCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/oilStationTpl.html";
                });
                break;
            case 3://充电站
                $ocll.load("components/poi/ctrls/attr-deep/chargingStationCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingStationTpl.html";
                });
                break;
            case 4://宾馆酒店
                $ocll.load("components/poi/ctrls/attr-deep/hotelCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/hotelTpl.html";
                });
                break;
            case 5://运动场馆
                $ocll.load("components/poi/ctrls/attr-deep/sportsVenuesCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/sportsVenuesTpl.html";
                });
                break;
            case 6://餐馆
                $ocll.load("components/poi/ctrls/attr-deep/foodTypeCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/foodTypeTpl.html";
                });
                break;
            case 7://加气站
                $ocll.load("components/poi/ctrls/attr-deep/gasStationCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingPoleTpl.html";
                });
                break;
            case 8://旅游景点
                $ocll.load("components/poi/ctrls/attr-deep/chargingPoleCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingPoleTpl.html";
                });
                break;
            case 9:
                $ocll.load("components/poi/ctrls/attr-deep/chargingPoleCtl").then(function() {
                    $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingPoleTpl.html";
                });
                break;
            default:
                $scope.deepInfoTpl = "";
                break;
        }
    });
    $scope.$on("saveMe", realSave);
}]).constant();