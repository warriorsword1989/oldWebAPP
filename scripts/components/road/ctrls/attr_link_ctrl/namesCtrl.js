/**
 * Created by liwanchong on 2015/10/29.
 */
var basicApp = angular.module("app");
basicApp.controller("nameController", function ($scope, $ocLazyLoad) {


    $scope.showNames = function (nameItem,index) {
        //$scope.linkData["oridiRowId"] = nameItem.rowId;
        var showBlackObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            "loadType":"subAttrTplContainer",
            "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            "callback":function (){
                var showNamesObj = {
                    "loadType":"subAttrTplContainer",
                    "propertyCtrl": 'scripts/components/road/ctrls/attr_link_ctrl/namesOfDetailCtrl',
                    "propertyHtml": '../../../scripts/components/road/tpls/attr_link_tpl/namesOfDetailTpl.html',
                    "data":index+"" //必须将数字转成字符串
                };
                $scope.$emit("transitCtrlAndTpl", showNamesObj);
            }
        };
        $scope.$emit("transitCtrlAndTpl", showBlackObj);


    };

    $scope.addRdName = function () {
        var newName = fastmap.dataApi.rdLinkName({"linkPid": $scope.linkData.pid});
        $scope.linkData.names.unshift(newName)
    };


    $scope.minusName = function (id) {
        $scope.linkData.names.splice(id, 1);
        $scope.$emit("SWITCHCONTAINERSTATE",{"subAttrContainerTpl": false});
    }

    $scope.changeColor = function (ind, ord) {
        $("#nameSpan" + ind).css("color", "#FFF");
    }
    $scope.backColor = function (ind, ord) {
        $("#nameSpan" + ind).css("color", "darkgray");
    }


})