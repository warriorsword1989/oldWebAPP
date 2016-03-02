/**
 * Created by liwanchong on 2015/12/11.
 */

function keyEvent(ocLazyLoad, scope) {
    $(document).bind('keydown',
        function (event) {
            //取消
            var layerCtrl = fastmap.uikit.LayerController();
            var shapeCtrl = fastmap.uikit.ShapeEditorController();
            var toolTipsCtrl = fastmap.uikit.ToolTipsController();
            var highCtrl = fastmap.uikit.HighLightController();
            if (event.keyCode == 27) {
                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                if (toolTipsCtrl.getCurrentTooltip()) {
                    toolTipsCtrl.onRemoveTooltip();
                }
                if (highCtrl.highLightLayersArr.length !== 0) {
                    highCtrl.removeHighLightLayers();
                }
                layerCtrl.getLayerById('edit').shapeEditor.shapeEditorResult.setFinalGeometry(null);
                layerCtrl.getLayerById('edit').clear();
                shapeCtrl.stopEditing();
                layerCtrl.getLayerById('edit').bringToBack();
                $(layerCtrl.getLayerById('edit').options._div).unbind();
            }
        });
    $(document).bind('keypress',

        function (event) {
            var layerCtrl = fastmap.uikit.LayerController();
            var outPutCtrl = fastmap.uikit.OutPutController();
            var featCodeCtrl = fastmap.uikit.FeatCodeController();

            var toolTipsCtrl = fastmap.uikit.ToolTipsController();
            var shapeCtrl = fastmap.uikit.ShapeEditorController();
            var objEditCtrl = fastmap.uikit.ObjectEditController();
            var checkCtrl = fastmap.uikit.CheckResultController();
            var selectCtrl = fastmap.uikit.SelectController();
            var rdLink = layerCtrl.getLayerById('referenceLine');
            var restrict = layerCtrl.getLayerById('referencePoint');
            var rdCross = layerCtrl.getLayerById('rdcross');
            var speedlimitlayer = layerCtrl.getLayerById('speedlimit');
            var editLayer = layerCtrl.getLayerById('edit');
            var link = shapeCtrl.shapeEditorResult.getFinalGeometry();

            var properties =  shapeCtrl.shapeEditorResult.getProperties();
            var coordinate = [];
            //是否包含点
            function _contains(point, components) {
                var boolExit = false;
                for (var i in components) {
                    if (point.x == components[i].x && point.y == components[i].y) {
                        boolExit = true;
                    }
                }
                return boolExit;
            }

            function distance(pointA, pointB) {
                var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
                return Math.sqrt(len);
            };
            function resetPage(data) {
                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                if (toolTipsCtrl.getCurrentTooltip()) {
                    toolTipsCtrl.onRemoveTooltip();
                }
                rdLink.redraw();
                rdCross.redraw();
                editLayer.drawGeometry = null;
                editLayer.clear();
                shapeCtrl.stopEditing();
                editLayer.bringToBack();
                $(editLayer.options._div).unbind();
                scope.changeBtnClass("");
                scope.$apply();

            }

            if (event.keyCode == 32) {
                if (shapeCtrl.editType === 'drawPath') {
                    if (coordinate.length !== 0) {
                        coordinate.length = 0;
                    }
                    for (var index=0,len = link.components.length;index < len; index ++) {
                        coordinate.push([link.components[index].x, link.components[index].y]);
                    }
                    var paramOfLink = {
                        "command": "CREATE",
                        "type": "RDLINK",
                        "projectId": 11,
                        "data": {
                            "eNodePid": properties.enodePid?properties.enodePid:0,
                            "sNodePid": properties.snodePid?properties.snodePid:0,
                            "geometry": {"type": "LineString", "coordinates": coordinate},
                            'catchLinks':properties.catches
                        }
                    }
                    //结束编辑状态
                    shapeCtrl.stopEditing();
                    Application.functions.saveLinkGeometry(JSON.stringify(paramOfLink), function (data) {

                        var info=null;
                        if (data.errcode==0) {
                            var sinfo={
                                "op":"创建道路link成功",
                                "type":"",
                                "pid": ""
                            };
                            data.data.log.unshift(sinfo);
                            info=data.data.log;
                        }else{
                            info=[{
                                "op":data.errcode,
                                "type":data.errmsg,
                                "pid": data.errid
                            }];
                        }
                        resetPage(info);
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }
                    });

                } else if (shapeCtrl.editType === "restriction") {
                    var paramOfRestrict = {
                        "command": "CREATE",
                        "type": "RESTRICTION",
                        "projectId": 11,
                        "data": featCodeCtrl.getFeatCode()
                    };
                    Application.functions.saveLinkGeometry(JSON.stringify(paramOfRestrict), function (data) {

                        var pid = data.data.log[0].pid;
                        checkCtrl.setCheckResult(data);
                        //清空上一次的操作
                        map.currentTool.cleanHeight();
                        map.currentTool.disable();
                        restrict.redraw();
                        var info=null;
                        if (data.errcode==0) {
                            var sinfo={
                                "op":"创建交限成功",
                                "type":"",
                                "pid": ""
                            };
                            data.data.log.unshift(sinfo);
                            info=data.data.log;
                        }else{
                            info=[{
                                "op":data.errcode,
                                "type":data.errmsg,
                                "pid": data.errid
                            }];
                        }
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }
                        toolTipsCtrl.onRemoveTooltip();

                        Application.functions.getRdObjectById(pid, "RDRESTRICTION", function (data) {
                            objEditCtrl.setCurrentObject(data.data);
                            if (objEditCtrl.updateObject !== "") {
                                objEditCtrl.updateObject();
                            }
                            ocLazyLoad.load('ctrl/objectEditCtrl').then(function () {
                                scope.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                            })
                        })

                    });
                } else if (shapeCtrl.editType === "pathBreak") {
                    var breakPoint = null;
                    for (var item in link.components) {
                        if (!_contains(link.components[item], shapeCtrl.shapeEditorResult.getOriginalGeometry().points)) {
                            breakPoint = link.components[item];
                        }

                    }
                    var param = {
                        "command": "BREAK",
                        "type": "RDLINK",
                        "projectId": 11,
                        "objId": parseInt(selectCtrl.selectedFeatures.id),

                        "data": {"longitude": breakPoint.x, "latitude": breakPoint.y}

                    }
                    //结束编辑状态
                    shapeCtrl.stopEditing();
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        var info=null;
                        if (data.errcode==0) {
                            var sinfo={
                                "op":"打断link成功",
                                "type":"",
                                "pid": ""
                            };
                            data.data.log.unshift(sinfo);
                            info=data.data.log;
                        }else{
                            info=[{
                                "op":data.errcode,
                                "type":data.errmsg,
                                "pid": data.errid
                            }];
                        }
                        resetPage();
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }

                    })
                } else if (shapeCtrl.editType === "transformDirect") {
                    var disFromStart, disFromEnd, node, direct, pointOfArrow,
                        feature = selectCtrl.selectedFeatures;
                    var startPoint = feature.geometry[0],
                        point = feature.point;
                    if (link) {
                        if (link.flag) {
                            console.log(link.angle);
                            var directOfLink = {
                                "objStatus": "UPDATE",
                                "pid": link.pid,
                                "direct": parseInt(link.orientation)
                            };
                            var paramOfDirect = {
                                "type": "RDLINK",
                                "command": "UPDATE",
                                "projectId": 11,
                                "data": directOfLink
                            };
                            Application.functions.saveLinkGeometry(JSON.stringify(paramOfDirect), function (data) {
                                objEditCtrl.data.data["direct"] = link.orientation;
                                if (objEditCtrl.updateObject !== "") {
                                    objEditCtrl.updateObject();
                                }
                            });
                            resetPage();
                            return;
                        } else {
                            pointOfArrow = link.pointForDirect;
                            var pointOfContainer = map.latLngToContainerPoint([point.y, point.x]);
                            startPoint = map.latLngToContainerPoint([startPoint[1], startPoint[0]]);
                            disFromStart = distance(pointOfContainer, startPoint);
                            disFromEnd = distance(pointOfArrow, startPoint);
                            if (disFromStart > disFromEnd) {
                                direct = 2;
                            } else {
                                direct = 3;
                            }
                        }

                    } else {
                        direct = feature.direct
                    }

                    var parameter = {
                        "command": "CREATE",
                        "type": "RDSPEEDLIMIT",
                        "projectId": 11,
                        "data": {
                            "direct": direct,
                            "linkPid": parseInt(feature.id),
                            "longitude": point.x,
                            "latitude": point.y
                        }
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(parameter), function (data) {
                        var info=null;
                        if (data.errcode === -1) {
                            info=[{
                                "op":data.errcode,
                                "type":data.errmsg,
                                "pid": data.errid
                            }];
                            outPutCtrl.pushOutput(info);
                            if (outPutCtrl.updateOutPuts !== "") {
                                outPutCtrl.updateOutPuts();
                            }
                            return;
                        }

                        selectCtrl.selectedFeatures = null;
                        shapeCtrl.shapeEditorResult.setFinalGeometry(null);

                        if (data.errcode==0) {
                            var sinfo={
                                "op":"修改交限成功",
                                "type":"",
                                "pid": ""
                            };
                            data.data.log.unshift(sinfo);
                            info=data.data.log;
                        }else{
                            info=[{
                                "op":data.errcode,
                                "type":data.errmsg,
                                "pid": data.errid
                            }];
                        }
                        speedlimitlayer.redraw();
                        resetPage();
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }
                        Application.functions.getRdObjectById(data.data.pid, "RDSPEEDLIMIT", function (data) {
                            objEditCtrl.setCurrentObject(data.data);
                            ocLazyLoad.load('ctrl/speedLimitCtrl').then(function () {
                                scope.objectEditURL = "js/tepl/speedLimitTepl.html";
                            });
                        });
                    })

                } else if (shapeCtrl.editType === "pathVertexReMove" || shapeCtrl.editType === "pathVertexInsert" || shapeCtrl.editType === "pathVertexMove") {
                    if (coordinate.length !== 0) {
                        coordinate.length = 0;
                    }
                    if (link) {
                        for (var index in link.components) {
                            coordinate.push([link.components[index].x, link.components[index].y]);
                        }
                        var param = {
                            "command": "UPDATE",
                            "type": "RDLINK",
                            "projectId": 11,
                            "data": {
                                "pid": parseInt(selectCtrl.selectedFeatures.id),
                                "objStatus": "UPDATE",
                                "geometry": {"type": "LineString", "coordinates": coordinate}
                            }
                        }
                        //结束编辑状态
                        shapeCtrl.stopEditing();
                        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                            var info =null;
                            if (data.errcode==0) {
                                var sinfo={
                                    "op":"修改道路link成功",
                                    "type":"",
                                    "pid": ""
                                };
                                data.data.log.unshift(sinfo);
                                info=data.data.log;
                            }else{
                                info=[{
                                    "op":data.errcode,
                                    "type":data.errmsg,
                                    "pid": data.errid
                                }];
                            }
                            resetPage();
                            outPutCtrl.pushOutput(info);
                            if (outPutCtrl.updateOutPuts !== "") {
                                outPutCtrl.updateOutPuts();
                            }

                        })
                    }
                } else if (shapeCtrl.editType === "pathNodeMove") {
                    var options = selectCtrl.selectedFeatures;
                    var param = {
                        "command": "MOVE",
                        "type": "RDNODE",
                        "objId": options.id,
                        "projectId": 11,
                        "data": {longitude: options.latlng.lng, latitude: options.latlng.lat}
                    }
                    //结束编辑状态
                    shapeCtrl.stopEditing();
                    Application.functions.saveNodeMove(JSON.stringify(param), function (data) {
                        var info=null;
                        if (data.errcode === -1) {
                                info=[{
                                    "op":data.errcode,
                                    "type":data.errmsg,
                                    "pid": data.errid
                                }];

                            outPutCtrl.pushOutput(info);
                            if (outPutCtrl.updateOutPuts !== "") {
                                outPutCtrl.updateOutPuts();
                            }
                            return;
                        }
                        if (data.errcode==0) {
                            var sinfo={
                                "op":"移动link成功",
                                "type":"",
                                "pid": ""
                            };
                            data.data.log.unshift(sinfo);
                            info=data.data.log;
                        }else{
                            info=[{
                                "op":data.errcode,
                                "type":data.errmsg,
                                "pid": data.errid
                            }];
                        }
                        resetPage();
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }
                        //Application.functions.getRdObjectById(data.data.pid, "RDCROSS", function (data) {
                        //    objEditCtrl.setCurrentObject(data.data);
                        //    ocLazyLoad.load('ctrl/rdCrossCtrl').then(function () {
                        //        scope.objectEditURL = "js/tepl/rdCrossTepl.html";
                        //    });
                        //});
                    })
                }
                else if (shapeCtrl.editType === "pointVertexAdd") {

                    var param = {
                        "command": "BREAK",
                        "type": "RDLINK",
                        "projectId": 11,
                        "objId": parseInt(selectCtrl.selectedFeatures.id),

                        "data": {"longitude": link.x, "latitude": link.y}

                    }
                    //结束编辑状态
                    shapeCtrl.stopEditing();
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        var info=null;
                        if (data.errcode==0) {
                            var sinfo={
                                "op":"插入点成功",
                                "type":"",
                                "pid": ""
                            };
                            data.data.log.unshift(sinfo);
                            info=data.data.log;
                        }else{
                            info=[{
                                "op":data.errcode,
                                "type":data.errmsg,
                                "pid": data.errid
                            }];
                        }
                        resetPage();
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }

                    })
                } else if (shapeCtrl.editType === "rdBranch") {
                    var paramOfRdBranch = {
                        "command": "CREATE",
                        "type": "RDBRANCH",
                        "projectId": 11,
                        "data": featCodeCtrl.getFeatCode()
                    };
                    Application.functions.saveLinkGeometry(JSON.stringify(paramOfRdBranch), function (data) {

                        var pids = [];
                        pids.push({id: data.data.pid});
                        checkCtrl.setCheckResult(data);
                        //清空上一次的操作
                        map.currentTool.cleanHeight();
                        map.currentTool.disable();
                        var info = null;
                        if (data.errcode==0) {
                            var sinfo={
                                "op":"修改RDBRANCH成功",
                                "type":"",
                                "pid": ""
                            };
                            data.data.log.unshift(sinfo);
                            info=data.data.log;
                        }else{
                            info=[{
                                "op":data.errcode,
                                "type":data.errmsg,
                                "pid": data.errid
                            }];
                        }
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }
                        toolTipsCtrl.onRemoveTooltip();


                        objEditCtrl.setCurrentObject(pids);
                        if (objEditCtrl.updateObject !== "") {
                            objEditCtrl.updateObject();
                        }
                        ocLazyLoad.load('ctrl/rdBanchCtrl').then(function () {
                            scope.objectEditURL = "js/tepl/rdBranchTep.html";
                        })
                    })


                }
                else if (shapeCtrl.editType === "linksOfCross") {
                    var options = selectCtrl.selectedFeatures;
                    var param = {
                        "command": "CREATE",
                        "type": "RDCROSS",
                        "projectId": 11,
                        "data": options
                    }
                    //结束编辑状态
                    shapeCtrl.stopEditing();
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {

                        if (data.errcode === -1) {
                                info=[{
                                    "op":data.errcode,
                                    "type":data.errmsg,
                                    "pid": data.errid
                                }];

                            outPutCtrl.pushOutput(data.errmsg);
                            if (outPutCtrl.updateOutPuts !== "") {
                                outPutCtrl.updateOutPuts();
                            }
                            return;
                        }
                        var info = null;
                        if (data.errcode==0) {
                            var sinfo={
                                "op":"修改RDCROSS成功",
                                "type":"",
                                "pid": ""
                            };
                            data.data.log.unshift(sinfo);
                            info=data.data.log;
                        }else{
                            info=[{
                                "op":data.errcode,
                                "type":data.errmsg,
                                "pid": data.errid
                            }];
                        }
                        resetPage();
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }
                        Application.functions.getRdObjectById(data.data.pid, "RDCROSS", function (data) {
                            objEditCtrl.setCurrentObject(data.data);
                            ocLazyLoad.load('ctrl/rdCrossCtrl').then(function () {
                                scope.objectEditURL = "js/tepl/rdCrossTepl.html";
                            });
                        });
                    })
                }
            }
        });
}
