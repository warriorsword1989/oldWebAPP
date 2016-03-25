/**
 * Created by liwanchong on 2015/10/10.
 */
var errorCheckModule = angular.module('lazymodule', ['smart-table']);
errorCheckModule.controller('errorCheckController', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var workPoint = layerCtrl.getLayerById('workPoint');
    var restrictLayer = layerCtrl.getLayerById("referencePoint");
    $scope.itemsByPage = 1;
    $scope.initType = 0;
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

                //随着地图的变化 高亮的线不变
                var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
                    map: map,
                    highLightFeature: "link",
                    initFlag: false,
                    linkPid: id.toString()
                });
                highLightLayer.pushHighLightLayers(highLightLink);
            })
        } else if (type == "RDRESTRICTION") {
            var linksObj = {};//存放需要高亮的进入线和退出线的id
            var limitPicArr = [];
            layerCtrl.pushLayerFront('referencePoint');
            Application.functions.getRdObjectById(id, type, function (d) {
                objCtrl.setCurrentObject("RDRESTRICTION", d.data);
                var highLightDataTips = new fastmap.uikit.HighLightRender(restrictLayer, {
                    map: map,
                    highLightFeature: "restriction",
                    restrictId: d.data.pid.toString(),
                    initFlag: true
                });

                ////高亮进入线和退出线
                linksObj["inLink"] = objCtrl.data["inLinkPid"].toString();
                for (var i = 0, len = (objCtrl.data.details).length; i < len; i++) {
                    linksObj["outLink" + i] = objCtrl.data.details[i].outLinkPid.toString();
                }
                var highLightLinks = new fastmap.uikit.HighLightRender(rdLink,
                    {
                        map: map,
                        highLightFeature: "links",
                        linksObj: linksObj,
                        initFlag: false
                    })
                highLightLinks.drawOfLinksForInit();
                highLightLayer.pushHighLightLayers(highLightLinks);
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
                map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20)
                var highLightDataTips = new fastmap.uikit.HighLightRender(workPoint, {
                    map: map,
                    highLightFeature: "dataTips",
                    dataTips: data.rowkey
                });
                highLightDataTips.drawTipsForInit();
                highLightLayer.pushHighLightLayers(highLightDataTips);
            });
        }
    }


});