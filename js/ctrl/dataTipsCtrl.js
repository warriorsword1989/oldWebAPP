/**
 * Created by liwanchong on 2015/10/22.
 */
var dataTipsApp = angular.module("lazymodule", []);
dataTipsApp.controller("sceneTipsController", function ($scope) {

        var dataTipsCtrl = new fastmap.uikit.DataTipsController();
        var   selectCtrl= new fastmap.uikit.SelectController();
    if(selectCtrl.rowKey) {
        $scope.rdSubTipsData = selectCtrl.rowKey.o_array[0];
    }else{
        $scope.rdSubTipsData = [];
    }



    $scope.dataTipsData = selectCtrl.rowKey;
    $scope.closeDataTips = function () {
        $("#popoverTips").css("display", "none");
    };
    $scope.increaseDataTips = function () {
        var outLink = "", info = [], data = {};
        data.pid = this.dataTipsData.in.id;
        data.inLinkPid = this.dataTipsData.in.id;
        if(this.dataTipsData!==undefined) {
            data.details = this.dataTipsData.o_array;
        }else{
            data.details = [];
        }

        data.flag = 1;
        data.relationshipType = 1;
        data.type = 1;
        data.time = [
            {
                startTime: "a20121212w", endTime: "a20121213"
            },
            {
                startTime: "20141214", endTime: "20141215"
            }
        ],
            data.vehicleExpression = 14;

        $scope.$parent.$parent.rdRestrictData = data;

    };
    $scope.transDataTips = function () {
        var outLink = "", info = [], data = {};
        $scope.$parent.$parent.rdRestrictData.pid = this.dataTipsData.in.id;
        $scope.$parent.$parent.rdRestrictData.inLinkPid = this.dataTipsData.in.id;
        $scope.$parent.$parent.rdRestrictData.details = this.dataTipsData.o_array;
        $scope.$parent.$parent.rdRestrictData.time = [{startTime: "20121212w", endTime: "20121213"}, {
            startTime: "20141214",
            endTime: "20141215"
        }];
    }
})