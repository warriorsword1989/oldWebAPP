angular.module('app').controller('SearchResultCtl', ['$scope','dsEdit', 'appPath', function($scope,dsEdit,appPath) {

    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = new fastmap.uikit.HighRenderController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.theadInfo = ['序号','要素PID','要素类型','名称','属性1','属性2'];

    //点击数据在地图上高亮
    $scope.showOnMap = function(id,type) {
        highRenderCtrl._cleanHighLight();
        if(highRenderCtrl.highLightFeatures!=undefined){
            highRenderCtrl.highLightFeatures.length = 0;
        }
        var highlightFeatures = [];
        dsEdit.getByPid(id,type).then(function (data) {
            if(data){
                switch (type){
                    case "RDLINK":
                        var linkArr = data.geometry.coordinates, points = [];
                        for (var i = 0, len = linkArr.length; i < len; i++) {
                            var point = L.latLng(linkArr[i][1], linkArr[i][0]);
                            points.push(point);
                        }
                        var line = new L.polyline(points);
                        var bounds = line.getBounds();
                        map.fitBounds(bounds, {"maxZoom": 19});
                        highRenderCtrl.highLightFeatures.push({
                            id:id.toString(),
                            layerid:'rdLink',
                            type:'line',
                            style:{}
                        });
                        map.setView([data.geometry.coordinates[1][1], data.geometry.coordinates[1][0]], 17);
                        selectCtrl.onSelected({
                            point: data.point
                        });
                        getFeatDataCallback(data, id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                        break;
                    case "IXPOI":
                        highRenderCtrl.highLightFeatures.push({
                            id:id.toString(),
                            layerid:'poi',
                            type:'IXPOI',
                            style:{}
                        });
                        map.setView([data.geometry.coordinates[1], data.geometry.coordinates[0]], 17);
                        getFeatDataCallback(data, id, "IXPOI", appPath.poi + "ctrls/attr-base/generalBaseCtl", appPath.root + appPath.poi + "tpls/attr-base/generalBaseTpl.html");
                        break;
                    default :
                        layerCtrl.pushLayerFront("workPoint");
                        highRenderCtrl.highLightFeatures.push({
                            id:data.rowkey,
                            layerid:'workPoint',
                            type:'workPoint',
                            style:{}
                        });
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        break;
                }
                highRenderCtrl.drawHighlight();
            }
        })
    };
    function getFeatDataCallback(selectedData, id, type, ctrl, tpl,toolsObj){
        dsEdit.getByPid(id, type).then(function(data) {
            getByPidCallback(type, ctrl, tpl, data,selectedData,toolsObj);
        });
    };
    function getByPidCallback(type, ctrl, tpl, data,selectedData,toolsObj) {
        objCtrl.setCurrentObject(type, data);
        if (type == "IXPOI") {
            $scope.$emit("transitCtrlAndTpl", {
                "loadType": "tipsTplContainer",
                "propertyCtrl": appPath.poi + "ctrls/attr-tips/poiPopoverTipsCtl",
                "propertyHtml": appPath.root + appPath.poi + "tpls/attr-tips/poiPopoverTips.html"
            });
            $scope.$emit("transitCtrlAndTpl", {
                "loadType": "attrTplContainer",
                "propertyCtrl": ctrl,
                "propertyHtml": tpl
            });
        } else {
            $scope.$emit("transitCtrlAndTpl", {
                "loadType": 'attrTplContainer',
                "propertyCtrl": ctrl,
                "propertyHtml": tpl
            });
        }

    }
}]);