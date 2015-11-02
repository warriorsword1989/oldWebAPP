/**
 * Created by liwanchong on 2015/10/10.
 */
var outPutModule = angular.module('lazymodule', []);
outPutModule.controller('outPutController',function($scope) {
    var output = fastmap.uikit.OutPutController();
    $scope.outputtext = JSON.stringify(output.outPuts);

});