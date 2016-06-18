/**
 * Created by liwanchong on 2015/10/29.
 */
var zonePeopertyApp = angular.module("mapApp");
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
            "propertyCtrl": 'scripts/components/road3/ctrls/attr_link_ctrl/infoOfZoneCtrl',
            "propertyHtml": '../../../scripts/components/road3/tpls/attr_link_tpl/infoOfZoneTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showZoneWinObj);
    }

})