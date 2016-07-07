
/**
 * Created by chenx on 2016-07-05
 */
angular.module("app").controller("mapToolbarCtrl", ["$scope", '$ocLazyLoad', 'appPath',
    function($scope, $ocLazyLoad, appPath) {
        $scope.selectBtnOpened = false;
        $scope.addBtnOpened = false;
        $scope.advanceBtnOpened = false;
        $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/selectShapeCtrl.js').then(function() {
            $scope.selectShapeTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/selectShapeTpl.htm';
        });
        // $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/advanceToolsCtrl.js').then(function() {
        //     $scope.advanceToolsTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/advanceToolsTpl.htm';
        // });
        $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addShapeCtrl.js').then(function() {
            $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addRwShapeCtrl.js').then(function() {
                $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addAdShapeCtrl.js').then(function() {
                    $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addZoneShapeCtrl.js').then(function() {
                        $ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/addFeatureShape/addPoiCtrl.js').then(function() {});
                        $scope.addShapeTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/addShapeTpl.htm';
                        $scope.advanceToolsTpl = appPath.root + 'scripts/components/tools/tpls/toolbar-map/advanceToolsTpl.htm';
                    });
                });
            });
        });
        $scope.toggleSelectBtn = function() {
            $scope.selectBtnOpened = !$scope.selectBtnOpened;
            $scope.addBtnOpened = false;
            $scope.advanceBtnOpened = false;
        };
        $scope.toggleAddBtn = function() {
            $scope.selectBtnOpened = false;
            $scope.addBtnOpened = !$scope.addBtnOpened;
            $scope.advanceBtnOpened = false;
        }
        $scope.toggleAdvanceBtn = function() {
            $scope.selectBtnOpened = false;
            $scope.addBtnOpened = false;
            $scope.advanceBtnOpened = !$scope.advanceBtnOpened;
        }
    }
]);