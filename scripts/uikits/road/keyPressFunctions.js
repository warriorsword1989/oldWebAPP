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
            var highRenderCtrl = fastmap.uikit.HighRenderController();
            var editLayer = layerCtrl.getLayerById('edit');
            var geo = shapeCtrl.shapeEditorResult.getFinalGeometry();
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
                if (map.currentTool.snapHandler) {
                    map.currentTool.snapHandler._enabled = true;
                    map.currentTool.snapHandler.snaped = false;
                }
                map.currentTool._enabled = true;
                map.currentTool.disable();
                if (toolTipsCtrl.getCurrentTooltip()) {
                    toolTipsCtrl.onRemoveTooltip();
                }
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                layerCtrl.getLayerById("referenceLine").clearAllEventListeners();
                layerCtrl.getLayerById("adLink").clearAllEventListeners();
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
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
            function treatmentOfChanged(data, type, op, ctrl, tpl) {
                var info = null, id;
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
                        if (type === "RDBRANCH") {
                            var detailId = data.data.pid;
                            id = "";
                        } else {
                            id = data.data.pid;
                        }
                        objEditCtrl.setOriginalData(null);
                        Application.functions.getRdObjectById(id, type, function (data) {
                            objEditCtrl.setCurrentObject(type, data.data);
                            ocLazyLoad.load('components/road/ctrls/' + ctrl).then(function () {
                                scope.attrTplContainer = '../../scripts/components/road/tpls/' + tpl;
                            })
                        }, detailId);
                    }else{
                        if(shapeCtrl.editType==="pathBreak") {
                                scope.$emit("SWITCHCONTAINERSTATE", {
                                    "attrContainerTpl": false,
                                    "subAttrContainerTpl": false
                                });
                            ocLazyLoad.load('components/road/ctrls/blank_ctrl/blankCtrl').then(function () {
                                scope.attrTplContainer = '../../scripts/components/road/tpls/blank_tpl/blankTpl.html';
                            })
                                scope.$apply();
                        }
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
                if (geo && geo.components) {
                    for (var index = 0, len = geo.components.length; index < len; index++) {
                        coordinate.push([geo.components[index].x, geo.components[index].y]);
                    }
                }
                if (shapeCtrl.editType === 'drawPath') {
                    var properties = shapeCtrl.shapeEditorResult.getProperties();
                    var showContent, ctrl, tpl, type;
                    param["command"] = "CREATE";
                    param["projectId"] = Application.projectid;
                    param["data"] = {
                        "eNodePid": properties.enodePid ? properties.enodePid : 0,
                        "sNodePid": properties.snodePid ? properties.snodePid : 0,
                        "geometry": {"type": "LineString", "coordinates": coordinate},
                        'catchLinks': properties.catches
                    }
                    if (shapeCtrl.editFeatType === "rdLink") {
                        param["type"] = "RDLINK";
                        showContent = "创建道路link成功";
                        ctrl = 'attr_link_ctrl/rdLinkCtrl';
                        tpl = 'attr_link_tpl/rdLinkTpl.html';

                    } else if (shapeCtrl.editFeatType === "adLink") {
                        param["type"] = "ADLINK";
                        showContent = "创建AdLink成功";
                        ctrl = 'attr_administratives_ctrl/adLinkCtrl';
                        tpl = 'attr_adminstratives_tpl/adLinkTpl.html';
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        if (param["type"] === "RDLINK") {
                            layerCtrl.getLayerById("referenceLine").redraw();
                            layerCtrl.getLayerById("referenceNode").redraw();
                        } else if (param["type"] === "ADLINK") {
                            layerCtrl.getLayerById("adLink").redraw();
                            layerCtrl.getLayerById("adnode").redraw();
                        }
                        treatmentOfChanged(data, param["type"], showContent, ctrl, tpl)
                    })

                } else if (shapeCtrl.editType === "addRestriction") {
                    var laneData = objEditCtrl.originalData["inLaneInfoArr"],
                        laneInfo = objEditCtrl.originalData["limitRelation"];
                    var laneStr = "";
                    if (laneData.length === 0) {
                        laneStr = laneData[0];
                    } else {
                        laneStr = laneData.join(",");
                    }
                    laneInfo["infos"] = laneStr;
                    param = {
                        "command": "CREATE",
                        "type": "RDRESTRICTION",
                        "projectId": Application.projectid,
                        "data": laneInfo
                    };
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("restriction").redraw();
                        map.currentTool.disable();
                        treatmentOfChanged(data, "RDRESTRICTION", "创建交限成功",
                            'attr_restriction_ctrl/rdRestriction', 'attr_restrict_tpl/rdRestricOfOrdinaryTpl.html')
                    })

                } else if (shapeCtrl.editType === "pathBreak") {
                    var breakPoint = null, breakPathContent, ctrl, tpl;
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
                    param["command"] = "BREAK";
                    param["projectId"] = Application.projectid;
                    param["objId"] = parseInt(selectCtrl.selectedFeatures.id);
                    param["data"] = {"longitude": breakPoint.x, "latitude": breakPoint.y};
                    if (shapeCtrl.editFeatType === "rdLink") {
                        param["type"] = "RDLINK";
                        breakPathContent = "打断rdLink成功";

                    } else if (shapeCtrl.editFeatType === "adLink") {
                        param["type"] = "ADLINK";
                        breakPathContent = "打断adLink成功";
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        if (param["type"] === "RDLINK") {
                            layerCtrl.getLayerById("referenceLine").redraw();
                            layerCtrl.getLayerById("referenceNode").redraw();
                        } else if (param["type"] === "ADLINK") {
                            layerCtrl.getLayerById("adLink").redraw();
                            layerCtrl.getLayerById("adnode").redraw();
                        }
                        treatmentOfChanged(data, param["type"], breakPathContent);

                    })
                } else if (shapeCtrl.editType === "transformDirect") {
                    var disFromStart, disFromEnd, direct, pointOfArrow,
                        feature = selectCtrl.selectedFeatures;
                    var startPoint = feature.geometry[0],
                        point = feature.point;
                    if (geo) {
                        if (!geo.flag) {
                            var directOfLink = {
                                "objStatus": "UPDATE",
                                "pid": selectCtrl.selectedFeatures.id,
                                "direct": parseInt(selectCtrl.selectedFeatures.direct)
                            };
                            param = {
                                "type": "RDLINK",
                                "command": "UPDATE",
                                "projectId": Application.projectid,
                                "data": directOfLink
                            };
                            Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                                treatmentOfChanged(data, fastmap.dataApi.GeoLiveModelType.RDLINK, "修改link道路方向成功");
                                if (data.errcode === 0) {
                                    layerCtrl.getLayerById("referenceLine").redraw();
                                    layerCtrl.getLayerById("referenceNode").redraw();
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
                        direct = feature.direct;
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
                        treatmentOfChanged(data, "RDSPEEDLIMIT", "创建RDSPEEDLIMIT成功",
                            'attr_speedLimit_ctrl/speedLimitCtrl', 'attr_speedLimit_tpl/speedLimitTpl.html');
                    })

                } else if (shapeCtrl.editType === "pathVertexReMove"
                    || shapeCtrl.editType === "pathVertexInsert"
                    || shapeCtrl.editType === "pathVertexMove") {
                    if (geo) {
                        var repairContent, ctrl, tpl;
                        param["command"] = "REPAIR";
                        param["projectId"] = Application.projectid;
                        param["objId"] = parseInt(selectCtrl.selectedFeatures.id);
                        var snapObj = selectCtrl.getSnapObj();
                        var interLinks = (snapObj && snapObj.interLinks.length != 0) ? snapObj.interLinks : [];
                        var interNodes = (snapObj && snapObj.interNodes.length != 0) ? snapObj.interNodes : [];
                        param["data"] = {
                            "geometry": {"type": "LineString", "coordinates": coordinate},
                            "interLinks": interLinks,
                            "interNodes": interNodes
                        }

                        if (shapeCtrl.editFeatType === "rdLink") {
                            repairContent = "修改道路rdLink成功";
                            param["type"] = "RDLINK";
                            ctrl = 'attr_link_ctrl/rdLinkCtrl';
                            tpl = 'attr_link_tpl/rdLinkTpl.html';
                        } else if (shapeCtrl.editFeatType === "adLink") {
                            repairContent = "修改道路adLink成功";
                            param["type"] = "ADLINK";
                            ctrl = 'attr_administratives_ctrl/adLinkCtrl';
                            tpl = 'attr_adminstratives_tpl/adLinkTpl.html';
                        }
                        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                            if (param["type"] === "RDLINK") {
                                layerCtrl.getLayerById("referenceLine").redraw();
                                layerCtrl.getLayerById("referenceNode").redraw();
                            } else if (param["type"] === "ADLINK") {
                                layerCtrl.getLayerById("adLink").redraw();
                                layerCtrl.getLayerById("adface").redraw();
                                layerCtrl.getLayerById("adnode").redraw();
                            }
                            treatmentOfChanged(data, param["type"], repairContent, ctrl, tpl);

                        })
                    }
                } else if (shapeCtrl.editType === "pathNodeMove") {
                    param["command"] = "MOVE";
                    param["projectId"] = Application.projectid;
                    param["objId"] = selectCtrl.selectedFeatures.id;
                    param["data"] = {
                        longitude: selectCtrl.selectedFeatures.latlng.lng,
                        latitude: selectCtrl.selectedFeatures.latlng.lat
                    };
                    if (shapeCtrl.editFeatType === "rdLink") {
                        param ["type"] = "RDNODE";
                    } else if (shapeCtrl.editFeatType === "adLink") {
                        param ["type"] = "ADNODE";
                    }
                    Application.functions.saveNodeMove(JSON.stringify(param), function (data) {
                        if (param ["type"] === "RDNODE") {
                            layerCtrl.getLayerById("referenceLine").redraw();
                            layerCtrl.getLayerById("referenceNode").redraw();
                        } else if (param ["type"] === "ADNODE") {
                            layerCtrl.getLayerById("adLink").redraw();
                            layerCtrl.getLayerById("adnode").redraw();
                            layerCtrl.getLayerById("adface").redraw();
                        }
                        treatmentOfChanged(data, param ["type"], "移动link成功");
                    })
                } else if (shapeCtrl.editType === "pointVertexAdd") {
                    var ctrl, tpl;
                    param["command"] = "BREAK";
                    param["projectId"] = Application.projectid;
                    param["objId"] = parseInt(selectCtrl.selectedFeatures.id);
                    param["data"] = {"longitude": geo.x, "latitude": geo.y};
                    if (shapeCtrl.editFeatType === "rdLink") {
                        param ["type"] = "RDLINK";
                    } else if (shapeCtrl.editFeatType === "adLink") {
                        param ["type"] = "ADLINK";
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        if (param["type"] === "RDLINK") {
                            layerCtrl.getLayerById("referenceLine").redraw();
                            layerCtrl.getLayerById("referenceNode").redraw();
                        } else {
                            layerCtrl.getLayerById("adLink").redraw();
                            layerCtrl.getLayerById("adnode").redraw();
                        }
                        treatmentOfChanged(data, param["type"], "插入点成功");
                    })
                } else if (shapeCtrl.editType === "addRdBranch") {
                    param = {
                        "command": "CREATE",
                        "type": "RDBRANCH",
                        "projectId": Application.projectid,
                        "data": featCodeCtrl.getFeatCode()
                    };
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("highSpeedDivergence").redraw();
                        treatmentOfChanged(data, "RDBRANCH", "创建RDBRANCH成功",
                            'attr_branch_ctrl/rdBranchCtrl', 'attr_branch_Tpl/namesOfBranch.html');
                    })
                } else if (shapeCtrl.editType === "addRdCross") {
                    param = {
                        "command": "CREATE",
                        "type": "RDCROSS",
                        "projectId": Application.projectid,
                        "data": selectCtrl.selectedFeatures
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("rdcross").redraw();
                        treatmentOfChanged(data, "RDCROSS", "创建RDCROSS成功",
                            'attr_cross_ctrl/rdCrossCtrl', 'attr_cross_tpl/rdCrossTpl.html');
                    })
                } else if (shapeCtrl.editType === "addRdLaneConnexity") {
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
                        "type": "RDLANECONNEXITY",
                        "projectId": Application.projectid,
                        "data": laneInfo
                    };
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("rdlaneconnexity").redraw();
                        treatmentOfChanged(data, "RDLANECONNEXITY", "创建车信成功",
                            'attr_connexity_ctrl/rdLaneConnexityCtrl', 'attr_connexity_tpl/rdLaneConnexityTpl.html');
                    })

                } else if (shapeCtrl.editType === 'drawPolygon') {
                    coordinate.push([geo.components[0].x, geo.components[0].y]);
                    param = {
                        "command": "CREATE",
                        "type": "ADFACE",
                        "projectId": Application.projectid,
                        "data": {
                            "geometry": {"type": "LineString", "coordinates": coordinate}
                        }
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("adface").redraw();
                        layerCtrl.getLayerById("adLink").redraw();
                        treatmentOfChanged(data, "ADFACE", "创建行政区划面成功",
                            'attr_administratives_ctrl/adFaceCtrl', 'attr_adminstratives_tpl/adFaceTpl.html');
                    })
                } else if (shapeCtrl.editType === "addRdGsc") {
                    param = {
                        "command": "CREATE",
                        "type": "RDGSC",
                        "projectId": Application.projectid,
                        "data": selectCtrl.selectedFeatures
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("rdGsc").redraw();
                        layerCtrl.getLayerById("referenceLine").redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures.length = 0;
                        treatmentOfChanged(data, "RDGSC", "创建RDGSC成功",
                            'attr_rdgsc_ctrl/rdGscCtrl', 'attr_gsc_tpl/rdGscTpl.html');
                    })
                } else if (shapeCtrl.editType === "addAdAdmin") {
                    param = {
                        "command": "CREATE",
                        "type": "ADADMIN",
                        "projectId": Application.projectid,
                        "data": {
                            "longitude": geo.x,
                            "latitude": geo.y,
                            "linkPid": parseInt(selectCtrl.selectedFeatures.id)
                        }
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("adAdmin").redraw();
                        treatmentOfChanged(data, "ADADMIN", "创建ADADMIN成功",
                            'attr_administratives_ctrl/adAdminCtrl', 'attr_adminstratives_tpl/adAdminTpl.html');
                    })
                } else if (shapeCtrl.editType === "adAdminMove") {
                    param = {
                        "command": "MOVE",
                        "type": "ADADMIN",
                        "projectId": Application.projectid,
                        "objId": selectCtrl.selectedFeatures.id,
                        "data": {
                            "longitude": geo.x,
                            "latitude": geo.y,
                            "linkPid": parseInt(selectCtrl.selectedFeatures.linkPid)
                        }
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("adAdmin").redraw();
                        treatmentOfChanged(data, "ADADMIN", "创建ADADMIN成功",
                            'attr_administratives_ctrl/adAdminCtrl', 'attr_adminstratives_tpl/adAdminTpl.html');
                    })
                } else if (shapeCtrl.editType === "pathBuffer") {
                    this.transform = new fastmap.mapApi.MecatorTranform();
                    var scale = this.transform.scale(map);
                    var linkWidth = parseFloat(geo.linkWidth * scale);
                    linkWidth = linkWidth.toFixed(1);
                    var linkIds = selectCtrl.selectedFeatures.id;
                    param = {
                        "command": "UPDOWNDEPART",
                        "type": "RDLINK",
                        "projectId": Application.projectid,
                        "distance": linkWidth,
                        "data": {
                            "linkPids": linkIds
                        }
                    }
                    Application.functions.saveUpAndDown(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("referenceLine").redraw();
                        layerCtrl.getLayerById("referenceNode").redraw();
                        treatmentOfChanged(data, "RDLINK", "创建上下线分离成功", 'attr_link_ctrl/rdLinkCtrl', 'attr_link_tpl/rdLinkTpl.html');
                    })
                } else if (shapeCtrl.editType === "addAdFaceLine") {
                    var adLinksArr = selectCtrl.selectedFeatures.adLinks;
                    param = {
                        "command": "CREATE",
                        "type": "ADFACE",
                        "linkType": "ADLINK",
                        "projectId": Application.projectid,
                        "data": {
                            "linkPids": adLinksArr
                        }
                    }
                    Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                        layerCtrl.getLayerById("adface").redraw();
                        layerCtrl.getLayerById("adLink").redraw();
                        treatmentOfChanged(data, "ADFACE", "创建行政区划面成功",
                            'attr_administratives_ctrl/adFaceCtrl', 'attr_adminstratives_tpl/adFaceTpl.html');
                    })
                }
            }
        });
}
