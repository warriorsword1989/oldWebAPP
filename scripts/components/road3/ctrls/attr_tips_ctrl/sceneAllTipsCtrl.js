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
    var rdLink = layerCtrl.getLayerById('referenceLine');
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
    $scope.featureConfig = fastmap.dataApi.FeatureConfig;
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
    $scope.getFeatDataCallback = function(id, type) {
        $scope.resetToolAndMap();
        dsEdit.getByPid(id, type).then(function(data) {
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
                    layerid: 'referenceLine',
                    type: 'line',
                    style: {}
                });
                highRenderCtrl.drawHighlight();
            }
            objCtrl.setCurrentObject(type, data);
            var options = {
                "loadType": 'attrTplContainer',
                "propertyCtrl": "scripts/components/road3/ctrls/attr_link_ctrl/rdLinkCtrl",
                "propertyHtml": "../../../scripts/components/road3/tpls/attr_link_tpl/rdLinkTpl.html"
            };
            $scope.$emit("transitCtrlAndTpl", options);
        });
    };
    //初始化DataTips相关数据
    $scope.initializeDataTips = function(data) {
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
                break;
	        case "1102":    //红绿灯
		        var fArray = $scope.dataTipsData.f_array;
		        $scope.inCt = $scope.dataTipsData.inCt;
		        $scope.enableCtl = [];
		        $scope.disableCtl = [];
		        for(var i=0,len=fArray.length;i<len;i++){
			        if(fArray[i].ctrl == 1){
				        $scope.enableCtl.push(fArray[i]);
			        }else{
				        $scope.disableCtl.push(fArray[i]);
			        }
		        }
		        break;
	        case "1103":    //红绿灯方向
		        $scope.linkPid = $scope.dataTipsData.in.id;
		        var directionObj = {
			        0:'未调查',
			        1:'左',
			        2:'右',
			        3:'左右',
			        4:'上',
			        5:'左上',
			        6:'右上',
			        7:'左上右'
		        };
		        $scope.traffDirection = directionObj[$scope.dataTipsData.loc];
		        break;
	        case "1104":    //大门
		        $scope.inLinkPid = $scope.dataTipsData.in.id;
		        $scope.outLinkPid = $scope.dataTipsData.out.id;
		        var gateTypeObj = {
			        0: 'EG',
			        1: 'KG',
			        2: 'PG'
		        };
		        var gateDirObj = {
			        0:'EG',
			        1:'KG',
			        2:'PG'
		        };
		        $scope.gateType = gateTypeObj[$scope.dataTipsData.tp];
		        $scope.gateDir = gateDirObj[$scope.dataTipsData.dir];
		        $scope.passTime = $scope.dataTipsData.time;
		        break;
            case "1105":
                $scope.tipsData = $scope.dataTipsData;
                $scope.type = {
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
                break;
	        case "1106":    //坡度
		        var slopeTypeObj = {
			        0: '未调查',
			        1: '水平',
			        2: '上坡',
			        3: '下坡'
		        };
		        var endSlopeFlagObj = {
			        0:'否',
			        1:'是'
		        };
		        $scope.slopeType = slopeTypeObj[$scope.dataTipsData.tp];
		        $scope.endSlopeFlag = endSlopeFlagObj[$scope.dataTipsData.end];
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
                        $scope.tp = $scope.TollType[i].label;
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
                        $scope.loc = $scope.TollLoc[i].label;
                    }
                }
                break;
            case "1109": //电子眼
                $scope.tipsData = $scope.dataTipsData;
                var dir = {
                    "2": "顺方向",
                    "3": "逆方向"
                };
                $scope.rdDir = dir[$scope.dataTipsData.rdDir];
                var type = {
                    "1": "限速摄像头",
                    "13": "非机动车道摄像头",
                    "15": "公交车道摄像头",
                    "16": "禁止左/右转摄像头",
                    "20": "区间测速开始",
                    "21": "区间测速结束"
                };
                $scope.type = type[$scope.dataTipsData.tp];
                var loc = {
                    "0": "未调查",
                    "1": "左",
                    "2": "右",
                    "4": "上"
                };
                $scope.loc = loc[$scope.dataTipsData.loc];
                break;
            case "1111": //条件限速
                var dir = {
                    "0":"不应用",
                    "2": "顺方向",
                    "3": "逆方向"
                };
                $scope.rdDir = dir[$scope.dataTipsData.rdDir];
                $scope.limitValue = $scope.dataTipsData.value;
                var limitFlagObj = {
                    "0": "限速开始",
                    "1": "限速解除"
                };
                $scope.limitFlag = limitFlagObj[$scope.dataTipsData.se];
                $scope.time = type[$scope.dataTipsData.time];
                var loc = {
                    "0": "未调查",
                    "1": "左",
                    "2": "右",
                    "4": "上"
                };
                $scope.loc = loc[$scope.dataTipsData.loc];
                $scope.limitConditionObj = [
                    {"id":1,"label":'雨天'},
                    {"id":2,"label":'雪天'},
                    {"id":3,"label":'雾天'},
                    {"id":6,"label":'学校'},
                    {"id":10,"label":'时间限制'},
                    {"id":12,"label":'季节时段'}
                ];
                for(var i=0,len=$scope.limitConditionObj.length;i<len;i++){
                    if($scope.limitConditionObj[i].id == $scope.dataTipsData.dpnd[i]){
                        $scope.limitConditionObj[i].checked = true;
                    }
                }
                break;
            case "1113":
                var dir = {
                    "2": "顺方向",
                    "3": "逆方向"
                };
                $scope.rdDir = dir[$scope.dataTipsData.rdDir];
                var limitValue = $scope.dataTipsData.value;
                limitValue.sort(function(a,b){
                    return a<b?1:-1;
                });
                for(var i=0,len=limitValue.length;i<len;i++){
                    if(i!=len-1){
                        $scope.limitValue = limitValue[i]+'|';
                    }else{
                        $scope.limitValue = limitValue[i];
                    }
                }
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
            case "1202":    //车道数
                var dir = {
                    "2": "顺方向",
                    "3": "逆方向"
                };
                $scope.rdDir = dir[$scope.dataTipsData.rdDir];
                var sideObj = {
                    0:'不应用',
                    1:'左',
                    2:'右'
                };
                $scope.sideDir = sideObj[$scope.dataTipsData.side];
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
            case "1205": //SA
                $scope.fData = $scope.dataTipsData.f;
                break;
            case "1206": //PA
                $scope.fData = $scope.dataTipsData.f;
                break;
            case "1207": //匝道
                var commandObj = {
                    0:'不应用',
                    1:'删除',
                    2:'修改',
                    3:'新增'
                };
                $scope.commandData = commandObj[$scope.dataTipsData.t_commandObj];
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
                    layerid: 'referenceLine',
                    type: 'line',
                    style: {}
                });
                for (var hiNum = 0, hiLen = detailsOfHigh.length; hiNum < hiLen; hiNum++) {
                    var outLinksOfHigh = detailsOfHigh[hiNum].out;
                    if (outLinksOfHigh !== undefined) {
                        for (var outNum = 0, outLen = outLinksOfHigh.length; outNum < outLen; outNum++) {
                            highLightFeatures.push({
                                id: outLinksOfHigh[outNum].id,
                                layerid: 'referenceLine',
                                type: 'line',
                                style: {}
                            });
                        }
                    }
                }
                break;
            case "1304": //禁止穿行
                var dir = {
                    "0":"不应用",
                    "2": "顺方向",
                    "3": "逆方向"
                };
                $scope.rdDir = dir[$scope.dataTipsData.rdDir];
                break;
            case "1305": //禁止驶入
                var dir = {
                    "0":"不应用",
                    "2": "顺方向",
                    "3": "逆方向"
                };
                $scope.rdDir = dir[$scope.dataTipsData.rdDir];
                $scope.eliminateCarObj = [
                    {"id":1,"label":'客车'},
                    {"id":2,"label":'配送卡车'},
                    {"id":3,"label":'运输卡车'},
                    {"id":4,"label":'急救车'},
                    {"id":5,"label":'出租车'}
                ];
                for(var i=0,len=$scope.eliminateCarObj.length;i<len;i++){
                    if($scope.eliminateCarObj[i].id == $scope.dataTipsData.vt[i]){
                        $scope.eliminateCarObj[i].checked = true;
                    }
                }
                break;
            case "1401": //方向看板
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in;
                /*退出*/
                $scope.sceneOut = $scope.dataTipsData.o_array;
                /*底图代码*/
                $scope.schemaNo = $scope.dataTipsData.ptn;
                break;
            case "1402": //real sign
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in.id;
                /*退出*/
                $scope.sceneOut = $scope.dataTipsData.o_array;
                /*底图号码*/
                $scope.schemaNo = $scope.dataTipsData.ptn;
                break;
            case "1403": //3D
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in;
                /*退出*/
                $scope.sceneOut = $scope.dataTipsData.o_array;
                /*模式图号*/
                $scope.schemaNo = $scope.dataTipsData.ptn;
                break;
            case "1401": //提左提右
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in;
                /*退出*/
                $scope.sceneOut = $scope.dataTipsData.o_array;
                /*底图代码*/
                $scope.schemaNo = $scope.dataTipsData.ptn;
                break;
            case "1405": //3D
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in;
                /*退出数组*/
                $scope.sceneOut = $scope.dataTipsData.o_array;
                break;
            case "1406": //实景图
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in.id;
                /*实景图代码*/
                $scope.schemaNo = $scope.dataTipsData.ptn;
                /*实景图类型*/
                if ($scope.dataTipsData.tp == 1) {
                    $scope.schemaType = "普通路口";
                } else if ($scope.dataTipsData.tp == 3) {
                    $scope.schemaType = "高速入口";
                } else {
                    $scope.schemaType = "高速出口";
                }
                /*退出*/
                $scope.sceneExit = [];
                $.each($scope.dataTipsData.o_array, function(i, v) {
                    if (v.out) {
                        $scope.sceneExit.push(v.out.id);
                    }
                });
                break;
            case "1407": //高速分歧
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in.id;
                /*模式图号*/
                $scope.schemaNo = $scope.dataTipsData.ptn;
                $scope.scheName = $scope.dataTipsData.name;
                /*退出*/
                $scope.sceneExit = [];
                $.each($scope.dataTipsData.o_array, function(i, v) {
                    if (v.out) {
                        $scope.sceneExit.push(v.out.id);
                    }
                });
                break;
            case "1409": //普通路口模式图
                /*进入*/
                $scope.sceneEnty = $scope.dataTipsData.in.id;
                /*退出*/
                $scope.sceneExit = [];
                $scope.bottomPicture = $scope.dataTipsData.ptn;
                $.each($scope.dataTipsData.o_array, function(i, v) {
                    if (v.out) {
                        $scope.sceneExit.push(v.out.id);
                    }
                });
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
                $scope.constructionArrayLinkTime = $scope.dataTipsData.time;
                $scope.startTime = $scope.constructionArrayLinkTime.split('-')[0].substring(5);
                $scope.endTime = $scope.constructionArrayLinkTime.split('-')[1].substring(5);
                break;
            case "1515": //维修
                $scope.constructionArrayLink = $scope.dataTipsData.f_array;
                var strArray = $scope.dataTipsData.time.split('-');
                $scope.startTime = strArray[0].substring(5);
                $scope.endTime = strArray[1].substring(5);
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
                }, ];
                break;
            case "1703":
                $scope.sceneEnty = $scope.dataTipsData.in;
                $scope.sceneOut = $scope.dataTipsData.out;
                break;
            case "1704": //交叉路口
                //$scope.fData = $scope.dataTipsData;
                break;
            case "1801": //立交
                $scope.upperAndLowerArrayLink = $scope.dataTipsData.f_array;
                break;
            case "1803": //挂接
                if ($scope.dataTipsData.pcd) { //有图片时，显示图片
                    $scope.pcd = "../../images/road/hook/" + $scope.dataTipsData.pcd.substr(5, 4) + ".svg";
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
                    $scope.lineType = $scope.returnLineType($scope.dataTipsData.kind);
                    /*来源*/
                    $scope.lineSrc = $scope.returnLineSrc($scope.dataTipsData.src);
                    /*车道数*/
                    $scope.carNumber = $scope.dataTipsData.ln;
                    /*长度*/
                    $scope.lineLength = $scope.dataTipsData.len;
                }
                break;
        }
        //高亮
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
        /**
         * 图片、语音、备注
         */
        var fArray = $scope.dataTipsData.feedback.f_array;
        var content;
        for (var i in fArray) {
            if (fArray[i].type === 1) {
                content = App.Config.serviceUrl + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + fArray[i].content + '",type:"thumbnail"}';
                $scope.photos.push(content);
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
        selectCtrl.rowKey["pictureId"] = id;
        var openOriginObj = {
            "loadType": "tipsPitureContainer",
            "propertyCtrl": "scripts/components/road3/ctrls/attr_tips_ctrl/tipsPictureCtrl",
            "propertyHtml": "../../../scripts/components/road3/tpls/attr_tips_tpl/tipsPictureTpl.html"
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
            restrictObj["nodePid"] = inNode;
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
                })
            });
        });
    };
    /*转换*/
    $scope.transBridge = function(e) {
        var stageLen = $scope.dataTipsData.t_trackInfo.length;
        var stage = parseInt($scope.dataTipsData.t_trackInfo[stageLen - 1]["stage"]);
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
                }
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
                if (data.data) {
                    $scope.upBridgeStatus(data.data.pid, e);
                    if (data.errcode == 0) {
                        if (workPoint) workPoint.redraw();
                        var sInfo = {
                            "op": "测线转换操作成功",
                            "type": "",
                            "pid": ""
                        };
                        data.data.log.push(sInfo);
                        info = data.data.log;
                        rdLink.redraw();
                        swal("操作成功", "测线转换操作成功！", "success");
                        $scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length - 1].stage = 3;
                        // $scope.$apply();
                    }
                } else {
                    info = [{
                        "op": data.errcode,
                        "type": data.errmsg,
                        "pid": data.errid
                    }];
                    swal("操作失败", data.errmsg, "error");
                }
                $scope.$emit('getConsoleInfo', info);
            });
        } else if ($scope.dataTipsData.s_sourceType === "1201") { //道路种别
            var info = null;
            var kindObj = {
                "objStatus": "UPDATE",
                "pid": parseInt($scope.dataTipsData.f.id),
                "kind": $scope.dataTipsData.kind
            };
            var param = {
                "type": "RDLINK",
                "command": "UPDATE",
                "dbId": App.Temp.dbId,
                "data": kindObj
            };
            if (stage === 1) {
                dsEdit.update(parseInt($scope.dataTipsData.f.id), "RDLINK", kindObj).then(function(data) {
                    $scope.$parent.$parent.$apply();
                    if (data.errcode == 0) {
                        objCtrl.data["kind"] = $scope.dataTipsData.kind;
                        $scope.upBridgeStatus();
                        restrictLayer.redraw();
                        workPoint.redraw();
                        var sInfo = {
                            "op": "种别转换操作成功",
                            "type": "",
                            "pid": ""
                        };
                        data.data.log.push(sInfo);
                        info = data.data.log;
                        swal("操作成功", "种别转换操作成功！", "success");
                    } else {
                        info = [{
                            "op": data.errcode,
                            "type": data.errmsg,
                            "pid": data.errid
                        }];
                        swal("操作失败", data.errmsg, "error");
                    }
                    $scope.$emit('getConsoleInfo', info);
                })
            } else {
                swal("操作失败", '数据已经转换', "error");
            }
        } else if ($scope.dataTipsData.s_sourceType === "1302") {
            $scope.createRestrictByTips()
        }
    };
    //修改状态
    $scope.upBridgeStatus = function(pid, e) {
            if ($scope.rowkey !== undefined) {
                var stageParam = {
                    "rowkey": $scope.rowkey,
                    "stage": 3,
                    "handler": 0
                }
                if ($scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length - 1].stage == 3) {
                    $timeout(function() {
                        $.showPoiMsg('状态已改，不允许改变状态！', e);
                        // $scope.$apply();
                    });
                    return;
                }
                dsFcc.changeDataTipsState(JSON.stringify(stageParam), function(data) {
                    var info = [];
                    if (data.errcode === 0) {
                        if (workPoint) workPoint.redraw();
                        $scope.showContent = "外业新增";
                        $scope.dataTipsData.t_trackInfo[$scope.dataTipsData.t_trackInfo.length - 1].stage = 3;
                        //output 需要解析到固定的格式，做什么操作，然后是操作内容
                        if (data.data) {
                            var sInfo = {
                                "op": "状态修改成功",
                                "type": "",
                                "pid": ""
                            };
                            data.data.log.push(sInfo);
                            info = data.data.log;
                        } else {
                            var sInfo = [{
                                "op": "状态修改成功",
                                "type": "",
                                "pid": ""
                            }];
                            data.data = sInfo;
                            info = data.data;
                        }
                        //弹出提示框
                        swal("操作成功", "状态修改成功！", "success");
                    } else {
                        info = [{
                            "op": data.errcode,
                            "type": data.errmsg,
                            "pid": data.errid
                        }];
                        //弹出提示框
                        swal("操作失败", data.errmsg, "error");
                    }
                    $scope.$emit('getConsoleInfo', info);
                    $scope.rowkey = undefined;
                })
            }
        }
        //关闭窗口
    $scope.closeTips = function() {
        $scope.$emit('closePopoverTips', false);
    }
}]);