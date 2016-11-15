/**
 * Created by liuzhaoxia on 2015/12/11.
 */
var braPassline = angular.module('app');
braPassline.controller('BraPasslineCtrl', function ($scope, $timeout, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.vias = objCtrl.data.vias ? objCtrl.data.vias : 0;
});
