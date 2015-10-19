/**
 * Created by liwanchong on 2015/10/10.
 */
var referenceModule = angular.module('lazymodule', []);
referenceModule.controller('referenceLayersController',function($scope) {
    $scope.showLayers=function(item) {
        item.show = !item.show;
        console.log($scope.items);
    };
})