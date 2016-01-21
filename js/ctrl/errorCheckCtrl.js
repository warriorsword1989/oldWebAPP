/**
 * Created by liwanchong on 2015/10/10.
 */
var errorCheckModule = angular.module('lazymodule', ['smart-table']);
errorCheckModule.controller('errorCheckController', function ($scope,$timeout) {
    var checkOutCtrl = fastmap.uikit.CheckResultController();
    $scope.itemsByPage = 4;

    $scope.rowCollection = [];
    if(checkOutCtrl.errorCheckData) {
        $scope.rowCollection= checkOutCtrl.errorCheckData.data.check;
    }
   checkOutCtrl.updateCheck=function(){
       $scope.rowCollection=checkOutCtrl.errorCheckData.data.check;
   }

});