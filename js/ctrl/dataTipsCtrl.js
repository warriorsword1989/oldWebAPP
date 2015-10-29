/**
 * Created by liwanchong on 2015/10/22.
 */
var dataTipsApp = angular.module("lazymodule", []);
dataTipsApp.controller("sceneTipsController", function ($scope) {

        var dataTipsCtrl = new fastmap.uikit.DataTipsController();
        selectCtrl= new fastmap.uikit.SelectController();




    //$scope.$on("dataTipsToChild", function (event, data) {
    //    $scope.dataTipsData = data;
    //});
    $scope.dataTipsData = selectCtrl.rowKey;
    $scope.closeDataTips = function () {
        $("#popoverTips").css("display", "none");
        //alert($scope.dataTipsData.name);
    };
    $scope.increaseDataTips = function () {
        var outLink = "", info = [], data = {};
        data.pid = this.dataTipsData.id;
        data.inLinkPid = this.dataTipsData.id;
        var arr = this.dataTipsData.o_array;
        for (var i = 0, len = arr.length; i < len; i++) {
            var obj = {};
            obj.flag = arr[i].oInfo;
            info.push(obj);
            outLink += arr[i].id;
        }
        data.restricInfo = info;
        data.outLinkPid = outLink;
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

        //dataTipsCtrl.toDataMode(data);
        $scope.$parent.$parent.rdRestrictData = data;
        //console.log($scope.$parent.$parent.rdRestrictData)
        //dataTipsCtrl.increase();
    };
    $scope.transDataTips = function () {
        var outLink = "", info = [], data = {};
        $scope.$parent.$parent.rdRestrictData.pid = this.dataTipsData.id;
        $scope.$parent.$parent.rdRestrictData.inLinkPid = this.dataTipsData.id;
        var arr = this.dataTipsData.o_array;
        for (var i = 0, len = arr.length; i < len; i++) {
            var obj = {};
            obj.flag = arr[i].oInfo;
            info.push(obj);
            outLink += arr[i].id;
        }
        $scope.$parent.$parent.rdRestrictData.restricInfo = info;
        $scope.$parent.$parent.rdRestrictData.outLinkPid = outLink;
        $scope.$parent.$parent.rdRestrictData.time = [{startTime: "20121212w", endTime: "20121213"}, {
            startTime: "20141214",
            endTime: "20141215"
        }];

        //dataTipsCtrl.toDataMode(data);
    }
})