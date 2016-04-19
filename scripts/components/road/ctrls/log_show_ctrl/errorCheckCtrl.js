/**
 * Created by liwanchong on 2015/10/10.
 */
var errorCheckModule = angular.module('lazymodule', []);
errorCheckModule.controller('errorCheckController', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var workPoint = layerCtrl.getLayerById('workPoint');
    var restrictLayer = layerCtrl.getLayerById("referencePoint");
    var checkResultC=fastmap.uikit.CheckResultController();
    var eventController = fastmap.uikit.EventController();

    var hLayer = layerCtrl.getLayerById('highlightlayer');
   // $scope.itemsByPage = 1;
    $scope.initType = 0;


    if(checkResultC.errorCheckData){
        $scope.rowCollection=checkResultC.errorCheckData;
    }

    $scope.initTypeOptions = [
        {"id": 0, "label": " 未修改"},
        {"id": 1, "label": " 例外"},
        {"id": 2, "label": " 确认不修改"},
        {"id": 3, "label": " 确认已修改"}
    ];
    $scope.changeType = function (selectInd, rowid) {
        var params = {
            "projectId": Application.projectid,
            "id": rowid,
            "type": selectInd
        };
        Application.functions.updateCheckType(JSON.stringify(params), function (data) {
            if (data.errcode == 0) {
                $scope.$apply();
                $scope.getCheckDateAndCount();
            }
        });
    }


    $scope.showOnMap = function (targets) {
        if (highLightLayer.highLightLayersArr.length !== 0) {
            highLightLayer.removeHighLightLayers();
        }
        var value = targets.replace("[", "");
        var value1 = value.replace("]", "");

        var type = value1.split(",")[0].replace("_", "");
        var id = value1.split(",")[1];
        if (type == "RDLINK") {
            Application.functions.getRdObjectById(id, type, function (d) {
                if (d.errcode === -1) {
                    return;
                }
                var linkArr = d.data.geometry.coordinates || d.geometry.coordinates, points = [];
                for (var i = 0, len = linkArr.length; i < len; i++) {
                    var point = L.latLng(linkArr[i][1], linkArr[i][0]);
                    points.push(point);
                }
                var line = new L.polyline(points);
                var bounds = line.getBounds();
                map.fitBounds(bounds, {"maxZoom": 19});

                var highLightLink = new fastmap.uikit.HighLightRender(hLayer);
                highLightLink.highLightFeatures.push({
                    id:id.toString(),
                    layerid:'referenceLine',
                    type:'line',
                    style:{}
                });
                highLightLink.drawHighlight();

            })
        } else if (type == "RDRESTRICTION") {

            var limitPicArr = [];
            layerCtrl.pushLayerFront('referencePoint');
            Application.functions.getRdObjectById(id, type, function (d) {
                objCtrl.setCurrentObject("RDRESTRICTION", d.data);

                ////高亮进入线和退出线
                var hightlightFeatures = [];
                hightlightFeatures.push({
                    id: d.data.pid.toString(),
                    layerid:'restriction',
                    type:'restriction',
                    style:{}
                })
                hightlightFeatures.push({
                    id: objCtrl.data["inLinkPid"].toString(),
                    layerid:'referenceLine',
                    type:'line',
                    style:{}
                })

                for (var i = 0, len = (objCtrl.data.details).length; i < len; i++) {

                    hightlightFeatures.push({
                        id: objCtrl.data.details[i].outLinkPid.toString(),
                        layerid:'referenceLine',
                        type:'line',
                        style:{}
                    })
                }
                var highLightLinks = new fastmap.uikit.HighLightRender(hLayer)
                highLightLinks.drawHighlight();

                $.each(objCtrl.data.details, function (i, v) {
                    if (v)
                        limitPicArr.push(v.timeDomain);
                    else
                        limitPicArr.push('');
                })
            })
        } else {
            layerCtrl.pushLayerFront("workPoint");
            Application.functions.getTipsResult(id, function (data) {
                map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);

                var highLightLink = new fastmap.uikit.HighLightRender(hLayer);
                highLightLink.highLightFeatures.push({
                    id:data.rowkey,
                    layerid:'workPoint',
                    type:'workPoint',
                    style:{}
                });
                highLightLink.drawHighlight();
            });
        }
    }


    eventController.on(eventController.eventTypes.CHEKCRESULT, function(event){
        $scope.rowCollection=event.errorCheckData;
    });
});