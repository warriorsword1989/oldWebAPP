/**
 * Created by mali on 2016-08-10
 */
angular.module('app').controller('specialOperAdvanceToolsCtl', ['$scope', '$ocLazyLoad', 'appPath',
    function ($scope, $ocLazyLoad, appPath) {
        $scope.roadNameBtnOpened = false;
        $scope.rdLaneBtnOpened = false;
        $scope.workPanelOpenClose = function () {
            $scope.roadNameBtnOpened = true;
            $scope.$emit('WORKPANELOPENCLOSE');
        };
        $scope.OpenRdlane = function () {
            $scope.rdLaneBtnOpened = true;
            $scope.$emit('OPENRDLANETOPO');
        };
    }
]);
