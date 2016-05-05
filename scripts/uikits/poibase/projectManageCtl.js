angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'dataService']).controller('projectManageCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi','meta', function($scope, $ocll, $rs, $q, poi,meta) {
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

}]);