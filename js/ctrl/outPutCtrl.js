/**
 * Created by liwanchong on 2015/10/10.
 */
var outPutModule = angular.module('lazymodule', []);
outPutModule.controller('outPutController',function($scope,$timeout) {
    var output = fastmap.uikit.OutPutController();
    updateme();
    function updateme(){
        $timeout(function(){
            $scope.outputtext = JSON.stringify(output.outPuts);
            updateme();
        },500);
    }

});