angular.module('app').controller('PoiDataListCtl', ['$scope', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout',
    function($scope, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var evtCtrl = fastmap.uikit.EventController();
        var layerCtrl = fastmap.uikit.LayerController();
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var poiLayer = layerCtrl.getLayerById('poi');
        $scope.dataListType = 1;
        $scope.item = {flag: true, id: "1806", name: "通用信息作业", total: '(40/2467)'}
        $scope.allSubItems = [{name:'北京春天双语幼儿园',id:1110},{name:'超市发天通苑店',id:1082}];


        $scope.showTab = function(param){
            dsEdit.getByPid(param, "IXPOI").then(function(rest) {
                if (rest) {
                    objCtrl.setCurrentObject('IXPOI', rest);
                    objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                    evtCtrl.fire(evtCtrl.eventTypes.SELECTBYATTRIBUTE, {
                        feature: objCtrl.data
                    });
                    $scope.$emit("transitCtrlAndTpl", {
                        "loadType": "attrTplContainer",
                        "propertyCtrl": appPath.poi + "ctrls/attr-base/generalBaseCtl",
                        "propertyHtml": appPath.root + appPath.poi + "tpls/attr-base/generalBaseTpl.html"
                    });
                }
            });
        }
    }
]);