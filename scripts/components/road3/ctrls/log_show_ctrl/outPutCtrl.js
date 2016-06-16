/**
 * Created by liwanchong on 2015/10/10.
 */
var outPutModule = angular.module('mapApp');
outPutModule.controller('outPutController', function ($scope) {
    $scope.outputtext = ""
    //图层控制ctrl
    var layerCtrl = fastmap.uikit.LayerController();
    //属性编辑ctrl(解析对比各个数据类型)
    var objCtrl = fastmap.uikit.ObjectEditController();
    //输出控制
    var output = fastmap.uikit.OutPutController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var workPoint = layerCtrl.getLayerById('workPoint');
    //保存选取的元素ctrl
    var selectCtrl = fastmap.uikit.SelectController();
    //高亮ctrl
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    //获取输出数据并显示
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

    //index 1表示是pid  2表示rowid  点击编号在地图上高亮
    $scope.showInMap = function (index, type, id) {
        //先去清除高亮
        highRenderCtrl._cleanHighLight();
        if(highRenderCtrl.highLightFeatures){
            highRenderCtrl.highLightFeatures.length = 0;
        }
        if (type.indexOf("RDLINK") >= 0) {
            $scope.OutDrawLink(id,"RDLINK");//线高亮
        }else if(type.indexOf("RDNODE") >= 0||type.indexOf("ADNODE") >= 0){//形状点高亮
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

                //根据点 找到点链接的几条线
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
                var bounds = line.getBounds();//获取线的边界
                map.fitBounds(bounds, {"maxZoom": 19});//将地图视图尽可能大地设定在给定的地理边界内
                var multiPolyLine = fastmap.mapApi.multiPolyline(lines);

                selectCtrl.onSelected({geometry: multiPolyLine, id: id});

                //高亮点
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
        } else if(type.indexOf("RDCROSS") >= 0){//路口
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
            var linksOfRestric={},highLightFeatures=[];
            Application.functions.getRdObjectById(id, "RDBRANCH", function (d) {
                highLightFeatures.push({
                    id:d.data.inLinkPid.toString(),
                    layerid:'referenceLine',
                    type:'line',
                    style:{}
                });
                highLightFeatures.push({
                    id:d.data.outLinkPid.toString(),
                    layerid:'referenceLine',
                    type:'line',
                    style:{}
                });
                highRenderCtrl.highLightFeatures = highLightFeatures;
                highRenderCtrl.drawHighlight();
                $scope.OutDrawLink(d.data.inLinkPid,"RDLINK");
            });
        }else if(type.indexOf("RDSPEEDLIMIT") >= 0){//限速
            Application.functions.getRdObjectById(id, "RDSPEEDLIMIT", function (d) {
                $scope.OutDrawLink(d.data.linkPid,"RDLINK");
            });
        }else if(type.indexOf("RDGSC")>=0){
            Application.functions.getRdObjectById(id, "RDGSC", function (d) {
                var highLightFeatures=[];
                for (var i = 0, len = (d.data.links).length; i < len; i++) {
                    highLightFeatures.push({
                        id:d.data.links[i].linkPid.toString(),
                        layerid:'referenceLine',
                        type:'line',
                        style:{}
                    })
                }
                highLightFeatures.push({
                    id:d.data.pid.toString(),
                    layerid:'rdGsc',
                    type:'rdgsc',
                    style:{}
                })
                map.setView([d.data.geometry.coordinates[1], d.data.geometry.coordinates[0]], 20);
                highRenderCtrl.highLightFeatures = highLightFeatures;
                highRenderCtrl.drawHighlight();
            });
        }
        else if(type.indexOf("ADLINK") >= 0){//行政区划线高亮
                $scope.OutDrawLink(id,"ADLINK");
        }else if(type.indexOf("ADADMIN") >= 0){
            Application.functions.getRdObjectById(id, "ADADMIN", function (d) {//行政区划代表点高亮
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
        }else if(type.indexOf("ADFACE") >= 0){//行政区划面高亮
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

    //线高亮
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
            var bounds = line.getBounds();//获取线的边界
            map.fitBounds(bounds, {"maxZoom": 19});//将地图视图尽可能大地设定在给定的地理边界内
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