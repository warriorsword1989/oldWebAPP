/**
 * Created by liwanchong on 2015/10/10.
 */
var outPutModule = angular.module('lazymodule', []);
outPutModule.controller('outPutController',function($scope,$timeout) {
    $scope.outputtext=""
    var output = fastmap.uikit.OutPutController();
    output.updateOutPuts=function(){
        var outValue=output.outPuts;
        if(outValue.length===0) {
            $scope.outputtext = "";
        }else{
            $scope.$apply(function(){
                $scope.outputtext = outValue.join("\n----------------------------------\n");
            })
        }

    }
});