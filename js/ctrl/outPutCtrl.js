/**
 * Created by liwanchong on 2015/10/10.
 */
var outPutModule = angular.module('lazymodule', []);
outPutModule.controller('outPutController', function ($scope) {
    $scope.outputtext = ""
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var output = fastmap.uikit.OutPutController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var workPoint = layerCtrl.getLayerById('workPoint');
    var restrictLayer = layerCtrl.getLayerById("referencePoint");
    output.updateOutPuts = function () {
        var outValue = output.outPuts;
        var info = [];
        for (var i = 0; i < outValue.length; i++) {
            $.each(outValue[i], function (a, item) {
                info.unshift(item);
            });
        }
        if (outValue.length === 0) {
            $scope.outValue = "";
        } else {
            $scope.$apply(function () {
                $scope.outValue = info;
            })
        }

    }

    $scope.showByMap = function (type, pid) {
        console.log(type, pid);
    }

    //index 1表示是pid  2表示rowid
    $scope.showInMap = function (index, type, id) {
        if (highLightLayer.highLightLayersArr.length !== 0) {
            highLightLayer.removeHighLightLayers();
        }
        if (type.indexOf("RDLINK") >= 0) {
            Application.functions.getRdObjectById(id, "RDLINK", function (d) {
                if (d.errcode === -1) {
                    return;
                }
                //随着地图的变化 高亮的线不变
                var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
                    map: map,
                    highLightFeature: "link",
                    initFlag: false,
                    linkPid: id.toString()
                });
                highLightLayer.pushHighLightLayers(highLightLink);
                highLightLink.drawOfLinkForInit();
                var linkArr = d.data.geometry.coordinates || d.geometry.coordinates, points = [];
                for (var i = 0, len = linkArr.length; i < len; i++) {
                    var point = L.latLng(linkArr[i][1], linkArr[i][0]);
                    points.push(point);
                }
                var line = new L.polyline(points);
                var bounds = line.getBounds();
                map.fitBounds(bounds, {"maxZoom": 19});
            })
        } else if (type.indexOf("RDRESTRICTION") >= 0) {
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