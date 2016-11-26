/**
 * Created by liwanchong on 2015/12/11.
 * Modified by liuyang on 2015/9/3
 */
function bindHotKeys(ocLazyLoad, scope, dsEdit, appPath, rootScope) {
    $(document).bind('keydown', function (event) {
        var layerCtrl = fastmap.uikit.LayerController();
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
        var thematicLink = layerCtrl.getLayerById('thematicLink');
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
        var rdCross = layerCtrl.getLayerById('rdCross');
        var crfData = layerCtrl.getLayerById('crfData');
        var tmcLayer = layerCtrl.getLayerById('tmcData');
        var rdLinkSpeedLimit = layerCtrl.getLayerById('rdLinkSpeedLimit');
        var rdSame = layerCtrl.getLayerById('rdSame');
        var resetPageFlag = true;
        if (event.keyCode == 27) {
            // event.preventDefault(); // 取消浏览器快捷键的默认设置
            resetPage();
            map._container.style.cursor = '';
        }
        var kindList = [];
        // 组装select2 下拉列表数据
        var allKindList = scope.allKindList;

        function initSelect2Option() {
            for (var i = 0; i < allKindList.length; i++) {
                if (allKindList[i].kindCode == 0) {
                    allKindList[i].kindName = '请选择分类';
                }
                kindList.push({
                    id: allKindList[i].kindCode,
                    text: allKindList[i].kindName
                });
            }
            return kindList;
        }

        kindList = initSelect2Option();
        // 是否包含点;
        function _contains(point, components) {
            var boolExit = false;
            for (var i in components) {
                if (point.x == components[i].x && point.y == components[i].y) {
                    boolExit = true;
                }
            }
            return boolExit;
        }

        // 返回两点之间的距离;
        function distance(pointA, pointB) {
            var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
            return Math.sqrt(len);
        }

        function resetPage(data) {
            map._container.style.cursor = '';
            shapeCtrl.editType = '';
            if (map.currentTool && typeof map.currentTool.cleanHeight === 'function') {
                map.currentTool.cleanHeight();
            }
            if (map.currentTool.snapHandler) {
                map.currentTool.snapHandler._enabled = true;
                map.currentTool.snapHandler.snaped = false;
            }
            if (map.currentTool.captureHandler) {
                map.currentTool.captureHandler._enabled = true;
                map.currentTool.captureHandler.snaped = false;
            }
            map.currentTool._enabled = true;
            map.currentTool.disable();
            map.scrollWheelZoom.enable();
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
            if (map.markerLayer) { // 清除marker图层
                map.removeLayer(map.markerLayer);
                map.markerLayer = null;
            }
            if (rdnode.selectedid) {
                rdnode.selectedid = null;
            }
            highRenderCtrl._cleanHighLight();
            highRenderCtrl.highLightFeatures = [];
            editLayer.drawGeometry = null;
            shapeCtrl.stopEditing();
            editLayer.bringToBack();
            $(editLayer.options._div).unbind();
            scope.changeBtnClass('');
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            editLayer.clear();
            if (objEditCtrl.originalData && !objEditCtrl.originalData.hasOwnProperty('pid')) {
                scope.$emit('SWITCHCONTAINERSTATE', {
                    subAttrContainerTpl: false,
                    attrContainerTpl: false
                });
            }
        }

        // 获取当前的控制器级对应的模板;
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
                if (type != 'IXPOI') {
                    if (type === 'RDBRANCH') {
                        id = '';
                    } else {
                        id = data.pid;
                    }
                    // 根据不同的分歧类型加载数据面板;
                    if (typeof branchType === 'undefined') {
                        dsEdit.getByPid(id, type).then(function (data) {
                            objEditCtrl.setCurrentObject(type, data);
                            objEditCtrl.setOriginalData(objEditCtrl.data.getIntegrate());
                            ocLazyLoad.load(appPath.road + 'ctrls/' + ctrl).then(function () {
                                scope.attrTplContainer = appPath.root + appPath.road + 'tpls/' + tpl;
                            });
                        });
                    } else if (branchType === 5 || branchType === 7) {
                        dsEdit.getBranchByRowId(rowid_deatailId, branchType).then(function (data) {
                            objEditCtrl.setCurrentObject(type, data);
                            objEditCtrl.setOriginalData(objEditCtrl.data.getIntegrate());
                            ocLazyLoad.load(appPath.road + 'ctrls/' + ctrl).then(function () {
                                scope.attrTplContainer = appPath.root + appPath.road + 'tpls/' + tpl;
                            });
                        });
                    } else {
                        dsEdit.getBranchByDetailId(rowid_deatailId, branchType).then(function (data) {
                            objEditCtrl.setCurrentObject(type, data);
                            objEditCtrl.setOriginalData(objEditCtrl.data.getIntegrate());
                            ocLazyLoad.load(appPath.road + 'ctrls/' + ctrl).then(function () {
                                scope.attrTplContainer = appPath.root + appPath.road + 'tpls/' + tpl;
                            });
                        });
                    }
                    // 弹出属性面板;
                    scope.$emit('SWITCHCONTAINERSTATE', {
                        attrContainerTpl: true,
                        subAttrContainerTpl: false
                    });
                } else {
                    dsEdit.getByPid(data.pid, 'IXPOI').then(function (rest) {
                        if (rest) {
                            scope.getCurrentKindByLittle(rest); // 获取当前小分类所对应的大分类下的所有小分类
                            objEditCtrl.setCurrentObject('IXPOI', rest);
                            objEditCtrl.setOriginalData(objEditCtrl.data.getIntegrate());

                            scope.$emit('transitCtrlAndTpl', {
                                loadType: 'attrTplContainer',
                                propertyCtrl: appPath.poi + 'ctrls/' + ctrl,
                                propertyHtml: appPath.root + appPath.poi + 'tpls/' + tpl
                            });
                            scope.$emit('transitCtrlAndTpl', {
                                loadType: 'tipsTplContainer',
                                propertyCtrl: appPath.poi + 'ctrls/attr-tips/poiPopoverTipsCtl',
                                propertyHtml: appPath.root + appPath.poi + 'tpls/attr-tips/poiPopoverTips.html'
                            });
                            scope.$emit('highLightPoi', rest.pid);
                            scope.$emit('refreshPhoto', true); // 更新图片面板
                            highRenderCtrl._cleanHighLight();
                            highRenderCtrl.highLightFeatures = [];
                            var highLightFeatures = [];
                            highLightFeatures.push({
                                id: rest.pid.toString(),
                                layerid: 'poi',
                                type: 'IXPOI',
                                style: {}
                            });
                            // 高亮
                            highRenderCtrl.highLightFeatures = highLightFeatures;
                            highRenderCtrl.drawHighlight();
                        }
                    });
                }
            } else if (shapeCtrl.editType === 'pathBreak') {
                shapeCtrl.editType = '';
                scope.$emit('SWITCHCONTAINERSTATE', {
                    attrContainerTpl: false,
                    subAttrContainerTpl: false
                });
                // 以下代码先注释,注释原因：打断link后，如果加载空白页会导致再次修改保存link属性时发送多次保存请求，最终导致锁表服务报错；
                /* ocLazyLoad.load(appPath.road + 'ctrls/blank_ctrl/blankCtrl').then(function () {
                 scope.attrTplContainer = appPath.root + appPath.road + 'tpls/blank_tpl/blankTpl.html';
                 });*/
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
                    swal('操作失败', '请双击结束增加线段', 'error');
                    return;
                } else {
                    var properties = shapeCtrl.shapeEditorResult.getProperties();
                    var showContent,
                      ctrl,
                      tpl,
                      type;
                    param.command = 'CREATE';
                    param.dbId = App.Temp.dbId;
                    param.data = {
                        eNodePid: properties.enodePid ? properties.enodePid : 0,
                        sNodePid: properties.snodePid ? properties.snodePid : 0,
                        geometry: {
                            type: 'LineString',
                            coordinates: coordinate
                        },
                        catchLinks: properties.catches
                    };
                    if (shapeCtrl.editFeatType === 'RDLINK') {
                        // if(properties.sameLinkFlag) {
                        //    swal("操作失败", "不允许连续两次捕捉打断同一根Link，请重新制作！", "error");
                        //    return;
                        // }
                        param.type = 'RDLINK';
                        ctrl = 'attr_link_ctrl/rdLinkCtrl';
                        tpl = 'attr_link_tpl/rdLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === 'ADLINK') {
                        param.type = 'ADLINK';
                        ctrl = 'attr_administratives_ctrl/adLinkCtrl';
                        tpl = 'attr_adminstratives_tpl/adLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === 'RWLINK') {
                        param.type = 'RWLINK';
                        ctrl = 'attr_link_ctrl/rwLinkCtrl';
                        tpl = 'attr_link_tpl/rwLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === 'ZONELINK') {
                        param.type = 'ZONELINK';
                        ctrl = 'attr_zone_ctrl/zoneLinkCtrl';
                        tpl = 'attr_zone_tpl/zoneLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === 'LULINK') {
                        param.type = 'LULINK';
                        ctrl = 'attr_lu_ctrl/luLinkCtrl';
                        tpl = 'attr_lu_tpl/luLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === 'LCLINK') {
                        param.type = 'LCLINK';
                        ctrl = 'attr_lc_ctrl/lcLinkCtrl';
                        tpl = 'attr_lc_tpl/lcLinkTpl.html';
                    }
                    dsEdit.save(param).then(function (data) {
                        if (data != null) {
                            if (param.type === 'RDLINK') {
                                rdLink.redraw();
                                thematicLink.redraw();
                                rdnode.redraw();
                            } else if (param.type === 'ADLINK') {
                                adLink.redraw();
                                adNode.redraw();
                            } else if (param.type === 'RWLINK') {
                                rwLink.redraw();
                                rwnode.redraw();
                            } else if (param.type === 'ZONELINK') {
                                zoneLink.redraw();
                                zoneNode.redraw();
                            } else if (param.type === 'LULINK') {
                                luLink.redraw();
                                luNode.redraw();
                            } else if (param.type === 'LCLINK') {
                                lcLink.redraw();
                                lcNode.redraw();
                            }
                            treatmentOfChanged(data, param.type, ctrl, tpl);
                        }
                    });
                }
            } else if (shapeCtrl.editType === 'addRestriction') {
                resetPageFlag = false;
                var laneData = objEditCtrl.originalData.inLaneInfoArr,
                  laneInfo = objEditCtrl.originalData.limitRelation,
                  restricType = objEditCtrl.originalData.restrictionType;
                laneInfo.infos = '';
                var laneStr = '';
                if (laneData.length === 0) {
                    laneStr = laneData[0];
                } else {
                    laneStr = laneData.join(',');
                }
                if (laneStr == undefined) {
                    swal('提示', '请选择交限图标！', 'warning');
                    return;
                }
                if (laneInfo.inLinkPid == undefined) {
                    swal('提示', '请选择进入线！', 'warning');
                    return;
                }
                if (laneInfo.nodePid == undefined) {
                    swal('提示', '请选择进入点！', 'warning');
                    return;
                }
                if (laneInfo.outLinkPids && laneInfo.outLinkPids.length && laneInfo.outLinkPids.length !== laneData.length) {
                    swal('提示', '退出线和交限不匹配！', 'warning');
                    return;
                }
                laneInfo.restricType = restricType;
                laneInfo.infos = laneStr;
                param = {
                    command: 'CREATE',
                    type: 'RDRESTRICTION',
                    dbId: App.Temp.dbId,
                    data: laneInfo
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        shapeCtrl.editType = '';
                        relationData.redraw();
                        map.currentTool.disable();
                        treatmentOfChanged(data, 'RDRESTRICTION', 'attr_restriction_ctrl/rdRestriction', 'attr_restrict_tpl/rdRestricOfOrdinaryTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'pathBreak') { // 线打断
                var breakPoint = null,
                  breakPathContent,
                  ctrl,
                  tpl,
                  selectShapeType = shapeCtrl.editFeatType,
                  snodeGeo,
                  enodeGeo,
                  pointNew,
                  distanceA,
                  distanceB;
                if (geo.components.length - geo.points.length > 1) {
                    for (var i = 0; i < geo.components.length; i++) {
                        if (geo.components[i].x.toString().split('.')[1].length > 5) {
                            geo.components.splice(i, 1);
                            i--;
                        }
                    }
                    swal('操作失败', '不允许同时打断多条link，请重新操作！', 'error');
                    return;
                }
                var ppp = shapeCtrl.shapeEditorResult.getOriginalGeometry().points;
                for (var item in geo.components) {
                    if (geo.components[item].x != ppp[item].x || geo.components[item].y != ppp[item].y) {
                        breakPoint = geo.components[item];
                        break;
                    }
                }
                if (breakPoint == null) {
                    shapeCtrl.stopEditing();
                    resetPage();
                    return;
                }
                param.command = 'BREAK';
                param.dbId = App.Temp.dbId;
                param.objId = parseInt(selectCtrl.selectedFeatures.id);
                param.data = {
                    longitude: breakPoint.x,
                    latitude: breakPoint.y
                };
                if (selectShapeType === 'RDLINK') {
                    param.type = 'RDLINK';
                } else if (selectShapeType === 'ADLINK') {
                    param.type = 'ADLINK';
                } else if (selectShapeType === 'RWLINK') {
                    param.type = 'RWLINK';
                } else if (selectShapeType === 'ZONELINK') {
                    param.type = 'ZONELINK';
                } else if (selectShapeType === 'LULINK') {
                    param.type = 'LULINK';
                } else if (selectShapeType === 'LCLINK') {
                    param.type = 'LCLINK';
                }
                snodeGeo = geo.components[0];
                enodeGeo = geo.components[geo.components.length - 1];
                pointNew = L.latLng(breakPoint.y, breakPoint.x);
                distanceA = pointNew.distanceTo(L.latLng(snodeGeo.y, snodeGeo.x));
                distanceB = pointNew.distanceTo(L.latLng(enodeGeo.y, enodeGeo.x));
                if (distanceA > 2 && distanceB > 2) {
                    dsEdit.save(param).then(function (data) {
                        if (data != null) {
                            if (param.type === 'RDLINK') {
                                rdLink.redraw();
                                rdnode.redraw();
                                rdLinkSpeedLimit.redraw();
                                rdCross.redraw();
                            } else if (param.type === 'ADLINK') {
                                adLink.redraw();
                                adNode.redraw();
                                adFace.redraw();
                            } else if (param.type === 'RWLINK') {
                                rwLink.redraw();
                                rwnode.redraw();
                            } else if (param.type === 'ZONELINK') {
                                zoneLink.redraw();
                                zoneNode.redraw();
                                zoneFace.redraw();
                            } else if (param.type === 'LULINK') {
                                luLink.redraw();
                                luNode.redraw();
                                luFace.redraw();
                            } else if (param.type === 'LCLINK') {
                                lcLink.redraw();
                                lcNode.redraw();
                                lcFace.redraw();
                            }
                            shapeCtrl.editType = 'pathBreak';// 被清空了，下面方法的分支进不去，因此再次临时赋值
                            treatmentOfChanged(data, param.type);
                        }
                    });
                } else {
                    swal('操作失败', '打断link小于2米，请重新操作！', 'error');
                }
            } else if (shapeCtrl.editType === 'transformDirect') { // 修改道路方向
                var disFromStart,
                  disFromEnd,
                  direct,
                  pointOfArrow,
                  feature = selectCtrl.selectedFeatures;
                var startPoint = feature.geometry[0],
                  point = feature.point;
                if (geo) {
                    if (!geo.flag) {
                        evtCtrl.fire(evtCtrl.eventTypes.SAVEPROPERTY);
                        // objEditCtrl.save();
                        // if (!objEditCtrl.changedProperty) {
                        //     swal('保存提示', '属性值没有变化，不需要保存！', 'info');
                        //     return;
                        // }
                        // param = {
                        //     type: 'RDLINK',
                        //     command: 'UPDATE',
                        //     dbId: App.Temp.dbId,
                        //     data: objEditCtrl.changedProperty
                        // };
                        // dsEdit.save(param).then(function (data) {
                        //     // evtCtrl.fire(evtCtrl.eventTypes.SAVEPROPERTY);
                        //     if (data != null) {
                        //         rdLink.redraw();
                        //         rdnode.redraw();
                        //         relationData.redraw();
                        //         treatmentOfChanged(data, fastmap.dataApi.GeoLiveModelType.RDLINK,'attr_link_ctrl/rdLinkCtrl','attr_link_tpl/rdLinkTpl.html');
                        //     }
                        // });
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
                }
            } else if (shapeCtrl.editType === 'pathDepartNode') { // 节点分离
                if (!selectCtrl.selectedFeatures.dragNodePid) return;
                param.command = 'DEPART';
                param.dbId = App.Temp.dbId;
                param.objId = selectCtrl.selectedFeatures.dragNodePid;
                var catchPid;
                if (selectCtrl.selectedFeatures.catchFlag.substr(-4) == 'LINK') {
                    catchLinkPid = selectCtrl.selectedFeatures.catchNodePid;
                    catchNodePid = 0;
                } else if (selectCtrl.selectedFeatures.catchFlag.substr(-4) == 'NODE') {
                    catchNodePid = selectCtrl.selectedFeatures.catchNodePid;
                    catchLinkPid = 0;
                }
                if (selectCtrl.selectedFeatures.latlng) {
                    param.data = {
                        catchNodePid: catchNodePid,
                        catchLinkPid: catchLinkPid,
                        linkPid: selectCtrl.selectedFeatures.selectedLinkPid,
                        longitude: selectCtrl.selectedFeatures.latlng.lng,
                        latitude: selectCtrl.selectedFeatures.latlng.lat
                    };
                } else {
                    param.data = {
                        catchNodePid: catchNodePid,
                        catchLinkPid: catchLinkPid,
                        linkPid: selectCtrl.selectedFeatures.selectedLinkPid
                    };
                }
                //param.type = selectCtrl.selectedFeatures.catchFlag;
                if (selectCtrl.selectedFeatures.catchFlag.substring(0, 2) == 'RD') {
                    param.type = 'RDLINK'
                } else if (selectCtrl.selectedFeatures.catchFlag.substring(0, 2) == 'AD') {
                    param.type = 'ADLINK'
                } else if (selectCtrl.selectedFeatures.catchFlag.substring(0, 2) == 'LU') {
                    param.type = 'LULINK'
                } else if (selectCtrl.selectedFeatures.catchFlag.substring(0, 2) == 'LC') {
                    param.type = 'LCLINK'
                } else if (selectCtrl.selectedFeatures.catchFlag.substring(0, 2) == 'RW') {
                    param.type = 'RWLINK'
                } else if (selectCtrl.selectedFeatures.catchFlag.substring(0, 2) == 'ZO') {
                    param.type = 'ZONELINK'
                }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        selectCtrl.selectedFeatures = null;
                        rdLink.redraw();
                        rdnode.redraw();
                        adLink.redraw();
                        adNode.redraw();
                        luLink.redraw();
                        luNode.redraw();
                        lcLink.redraw();
                        lcNode.redraw();
                        rwLink.redraw();
                        rwnode.redraw();
                        zoneLink.redraw();
                        zoneNode.redraw();
                        highRenderCtrl.highLightFeatures.push({
                            id: objEditCtrl.data.pid.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {}
                        });
                        highRenderCtrl.drawHighlight();
                    }
                });
            } else if (shapeCtrl.editType === 'speedLimit') {
                var disFromStart,
                  disFromEnd,
                  direct,
                  pointOfArrow,
                  feature = selectCtrl.selectedFeatures;
                var startPoint = feature.geometry[0],
                  point = feature.point;
                direct = feature.direct;
                param = {
                    command: 'CREATE',
                    type: 'RDSPEEDLIMIT',
                    dbId: App.Temp.dbId,
                    data: {
                        direct: direct,
                        linkPid: parseInt(feature.id),
                        longitude: point.x,
                        latitude: point.y
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        selectCtrl.selectedFeatures = null;
                        relationData.redraw();
                        treatmentOfChanged(data, 'RDSPEEDLIMIT', 'attr_speedLimit_ctrl/speedLimitCtrl', 'attr_speedLimit_tpl/speedLimitTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'addMileagePile') {
                if (!shapeCtrl.editFeatType) { // 如果不符合条件不让创建
                    return;
                }
                feature = selectCtrl.selectedFeatures;
                var currentPoint = shapeCtrl.shapeEditorResult.getFinalGeometry();
                param = {
                    command: 'CREATE',
                    type: 'RDMILEAGEPILE',
                    dbId: App.Temp.dbId,
                    data: {
                        direct: 0,
                        linkPid: parseInt(shapeCtrl.shapeEditorResult.getProperties().linkPid),
                        longitude: currentPoint.x,
                        latitude: currentPoint.y
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        selectCtrl.selectedFeatures = null;
                        relationData.redraw();
                        treatmentOfChanged(data, 'RDMILEAGEPILE', 'attr_mileagepile_ctrl/mileagePileCtrl', 'attr_mileagepile_tpl/mileagePile.html');
                    }
                });
            } else if (shapeCtrl.editType === 'updateMileagePile') {
                if (!shapeCtrl.editFeatType) {
                    return;
                }
                param = {
                    command: 'MOVE',
                    type: 'RDMILEAGEPILE',
                    dbId: App.Temp.dbId,
                    data: featCodeCtrl.getFeatCode().mileagePile
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        selectCtrl.selectedFeatures = null;
                        relationData.redraw();
                        treatmentOfChanged(data, 'RDMILEAGEPILE', 'attr_mileagepile_ctrl/mileagePileCtrl', 'attr_mileagepile_tpl/mileagePile.html');
                    }
                });
            } else if (shapeCtrl.editType === 'pathVertexReMove' || shapeCtrl.editType === 'pathVertexInsert' || shapeCtrl.editType === 'pathVertexMove') {
                if (geo) {
                    var repairContent,
                      ctrl,
                      tpl;
                    param.command = 'REPAIR';
                    param.dbId = App.Temp.dbId;
                    param.objId = parseInt(selectCtrl.selectedFeatures.id);
                    var snapObj = selectCtrl.getSnapObj();
                    var interLinks = (snapObj && snapObj.interLinks.length != 0) ? snapObj.interLinks : [];
                    var interNodes = (snapObj && snapObj.interNodes.length != 0) ? snapObj.interNodes : [];
                    param.data = {
                        geometry: {
                            type: 'LineString',
                            coordinates: coordinate
                        },
                        interLinks: interLinks,
                        interNodes: interNodes
                    };
                    if (shapeCtrl.editFeatType === 'RDLINK') {
                        param.type = 'RDLINK';
                        ctrl = 'attr_link_ctrl/rdLinkCtrl';
                        tpl = 'attr_link_tpl/rdLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === 'ADLINK') {
                        param.type = 'ADLINK';
                        ctrl = 'attr_administratives_ctrl/adLinkCtrl';
                        tpl = 'attr_adminstratives_tpl/adLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === 'RWLINK') {
                        param.type = 'RWLINK';
                        ctrl = 'attr_link_ctrl/rwLinkCtrl';
                        tpl = 'attr_link_tpl/rwLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === 'ZONELINK') {
                        param.type = 'ZONELINK';
                        ctrl = 'attr_zone_ctrl/zoneLinkCtrl';
                        tpl = 'attr_zone_tpl/zoneLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === 'LULINK') {
                        param.type = 'LULINK';
                        ctrl = 'attr_lu_ctrl/luLinkCtrl';
                        tpl = 'attr_lu_tpl/luLinkTpl.html';
                    } else if (shapeCtrl.editFeatType === 'LCLINK') {
                        param.type = 'LCLINK';
                        ctrl = 'attr_lc_ctrl/lcLinkCtrl';
                        tpl = 'attr_lc_tpl/lcLinkTpl.html';
                    }
                    dsEdit.save(param).then(function (data) {
                        if (data != null) {
                            if (param.type === 'RDLINK') {
                                rdLink.redraw();
                                rdnode.redraw();
                            } else if (param.type === 'ADLINK') {
                                adLink.redraw();
                                adFace.redraw();
                                adNode.redraw();
                            } else if (param.type === 'RWLINK') {
                                rwLink.redraw();
                                rwnode.redraw();
                            } else if (param.type === 'ZONELINK') {
                                zoneLink.redraw();
                                zoneFace.redraw();
                            } else if (param.type === 'LULINK') {
                                luLink.redraw();
                                luFace.redraw();
                            } else if (param.type === 'LCLINK') {
                                lcLink.redraw();
                                lcFace.redraw();
                                lcNode.redraw();
                            }
                            treatmentOfChanged(data, param.type, ctrl, tpl);
                        }
                    });
                }
            } else if (shapeCtrl.editType === 'pathNodeMove') {
                param.command = 'MOVE';
                param.dbId = App.Temp.dbId;
                param.objId = selectCtrl.selectedFeatures.id;
                param.data = {
                    longitude: selectCtrl.selectedFeatures.latlng.lng,
                    latitude: selectCtrl.selectedFeatures.latlng.lat
                };
                param.type = shapeCtrl.editFeatType;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        if (param.type === 'RDNODE') {
                            rdLink.redraw();
                            rdnode.redraw();
                            rdCross.redraw();
                            rdSame.redraw();
                            adLink.redraw();
                            adNode.redraw();
                            zoneLink.redraw();
                            zoneNode.redraw();
                            luNode.redraw();
                            luLink.redraw();
                            ctrl = 'attr_node_ctrl/rdNodeFormCtrl';
                            tpl = 'attr_node_tpl/rdNodeFormTpl.html';
                        } else if (param.type === 'ADNODE') {
                            adLink.redraw();
                            adNode.redraw();
                            adFace.redraw();
                            ctrl = 'attr_administratives_ctrl/adNodeCtrl';
                            tpl = 'attr_adminstratives_tpl/adNodeTpl.html';
                        } else if (param.type === 'RWNODE') {
                            rwLink.redraw();
                            rwnode.redraw();
                            ctrl = 'attr_node_ctrl/rwNodeCtrl';
                            tpl = 'attr_node_tpl/rwNodeTpl.html';
                        } else if (param.type === 'ZONENODE') {
                            zoneLink.redraw();
                            zoneNode.redraw();
                            zoneFace.redraw();
                            ctrl = 'attr_zone_ctrl/zoneNodeCtrl';
                            tpl = 'attr_zone_tpl/zoneNodeTpl.html';
                        } else if (param.type === 'LUNODE') {
                            luLink.redraw();
                            luNode.redraw();
                            luFace.redraw();
                            ctrl = 'attr_lu_ctrl/luNodeCtrl';
                            tpl = 'attr_lu_tpl/luNodeTpl.html';
                        } else if (param.type === 'LCNODE') {
                            lcLink.redraw();
                            lcNode.redraw();
                            lcFace.redraw();
                            ctrl = 'attr_lc_ctrl/lcNodeCtrl';
                            tpl = 'attr_lc_tpl/lcNodeTpl.html';
                        } else if (param.type == 'RDCROSS') {
                            rdCross.redraw();
                        } else if (param.type == 'RDTRAFFICSIGNAL') {
                            relationData.redraw();
                        }
                        treatmentOfChanged(data, param.type, ctrl, tpl);
                    }
                });
            } else if (shapeCtrl.editType === 'pointVertexAdd') {
                if (!shapeCtrl.editFeatType) { // 创建点限速时距离过近，不让保存
                    return;
                }
                if (!selectCtrl.selectedFeatures.id) { //没有点在link上,直接点空格
                    return;
                }
                var ctrl,
                  tpl;
                var selectShapeType = shapeCtrl.editFeatType;
                param.command = 'CREATE';
                param.dbId = App.Temp.dbId;
                param.objId = parseInt(selectCtrl.selectedFeatures.id);
                param.data = {
                    longitude: geo.x,
                    latitude: geo.y
                };
                param.type = selectShapeType;
                var snodeGeo,
                  enodeGeo,
                  pointNew,
                  distanceA,
                  distanceB;
                dsEdit.getByPid(selectCtrl.selectedFeatures.id, selectCtrl.selectedFeatures.featType).then(function (data) {
                    snodeGeo = data.geometry.coordinates[0];
                    enodeGeo = data.geometry.coordinates[data.geometry.coordinates.length - 1];
                    pointNew = L.latLng(geo.y, geo.x);
                    distanceA = pointNew.distanceTo(L.latLng(snodeGeo[1], snodeGeo[0]));
                    distanceB = pointNew.distanceTo(L.latLng(enodeGeo[1], enodeGeo[0]));
                    if (distanceA > 2 && distanceB > 2) {
                        dsEdit.save(param).then(function (data) {
                            if (data != null) {
                                if (param.type === 'RDLINK') {
                                    rdLink.redraw();
                                    rdnode.redraw();
                                } else if (param.type === 'RWNODE') {
                                    rwLink.redraw();
                                    rwnode.redraw();
                                    ctrl = 'attr_node_ctrl/rwNodeCtrl';
                                    tpl = 'attr_node_tpl/rwNodeTpl.html';
                                } else if (param.type === 'ADNODE') {
                                    adLink.redraw();
                                    adNode.redraw();
                                    adFace.redraw();
                                    ctrl = 'attr_administratives_ctrl/adNodeCtrl';
                                    tpl = 'attr_adminstratives_tpl/adNodeTpl.html';
                                } else if (param.type === 'RDNODE') {
                                    rdLink.redraw();
                                    rdnode.redraw();
                                    rdLinkSpeedLimit.redraw();
                                    rdCross.redraw();
                                    relationData.redraw();// 打断线后点限速关联的link发生了变化，其他有类似联系的要素应该也有这样的变化
                                    ctrl = 'attr_node_ctrl/rdNodeFormCtrl';
                                    tpl = 'attr_node_tpl/rdNodeFormTpl.html';
                                } else if (param.type === 'ZONENODE') {
                                    zoneLink.redraw();
                                    zoneNode.redraw();
                                    zoneFace.redraw();
                                    ctrl = 'attr_zone_ctrl/zoneNodeCtrl';
                                    tpl = 'attr_zone_tpl/zoneNodeTpl.html';
                                } else if (param.type === 'LUNODE') {
                                    luLink.redraw();
                                    luNode.redraw();
                                    luFace.redraw();
                                    ctrl = 'attr_lu_ctrl/luNodeCtrl';
                                    tpl = 'attr_lu_tpl/luNodeTpl.html';
                                } else if (param.type === 'LCNODE') {
                                    lcLink.redraw();
                                    lcNode.redraw();
                                    lcFace.redraw();
                                    ctrl = 'attr_lc_ctrl/lcNodeCtrl';
                                    tpl = 'attr_lc_tpl/lcNodeTpl.html';
                                }
                                treatmentOfChanged(data, param.type, ctrl, tpl);
                            }
                        });
                    } else {
                        swal('操作失败', '打断link小于2米，请重新操作！', 'error');
                        shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.POINTVERTEXADD);
                        shapeCtrl.startEditing();
                        shapeCtrl.editFeatType = selectShapeType;
                        map.currentTool = shapeCtrl.getCurrentTool();
                        map.currentTool.enable();
                        map.currentTool.snapHandler._guides = [];
                        // 设置捕捉图层
                        if (selectShapeType === 'RDNODE') {
                            map.currentTool.snapHandler.addGuideLayer(rdLink);
                        } else if (selectShapeType === 'RWNODE') {
                            map.currentTool.snapHandler.addGuideLayer(rwLink);
                        } else if (selectShapeType === 'ADNODE') {
                            map.currentTool.snapHandler.addGuideLayer(adLink);
                        } else if (selectShapeType === 'ZONENODE') {
                            map.currentTool.snapHandler.addGuideLayer(zoneLink);
                        } else if (selectShapeType === 'LCNODE') {
                            map.currentTool.snapHandler.addGuideLayer(lcLink);
                        } else if (selectShapeType === 'LUNODE') {
                            map.currentTool.snapHandler.addGuideLayer(luLink);
                        }
                        toolTipsCtrl.setEditEventType('pointVertexAdd');
                        toolTipsCtrl.setCurrentTooltip('开始增加节点！');
                        toolTipsCtrl.setChangeInnerHtml('点击增加节点!');
                        toolTipsCtrl.setDbClickChangeInnerHtml('点击空格保存,或者按ESC键取消!');
                    }
                });
            } else if (shapeCtrl.editType === 'BRANCH') {
                var param = {
                    data: featCodeCtrl.getFeatCode()
                };
                var ctrl = tpl = '';
                dsEdit.create('RDBRANCH', param.data).then(function (data) {
                    relationData.redraw();
                    // 只有5（实景图）或7（连续分歧）的时候传rowId;
                    var rowId_detialId = (param.data.branchType == 5 || param.data.branchType == 7) ? data.log[0].rowId : data.pid;
                    // 获取当前的ctrl和tpl的对象
                    var ctrlAndtplObj = getCtrlAndTpl(param.data.branchType);
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures = [];
                    treatmentOfChanged(data, 'RDBRANCH', ctrlAndtplObj.ctrl, ctrlAndtplObj.tpl, param.data.branchType, rowId_detialId);
                });
            } else if (shapeCtrl.editType === 'UPDATEBRANCH') {
                var tempType = featCodeCtrl.getFeatCode().branchType;// 当前修改的分歧的类型;
                var currentDataId = featCodeCtrl.getFeatCode().childId; // 当前分歧的pid;
                // 删除编辑不需要的数据;
                delete featCodeCtrl.getFeatCode().branchType;
                delete featCodeCtrl.getFeatCode().childId;
                // 调用编辑接口;
                dsEdit.updateTopo(featCodeCtrl.getFeatCode().nodePid, 'RDBRANCH', featCodeCtrl.getFeatCode()).then(function (data) {
                    relationData.redraw();
                    // 获取当前的ctrl和tpl的对象
                    var ctrlAndtplObj = getCtrlAndTpl(tempType);
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures = [];
                    treatmentOfChanged(data, 'RDBRANCH', ctrlAndtplObj.ctrl, ctrlAndtplObj.tpl, tempType, currentDataId);
                });
            } else if (shapeCtrl.editType === 'addRdCross') {
                param = {
                    command: 'CREATE',
                    type: 'RDCROSS',
                    dbId: App.Temp.dbId,
                    data: selectCtrl.selectedFeatures
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        rdCross.redraw();
                        treatmentOfChanged(data, 'RDCROSS', 'attr_cross_ctrl/rdCrossCtrl', 'attr_cross_tpl/rdCrossTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'addRdLaneConnexity') {
                var contyObj = objEditCtrl.originalData;
                if (contyObj.inLinkPid == 0 || contyObj.nodePid == 0 || contyObj.outLinkPids.length == 0 || contyObj.lanes.length == 0) {
                    swal('操作失败', '数据不完整，请确认已选择了进入线、进入点和退出线，以及对应的车道方向！', 'error');
                    return;
                }
                var laneInfo = [];
                for (var i = 0; i < contyObj.lanes.length; i++) {
                    laneInfo.push(contyObj.lanes[i].laneInfo);
                }
                contyObj.laneInfo = laneInfo.join(',');
                delete contyObj.lanes;
                param = {
                    command: 'CREATE',
                    type: 'RDLANECONNEXITY',
                    dbId: App.Temp.dbId,
                    data: contyObj
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, 'RDLANECONNEXITY', 'attr_connexity_ctrl/rdLaneConnexityCtrl', 'attr_connexity_tpl/rdLaneConnexityTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'drawPolygon') {
                coordinate.push([geo.components[0].x, geo.components[0].y]);
                param = {
                    command: 'CREATE',
                    type: shapeCtrl.editFeatType,
                    dbId: App.Temp.dbId,
                    data: {
                        geometry: {
                            type: 'LineString',
                            coordinates: coordinate
                        }
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        if (shapeCtrl.editFeatType == 'ADFACE') {
                            adNode.redraw();
                            adFace.redraw();
                            adLink.redraw();
                            treatmentOfChanged(data, shapeCtrl.editFeatType, 'attr_administratives_ctrl/adFaceCtrl', 'attr_adminstratives_tpl/adFaceTpl.html');
                        } else if (shapeCtrl.editFeatType == 'ZONEFACE') {
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
            } else if (shapeCtrl.editType === 'addRdGsc') {
                param = {
                    command: 'CREATE',
                    type: 'RDGSC',
                    dbId: App.Temp.dbId,
                    data: geo
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        rdLink.redraw();
                        rwLink.redraw();
                        lcLink.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures.length = 0;
                        treatmentOfChanged(data, 'RDGSC', 'attr_rdgsc_ctrl/rdGscCtrl', 'attr_gsc_tpl/rdGscTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'addAdAdminPoint') {
                param = {
                    command: 'CREATE',
                    type: 'ADADMIN',
                    dbId: App.Temp.dbId,
                    data: {
                        longitude: geo.components[0].x,
                        latitude: geo.components[0].y,
                        linkPid: parseInt(geo.guideLink)
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        layerCtrl.getLayerById('adAdmin').redraw();
                        treatmentOfChanged(data, 'ADADMIN', 'attr_administratives_ctrl/adAdminCtrl', 'attr_adminstratives_tpl/adAdminTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'updateAdminPoint') {
                param = {
                    command: 'MOVE',
                    type: 'ADADMIN',
                    dbId: App.Temp.dbId,
                    objId: geo.id,
                    data: {
                        longitude: geo.components[0].x,
                        latitude: geo.components[0].y,
                        linkPid: parseInt(geo.guideLink)
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        layerCtrl.getLayerById('adAdmin').redraw();
                        treatmentOfChanged(data, 'ADADMIN', 'attr_administratives_ctrl/adAdminCtrl', 'attr_adminstratives_tpl/adAdminTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'pathBuffer') {
                this.transform = new fastmap.mapApi.MecatorTranform();
                var scale = this.transform.scale(map);
                var linkWidth = parseFloat(geo.linkWidth * scale);
                map.scrollWheelZoom.enable();
                map.currentTool.disable();
                linkWidth = linkWidth.toFixed(1);
                var linkIds = selectCtrl.selectedFeatures.id;
                param = {
                    command: 'UPDOWNDEPART',
                    type: 'RDLINK',
                    dbId: App.Temp.dbId,
                    distance: linkWidth,
                    data: {
                        linkPids: linkIds
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        rdLink.redraw();
                        rdnode.redraw();
                        relationData.redraw();
                        treatmentOfChanged(data, 'RDLINK', 'attr_link_ctrl/rdLinkCtrl', 'attr_link_tpl/rdLinkTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'ADLINKFACE') {
                var adLinksArr = selectCtrl.selectedFeatures.links;
                var enableFlag = selectCtrl.selectedFeatures.flag;
                if (!enableFlag) {
                    swal('操作失败', '所选线无法构成ADLINKFACE面', 'error');
                    return;
                }
                param = {
                    command: 'CREATE',
                    type: 'ADFACE',
                    linkType: 'ADLINK',
                    dbId: App.Temp.dbId,
                    data: {
                        linkPids: adLinksArr
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        adFace.redraw();
                        adLink.redraw();
                        treatmentOfChanged(data, 'ADFACE', 'attr_administratives_ctrl/adFaceCtrl', 'attr_adminstratives_tpl/adFaceTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'ZONELINKFACE') {
                var zoneLinksArr = selectCtrl.selectedFeatures.links;
                var enableFlag = selectCtrl.selectedFeatures.flag;
                if (!enableFlag) {
                    swal('操作失败', '所选线无法构成ZONELINKFACE面', 'error');
                    return;
                }
                param = {
                    command: 'CREATE',
                    type: 'ZONEFACE',
                    linkType: 'ZONELINK',
                    dbId: App.Temp.dbId,
                    data: {
                        linkPids: zoneLinksArr
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        zoneFace.redraw();
                        zoneLink.redraw();
                        treatmentOfChanged(data, 'ZONEFACE', 'attr_zone_ctrl/zoneFaceCtrl', 'attr_zone_tpl/zoneFaceTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'LULINKFACE') {
                var luLinksArr = selectCtrl.selectedFeatures.links;
                var enableFlag = selectCtrl.selectedFeatures.flag;
                if (!enableFlag) {
                    swal('操作失败', '所选线无法构成LULINKFACE面', 'error');
                    return;
                }
                param = {
                    command: 'CREATE',
                    type: 'LUFACE',
                    linkType: 'LULINK',
                    dbId: App.Temp.dbId,
                    data: {
                        linkPids: luLinksArr
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        luFace.redraw();
                        luLink.redraw();
                        treatmentOfChanged(data, 'LUFACE', 'attr_lu_ctrl/luFaceCtrl', 'attr_zone_tpl/luFaceTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'LCLINKFACE') {
                var lcLinksArr = selectCtrl.selectedFeatures.links;
                var enableFlag = selectCtrl.selectedFeatures.flag;
                if (!enableFlag) {
                    swal('操作失败', '所选线无法构成LCLINKFACE面', 'error');
                    return;
                }
                param = {
                    command: 'CREATE',
                    type: 'LCFACE',
                    linkType: 'LCLINK',
                    dbId: App.Temp.dbId,
                    data: {
                        linkPids: lcLinksArr
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        lcFace.redraw();
                        lcLink.redraw();
                        treatmentOfChanged(data, 'LCFACE', 'attr_lc_ctrl/lcFaceCtrl', 'attr_lc_tpl/lcFaceTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'poiLocMove' || shapeCtrl.editType === 'poiGuideMove' || shapeCtrl.editType === 'poiAutoDrag') {
                var points = selectCtrl.selectedFeatures;
                if (!(points || points.geometry || points.geometry[0] || points.id)) {
                    swal('操作失败', '无法获取poi点数据', 'error');
                    return;
                }
                if (points.geometry[1] == undefined) {
                    points.geometry[1] = points.geometry[0]; // 将显示坐标赋给引导坐标
                }
                if (points.linkPid == undefined) {
                    points.linkPid = 0; // 将引导link赋默认值
                }
                param = {
                    command: 'MOVE',
                    type: 'IXPOI',
                    dbId: App.Temp.dbId,
                    objId: points.id,
                    data: {
                        longitude: points.geometry[0].x,
                        latitude: points.geometry[0].y,
                        x_guide: points.geometry[1].x,
                        y_guide: points.geometry[1].y,
                        linkPid: points.linkPid
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        selectCtrl.selectedFeatures = null;
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        layerCtrl.getLayerById('poi').redraw();
                        treatmentOfChanged(data, 'IXPOI', 'attr-base/generalBaseCtl', 'attr-base/generalBaseTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'poiAdd') {
                var html = '<div style="height:120px">' +
                  '<input id="poiAddName" class="form-control" style="display:inline-block;width:230px;height:30px;" placeholder="请输入名称" type="text"/>' +
                  '<select class="form-control" style="width:230px;margin-left:105px;" id="poiAddKind"></select>' +
                  '<div>';
                swal({
                      title: '请输入以下内容',
                      text: html,
                      html: true,
                      showCancelButton: true,
                      closeOnConfirm: false,
                      showLoaderOnConfirm: true,
                      allowEscapeKey: false,
                      confirmButtonText: '创建',
                      confirmButtonColor: '#ec6c62'
                  },
                  function () {
                      var name = $('#poiAddName').val();
                      var kindCode = $('#poiAddKind').val();
                      if (!name || kindCode == 0) {
                          swal('创建POI失败', '名称或分类为空', 'error');
                          return;
                      }
                      var points = selectCtrl.selectedFeatures;
                      if (!points || !points.geometry) {
                          swal('操作失败', '无法获取poi点数据', 'error');
                          return;
                      }
                      if (points.geometry.components[1] == undefined) {
                          points.geometry.components[1] = points.geometry.components[0]; // 将显示坐标赋给引导坐标
                      }
                      if (points.geometry.linkPid == undefined) {
                          points.geometry.linkPid = 0; // 将引导link赋默认值
                      }
                      param = {
                          command: 'CREATE',
                          type: 'IXPOI',
                          dbId: App.Temp.dbId,
                          data: {
                              longitude: points.geometry.components[0].x,
                              latitude: points.geometry.components[0].y,
                              x_guide: points.geometry.components[1].x,
                              y_guide: points.geometry.components[1].y,
                              linkPid: parseInt(points.geometry.linkPid),
                              name: name,
                              kindCode: kindCode
                          }
                      };
                      scope.rootCommonTemp.selectPoiInMap = true;
                      scope.$broadcast('clearAttrStyleDown'); // 父向子 清除属性样式
                      dsEdit.save(param).then(function (data) {
                          swal.close();
                          rootScope.isSpecialOperation = false;
                          if (data != null) {
                              layerCtrl.getLayerById('poi').redraw();
                              highRenderCtrl._cleanHighLight();
                              highRenderCtrl.highLightFeatures = [];
                              treatmentOfChanged(data, 'IXPOI', 'attr-base/generalBaseCtl', 'attr-base/generalBaseTpl.html');
                          }
                      });
                  });
                $('#poiAddKind').select2({
                    width: '230px',
                    placeholder: '请选择分类',
                    allowClear: false,
                    language: 'cn',
                    data: kindList
                });
            } else if (shapeCtrl.editType === 'trafficSignal') {    // 信号灯
                if (!rdnode.selectedid) {
                    swal('操作失败', '请选取路口Node', 'error');
                    return;
                }
                param = {
                    nodePid: rdnode.selectedid
                };
                dsEdit.create('RDTRAFFICSIGNAL', param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, 'RDTRAFFICSIGNAL', 'attr_trafficSignal_ctrl/trafficSignalCtrl', 'attr_trafficSignal_tpl/trafficSignalTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'gate') {    // 大门
                var gate = featCodeCtrl.getFeatCode();
                if (!(gate.nodePid && gate.inLinkPid && gate.outLinkPid)) {
                    swal('操作失败', '请选进入线和进入点以及退出线', 'error');
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
                        treatmentOfChanged(data, 'RDGATE', 'attr_gate_ctrl/rdGateCtrl', 'attr_gate_tpl/rdGateTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'warningInfo') {    // 警示信息
                var warning = featCodeCtrl.getFeatCode();
                if (!featCodeCtrl.getFeatCode().inLinkPid) {
                    return;
                }
                if (!(warning.nodePid && warning.inLinkPid)) {
                    swal('操作失败', '请选进入线和进入点', 'error');
                    return;
                }
                param = {
                    linkPid: warning.inLinkPid,
                    nodePid: warning.nodePid
                };
                dsEdit.create('RDWARNINGINFO', param).then(function (data) {
                    if (data != null) {
                        relationData.redraw(); // ctrls/
                        treatmentOfChanged(data, 'RDWARNINGINFO', 'attr_warninginfo_ctrl/warningInfoCtrl', 'attr_warninginfo_tpl/warningInfoTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'electronicEye') {    // 电子眼
                var feature = selectCtrl.selectedFeatures;
                var param = {
                    linkPid: parseInt(feature.id),
                    direct: feature.direct,
                    longitude: feature.point.x,
                    latitude: feature.point.y
                };
                dsEdit.create('RDELECTRONICEYE', param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, 'RDELECTRONICEYE', 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'UPDATEELECTRONICEYE') {
                var param = {
                    command: 'UPDATE',
                    type: 'RDELECTRONICEYE',
                    dbId: App.Temp.dbId,
                    data: {
                        linkPid: featCodeCtrl.getFeatCode().linkPid.toString(),
                        pid: featCodeCtrl.getFeatCode().pid.toString(),
                        objStatus: 'UPDATE'
                    }
                };
                // 调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, 'RDELECTRONICEYE', 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'updateElecNode') {
                var param = {
                    command: 'MOVE',
                    type: 'RDELECTRONICEYE',
                    dbId: App.Temp.dbId,
                    data: {
                        linkPid: featCodeCtrl.getFeatCode().linkPid.toString(),
                        pid: featCodeCtrl.getFeatCode().pid.toString(),
                        latitude: featCodeCtrl.getFeatCode().latitude.toString(),
                        longitude: featCodeCtrl.getFeatCode().longitude.toString()
                    }
                };
                // 调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, 'RDELECTRONICEYE', 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'ADDELECTRONICGROUP') {
                var param = {
                    command: 'CREATE',
                    type: 'RDELECEYEPAIR',
                    dbId: App.Temp.dbId,
                    data: {
                        startPid: featCodeCtrl.getFeatCode().startPid.toString(),
                        endPid: featCodeCtrl.getFeatCode().endPid.toString()
                    }
                };
                // 调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, 'RDELECTRONICEYE', 'attr_electronic_ctrl/electronicEyeCtrl', 'attr_electronic_tpl/electronicEyeTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'rdSlope') {
                if (!geo.linkPid) {
                    swal('提示', '请选择退出线！', 'warning');
                    return;
                }
                dsEdit.create('RDSLOPE', geo).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, 'RDSLOPE', 'attr_rdSlope_ctrl/rdSlopeCtrl', 'attr_rdSlope_tpl/rdSlopeTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'UPDATERDSLOPE') {
                var param = {
                    command: 'UPDATE',
                    type: 'RDSLOPE',
                    dbId: App.Temp.dbId,
                    data: {
                        objStatus: 'UPDATE'
                    }
                };
                var oriData = objEditCtrl.data;
                param.data.pid = oriData.pid;
                if (parseInt(featCodeCtrl.getFeatCode().linkPid) != oriData.linkPid) {
                    param.data.linkPid = parseInt(featCodeCtrl.getFeatCode().linkPid);
                }
                if (featCodeCtrl.getFeatCode().linkPids.length != oriData.slopeVias.length) {
                    param.data.linkPids = featCodeCtrl.getFeatCode().linkPids;
                }
                if (param.data.linkPids == undefined && param.data.linkPid == undefined) {
                    swal('操作失败', '坡度没有发生修改！', 'info');
                    return;
                }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, 'RDSLOPE', 'attr_rdSlope_ctrl/rdSlopeCtrl', 'attr_rdSlope_tpl/rdSlopeTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'rdSe') {
                var param = {
                    command: 'CREATE',
                    type: 'RDSE',
                    dbId: App.Temp.dbId,
                    data: {
                        inLinkPid: featCodeCtrl.getFeatCode().inLinkPid,
                        outLinkPid: featCodeCtrl.getFeatCode().outLinkPid,
                        nodePid: featCodeCtrl.getFeatCode().nodePid
                    }
                };
                // 调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, 'RDSE', 'attr_se_ctrl/rdSeCtrl', 'attr_se_tpl/rdSeTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'rdDirectRoute') {    // 顺行
                var param = {
                    command: 'CREATE',
                    type: 'RDDIRECTROUTE',
                    dbId: App.Temp.dbId,
                    data: {
                        inLinkPid: featCodeCtrl.getFeatCode().inLinkPid,
                        outLinkPid: featCodeCtrl.getFeatCode().outLinkPid,
                        nodePid: featCodeCtrl.getFeatCode().nodePid
                    }
                };
                // 调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, 'RDDIRECTROUTE', 'attr_directroute_ctrl/directRouteCtrl', 'attr_directroute_tpl/directRouteTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'rdSpeedBump') {    // 减速带
                var param = {
                    command: 'CREATE',
                    type: 'RDSPEEDBUMP',
                    dbId: App.Temp.dbId,
                    data: {
                        inLinkPid: featCodeCtrl.getFeatCode().inLinkPid,
                        inNodePid: featCodeCtrl.getFeatCode().nodePid
                    }
                };
                // 调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, 'RDSPEEDBUMP', 'attr_speedbump_ctrl/speedBumpCtrl', 'attr_speedbump_tpl/speedBumpTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'UPDATEINTER') {
                var param = {
                    command: 'UPDATE',
                    type: 'RDINTER',
                    dbId: App.Temp.dbId,
                    data: {
                        objStatus: 'UPDATE'
                    }
                };
                var oriData = objEditCtrl.data;
                param.data.pid = featCodeCtrl.getFeatCode().pid;
                param.data.links = featCodeCtrl.getFeatCode().links;
                param.data.nodes = featCodeCtrl.getFeatCode().nodes;
                if (param.data.nodes == undefined || param.data.nodes.length === 0) {
                    swal('操作失败', '未选中Node点！', 'info');
                    return;
                }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        if (data == '属性值未发生变化') {
                            swal('提示', '几何属性未发生变化!', 'info');
                            return;
                        }
                        crfData.redraw();
                        treatmentOfChanged(data, 'RDINTER', 'attr_rdcrf_ctrl/crfInterCtrl', 'attr_rdcrf_tpl/crfInterTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'CRFInter') {
                if (geo.nodes.length == 0) {
                    swal('操作失败', '未选中Node点！', 'info');
                    return;
                }
                dsEdit.create('RDINTER', geo).then(function (data) {
                    if (data != null) {
                        crfData.redraw();
                        treatmentOfChanged(data, 'RDINTER', 'attr_rdcrf_ctrl/crfInterCtrl', 'attr_rdcrf_tpl/crfInterTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'CRFRoad') {
                if (geo.linkPids.length == 0) {
                    swal('操作失败', '未选中Link！', 'info');
                    return;
                }
                dsEdit.create('RDROAD', geo).then(function (data) {
                    if (data != null) {
                        crfData.redraw();
                        treatmentOfChanged(data, 'RDROAD', 'attr_rdcrf_ctrl/crfRoadCtrl', 'attr_rdcrf_tpl/crfRoadTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'UPDATERDROAD') {
                var param = {
                    command: 'UPDATE',
                    type: 'RDROAD',
                    dbId: App.Temp.dbId,
                    data: {
                        objStatus: 'UPDATE'
                    }
                };
                var oriData = objEditCtrl.data;
                param.data.pid = featCodeCtrl.getFeatCode().pid;
                param.data.linkPids = featCodeCtrl.getFeatCode().linkPids;
                if (param.data.linkPids == undefined || param.data.linkPids.length === 0) {
                    swal('操作失败', '未选中Link！', 'info');
                    return;
                }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        crfData.redraw();
                        treatmentOfChanged(data, 'RDROAD', 'attr_rdcrf_ctrl/crfRoadCtrl', 'attr_rdcrf_tpl/crfRoadTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'CRFObject') {
                // if(geo.links.length == 0){
                //     swal("操作失败", "未选中Link！", "info");
                //     return;
                // }
                dsEdit.create('RDOBJECT', geo).then(function (data) {
                    if (data != null) {
                        crfData.redraw();
                        treatmentOfChanged(data, 'RDOBJECT', 'attr_rdcrf_ctrl/crfObjectCtrl', 'attr_rdcrf_tpl/crfObjectTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'UPDATERDOBJECT') {
                var param = {
                    command: 'UPDATE',
                    type: 'RDOBJECT',
                    dbId: App.Temp.dbId,
                    data: {
                        objStatus: 'UPDATE'
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
                        if (data === '属性值未发生变化') {
                            swal('提示', '几何属性未发生变化!', 'info');
                            return;
                        }
                        crfData.redraw();
                        treatmentOfChanged(data, 'RDOBJECT', 'attr_rdcrf_ctrl/crfObjectCtrl', 'attr_rdcrf_tpl/crfObjectTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'rdTollgate') {    // 收费站
                if (!featCodeCtrl.getFeatCode().inLinkPid) {
                    return;
                }
                var param = {
                    command: 'CREATE',
                    type: 'RDTOLLGATE',
                    dbId: App.Temp.dbId,
                    data: {
                        inLinkPid: featCodeCtrl.getFeatCode().inLinkPid,
                        outLinkPid: featCodeCtrl.getFeatCode().outLinkPid,
                        nodePid: featCodeCtrl.getFeatCode().nodePid
                    }
                };
                // 调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, 'RDTOLLGATE', 'attr_tollgate_ctrl/tollGateCtrl', 'attr_tollgate_tpl/tollGateTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'updateSpeedNode') {
                if (!featCodeCtrl.getFeatCode().speedData) {
                    return;
                }
                var param = {
                    command: 'UPDATE',
                    type: 'RDSPEEDLIMIT',
                    dbId: App.Temp.dbId,
                    data: featCodeCtrl.getFeatCode().speedData
                };
                if (featCodeCtrl.getFeatCode().speedData.direct == objEditCtrl.data.direct) {
                    swal('操作失败', '方向未改变！', 'info');
                    return;
                }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, 'RDSPEEDLIMIT', 'attr_speedLimit_ctrl/speedLimitCtrl', 'attr_speedLimit_tpl/speedLimitTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'transformSpeedDirect') {
                var param = {
                    command: 'UPDATE',
                    type: 'RDSPEEDLIMIT',
                    dbId: App.Temp.dbId,
                    data: {
                        objStatus: 'UPDATE'
                    }
                };
                var oriData = objEditCtrl.data;
                param.data.pid = featCodeCtrl.getFeatCode().pid;
                param.data.direct = featCodeCtrl.getFeatCode().direct;
                if (param.data.direct == undefined || param.data.direct == oriData.direct) {
                    swal('操作失败', '方向未改变！', 'info');
                    return;
                }
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        treatmentOfChanged(data, 'RDSPEEDLIMIT', 'attr_speedLimit_ctrl/speedLimitCtrl', 'attr_speedLimit_tpl/speedLimitTpl.html');
                    }
                });
            } else if (shapeCtrl.editType === 'rdVoiceguide') {    // 语音引导
                var param = {
                    command: 'CREATE',
                    type: 'RDVOICEGUIDE',
                    dbId: App.Temp.dbId,
                    data: {
                        inLinkPid: featCodeCtrl.getFeatCode().inLinkPid,
                        outLinkPids: featCodeCtrl.getFeatCode().outLinkPids,
                        nodePid: featCodeCtrl.getFeatCode().nodePid
                    }
                };
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, 'RDVOICEGUIDE', 'attr_voiceGuide_ctrl/voiceGuide', 'attr_voiceGuide_tpl/voiceGuide.html');
                    }
                });
            } else if (shapeCtrl.editType === 'variableSpeed') {    // 可变限速
                var param = {
                    command: 'CREATE',
                    type: 'RDVARIABLESPEED',
                    dbId: App.Temp.dbId,
                    data: {
                        inLinkPid: featCodeCtrl.getFeatCode().inLinkPid,
                        outLinkPid: featCodeCtrl.getFeatCode().outLinkPid,
                        nodePid: featCodeCtrl.getFeatCode().nodePid,
                        vias: featCodeCtrl.getFeatCode().vias
                    }
                };
                // 调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        treatmentOfChanged(data, 'RDVARIABLESPEED', 'attr_variableSpeed_ctrl/variableSpeedCtrl', 'attr_variableSpeed_tpl/variableSpeed.html');
                    }
                });
            } else if (shapeCtrl.editType === 'UPDATEVARIABLESPEED') {    // 可变限速编辑
                var param = {
                    command: 'UPDATE',
                    type: 'RDVARIABLESPEED',
                    dbId: App.Temp.dbId,
                    data: {
                        pid: featCodeCtrl.getFeatCode().pid,
                        inLinkPid: featCodeCtrl.getFeatCode().inLinkPid,
                        outLinkPid: featCodeCtrl.getFeatCode().outLinkPid,
                        nodePid: featCodeCtrl.getFeatCode().nodePid,
                        vias: featCodeCtrl.getFeatCode().vias
                    }
                };
                // 调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data == '属性值未发生变化') {
                        swal('提示', '几何属性未发生变化!', 'info');
                        return;
                    }
                    relationData.redraw();
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures = [];
                    treatmentOfChanged(data, 'RDVARIABLESPEED', 'attr_variableSpeed_ctrl/variableSpeedCtrl', 'attr_variableSpeed_tpl/variableSpeed.html');
                });
            } else if (shapeCtrl.editType === 'rdLane') {    // 查询详细车道
                var param = {
                    type: 'RDLANE',
                    dbId: App.Temp.dbId,
                    data: {
                        linkPid: featCodeCtrl.getFeatCode().inLinkPid,
                        laneDir: featCodeCtrl.getFeatCode().laneDir
                    }
                };
                // 调用编辑接口;
                dsEdit.getByCondition(param).then(function (data) {
                    if (data == '属性值未发生变化') {
                        swal('提示', '几何属性未发生变化!', 'info');
                        return;
                    }
                    relationData.redraw();
                    // 获取当前的ctrl和tpl的对象
                    highRenderCtrl._cleanHighLight();
                    highRenderCtrl.highLightFeatures.length = 0;
                    for (var i = 0, len = featCodeCtrl.getFeatCode().links.length; i < len; i++) {
                        featCodeCtrl.getFeatCode().links[i] = parseInt(featCodeCtrl.getFeatCode().links[i]);
                    }
                    objEditCtrl.memo = featCodeCtrl.getFeatCode();
                    objEditCtrl.setCurrentObject('RDLANE', {
                        linkPids: featCodeCtrl.getFeatCode().links,
                        laneDir: featCodeCtrl.getFeatCode().laneDir,
                        laneInfos: data.data
                    });
                    var showLaneInfoObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
                        loadType: 'attrTplContainer',
                        propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
                        propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
                        callback: function () {
                            var laneObj = {
                                loadType: 'attrTplContainer',
                                propertyCtrl: appPath.road + 'ctrls/attr_lane_ctrl/rdLaneCtrl',
                                propertyHtml: appPath.root + appPath.road + 'tpls/attr_lane_tpl/rdLaneTpl.html'
                            };
                            scope.$emit('transitCtrlAndTpl', laneObj);
                        }
                    };
                    scope.$emit('transitCtrlAndTpl', showLaneInfoObj);
                });
            } else if (shapeCtrl.editType === 'rdLaneTopoDetail') {    // 查询详细车道
                if (geo && (geo.nodePid == undefined || (geo.linkPids && geo.linkPids.length < 2))) {
                    swal('提示', '选择要素不全，重新选择一下!', 'warning');
                    return;
                }
                var param = {
                    type: 'RDLANE',
                    dbId: App.Temp.dbId,
                    data: geo
                };
                var rdLaneData = geo;
                // 调用编辑接口;
                dsEdit.getByCondition(param).then(function (data) {
                    if (data != null) {
                        var emitFlag = true;
                        var errorLink = null;
                        relationData.redraw();
                        featCodeCtrl.setFeatCode({
                            laneTopo: data.data,
                            rdLaneData: rdLaneData
                        });
                        for (var i = 0; i < data.data.length; i++) {
                            var laneInfos = data.data[i].laneInfos;
                            if (laneInfos && laneInfos.length > 0) {
                                for (var j = 0; j < laneInfos.length; j++) {
                                    if (!(laneInfos[j].lanes && laneInfos[j].lanes.length > 0)) {
                                        emitFlag = false;
                                        errorLink = laneInfos[j].linkPid;
                                        break;
                                    } else if (laneInfos[j].lanes && laneInfos[j].lanes.length == 0) {
                                        emitFlag = false;
                                    }
                                }
                            } else {
                                emitFlag = false;
                            }
                        }
                        if (emitFlag) {
                            scope.$emit('OPENRDLANETOPO');
                        } else if (errorLink) {
                            swal('错误提示', 'Pid=' + errorLink + '的RdLink不存在详细车道，不能制作车道连通！', 'error');
                        } else {
                            swal('错误提示', '所选的RdLink不存在详细车道，不能制作车道连通！', 'error');
                        }
                    }
                });
            } else if (shapeCtrl.editType === 'hgwgLimitDirect') {
                var temp = selectCtrl.selectedFeatures;
                if (temp.linkPid) {
                    var param = {
                        command: 'CREATE',
                        type: 'RDHGWGLIMIT',
                        dbId: App.Temp.dbId,
                        data: {
                            direct: temp.direct,
                            linkPid: temp.linkPid,
                            latitude: temp.latitude,
                            longitude: temp.longitude
                        }
                    };
                    dsEdit.save(param).then(function (data) {
                        if (data != null) {
                            relationData.redraw();
                            treatmentOfChanged(data, 'RDHGWGLIMIT', 'attr_hgwglimit_ctrl/hgwgLimitCtrl', 'attr_hgwglimit_tpl/hgwglimitTpl.html');
                        }
                    });
                } else {
                    swal('错误提示', '请先创建限高限重！', 'error');
                }
            } else if (shapeCtrl.editType === 'updateHgwgLimit') {
                var temp = featCodeCtrl.getFeatCode();
                if (temp.linkPid) {
                    var param = {
                        command: 'MOVE',
                        type: 'RDHGWGLIMIT',
                        dbId: App.Temp.dbId,
                        data: {
                            pid: temp.pid,
                            linkPid: temp.linkPid,
                            latitude: temp.lat,
                            longitude: temp.lng,
                            direct: temp.direct
                        }
                    };
                    dsEdit.save(param).then(function (data) {
                        if (data != null) {
                            relationData.redraw();
                            treatmentOfChanged(data, 'RDHGWGLIMIT', 'attr_hgwglimit_ctrl/hgwgLimitCtrl', 'attr_hgwglimit_tpl/hgwglimitTpl.html');
                        }
                    });
                } else {
                    swal('错误提示', '请移动限高限重位置！', 'error');
                }
            } else if (shapeCtrl.editType === 'modifyRdcross') {    // 更改路口
                if (geo.nodePids && geo.nodePids.length > 0) {
                    var param = {
                        command: 'BATCH',
                        type: 'RDCROSS',
                        dbId: App.Temp.dbId,
                        data: geo
                    };
                    // 调用编辑接口;
                    dsEdit.save(param).then(function (data) {
                        if (data) {
                            rdCross.redraw();
                            relationData.redraw();
                            if (data !== '属性值未发生变化') {
                                treatmentOfChanged(data, 'RDCROSS', 'attr_cross_ctrl/rdCrossCtrl', 'attr_cross_tpl/rdCrossTpl.html');
                            }
                        }
                    });
                } else {
                    dsEdit.delete(geo.pid, 'RDCROSS', 1).then(function (data) {
                        if (data) {
                            rdCross.redraw();
                            highRenderCtrl._cleanHighLight();
                            scope.$emit('SWITCHCONTAINERSTATE', {
                                subAttrContainerTpl: false,
                                attrContainerTpl: false
                            });
                        }
                    });
                }
            } else if (shapeCtrl.editType === 'tmcTransformDirect') {    // 增加TMC匹配信息
                // console.info(featCodeCtrl.getFeatCode());
                var linkPids = [];
                // 遍历取出linkPid数组
                for (var i = 0; i < featCodeCtrl.getFeatCode().linkPids.length; i++) {
                    linkPids.push(featCodeCtrl.getFeatCode().linkPids[i].pid);
                }
                var param = {
                    command: 'CREATE',
                    type: 'RDTMCLOCATION',
                    dbId: App.Temp.dbId,
                    data: {
                        tmcId: featCodeCtrl.getFeatCode().tmcId.toString(),
                        direct: featCodeCtrl.getFeatCode().direct.toString(),
                        locDirect: featCodeCtrl.getFeatCode().locDirect.toString(),
                        loctableId: featCodeCtrl.getFeatCode().loctableId.toString(),
                        linkPids: linkPids
                    }
                };
                // 调用编辑接口;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        relationData.redraw();
                        tmcLayer.redraw();
                        highRenderCtrl._cleanHighLight();
                        highRenderCtrl.highLightFeatures = [];
                        dsEdit.getByPid(parseInt(objEditCtrl.data.pid), 'RDLINK').then(function (data) {
                            if (data) {
                                scope.$emit('SWITCHCONTAINERSTATE', {
                                    subAttrContainerTpl: false,
                                    attrContainerTpl: true
                                });
                                objEditCtrl.setCurrentObject('RDLINK', data);
                                objEditCtrl.setOriginalData(objEditCtrl.data.getIntegrate());
                            }
                        });
                    }
                });
            }
            //平滑修形
            else if (shapeCtrl.editType === "pathSmooth") {
                if (!shapeCtrl.editFeatType) {
                    return;
                }
                var ctrl, tpl;
                var selectShapeType = shapeCtrl.editFeatType;
                var catchInfos = [];
                if (map.currentTool.snapStart.length != 0) {
                    catchInfos = catchInfos.concat(map.currentTool.snapStart[0].catches);
                }
                if (map.currentTool.snapEnd.length != 0) {
                    catchInfos = catchInfos.concat(map.currentTool.snapEnd[0].catches);
                }
                param["command"] = "REPAIR";
                param["dbId"] = App.Temp.dbId;
                param["objId"] = parseInt(selectCtrl.selectedFeatures.id);
                param["data"] = {
                    "geometry": {
                        "type": "LineString",
                        "coordinates": coordinate
                    },
                    "catchInfos": catchInfos
                };
                param["type"] = selectShapeType;
                dsEdit.save(param).then(function (data) {
                    if (data != null) {
                        if (param["type"] === "RDLINK") {
                            rdLink.redraw();
                            rdnode.redraw();

                        } else if (param["type"] === "RWNODE") {
                            rwLink.redraw();
                            rwnode.redraw();
                            ctrl = 'attr_node_ctrl/rwNodeCtrl';
                            tpl = 'attr_node_tpl/rwNodeTpl.html';
                        } else if (param["type"] === "ADNODE") {
                            adLink.redraw();
                            adNode.redraw();
                            adFace.redraw();
                            ctrl = 'attr_administratives_ctrl/adNodeCtrl';
                            tpl = 'attr_adminstratives_tpl/adNodeTpl.html';
                        } else if (param["type"] === "RDNODE") {
                            rdLink.redraw();
                            rdnode.redraw();
                            relationData.redraw();//打断线后点限速关联的link发生了变化，其他有类似联系的要素应该也有这样的变化
                            ctrl = 'attr_node_ctrl/rdNodeFormCtrl';
                            tpl = 'attr_node_tpl/rdNodeFormTpl.html';
                        } else if (param["type"] === "ZONENODE") {
                            zoneLink.redraw();
                            zoneNode.redraw();
                            zoneFace.redraw();
                            ctrl = 'attr_zone_ctrl/zoneNodeCtrl';
                            tpl = 'attr_zone_tpl/zoneNodeTpl.html';
                        } else if (param["type"] === "LUNODE") {
                            luLink.redraw();
                            luNode.redraw();
                            luFace.redraw();
                            ctrl = 'attr_lu_ctrl/luNodeCtrl';
                            tpl = 'attr_lu_tpl/luNodeTpl.html';
                        } else if (param["type"] === "LCNODE") {
                            lcLink.redraw();
                            lcNode.redraw();
                            lcFace.redraw();
                            ctrl = 'attr_lc_ctrl/lcNodeCtrl';
                            tpl = 'attr_lc_tpl/lcNodeTpl.html';
                        }
                        treatmentOfChanged(data, param["type"], ctrl, tpl);
                    }
                })
            }

            else if (shapeCtrl.editType === '') {    // 非正常情况下按空格
                return;
            }
            if (resetPageFlag) {
                resetPage();
            }
        }
    });
}