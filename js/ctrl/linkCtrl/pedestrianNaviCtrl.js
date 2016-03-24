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
   $scope.showSidewalk=function(sidewalkItem) {
       if(! $scope.$parent.$parent.$parent.$parent.suspendFlag) {
           $scope.$parent.$parent.$parent.$parent.suspendFlag = true;
       }
       $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
       $scope.naviData["sidewalkRowId"]=sidewalkItem.rowId;
       $ocLazyLoad.load('ctrl/linkCtrl/infoOfSidewalkCtrl').then(function () {
           $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/infoOfsidewalkTepl.html";
       })
  };
   $scope.showWalkstair=function(walkstairItem) {
       if(! $scope.$parent.$parent.$parent.$parent.suspendFlag) {
           $scope.$parent.$parent.$parent.$parent.suspendFlag = true;
       }
       $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
       $scope.naviData["walkstairRowId"]=walkstairItem.rowId;
       $ocLazyLoad.load('ctrl/linkCtrl/infoOfWalkstairCtrl').then(function () {
           $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/infoOfWalkstairTepl.html";
       })
   };

    $scope.minusSidewalk=function(id) {
        $scope.naviData.sidewalks.splice(id, 1);
    };
    $scope.addSidewalk = function () {
        var newSidewalk = fastmap.dataApi.linksidewalk({"linkPid":$scope.naviData.pid});
        $scope.naviData.sidewalks.unshift(newSidewalk);
    };
    $scope.addWalkstair = function () {
        var newWalkstair = fastmap.dataApi.linkwalkstair({"linkPid":$scope.naviData.pid});
        $scope.naviData.walkstairs.unshift(newWalkstair);
    };
    $scope.minusWalkstair=function(id) {
        $scope.naviData.walkstairs.splice(id, 1);
    };

    $scope.changeColor=function(ind,ord){
        if(ord==1){
            $("#SidewalkSpan"+ind).css("color","#FFF");
        }else{
            $("#WalkstairSpan"+ind).css("color","#FFF");
        }

    }
    $scope.backColor=function(ind,ord){
        if(ord==1){
            $("#SidewalkSpan"+ind).css("color","darkgray");
        }else{
            $("#WalkstairSpan"+ind).css("color","darkgray");
        }
    }
})