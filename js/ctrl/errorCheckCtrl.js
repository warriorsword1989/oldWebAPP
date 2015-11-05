/**
 * Created by liwanchong on 2015/10/10.
 */
var errorCheckModule = angular.module('lazymodule', ['smart-table']);
errorCheckModule.controller('errorCheckController', function ($scope) {
    var checckOutCtrl = new fastmap.uikit.CheckResultController();
    $scope.itemsByPage = 4;

    $scope.rowCollection = [];
});