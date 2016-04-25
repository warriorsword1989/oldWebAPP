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
            var selectCtrl = fastmap.uikit.SelectController();
            var editLayer = layerCtrl.getLayerById('edit');
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
            }
            function resetPage(data) {
                if (typeof map.currentTool.cleanHeight === "function") {
                    map.currentTool.cleanHeight();
                }
                if (toolTipsCtrl.getCurrentTooltip()) {
                    toolTipsCtrl.onRemoveTooltip();
                }
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

            function treatmentOfChanged(data,id, type, op, ctrl, tpl, detailId) {
                var info = null;
                //结束编辑状态
                shapeCtrl.stopEditing();
                if (data.errcode == 0) {
                    var sInfo = {
                        "op": op,
                        "type": "",
                        "pid": ""
                    };
                    data.data.log.push(sInfo);
                    info = data.data.log;
                    if (ctrl) {
                        objEditCtrl.setOriginalData(null);
                        Application.functions.getRdObjectById(id, type, function (data) {
                            objEditCtrl.setCurrentObject(type, data.data);
                            ocLazyLoad.load('components/road/ctrls/' + ctrl).then(function () {
                                scope.attrTplContainer = '../../scripts/components/road/tpls/' + tpl;
                            })
                        }, detailId);
                    }

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
            }

            if (event.keyCode == 32) {
                if (coordinate.length !== 0) {
                    coordinate.length = 0;
                }
                var param = {};
                if (geo&&geo.components) {
                    for (var index = 0, len = geo.components.length; index < len; index++) {
                        coordinate.push([geo.components[index].x, geo.components[index].y]);
                    }
                }
                if (shapeCtrl.editType === 'drawpath') {
                    param = {
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
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById('referenceLine').redraw();
                        treatmentOfChanged(data,data.data.pid,"RDLINK", "创建道路link成功", 'attr_link_ctrl/rdLinkCtrl', 'attr_link_tpl/rdLinkTpl.html'
                        )
                    })

                } else if (shapeCtrl.editType === 'drawAdLink') {
                    param = {
                        "command": "CREATE",
                        "type": "ADLINK",
                        "projectId": Application.projectid,
                        "data": {
                            "eNodePid": properties.enodePid ? properties.enodePid : 0,
                            "sNodePid": properties.snodePid ? properties.snodePid : 0,
                            "geometry": {"type": "LineString", "coordinates": coordinate},
                            'catchLinks': properties.catches
                        }
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("adLink").redraw();
                        treatmentOfChanged(data,data.data.pid, fastmap.dataApi.GeoLiveModelType.ADLINK, "创建AdLink成功", 'attr_administratives_ctrl/adLinkCtrl', 'attr_adminstratives_tpl/adLinkTpl.html')
                    });
                } else if (shapeCtrl.editType === "rdrestricton") {
                    param = {
                        "command": "CREATE",
                        "type": "RDRESTRICTION",
                        "projectId": Application.projectid,
                        "data": featCodeCtrl.getFeatCode()
                    };
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("restriction").redraw();
                        //清空上一次的操作
                        map.currentTool.disable();
                        treatmentOfChanged(data,data.data.pid, "RDRESTRICTION", "创建交限成功", 'attr_restriction_ctrl/rdRestriction', 'attr_restrict_tpl/rdRestricOfOrdinaryTpl.html')

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
                    param = {
                        "command": "BREAK",
                        "type": "RDLINK",
                        "projectId": Application.projectid,
                        "objId": parseInt(selectCtrl.selectedFeatures.id),
                        "data": {"longitude": breakPoint.x, "latitude": breakPoint.y}

                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("referenceLine").redraw();
                        treatmentOfChanged(data,data.data.pid, "RDLINK", "打断link成功");
                    })
                } else if (shapeCtrl.editType === "transformDirect") {
                    var disFromStart, disFromEnd, direct, pointOfArrow,
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
                            param = {
                                "type": "RDLINK",
                                "command": "UPDATE",
                                "projectId": Application.projectid,
                                "data": directOfLink
                            };
                            Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                                treatmentOfChanged(data,data.data.pid, fastmap.dataApi.GeoLiveModelType.RDLINK, "修改link道路方向成功");
                                if (data.errcode === 0) {
                                    objEditCtrl.data["direct"] = geo.orientation;
                                    objEditCtrl.setCurrentObject("RDLINK", objEditCtrl.data);
                                    scope.$apply();
                                    layerCtrl.getLayerById("referenceLine").redraw();
                                }

                            });
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

                    param = {
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
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        selectCtrl.selectedFeatures = null;
                        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                        layerCtrl.getLayerById("speedlimit").redraw();
                        treatmentOfChanged(data,data.data.pid,"RDSPEEDLIMIT", "创建RDSPEEDLIMIT成功", 'attr_speedLimit_ctrl/speedLimitCtrl', 'attr_speedLimit_ctrl/speedLimitTpl.html');
                    })

                } else if (shapeCtrl.editType === "pathVertexMove" || shapeCtrl.editType === "pathVertexInsert" || shapeCtrl.editType === "pathVertexMove") {
                    if (geo) {
                        var snapObj = selectCtrl.getSnapObj();
                        var interLinks = (snapObj && snapObj.interLinks.length != 0) ? snapObj.interLinks : [];
                        var interNodes = (snapObj && snapObj.interNodes.length != 0) ? snapObj.interNodes : [];
                        param = {
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
                        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                            layerCtrl.getLayerById("referenceLine").redraw();
                            treatmentOfChanged(data,data.data.pid, "RDLINK", "修改道路link成功");

                        })
                    }
                } else if (shapeCtrl.editType === "pathNodeMove") {
                    param = {
                        "command": "MOVE",
                        "type": "RDNODE",
                        "projectId": Application.projectid,
                        "objId": options.id,
                        "data": {
                            longitude: selectCtrl.selectedFeatures.latlng.lng,
                            latitude: selectCtrl.selectedFeatures.latlng.lat
                        }
                    }
                    Application.functions.saveNodeMove(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("referenceLine").redraw();
                        treatmentOfChanged(data,data.data.pid,"RDLINK", "移动link成功");
                    })
                }
                else if (shapeCtrl.editType === "pointVertexAdd") {
                    param = {
                        "command": "BREAK",
                        "type": "RDLINK",
                        "projectId": Application.projectid,
                        "objId": parseInt(selectCtrl.selectedFeatures.id),

                        "data": {"longitude": geo.x, "latitude": geo.y}
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("referenceLine").redraw();
                        treatmentOfChanged(data,data.data.pid, "RDLINK", "插入点成功");

                    })
                } else if (shapeCtrl.editType === "rdBranch") {
                    param = {
                        "command": "CREATE",
                        "type": "RDBRANCH",
                        "projectId": Application.projectid,
                        "data": featCodeCtrl.getFeatCode()
                    };
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("highSpeedDivergence").redraw();
                        treatmentOfChanged(data,"", "RDBRANCH", "创建RDBRANCH成功", 'attr_branch_ctrl/rdBranchCtrl', 'attr_branch_Tpl/namesOfBranch.html', data.data.pid);
                    })


                }
                else if (shapeCtrl.editType === "RDCROSS") {
                    param = {
                        "command": "CREATE",
                        "type": "RDCROSS",
                        "projectId": Application.projectid,
                        "data": selectCtrl.selectedFeatures
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("rdcross").redraw();
                        treatmentOfChanged(data,data.data.pid, "RDCROSS", "创建RDCROSS成功", 'attr_cross_ctrl/rdCrossCtrl', 'attr_cross_tpl/rdCrossTpl.html');


                    })
                } else if (shapeCtrl.editType === "rdlaneConnexity") {
                    var laneData = objEditCtrl.originalData["inLaneInfoArr"],
                        laneInfo = objEditCtrl.originalData["laneConnexity"];
                    var laneStr = "";
                    if (laneData.length === 0) {
                        laneStr = laneData[0];
                    } else {
                        laneStr = laneData.join(",");
                    }
                    laneInfo["laneInfo"] = laneStr;
                    param = {
                        "command": "CREATE",
                        "type":"RDLANECONNEXITY",
                        "projectId": Application.projectid,
                        "data": laneInfo
                    };
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("rdlaneconnexity").redraw();
                        treatmentOfChanged(data,data.data.pid, "RDLANECONNEXITY", "创建车信成功", 'attr_connexity_ctrl/rdLaneConnexityCtrl', 'attr_connexity_tpl/rdLaneConnexityTpl.html');
                    })

                }
                else if (shapeCtrl.editType === 'drawPolygon') {
                    coordinate.push([geo.components[0].x, geo.components[0].y]);
                    var test = [];
                    test.push(coordinate);
                    param = {
                        "command": "CREATE",
                        "type": "ADFACE",
                        "projectId": Application.projectid,
                        "data": {
                            "geometry": {"type": "Polygon", "coordinates": test}
                        }
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("adface").redraw();
                        treatmentOfChanged(data,data.data.pid, "ADFACE", "创建行政区划面成功", 'attr_administratives_ctrl/adFaceCtrl', 'attr_adminstratives_tpl/adFaceTpl.html');
                    })
                }
                else if (shapeCtrl.editType === "RDGSC") {
                    param = {
                        "command": "CREATE",
                        "type": "RDGSC",
                        "projectId": Application.projectid,
                        "data": selectCtrl.selectedFeatures
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("adface").redraw();
                        treatmentOfChanged(data,data.data.pid, "RDGSC", "创建RDGSC成功", 'attr_rdgsc_ctrl/rdGscCtrl', 'attr_gsc_tpl/rdGscTpl.html');
                    })
                }

            }
        });
}
