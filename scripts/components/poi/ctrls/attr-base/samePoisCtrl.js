angular.module('app').controller('samePoisCtrl', ['$scope','dsEdit', function($scope,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();

    $scope.initializeData = function(){
        $scope.slopeData = objCtrl.data;
       
    };
    $scope.initializeData();
    $scope.deleteSamePoi = function (poi){
        var pid = poi.parents[0].parentPoiPid;
        var poiId = poi.pid;
        dsEdit.deleteParent(poiId).then(function (data) {
            if(data){
                dsEdit.getByPid(poiId, "IXPOI").then(function (rest) {
                    if (rest) {
                        objCtrl.setCurrentObject('IXPOI', rest);
                        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                        //$scope.$emit("SWITCHCONTAINERSTATE", {});
                        // $scope.$emit("transitCtrlAndTpl", {
                        //     "loadType": "tipsTplContainer",
                        //     "propertyCtrl": appPath.poi + "ctrls/attr-tips/poiPopoverTipsCtl",
                        //     "propertyHtml": appPath.root + appPath.poi + "tpls/attr-tips/poiPopoverTips.html"
                        // });
                        // $scope.$emit("transitCtrlAndTpl", {
                        //     "loadType": "attrTplContainer",
                        //     "propertyCtrl": appPath.poi + "ctrls/attr-base/generalBaseCtl",
                        //     "propertyHtml": appPath.root + appPath.poi + "tpls/attr-base/generalBaseTpl.html"
                        // });
                    }
                });
            }
        });

    }
}]);