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
    setTimeout(function(){
        for(var sitem in $scope.zoneData.zones){
            var flag=$scope.zoneData.zones[sitem].side;
            $("#side"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
        }
    },10)
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
    $scope.checkside=function(flag,item,index){
        $("#sidediv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#side"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.side=flag;
    }

})