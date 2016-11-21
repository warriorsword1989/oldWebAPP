/**
 * Created by wangmingdong on 2016/11/17.
 */

angular.module('app').controller('TmcOfTreeCtl', ['$scope', 'dsEdit', 'dsMeta', '$timeout', function ($scope, dsEdit, dsMeta, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.tollGateNames = objCtrl.namesInfos;
    $scope.selectedLangcodeArr = [];
    
}]);
