angular.module('app').controller('ErrorCheckCtl', ['$window','$scope','$timeout', 'dsEdit', 'appPath', function($window,$scope,$timeout,dsEdit,appPath) {
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = new fastmap.uikit.HighRenderController();
    var objCtrl = fastmap.uikit.ObjectEditController();

    $scope.descriptStyle={
        "overflow": "hidden",
        "text-overflow":"ellipsis",
        "white-space":"nowrap"
    }

    $timeout(function(){
        var tableWidth=document.getElementById("errorCheckTable").clientWidth;
        $scope.descriptStyle={
            "width" : (tableWidth-100-59-100-tableWidth*0.05-tableWidth*0.05-47-110),
            "overflow": "hidden",
            "text-overflow":"ellipsis",
            "white-space":"nowrap"
        }
    });

    //初始化ng-table表头;
    $scope.cols = [
        {
            field: "ruleid",
            title: "检查规则",
            show: true
                },
        {
            field: "rank",
            title: "错误等级",
            sortable: "rank",
            show: true
                },
        {
            field: "targets",
            title: "错误对象",
            sortable: "targets",
            show: true
                },
        {
            field: "information",
            title: "错误信息",
            sortable: "information",
            show: true
                },
        {
            field: "geometry",
            title: "几何信息",
            sortable: "geometry",
            show: false
                },
        {
            field: "create_date",
            title: "检查时间",
            sortable: "create_date",
            show: false,
            getValue: getCreateData
                },
        {
            field: "worker",
            title: "作业员",
            sortable: "pid",
            show: false
                },
        {
            field: "option",
            title: "检查管理",
            sortable: "option",
            show: false,
            getValue: getOption
                }
    ];
    /***************************** 以上为ngtable ********************************/
    $scope.theadInfo = ['检查规则', '错误等级', '错误对象', '错误信息', '检查时间', '作业员', '检查管理'];
    //状态
    $scope.initTypeOptions = [
        {
            "id": 0,
            "label": " 未修改"
                },
        {
            "id": 1,
            "label": " 例外"
                },
        {
            "id": 2,
            "label": " 确认不修改"
                },
        {
            "id": 3,
            "label": " 确认已修改"
                }
    ];
    $scope.initType = 0;
    //修改状态
    $scope.changeType = function(selectInd, rowid) {
        dsEdit.updateCheckType(rowid, selectInd).then(function(data) {
            console.log('修改成功')
        });
    };
    /*高亮地图上poi*/
    $scope.showOnMap = function(pid, type) {
        // var param = {
        //     pid: pid,
        //     type: type.split('_').join('')
        // };
        // showOnMap(param.pid, param.type);
        resetToolAndMap();
        showOnMapNew(pid, type.split('_').join(''));
    };

    //点击数据在地图上高亮
    function showOnMap(id, type) {
        dsEdit.getByPid(id, type).then(function(data) {
            if (data) {
                switch (type) {
                    case "RDLINK":
                        var linkArr = data.geometry.coordinates,
                            points = [];
                        for (var i = 0, len = linkArr.length; i < len; i++) {
                            var point = L.latLng(linkArr[i][1], linkArr[i][0]);
                            points.push(point);
                        }
                        var line = new L.polyline(points);
                        var bounds = line.getBounds();
                        map.fitBounds(bounds, {
                            "maxZoom": 19
                        });
                        highRenderCtrl.highLightFeatures.push({
                            id: id.toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {}
                        });
                        map.setView([data.geometry.coordinates[1][1], data.geometry.coordinates[1][0]], 17);
                        selectCtrl.onSelected({
                            point: data.point
                        });
                        getFeatDataCallback(data, id, "RDLINK", appPath.road + "ctrls/attr_link_ctrl/rdLinkCtrl", appPath.root + appPath.road + "tpls/attr_link_tpl/rdLinkTpl.html");
                        break;
                    case "IXPOI":
                        highRenderCtrl.highLightFeatures.push({
                            id: id.toString(),
                            layerid: 'poi',
                            type: 'IXPOI',
                            style: {}
                        });
                        map.setView([data.geometry.coordinates[1], data.geometry.coordinates[0]], 17);
                        getFeatDataCallback(data, id, "IXPOI", appPath.poi + "ctrls/attr-base/generalBaseCtl", appPath.root + appPath.poi + "tpls/attr-base/generalBaseTpl.html");
                        break;
                    case "RDRESTRICTION":
                        var limitPicArr = [];
                        layerCtrl.pushLayerFront('referencePoint');
                        highRenderCtrl.highLightFeatures.push({
                            id: data.pid.toString(),
                            layerid: 'restriction',
                            type: 'restriction',
                            style: {}
                        });
                        highRenderCtrl.highLightFeatures.push({
                            id: data["inLinkPid"].toString(),
                            layerid: 'rdLink',
                            type: 'line',
                            style: {}
                        });
                        for (var i = 0, len = (data.details).length; i < len; i++) {
                            highRenderCtrl.highLightFeatures.push({
                                id: data.details[i].outLinkPid.toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {}
                            })
                        }
                        map.setView([data.geometry.coordinates[1], data.geometry.coordinates[0]], 17);
                        getFeatDataCallback(data, id, "RDRESTRICTION", appPath.road + "ctrls/attr_restriction_ctrl/rdRestriction", appPath.root + appPath.road + "tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html");
                        break;
                    default:
                        layerCtrl.pushLayerFront("workPoint");
                        highRenderCtrl.highLightFeatures.push({
                            id: data.rowkey,
                            layerid: 'workPoint',
                            type: 'workPoint',
                            style: {}
                        });
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        break;
                }
                highRenderCtrl.drawHighlight();
            }
        })
    };

    function showOnMapNew(pid, featType) {
        if (featType == 'RDBRANCH') { // 暂时不支持分歧，因为这里不知道分歧的具体类型
            return;
        }
        dsEdit.getByPid(pid, featType).then(function(data) {
            objCtrl.setCurrentObject(featType, data);
            var zoom = map.getZoom() < 17 ? 17 : map.getZoom();
            var coord;
            if (data.geometry.type == 'Point') {
                coord = data.geometry.coordinates;
            } else if (data.geometry.type == 'LineString') {
                coord = data.geometry.coordinates[0];
            } else if (data.geometry.type == 'Polygon') {
                coord = data.geometry.coordinates[0][0];
            }
            if (coord) {
                map.setView([coord[1], coord[0]]);
            }
            var page = getFeaturePage(featType);
            if (featType == "IXPOI") {
                $scope.getCurrentKindByLittle(data); //获取当前小分类所对应的大分类下的所有小分类
                $scope.$emit("transitCtrlAndTpl", {
                    "loadType": "tipsTplContainer",
                    "propertyCtrl": appPath.poi + "ctrls/attr-tips/poiPopoverTipsCtl",
                    "propertyHtml": appPath.root + appPath.poi + "tpls/attr-tips/poiPopoverTips.html"
                });
                highlightPoi(pid, data.geometry);
            }
            // 不知道这个是要干啥的，以后再研究
            selectCtrl.onSelected({
                point: null
            });
            $scope.$emit("transitCtrlAndTpl", {
                "loadType": 'attrTplContainer',
                "propertyCtrl": page.ctrlFile,
                "propertyHtml": appPath.root + page.tplFile
            });
        });
    }

    function getFeatDataCallback(data, id, type, ctrl, tpl) {
        dsEdit.getByPid(id, type).then(function(data) {
            getByPidCallback(type, ctrl, tpl, data, selectedData);
        });
    }

    function getByPidCallback(type, ctrl, tpl, data) {
        objCtrl.setCurrentObject(type, data);
        if (type == "IXPOI") {
            $scope.$emit("transitCtrlAndTpl", {
                "loadType": "tipsTplContainer",
                "propertyCtrl": appPath.poi + "ctrls/attr-tips/poiPopoverTipsCtl",
                "propertyHtml": appPath.root + appPath.poi + "tpls/attr-tips/poiPopoverTips.html"
            });
            $scope.$emit("transitCtrlAndTpl", {
                "loadType": "attrTplContainer",
                "propertyCtrl": ctrl,
                "propertyHtml": tpl
            });
            // initPoiData(selectedData,data);
        } else {
            $scope.$emit("transitCtrlAndTpl", {
                "loadType": 'attrTplContainer',
                "propertyCtrl": ctrl,
                "propertyHtml": tpl
            });
        }
    }
    //监听检查结果并获取
    /*eventController.on(eventController.eventTypes.CHEKCRESULT, function(event){
        $scope.rowCollection=event.errorCheckData;
    });*/
    /************** 数据格式化 **************/
    /*检查时间*/
    function getCreateData($scope, rows) {
        return rows;
    }

    function getOption($scope, rows) {
        return rows;
    }
    //高亮显示左侧列表的poi
    highlightPoi = function(pid) {
        highRenderCtrl.highLightFeatures.push({
            id: pid,
            layerid: 'poi',
            type: 'IXPOI',
            style: {}
        });
        //高亮
        highRenderCtrl.drawHighlight();
    }
    var getFeaturePage = function(featType, detailType) {
        var ret = {
            ctrlFile: null,
            tplFile: null
        };
        switch (featType) {
            case "RDLINK":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_link_ctrl/rdLinkCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html';
                break;
            case "RDNODE":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_node_ctrl/rdNodeFormCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_node_tpl/rdNodeFormTpl.html';
                break;
            case "RDSAMENODE": //同一点
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_same_ctrl/rdSameNodeCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_same_tpl/rdSameNodeTpl.html';
                break;
            case "RDSAMELINK": //同一线
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_same_ctrl/rdSameLinkCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_same_tpl/rdSameLinkTpl.html';
                break;
            case "RDVOICEGUIDE": //语音引导
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_voiceGuide_ctrl/voiceGuide';
                ret.tplFile = 'scripts/components/road/tpls/attr_voiceGuide_tpl/voiceGuide.html';
                break;
            case 'RDRESTRICTION':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_restriction_ctrl/rdRestriction';
                ret.tplFile = 'scripts/components/road/tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html';
                break;
            case 'RDLANECONNEXITY':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_connexity_ctrl/rdLaneConnexityCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_connexity_tpl/rdLaneConnexityTpl.html';
                break;
            case 'RDSPEEDLIMIT':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_speedLimit_ctrl/speedLimitCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_speedLimit_tpl/speedLimitTpl.html';
                break;
            case 'RDLINKSPEEDLIMIT':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_speedLimit_ctrl/linkSpeedLimitCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_speedLimit_tpl/linkSpeedLimitTpl.html';
                break;
            case 'DBRDLINKSPEEDLIMIT':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_speedLimit_ctrl/linkSpeedLimitCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_speedLimit_tpl/linkSpeedLimitTpl.html';
                break;
            case 'RDCROSS':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_cross_ctrl/rdCrossCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_cross_tpl/rdCrossTpl.html';
                break;
            case 'RDGSC':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_rdgsc_ctrl/rdGscCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_gsc_tpl/rdGscTpl.html';
                break;
            case 'RDWARNINGINFO': //警示信息
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_warninginfo_ctrl/warningInfoCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_warninginfo_tpl/warningInfoTpl.html';
                break;
            case 'RDTRAFFICSIGNAL':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_trafficSignal_ctrl/trafficSignalCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_trafficSignal_tpl/trafficSignalTpl.html';
                break;
            case 'RDDIRECTROUTE': //顺行
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_directroute_ctrl/directRouteCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_directroute_tpl/directRouteTpl.html';
                break;
            case 'RDSPEEDBUMP': //减速带
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_speedbump_ctrl/speedBumpCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_speedbump_tpl/speedBumpTpl.html';
                break;
            case 'RDSE': //分叉口
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_se_ctrl/rdSeCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_se_tpl/rdSeTpl.html';
                break;
            case 'RDTOLLGATE': //收费站
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_tollgate_ctrl/tollGateCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_tollgate_tpl/tollGateTpl.html';
                break;
            case 'RDVARIABLESPEED': //可变限速
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_variableSpeed_ctrl/variableSpeedCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_variableSpeed_tpl/variableSpeed.html';
                break;
            case 'RDELECTRONICEYE':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_electronic_ctrl/electronicEyeCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_electronic_tpl/electronicEyeTpl.html';
                break;
            case 'RDSLOPE':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_rdSlope_ctrl/rdSlopeCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_rdSlope_tpl/rdSlopeTpl.html';
                break;
            case 'RDINTER':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_rdcrf_ctrl/crfInterCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_rdcrf_tpl/crfInterTpl.html';
                break;
            case 'RDROAD':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_rdcrf_ctrl/crfRoadCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_rdcrf_tpl/crfRoadTpl.html';
                break;
            case 'RDOBJECT':
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_rdcrf_ctrl/crfObjectCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_rdcrf_tpl/crfObjectTpl.html';
                break;
            case 'RDGATE': //大门
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_gate_ctrl/rdGateCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_gate_tpl/rdGateTpl.html';
                break;
            case 'RDBRANCH':
                switch (detailType) {
                    case 0:
                        ret.ctrlFile = 'scripts/components/road/ctrls/attr_branch_ctrl/rdBranchCtrl';
                        ret.tplFile = 'scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html';
                        break;
                    case 1:
                        ret.ctrlFile = 'scripts/components/road/ctrls/attr_branch_ctrl/rdBranchCtrl';
                        ret.tplFile = 'scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html';
                        break;
                    case 2:
                        ret.ctrlFile = 'scripts/components/road/ctrls/attr_branch_ctrl/rdBranchCtrl';
                        ret.tplFile = 'scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html';
                        break;
                    case 3:
                        ret.ctrlFile = 'scripts/components/road/ctrls/attr_branch_ctrl/rdBranchCtrl';
                        ret.tplFile = 'scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html';
                        break;
                    case 4:
                        ret.ctrlFile = 'scripts/components/road/ctrls/attr_branch_ctrl/rdBranchCtrl';
                        ret.tplFile = 'scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html';
                        break;
                    case 5:
                        ret.ctrlFile = 'scripts/components/road/ctrls/attr_branch_ctrl/rdRealImageCtrl';
                        ret.tplFile = 'scripts/components/road/tpls/attr_branch_Tpl/realImageOfBranch.html';
                        break;
                    case 6:
                        ret.ctrlFile = 'scripts/components/road/ctrls/attr_branch_ctrl/rdSignAsRealCtrl';
                        ret.tplFile = 'scripts/components/road/tpls/attr_branch_Tpl/signAsRealOfBranch.html';
                        break;
                    case 7:
                        ret.ctrlFile = 'scripts/components/road/ctrls/attr_branch_ctrl/rdSeriesCtrl';
                        ret.tplFile = 'scripts/components/road/tpls/attr_branch_Tpl/seriesOfBranch.html';
                        break;
                    case 8:
                        ret.ctrlFile = 'scripts/components/road/ctrls/attr_branch_ctrl/rdSchematicCtrl';
                        ret.tplFile = 'scripts/components/road/tpls/attr_branch_Tpl/schematicOfBranch.html';
                        break;
                    case 9:
                        ret.ctrlFile = 'scripts/components/road/ctrls/attr_branch_ctrl/rdSignBoardCtrl';
                        ret.tplFile = 'scripts/components/road/tpls/attr_branch_Tpl/signBoardOfBranch.html';
                        break;
                }
                break;
            case "RWNODE":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_node_ctrl/rwNodeCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_node_tpl/rwNodeTpl.html';
                break;
            case "RWLINK":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_link_ctrl/rwLinkCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_link_tpl/rwLinkTpl.html';
                break;
            case "ADADMIN":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_administratives_ctrl/adAdminCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_adminstratives_tpl/adAdminTpl.html';
                break;
            case "ADNODE":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_administratives_ctrl/adNodeCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_adminstratives_tpl/adNodeTpl.html';
                break;
            case "ADLINK":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_administratives_ctrl/adLinkCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_adminstratives_tpl/adLinkTpl.html';
                break;
            case "ADFACE":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_administratives_ctrl/adFaceCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_adminstratives_tpl/adFaceTpl.html';
                break;
            case "ZONENODE":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_zone_ctrl/zoneNodeCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_zone_tpl/zoneNodeTpl.html';
                break;
            case "ZONELINK":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_zone_ctrl/zoneLinkCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_zone_tpl/zoneLinkTpl.html';
                break;
            case "ZONEFACE":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_zone_ctrl/zoneFaceCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_zone_tpl/zoneFaceTpl.html';
                break;
            case "LUNODE":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_lu_ctrl/luNodeCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_lu_tpl/luNodeTpl.html';
                break;
            case "LUFACE":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_lu_ctrl/luFaceCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_lu_tpl/luFaceTpl.html';
                break;
            case "LULINK":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_lu_ctrl/luLinkCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_lu_tpl/luLinkTpl.html';
                break;
            case "LCNODE":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_lc_ctrl/lcNodeCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_lc_tpl/lcNodeTpl.html';
                break;
            case "LCLINK":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_lc_ctrl/lcLinkCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_lc_tpl/lcLinkTpl.html';
                break;
            case "LCFACE":
                ret.ctrlFile = 'scripts/components/road/ctrls/attr_lc_ctrl/lcFaceCtrl';
                ret.tplFile = 'scripts/components/road/tpls/attr_lc_tpl/lcFaceTpl.html';
                break;
            case "IXPOI":
                ret.ctrlFile = 'scripts/components/poi/ctrls/attr-base/generalBaseCtl';
                ret.tplFile = 'scripts/components/poi/tpls/attr-base/generalBaseTpl.html';
                break;
        };
        return ret;
    };
    //重新设置选择工具
    var resetToolAndMap = function() {
        var layerCtrl = fastmap.uikit.LayerController();
        var editLayer = layerCtrl.getLayerById('edit');
        var rdLink = layerCtrl.getLayerById('rdLink');
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var selectCtrl = fastmap.uikit.SelectController();
        var eventCtrl = fastmap.uikit.EventController();
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        eventCtrl.off(eventCtrl.eventTypes.GETLINKID); //清除select**ShapeCtrl.js中的事件,防止菜单之间事件错乱
        eventCtrl.off(eventCtrl.eventTypes.GETADADMINNODEID);
        eventCtrl.off(eventCtrl.eventTypes.GETNODEID);
        eventCtrl.off(eventCtrl.eventTypes.GETRELATIONID);
        eventCtrl.off(eventCtrl.eventTypes.GETTIPSID);
        eventCtrl.off(eventCtrl.eventTypes.GETFACEID);
        eventCtrl.off(eventCtrl.eventTypes.RESETCOMPLETE);
        eventCtrl.off(eventCtrl.eventTypes.GETBOXDATA);
        eventCtrl.off(eventCtrl.eventTypes.GETRECTDATA);
        eventCtrl.off(eventCtrl.eventTypes.GETFEATURE);
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }
        map.scrollWheelZoom.enable();
        // if (event) { //取消点击菜单自动回收功能
        //     event.stopPropagation();
        // }
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures = [];
        editLayer.drawGeometry = null;
        editLayer.clear();
        editLayer.bringToBack();
        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
        shapeCtrl.stopEditing();
        rdLink.clearAllEventListeners();
        if (tooltipsCtrl.getCurrentTooltip()) {
            tooltipsCtrl.onRemoveTooltip();
        }
        if (map.currentTool) {
            map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
        }
        if (selectCtrl.rowKey) {
            selectCtrl.rowKey = null;
        }
        $(editLayer.options._div).unbind();
    };
}]);