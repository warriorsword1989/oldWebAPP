/**
 * Created by liwanchong on 2015/12/11.
 */
function bindHotKeys(ocLazyLoad, scope, dsEdit, appPath) {
    $(document).bind('keydown', function(event) {
        //取消
        var layerCtrl = fastmap.uikit.LayerController();
        var outPutCtrl = fastmap.uikit.OutPutController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var evtCtrl = fastmap.uikit.EventController();
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
        //是否包含点;
        function _contains(point, components) {
            var boolExit = false;
            for (var i in components) {
                if (point.x == components[i].x && point.y == components[i].y) {
                    boolExit = true;
                }
            }
            return boolExit;
        }
        //返回两点之间的距离;
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
            if(map.currentTool.rwEvent) {
                map.currentTool.rwEvent.disable();
            }
            if (toolTipsCtrl.getCurrentTooltip()) {
                toolTipsCtrl.onRemoveTooltip();
            }
            if (map.floatMenu) {
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            //layerCtrl.getLayerById("rdLink").clearAllEventListeners();
            //layerCtrl.getLayerById("adLink").clearAllEventListeners();
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures.length = 0;
            editLayer.drawGeometry = null;
            shapeCtrl.stopEditing();
            editLayer.bringToBack();
            $(editLayer.options._div).unbind();
            scope.changeBtnClass("");
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            editLayer.clear();
        }

        function treatmentOfChanged(data, type, op, ctrl, tpl, branchType, rowid_deatailId) {
            var id;
            //结束编辑状态
            shapeCtrl.stopEditing();
            if (ctrl) {
                if (type != "IXPOI") {
                    if (type === "RDBRANCH") {
                        id = "";
                    } else if (type === "ADFACE" || type === "ZONEFACE") {
                        for (var i = 0; i < data.log.length; i++) {
                            if (data.log[i].type == "ADFACE" || data.log[i].type == "ZONEFACE") {
                                id = data.log[i].pid;
                                break;
                            }
                        }
                    } else {
                        id = data.pid;
                    }
                    //objEditCtrl.setOriginalData(null);
                    //根据不同的分歧类型加载数据面板;
                    if (typeof branchType === 'undefined') {
                        dsEdit.getByPid(id, type).then(function(data) {
                            objEditCtrl.setCurrentObject(type, data);
                            ocLazyLoad.load(appPath.road + 'ctrls/' + ctrl).then(function() {
                                scope.attrTplContainer = appPath.root + appPath.road + 'tpls/' + tpl;
                            })
                        });
                    } else if (branchType === 5 || branchType === 7) {
                        dsEdit.getBranchByRowId(rowid_deatailId, branchType).then(function(data) {
                            objEditCtrl.setCurrentObject(type, data);
                            ocLazyLoad.load(appPath.road + 'ctrls/' + ctrl).then(function() {
                                scope.attrTplContainer = appPath.root + appPath.road + 'tpls/' + tpl;
                            })
                        });
                    } else {
                        dsEdit.getBranchByDetailId(rowid_deatailId, branchType).then(function(data) {
                            objEditCtrl.setCurrentObject(type, data);
                            ocLazyLoad.load(appPath.road + 'ctrls/' + ctrl).then(function() {
                                scope.attrTplContainer = appPath.root + appPath.road + 'tpls/' + tpl;
                            })
                        });
                    }
                    scope.$emit("SWITCHCONTAINERSTATE", {
                        "attrContainerTpl": true,
                        "subAttrContainerTpl": false
                    });
                } else {
                    dsEdit.getByPid(data.pid, "IXPOI").then(function(rest) {
                        if (rest) {
                            objEditCtrl.setCurrentObject('IXPOI', rest);
                            objEditCtrl.setOriginalData(objEditCtrl.data.getIntegrate());
                            scope.$emit("transitCtrlAndTpl", {
                                "loadType": "tipsTplContainer",
                                "propertyCtrl": appPath.poi + "ctrls/attr-tips/poiPopoverTipsCtl",
                                "propertyHtml": appPath.root + appPath.poi + "tpls/attr-tips/poiPopoverTips.html"
                            });
                            scope.$emit("transitCtrlAndTpl", {
                                "loadType": "attrTplContainer",
                                "propertyCtrl": appPath.poi + "ctrls/attr-base/generalBaseCtl",
                                "propertyHtml": appPath.root + appPath.poi + "tpls/attr-base/generalBaseTpl.html"
                            });
                            scope.$emit("highLightPoi", rest.pid);
                        }
                    });
                }
            } else {
                if (shapeCtrl.editType === "pathBreak") {
                    scope.$emit("SWITCHCONTAINERSTATE", {
                        "attrContainerTpl": false,
                        "subAttrContainerTpl": false
                    });
                    ocLazyLoad.load(appPath.road + 'ctrls/blank_ctrl/blankCtrl').then(function() {
                        scope.attrTplContainer = appPath.root + appPath.road + 'tpls/blank_tpl/blankTpl.html';
                    });
                    // scope.$apply();
                }
            }
            resetPage();
            //outPutCtrl.pushOutput(info);
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
                if (map.currentTool._enabled) {
                    swal("操作失败", "请双击结束增加线段", "error");
                    var info = [{
                        "op": -1,
                        "type": "请双击结束画线",
                        "pid": 0
                    }];
                    outPutCtrl.pushOutput(info);
                    if (outPutCtrl.updateOutPuts !== "") {
                        outPutCtrl.updateOutPuts();
                    }
                } else {
                    var properties = shapeCtrl.shapeEditorResult.getProperties();
                    var showContent, ctrl, tpl, type;
                    param["command"] = "CREATE";
                    param["dbId"] = App.Temp.dbId;
                    param["data"] = {
                        "eNodePid": properties.enodePid ? properties.enodePid : 0,
                        "sNodePid": properties.snodePid ? properties.snodePid : 0,
                        "geometry": {
                            "type": "LineString",
                            "coordinates": coordinate
                        },
                        'catchLinks': properties.catches
                    };
                    if (shapeCtrl.editFeatType === "RDLINK") {
                        param["type"] = "RDLINK";
                        showContent = "创建道路link成功";
                        ctrl = 'attr_link_ctrl/rdLinkCtrl';
                        tpl = 'attr_link_tpl/rdLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "adLink") {
                        param["type"] = "ADLINK";
                        showContent = "创建AdLink成功";
                        ctrl = 'attr_administratives_ctrl/adLinkCtrl';
                        tpl = 'attr_adminstratives_tpl/adLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "rwLink") {
                        param["type"] = "RWLINK";
                        showContent = "创建rwLink成功";
                        ctrl = 'attr_link_ctrl/rwLinkCtrl';
                        tpl = 'attr_link_tpl/rwLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "zoneLink") {
                        param["type"] = "ZONELINK";
                        showContent = "创建zoneLink成功";
                        ctrl = 'attr_zone_ctrl/zoneLinkCtrl';
                        tpl = 'attr_zone_tpl/zoneLinkTpl.html';
                    }
                    dsEdit.save(param).then(function(data) {
                        if (param["type"] === "RDLINK") {
                            layerCtrl.getLayerById("rdLink").redraw();
                            layerCtrl.getLayerById("rdNode").redraw();
                        } else if (param["type"] === "ADLINK") {
                            layerCtrl.getLayerById("adLink").redraw();
                            layerCtrl.getLayerById("adNode").redraw();
                        } else if (param["type"] === "RWLINK") {
                            layerCtrl.getLayerById("rwLink").redraw();
                            layerCtrl.getLayerById("rwNode").redraw();
                        } else if (param["type"] === "ZONELINK") {
                            layerCtrl.getLayerById("zoneLink").redraw();
                            layerCtrl.getLayerById("zoneNode").redraw();
                        }
                        treatmentOfChanged(data, param["type"], showContent, ctrl, tpl)
                    })
                }
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
                    "dbId": App.Temp.dbId,
                    "data": laneInfo
                };
                dsEdit.save(param).then(function(data) {
                    layerCtrl.getLayerById("relationData").redraw();
                    map.currentTool.disable();
                    treatmentOfChanged(data, "RDRESTRICTION", "创建交限成功", 'attr_restriction_ctrl/rdRestriction', 'attr_restrict_tpl/rdRestricOfOrdinaryTpl.html')
                })
            } else if (shapeCtrl.editType === "pathBreak") {
                var breakPoint = null,
                    breakPathContent, ctrl, tpl;
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
                param["dbId"] = App.Temp.dbId;
                param["objId"] = parseInt(selectCtrl.selectedFeatures.id);
                param["data"] = {
                    "longitude": breakPoint.x,
                    "latitude": breakPoint.y
                };
                if (shapeCtrl.editFeatType === "RDLINK") {
                    param["type"] = "RDLINK";
                    breakPathContent = "打断rdLink成功";
                } else if (shapeCtrl.editFeatType === "ADLINK") {
                    param["type"] = "ADLINK";
                    breakPathContent = "打断adLink成功";
                } else if (shapeCtrl.editFeatType === "RWLINK") {
                    param["type"] = "RWLINK";
                    breakPathContent = "打断rwLink成功";
                } else if (shapeCtrl.editFeatType === "ZONELINK") {
                    param["type"] = "ZONELINK";
                    breakPathContent = "打断rwLink成功";
                }
                dsEdit.save(param).then(function(data) {
                    if (param["type"] === "RDLINK") {
                        layerCtrl.getLayerById("rdLink").redraw();
                        layerCtrl.getLayerById("rdNode").redraw();
                    } else if (param["type"] === "ADLINK") {
                        layerCtrl.getLayerById("adLink").redraw();
                        layerCtrl.getLayerById("adNode").redraw();
                    } else if (param["type"] === "RWLINK") {
                        layerCtrl.getLayerById("rwLink").redraw();
                        layerCtrl.getLayerById("rwNode").redraw();
                    } else if (param["type"] === "ZONELINK") {
                        layerCtrl.getLayerById("zoneLink").redraw();
                        layerCtrl.getLayerById("zoneNode").redraw();
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
                            "dbId": App.Temp.dbId,
                            "data": directOfLink
                        };
                        dsEdit.save(param).then(function(data) {
                            treatmentOfChanged(data, fastmap.dataApi.GeoLiveModelType.RDLINK, "修改link道路方向成功");
                            if (data.errcode === 0) {
                                layerCtrl.getLayerById("rdLink").redraw();
                                layerCtrl.getLayerById("rdNode").redraw();
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
                    "dbId": App.Temp.dbId,
                    "data": {
                        "direct": direct,
                        "linkPid": parseInt(feature.id),
                        "longitude": point.x,
                        "latitude": point.y
                    }
                };
                dsEdit.save(param).then(function(data) {
                    selectCtrl.selectedFeatures = null;
                    shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                    layerCtrl.getLayerById("relationData").redraw();
                    treatmentOfChanged(data, "RDSPEEDLIMIT", "创建RDSPEEDLIMIT成功", 'attr_speedLimit_ctrl/speedLimitCtrl', 'attr_speedLimit_tpl/speedLimitTpl.html');
                })
            } else if (shapeCtrl.editType === "pathVertexReMove" || shapeCtrl.editType === "pathVertexInsert" || shapeCtrl.editType === "pathVertexMove") {
                if (geo) {
                    var repairContent, ctrl, tpl;
                    param["command"] = "REPAIR";
                    param["dbId"] = App.Temp.dbId;
                    param["objId"] = parseInt(selectCtrl.selectedFeatures.id);
                    var snapObj = selectCtrl.getSnapObj();
                    var interLinks = (snapObj && snapObj.interLinks.length != 0) ? snapObj.interLinks : [];
                    var interNodes = (snapObj && snapObj.interNodes.length != 0) ? snapObj.interNodes : [];
                    param["data"] = {
                        "geometry": {
                            "type": "LineString",
                            "coordinates": coordinate
                        },
                        "interLinks": interLinks,
                        "interNodes": interNodes
                    };
                    if (shapeCtrl.editFeatType === "RDLINK") {
                        repairContent = "修改道路rdLink成功";
                        param["type"] = "RDLINK";
                        ctrl = 'attr_link_ctrl/rdLinkCtrl';
                        tpl = 'attr_link_tpl/rdLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "ADLINK") {
                        repairContent = "修改道路adLink成功";
                        param["type"] = "ADLINK";
                        ctrl = 'attr_administratives_ctrl/adLinkCtrl';
                        tpl = 'attr_adminstratives_tpl/adLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "RWLINK") {
                        repairContent = "修改铁路rwLink成功";
                        param["type"] = "RWLINK";
                        ctrl = 'attr_link_ctrl/rwLinkCtrl';
                        tpl = 'attr_link_tpl/rwLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "ZONELINK") {
                        repairContent = "修改zoneLink成功";
                        param["type"] = "ZONELINK";
                        ctrl = 'attr_zone_ctrl/zoneLinkCtrl';
                        tpl = 'attr_zone_tpl/zoneLinkTpl.html';
                    }
                    dsEdit.save(param).then(function(data) {
                        if (param["type"] === "RDLINK") {
                            layerCtrl.getLayerById("rdLink").redraw();
                            layerCtrl.getLayerById("rdNode").redraw();
                        } else if (param["type"] === "ADLINK") {
                            layerCtrl.getLayerById("adLink").redraw();
                            layerCtrl.getLayerById("adFace").redraw();
                            layerCtrl.getLayerById("adNode").redraw();
                        } else if (param["type"] === "RWLINK") {
                            layerCtrl.getLayerById("rwLink").redraw();
                            layerCtrl.getLayerById("rwNode").redraw();
                        } else if (param["type"] === "ZONELINK") {
                            layerCtrl.getLayerById("zoneLink").redraw();
                            layerCtrl.getLayerById("zoneFace").redraw();
                        }
                        treatmentOfChanged(data, param["type"], "移动link成功");
                    })
                }
            } else if (shapeCtrl.editType === "pathNodeMove") {
                param["command"] = "MOVE";
                param["dbId"] = App.Temp.dbId;
                param["objId"] = selectCtrl.selectedFeatures.id;
                param["data"] = {
                    longitude: selectCtrl.selectedFeatures.latlng.lng,
                    latitude: selectCtrl.selectedFeatures.latlng.lat
                };
                // if (shapeCtrl.editFeatType === "rdLink") {
                //     param ["type"] = "RDNODE";
                // } else if (shapeCtrl.editFeatType === "adLink") {
                //     param ["type"] = "ADNODE";
                // } else if(shapeCtrl.editFeatType == "rwNode") {
                //  param ["type"] = "RWNODE";
                // } else if(shapeCtrl.editFeatType == "zoneLink") {
                //     param ["type"] = "ZONENODE";
                // }
                // modified by chenx
                param["type"] = shapeCtrl.editFeatType;
                dsEdit.save(param).then(function(data) {
                    if (param["type"] === "RDNODE") {
                        layerCtrl.getLayerById("rdLink").redraw();
                        layerCtrl.getLayerById("rdNode").redraw();
                    } else if (param["type"] === "ADNODE") {
                        layerCtrl.getLayerById("adLink").redraw();
                        layerCtrl.getLayerById("adNode").redraw();
                        layerCtrl.getLayerById("adFace").redraw();
                    } else if (param["type"] === "RWNODE") {
                        layerCtrl.getLayerById("rwLink").redraw();
                        layerCtrl.getLayerById("rwNode").redraw();
                    } else if (param["type"] === "ZONENODE") {
                        layerCtrl.getLayerById("zoneLink").redraw();
                        layerCtrl.getLayerById("zoneNode").redraw();
                    } else if (param["type"] === "ZONENODE") {
                        layerCtrl.getLayerById("zoneLink").redraw();
                        layerCtrl.getLayerById("zoneNode").redraw();
                        layerCtrl.getLayerById("zoneFace").redraw();
                    }
                    treatmentOfChanged(data, param["type"], "移动link成功");
                })
            } else if (shapeCtrl.editType === "pointVertexAdd") {
                var ctrl, tpl;
                param["command"] = "CREATE";
                param["dbId"] = App.Temp.dbId;
                param["objId"] = parseInt(selectCtrl.selectedFeatures.id);
                param["data"] = {
                    "longitude": geo.x,
                    "latitude": geo.y
                };
                // if (shapeCtrl.editFeatType === "rdLink") {
                //     param["type"] = "RDLINK";
                // } else if (shapeCtrl.editFeatType === "adLink") {
                //     param["type"] = "ADLINK";
                // } else if (shapeCtrl.editFeatType === "rwLink") {
                //     param["type"] = "RWLINK";
                // } else if (shapeCtrl.editFeatType === "rwNode") {
                //     param["type"] = "RWNODE";
                // } else if (shapeCtrl.editFeatType === "zoneLink") {
                //     param["type"] = "ZONENODE";
                // }
                // modified by chenx
                param["type"] = shapeCtrl.editFeatType;
                dsEdit.save(param).then(function(data) {
                    if (param["type"] === "RDLINK") {
                        layerCtrl.getLayerById("rdLink").redraw();
                        layerCtrl.getLayerById("rdNode").redraw();
                    } else if (param["type"] === "RWNODE") {
                        layerCtrl.getLayerById("rwLink").redraw();
                        layerCtrl.getLayerById("rwNode").redraw();
                    } else if (param["type"] === "ADNODE") {
                        layerCtrl.getLayerById("adLink").redraw();
                        layerCtrl.getLayerById("adNode").redraw();
                    } else {
                        layerCtrl.getLayerById("zoneLink").redraw();
                        layerCtrl.getLayerById("zoneNode").redraw();
                    }
                    treatmentOfChanged(data, param["type"], "插入点成功");
                })
            } else if (shapeCtrl.editType === "BRANCH") {
                var param = {
                    "data": featCodeCtrl.getFeatCode()
                };
                var ctrl = tpl = ''
                dsEdit.create("RDBRANCH", param.data).then(function(data) {
                    layerCtrl.getLayerById("relationData").redraw();
                    //只有5（实景图）或7（连续分歧）的时候传rowId;
                    var rowId_detialId = (param.data.branchType == 5 || param.data.branchType == 7) ? data.log[0].rowId : data.pid;
                    //获取当前的ctrl和tpl的对象
                    var ctrlAndtplObj = getCtrlAndTpl(param.data.branchType);
                    treatmentOfChanged(data, "RDBRANCH", "创建RDBRANCH成功", ctrlAndtplObj.ctrl, ctrlAndtplObj.tpl, param.data.branchType, rowId_detialId);
                });
            } else if (shapeCtrl.editType === "UPDATEBRANCH") {
                //当前修改的分歧的类型;
                var tempType = featCodeCtrl.getFeatCode().branchType;
                //当前分歧的pid;
                var currentDataId = featCodeCtrl.getFeatCode().childId;
                //删除编辑不需要的数据;
                delete featCodeCtrl.getFeatCode().branchType;
                delete featCodeCtrl.getFeatCode().childId;
                //调用编辑接口;
                dsEdit.updateTopo(featCodeCtrl.getFeatCode().nodePid, "RDBRANCH", featCodeCtrl.getFeatCode()).then(function(data) {
                    layerCtrl.getLayerById("relationData").redraw();
                    //获取当前的ctrl和tpl的对象
                    var ctrlAndtplObj = getCtrlAndTpl(tempType);
                    treatmentOfChanged(data, "RDBRANCH", "编辑RDBRANCH成功", ctrlAndtplObj.ctrl, ctrlAndtplObj.tpl, tempType, currentDataId);
                })
            } else if (shapeCtrl.editType === "addRdCross") {
                param = {
                    "command": "CREATE",
                    "type": "RDCROSS",
                    "dbId": App.Temp.dbId,
                    "data": selectCtrl.selectedFeatures
                }
                dsEdit.save(param).then(function(data) {
                    layerCtrl.getLayerById("relationData").redraw();
                    treatmentOfChanged(data, "RDCROSS", "创建RDCROSS成功", 'attr_cross_ctrl/rdCrossCtrl', 'attr_cross_tpl/rdCrossTpl.html');
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
                    "dbId": App.Temp.dbId,
                    "data": laneInfo
                };
                dsEdit.save(param).then(function(data) {
                    layerCtrl.getLayerById("relationData").redraw();
                    treatmentOfChanged(data, "RDLANECONNEXITY", "创建车信成功", 'attr_connexity_ctrl/rdLaneConnexityCtrl', 'attr_connexity_tpl/rdLaneConnexityTpl.html');
                })
            } else if (shapeCtrl.editType === 'drawPolygon') {
                coordinate.push([geo.components[0].x, geo.components[0].y]);
                if (shapeCtrl.editFeatType == 'adFace') {
                    param = {
                        "command": "CREATE",
                        "type": "RDLANECONNEXITY",
                        "dbId": App.Temp.dbId,
                        "data": laneInfo
                    };
                    dsEdit.save(param).then(function(data) {
                        layerCtrl.getLayerById("relationData").redraw();
                        treatmentOfChanged(data, "RDLANECONNEXITY", "创建车信成功", 'attr_connexity_ctrl/rdLaneConnexityCtrl', 'attr_connexity_tpl/rdLaneConnexityTpl.html');
                    })
                } else if (shapeCtrl.editType === 'drawPolygon') {
                    coordinate.push([geo.components[0].x, geo.components[0].y]);
                    if (shapeCtrl.editFeatType == 'adFace') {
                        param = {
                            "command": "CREATE",
                            "type": "ADFACE",
                            "dbId": App.Temp.dbId,
                            "data": {
                                "geometry": {
                                    "type": "LineString",
                                    "coordinates": coordinate
                                }
                            }
                        };
                        dsEdit.save(param).then(function(data) {
                            layerCtrl.getLayerById("adnode").redraw();
                            layerCtrl.getLayerById("adface").redraw();
                            layerCtrl.getLayerById("adLink").redraw();
                            treatmentOfChanged(data, "ADFACE", "创建行政区划面成功", 'attr_administratives_ctrl/adFaceCtrl', 'attr_adminstratives_tpl/adFaceTpl.html');
                        });
                    } else if (shapeCtrl.editFeatType == 'zoneFace') {
                        param = {
                            "command": "CREATE",
                            "type": "ZONEFACE",
                            "dbId": App.Temp.dbId,
                            "data": {
                                "geometry": {
                                    "type": "LineString",
                                    "coordinates": coordinate
                                }
                            }
                        };
                        dsEdit.save(param).then(function(data) {
                            layerCtrl.getLayerById("zoneNode").redraw();
                            layerCtrl.getLayerById("zoneFace").redraw();
                            layerCtrl.getLayerById("zoneLink").redraw();
                            treatmentOfChanged(data, "ZONEFACE", "创建行政区划面成功", 'attr_zone_ctrl/zoneFaceCtrl', 'attr_zone_tpl/zoneFaceTpl.html');
                        });
                    }
                } else if (shapeCtrl.editType === "addRdGsc") {
                    param = {
                        "command": "CREATE",
                        "type": "RDGSC",
                        "dbId": App.Temp.dbId,
                        "data": selectCtrl.selectedFeatures
                    };
                    dsEdit.save(param).then(function(data) {
                        layerCtrl.getLayerById("relationData").redraw();
                        layerCtrl.getLayerById("rdLink").redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures.length = 0;
                        treatmentOfChanged(data, "RDGSC", "创建RDGSC成功", 'attr_rdgsc_ctrl/rdGscCtrl', 'attr_gsc_tpl/rdGscTpl.html');
                    })
                } else if (shapeCtrl.editType === "addAdAdmin") {
                    param = {
                        "command": "CREATE",
                        "type": "ADADMIN",
                        "dbId": App.Temp.dbId,
                        "data": {
                            "longitude": geo.x,
                            "latitude": geo.y,
                            "linkPid": parseInt(selectCtrl.selectedFeatures.id)
                        }
                    };
                    dsEdit.save(param).then(function(data) {
                        layerCtrl.getLayerById("adAdmin").redraw();
                        treatmentOfChanged(data, "ADADMIN", "创建ADADMIN成功", 'attr_administratives_ctrl/adAdminCtrl', 'attr_adminstratives_tpl/adAdminTpl.html');
                    })
                } else if (shapeCtrl.editType === "adAdminMove") {
                    param = {
                        "command": "MOVE",
                        "type": "ADADMIN",
                        "dbId": App.Temp.dbId,
                        "objId": selectCtrl.selectedFeatures.id,
                        "data": {
                            "longitude": geo.x,
                            "latitude": geo.y,
                            "linkPid": (selectCtrl.selectedFeatures.linkPid == null ? 0 : parseInt(selectCtrl.selectedFeatures.linkPid))
                        }
                    };
                    dsEdit.save(param).then(function(data) {
                        layerCtrl.getLayerById("adAdmin").redraw();
                        treatmentOfChanged(data, "ADADMIN", "创建ADADMIN成功", 'attr_administratives_ctrl/adAdminCtrl', 'attr_adminstratives_tpl/adAdminTpl.html');
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
                        "dbId": App.Temp.dbId,
                        "distance": linkWidth,
                        "data": {
                            "linkPids": linkIds
                        }
                    };
                    dsEdit.save(param).then(function(data) {
                        layerCtrl.getLayerById("rdLink").redraw();
                        layerCtrl.getLayerById("rdNode").redraw();
                        treatmentOfChanged(data, "RDLINK", "创建上下线分离成功", 'attr_link_ctrl/rdLinkCtrl', 'attr_link_tpl/rdLinkTpl.html');
                    })
                } else if (shapeCtrl.editType === "addAdFaceLine") {
                    var adLinksArr = selectCtrl.selectedFeatures.adLinks;
                    if (adLinksArr.length < 2) {
                        swal("操作失败", "请双击结束增加线段", "error");
                        return;
                    }
                    param = {
                        "command": "CREATE",
                        "type": "ADFACE",
                        "dbId": App.Temp.dbId,
                        "data": {
                            "geometry": {
                                "type": "LineString",
                                "coordinates": coordinate
                            }
                        }
                    };
                    dsEdit.save(param).then(function(data) {
                        layerCtrl.getLayerById("adFace").redraw();
                        layerCtrl.getLayerById("adLink").redraw();
                        treatmentOfChanged(data, "ADFACE", "创建行政区划面成功", 'attr_administratives_ctrl/adFaceCtrl', 'attr_adminstratives_tpl/adFaceTpl.html');
                    });
                } else if (shapeCtrl.editFeatType == 'zoneFace') {
                    param = {
                        "command": "CREATE",
                        "type": "ZONEFACE",
                        "dbId": App.Temp.dbId,
                        "data": {
                            "geometry": {
                                "type": "LineString",
                                "coordinates": coordinate
                            }
                        }
                    };
                    dsEdit.save(param).then(function(data) {
                        layerCtrl.getLayerById("zoneFace").redraw();
                        layerCtrl.getLayerById("zoneLink").redraw();
                        treatmentOfChanged(data, "ZONEFACE", "创建行政区划面成功", 'attr_zone_ctrl/zoneFaceCtrl', 'attr_zone_tpl/zoneFaceTpl.html');
                    });
                }
            } else if (shapeCtrl.editType === "addRdGsc") {
                param = {
                    "command": "CREATE",
                    "type": "RDGSC",
                    "dbId": App.Temp.dbId,
                    "data": selectCtrl.selectedFeatures
                };
                dsEdit.save(param).then(function(data) {
                    layerCtrl.getLayerById("relationData").redraw();
                    layerCtrl.getLayerById("rdLink").redraw();
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    treatmentOfChanged(data, "RDGSC", "创建RDGSC成功", 'attr_rdgsc_ctrl/rdGscCtrl', 'attr_gsc_tpl/rdGscTpl.html');
                })
            } else if (shapeCtrl.editType === "addAdAdmin") {
                param = {
                    "command": "CREATE",
                    "type": "ADADMIN",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "longitude": geo.x,
                        "latitude": geo.y,
                        "linkPid": parseInt(selectCtrl.selectedFeatures.id)
                    }
                };
                dsEdit.save(param).then(function(data) {
                    layerCtrl.getLayerById("adAdmin").redraw();
                    treatmentOfChanged(data, "ADADMIN", "创建ADADMIN成功", 'attr_administratives_ctrl/adAdminCtrl', 'attr_adminstratives_tpl/adAdminTpl.html');
                })
            } else if (shapeCtrl.editType === "adAdminMove") {
                param = {
                    "command": "MOVE",
                    "type": "ADADMIN",
                    "dbId": App.Temp.dbId,
                    "objId": selectCtrl.selectedFeatures.id,
                    "data": {
                        "longitude": geo.x,
                        "latitude": geo.y,
                        "linkPid": (selectCtrl.selectedFeatures.linkPid == null ? 0 : parseInt(selectCtrl.selectedFeatures.linkPid))
                    }
                };
                dsEdit.save(param).then(function(data) {
                    layerCtrl.getLayerById("adAdmin").redraw();
                    treatmentOfChanged(data, "ADADMIN", "创建ADADMIN成功", 'attr_administratives_ctrl/adAdminCtrl', 'attr_adminstratives_tpl/adAdminTpl.html');
                });
            } else if (shapeCtrl.editType === "pathBuffer") {
                this.transform = new fastmap.mapApi.MecatorTranform();
                var scale = this.transform.scale(map);
                var linkWidth = parseFloat(geo.linkWidth * scale);
                linkWidth = linkWidth.toFixed(1);
                var linkIds = selectCtrl.selectedFeatures.id;
                param = {
                    "command": "UPDOWNDEPART",
                    "type": "RDLINK",
                    "dbId": App.Temp.dbId,
                    "distance": linkWidth,
                    "data": {
                        "linkPids": linkIds
                    }
                };
                dsEdit.save(param).then(function(data) {
                    layerCtrl.getLayerById("adFace").redraw();
                    layerCtrl.getLayerById("adLink").redraw();
                    treatmentOfChanged(data, "ADFACE", "创建行政区划面成功", 'attr_administratives_ctrl/adFaceCtrl', 'attr_adminstratives_tpl/adFaceTpl.html');
                });
            } else if (shapeCtrl.editType === "addZoneFaceLine") {
                var zoneLinksArr = selectCtrl.selectedFeatures.zoneLinks;
                if (zoneLinksArr.length < 2) {
                    swal("操作失败", "请双击结束增加线段", "error");
                    return;
                }
                param = {
                    "command": "CREATE",
                    "type": "ZONEFACE",
                    "linkType": "ZONELINK",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "linkPids": zoneLinksArr
                    }
                };
                dsEdit.save(param).then(function(data) {
                    layerCtrl.getLayerById("zoneFace").redraw();
                    layerCtrl.getLayerById("zoneLink").redraw();
                    treatmentOfChanged(data, "ZONEFACE", "创建行政区划面成功", 'attr_zone_ctrl/zoneFaceCtrl', 'attr_zone_tpl/zoneFaceTpl.html');
                })
            } else
            if (shapeCtrl.editType === "poiLocMove" || shapeCtrl.editType === "poiGuideMove" || shapeCtrl.editType === "poiAutoDrag") {
                var points = selectCtrl.selectedFeatures;
                if (!(points || points.geometry || points.geometry[0] || points.id)) {
                    swal("操作失败", "无法获取poi点数据", "error");
                    return;
                }
                if (points.geometry[1] == undefined) {
                    points.geometry[1] = points.geometry[0]; //将显示坐标赋给引导坐标
                }
                if (points.linkPid == undefined) {
                    points.linkPid = 0; //将引导link赋默认值
                }
                param = {
                    "command": "MOVE",
                    "type": "IXPOI",
                    "dbId": App.Temp.dbId,
                    "objId": points.id,
                    "data": {
                        "longitude": points.geometry[0].x,
                        "latitude": points.geometry[0].y,
                        "x_guide": points.geometry[1].x,
                        "y_guide": points.geometry[1].y,
                        "linkPid": points.linkPid
                    }
                };
                dsEdit.save(param).then(function(data) {
                    highRenderCtrl._cleanHighLight();
                    layerCtrl.getLayerById("poiPoint").redraw();
                    // treatmentOfChanged(data, "poi", "移动poi成功");
                })
            } else if (shapeCtrl.editType === "poiAdd") {
                var points = selectCtrl.selectedFeatures;
                if (!points || !points.geometry) {
                    swal("操作失败", "无法获取poi点数据", "error");
                    return;
                }
                if (points.geometry.components[1] == undefined) {
                    points.geometry.components[1] = points.geometry.components[0]; //将显示坐标赋给引导坐标
                }
                if (points.geometry.linkPid == undefined) {
                    points.geometry.linkPid = 0; //将引导link赋默认值
                }
                param = {
                    "command": "CREATE",
                    "type": "IXPOI",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "longitude": points.geometry.components[0].x,
                        "latitude": points.geometry.components[0].y,
                        "x_guide": points.geometry.components[1].x,
                        "y_guide": points.geometry.components[1].y,
                        "linkPid": parseInt(points.geometry.linkPid)
                    }
                };
                dsEdit.save(param).then(function(data) {
                    layerCtrl.getLayerById("poiPoint").redraw();
                    treatmentOfChanged(data, "POI", "保存poi成功", 'attr_base/generalBaseCtl', 'attr_base/generalBaseTpl.html');
                })
            }
        }
    });
}