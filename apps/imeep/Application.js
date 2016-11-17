'use strict';

// web app全局命名空间 //测试版本分支的注释，对程序没有影响；
var App = {};
// web app全局配置信息
App.Config = {
    appType: 'WEB',
    serviceUrl: 'http://192.168.4.188:8000/service',
    hbaseServiceUrl: 'http://fastmap.navinfo.com/fos/datum',
    resourceUrl: 'http://192.168.4.189/resources',
    specialUrl: 'http://192.168.4.189/fos'
};
App.Temp = {
    accessToken: null,
    dbId: 42,
    subTaskId: 168,
    mdFlag: 'd',
    gridList: [60560301, 60560302, 60560303, 60560311, 60560312, 60560313, 60560322, 60560323, 60560331, 60560332, 60560333, 60560320, 60560330, 60560300, 60560321, 60560310],
    tipsNameObj: { 1101: '点限速', 1102: '红绿灯', 1103: '红绿灯方向', 1104: '大门', 1105: '危险信息', 1106: '坡度', 1107: '收费站',
        1109: '电子眼', 1110: '卡车限制', 1111: '条件限速', 1112: '可变限速', 1113: '车道限速', 1201: '道路种别', 1202: '车道数', 1203: '道路方向', 1204: '可逆车道',
        1205: 'SA', 1206: 'PA', 1207: '匝道', 1208: '停车场出入口Link', 1301: '车信', 1302: '交限', 1303: '卡车交限', 1304: '禁止穿行', 1305: '禁止驶入', 1306: '路口语音引导',
        1308: '外埠车辆限制', 1311: '可变导向车道', 1401: '方向看板', 1402: 'Real Sign', 1403: '3D', 1404: '提左提右', 1405: '一般道路方面', 1406: '实景图',
        1407: '高速分歧', 1409: '普通路口模式图', 1501: '上下线分离', 1502: '路面覆盖', 1503: '高架路', 1504: 'OverPass', 1505: 'Underpass', 1506: '私道', 1507: '步行街',
        1508: '公交专用道路', 1509: '跨线立交桥', 1510: '桥', 1514: '施工', 1515: '维修', 1517: 'Usage Fee Required', 1604: '区域内道路',
        1606: '收费站开放道路', 1703: '分叉口提示', 1704: '交叉路口', 1707: '里程桩', 1801: '立交', 1803: '挂接', 1806: '草图', 1901: '道路名', 2001: '测线' },
    relationNameObj: {
        RDRESTRICTION: '交限',
        RDSPEEDLIMIT: '限速',
        RDBRANCH: '分歧',
        RDCROSS: '路口',
        RDLANECONNEXITY: '车信',
        RDLINKINTRTIC: '实时信息',
        RDGSC: '立交',
        RDWARNINGINFO: '警示信息',
        RDVARIABLESPEED: '可变限速',
        RDMILEAGEPILE: '里程桩',
        RDTRAFFICSIGNAL: '信号灯',
        RDELECTRONICEYE: '电子眼',
        RDSLOPE: '坡度',
        RDGATE: '大门',
        RDDIRECTROUTE: '顺行',
        RDSPEEDBUMP: '减速带',
        RDSE: '分叉口',
        RDINTER: 'CRF交叉点',
        RDROAD: 'CRF道路',
        RDOBJECT: 'CRF对象',
        RDTOLLGATE: '收费站',
        RDVOICEGUIDE: '语音引导',
        RDSAMENODE: '同一点',
        RDSAMELINK: '同一线',
        RDLANE: '详细车道',
        RDLINK: '道路线',
        ADADMIN: '行政区划代表点',
        ADNODE: '行政区划组成点',
        ADLINK: '行政区划组成线',
        ADFACE: '行政区划组成面',
        RWNODE: '铁路点',
        RWLINK: '铁路线',
        ZONENODE: 'ZONE组成点',
        ZONELINK: 'ZONE组成线',
        ZONEFACE: 'ZONE组成面',
        LUNODE: 'LU点',
        LULINK: 'LU线',
        LUFACE: 'LU面',
        LCNODE: 'LC(土地覆盖)-点',
        LCLINK: 'LC(土地覆盖)-线',
        LCFACE: 'LC(土地覆盖)-面',
        IXPOI: '兴趣点（POI）',
        RDNODE: '道路点',
        RDLINKSPEEDLIMIT: '线限速',
        TIPS: 'TIPS',
        TMCPOINT: 'TMC点',
        RDTMCLOCATION: 'TMC匹配信息',
        RDHGWGLIMIT: '限高限重'
    },
    thematicMapFlag: false,
    taskType: null
};
// web app的公用函数命名空间
App.Util = {
    getAppPath: function () {
        return location.pathname.substr(0, location.pathname.indexOf('/apps'));
    },
    getFullUrl: function (url) {
        return App.Config.serviceUrl + '/' + url + '?access_token=' + (App.Temp.accessToken || '');
    },
    getHbaseUrl: function (url) {
        return App.Config.hbaseServiceUrl + '/' + url;
    },
    getSpecUrl: function (url) {
        return App.Config.specialUrl + '/' + url + '?access_token=' + (App.Temp.accessToken || '');
    },
    createTileRequestObject: function (url, layerOptions) {
        var reqObj = {};
        reqObj.url = App.Config.serviceUrl + url;
        reqObj.parameter = {
            dbId: App.Temp.dbId,
            gap: layerOptions.gap || 10
        };
        if (layerOptions.requestType) {
            // 为专题图的时候  types字段要传字符串类型
            if (layerOptions.id === 'thematicLink') {
                reqObj.parameter.type = layerOptions.requestType;
            } else {
                reqObj.parameter.types = layerOptions.requestType.split(',');
                if (reqObj.parameter.types.indexOf('RDLINK') >= 0 || reqObj.parameter.types.indexOf('RDLINKINTRTIC') >= 0) {
                    reqObj.hbaseUrl = reqObj.url;
                }
            }
        }
        return reqObj;
    },
    createTileRequestObjectForTips: function (url, layerOptions) {
        var reqObj = {};
        reqObj.url = App.Config.serviceUrl + url;
        reqObj.parameter = {
            gap: layerOptions.gap || 10,
            mdFlag: App.Temp.mdFlag
        };
        if (layerOptions.requestType) {
            reqObj.parameter.types = layerOptions.requestType.split(',');
        }
        return reqObj;
    },
    getUrlParam: function (paramName) {
        var reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    },
    logout: function () {
        window.location.href = App.Util.getAppPath() + '/apps/imeep/login.html';
    }
};
// 从url请求中获取token
App.Temp.accessToken = App.Util.getUrlParam('access_token');
