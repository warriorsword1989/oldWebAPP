/**
 * Created by liwanchong on 2015/10/10.
 */
var outPutModule = angular.module('mapApp');
outPutModule.controller('outPutController', function ($scope) {
    $scope.outputtext = ""
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();

    var output = fastmap.uikit.OutPutController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var workPoint = layerCtrl.getLayerById('workPoint');
    var selectCtrl = fastmap.uikit.SelectController();

    var highRenderCtrl = fastmap.uikit.HighRenderController();
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

    }

    //index 1表示是pid  2表示rowid
    $scope.showInMap = function (index, type, id) {
        highRenderCtrl._cleanHighLight();
        if(highRenderCtrl.highLightFeatures!=undefined){
            highRenderCtrl.highLightFeatures.length = 0;
        }
        if (type.indexOf("RDLINK") >= 0) {
            $scope.OutDrawLink(id,"RDLINK");
        }else if(type.indexOf("RDNODE") >= 0||type.indexOf("ADNODE") >= 0){
            var nodetype="";
            var nodeLyaerid="";
            if(type.indexOf("RDNODE") >= 0){
                nodetype="RDLINK";
                nodeLyaerid="referenceLine";
            }else{
                nodetype="ADLINK";
                nodeLyaerid="adLink";
            }
            Application.functions.getByCondition(JSON.stringify({
                projectId: Application.projectid,
                type: nodetype,
                data: {"nodePid":  id}
            }), function (data) {
                if (data.errcode === -1) {
                    return;
                }
                var lines = [];

                var highlightFeatures = [];
                for (var index in data.data) {
                    var linkArr = data.data[index].geometry.coordinates || data[index].geometry.coordinates, points = [],points1=[];
                    for (var i = 0, len = linkArr.length; i < len; i++) {
                        var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                        points.push(point);
                        var point1 = L.latLng(linkArr[i][1], linkArr[i][0]);
                        points1.push(point1);
                    }
                    lines.push(fastmap.mapApi.lineString(points));

                    highlightFeatures.push({
                        id:data.data[index].pid,
                        layerid:nodeLyaerid,
                        type:'line',
                        style:{}
                    })
                }
                var line = new L.polyline(points1);
                var bounds = line.getBounds();
                map.fitBounds(bounds, {"maxZoom": 19});
                var multiPolyLine = fastmap.mapApi.multiPolyline(lines);

                selectCtrl.onSelected({geometry: multiPolyLine, id: id});

                highlightFeatures.push({
                    id:id,
                    layerid:nodeLyaerid,
                    type:'node',
                    style:{}
                })

                highRenderCtrl.highLightFeatures = highlightFeatures;
                highRenderCtrl.drawHighlight();
            })
        }
        else if (type.indexOf("RDRESTRICTION") >= 0) {//交限
            var limitPicArr = [];
            layerCtrl.pushLayerFront('restriction');
            Application.functions.getRdObjectById(id, "RDRESTRICTION", function (d) {
                var highLightFeatures = [];
                highLightFeatures.push({
                    id:d.data.inLinkPid.toString(),
                    layerid:'referenceLine',
                    type:'line',
                    style:{}
                });
                for (var i = 0, len = (d.data.details).length; i < len; i++) {

                    highLightFeatures.push({
                        id:d.data.details[i].outLinkPid.toString(),
                        layerid:'referenceLine',
                        type:'line',
                        style:{}
                    })
                }
                highLightFeatures.push({
                    id:d.data.pid.toString(),
                    layerid:'restriction',
                    type:'restriction',
                    style:{}
                })
                highRenderCtrl.highLightFeatures = highLightFeatures;
                highRenderCtrl.drawHighlight();

                $scope.OutDrawLink(d.data.inLinkPid,"RDLINK");
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
                var options = {},linkArr= d.data.links,nodeArr= d.data.nodes,highLightFeatures=[];
                for(var i= 0,len=linkArr.length;i<len;i++) {
                    highLightFeatures.push({
                        id: links[i]["linkPid"].toString(),
                        layerid:'referenceLine',
                        type:'line',
                        style:{}
                    })
                }
                highLightFeatures.push({
                    id:id.toString(),
                    layerid:'rdcross',
                    type:'rdcross',
                    style:{}
                })
                highRenderCtrl.highLightFeatures = highLightFeatures;
                highRenderCtrl.drawHighlight();
                if(linkArr.length>0){
                    $scope.OutDrawLink(linkArr[0]["linkPid"],"RDLINK");
                }else{
                    $scope.showInMap(1,"RDNODE",nodeArr[0]["nodePid"]);
                }
            })
        }else if(type.indexOf("RDLANECONNEXITY") >= 0){//车信
            var linksObj = {};//存放需要高亮的进入线和退出线的id
            Application.functions.getRdObjectById(id, "RDLANECONNEXITY", function (d) {
                //高亮进入线和退出线
                var highLightFeatures = [];
                highLightFeatures.push({
                    id:d.data.inLinkPid.toString(),
                    layerid:'referenceLine',
                    type:'line',
                    style:{}
                });
                for (var i = 0, len = (d.data.topos).length; i < len; i++) {

                    highLightFeatures.push({
                        id:d.data.topos[i].outLinkPid.toString(),
                        layerid:'referenceLine',
                        type:'line',
                        style:{}
                    });
                }
                highRenderCtrl.highLightFeatures = highLightFeatures;
                highRenderCtrl.drawHighlight();
                $scope.OutDrawLink(d.data.inLinkPid,"RDLINK");
            });
        }else if(type.indexOf("RDBRANCH") >= 0){//分歧
            var linksOfRestric={};
            Application.functions.getRdObjectById(id, "RDBRANCH", function (d) {
                var highLightLink = new fastmap.uikit.HighLightRender(hLayer);
                highLightLink.highLightFeatures.push({
                    id:d.data.inLinkPid.toString(),
                    layerid:'referenceLine',
                    type:'line',
                    style:{}
                });
                highLightLink.highLightFeatures.push({
                    id:d.data.outLinkPid.toString(),
                    layerid:'referenceLine',
                    type:'line',
                    style:{}
                });

                highRenderCtrl.drawHighlight();
                $scope.OutDrawLink(d.data.inLinkPid,"RDLINK");
            });
        }else if(type.indexOf("RDSPEEDLIMIT") >= 0){//限速
            Application.functions.getRdObjectById(id, "RDSPEEDLIMIT", function (d) {
                $scope.OutDrawLink(d.data.linkPid,"RDLINK");
            });
        }else if(type.indexOf("ADLINK") >= 0){
                $scope.OutDrawLink(id,"ADLINK");
        }else if(type.indexOf("ADADMIN") >= 0){
            Application.functions.getRdObjectById(id, "ADADMIN", function (d) {
                console.log(d);
                var highLightFeatures = [];
                highLightFeatures.push({
                    id: id.toString(),
                    layerid: 'adAdmin',
                    type: 'adadmin',
                    style: {}
                })
                highRenderCtrl.highLightFeatures = highLightFeatures;
                highRenderCtrl.drawHighlight();
                map.setView([d.data.geometry.coordinates[1], d.data.geometry.coordinates[0]], 20);
            });
        }else if(type.indexOf("ADFACE") >= 0){
            Application.functions.getRdObjectById(id, "ADFACE", function (d) {
                var highLightFeatures = [];
                highLightFeatures.push({
                    id: id.toString(),
                    layerid: 'adface',
                    type: 'adface',
                    style: {}
                })
                highRenderCtrl.highLightFeatures = highLightFeatures;
                highRenderCtrl.drawHighlight();

                $scope.OutDrawLink(d.data.faceTopos[0].linkPid,"ADLINK");
            })
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

            var layerid="";
            if(type.indexOf("RDLINK") >= 0){
                layerid="referenceLine";
            }else if(type.indexOf("ADLINK") >= 0){
                layerid="adLink";
            }

            highRenderCtrl.highLightFeatures.push({
                id:id.toString(),
                layerid:layerid,
                type:'line',
                style:{}
            });
            highRenderCtrl.drawHighlight();

        })
    }



});