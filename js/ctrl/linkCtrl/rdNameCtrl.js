/**
 * Created by liwanchong on 2015/10/29.
 */
var basicApp = angular.module("mapApp", ['oc.lazyLoad']);
basicApp.controller("nameController",function($scope,$ocLazyLoad) {



    $scope.showNames=function(nameItem) {
        if(! $scope.$parent.$parent.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.$parent.$parent.suspendFlag = true;
        }

        $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
       // $scope.linkData["oridiRowId"] = nameItem.nameGroupid;
        $scope.linkData["oridiRowId"]=nameItem.rowId;
        $ocLazyLoad.load('ctrl/linkCtrl/namesOfLinkCtrl').then(function () {
            $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/namesOfLinkTepl.html";
        })
    };

        $scope.addRdName = function () {
            var newName = fastmap.dataApi.linkname({"linkPid": $scope.linkData.pid});
            $scope.linkData.names.unshift(newName)
        };


    $scope.minusName=function(id){
        $scope.linkData.names.splice(id, 1);
    }

    $scope.changeColor=function(ind,ord){
            $("#nameSpan"+ind).css("color","#FFF");
    }
    $scope.backColor=function(ind,ord){
            $("#nameSpan"+ind).css("color","darkgray");
    }


})