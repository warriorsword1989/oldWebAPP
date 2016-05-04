angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('mainEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi', 'uibButtonConfig', function($scope, $ocll, $rs, $q, poi, uibBtnCfg) {
    uibBtnCfg.activeClass = "btn-success";
    $scope.meta = {};
    var ds = new App.dataService($q);
    var promises = [];
    promises.push(ds.meta.getKindList().then(function(data) {
        $scope.meta.kindList = data;
    }));
    promises.push(ds.getPoiDetailByFid("0010060815LML01353").then(function(data) {
        $scope.poi = data;
        var tmp = data.getIntegrate();
        console.log(tmp);
    }));
    promises.push(poi.getPoiDetailByFid("0010060815LML01353").then(function(data) {
        $scope.poi2 = data;
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
            $ocll.load('../scripts/components/poi/ctrls/edit-tools/optionBarCtl').then(function() {
                $scope.optionBarTpl = '../../scripts/components/poi/tpls/edit-tools/optionBarTpl.html';
            });
            $scope.$on('$includeContentLoaded', function($event) {
                $scope.$broadcast("loadup", $scope.poi);
            });
        });
    });
    $scope.nextPoi = function() {
        ds.getPoiDetailByFid("0010060815LML01224").then(function(data) {
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
    $scope.loadAdditionInfo = function() {
        $scope.additionInfoTpl = $scope.radioModel;
    };
    $scope.$on("kindChange", function(event, data) {
        console.log($scope.poi.fid);
        $scope.poi.parkings = {
            tollStd: "1|2|3",
            buildingType: 4,
        };
        if (data.extend > 0) {
            $ocll.load("components/poi/ctrls/attr-deep/generalParkingsCtl").then(function() {
                $scope.deepInfoTpl = "../../scripts/components/poi/tpls/attr-deep/generalParkingsTpl.html";
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