/**
 * Created by liwanchong on 2015/10/10.
 */
var errorCheckModule = angular.module('lazymodule', ['smart-table']);
errorCheckModule.controller('errorCheckController', function ($scope,$timeout) {
    var checkOutCtrl = fastmap.uikit.CheckResultController();
    $scope.itemsByPage = 1;
    $scope.initType=0;
    $scope.initTypeOptions = [
        {"id": 0, "label": " 未修改"},
        {"id": 1, "label": " 例外"},
        {"id": 2, "label": " 确认不修改"},
        {"id": 3, "label": " 确认已修改"}
    ];

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