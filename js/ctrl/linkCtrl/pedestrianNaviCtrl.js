/**
 * Created by liwanchong on 2015/10/29.
 */
var pedestrianNaviApp = angular.module("lazymodule", ['oc.lazyLoad']);
pedestrianNaviApp.controller("pedestrianNaviController",function($scope,$ocLazyLoad) {
    $scope.naviData =  $scope.linkData;
    $scope.sidewalkLocoptions=[
        {"id": 0, "label":"无"},
        {"id": 1, "label":"右侧"},
        {"id": 2, "label":"中间"},
        {"id": 3, "label":"右侧+中间"},
        {"id": 4, "label":"左侧"},
        {"id": 5, "label":"右侧+左侧"},
        {"id": 6, "label":"左侧+中间"},
        {"id": 7, "label":"右侧+左侧+中间"},
        {"id": 8, "label":"混合"}
    ];

    $scope.dividerTypeoptions=[
        {"id": 0, "label":"未调查"},
        {"id": 1, "label":"高度差隔离(马路涯)"},
        {"id": 2, "label":"物理栅栏隔离"},
        {"id": 3, "label":"划线隔离"},
        {"id": 4, "label":"无隔离"}
    ];
   $scope.showSidewalk=function() {
       if(! $scope.$parent.$parent.$parent.$parent.suspendFlag) {
           $scope.$parent.$parent.$parent.$parent.suspendFlag = true;
       }
       $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
       $ocLazyLoad.load('ctrl/linkCtrl/infoOfSidewalkCtrl').then(function () {
           $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/infoOfsidewalkTepl.html";
       })
  };
   $scope.showWalkstair=function() {
       if(! $scope.$parent.$parent.$parent.$parent.suspendFlag) {
           $scope.$parent.$parent.$parent.$parent.suspendFlag = true;
       }
       $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
       $ocLazyLoad.load('ctrl/linkCtrl/infoOfWalkstairCtrl').then(function () {
           $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/infoOfWalkstairTepl.html";
       })
   };
})