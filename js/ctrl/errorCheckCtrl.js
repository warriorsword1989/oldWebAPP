/**
 * Created by liwanchong on 2015/10/10.
 */
var errorCheckModule = angular.module('lazymodule', ['smart-table']);
errorCheckModule.controller('errorCheckController', function ($scope,$timeout) {
    var checkOutCtrl = fastmap.uikit.CheckResultController();
    $scope.itemsByPage = 1;
    $scope.initType=0;

    $scope.changeType=function(selectInd,rowid){
        var params = {
            "projectId":11,
            "id":rowid,
            "type":selectInd
        };
        Application.functions.updateCheckType(JSON.stringify(params),function(data){
            if(data.errcode == 0) {
                $scope.$apply();
                $scope.getCheckDateAndCount();
            }
        });
    }

});