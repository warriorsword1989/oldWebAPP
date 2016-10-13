angular.module('app').controller('samePoisCtrl', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var layerCtrl = fastmap.uikit.LayerController();
    var poiLayer = layerCtrl.getLayerById('poi');

    $scope.deleteSamePoi = function (poi) {
        var param = {};
        param["command"] = "DELETE";
        param["dbId"] = App.Temp.dbId;
        param["type"] = "IXSAMEPOI";
        param["objId"] = poi.samepoiParts[0].groupId;
        dsEdit.save(param).then(function (data) {
            if (data != null) {
                poiLayer.redraw();
                swal("操作成功", "删除POI同一关系成功", "success");
                dsEdit.getByPid(poi.pid, "IXPOI").then(function (rest) {
                    if (rest) {
                        objCtrl.setCurrentObject('IXPOI', rest);
                        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                    }
                });
            }
        });
    }
}]);