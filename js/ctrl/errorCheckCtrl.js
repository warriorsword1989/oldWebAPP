/**
 * Created by liwanchong on 2015/10/10.
 */
var errorCheckModule = angular.module('lazymodule', ['smart-table']);
errorCheckModule.controller('errorCheckController', function ($scope,$timeout) {
    var checckOutCtrl = new fastmap.uikit.CheckResultController();
    $scope.itemsByPage = 4;

    $scope.rowCollection = [];
    updateme();
    function updateme(){
        $timeout(function(){
            if(checckOutCtrl.errorCheckData) {
                $scope.rowCollection= checckOutCtrl.errorCheckData.data.check;
            }

            updateme();
        },500);
    }

});