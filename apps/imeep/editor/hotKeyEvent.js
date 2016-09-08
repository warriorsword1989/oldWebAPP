/**
 * Created by liwanchong on 2015/12/11.
 * Modified by liuyang on 2015/9/3
 */
function bindHotKeys(ocLazyLoad, scope, dsEdit, appPath) {
    $(document).bind('keydown', function (event) {
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
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdnode = layerCtrl.getLayerById('rdNode');
        var adLink = layerCtrl.getLayerById('adLink');
        var adNode = layerCtrl.getLayerById('adNode');
        var adFace = layerCtrl.getLayerById('adFace');
        var rwLink = layerCtrl.getLayerById('rwLink');
        var rwnode = layerCtrl.getLayerById('rwNode');
        var zoneLink = layerCtrl.getLayerById('zoneLink');
        var zoneNode = layerCtrl.getLayerById('zoneNode');
        var zoneFace = layerCtrl.getLayerById('zoneFace');
        var luLink = layerCtrl.getLayerById('luLink');
        var luNode = layerCtrl.getLayerById('luNode');
        var luFace = layerCtrl.getLayerById('luFace');
        var lcLink = layerCtrl.getLayerById('lcLink');
        var lcNode = layerCtrl.getLayerById('lcNode');
        var lcFace = layerCtrl.getLayerById('lcFace');
        var relationData = layerCtrl.getLayerById('relationData');
        var crfData = layerCtrl.getLayerById('crfData');
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
            shapeCtrl.editType = "";
            if (typeof map.currentTool.cleanHeight === "function") {
                map.currentTool.cleanHeight();
            }
            if (map.currentTool.snapHandler) {
                map.currentTool.snapHandler._enabled = true;
                map.currentTool.snapHandler.snaped = false;
            }
            map.currentTool._enabled = true;
            map.currentTool.disable();
            if (map.currentTool.rwEvent) {
                map.currentTool.rwEvent.disable();
            }
            if (toolTipsCtrl.getCurrentTooltip()) {
                toolTipsCtrl.onRemoveTooltip();
            }
            if (map.floatMenu) {
                map.removeLayer(map.floatMenu);
                map.floatMenu = null;
            }
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures = [];
            editLayer.drawGeometry = null;
            shapeCtrl.stopEditing();
            editLayer.bringToBack();
            $(editLayer.options._div).unbind();
            scope.changeBtnClass("");
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            editLayer.clear();
        }

        //获取当前的控制器级对应的模板;
        function getCtrlAndTpl(type) {
            var obj = {};
            switch (type) {
                case 0:
                case 1:
                case 3:
                    obj.ctrl = 'attr_branch_ctrl/rdBranchCtrl';
                    obj.tpl = 'attr_branch_Tpl/namesOfBranch.html';
                    break;
                case 5:
                    obj.ctrl = 'attr_branch_ctrl/rdRealImageCtrl';
                    obj.tpl = 'attr_branch_Tpl/realImageOfBranch.html';
                    break;
                case 8:
                    obj.ctrl = 'attr_branch_ctrl/rdSchematicCtrl';
                    obj.tpl = 'attr_branch_Tpl/schematicOfBranch.html';
                    break;
                case 7:
                    obj.ctrl = 'attr_branch_ctrl/rdSeriesCtrl';
                    obj.tpl = 'attr_branch_Tpl/seriesOfBranch.html';
                    break;
                case 6:
                    obj.ctrl = 'attr_branch_ctrl/rdSignAsRealCtrl';
                    obj.tpl = 'attr_branch_Tpl/signAsRealOfBranch.html';
                    break;
                case 9:
                    obj.ctrl = 'attr_branch_ctrl/rdSignBoardCtrl';
                    obj.tpl = 'attr_branch_Tpl/signBoardOfBranch.html';
                    break;
            }
            return obj;
        }

        function treatmentOfChanged(data, type, ctrl, tpl, branchType, rowid_deatailId) {
            var id;
            if (ctrl) {
                if (type != "IXPOI") {
                    if (type === "RDBRANCH") {
                        id = "";
                    } else {
                        id = data.pid;
                    }
                    //objEditCtrl.setOriginalData(null);
                    //根据不同的分歧类型加载数据面板;
                    if (typeof branchType === 'undefined') {
                        dsEdit.getByPid(id, type).then(function (data) {
                            objEditCtrl.setCurrentObject(type, data);
                            ocLazyLoad.load(appPath.road + 'ctrls/' + ctrl).then(function () {
                                scope.attrTplContainer = appPath.root + appPath.road + 'tpls/' + tpl;
                            })
                        });
                    } else if (branchType === 5 || branchType === 7) {
                        dsEdit.getBranchByRowId(rowid_deatailId, branchType).then(function (data) {
                            objEditCtrl.setCurrentObject(type, data);
                            ocLazyLoad.load(appPath.road + 'ctrls/' + ctrl).then(function () {
                                scope.attrTplContainer = appPath.root + appPath.road + 'tpls/' + tpl;
                            })
                        });
                    } else {
                        dsEdit.getBranchByDetailId(rowid_deatailId, branchType).then(function (data) {
                            objEditCtrl.setCurrentObject(type, data);
                            ocLazyLoad.load(appPath.road + 'ctrls/' + ctrl).then(function () {
                                scope.attrTplContainer = appPath.root + appPath.road + 'tpls/' + tpl;
                            })
                        });
                    }
                    scope.$emit("SWITCHCONTAINERSTATE", {
                        "attrContainerTpl": true,
                        "subAttrContainerTpl": false
                    });
                } else {
                    dsEdit.getByPid(data.pid, "IXPOI").then(function (rest) {
                        if (rest) {
                            objEditCtrl.setCurrentObject('IXPOI', rest);
                            objEditCtrl.setOriginalData(objEditCtrl.data.getIntegrate());
                            scope.$emit("transitCtrlAndTpl", {
                                "loadType": "tipsTplContainer",
                                "propertyCtrl": appPath.poi + "ctrls/attr-tips/poiPopoverTipsCtl",
                                "propertyHtml": appPath.root + appPath.poi + "tpls/attr-tips/poiPopoverTips.html"
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
                    ocLazyLoad.load(appPath.road + 'ctrls/blank_ctrl/blankCtrl').then(function () {
                        scope.attrTplContainer = appPath.root + appPath.road + 'tpls/blank_tpl/blankTpl.html';
                    });
                }
            }
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
                        ctrl = 'attr_link_ctrl/rdLinkCtrl';
                        tpl = 'attr_link_tpl/rdLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "ADLINK") {
                        param["type"] = "ADLINK";
                        ctrl = 'attr_administratives_ctrl/adLinkCtrl';
                        tpl = 'attr_adminstratives_tpl/adLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "RWLINK") {
                        param["type"] = "RWLINK";
                        ctrl = 'attr_link_ctrl/rwLinkCtrl';
                        tpl = 'attr_link_tpl/rwLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "ZONELINK") {
                        param["type"] = "ZONELINK";
                        ctrl = 'attr_zone_ctrl/zoneLinkCtrl';
                        tpl = 'attr_zone_tpl/zoneLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "LULINK") {
                        param["type"] = "LULINK";
                        ctrl = 'attr_lu_ctrl/luLinkCtrl';
                        tpl = 'attr_lu_tpl/luLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "LCLINK") {
                        param["type"] = "LCLINK";
                        ctrl = 'attr_lc_ctrl/lcLinkCtrl';
                        tpl = 'attr_lc_tpl/lcLinkTpl.html';
                    }
                    dsEdit.save(param).then(function (data) {
                        if (data != null) {
                            if (param["type"] === "RDLINK") {
                                rdLink.redraw();
                                rdnode.redraw();
                            } else if (param["type"] === "ADLINK") {
                                adLink.redraw();
                                adNode.redraw();
                            } else if (param["type"] === "RWLINK") {
                                rwLink.redraw();
                                rwnode.redraw();
                            } else if (param["type"] === "ZONELINK") {
                                zoneLink.redraw();
                                zoneNode.redraw();
                            } else if (param["type"] === "LULINK") {
                                luLink.redraw();
                                luNode.redraw();
                            } else if (param["type"] === "LCLINK") {
                                lcLink.redraw();
                                lcNode.redraw();
                            }
                            treatmentOfChanged(data, param["type"], ctrl, tpl);
                        }
                    });
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
                if (laneStr == undefined) {
                    swal("提示", '请选择交限！', "warning");
                    return;
                }
                laneInfo["infos"] = laneStr;
                param = {
                    "command": "CREATE",
                    "type": "RDRESTRICTION",
                    "dbId": App.Temp.dbId,
                    "data": laneInfo
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        map.currentTool.disable();
                        treatmentOfChanged(data, "RDRESTRICTION", 'attr_restriction_ctrl/rdRestriction', 'attr_restrict_tpl/rdRestricOfOrdinaryTpl.html');
                    }
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
                } else if (shapeCtrl.editFeatType === "LULINK") {
                    param["type"] = "LULINK";
                    breakPathContent = "打断luLink成功";
                } else if (shapeCtrl.editFeatType === "LCLINK") {
                    param["type"] = "LCLINK";
                    breakPathContent = "打断lcLink成功";
                }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        if (param["type"] === "RDLINK") {
                            rdLink.redraw();
                            rdnode.redraw();
                        } else if (param["type"] === "ADLINK") {
                            adLink.redraw();
                            adNode.redraw();
                        } else if (param["type"] === "RWLINK") {
                            rwLink.redraw();
                            rwnode.redraw();
                        } else if (param["type"] === "ZONELINK") {
                            zoneLink.redraw();
                            zoneNode.redraw();
                        } else if (param["type"] === "LULINK") {
                            luLink.redraw();
                            luNode.redraw();
                        } else if (param["type"] === "LCLINK") {
                            lcLink.redraw();
                            lcNode.redraw();
                        }
                        treatmentOfChanged(data, param["type"], breakPathContent);
                    }
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
                        dsEdit.save(param).then(function (data) {
                            if (data != null) {
                                rdLink.redraw();
                                rdnode.redraw();
                                treatmentOfChanged(data, fastmap.dataApi.GeoLiveModelType.RDLINK);
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
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        selectCtrl.selectedFeatures = null;
                        relationData.redraw();
                        treatmentOfChanged(data, "RDSPEEDLIMIT", 'attr_speedLimit_ctrl/speedLimitCtrl', 'attr_speedLimit_tpl/speedLimitTpl.html');
                    }
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
                        param["type"] = "RDLINK";
                        ctrl = 'attr_link_ctrl/rdLinkCtrl';
                        tpl = 'attr_link_tpl/rdLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "ADLINK") {
                        param["type"] = "ADLINK";
                        ctrl = 'attr_administratives_ctrl/adLinkCtrl';
                        tpl = 'attr_adminstratives_tpl/adLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "RWLINK") {
                        param["type"] = "RWLINK";
                        ctrl = 'attr_link_ctrl/rwLinkCtrl';
                        tpl = 'attr_link_tpl/rwLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "ZONELINK") {
                        param["type"] = "ZONELINK";
                        ctrl = 'attr_zone_ctrl/zoneLinkCtrl';
                        tpl = 'attr_zone_tpl/zoneLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "LULINK") {
                        param["type"] = "LULINK";
                        ctrl = 'attr_lu_ctrl/luLinkCtrl';
                        tpl = 'attr_lu_tpl/luLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "LCLINK") {
                        param["type"] = "LCLINK";
                        ctrl = 'attr_lc_ctrl/lcLinkCtrl';
                        tpl = 'attr_lc_tpl/lcLinkTpl.html';
                    }
                    dsEdit.save(param).then(function (data) {
                        if (data != null) {
                            if (param["type"] === "RDLINK") {
                                rdLink.redraw();
                                rdnode.redraw();
                            } else if (param["type"] === "ADLINK") {
                                adLink.redraw();
                                adFace.redraw();
                                adNode.redraw();
                            } else if (param["type"] === "RWLINK") {
                                rwLink.redraw();
                                rwnode.redraw();
                            } else if (param["type"] === "ZONELINK") {
                                zoneLink.redraw();
                                zoneFace.redraw();
                            } else if (param["type"] === "LULINK") {
                                luLink.redraw();
                                luFace.redraw();
                            } else if (param["type"] === "LCLINK") {
                                lcLink.redraw();
                                lcFace.redraw();
                            }
                            treatmentOfChanged(data, param["type"], ctrl, tpl);
                        }
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
                param["type"] = shapeCtrl.editFeatType;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        if (param["type"] === "RDNODE") {
                            rdLink.redraw();
                            rdnode.redraw();
                        } else if (param["type"] === "ADNODE") {
                            adLink.redraw();
                            adNode.redraw();
                            adFace.redraw();
                        } else if (param["type"] === "RWNODE") {
                            rwLink.redraw();
                            rwnode.redraw();
                        } else if (param["type"] === "ZONENODE") {
                            zoneLink.redraw();
                            zoneNode.redraw();
                            zoneFace.redraw();
                        } else if (param["type"] === "LUNODE") {
                            luLink.redraw();
                            luNode.redraw();
                            luFace.redraw();
                        } else if (param["type"] === "LCNODE") {
                            lcLink.redraw();
                            lcNode.redraw();
                            lcFace.redraw();
                            ctrl = 'attr_lc_ctrl/lcNodeCtrl';
                            tpl = 'attr_lc_tpl/lcNodeTpl.html';
                        } else if (param["type"] == "RDCROSS" || param["type"] == "RDTRAFFICSIGNAL") {
                            relationData.redraw();
                        }
                        treatmentOfChanged(data, param["type"], ctrl, tpl);
                    }
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
                param["type"] = shapeCtrl.editFeatType;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        if (param["type"] === "RDLINK") {
                            rdLink.redraw();
                            rdnode.redraw();
                        } else if (param["type"] === "RWNODE") {
                            rwLink.redraw();
                            rwnode.redraw();
                        } else if (param["type"] === "ADNODE") {
                            adLink.redraw();
                            adNode.redraw();
                            adFace.redraw();
                        } else if (param["type"] === "RDNODE") {
                            rdLink.redraw();
                            rdnode.redraw();
                        } else if (param["type"] === "ZONENODE") {
                            zoneLink.redraw();
                            zoneNode.redraw();
                            zoneFace.redraw();
                        } else if (param["type"] === "LUNODE") {
                            luLink.redraw();
                            luNode.redraw();
                            luFace.redraw();
                        } else if (param["type"] === "LCNODE") {
                            lcLink.redraw();
                            lcNode.redraw();
                            lcFace.redraw();
                        }
                        treatmentOfChanged(data, param["type"]);
                    }
                })
            } else if (shapeCtrl.editType === "BRANCH") {
                var param = {
                    "data": featCodeCtrl.getFeatCode()
                };
                var ctrl = tpl = '';
                dsEdit.create("RDBRANCH", param.data).then(function (data) {
                    relationData.redraw();
                    //只有5（实景图）或7（连续分歧）的时候传rowId;
                    var rowId_detialId = (param.data.branchType == 5 || param.data.branchType == 7) ? data.log[0].rowId : data.pid;
                    //获取当前的ctrl和tpl的对象
                    var ctrlAndtplObj = getCtrlAndTpl(param.data.branchType);
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures = [];
                    treatmentOfChanged(data, "RDBRANCH", ctrlAndtplObj.ctrl, ctrlAndtplObj.tpl, param.data.branchType, rowId_detialId);
                });
            } else if (shapeCtrl.editType === "UPDATEBRANCH") {
                var tempType = featCodeCtrl.getFeatCode().branchType;//当前修改的分歧的类型;
                var currentDataId = featCodeCtrl.getFeatCode().childId; //当前分歧的pid;
                //删除编辑不需要的数据;
                delete featCodeCtrl.getFeatCode().branchType;
                delete featCodeCtrl.getFeatCode().childId;
                //调用编辑接口;
                dsEdit.updateTopo(featCodeCtrl.getFeatCode().nodePid, "RDBRANCH", featCodeCtrl.getFeatCode()).then(function (data) {
                    relationData.redraw();
                    //获取当前的ctrl和tpl的对象
                    var ctrlAndtplObj = getCtrlAndTpl(tempType);
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures = [];
                    treatmentOfChanged(data, "RDBRANCH", ctrlAndtplObj.ctrl, ctrlAndtplObj.tpl, tempType, currentDataId);
                })
            } else if (shapeCtrl.editType === "addRdCross") {
                param = {
                    "command": "CREATE",
                    "type": "RDCROSS",
                    "dbId": App.Temp.dbId,
                    "data": selectCtrl.selectedFeatures
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, "RDCROSS", 'attr_cross_ctrl/rdCrossCtrl', 'attr_cross_tpl/rdCrossTpl.html');
                    }
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
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, "RDLANECONNEXITY", 'attr_connexity_ctrl/rdLaneConnexityCtrl', 'attr_connexity_tpl/rdLaneConnexityTpl.html');
                    }
                })
            } else if (shapeCtrl.editType === 'drawPolygon') {
                coordinate.push([geo.components[0].x, geo.components[0].y]);
                param = {
                    "command": "CREATE",
                    "type": shapeCtrl.editFeatType,
                    "dbId": App.Temp.dbId,
                    "data": {
                        "geometry": {
                            "type": "LineString",
                            "coordinates": coordinate
                        }
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        if (shapeCtrl.editFeatType == "ADFACE") {
                            adNode.redraw();
                            adFace.redraw();
                            adLink.redraw();
                            treatmentOfChanged(data, shapeCtrl.editFeatType, 'attr_administratives_ctrl/adFaceCtrl', 'attr_adminstratives_tpl/adFaceTpl.html');
                        } else if (shapeCtrl.editFeatType == "ZONEFACE") {
                            zoneNode.redraw();
                            zoneFace.redraw();
                            zoneLink.redraw();
                            treatmentOfChanged(data, shapeCtrl.editFeatType, 'attr_zone_ctrl/zoneFaceCtrl', 'attr_zone_tpl/zoneFaceTpl.html');
                        } else if (shapeCtrl.editFeatType == 'LUFACE') {
                            luNode.redraw();
                            luFace.redraw();
                            luLink.redraw();
                            treatmentOfChanged(data, shapeCtrl.editFeatType, 'attr_lu_ctrl/luFaceCtrl', 'attr_lu_tpl/luFaceTpl.html');
                        } else if (shapeCtrl.editFeatType == 'LCFACE') {
                            lcNode.redraw();
                            lcFace.redraw();
                            lcLink.redraw();
                            treatmentOfChanged(data, shapeCtrl.editFeatType, 'attr_lc_ctrl/lcFaceCtrl', 'attr_lc_tpl/lcFaceTpl.html');
                        }
                    }
                });
            } else if (shapeCtrl.editType === "addRdGsc") {
                param = {
                    "command": "CREATE",
                    "type": "RDGSC",
                    "dbId": App.Temp.dbId,
                    "data": selectCtrl.selectedFeatures
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        rdLink.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures.length = 0;
                        treatmentOfChanged(data, "RDGSC", 'attr_rdgsc_ctrl/rdGscCtrl', 'attr_gsc_tpl/rdGscTpl.html');
                    }
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
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        layerCtrl.getLayerById("adAdmin").redraw();
                        treatmentOfChanged(data, "ADADMIN", 'attr_administratives_ctrl/adAdminCtrl', 'attr_adminstratives_tpl/adAdminTpl.html');
                    }
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
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        layerCtrl.getLayerById("adAdmin").redraw();
                        treatmentOfChanged(data, "ADADMIN", 'attr_administratives_ctrl/adAdminCtrl', 'attr_adminstratives_tpl/adAdminTpl.html');
                    }
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
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        rdLink.redraw();
                        rdnode.redraw();
                        treatmentOfChanged(data, "RDLINK", 'attr_link_ctrl/rdLinkCtrl', 'attr_link_tpl/rdLinkTpl.html');
                    }
                })
            } else if (shapeCtrl.editType === "ADLINKFACE") {
                var adLinksArr = selectCtrl.selectedFeatures.links;
                if (!adLinksArr || adLinksArr.length < 2) {
                    swal("操作失败", "请双击结束增加线段", "error");
                    return;
                }
                param = {
                    "command": "CREATE",
                    "type": "ADFACE",
                    "linkType": "ADLINK",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "linkPids": adLinksArr
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        adFace.redraw();
                        adLink.redraw();
                        treatmentOfChanged(data, "ADFACE", 'attr_administratives_ctrl/adFaceCtrl', 'attr_adminstratives_tpl/adFaceTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "ZONELINKFACE") {
                var zoneLinksArr = selectCtrl.selectedFeatures.links;
                if (!zoneLinksArr || zoneLinksArr.length < 2) {
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
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        zoneFace.redraw();
                        zoneLink.redraw();
                        treatmentOfChanged(data, "ZONEFACE", 'attr_zone_ctrl/zoneFaceCtrl', 'attr_zone_tpl/zoneFaceTpl.html');
                    }
                })
            } else if (shapeCtrl.editType === "poiLocMove" || shapeCtrl.editType === "poiGuideMove" || shapeCtrl.editType === "poiAutoDrag") {
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
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        layerCtrl.getLayerById("poi").redraw();
                        treatmentOfChanged(data, "IXPOI", 'attr_base/generalBaseCtl', 'attr_base/generalBaseTpl.html');
                    }
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
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        layerCtrl.getLayerById("poi").redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, "IXPOI", 'attr_base/generalBaseCtl', 'attr_base/generalBaseTpl.html');
                    }
                })
            } else if (shapeCtrl.editType === "trafficSignal") {    //信号灯
                if (!rdnode.selectedid) {
                    swal("操作失败", "请选取路口Node", "error");
                    return;
                }
                param = {
                    "nodePid": rdnode.selectedid
                };
                dsEdit.create('RDTRAFFICSIGNAL', param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, "RDTRAFFICSIGNAL", 'attr_trafficSignal_ctrl/trafficSignalCtrl', 'attr_trafficSignal_tpl/trafficSignalTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "gate") {    //大门
                var gate = featCodeCtrl.getFeatCode();
                if (!(gate.nodePid && gate.inLinkPid && gate.outLinkPid )) {
                    swal("操作失败", "请选进入线和进入点以及退出线", "error");
                    return;
                }
                param = {
                    inLinkPid: gate.inLinkPid,
                    nodePid: gate.nodePid,
                    outLinkPid: gate.outLinkPid
                };
                dsEdit.create('RDGATE', param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, "RDGATE", 'attr_gate_ctrl/rdGateCtrl', 'attr_gate_tpl/rdGateTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "warningInfo") {    //警示信息
                var warning = featCodeCtrl.getFeatCode();
                if (!(warning.nodePid && warning.inLinkPid)) {
                    swal("操作失败", "请选进入线和进入点", "error");
                    return;
                }
                param = {
                    linkPid: warning.inLinkPid,
                    nodePid: warning.nodePid
                };
                dsEdit.create('RDWARNINGINFO', param).then(function (data) {
                    if (data != null) {
                        relationData.redraw(); //ctrls/
                        treatmentOfChanged(data, "RDWARNINGINFO", 'attr_warninginfo_ctrl/warningInfoCtrl', 'attr_warninginfo_tpl/warningInfoTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "electronicEye") {    //电子眼
                var feature = selectCtrl.selectedFeatures;
                var param = {
                    "linkPid": parseInt(feature.id),
                    "direct": feature.direct,
                    "longitude": feature.point.x,
                    "latitude": feature.point.y
                };
                dsEdit.create('RDELECTRONICEYE', param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, "RDELECTRONICEYE", 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
                    }
                });
            }
            else if (shapeCtrl.editType === "UPDATEELECTRONICEYE") {
                var param = {
                    "command": "UPDATE",
                    "type": "RDELECTRONICEYE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "linkPid": featCodeCtrl.getFeatCode().linkPid.toString(),
                        "pid": featCodeCtrl.getFeatCode().pid.toString(),
                        "objStatus": "UPDATE"
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, "RDELECTRONICEYE", 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
                    }
                })
            } else if (shapeCtrl.editType === "updateElecNode") {
                var param = {
                    "command": "MOVE",
                    "type": "RDELECTRONICEYE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "linkPid": featCodeCtrl.getFeatCode().linkPid.toString(),
                        "pid": featCodeCtrl.getFeatCode().pid.toString(),
                        "latitude": featCodeCtrl.getFeatCode().latitude.toString(),
                        "longitude": featCodeCtrl.getFeatCode().longitude.toString()
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, "RDELECTRONICEYE", 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
                    }
                })
            } else if (shapeCtrl.editType === "ADDELECTRONICGROUP") {
                var param = {
                    "command": "CREATE",
                    "type": "RDELECEYEPAIR",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "startPid": featCodeCtrl.getFeatCode().startPid.toString(),
                        "endPid": featCodeCtrl.getFeatCode().endPid.toString()
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, "RDELECTRONICEYE", 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
                    }
                })
            } else if (shapeCtrl.editType === "rdSlope") {
                dsEdit.create('RDSLOPE', geo).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, "RDSLOPE", 'attr_rdSlope_ctrl/rdSlopeCtrl', 'attr_rdSlope_tpl/rdSlopeTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "UPDATERDSLOPE") {
                var param = {
                    "command": "UPDATE",
                    "type": "RDSLOPE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "objStatus": "UPDATE"
                    }
                };
                var oriData = objEditCtrl.data;
                if (featCodeCtrl.getFeatCode().linkPid.toString() != oriData.linkPid) {
                    param.data.linkPid = featCodeCtrl.getFeatCode().linkPid.toString();
                }
                if (featCodeCtrl.getFeatCode().linkPids.length != oriData.slopeVias.length) {
                    param.data.linkPids = featCodeCtrl.getFeatCode().linkPids;
                }
                if (param.data.linkPids == undefined && param.data.linkPid == undefined) {
                    swal("操作失败", "坡度没有发生修改！", "info");
                    return;
                }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, "RDSLOPE", 'attr_rdSlope_ctrl/rdSlopeCtrl', 'attr_rdSlope_tpl/rdSlopeTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "rdSe") {
                var param = {
                    "command": "CREATE",
                    "type": "RDSE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "inLinkPid": featCodeCtrl.getFeatCode().inLinkPid,
                        "outLinkPid": featCodeCtrl.getFeatCode().outLinkPid,
                        "nodePid": featCodeCtrl.getFeatCode().nodePid
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, "RDSE", 'attr_se_ctrl/rdSeCtrl', 'attr_se_tpl/rdSeTpl.html');
                    }
                })
            } else if (shapeCtrl.editType === "rdDirectRoute") {    //顺行
                var param = {
                    "command": "CREATE",
                    "type": "RDDIRECTROUTE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "inLinkPid": featCodeCtrl.getFeatCode().inLinkPid,
                        "outLinkPid": featCodeCtrl.getFeatCode().outLinkPid,
                        "nodePid": featCodeCtrl.getFeatCode().nodePid
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, "RDDIRECTROUTE", 'attr_directroute_ctrl/directRouteCtrl', 'attr_directroute_tpl/directRouteTpl.html');
                    }
                })
            } else if (shapeCtrl.editType === "rdSpeedBump") {    //减速带
                var param = {
                    "command": "CREATE",
                    "type": "RDSPEEDBUMP",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "inLinkPid": featCodeCtrl.getFeatCode().inLinkPid,
                        "inNodePid": featCodeCtrl.getFeatCode().nodePid
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, "RDSPEEDBUMP", 'attr_speedbump_ctrl/speedBumpCtrl', 'attr_speedbump_tpl/speedBumpTpl.html');
                    }
                })
            } else if (shapeCtrl.editType === "UPDATEINTER") {
                var param = {
                    "command": "UPDATE",
                    "type": "RDINTER",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "objStatus": "UPDATE"
                    }
                };
                var oriData = objEditCtrl.data;
                param.data.pid = featCodeCtrl.getFeatCode().pid;
                param.data.links = featCodeCtrl.getFeatCode().links;
                param.data.nodes = featCodeCtrl.getFeatCode().nodes;
                if (param.data.nodes == undefined || param.data.nodes == []) {
                    swal("操作失败", "未选中Node点！", "info");
                    return;
                }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        crfData.redraw();
                        treatmentOfChanged(data, "RDINTER", 'attr_rdcrf_ctrl/crfInterCtrl', 'attr_rdcrf_tpl/crfInterTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "CRFInter") {
                if (geo.nodes.length == 0) {
                    swal("操作失败", "未选中Node点！", "info");
                    return;
                }
                dsEdit.create('RDINTER', geo).then(function (data) {
                    if (data != null) {
                        crfData.redraw();
                        treatmentOfChanged(data, "RDINTER", 'attr_rdcrf_ctrl/crfInterCtrl', 'attr_rdcrf_tpl/crfInterTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "CRFRoad") {
                if (geo.linkPids.length == 0) {
                    swal("操作失败", "未选中Link！", "info");
                    return;
                }
                dsEdit.create('RDROAD', geo).then(function (data) {
                    if (data != null) {
                        crfData.redraw();
                        treatmentOfChanged(data, "RDROAD", 'attr_rdcrf_ctrl/crfRoadCtrl', 'attr_rdcrf_tpl/crfRoadTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "UPDATERDROAD") {
                var param = {
                    "command": "UPDATE",
                    "type": "RDROAD",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "objStatus": "UPDATE"
                    }
                };
                var oriData = objEditCtrl.data;
                param.data.pid = featCodeCtrl.getFeatCode().pid;
                param.data.linkPids = featCodeCtrl.getFeatCode().linkPids;
                if (param.data.linkPids == undefined || param.data.linkPids == []) {
                    swal("操作失败", "未选中Link！", "info");
                    return;
                }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        crfData.redraw();
                        treatmentOfChanged(data, "RDROAD", 'attr_rdcrf_ctrl/crfRoadCtrl', 'attr_rdcrf_tpl/crfRoadTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "CRFObject") {
                // if(geo.links.length == 0){
                //     swal("操作失败", "未选中Link！", "info");
                //     return;
                // }
                dsEdit.create('RDOBJECT', geo).then(function (data) {
                    if (data != null) {
                        crfData.redraw();
                        treatmentOfChanged(data, "RDOBJECT", 'attr_rdcrf_ctrl/crfObjectCtrl', 'attr_rdcrf_tpl/crfObjectTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "UPDATERDOBJECT") {
                var param = {
                    "command": "UPDATE",
                    "type": "RDOBJECT",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "objStatus": "UPDATE"
                    }
                };
                var oriData = objEditCtrl.data;
                param.data.pid = featCodeCtrl.getFeatCode().pid;
                param.data.links = featCodeCtrl.getFeatCode().objData.links;
                param.data.roads = featCodeCtrl.getFeatCode().objData.roads;
                param.data.inters = featCodeCtrl.getFeatCode().objData.inters;
                // if(param.data.linkPids == undefined || param.data.linkPids == []){
                //     swal("操作失败", "未选中Link！", "info");
                //     return;
                // }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        crfData.redraw();
                        treatmentOfChanged(data, "RDOBJECT", 'attr_rdcrf_ctrl/crfObjectCtrl', 'attr_rdcrf_tpl/crfObjectTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "rdTollgate") {    //收费站
                var param = {
                    "command": "CREATE",
                    "type": "RDTOLLGATE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "inLinkPid": featCodeCtrl.getFeatCode().inLinkPid,
                        "outLinkPid": featCodeCtrl.getFeatCode().outLinkPid,
                        "nodePid": featCodeCtrl.getFeatCode().nodePid
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, "RDTOLLGATE", 'attr_tollgate_ctrl/tollGateCtrl', 'attr_tollgate_tpl/tollGateTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "updateSpeedNode") {
                var param = {
                    "command": "UPDATE",
                    "type": "RDSPEEDLIMIT",
                    "dbId": App.Temp.dbId,
                    "data": geo
                };
                if (geo.direct == objEditCtrl.data.direct) {
                    swal("操作失败", "方向未改变！", "info");
                    return;
                }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, "RDSPEEDLIMIT", 'attr_speedLimit_ctrl/speedLimitCtrl', 'attr_speedLimit_tpl/speedLimitTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "transformSpeedDirect") {
                var param = {
                    "command": "UPDATE",
                    "type": "RDSPEEDLIMIT",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "objStatus": "UPDATE"
                    }
                };
                var oriData = objEditCtrl.data;
                param.data.pid = featCodeCtrl.getFeatCode().pid;
                param.data.direct = featCodeCtrl.getFeatCode().direct;
                if (param.data.direct == undefined || param.data.direct == oriData.direct) {
                    swal("操作失败", "方向未改变！", "info");
                    return;
                }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, "RDSPEEDLIMIT", 'attr_speedLimit_ctrl/speedLimitCtrl', 'attr_speedLimit_tpl/speedLimitTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === "rdVoiceguide") {    //语音引导
                var param = {
                    "command": "CREATE",
                    "type": "RDVOICEGUIDE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "inLinkPid": featCodeCtrl.getFeatCode().inLinkPid,
                        "outLinkPids": featCodeCtrl.getFeatCode().outLinkPids,
                        "nodePid": featCodeCtrl.getFeatCode().nodePid
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, "RDVOICEGUIDE", 'attr_voiceGuide_ctrl/voiceGuide', 'attr_voiceGuide_tpl/voiceGuide.html');
                    }
                });
            } else if (shapeCtrl.editType === "variableSpeed") {    //可变限速
                var param = {
                    "command": "CREATE",
                    "type": "RDVARIABLESPEED",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "inLinkPid": featCodeCtrl.getFeatCode().inLinkPid,
                        "outLinkPid": featCodeCtrl.getFeatCode().outLinkPid,
                        "nodePid": featCodeCtrl.getFeatCode().nodePid,
                        "vias": featCodeCtrl.getFeatCode().vias
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, "RDVARIABLESPEED", 'attr_variableSpeed_ctrl/variableSpeedCtrl', 'attr_variableSpeed_tpl/variableSpeed.html');
                    }
                });
            } else if (shapeCtrl.editType === "UPDATEVARIABLESPEED") {    //可变限速编辑
                var param = {
                    "command": "UPDATE",
                    "type": "RDVARIABLESPEED",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "pid": featCodeCtrl.getFeatCode().pid,
                        "inLinkPid": featCodeCtrl.getFeatCode().inLinkPid,
                        "outLinkPid": featCodeCtrl.getFeatCode().outLinkPid,
                        "nodePid": featCodeCtrl.getFeatCode().nodePid,
                        "vias": featCodeCtrl.getFeatCode().vias
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data == '属性值未发生变化') {
                        swal("提示", "几何属性未发生变化!", "info");
                        return;
                    }
                    relationData.redraw();
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures = [];
                    treatmentOfChanged(data, "RDVARIABLESPEED", 'attr_variableSpeed_ctrl/variableSpeedCtrl', 'attr_variableSpeed_tpl/variableSpeed.html');
                });
            } else if (shapeCtrl.editType === "rdLane") {    //查询详细车道
                var param = {
                    "type": "RDLANE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "linkPid": featCodeCtrl.getFeatCode().inLinkPid,
                        "laneDir":featCodeCtrl.getFeatCode().laneDir,
                    }
                };
                //调用编辑接口;
                dsEdit.getByCondition(param).then(function(data) {
                    if(data=='属性值未发生变化'){
                        swal("提示","几何属性未发生变化!","info");
                        return;
                    }
                    relationData.redraw();
                    //获取当前的ctrl和tpl的对象
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    objEditCtrl.memo = featCodeCtrl.getFeatCode();
                    objEditCtrl.setCurrentObject('RDLANE', {
                      linkPids:featCodeCtrl.getFeatCode().links,
                      laneDir:featCodeCtrl.getFeatCode().laneDir,
                      laneInfos:data.data
                    });
                    // ocLazyLoad.load(appPath.road + "ctrls/attr_lane_ctrl/rdLaneCtrl").then(function () {
                    // 	scope.attrTplContainer = appPath.root + appPath.road + "tpls/attr_lane_tpl/rdLaneTpl.html";
                    // });
                    var showLaneInfoObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
                       "loadType": "attrTplContainer",
                       "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
                       "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
                       "callback": function () {
                           var laneObj = {
                               "loadType": "attrTplContainer",
                               "propertyCtrl": appPath.road + "ctrls/attr_lane_ctrl/rdLaneCtrl",
                               "propertyHtml": appPath.root + appPath.road + "tpls/attr_lane_tpl/rdLaneTpl.html"
                           };
                           scope.$emit("transitCtrlAndTpl", laneObj);
                       }
                   };
                   scope.$emit("transitCtrlAndTpl", showLaneInfoObj);
                    // scope.$emit("SWITCHCONTAINERSTATE", {
                    //     "attrContainerTpl": true,
                    //     "subAttrContainerTpl": false
                    // });
                    // $scope.attrTplContainerSwitch(true);
                  });
            }
            resetPage();
        }
    });
}
