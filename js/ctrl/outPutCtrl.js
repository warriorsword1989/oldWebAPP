/**
 * Created by liwanchong on 2015/10/10.
 */
var outPutModule = angular.module('lazymodule', []);
outPutModule.controller('outPutController', function ($scope, $timeout) {
    $scope.outputtext = ""
    var output = fastmap.uikit.OutPutController();
    output.updateOutPuts = function () {

        $scope.$apply(function () {
            $scope.outputtext = JSON.stringify(output.outPuts);
        })
        console.log($scope.outputtext);
    };
});