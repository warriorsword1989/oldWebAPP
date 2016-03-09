/**
 * Created by liwanchong on 2015/10/10.
 */
var errorCheckModule = angular.module('lazymodule', ['smart-table']);
errorCheckModule.controller('errorCheckController', function ($scope,$timeout) {
    var checkOutCtrl = fastmap.uikit.CheckResultController();
    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var restrict = layerCtrl.getLayerById('referencePoint');
    var rdCross = layerCtrl.getLayerById("rdcross")
    var workPoint = layerCtrl.getLayerById('workPoint');
    $scope.itemsByPage = 1;
    $scope.initType=0;
    $scope.initTypeOptions = [
        {"id": 0, "label": " 未修改"},
        {"id": 1, "label": " 例外"},
        {"id": 2, "label": " 确认不修改"},
        {"id": 3, "label": " 确认已修改"}
    ];
    $scope.changeType=function(selectInd,rowid){
        var params = {
            "projectId":Application.projectid,
            "id":rowid,
            "type":selectInd
        };
        Application.functions.updateCheckType(JSON.stringify(params),function(data){
            if(data.errcode == 0) {
                $scope.$apply();
                $scope.getCheckDateAndCount();
            }
        });
    }

    var rdLink = layerCtrl.getLayerById('referenceLine');
    var restrictLayer = layerCtrl.getLayerById("referencePoint");
    var workPoint = layerCtrl.getLayerById("workPoint");
    var highLightLayer = fastmap.uikit.HighLightController();
    $scope.showOnMap=function(targets){

        if (highLightLayer.highLightLayersArr.length !== 0) {
            highLightLayer.removeHighLightLayers();
        }
        var value=targets.replace("[","");
        var value1=value.replace("]","");

        var type=value1.split(",")[0].replace("_","");
        //type="RDSPEEDLIMIT";
        var id=value1.split(",")[1];
        //id="0211019bd50acfa67949ce8f23a3640b249562";
        if(type=="RDLINK"){
            Application.functions.getRdObjectById(id, type, function (d) {
                if (d.errcode === -1) {
                    return;
                }
                //map.setView([d.data.geometry.coordinates[0][1], d.data.geometry.coordinates[0][0]], 19)
                var linkArr = d.data.geometry.coordinates || d.geometry.coordinates, points = [];
                for (var i = 0, len = linkArr.length; i < len; i++) {
                    var point =L.latLng(linkArr[i][1],linkArr[i][0]);
                    points.push(point);
                }
                var line =new L.polyline(points);
                var bounds = line.getBounds();
                map.fitBounds(bounds,{"maxZoom":19});
                //map.fitBounds([[points[0].lng,points[0].lat],[points[1].lng,points[1].lat]],{"maxZoom":20})

                //随着地图的变化 高亮的线不变
                var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
                    map: map,
                    highLightFeature: "link",
                    initFlag: true,
                    linkPid: id
                });
                for (var index in rdLink.tiles) {
                    var data = rdLink.tiles[index].data;
                    var ctx = {
                        canvas: rdLink.tiles[index].options.context,
                        tile: rdLink.tiles[index].options.context._tilePoint,
                        zoom: rdLink._map.zoom
                    }
                    if (data.hasOwnProperty("features")) {
                        for (var i = 0; i < data.features.length; i++) {
                            var feature = data.features[i];

                            var color = null;
                            if (feature.hasOwnProperty('properties')) {
                                color = feature.properties.c;
                            }

                            var style = rdLink.styleFor(feature, color);

                            var geom = feature.geometry.coordinates;
                            if (id !== undefined && feature.properties.id === id) {
                                rdLink._drawLineString(ctx, geom, true, {
                                    size: 2,
                                    color: '#F63428'
                                }, {
                                    color: '#F63428',
                                    radius: 3
                                }, feature.properties);
                            } else {
                                rdLink._drawLineString(ctx, geom, true, style, {
                                    color: '#696969',
                                    radius: 3
                                }, feature.properties);
                            }


                        }
                    }
                }
                highLightLayer.pushHighLightLayers(highLightLink);
            })
        }else if(type=="RDRESTRICTION"){
            var linksObj = {};//存放需要高亮的进入线和退出线的id
            var limitPicArr = [];
            layerCtrl.pushLayerFront('referencePoint');
            Application.functions.getRdObjectById(id, type, function (d) {
                objCtrl.setCurrentObject(d.data);
                //if (objCtrl.updateObject !== "") {
                //    objCtrl.updateObject();
                //}

                var highLightDataTips = new fastmap.uikit.HighLightRender(restrictLayer, {
                    map: map,
                    highLightFeature: "restriction",
                    restrictId: d.data.pid
                });
                var transform = new fastmap.mapApi.MecatorTranform();

                    for (var index in restrictLayer.tiles) {
                        var data = restrictLayer.tiles[index].data;
                        var ctx = {
                            canvas: restrictLayer.tiles[index].options.context,
                            tile: restrictLayer.tiles[index].options.context._tilePoint,
                            zoom: restrictLayer._map.zoom
                        }
                        if (data.hasOwnProperty("features")) {
                            for (var i = 0, len = data.features.length; i < len; i++) {
                                var feature = data.features[i];
                                var geom = feature.geometry.coordinates;
                                if (feature.properties.restrictioninfo === undefined) {
                                    return;
                                }
                                var newStyle = "", newGeom = [];
                                var restrictObj = feature.properties.restrictioninfo;
                                if (id !== undefined && parseInt(feature.properties.id) === id) {
                                    var startP=index.split(":")[0];
                                    var endP=index.split(":")[1];
                                    if (restrictObj.constructor === Array) {
                                        for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {
                                            newStyle = {src: './css/limit/selected/' + restrictObj[theory] + restrictObj[theory] + '.png'};
                                            if (theory > 0) {
                                                newGeom[0] = (parseInt(geom[0]) + theory * 16);
                                                newGeom[1] = (parseInt(geom[1]));
                                                restrictLayer._drawImg(ctx, newGeom, newStyle, true);
                                            } else {
                                                restrictLayer._drawImg(ctx, geom, newStyle, true);
                                            }


                                            var s =transform.PixelToLonlat(startP * 256 + geom[0], endP * 256 + geom[1],  map.getZoom());
                                            map.setView([s[1], s[0]], 20)

                                        }
                                    } else {
                                        var restrictArr = restrictObj.split(",");
                                        for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {

                                            if (restrictArr[fact].constructor === Array) {
                                                newStyle = {src: './css/limit/selected/' + restrictArr[fact][0] + restrictArr[fact][0] + '.png'};
                                            } else {
                                                if (restrictArr[fact].indexOf("[") > -1) {
                                                    restrictArr[fact] = restrictArr[fact].replace("[", "");
                                                    restrictArr[fact] = restrictArr[fact].replace("]", "");
                                                    newStyle = {src: './css/limit/selected/' + restrictArr[fact] + restrictArr[fact] + '.png'};
                                                } else {
                                                    newStyle = {src: './css/limit/selected/' + restrictArr[fact] + '.png'};
                                                }
                                            }
                                            if (fact > 0) {
                                                newGeom[0] = (parseInt(geom[0]) + fact * 16);
                                                newGeom[1] = (parseInt(geom[1]));
                                                restrictLayer._drawImg(ctx, newGeom, newStyle, true);
                                            } else {
                                                restrictLayer._drawImg(ctx, geom, newStyle, true);
                                            }
                                            var s =transform.PixelToLonlat(startP * 256 + parseInt(geom[0]), endP * 256 + parseInt(geom[1]), map.getZoom());
                                            map.setView([s[1], s[0]], 20)

                                        }
                                    }

                                }
                            }
                        }
                    }

                ////高亮进入线和退出线
                linksObj["inLink"] = objCtrl.data["inLinkPid"].toString();
                for(var i= 0,len=(objCtrl.data.details).length;i<len;i++) {
                    linksObj["outLink" + i] = objCtrl.data.details[i].outLinkPid.toString();
                }
                var highLightLinks=new fastmap.uikit.HighLightRender(rdLink,{map:map,highLightFeature:"links",linksObj:linksObj})
                highLightLinks.drawOfLinksForInit();
                highLightLayer.pushHighLightLayers(highLightLinks);
                $.each(objCtrl.data.details,function(i,v){
                    if(v)
                        limitPicArr.push(v.timeDomain);
                    else
                        limitPicArr.push('');
                })
            })
        }else{
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