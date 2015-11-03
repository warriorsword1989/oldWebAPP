/**
 * Created by liwanchong on 2015/10/22.
 */
var dataTipsApp = angular.module("lazymodule", []);
dataTipsApp.controller("sceneTipsController", function ($scope) {

        var dataTipsCtrl = new fastmap.uikit.DataTipsController();
        var   selectCtrl= new fastmap.uikit.SelectController();
    $scope.rdSubTipsData =  selectCtrl.rowKey.o_array[0];

    $scope.dataTipsData = selectCtrl.rowKey;
    $scope.closeDataTips = function () {
        $("#popoverTips").css("display", "none");

    };
    $scope.increaseDataTips = function () {
        var outLink = "", info = [], data = {};
        data.pid = this.dataTipsData.in.id;
        data.inLinkPid = this.dataTipsData.in.id;
        data.details = this.dataTipsData.o_array;
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
        //var arr = this.dataTipsData.o_array;
        //for (var i = 0, len = arr.length; i < len; i++) {
        //    var obj = {};
        //    obj.flag = arr[i].oInfo;
        //    info.push(obj);
        //    outLink += arr[i].id;
        //}
        $scope.$parent.$parent.rdRestrictData.details = this.dataTipsData.o_array;
        //$scope.$parent.$parent.rdRestrictData.outLinkPid = outLink;
        $scope.$parent.$parent.rdRestrictData.time = [{startTime: "20121212w", endTime: "20121213"}, {
            startTime: "20141214",
            endTime: "20141215"
        }];

        //dataTipsCtrl.toDataMode(data);
    }
})