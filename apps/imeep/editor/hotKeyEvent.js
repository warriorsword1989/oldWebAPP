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
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
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
        //获取当前的控制器级对应的模板;
        function getCtrlAndTpl(type){
            var obj = {};
            switch (type){
                case 0:
                case 1:
                case 3:obj.ctrl = 'attr_branch_ctrl/rdBranchCtrl'; obj.tpl = 'attr_branch_Tpl/namesOfBranch.html';break;
                case 5:obj.ctrl = 'attr_branch_ctrl/rdRealImageCtrl'; obj.tpl = 'attr_branch_Tpl/realImageOfBranch.html';break;
                case 8:obj.ctrl = 'attr_branch_ctrl/rdSchematicCtrl'; obj.tpl = 'attr_branch_Tpl/schematicOfBranch.html';break;
                case 7:obj.ctrl = 'attr_branch_ctrl/rdSeriesCtrl'; obj.tpl = 'attr_branch_Tpl/seriesOfBranch.html';break;
                case 6:obj.ctrl = 'attr_branch_ctrl/rdSignAsRealCtrl'; obj.tpl = 'attr_branch_Tpl/signAsRealOfBranch.html';break;
                case 9:obj.ctrl = 'attr_branch_ctrl/rdSignBoardCtrl'; obj.tpl = 'attr_branch_Tpl/signBoardOfBranch.html';break;
            }
            return obj;
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
                    } else if (shapeCtrl.editFeatType === "LULINK") {
                        param["type"] = "LULINK";
                        showContent = "创建luLink成功";
                        ctrl = 'attr_lu_ctrl/luLinkCtrl';
                        tpl = 'attr_lu_tpl/luLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "LCLINK") {
                        param["type"] = "LCLINK";
                        showContent = "创建lcLink成功";
                        ctrl = 'attr_lc_ctrl/lcLinkCtrl';
                        tpl = 'attr_lc_tpl/lcLinkTpl.html';
                    }
                    dsEdit.save(param).then(function(data) {
                        if(data != null){
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
                            treatmentOfChanged(data, param["type"], showContent, ctrl, tpl);
                        } else {
                            resetPage();
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
                laneInfo["infos"] = laneStr;
                param = {
                    "command": "CREATE",
                    "type": "RDRESTRICTION",
                    "dbId": App.Temp.dbId,
                    "data": laneInfo
                };
                dsEdit.save(param).then(function(data) {
                    if(data != null){
                        relationData.redraw();
                        map.currentTool.disable();
                        treatmentOfChanged(data, "RDRESTRICTION", "创建交限成功", 'attr_restriction_ctrl/rdRestriction', 'attr_restrict_tpl/rdRestricOfOrdinaryTpl.html');
                    } else {
                        resetPage();
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
                dsEdit.save(param).then(function(data) {
                    if(data != null){
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
                    } else {
                        resetPage();
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
                        dsEdit.save(param).then(function(data) {
                            if(data != null){
                                treatmentOfChanged(data, fastmap.dataApi.GeoLiveModelType.RDLINK, "修改link道路方向成功");
                                if (data.errcode === 0) {
                                    rdLink.redraw();
                                    rdnode.redraw();
                                }
                            } else {
                                resetPage();
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
                    if(data != null){
                        selectCtrl.selectedFeatures = null;
                        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                        relationData.redraw();
                        treatmentOfChanged(data, "RDSPEEDLIMIT", "创建RDSPEEDLIMIT成功", 'attr_speedLimit_ctrl/speedLimitCtrl', 'attr_speedLimit_tpl/speedLimitTpl.html');
                    } else {
                        resetPage();
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
                    } else if (shapeCtrl.editFeatType === "LULINK") {
                        repairContent = "修改luLink成功";
                        param["type"] = "LULINK";
                        ctrl = 'attr_lu_ctrl/luLinkCtrl';
                        tpl = 'attr_lu_tpl/luLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === "LCLINK") {
                        repairContent = "修改lcLink成功";
                        param["type"] = "LCLINK";
                        ctrl = 'attr_lc_ctrl/lcLinkCtrl';
                        tpl = 'attr_lc_tpl/lcLinkTpl.html';
                    }
                    dsEdit.save(param).then(function(data) {
                        if(data != null){
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
                            treatmentOfChanged(data, param["type"], "移动link成功",ctrl,tpl);
                        } else {
                            resetPage();
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
                dsEdit.save(param).then(function(data) {
                    if(data != null){
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
                        }else if (param["type"] === "ZONENODE") {
                            zoneLink.redraw();
                            zoneNode.redraw();
                            zoneFace.redraw();
                        }else if (param["type"] === "LUNODE") {
                            luLink.redraw();
                            luNode.redraw();
                            luFace.redraw();
                        }else if (param["type"] === "LCNODE") {
                            lcLink.redraw();
                            lcNode.redraw();
                            lcFace.redraw();
                            ctrl = 'attr_lc_ctrl/lcNodeCtrl';
                            tpl = 'attr_lc_tpl/lcNodeTpl.html';
                        }else if (param["type"] == "RDCROSS" || param["type"] == "RDTRAFFICSIGNAL"){
                            relationData.redraw();
                        }
                        treatmentOfChanged(data, param["type"], "移动link成功",ctrl,tpl);
                    } else {
                        resetPage();
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
                dsEdit.save(param).then(function(data) {
                    if(data != null){
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
                        }else if(param["type"] === "LCNODE"){
                            lcLink.redraw();
                            lcNode.redraw();
                            lcFace.redraw();
                        }
                        treatmentOfChanged(data, param["type"], "插入点成功");
                    } else {
                        resetPage();
                    }
                })
            } else if (shapeCtrl.editType === "BRANCH") {
                var param = {
                    "data": featCodeCtrl.getFeatCode()
                };
                var ctrl = tpl = '';
                dsEdit.create("RDBRANCH", param.data).then(function(data) {
                    relationData.redraw();
                    //只有5（实景图）或7（连续分歧）的时候传rowId;
                    var rowId_detialId = (param.data.branchType == 5 || param.data.branchType == 7) ? data.log[0].rowId : data.pid;
                    //获取当前的ctrl和tpl的对象
                    var ctrlAndtplObj = getCtrlAndTpl(param.data.branchType);
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
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
                    relationData.redraw();
                    //获取当前的ctrl和tpl的对象
                    var ctrlAndtplObj = getCtrlAndTpl(tempType);
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
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
                    if(data != null){
                        relationData.redraw();
                        treatmentOfChanged(data, "RDCROSS", "创建RDCROSS成功", 'attr_cross_ctrl/rdCrossCtrl', 'attr_cross_tpl/rdCrossTpl.html');
                    } else {
                        resetPage();
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
                dsEdit.save(param).then(function(data) {
                    if(data!=null){
                        relationData.redraw();
                        treatmentOfChanged(data, "RDLANECONNEXITY", "创建车信成功", 'attr_connexity_ctrl/rdLaneConnexityCtrl', 'attr_connexity_tpl/rdLaneConnexityTpl.html');
                    } else {
                        resetPage();
                    }
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
                        adNode.redraw();
                        adFace.redraw();
                        adLink.redraw();
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
                        if(data!=null){
                            zoneNode.redraw();
                            zoneFace.redraw();
                            zoneLink.redraw();
                            treatmentOfChanged(data, "ZONEFACE", "创建ZONE面成功", 'attr_zone_ctrl/zoneFaceCtrl', 'attr_zone_tpl/zoneFaceTpl.html');
                        } else {
                            resetPage();
                        }
                    });
                } else if (shapeCtrl.editFeatType == 'LUFACE') {
                    param = {
                        "command": "CREATE",
                        "type": "LUFACE",
                        "dbId": App.Temp.dbId,
                        "data": {
                            "geometry": {
                                "type": "LineString",
                                "coordinates": coordinate
                            }
                        }
                    };
                    dsEdit.save(param).then(function(data) {
                        if(data!=null){
                            luNode.redraw();
                            luFace.redraw();
                            luLink.redraw();
                            treatmentOfChanged(data, "LUFACE", "创建LU面成功", 'attr_lu_ctrl/luFaceCtrl', 'attr_lu_tpl/luFaceTpl.html');
                        } else {
                            resetPage();
                        }
                    });

                }else if (shapeCtrl.editFeatType == 'LCFACE') {
                    param = {
                        "command": "CREATE",
                        "type": "LCFACE",
                        "dbId": App.Temp.dbId,
                        "data": {
                            "geometry": {
                                "type": "LineString",
                                "coordinates": coordinate
                            }
                        }
                    };
                    dsEdit.save(param).then(function(data) {
                        if(data!=null){
                            lcNode.redraw();
                            lcFace.redraw();
                            lcLink.redraw();
                            treatmentOfChanged(data, "LCFACE", "创建LC面成功", 'attr_lc_ctrl/lcFaceCtrl', 'attr_lc_tpl/lcFaceTpl.html');
                        } else {
                            resetPage();
                        }
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
                    if (data != null) {
                        relationData.redraw();
                        rdLink.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures.length = 0;
                        treatmentOfChanged(data, "RDGSC", "创建RDGSC成功", 'attr_rdgsc_ctrl/rdGscCtrl', 'attr_gsc_tpl/rdGscTpl.html');
                    } else {
                        resetPage();
                        tooltipsCtrl.setEditEventType('rdgsc');
                        tooltipsCtrl.setCurrentTooltip('正要新建立交,请框选立交点位！');
                        shapeCtrl.toolsSeparateOfEditor("addRdGsc", {
                            map: map,
                            layer: [rdLink, rwLink],
                            type: "rectangle"
                        });
                        map.currentTool = shapeCtrl.getCurrentTool();
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
                dsEdit.save(param).then(function(data) {
                    if(data != null){
                        layerCtrl.getLayerById("adAdmin").redraw();
                        treatmentOfChanged(data, "ADADMIN", "创建ADADMIN成功", 'attr_administratives_ctrl/adAdminCtrl', 'attr_adminstratives_tpl/adAdminTpl.html');
                    } else {
                        resetPage();
                        if (shapeCtrl.shapeEditorResult) {
                            shapeCtrl.shapeEditorResult.setFinalGeometry(fastmap.mapApi.point(0, 0));
                            selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
                            layerCtrl.pushLayerFront('edit');
                        }
                        shapeCtrl.setEditingType('addAdAdmin');
                        shapeCtrl.startEditing();
                        map.currentTool = shapeCtrl.getCurrentTool();
                        tooltipsCtrl.setEditEventType('pointVertexAdd');
                        tooltipsCtrl.setCurrentTooltip('开始增加行政区划代表点！');
                        tooltipsCtrl.setChangeInnerHtml("点击空格保存,或者按ESC键取消!");
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
                dsEdit.save(param).then(function(data) {
                    if(data != null){
                        layerCtrl.getLayerById("adAdmin").redraw();
                        treatmentOfChanged(data, "ADADMIN", "创建ADADMIN成功", 'attr_administratives_ctrl/adAdminCtrl', 'attr_adminstratives_tpl/adAdminTpl.html');
                    } else {
                        resetPage();
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
                dsEdit.save(param).then(function(data) {
                    if(data != null){
                        rdLink.redraw();
                        rdnode.redraw();
                        treatmentOfChanged(data, "RDLINK", "创建上下线分离成功", 'attr_link_ctrl/rdLinkCtrl', 'attr_link_tpl/rdLinkTpl.html');
                    } else {
                        resetPage();
                        shapeCtrl.setEditingType(fastmap.dataApi.GeoLiveModelType.RDBRANCH);
                        shapeCtrl.editFeatType = 3;
                        tooltipsCtrl.setEditEventType('rdBranch');
                        tooltipsCtrl.setCurrentTooltip('正要新建上下线分离,先选择线！');
                        map.currentTool = new fastmap.uikit.SelectForRestriction({
                            map: map,
                            createBranchFlag: true,
                            currentEditLayer: rdLink,
                            shapeEditor: shapeCtrl,
                            operationList:['line','point','line']
                        });
                        map.currentTool.enable();
                    }
                })
            } else if (shapeCtrl.editType === "addAdFaceLine") {
                var adLinksArr = selectCtrl.selectedFeatures.adLinks;
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
                dsEdit.save(param).then(function(data) {
                    if(data != null){
                        adFace.redraw();
                        adLink.redraw();
                        treatmentOfChanged(data, "ADFACE", "创建行政区划面成功", 'attr_administratives_ctrl/adFaceCtrl', 'attr_adminstratives_tpl/adFaceTpl.html');
                    } else {
                        resetPage();
                    }
                });
            } else if (shapeCtrl.editType === "addZoneFaceLine") {
                var zoneLinksArr = selectCtrl.selectedFeatures.zoneLinks;
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
                dsEdit.save(param).then(function(data) {
                    if(data != null){
                        zoneFace.redraw();
                        zoneLink.redraw();
                        treatmentOfChanged(data, "ZONEFACE", "创建行政区划面成功", 'attr_zone_ctrl/zoneFaceCtrl', 'attr_zone_tpl/zoneFaceTpl.html');
                    } else {
                        resetPage();
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
                dsEdit.save(param).then(function(data) {
                    if(data != null){
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures.length = 0;
                        layerCtrl.getLayerById("poi").redraw();
                        treatmentOfChanged(data, "IXPOI", "移动poi成功",'attr_base/generalBaseCtl', 'attr_base/generalBaseTpl.html');
                    } else {
                        resetPage();
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
                dsEdit.save(param).then(function(data) {
                    if(data != null){
                        layerCtrl.getLayerById("poi").redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures.length = 0;
                        treatmentOfChanged(data, "IXPOI", "保存poi成功", 'attr_base/generalBaseCtl', 'attr_base/generalBaseTpl.html');
                    } else {
                        resetPage();
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
                dsEdit.create('RDTRAFFICSIGNAL',param).then(function(data) {
                    if(data != null){
                        relationData.redraw();
                        treatmentOfChanged(data, "RDTRAFFICSIGNAL", "创建信号灯成功", 'attr_trafficSignal_ctrl/trafficSignalCtrl', 'attr_trafficSignal_tpl/trafficSignalTpl.html');
                    } else {
                        resetPage();
                    }

                });
            } else if (shapeCtrl.editType === "gate") {    //大门
                var gate = featCodeCtrl.getFeatCode();
                if(!(gate.nodePid && gate.inLinkPid && gate.outLinkPid )){
                    swal("操作失败", "请选进入线和进入点以及退出线", "error");
                    return;
                }

                param = {
                    inLinkPid:gate.inLinkPid,
                    nodePid:gate.nodePid,
                    outLinkPid:gate.outLinkPid
                };
                dsEdit.create('RDGATE',param).then(function(data) {
                    if(data != null){
                        relationData.redraw();
                        treatmentOfChanged(data, "RDGATE", "创建大门成功", 'attr_gate_ctrl/rdGateCtrl', 'attr_gate_tpl/rdGateTpl.html');
                    } else {
                        resetPage();
                    }

                });
            } else if (shapeCtrl.editType === "warningInfo") {    //警示信息
                var warning = featCodeCtrl.getFeatCode();
                if(!(warning.nodePid && warning.inLinkPid)){
                    swal("操作失败", "请选进入线和进入点", "error");
                    return;
                }

                param = {
                    linkPid:warning.inLinkPid,
                    nodePid:warning.nodePid
                };
                dsEdit.create('RDWARNINGINFO',param).then(function(data) {
                    if(data != null){
                        relationData.redraw(); //ctrls/
                        treatmentOfChanged(data, "RDWARNINGINFO", "创建警示信息成功", 'attr_warninginfo_ctrl/warningInfoCtrl', 'attr_warninginfo_tpl/warningInfoTpl.html');
                    } else {
                        resetPage();
                    }

                });
            } else if (shapeCtrl.editType === "electronicEye") {    //电子眼
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
                            if(data != null){
                                treatmentOfChanged(data, fastmap.dataApi.GeoLiveModelType.RDLINK, "修改link道路方向成功");
                                if (data.errcode === 0) {
                                    rdLink.redraw();
                                    rdnode.redraw();
                                }
                            } else {
                                resetPage();
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
                    "linkPid": parseInt(feature.id),
                    "direct": direct,
                    "longitude": point.x,
                    "latitude": point.y
                };
                dsEdit.create('RDELECTRONICEYE',param).then(function(data) {
                    if(data != null){
                        relationData.redraw();
                        treatmentOfChanged(data, "RDELECTRONICEYE", "创建电子眼成功", 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
                    } else {
                        resetPage();
                    }
                });
            }
            // else if (shapeCtrl.editType === "RDELECTRONICEYE"){
            //     var feature = selectCtrl.selectedFeatures,
            //         point = feature.point;
            //     param = {
            //         "linkPid": parseInt(feature.id),
            //         "direct": parseInt(feature.direct),
            //         "longitude": point.x,
            //         "latitude": point.y
            //     };
            //     dsEdit.create('RDELECTRONICEYE',param).then(function(data) {
            //         if(data != null){
            //             relationData.redraw();
            //             treatmentOfChanged(data, "RDELECTRONICEYE", "创建电子眼成功", 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
            //         } else {
            //             resetPage();
            //         }
            //     });
            //
            // }
            else if (shapeCtrl.editType === "UPDATEELECTRONICEYE") {
                var param = {
                    "command": "UPDATE",
                    "type": "RDELECTRONICEYE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "linkPid":featCodeCtrl.getFeatCode().linkPid.toString(),
                        "pid":featCodeCtrl.getFeatCode().pid.toString(),
                        "objStatus":"UPDATE"
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function(data) {
                    relationData.redraw();
                    //获取当前的ctrl和tpl的对象
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    treatmentOfChanged(data, "RDELECTRONICEYE", "编辑RDELECTRONICEYE成功", 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
                })
            } else if (shapeCtrl.editType === "updateElecNode") {
                var param = {
                    "command": "MOVE",
                    "type": "RDELECTRONICEYE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "linkPid":featCodeCtrl.getFeatCode().linkPid.toString(),
                        "pid":featCodeCtrl.getFeatCode().pid.toString(),
                        "latitude":featCodeCtrl.getFeatCode().latitude.toString(),
                        "longitude":featCodeCtrl.getFeatCode().longitude.toString()
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function(data) {
                    relationData.redraw();
                    //获取当前的ctrl和tpl的对象
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    treatmentOfChanged(data, "RDELECTRONICEYE", "编辑RDELECTRONICEYE成功", 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
                })
            } else if (shapeCtrl.editType === "ADDELECTRONICGROUP") {
                var param = {
                    "command": "CREATE",
                    "type": "RDELECEYEPAIR",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "startPid":featCodeCtrl.getFeatCode().startPid.toString(),
                        "endPid":featCodeCtrl.getFeatCode().endPid.toString()
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function(data) {
                    relationData.redraw();
                    //获取当前的ctrl和tpl的对象
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    treatmentOfChanged(data, "RDELECTRONICEYE", "编辑RDELECTRONICEYE成功", 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
                })
            } else if (shapeCtrl.editType === "rdSlope"){
                dsEdit.create('RDSLOPE',geo).then(function(data) {
                    if(data != null){
                        relationData.redraw();
                        treatmentOfChanged(data, "RDSLOPE", "创建坡度成功", 'attr_rdSlope_ctrl/rdSlopeCtrl', 'attr_rdSlope_tpl/rdSlopeTpl.html');
                    } else {
                        resetPage();
                    }
                });
            }else if (shapeCtrl.editType === "UPDATERDSLOPE"){
                var param = {
                    "command": "UPDATE",
                    "type": "RDSLOPE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "objStatus":"UPDATE"
                    }
                };
                var oriData = objEditCtrl.data;
                if(featCodeCtrl.getFeatCode().linkPid.toString() != oriData.linkPid){
                    param.data.linkPid = featCodeCtrl.getFeatCode().linkPid.toString();
                }
                if(featCodeCtrl.getFeatCode().linkPids.length != oriData.slopeVias.length){
                    param.data.linkPids = featCodeCtrl.getFeatCode().linkPids;
                }
                if(param.data.linkPids == undefined && param.data.linkPid == undefined){
                    swal("操作失败", "坡度没有发生修改！", "info");
                    return;
                }
                dsEdit.save(param).then(function(data) {
                    if(data != null){
                        relationData.redraw();
                        treatmentOfChanged(data, "RDSLOPE", "修改坡度成功", 'attr_rdSlope_ctrl/rdSlopeCtrl', 'attr_rdSlope_tpl/rdSlopeTpl.html');
                    } else {
                        resetPage();
                    }
                });
            } else if (shapeCtrl.editType === "rdSe") {
                var param = {
                    "command": "CREATE",
                    "type": "RDSE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "inLinkPid":featCodeCtrl.getFeatCode().inLinkPid,
                        "outLinkPid":featCodeCtrl.getFeatCode().outLinkPid,
                        "nodePid":featCodeCtrl.getFeatCode().nodePid
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function(data) {
                    relationData.redraw();
                    //获取当前的ctrl和tpl的对象
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    treatmentOfChanged(data, "RDSE", "编辑RDSE成功", 'attr_se_ctrl/rdSeCtrl', 'attr_se_tpl/rdSeTpl.html');
                })
            } else if (shapeCtrl.editType === "rdDirectRoute") {    //顺行
                var param = {
                    "command": "CREATE",
                    "type": "RDDIRECTROUTE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "inLinkPid":featCodeCtrl.getFeatCode().inLinkPid,
                        "outLinkPid":featCodeCtrl.getFeatCode().outLinkPid,
                        "nodePid":featCodeCtrl.getFeatCode().nodePid
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function(data) {
                    relationData.redraw();
                    //获取当前的ctrl和tpl的对象
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    treatmentOfChanged(data, "RDDIRECTROUTE", "编辑RDDIRECTROUTE成功", 'attr_directroute_ctrl/directRouteCtrl', 'attr_directroute_tpl/directRouteTpl.html');
                })
            } else if (shapeCtrl.editType === "rdSpeedBump") {    //减速带
                var param = {
                    "command": "CREATE",
                    "type": "RDSPEEDBUMP",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "inLinkPid":featCodeCtrl.getFeatCode().inLinkPid,
                        "inNodePid":featCodeCtrl.getFeatCode().nodePid
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function(data) {
                    relationData.redraw();
                    //获取当前的ctrl和tpl的对象
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    treatmentOfChanged(data, "RDSPEEDBUMP", "编辑RDSPEEDBUMP成功", 'attr_speedbump_ctrl/speedBumpCtrl', 'attr_speedbump_tpl/speedBumpTpl.html');
                })
            } else if (shapeCtrl.editType === "UPDATEINTER"){
                var param = {
                    "command": "UPDATE",
                    "type": "RDINTER",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "objStatus":"UPDATE"
                    }
                };
                var oriData = objEditCtrl.data;
                param.data.pid = featCodeCtrl.getFeatCode().pid;
                param.data.links = featCodeCtrl.getFeatCode().links;
                param.data.nodes = featCodeCtrl.getFeatCode().nodes;
                if(param.data.nodes == undefined || param.data.nodes == []){
                    swal("操作失败", "未选中Node点！", "info");
                    return;
                }
                dsEdit.save(param).then(function(data) {
                    if(data != null){
                        crfData.redraw();
                        treatmentOfChanged(data, "RDINTER", "修改CRF交叉点成功", 'attr_rdcrf_ctrl/crfInterCtrl', 'attr_rdcrf_tpl/crfInterTpl.html');
                    } else {
                        resetPage();
                    }
                });
            }else if (shapeCtrl.editType === "CRFInter"){
                if(geo.nodes.length == 0){
                    swal("操作失败", "未选中Node点！", "info");
                    return;
                }
                dsEdit.create('RDINTER',geo).then(function(data) {
                    if(data != null){
                        crfData.redraw();
                        treatmentOfChanged(data, "RDINTER", "创建CRF交叉点成功", 'attr_rdcrf_ctrl/crfInterCtrl', 'attr_rdcrf_tpl/crfInterTpl.html');
                    } else {
                        resetPage();
                    }
                });
            } else if (shapeCtrl.editType === "rdTollgate") {    //收费站
                var param = {
                    "command": "CREATE",
                    "type": "RDTOLLGATE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "inLinkPid":featCodeCtrl.getFeatCode().inLinkPid,
                        "outLinkPid":featCodeCtrl.getFeatCode().outLinkPid,
                        "nodePid":featCodeCtrl.getFeatCode().nodePid
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function(data) {
                    relationData.redraw();
                    //获取当前的ctrl和tpl的对象
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    treatmentOfChanged(data, "RDTOLLGATE", "编辑RDTOLLGATE成功", 'attr_tollgate_ctrl/tollGateCtrl', 'attr_tollgate_tpl/tollGateTpl.html');
                });
                /*scope.$emit("transitCtrlAndTpl", {
                 "loadType": "attrTplContainer",
                 "propertyCtrl": appPath.road + 'ctrls/attr_tollgate_ctrl/tollGateCtrl',
                 "propertyHtml": appPath.root + appPath.road + 'tpls/attr_tollgate_tpl/tollGateTpl.html'
                 });*/
            } else if (shapeCtrl.editType === "updateSpeedNode"){
                var param = {
                    "command": "UPDATE",
                    "type": "RDSPEEDLIMIT",
                    "dbId": App.Temp.dbId,
                    "data": geo
                };

                dsEdit.save(param).then(function(data) {
                    if(data != null){
                        relationData.redraw();
                        treatmentOfChanged(data, "RDSPEEDLIMIT", "修改点限速成功", 'attr_rdcrf_ctrl/crfInterCtrl', 'attr_rdcrf_tpl/crfInterTpl.html');
                    } else {
                        resetPage();
                    }
                });
            } else if (shapeCtrl.editType === "rdVoiceguide") {    //语音引导
                var param = {
                    "command": "CREATE",
                    "type": "RDVOICEGUIDE",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "inLinkPid":featCodeCtrl.getFeatCode().inLinkPid,
                        "outLinkPids":featCodeCtrl.getFeatCode().outLinkPids,
                        "nodePid":featCodeCtrl.getFeatCode().nodePid
                    }
                };
                dsEdit.save(param).then(function(data) {
                    relationData.redraw();
                    //获取当前的ctrl和tpl的对象
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    treatmentOfChanged(data, "RDVOICEGUIDE", "编辑RDVOICEGUIDE成功", 'attr_tollgate_ctrl/tollGateCtrl', 'attr_tollgate_tpl/tollGateTpl.html');
                });
            } else if (shapeCtrl.editType === "variableSpeed") {    //可变限速
                var param = {
                    "command": "CREATE",
                    "type": "RDVARIABLESPEED",
                    "dbId": App.Temp.dbId,
                    "data": {
                        "inLinkPid":featCodeCtrl.getFeatCode().inLinkPid,
                        "outLinkPid":featCodeCtrl.getFeatCode().outLinkPid,
                        "nodePid":featCodeCtrl.getFeatCode().nodePid
                    }
                };
                //调用编辑接口;
                dsEdit.save(param).then(function(data) {
                    relationData.redraw();
                    //获取当前的ctrl和tpl的对象
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    treatmentOfChanged(data, "RDVARIABLESPEED", "编辑RDVARIABLESPEED成功", 'attr_variableSpeed_ctrl/variableSpeed', 'attr_variableSpeed_tpl/variableSpeed.html');
                });
            }
        }
    });
}