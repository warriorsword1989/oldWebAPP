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
    var selectCtrl = fastmap.uikit.SelectController();
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
            $scope.OutDrawLink(id,"RDLINK");
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
        } else if(type.indexOf("RDCROSS") >= 0){
            Application.functions.getRdObjectById(id, "RDCROSS", function (d) {
                if (d.errcode === -1) {
                    return;
                }
                var options = {},linkArr=[],nodeArr=[];
                var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
                    map: map,
                    highLightFeature: "linksOfCross",
                    initFlag: true
                });
                highLightLayer.pushHighLightLayers(highLightLink);
                for(var a in d.data.links){
                    linkArr.push(d.data.links[a].linkPid);
                }
                for(var m in d.data.nodes){
                    nodeArr.push(d.data.nodes[m].nodePid);
                }
                highLightLink.drawLinksOfCrossForInit(linkArr,nodeArr);
                $scope.OutDrawLink(linkArr[0],"RDLINK");
            })
        }else if(type.indexOf("RDLANECONNEXITY") >= 0){//车信
            var linksObj = {};//存放需要高亮的进入线和退出线的id
            Application.functions.getRdObjectById(id, "RDLANECONNEXITY", function (d) {
                linksObj["inLink"] = d.data.inLinkPid.toString();
                for (var i = 0, len = (d.data.topos).length; i < len; i++) {
                    linksObj["outLink" + i] = d.data.topos[i].outLinkPid.toString();
                }
                var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
                    map: map,
                    highLightFeature: "links",
                    linksObj: linksObj
                })
                highLightLinks.drawOfLinksForInit();
                highLightLayer.pushHighLightLayers(highLightLinks);
                $scope.OutDrawLink(d.data.inLinkPid,"RDLINK");
            });
        }else if(type.indexOf("RDBRANCH") >= 0){//分歧
            var linksOfRestric={};
            Application.functions.getRdObjectById(id, "RDBRANCH", function (d) {
                linksOfRestric["inLink"] = d.data.inLinkPid + '';
                linksOfRestric["outLink"] = d.data.outLinkPid + '';

                var highLightLinks=new fastmap.uikit.HighLightRender(rdLink,
                    {
                        map:map,
                        highLightFeature:"links",
                        linksObj:linksOfRestric
                    });
                highLightLinks.drawOfLinksForInit();
                highLightLayer.pushHighLightLayers(highLightLinks);
                $scope.OutDrawLink(d.data.inLinkPid,"RDLINK");
            });
        }else if(type.indexOf("RDSPEEDLIMIT") >= 0){//限速
            Application.functions.getRdObjectById(id, "RDSPEEDLIMIT", function (d) {
                $scope.OutDrawLink(d.data.linkPid,"RDLINK");
            });
        }
    }

    $scope.OutDrawLink=function(id,type){
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
                initFlag: true,
                linkPid: id.toString()
            });
            highLightLayer.pushHighLightLayers(highLightLink);
            highLightLink.drawOfLinkForInit();

        })
    }



});