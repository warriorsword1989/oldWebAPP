angular.module('app').controller('relationInfoCtl', ['$scope','dsEdit', function($scope,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();


    $scope.showChildrenPoisInMap = function (pid){
        $scope.$emit('emitChildren', pid);
    }
    $scope.showParentPoiInMap = function(pid) {
        $scope.$emit('emitParent', pid);
    };

    $scope.deleteParent = function (poi){
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