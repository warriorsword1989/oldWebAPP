/**
 * Created by liwanchong on 2015/10/10.
 */
var outPutModule = angular.module('lazymodule', []);
outPutModule.controller('outPutController',function($scope,$timeout) {
    var output = fastmap.uikit.OutPutController();

    output.updateOutPuts=function(){
        var outvalue=output.outPuts;
        $scope.outputtext = outvalue.join("\n----------------------------------\n");
    }

    //$scope.outputtext = outvalue.join("\n----------------------------------\n");
    ////updateme();
    //if($scope.$parent.$parent.updateme!=""){
    //    updateme();
    //}
    //function updateme(){
    //    var outvalue=output.outPuts;
    //    $scope.outputtext = outvalue.join("\n----------------------------------\n");
    //}
});