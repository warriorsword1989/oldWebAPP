/**
 * Created by liwanchong on 2015/10/10.
 */
var outPutModule = angular.module('lazymodule', []);
outPutModule.controller('outPutController', function ($scope, $timeout) {
    $scope.outputtext = ""
    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = new fastmap.uikit.ObjectEditController();
    var output = fastmap.uikit.OutPutController();
   // $scope.outputtext=output.outPuts.join("\n----------------------------------\n");
    output.updateOutPuts=function(){
        var outValue=output.outPuts;
        var info=[];
        for(var i=0;i<outValue.length;i++) {
                $.each(outValue[i], function (a, item) {
                    info.push(item);
                });
        }
        if(outValue.length===0) {
            $scope.outValue = "";
        }else{
            $scope.$apply(function(){
               // $scope.outputtext = outValue.join("\n----------------------------------\n");
                $scope.outValue=info;
            })
        }

    }

    $scope.showByMap=function(type,pid){
        console.log(type,pid);
    }

});