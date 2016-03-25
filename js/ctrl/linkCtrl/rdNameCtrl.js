/**
 * Created by liwanchong on 2015/10/29.
 */
var basicApp = angular.module("mapApp", ['oc.lazyLoad']);
basicApp.controller("nameController", function ($scope, $ocLazyLoad) {


    $scope.showNames = function (nameItem) {
        $scope.linkData["oridiRowId"] = nameItem.rowId;
        var showNamesObj = {
            "propertyCtrl": 'ctrl/linkCtrl/namesOfLinkCtrl',
            "propertyHtml": 'js/tepl/linkObjTepl/namesOfLinkTepl.html'
        }
        $scope.$emit("transitJsAndCtrl", showNamesObj);
    };

    $scope.addRdName = function () {
        var newName = fastmap.dataApi.linkname({"linkPid": $scope.linkData.pid});
        $scope.linkData.names.unshift(newName)
    };


    $scope.minusName = function (id) {
        $scope.linkData.names.splice(id, 1);
    }

    $scope.changeColor = function (ind, ord) {
        $("#nameSpan" + ind).css("color", "#FFF");
    }
    $scope.backColor = function (ind, ord) {
        $("#nameSpan" + ind).css("color", "darkgray");
    }


})