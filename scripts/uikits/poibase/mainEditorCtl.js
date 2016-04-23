var app = angular.module('app', ['oc.lazyLoad', 'ui.bootstrap']);
app.controller('mainEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', function($scope, $ocll, $rs, $q) {
    $ocll.load('../../scripts/components/poi/ctrls/attr-base/generalBaseCtl.js').then(function() {
        $scope.baseInfoTpl = '../../scripts/components/poi/tpls/attr-base/generalBaseTpl.html';
    });
    $scope.meta = {};
    var ds = new App.dataService($q);
    var promises = [];
    promises.push(ds.meta.getKindList().then(function(data) {
        $scope.meta.kindList = data;
    }));
    promises.push(ds.getPoiDetailByFid().then(function(data) {
        $scope.poi = data;
    }));
    $q.all(promises).then(function() {
        if ($scope.poi.kindCode) {
            $ocll.load('../../scripts/components/poi/ctrls/attr-deep/generalParkingsCtl.js').then(function() {
                $scope.deepInfoTpl = '../../scripts/components/poi/tpls/attr-deep/generalParkingsTpl.html';
            });
        }
        $scope.$broadcast("loadup", $scope.poi);
    });
}]);