/**
 * Created by liwanchong on 2015/9/24.
 */
var layerModule = angular.module('lazymodule', []);
layerModule.controller('taskLayersController',function($scope) {
    $scope.showLayers=function(item) {
        item.show = !item.show;
        console.log($scope.items);
    };
    $scope.chooseLayers=function(item) {
        item.choose = !item.choose;
        console.log($scope.items);
    };
    $scope.editorLayers=function(item) {
        item.editor = !item.editor;
        console.log($scope.items);
    };
})
