angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('mainEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi','meta', function($scope, $ocll, $rs, $q, poi,meta) {
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
        console.log("main");
        poi.test();
    };
    $q.all(promises).then(function() {
        $ocll.load('../../scripts/components/poi/ctrls/attr-base/generalBaseCtl.js').then(function() {
            $scope.baseInfoTpl = '../../scripts/components/poi/tpls/attr-base/generalBaseTpl.html';
            $scope.$on('$includeContentLoaded', function($event) {
                $scope.$broadcast("loadup", $scope.poi);
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
    }
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
        console.log($scope.poi.fid);
        // $scope.poi.charging = {
        //     openType: "4|2|3",
        //     payment: "1",
        //     locationtype:"1"
        // };
        if (data.extend > 0) {
            $ocll.load("components/poi/ctrls/attr-deep/chargingPoleCtl").then(function() {
                $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/chargingPoleTpl.html";
                // $scope.$on("$includeContentLoaded", function() {
                //     $scope.$broadcast("loadup", $scope.poi);
                // });
            });
        } else {
            $scope.deepInfoTpl = '';
        }
    });
    $scope.$on("saveMe", realSave);
}]);