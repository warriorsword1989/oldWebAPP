/**
 * Created by liwanchong on 2015/10/29.
 */
var basicApp = angular.module("lazymodule", []);
basicApp.controller("basicController",function($scope) {
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.data = currentTest;
    $scope.addRoadName=function(){
        if(!$("#loadPropertyDiv").hasClass("in")) {
            $("#loadPropertyDiv").addClass("in");
        }
        $scope.data.nameCount.unshift({name:"",linkPid:"121"})
    }
    $scope.minusRoadName=function(id) {
        $scope.data.nameCount.splice(id, 1);
        if($scope.data.nameCount.length===0) {
            if($("#loadPropertyDiv").hasClass("in")) {
                $("#loadPropertyDiv").removeClass("in");
            }
        }
    };
})