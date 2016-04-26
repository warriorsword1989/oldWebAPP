var app = angular.module('app', ['oc.lazyLoad', 'ui.bootstrap']);
app.controller('mainEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', '$timeout', function($scope, $ocll, $rs, $q, $timeout) {
    $scope.meta = {};
    var ds = new App.dataService($q);
    var promises = [];
    promises.push(ds.meta.getKindList().then(function(data) {
        $scope.meta.kindList = data;
    }));
    promises.push(ds.getPoiDetailByFid("0010060815LML01353").then(function(data) {
        $scope.poi = data;
    }));
    $scope.test = function() {
        console.log("main");
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
    }
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