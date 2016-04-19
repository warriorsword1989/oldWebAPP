/**
 * Created by liwanchong on 2015/12/11.
 */

function keyEvent(ocLazyLoad, scope) {
    $(document).bind('keydown',
        function (event) {
            //取消
            var layerCtrl = fastmap.uikit.LayerController();
            var outPutCtrl = fastmap.uikit.OutPutController();
            var featCodeCtrl = fastmap.uikit.FeatCodeController();

            var toolTipsCtrl = fastmap.uikit.ToolTipsController();
            var shapeCtrl = fastmap.uikit.ShapeEditorController();
            var objEditCtrl = fastmap.uikit.ObjectEditController();
            var checkCtrl = fastmap.uikit.CheckResultController();
            var selectCtrl = fastmap.uikit.SelectController();
            var rdLink = layerCtrl.getLayerById('referenceLine');
            var restrict = layerCtrl.getLayerById('restriction');
            var rdCross = layerCtrl.getLayerById('rdcross');
            var speedlimitlayer = layerCtrl.getLayerById('speedlimit');
            var rdBranch = layerCtrl.getLayerById("highSpeedDivergence");
            var editLayer = layerCtrl.getLayerById('edit');
            var rdlaneconnexity = layerCtrl.getLayerById('rdlaneconnexity');
            var geo = shapeCtrl.shapeEditorResult.getFinalGeometry();

            var properties = shapeCtrl.shapeEditorResult.getProperties();
            var coordinate = [];
            if (event.keyCode == 27) {
                resetPage();
                map._container.style.cursor = '';
            }


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
                shapeCtrl.stopEditing();
                editLayer.bringToBack();
                $(editLayer.options._div).unbind();
                scope.changeBtnClass("");
                scope.$apply();
                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                editLayer.clear();

            }

            if (event.keyCode == 32) {
                if (shapeCtrl.editType === 'drawPath') {
                    if (coordinate.length !== 0) {
                        coordinate.length = 0;
                    }
                    for (var index = 0, len = geo.components.length; index < len; index++) {
                        coordinate.push([geo.components[index].x, geo.components[index].y]);
                    }
                    var paramOfLink = {
                        "command": "CREATE",
                        "type": "RDLINK",
                        "projectId": Application.projectid,
                        "data": {
                            "eNodePid": properties.enodePid ? properties.enodePid : 0,
                            "sNodePid": properties.snodePid ? properties.snodePid : 0,
                            "geometry": {"type": "LineString", "coordinates": coordinate},
                            'catchLinks': properties.catches
                        }
                    }
                    //结束编辑状态
                    shapeCtrl.stopEditing();
                    Application.functions.saveLinkGeometry(JSON.stringify(paramOfLink), function (data) {
                        var info = null;
                        if (data.errcode == 0) {
                            var sInfo = {
                                "op": "创建道路link成功",
                                "type": "",
                                "pid": ""
                            };
                            data.data.log.push(sInfo);
                            info = data.data.log;
                            Application.functions.getRdObjectById(data.data.pid, "RDLINK", function (data) {
                                objEditCtrl.setCurrentObject("RDLINK", data.data);
                                ocLazyLoad.load('ctrl/attr_link_ctrl/rdLinkCtrl').then(function () {
                                    scope.attrTplContainer = "../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html";
                                })
                            });
                        } else {
                            info = [{
                                "op": data.errcode,
                                "type": data.errmsg,
                                "pid": data.errid
                            }];
                            swal("操作失败", data.errmsg, "error");
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
                        "type": "RDRESTRICTION",
                        "projectId": Application.projectid,
                        "data": featCodeCtrl.getFeatCode()
                    };
                    Application.functions.saveLinkGeometry(JSON.stringify(paramOfRestrict), function (data) {
                        checkCtrl.setCheckResult(data);
                        //清空上一次的操作
                        map.currentTool.cleanHeight();
                        map.currentTool.disable();
                        var info = null;
                        if (data.errcode == 0) {
                            var sinfo = {
                                "op": "创建交限成功",
                                "type": "",
                                "pid": ""
                            };
                            data.data.log.push(sinfo);
                            info = data.data.log;
                            var pid = data.data.pid;
                            restrict.redraw();
                            Application.functions.getRdObjectById(pid, "RDRESTRICTION", function (data) {
                                if (!scope.panelFlag) {
                                    scope.panelFlag = true;
                                }
                                objEditCtrl.setCurrentObject("RDRESTRICTION", data.data);
                                ocLazyLoad.load('ctrl/attr_restriction_ctrl/rdRestriction').then(function () {
                                    scope.attrTplContainer = "../../scripts/components/road/tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html";
                                })
                            })
                        } else {
                            info = [{
                                "op": data.errcode,
                                "type": data.errmsg,
                                "pid": data.errid
                            }];
                            swal("操作失败", data.errmsg, "error");
                        }
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }
                        toolTipsCtrl.onRemoveTooltip();
                    });
                } else if (shapeCtrl.editType === "pathBreak") {
                    var breakPoint = null;
                    for (var item in geo.components) {
                        if (!_contains(geo.components[item], shapeCtrl.shapeEditorResult.getOriginalGeometry().points)) {
                            breakPoint = geo.components[item];
                        }

                    }
                    if (breakPoint == null) {
                        shapeCtrl.stopEditing();
                        resetPage();
                        return;
                    }
                    var param = {
                        "command": "BREAK",
                        "type": "RDLINK",
                        "projectId": Application.projectid,
                        "objId": parseInt(selectCtrl.selectedFeatures.id),

                        "data": {"longitude": breakPoint.x, "latitude": breakPoint.y}

                    }
                    //结束编辑状态
                    shapeCtrl.stopEditing();
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        var info = null;
                        if (data.errcode == 0) {
                            var sinfo = {
                                "op": "打断link成功",
                                "type": "",
                                "pid": ""
                            };
                            data.data.log.push(sinfo);
                            info = data.data.log;
                        } else {
                            info = [{
                                "op": data.errcode,
                                "type": data.errmsg,
                                "pid": data.errid
                            }];
                            swal("操作失败", data.errmsg, "error");
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
                    if (geo) {
                        if (geo.flag) {
                            var directOfLink = {
                                "objStatus": "UPDATE",
                                "pid": geo.pid,
                                "direct": parseInt(geo.orientation)
                            };
                            var paramOfDirect = {
                                "type": "RDLINK",
                                "command": "UPDATE",
                                "projectId": Application.projectid,
                                "data": directOfLink
                            };
                            Application.functions.saveLinkGeometry(JSON.stringify(paramOfDirect), function (data) {
                                var info = [];
                                if (data.errcode === 0) {
                                    var sinfo = {
                                        "op": "修改link道路方向成功",
                                        "type": "",
                                        "pid": ""
                                    };
                                    data.data.log.push(sinfo);
                                    info = data.data.log;
                                    objEditCtrl.data["direct"] = geo.orientation;
                                    objEditCtrl.setOriginalData(null);
                                    objEditCtrl.setCurrentObject("RDLINK", objEditCtrl.data);
                                    scope.$apply();
                                    rdLink.redraw();
                                } else {
                                    info = [{
                                        "op": data.errcode,
                                        "type": data.errmsg,
                                        "pid": data.errid
                                    }];
                                    swal("操作失败", data.errmsg, "error");
                                }
                                outPutCtrl.pushOutput(info);
                                if (outPutCtrl.updateOutPuts !== "") {
                                    outPutCtrl.updateOutPuts();
                                }
                            });
                            resetPage();
                            return;
                        } else {
                            pointOfArrow = geo.pointForDirect;
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
                        "projectId": Application.projectid,
                        "data": {
                            "direct": direct,
                            "linkPid": parseInt(feature.id),
                            "longitude": point.x,
                            "latitude": point.y
                        }
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(parameter), function (data) {
                        var info = null;
                        selectCtrl.selectedFeatures = null;
                        shapeCtrl.shapeEditorResult.setFinalGeometry(null);

                        if (data.errcode == 0) {
                            Application.functions.getRdObjectById(data.data.pid, "RDSPEEDLIMIT", function (data) {
                                if (!scope.panelFlag) {
                                    scope.panelFlag = true;
                                    scope.objectFlag = true;
                                }
                                objEditCtrl.setCurrentObject("RDSPEEDLIMIT", data.data);
                                ocLazyLoad.load('ctrl/attr_speedLimit_ctrl/speedLimitCtrl').then(function () {
                                    scope.attrTplContainer = "../../scripts/components/road/tpls/attr_speedLimit_ctrl/speedLimitTpl.html";
                                });
                            });
                            var sinfo = {
                                "op": "创建RDSPEEDLIMIT成功",
                                "type": "",
                                "pid": ""
                            };
                            data.data.log.push(sinfo);
                            info = data.data.log;
                        } else {
                            info = [{
                                "op": data.errcode,
                                "type": data.errmsg,
                                "pid": data.errid
                            }];
                            swal("操作失败", data.errmsg, "error");
                        }
                        speedlimitlayer.redraw();
                        resetPage();
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }

                    })

                } else if (shapeCtrl.editType === "pathVertexReMove" || shapeCtrl.editType === "pathVertexInsert" || shapeCtrl.editType === "pathVertexMove") {
                    if (coordinate.length !== 0) {
                        coordinate.length = 0;
                    }
                    if (geo) {
                        for (var index in geo.components) {
                            coordinate.push([geo.components[index].x, geo.components[index].y]);
                        }
                        var snapObj = selectCtrl.getSnapObj();
                        var interLinks = (snapObj && snapObj.interLinks.length != 0) ? snapObj.interLinks : [];
                        var interNodes = (snapObj && snapObj.interNodes.length != 0) ? snapObj.interNodes : [];
                        var param = {
                            "command": "REPAIR",
                            "type": "RDLINK",
                            "projectId": Application.projectid,
                            "objId": parseInt(selectCtrl.selectedFeatures.id),
                            "data": {
                                "geometry": {"type": "LineString", "coordinates": coordinate},
                                "interLinks": interLinks,
                                "interNodes": interNodes
                            }
                        }
                        //结束编辑状态
                        shapeCtrl.stopEditing();
                        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                            var info = null;
                            if (data.errcode == 0) {
                                var sinfo = {
                                    "op": "修改道路link成功",
                                    "type": "",
                                    "pid": ""
                                };
                                data.data.log.push(sinfo);
                                info = data.data.log;
                            } else {
                                info = [{
                                    "op": data.errcode,
                                    "type": data.errmsg,
                                    "pid": data.errid
                                }];
                                swal("操作失败", data.errmsg, "error");
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
                        "projectId": Application.projectid,
                        "data": {longitude: options.latlng.lng, latitude: options.latlng.lat}
                    }
                    //结束编辑状态
                    shapeCtrl.stopEditing();
                    Application.functions.saveNodeMove(JSON.stringify(param), function (data) {
                        var info = null;
                        if (data.errcode == 0) {
                            var sinfo = {
                                "op": "移动link成功",
                                "type": "",
                                "pid": ""
                            };
                            data.data.log.push(sinfo);
                            info = data.data.log;
                        } else {
                            info = [{
                                "op": data.errcode,
                                "type": data.errmsg,
                                "pid": data.errid
                            }];
                            swal("操作失败", data.errmsg, "error");
                        }
                        resetPage();
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }
                    })
                }
                else if (shapeCtrl.editType === "pointVertexAdd") {

                    var param = {
                        "command": "BREAK",
                        "type": "RDLINK",
                        "projectId": Application.projectid,
                        "objId": parseInt(selectCtrl.selectedFeatures.id),

                        "data": {"longitude": geo.x, "latitude": geo.y}

                    }
                    //结束编辑状态
                    shapeCtrl.stopEditing();
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        var info = null;
                        if (data.errcode == 0) {
                            var sinfo = {
                                "op": "插入点成功",
                                "type": "",
                                "pid": ""
                            };
                            data.data.log.push(sinfo);
                            info = data.data.log;
                        } else {
                            info = [{
                                "op": data.errcode,
                                "type": data.errmsg,
                                "pid": data.errid
                            }];
                            swal("操作失败", data.errmsg, "error");
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
                        "projectId": Application.projectid,
                        "data": featCodeCtrl.getFeatCode()
                    };
                    Application.functions.saveLinkGeometry(JSON.stringify(paramOfRdBranch), function (data) {

                        checkCtrl.setCheckResult(data);
                        //清空上一次的操作
                        map.currentTool.cleanHeight();
                        map.currentTool.disable();
                        var info = null;
                        if (data.errcode == 0) {
                            var sinfo = {
                                "op": "创建RDBRANCH成功",
                                "type": "",

                                "pid": ""
                            };
                            data.data.log.push(sinfo);
                            info = data.data.log;
                            rdBranch.redraw();
                            Application.functions.getRdObjectById("", "RDBRANCH", function (data) {
                                if (!scope.panelFlag) {
                                    scope.panelFlag = true;
                                }
                                objEditCtrl.setCurrentObject("RDBRANCH", data.data);
                                ocLazyLoad.load('components/road/ctrls/attr_branch_ctrl/rdBranchCtrl').then(function () {
                                    scope.attrTplContainer = "../../scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html";
                                })
                            }, data.data.pid)
                        } else {
                            info = [{
                                "op": data.errcode,
                                "type": data.errmsg,
                                "pid": data.errid
                            }];
                            swal("操作失败", data.errmsg, "error");
                        }
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }
                        toolTipsCtrl.onRemoveTooltip();
                    })


                }
                else if (shapeCtrl.editType === "linksOfCross") {
                    var options = selectCtrl.selectedFeatures;
                    var param = {
                        "command": "CREATE",
                        "type": "RDCROSS",
                        "projectId": Application.projectid,
                        "data": options
                    }
                    //结束编辑状态
                    shapeCtrl.stopEditing();
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        var info = null;
                        if (data.errcode === -1) {
                            info = [{
                                "op": data.errcode,
                                "type": data.errmsg,
                                "pid": data.errid
                            }];
                            swal("操作失败", data.errmsg, "error");
                        } else {
                            Application.functions.getRdObjectById(data.data.pid, "RDCROSS", function (data) {
                                if (!scope.panelFlag) {
                                    scope.panelFlag = true;
                                    scope.objectFlag = true;
                                }
                                objEditCtrl.setCurrentObject("RDCROSS", data.data);
                                ocLazyLoad.load('ctrl/attr_cross_ctrl/rdCrossCtrl').then(function () {
                                    scope.attrTplContainer = "../../scripts/components/road/tpls/attr_cross_tpl/rdCrossTpl.html";
                                });
                            });
                            var sInfo = {
                                "op": "创建RDCROSS成功",
                                "type": "",
                                "pid": ""
                            };
                            data.data.log.push(sInfo);
                            info = data.data.log;
                        }
                        resetPage();
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }

                    })
                } else if (shapeCtrl.editType === "rdlaneConnexity") {
                    //清空上一次的操作
                    map.currentTool.cleanHeight();
                    map.currentTool.disable();
                    var laneData = objEditCtrl.originalData["inLaneInfoArr"],
                        laneInfo = objEditCtrl.originalData["laneConnexity"];
                    var laneStr = "";
                    if (laneData.length === 0) {
                        laneStr = laneData[0];
                    } else {
                        laneStr = laneData.join(",");
                    }
                    laneInfo["laneInfo"] = laneStr;
                    var param = {
                        "command": "CREATE",
                        "type": "RDLANECONNEXITY",
                        "projectId": Application.projectid,
                        "data": laneInfo
                    };
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        var info = [];
                        if (data.errcode === -1) {
                            info = [{
                                "op": data.errcode,
                                "type": data.errmsg,
                                "pid": data.errid
                            }];
                            swal("操作失败", data.errmsg, "error");
                        } else {
                            objEditCtrl.setOriginalData(null);
                            rdlaneconnexity.redraw();
                            if (scope.suspendFlag) {
                                scope.suspendFlag = false;
                            }
                            Application.functions.getRdObjectById(data.data.pid, "RDLANECONNEXITY", function (data) {
                                objEditCtrl.setCurrentObject("RDLANECONNEXITY", data.data);
                                ocLazyLoad.load("ctrl/attr_connexity_ctrl/rdLaneConnexityCtrl").then(function () {
                                    scope.attrTplContainer = "../../scripts/components/road/tpls/attr_connexity_tpl/rdLaneConnexityTpl.html";
                                });
                            });
                            var sinfo = {
                                "op": "创建车信成功",
                                "type": "",
                                "pid": ""
                            };
                            data.data.log.push(sinfo);
                            info = data.data.log;
                        }
                        resetPage();
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }


                    })

                }

                else if (shapeCtrl.editType === 'drawPolygon') {
                    if (coordinate.length !== 0) {
                        coordinate.length = 0;
                    }
                    for (var index = 0, len = geo.components.length; index < len; index++) {
                        coordinate.push([geo.components[index].x, geo.components[index].y]);
                    }
                    var paramOfPolygon = {
                        "command": "CREATE",
                        "type": "ADFACE",
                        "projectId": Application.projectid,
                        "data": {

                            "geometry": {"type": "Polygon", "coordinates": coordinate}

                        }
                    }
                    //结束编辑状态
                    shapeCtrl.stopEditing();
                    Application.functions.saveLinkGeometry(JSON.stringify(paramOfPolygon), function (data) {
                            var info = null;
                            if (data.errcode == 0) {
                                var sInfo = {
                                    "op": "创建行政区划面成功",
                                    "type": "",
                                    "pid": ""
                                };
                                data.data.log.push(sInfo);
                                info = data.data.log;
                                //Application.functions.getRdObjectById(data.data.pid, "RDLINK", function (data) {
                                //    objEditCtrl.setCurrentObject("RDLINK", data.data);
                                //    ocLazyLoad.load('ctrl/attr_link_ctrl/rdLinkCtrl').then(function () {
                                //        scope.attrTplContainer = "../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html";
                                //    })
                                //});
                            }
                        }
                    )
                }

                else if (shapeCtrl.editType === "overpass") {
                    var options = selectCtrl.selectedFeatures;
                    var param = {
                        "command": "CREATE",
                        "type": "RDGSC",
                        "projectId": Application.projectid,
                        "data": options
                    }
                    //结束编辑状态
                    shapeCtrl.stopEditing();
                    console.log(param)
                     Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                         var info = null;
                         if (data.errcode === -1) {
                             info = [{
                                 "op": data.errcode,
                                 "type": data.errmsg,
                                 "pid": data.errid
                             }];
                             swal("操作失败", data.errmsg, "error");
                         } else {
                             Application.functions.getRdObjectById(data.data.pid, "RDGSC", function (data) {
                                 if (!scope.panelFlag) {
                                     scope.panelFlag = true;
                                     scope.objectFlag = true;
                                 }
                                 objEditCtrl.setCurrentObject("RDGSC", data.data);
                                 ocLazyLoad.load('ctrl/attr_rdgsc_ctrl/rdGscCtrl').then(function () {
                                    scope.attrTplContainer = "jsl/attr_gsc_tpl/rdGscTpl.html";
                                 });
                             });
                             var sInfo = {
                                 "op": "RDGSC",
                                 "type": "",
                                 "pid": ""
                             };
                             data.data.log.push(sInfo);
                             info = data.data.log;
                         }
                         resetPage();
                         outPutCtrl.pushOutput(info);
                         if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                         }

                     })
                }



            }
        });
}
