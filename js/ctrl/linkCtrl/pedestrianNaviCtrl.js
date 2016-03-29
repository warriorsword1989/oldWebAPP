/**
 * Created by liwanchong on 2015/10/29.
 */
var pedestrianNaviApp = angular.module("lazymodule", ['oc.lazyLoad']);
pedestrianNaviApp.controller("pedestrianNaviController",function($scope,$ocLazyLoad) {
    $scope.naviData =  $scope.linkData;
    $scope.walkFlag = 0;
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
       $scope.linkData["oridiRowId"] = sidewalkItem.rowId;
       var showSidewalkObj = {
           "loadType":"subAttrTplContainer",
           "propertyCtrl": 'ctrl/linkCtrl/infoOfSidewalkCtrl',
           "propertyHtml": 'js/tepl/linkObjTepl/infoOfsidewalkTepl.html'
       }
       $scope.$emit("transitCtrlAndTpl", showSidewalkObj);
  };
   $scope.showWalkstair=function(walkstairItem) {
       $scope.linkData["oridiRowId"] = walkstairItem.rowId;
       var showSidewalkObj = {
           "loadType":"subAttrTplContainer",
           "propertyCtrl": 'ctrl/linkCtrl/infoOfWalkstairCtrl',
           "propertyHtml": 'js/tepl/linkObjTepl/infoOfWalkstairTepl.html'
       }
       $scope.$emit("transitCtrlAndTpl", showSidewalkObj);
   };

    $scope.minusSidewalk=function(id) {
        $scope.naviData.sidewalks.splice(id, 1);
    };
    $scope.addSidewalk = function () {
        var newSidewalk = fastmap.dataApi.linksidewalk({"linkPid":$scope.naviData.pid,"rowId":$scope.walkFlag.toString()});
        $scope.naviData.sidewalks.unshift(newSidewalk);
        $scope.walkFlag++;
    };
    $scope.addWalkstair = function () {
        var newWalkstair = fastmap.dataApi.linkwalkstair({"linkPid":$scope.naviData.pid,"rowId":$scope.walkFlag.toString()});
        $scope.naviData.walkstairs.unshift(newWalkstair);
        $scope.walkFlag++;
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