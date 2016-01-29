/**
 * Created by liwanchong on 2015/10/10.
 */
var errorCheckModule = angular.module('lazymodule', ['smart-table']);
errorCheckModule.controller('errorCheckController', function ($scope,$timeout) {
    var checkOutCtrl = fastmap.uikit.CheckResultController();
    $scope.itemsByPage = 1;

    //$scope.rowCollection = [];
    //checkOutCtrl.updateOutPuts=function(){
    //    var params = {
    //        "projectId":11,
    //        "pageNum":$scope.itemsByPage,
    //        "pageSize":5,
    //        "meshes":[595672,595673]
    //    };
    //    Application.functions.getCheck(JSON.stringify(params),function(data){
    //        if(data.errcode == 0) {
    //            $scope.rowCollection = data.data;
    //            $scope.goPaging();
    //            $scope.$apply();
    //        }
    //    });
    //}
    //
    //if( $scope.itemsByPage==1){
    //    var params = {
    //        "projectId":11,
    //        "pageNum":$scope.itemsByPage,
    //        "pageSize":5,
    //        "meshes":[595672,595673]
    //    };
    //    Application.functions.getCheck(JSON.stringify(params),function(data){
    //        if(data.errcode == 0) {
    //            $scope.rowCollection = data.data;
    //            $scope.goPaging();
    //            $scope.$apply();
    //        }
    //    });
    //    var params = {
    //        "projectId":11,
    //        "meshes":[595672,595673]
    //    };
    //    Application.functions.getCheckCount(JSON.stringify(params),function(data){
    //        if(data.errcode == 0) {
    //            $scope.checkTotal = Math.ceil(data.data/10);
    //
    //        }
    //    });
    //}
    //
    ///*箭头图代码点击下一页*/
    //$scope.picNext = function(){
    //    $scope.itemsByPage += 1;
    //    //$scope.getPicsDate();
    //    checkOutCtrl.updateOutPuts();
    //}
    ///*箭头图代码点击上一页*/
    //$scope.picPre = function(){
    //    $scope.itemsByPage -= 1;
    //   // $scope.getPicsDate();
    //    checkOutCtrl.updateOutPuts();
    //}
    //
    ///*点击翻页*/
    //$scope.goPaging = function(){
    //    if($scope.picNowNum == 0){
    //        if($scope.picTotal == 0 || $scope.picTotal == 1){
    //            $(".pic-next").prop('disabled','disabled');
    //        }else{
    //            $(".pic-next").prop('disabled',false);
    //        }
    //        $(".pic-pre").prop('disabled','disabled');
    //    }else{
    //        if($scope.picTotal - $scope.picNowNum == 0){
    //            $(".pic-next").prop('disabled','disabled');
    //        }
    //        $(".pic-pre").prop('disabled',false);
    //    }
    //    $scope.$apply();
    //}

});