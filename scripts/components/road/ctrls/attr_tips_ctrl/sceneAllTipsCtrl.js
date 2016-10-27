/**
 * Created by liuzhaoxia on 2016/1/5.
 */
var dataTipsApp = angular.module("app");
dataTipsApp.controller("sceneAllTipsController", ['$scope', '$timeout', '$ocLazyLoad', 'dsEdit', 'dsFcc', function($scope, $timeout, $ocLazyLoad, dsEdit, dsFcc) {
    //保存选取的元素ctrl
    var selectCtrl = fastmap.uikit.SelectController();
    //图层控制ctrl
    var layerCtrl = fastmap.uikit.LayerController();
    //属性编辑ctrl(解析对比各个数据类型)
    var objCtrl = fastmap.uikit.ObjectEditController();
    //线图层
    var rdLink = layerCtrl.getLayerById('rdLink');
    //交限图层
    var restrictLayer = layerCtrl.getLayerById("restriction");
    var workPoint = layerCtrl.getLayerById("workPoint");
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    //操作地图ctrl(划线，画点，移动等)
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var gpsLine = layerCtrl.getLayerById("gpsLine");
    var editLayer = layerCtrl.getLayerById('edit');
    //高亮
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    eventController = fastmap.uikit.EventController();
    $scope.outIdS = [];
    //全部要素配置
    $scope.featureConfig = fastmap.uikit.FeatureConfig.tip;
    //清除地图数据
    $scope.resetToolAndMap = function() {
        if (map.currentTool && typeof map.currentTool.cleanHeight === "function") {
            map.currentTool.cleanHeight();
            map.currentTool.disable(); //禁止当前的参考线图层的事件捕获
        }
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
        if (selectCtrl.rowKey) {
            selectCtrl.rowKey = null;
        }
        editLayer.drawGeometry = null;
        shapeCtrl.stopEditing();
        editLayer.bringToBack();
        $(editLayer.options._div).unbind();
        //$scope.changeBtnClass("");
        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
        editLayer.clear();
    };
    $scope.getFeatDataCallback = function(link, type) {
        $scope.resetToolAndMap();
        if(!link){
            return;
        }
        if(link.type == 1){
            dsEdit.getByPid(link.id, type).then(function(data) {
                var options = {};
                if (!data) {
                    return;
                }
                if (data.errcode === -1) {
                    swal("", data.errmsg, "提示信息");
                    return;
                }
                if (type === "RDLINK") {
                    var linkArr = data.geometry.coordinates,
                        points = [];
                    for (var i = 0, len = linkArr.length; i < len; i++) {
                        var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                        points.push(point);
                    }
                    map.panTo({
                        lat: points[0].y,
                        lon: points[0].x
                    });
                    var line = fastmap.mapApi.lineString(points);
                    selectCtrl.onSelected({
                        geometry: line,
                        id: $scope.dataId
                    });
                    highRenderCtrl.highLightFeatures.push({
                        id: data.pid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {}
                    });
                    highRenderCtrl.drawHighlight();
                    options = {
                        "loadType": 'attrTplContainer',
                        "propertyCtrl": "scripts/components/road/ctrls/attr_link_ctrl/rdLinkCtrl",
                        "propertyHtml": "../../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html"
                    };
                }else if(type== "RDNODE"){
                    highRenderCtrl.highLightFeatures.push({
                        id: data.pid.toString(),
                        layerid: 'rdNode',
                        type: 'node',
                        style: {}
                    });
                    highRenderCtrl.drawHighlight();
                    options = {
                        "loadType": 'attrTplContainer',
                        "propertyCtrl": "scripts/components/road/ctrls/attr_node_ctrl/rdNodeFormCtrl",
                        "propertyHtml": "../../../scripts/components/road/tpls/attr_node_tpl/rdNodeFormTpl.html"
                    };
                }
                objCtrl.setCurrentObject(type, data);
                $scope.$emit("transitCtrlAndTpl", options);
            });
        }else{
            dsFcc.getTipsResult(link.id).then(function(data){
                if (!data) {
                    return;
                }
                if (data.errcode === -1) {
                    swal("", data.errmsg, "提示信息");
                    return;
                }
                if (type === "RDLINK") {
                    var laneLocation = data.geo.coordinates,
                        geoLocation = data.g_location.coordinates,
                        points = [];
                    for (var i = 0, len = geoLocation.length; i < len; i++) {
                        var point = fastmap.mapApi.point(geoLocation[i][0], geoLocation[i][1]);
                        points.push(point);
                    }
                    map.panTo({
                        lat: laneLocation[1],
                        lon: laneLocation[0]
                    });
                    var line = fastmap.mapApi.lineString(points);
                    selectCtrl.onSelected({
                        geometry: line,
                        id: data.id
                    });
                    highRenderCtrl.highLightFeatures.push({
                        id: link.id,
                        layerid: 'workPoint',
                        type: 'workPoint',
                        style: {}
                    });
                    highRenderCtrl.drawHighlight();
                }
                // objCtrl.setCurrentObject(type, data);
                /*var options = {
                    "loadType": 'attrTplContainer',
                    "propertyCtrl": "scripts/components/road/ctrls/attr_link_ctrl/rdLinkCtrl",
                    "propertyHtml": "../../../scripts/components/road/tpls/attr_link_tpl/rdLinkTpl.html"
                };
                $scope.$emit("transitCtrlAndTpl", options);*/
            });
        }

    };
    /*车信高亮link*/
    $scope.highlightSymbol = function(id){
        if (!id) {
            return;
        }
        highRenderCtrl.highLightFeatures.push({
            id: id.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {
                strokeColor: '#21ed25'
            }
        });
        highRenderCtrl.drawHighlight();
    };
    $scope.showItem = function(index) {
        $scope.wArrayitem = $scope.dataTipsData.w_array[index];
    };
    $scope.showMutiInfoItem = function(index) {
        $scope.oArrayItem = $scope.dataTipsData.o_array[index];
    };
    //初始化DataTips相关数据
    $scope.initializeDataTips = function(data) {
        if (data == -1) {
            return;
        }
        $scope.photos = [];
        $scope.audios = [];
        $scope.remarksContent = null;
        $scope.dataTipsData = data; //selectCtrl.rowKey;
        $scope.rowkey = $scope.dataTipsData.rowkey;
        $scope.allTipsType = $scope.dataTipsData.s_sourceType;
        var highLightFeatures = [];
        highLightFeatures.push({
            id: $scope.dataTipsData.rowkey,
            layerid: 'workPoint',
            type: 'workPoint',
            style: {}
        });

        var lastTrackInfo = data.t_trackInfo[data.t_trackInfo.length - 1];
        $scope.disabledFlag = false; //标识状态可以点击
        if(lastTrackInfo && lastTrackInfo.stage == 2){
            $scope.disabledFlag = true;//标识状态不可以点击
        }

        //显示状态
        if ($scope.dataTipsData) {
            switch ($scope.dataTipsData.t_lifecycle) {
                case 1:
                    $scope.showContent = "外业删除";
                    break;
                case 2:
                    $scope.showContent = "外业修改";
                    $scope.labelInfo = false;
                    $scope.labelSuc = true;
                    break;
                case 3:
                    $scope.showContent = "外业新增";
                    $scope.labelInfo = true;
                    $scope.labelSuc = false;
                    break;
                case 0:
                    $scope.showContent = "默认值";
                    break;
            }
        }
        $scope.wArrayitem = {};
        $scope.oArrayItem = {};
        $scope.schemaType = '';
        $scope.timeDomain = '';
        $scope.sceneExit = '';
        $scope.scheName = '';
        $scope.JVCSchemaNo = '';
        $scope.roadCameraType = '';
        $scope.loc = '';
        $scope.tollGateTp = '';
        $scope.TollETC = '';
        $scope.tollGateLoc = '';
        $scope.mileageNum = '';
        $scope.mileageNm = '';
        $scope.mileageSrc = '';
        $scope.busDriveway = '';
        $scope.variableDirectionInfo = '';
        switch ($scope.allTipsType) {
            case "1101": //点限速
                $scope.speedDirectTypeOptions = [{
                    "id": 0,
                    "label": "未调查"
                }, {
                    "id": 2,
                    "label": "顺方向"
                }, {
                    "id": 3,
                    "label": "逆方向"
                }];
                for (var i in $scope.speedDirectTypeOptions) {
                    if ($scope.speedDirectTypeOptions[i].id == $scope.dataTipsData.rdDir) {
                        $scope.rdDir = $scope.speedDirectTypeOptions[i].label;
                    }
                }
                $scope.limitSrcOption = [{
                    "id": 0,
                    "label": "无"
                }, {
                    "id": 1,
                    "label": "现场标牌"
                }, {
                    "id": 2,
                    "label": "城区标识"
                }, {
                    "id": 3,
                    "label": "高速标识"
                }, {
                    "id": 4,
                    "label": "车道限速"
                }, {
                    "id": 5,
                    "label": "方向限速"
                }, {
                    "id": 6,
                    "label": "机动车限速"
                }, {
                    "id": 7,
                    "label": "匝道未调查"
                }, {
                    "id": 8,
                    "label": "缓速行驶"
                }, {
                    "id": 9,
                    "label": "未调查"
                }];
                for (var i in $scope.limitSrcOption) {
                    if ($scope.limitSrcOption[i].id == $scope.dataTipsData.src) {
                        $scope.limitSrc = $scope.limitSrcOption[i].label;
                    }
                }
                $scope.limitDesc = $scope.dataTipsData.desc;
                break;
            case "1102": //红绿灯
                var trafficLightArr = $scope.dataTipsData.f_array;
                $scope.inCt = $scope.dataTipsData.inCt;
                $scope.dataTipsData.enableCtl = [];
                $scope.dataTipsData.disableCtl = [];
                // if(trafficLightArr){
                try {
                    for (var i = 0, len = trafficLightArr.length; i < len; i++) {
                        if (trafficLightArr[i].ctrl == 1) {
                            $scope.dataTipsData.enableCtl.push(trafficLightArr[i]);
                        } else {
                            $scope.dataTipsData.disableCtl.push(trafficLightArr[i]);
                        }
                    }
                } catch (e) {
                    console.log(e.toLocaleString());
                }
                // }
                $scope.dataTipsData.isTrafficLights = true;
                break;
            case "1103": //红绿灯方向
                $scope.linkPid = $scope.dataTipsData.in.id;
                var directionObj = {
                    0: '未调查',
                    1: '左',
                    2: '右',
                    3: '左右',
                    4: '上',
                    5: '左上',
                    6: '右上',
                    7: '左上右'
                };
                $scope.dataTipsData.traffDirection = directionObj[$scope.dataTipsData.loc];
                $scope.dataTipsData.isTrafficLightsDir = true;
                break;
            case "1104": //大门
                $scope.inLinkPid = $scope.dataTipsData.in.id;
                $scope.outLinkPid = "";
                if($scope.dataTipsData.out){
                    $scope.outLinkPid = $scope.dataTipsData.out.id;
                }
                var gateTypeObj = {
                    0: 'EG',
                    1: 'KG',
                    2: 'PG'
                };
                var gateDirObj = {
                    0: '未调查',
                    1: '单向',
                    2: '双向'
                };
                $scope.dataTipsData.gateType = gateTypeObj[$scope.dataTipsData.tp];
                $scope.dataTipsData.gateDir = gateDirObj[$scope.dataTipsData.dir];
                $scope.dataTipsData.isGate = true;
                break;
            case "1105":
                $scope.wArrayitem = $scope.dataTipsData.w_array[0];
                $scope.dangerTypeObj = {
                    "10501": "上陡坡",
                    "10502": "下陡坡",
                    "10701": "两侧变窄",
                    "13401": "事故易发路段",
                    "13703": "交通意外黑点",
                    "20301": "会车让行",
                    "20101": "停车让行",
                    "11802": "傍山险路(右)",
                    "11801": "傍山险路(左)",
                    "20201": "减速让行",
                    "10901": "双向交通",
                    "10301": "反向弯路a",
                    "10702": "右侧变窄",
                    "13603": "右侧绕行",
                    "10202": "向右急弯路",
                    "10201": "向左急弯路",
                    "11902": "堤坝路(右)",
                    "11901": "堤坝路(左)",
                    "10703": "左侧变窄",
                    "13602": "左侧绕行",
                    "13601": "左右绕行",
                    "13702": "文字性警示标牌",
                    "13101": "斜杠符号a50米",
                    "13102": "斜杠符号b100米",
                    "13103": "斜杠符号c150米",
                    "12901": "无人看守铁路道口",
                    "11701": "易滑",
                    "12801": "有人看守铁路道口",
                    "12001": "村庄",
                    "11101": "注意儿童",
                    "13701": "注意危险",
                    "14402": "注意右侧合流",
                    "14401": "注意左侧合流",
                    "11601": "注意横风",
                    "14101": "注意潮汐车道",
                    "11201": "注意牲畜",
                    "11502": "注意落石(右)",
                    "11501": "注意落石(左)",
                    "22901": "禁止超车",
                    "10801": "窄桥",
                    "23001": "解除禁止超车",
                    "12401": "路面不平",
                    "12601": "路面低洼",
                    "12501": "路面高凸",
                    "12701": "过水路面",
                    "10601": "连续下坡",
                    "10401": "连续弯路",
                    "14001": "隧道开车灯",
                    "12301": "驼峰桥",
                    "31501": "鸣喇叭"
                };
                $scope.dataTipsData.linkRoad = $scope.dataTipsData.in;
                break;
            case "1106": //坡度
                var slopeTypeObj = {
                    0: '未调查',
                    1: '水平',
                    2: '上坡',
                    3: '下坡'
                };
                var endSlopeFlagObj = {
                    0: '否',
                    1: '是'
                };
                $scope.dataTipsData.slopeType = slopeTypeObj[$scope.dataTipsData.tp];
                $scope.dataTipsData.endSlopeFlag = endSlopeFlagObj[$scope.dataTipsData.end];
                $scope.dataTipsData.isSlope = true;
                break;
            case "1107": //收费站
                $scope.TollType = [{
                    "id": 0,
                    "label": "未调查"
                }, {
                    "id": 1,
                    "label": "领卡"
                }, {
                    "id": 2,
                    "label": "交卡付费"
                }, {
                    "id": 3,
                    "label": "固定收费(次费)"
                }, {
                    "id": 4,
                    "label": "交卡付费后再领卡"
                }, {
                    "id": 5,
                    "label": "交卡付费并代收固定费用"
                }, {
                    "id": 6,
                    "label": "验票(无票收费)值先保留"
                }, {
                    "id": 7,
                    "label": "领卡并代收固定费用"
                }, {
                    "id": 8,
                    "label": "持卡打标识不收费"
                }, {
                    "id": 9,
                    "label": "验票领卡"
                }, {
                    "id": 10,
                    "label": "交卡不收费"
                }];
                for (var i in $scope.TollType) {
                    if ($scope.TollType[i].id == $scope.dataTipsData.tp) {
                        $scope.tollGateTp = $scope.TollType[i].label;
                    }
                }
                $scope.TollETC = $scope.dataTipsData.etc.join(',');
                $scope.TollLoc = [{
                    "id": 0,
                    "label": "未调查"
                }, {
                    "id": 1,
                    "label": "否"
                }, {
                    "id": 2,
                    "label": "是"
                }];
                for (var i in $scope.TollLoc) {
                    if ($scope.TollLoc[i].id == $scope.dataTipsData.loc) {
                        $scope.tollGateLoc = $scope.TollLoc[i].label;
                    }
                }
                $scope.dataTipsData.linkRoad = $scope.dataTipsData.in;
                delete $scope.dataTipsData.out;
                break;
            case "1109": //电子眼
                var limitFlagObj = {
                    "0": "限速开始",
                    "1": "限速解除"
                };
                $scope.limitFlag = limitFlagObj[$scope.dataTipsData.se];
                var typeObj = {
                    "1": "限速摄像头",
                    "13": "非机动车道摄像头",
                    "15": "公交车道摄像头",
                    "16": "禁止左/右转摄像头",
                    "20": "区间测速开始",
                    "21": "区间测速结束"
                };
                $scope.roadCameraType = typeObj[$scope.dataTipsData.tp];
                var loc = {
                    "0": "未调查",
                    "1": "左",
                    "2": "右",
                    "4": "上"
                };
                $scope.loc = loc[$scope.dataTipsData.loc];
                break;
            case '1110': //卡车限制
                $scope.dataTipsData.isLimitTruck = true;
                break;
            case "1111": //条件限速
                $scope.dataTipsData.limitConditionObj = {
                    1:'雨天',
                    2:'雪天',
                    3:'雾天',
                    6:'学校',
                    10:'时间限制',
                    12:'季节时段'
                };
                for (var i = 0 ; i < $scope.dataTipsData.d_array.length; i ++){
                    if(!$scope.dataTipsData.d_array[i].time){
                        $scope.dataTipsData.d_array[i].time = "- - - - - -";
                    }
                }
                $scope.dataTipsData.isConditionLimit = true;
                break;
            case "1112":
                var limitDirObj = {
                    0: '未调查',
                    1: '左',
                    2: '右',
                    3: '上'
                };
                $scope.dataTipsData.limitDir = limitDirObj[$scope.dataTipsData.loc];
                $scope.dataTipsData.isVariableSpeedLimit = true;
                break;
            case "1113":
                var limitValue = $scope.dataTipsData.value;
                limitValue.sort(function(a, b) {
                    return a < b ? 1 : -1;
                });
                for (var i = 0, len = limitValue.length; i < len; i++) {
                    if (i != len - 1) {
                        $scope.limitValue = limitValue[i] + '|';
                    } else {
                        $scope.limitValue = limitValue[i];
                    }
                }
                $scope.dataTipsData.limitValue = limitValue.join('|');
                $scope.dataTipsData.isDrivewayLimit = true;
                break;
            case "1201": //道路种别
                $scope.returnKindType = function(code) {
                    switch (code) {
                        case 0:
                            return '作业中';
                        case 1:
                            return "高速道路";
                        case 2:
                            return "城市高速";
                        case 3:
                            return "国道";
                        case 4:
                            return "省道";
                        case 5:
                            return "预留";
                        case 6:
                            return "县道";
                        case 7:
                            return "乡镇村道路";
                        case 8:
                            return "其他道路";
                        case 9:
                            return "非引导道路";
                        case 10:
                            return "步行道路";
                        case 11:
                            return "人渡";
                        case 13:
                            return "轮渡";
                        case 15:
                            return "10级路（障碍物）";
                    }
                };
                $scope.kindType = $scope.returnKindType($scope.dataTipsData.kind);
                break;
            case "1202": //车道数
                var sideObj = {
                    0: '不应用',
                    1: '左',
                    2: '右'
                };
                $scope.dataTipsData.sideDir = sideObj[$scope.dataTipsData.side];
                break;
            case "1203": //道路方向
                if ($scope.dataTipsData.dr == 1) {
                    $scope.drs = "双方向";
                } else {
                    $scope.drs = "单方向";
                }
                $scope.fData = $scope.dataTipsData.f;
                $scope.time = $scope.dataTipsData.time;
                break;
            case "1204": //可逆车道
                $scope.dataTipsData.isReversibleLine = true;
                break;
            case "1205": //SA
                $scope.fData = $scope.dataTipsData.f;
                break;
            case "1206": //PA
                $scope.fData = $scope.dataTipsData.f;
                break;
            case "1207": //匝道
                var commandObj = {
                    0: '不应用',
                    1: '删除',
                    2: '修改',
                    3: '新增'
                };
                $scope.dataTipsData.commandData = commandObj[$scope.dataTipsData.t_command];
                break;
            case "1208":
                break;
            case "1301": //车信
                $scope.oarrayData = $scope.dataTipsData.o_array;
                for (var i in $scope.oarrayData) {
                    for (var j in $scope.oarrayData[i].d_array) {
                        for (var m in $scope.oarrayData[i].d_array[j].out) {
                            $scope.outIdS.push({
                                id: $scope.oarrayData[i].d_array[j].out[m].id
                            });
                            highRenderCtrl.highLightFeatures.push({
                                id: $scope.oarrayData[i].d_array[j].out[m].id.toString(),
                                layerid: 'rdLink',
                                type: 'line',
                                style: {}
                            });
                        }
                    }
                }
                break;
            case "1302": //交限
                //高亮
                /* $scope.restrictOutLinks = [];*/
                $scope.restrictOutLinks = $scope.dataTipsData.o_array[0].out;
                var detailsOfHigh = $scope.dataTipsData.o_array;
                highLightFeatures.push({
                    id: $scope.dataTipsData.in.id,
                    layerid: 'rdLink',
                    type: 'line',
                    style: {}
                });
                for (var hiNum = 0, hiLen = detailsOfHigh.length; hiNum < hiLen; hiNum++) {
                    var outLinksOfHigh = detailsOfHigh[hiNum].out;
                    if (outLinksOfHigh !== undefined) {
                        for (var outNum = 0, outLen = outLinksOfHigh.length; outNum < outLen; outNum++) {
                            highLightFeatures.push({
                                id: outLinksOfHigh[outNum].id,
                                layerid: 'rdLink',
                                type: 'line',
                                style: {}
                            });
                        }
                    }
                }
                break;
            case "1303": //卡车交限
                $scope.oArrayItem = $scope.dataTipsData.o_array[0];
                $scope.outsideCarObj = {
                    0: '不应用',
                    1: '仅限制外埠车辆',
                    2: '仅限制本埠车辆'
                };
                break;
            case "1304": //禁止穿行
                $scope.dataTipsData.isNoCrossing = true;
                break;
            case "1305": //禁止驶入
                $scope.dataTipsData.eliminateCarObj = [
                    {
                        "id": 1,
                        "label": '客车'
                    },
                    {
                        "id": 2,
                        "label": '配送卡车'
                    },
                    {
                        "id": 3,
                        "label": '运输卡车'
                    },
                    {
                        "id": 5,
                        "label": '出租车'
                    }
                ];
                for (var i = 0, len = $scope.dataTipsData.eliminateCarObj.length; i < len; i++) {
                    for(var j=0;j<$scope.dataTipsData.vt.length;j++){
                        if ($scope.dataTipsData.eliminateCarObj[i].id == $scope.dataTipsData.vt[j]) {
                            $scope.dataTipsData.eliminateCarObj[i].checked = true;
                        }
                    }
                }
                $scope.dataTipsData.isNoDriveIn = true;
                break;
            case "1306": //路口语音引导
                $scope.oArrayItem = $scope.dataTipsData.o_array[0];
                break;
            case "1308": //外埠车辆限制
                $scope.outsideCarLimit = $scope.dataTipsData.c_array[0].out;
                $scope.outsideCarObj = {
                    0: '不应用',
                    1: '仅限制外埠车辆',
                    2: '仅限制本埠车辆'
                };
                if ($scope.dataTipsData.c_array[0].time) {
                    $scope.timeDomain = $scope.dataTipsData.c_array[0].time.split(';');
                }
                break;
            case "1311": //可变导向车道
                $scope.variableDirectionInfo = $scope.dataTipsData.var.join(',');
                $scope.dataTipsData.isVariableDirectionLane = true;
                break;
            case "1401": //方向看板
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in;
                /*退出*/
                $scope.sceneOut = $scope.dataTipsData.o_array;
                break;
            case "1402": //real sign
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in.id;
                /*退出*/
                $scope.sceneOut = $scope.dataTipsData.o_array;
                break;
            case "1403": //3D
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in;
                /*退出*/
                $scope.sceneOut = $scope.dataTipsData.o_array;
                /*模式图号*/
                $scope.dataTipsData.schemaNo = $scope.dataTipsData.ptn;
                break;
            case "1404": //提左提右
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in;
                /*退出*/
                $scope.sceneOut = $scope.dataTipsData.o_array;
                /*模式图*/
                $scope.dataTipsData.leftAndRightSchemaNo = $scope.dataTipsData.ptn;
                $scope.dataTipsData.leftAndRight = true;
                break;
            case "1405": //一般道路方面
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in;
                /*退出数组*/
                $scope.sceneOut = $scope.dataTipsData.o_array;
                $scope.dataTipsData.isGeneralRoad = true;
                break;
            case "1406": //实景图
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in.id;
                /*实景图代码*/
                $scope.dataTipsData.JVCSchemaNo = $scope.dataTipsData.ptn;
                /*实景图类型*/
                if ($scope.dataTipsData.tp == 1) {
                    $scope.schemaType = "普通路口";
                } else if ($scope.dataTipsData.tp == 3) {
                    $scope.schemaType = "高速入口";
                } else {
                    $scope.schemaType = "高速出口";
                }
                $scope.dataTipsData.realImgArray = [];
                for (var i = 0, len = $scope.dataTipsData.o_array.length; i < len; i++) {
                    $scope.dataTipsData.realImgArray.push($scope.dataTipsData.o_array[i].out);
                }
                break;
            case "1407": //高速分歧
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in.id;
                /*模式图号*/
                $scope.dataTipsData.schemaNo = $scope.dataTipsData.ptn;
                $scope.scheName = $scope.dataTipsData.name;
                /*出口编号*/
                /*$scope.sceneExit = [];
                $.each($scope.dataTipsData.o_array, function(i, v) {
                    if (v.out) {
                        $scope.sceneExit.push(v.out.id);
                    }
                });*/
                $scope.dataTipsData.isBranch = true;
                break;
            case "1409": //普通路口模式图
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in.id;
                /*退出*/
                $scope.bottomPicture = $scope.dataTipsData.ptn;
                break;
            case "1501": //上下线分离
                $scope.upperAndLowerArrayLink = $scope.dataTipsData.f_array;
                break;
            case "1502": //路面覆盖
                $scope.roadArrayLink = $scope.dataTipsData.f_array;
                break;
            case "1510": //桥
                $scope.brigeArrayLink = $scope.dataTipsData.f_array;
                break;
            case "1514": //施工
                $scope.constructionArrayLink = $scope.dataTipsData.f_array;
                if ($scope.dataTipsData.time) {
                    $scope.timeDomain = $scope.dataTipsData.time.split(';');
                }
                break;
            case "1515": //维修
                $scope.constructionArrayLink = $scope.dataTipsData.f_array;
                if ($scope.dataTipsData.time) {
                    $scope.timeDomain = $scope.dataTipsData.time.split(';');
                }
                break;
            case "1517": //Usage Fee Required
                $scope.dataTipsData.usageEliminateCarObj = [
                    {
                        "id": 1,
                        "label": '客车'
                    },
                    {
                        "id": 2,
                        "label": '配送卡车'
                    },
                    {
                        "id": 3,
                        "label": '运输卡车'
                    },
                    {
                        "id": 5,
                        "label": '出租车'
                    },
                    {
                        "id": 6,
                        "label": '公交车'
                    }
                ];
                for (var i = 0, len = $scope.dataTipsData.usageEliminateCarObj.length; i < len; i++) {
                    if ($scope.dataTipsData.usageEliminateCarObj[i].id == $scope.dataTipsData.vt[i]) {
                        $scope.dataTipsData.usageEliminateCarObj[i].checked = true;
                    }
                }
                $scope.dataTipsData.isUsageFeeRequired = true;
                break;
            case "1604": //区域内道路
                $scope.fData = $scope.dataTipsData.f_array;
                $scope.zoneRoadState = [{
                    "type": 0,
                    "state": "不应用"
                }, {
                    "type": 1,
                    "state": "删除"
                }, {
                    "type": 2,
                    "state": "修改"
                }, {
                    "type": 3,
                    "state": "新增"
                }];
                $scope.dataTipsData.regionRoad = true;
                break;
            case "1606": //收费站开放道路
                /*$scope.fData = $scope.dataTipsData.f_array;
                $scope.zoneRoadState = [{
                    "type": 0,
                    "state": "不应用"
                }, {
                    "type": 1,
                    "state": "删除"
                }, {
                    "type": 2,
                    "state": "修改"
                }, {
                    "type": 3,
                    "state": "新增"
                }];
                $scope.dataTipsData.regionRoad = true;*/
                break;
            case "1703":
                $scope.sceneEnty = $scope.dataTipsData.in;
                $scope.sceneOut = $scope.dataTipsData.out;
                break;
            case "1704": //交叉路口
                $scope.fData = $scope.dataTipsData;
                $scope.dataTipsData.isCrossRoad = true;
                break;
            case "1707": //里程桩
                $scope.dataTipsData.isMileage = true;
                break;
            case "1801": //立交
                $scope.upperAndLowerArrayLink = $scope.dataTipsData.f_array;
                break;
            case "1803": //挂接
                if ($scope.dataTipsData.pcd) { //有图片时，显示图片
                    $scope.pcd = "../../../images/road/hook/" + $scope.dataTipsData.pcd.substr(5, 4) + ".svg";
                    //$scope.pcd="./css/hook/2081.svg";
                } else { //无图片时获取经纬度，高亮
                    $scope.garray = $scope.dataTipsData.g_array;
                    if ($scope.garray.geo.type == "Point") {} else if ($scope.garray.geo.type == "Line") {}
                }
                break;
            case "1806": // 草图
                break;
            case "1901": //道路名
                $scope.nArrayData = $scope.dataTipsData.n_array;
                /*       highLightFeatures.push({
                 id:$scope.dataTipsData.rowkey.toString(),
                 layerid:'gpsLine',
                 type:'gpsLine',
                 style:{}
                 });*/
                break;
            case "2001": //测线
                $scope.returnLineType = function(code) {
                        switch (code) {
                            case 0:
                                return '作业中';
                            case 1:
                                return "高速道路";
                            case 2:
                                return "城市高速";
                            case 3:
                                return "国道";
                            case 4:
                                return "省道";
                            case 5:
                                return "预留";
                            case 6:
                                return "县道";
                            case 7:
                                return "乡镇村道路";
                            case 8:
                                return "其他道路";
                            case 9:
                                return "非引导道路";
                            case 10:
                                return "步行道路";
                            case 11:
                                return "人渡";
                            case 13:
                                return "轮渡";
                            case 15:
                                return "10级路（障碍物）";
                        }
                    }
                    /*测线来源*/
                $scope.returnLineSrc = function(code) {
                    switch (code) {
                        case 0:
                            return 'GPS测线';
                        case 1:
                            return '惯导测线';
                        case 2:
                            return '自绘测线';
                        case 3:
                            return '影像矢量测线';
                        case 4:
                            return '情报';
                    }
                }
                if ($scope.dataTipsData) {
                    /*种别*/
                    $scope.dataTipsData.lineType = $scope.returnLineType($scope.dataTipsData.kind);
                    /*来源*/
                    $scope.dataTipsData.lineSrc = $scope.returnLineSrc($scope.dataTipsData.src);
                    /*车道数*/
                    $scope.dataTipsData.carNumber = $scope.dataTipsData.ln;
                    /*长度*/
                    $scope.dataTipsData.lineLength = $scope.dataTipsData.len;
                }
                $scope.dataTipsData.isMeasuringLine = true;
                break;
        }
        /*时间段*/
        if ($scope.dataTipsData.time) {
            $scope.timeDomain = $scope.dataTipsData.time.split(';');
        }else{
        	$scope.timeDomain = [];
        }
        var dir = {
            "0": "不应用",
            "2": "顺方向",
            "3": "逆方向"
        };
        var sourceCodeObj = {
            1: '情报',
            2: '外业现场',
            3: '代理店',
            4: '监察',
            5: '常规',
            6: '人行过道',
            7: '多源',
            8: '众包',
            11: '成果数据mark',
            13: '数据挖掘'
        };
        $scope.sourceCode = sourceCodeObj[$scope.dataTipsData.s_sourceCode];
        $scope.rdDir = dir[$scope.dataTipsData.rdDir];
        //高亮
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
        /**
         * 图片、语音、备注
         */
        var fArray = $scope.dataTipsData.feedback.f_array;
        $scope.tipsPhotos = [];
        var content;
        for (var i in fArray) {
            if (fArray[i].type === 1) {
                content = App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + fArray[i].content + '",type:"thumbnail"}';
                $scope.photos.push(content);
                $scope.tipsPhotos.push(content);
            } else if (fArray[i].type === 2) {
                content = fArray[i].content;
                $scope.audios.push(content);
            } else if (fArray[i].type === 3) {
                $scope.remarksContent = fArray[i].content;
            }
        }
        /**
         * 图片数量为4个，没有那么多图片是用noimg.png 代替
         * @type {Number}
         */
        if ($scope.photos.length != 0 && $scope.photos.length < 4) {
            for (var a = $scope.photos.length; a < 4; a++) {
                var img = "../../../images/road/img/noimg.png";
                $scope.photos.push(img);
            }
        } else {
            for (var j = 0; j < 4; j++) {
                var newImg = "../../../images/road/img/noimg.png";
                $scope.photos.push(newImg);
            }
        }
    };
    if (selectCtrl.rowKey) {
        //dataTips的初始化数据
        $scope.initializeDataTips(selectCtrl.rowKey);
    }
    //打开图片大图页面
    $scope.openOriginPic = function(id) {
        selectCtrl.rowKey = $scope.dataTipsData;
        selectCtrl.rowKey["pictureId"] = id;
        var openOriginObj = {
            "loadType": "tipsPitureContainer",
            "propertyCtrl": "scripts/components/road/ctrls/attr_tips_ctrl/tipsPictureCtrl",
            "propertyHtml": "../../../scripts/components/road/tpls/attr_tips_tpl/tipsPictureTpl.html"
        };
        $scope.$emit("transitCtrlAndTpl", openOriginObj);
    };
    $scope.noPic = function() {
        swal("没有照片资料", "", "");
    };
    $scope.openAudio = function(id) {
        selectCtrl.rowKey["VideoId"] = id;
        var openVideoObj = {
            "loadType": "tipsVideoContainer",
            "propertyCtrl": "components/road/ctrls/attr_tips_ctrl/tipsVideoCtrl",
            "propertyHtml": "../../scripts/components/road/tpls/attr_tips_tpl/tipsVideoTpl.html"
        };
        $scope.$emit("transitCtrlAndTpl", openVideoObj);
    };
    $scope.noAudio = function() {
        swal("没有音频资料", "", "");
    };
    eventController.on(eventController.eventTypes.SELECTBYATTRIBUTE, function(event) {
        if (event.feather) {
            $scope.initializeDataTips(event.feather);
        }
        // $scope.$apply();
    });
    $scope.createRestrictByTips = function() {
        var info = null;
        dsEdit.getByPid($scope.dataTipsData.in.id, "RDLINK").then(function(data) {
            var restrictObj = {};
            restrictObj["inLinkPid"] = parseInt($scope.dataTipsData.in.id);
            var dataTipsGeo = $scope.dataTipsData.g_location.coordinates;
            var outLinkPids = [];
            for (var outNum = 0, outLen = $scope.dataTipsData.o_array.length; outNum < outLen; outNum++) {
                var outLinks = $scope.dataTipsData.o_array[outNum].out;
                if (!outLinks) {
                    alert("没有退出线，请手动建立交限");
                    return;
                }
                for (var outLinksN = 0, outLinksL = outLinks.length; outLinksN < outLinksL; outLinksN++) {
                    outLinkPids.push(parseInt(outLinks[outLinksN].id));
                }
            }
            restrictObj["outLinkPids"] = outLinkPids;
            var inLinkGeo = data.geometry.coordinates,
                inNode;
            if (data.direct === 1) {
                var dataTipsToStart = Math.abs(dataTipsGeo[0] - inLinkGeo[0][0]) + Math.abs(dataTipsGeo[1] - inLinkGeo[0][1]);
                var dataTipsToEnd = Math.abs(dataTipsGeo[0] - inLinkGeo[inLinkGeo.length - 1][0]) + Math.abs(dataTipsGeo[1] - inLinkGeo[inLinkGeo.length - 1][1]);
                if (dataTipsToStart - dataTipsToEnd) {
                    inNode = parseInt(data.eNodePid)
                } else {
                    inNode = parseInt(data.sNodePid);
                }
            } else {
                if (data.direct === 2) {
                    inNode = parseInt(data.eNodePid);
                } else if (data.direct === 3) {
                    inNode = parseInt(data.sNodePid);
                }
            };
            restrictObj['nodePid'] = inNode;
            dsEdit.create("RDRESTRICTION", restrictObj).then(function(data) {
                if (data.errcode === -1) {
                    info = [{
                        "op": data.errcode,
                        "type": data.errmsg,
                        "pid": data.errid
                    }];
                    $scope.$emit('getConsoleInfo', info);
                    return;
                }
                var pid = data.log[0].pid;
                restrictLayer.redraw(); //交限图层刷新
                workPoint.redraw(); //dataTip图层刷新
                $scope.upBridgeStatus();
                dsEdit.getByPid(pid, "RDRESTRICTION").then(function(data) {
                    objCtrl.setCurrentObject("RDRESTRICTION", data);
                    var restrictObj = {
                        "loadType": "attrTplContainer",
                        "propertyCtrl": "components/road/ctrls/attr_restriction_ctrl/rdRestriction",
                        "propertyHtml": "../../scripts/components/road/tpls/attr_restrict_tpl/rdRestricOfOrdinaryTpl.html"
                    };
                    $scope.$emit("transitCtrlAndTpl", restrictObj);
                });
            });
        });
    };
    /*转换*/
    $scope.transBridge = function(e) {
        var stageLen = $scope.dataTipsData.t_trackInfo.length;
        var stage = parseInt($scope.dataTipsData.t_trackInfo[stageLen - 1]['stage']);
        if ($scope.dataTipsData.s_sourceType === "2001") { //测线
            //修改测线的数据格式
            var paramOfLink = {
                "eNodePid": 0,
                "sNodePid": 0,
                "kind": $scope.dataTipsData.kind,
                "laneNum": $scope.dataTipsData.ln,
                "geometry": {
                    "type": "LineString",
                    "coordinates": $scope.dataTipsData.g_location.coordinates
                },
                "catchLinks": []
            };
            //等于3时不允许修改
            if ($scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length - 1].stage == 3) {
                $timeout(function() {
                    $.showPoiMsg('状态已为 【回prj_gdb库】 ，不允许改变状态！', e);
                    // $scope.$apply();
                });
                return;
            } else if ($scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length - 1].stage != 3 && $scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length - 1].stage != 1) {
                $timeout(function() {
                    $.showPoiMsg('只有外业采集数据可进行转换', e);
                    // $scope.$apply();
                });
                return;
            }
            dsEdit.create("RDLINK", paramOfLink).then(function(data) {
                var info = null;
                if (data) {
                    $scope.upBridgeStatus(data.pid, e);
                    rdLink.redraw();
                }
            });
        } else if ($scope.dataTipsData.s_sourceType === "1201") { //道路种别
            if (stage != 1) {
                swal("操作提示", '数据已经转换过，不需要再次转换！', "info");
                return;
            }
            objCtrl.save();
            var changed = objCtrl.changedProperty;
            if (changed) {
                swal("操作提示", "RDLINK的属性已经修改，请先保存再进行一键录入！", "info");
                return;
            }
            objCtrl.data.changeKind($scope.dataTipsData.kind, objCtrl.data['kind']);
            objCtrl.save();
            changed = objCtrl.changedProperty;
            var oPid = parseInt($scope.dataTipsData.f.id);
            dsEdit.update(oPid, "RDLINK", changed).then(function(data) {
                // $scope.$parent.$parent.$apply();
                if (data != '属性值未发生变化') {
                    $scope.upBridgeStatus(oPid,e);
                    dsEdit.getByPid(oPid, "RDLINK").then(function(ret) {
                        if (ret) {
                            objCtrl.setCurrentObject('RDLINK', ret);
                            objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                        }
                    });
                    workPoint.redraw();
                    rdLink.redraw();
                }
            });
        } else if ($scope.dataTipsData.s_sourceType === "1302") {
            $scope.createRestrictByTips();
        }
    };
    //修改状态
    $scope.upBridgeStatus = function(pid, e) {
        if ($scope.rowkey !== undefined) {
            var stageParam = {
                "rowkey": $scope.rowkey,
                "handler": 0,
                "mdFlag": App.Temp.mdFlag
            };
            if ($scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length - 1].stage == 2) { //表示已经保存了
                $timeout(function() {
                    $.showPoiMsg('状态已改，不允许改变状态！', e);
                    // $scope.$apply();
                });
                return;
            }
            dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function(data) {
                var info = [];
                if (data) {
                    $scope.disabledFlag = true;
                    if (workPoint) workPoint.redraw();
                    $scope.showContent = "外业新增";
                    $scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length - 1].stage = 2;
                }
                // $scope.$emit('getConsoleInfo', info);
                $scope.rowkey = undefined;
            });
        }
    };
    //关闭窗口
    $scope.closeTips = function() {
        $scope.$emit('closePopoverTips', false);
    };
}]);