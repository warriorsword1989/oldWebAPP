/**
 * Created by liwanchong on 2015/10/29.
 */
var zonePeopertyApp = angular.module("lazymodule", []);
zonePeopertyApp.controller("zonePeopertyController", function ($scope, $timeout, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.zoneData = objCtrl.data;
    $scope.typeoption = [
        {"id": 0, "label": "未分类"},
        {"id": 1, "label": "AOIZone"},
        {"id": 2, "label": "KDZone"},
        {"id": 3, "label": "GCZone"}
    ];
    $scope.showZoneWin = function (item) {
        $scope.linkData["oridiRowId"] = item.rowId;
        var showZoneWinObj = {
            "loadType":"subAttrTplContainer",
            "propertyCtrl": 'ctrl/linkCtrl/infoOfZoneCtrl',
            "propertyHtml": 'js/tepl/linkObjTepl/infoOfZoneTepl.html'
        }
        $scope.$emit("transitCtrlAndTmpl", showZoneWinObj);
    }

})