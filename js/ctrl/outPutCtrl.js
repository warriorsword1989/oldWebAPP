/**
 * Created by liwanchong on 2015/10/10.
 */
var outPutModule = angular.module('lazymodule', []);
outPutModule.controller('outPutController', function ($scope, $timeout) {
    $scope.outputtext = ""
    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = new fastmap.uikit.ObjectEditController();
    var output = fastmap.uikit.OutPutController();
    output.updateOutPuts=function(){
        var outValue=output.outPuts;
        var info=[];
        for(var i=0;i<outValue.length;i++) {
                $.each(outValue[i], function (a, item) {
                    info.unshift(item);
                });
        }
        if(outValue.length===0) {
            $scope.outValue = "";
        }else{
            $scope.$apply(function(){
                $scope.outValue=info;
            })
        }

    }

    $scope.showByMap=function(type,pid){
        console.log(type,pid);
    }

});