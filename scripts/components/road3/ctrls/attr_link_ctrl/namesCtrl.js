/**
 * Created by liwanchong on 2015/10/29.
 */
var basicApp = angular.module("app");
basicApp.controller("nameController", function ($scope, $ocLazyLoad) {


    $scope.showNames = function (nameItem) {
        $scope.linkData["oridiRowId"] = nameItem.rowId;
        var showNamesObj = {
            "loadType":"subAttrTplContainer",
            "propertyCtrl": 'scripts/components/road3/ctrls/attr_link_ctrl/namesOfDetailCtrl',
            "propertyHtml": '../../../scripts/components/road3/tpls/attr_link_tpl/namesOfDetailTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showNamesObj);
    };

    $scope.addRdName = function () {
        var newName = fastmap.dataApi.rdLinkName({"linkPid": $scope.linkData.pid});
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