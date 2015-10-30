/**
 * Created by liwanchong on 2015/10/29.
 */
var zonePeopertyApp = angular.module("lazymodule", []);
zonePeopertyApp.controller("zonePeopertyController",function($scope) {
    $scope.zoneData = zoneTest;
})