/**
 * Created by liwanchong on 2015/10/29.
 */
var zonePeopertyApp = angular.module("lazymodule", []);
zonePeopertyApp.controller("zonePeopertyController",function($scope) {
    $scope.zoneData =  $scope.linkData;
    $scope.typeoption=[
        {"id":0,"label":"未分类"},
        {"id":1,"label":"AOIZone"},
        {"id":2,"label":"KDZone"},
        {"id":3,"label":"GCZone"}
    ];
    $("#developStatebtn"+$scope.zoneData.developState).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#urbanbtn"+ $scope.zoneData.urban).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#diciTypebtn"+$scope.zoneData.diciType).removeClass("btn btn-default").addClass("btn btn-primary");

    $scope.checkdevelopState= function (flag) {
        $("#developStatediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#developStatebtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.zoneData.developState=flag;
    }
    $scope.checkurban= function (flag) {
        $("#urbandiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#urbanbtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.zoneData.urban=flag;
    }
    $scope.checkdiciType= function (flag) {
        $("#diciTypediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#diciTypebtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.zoneData.diciType=flag;
    }

})