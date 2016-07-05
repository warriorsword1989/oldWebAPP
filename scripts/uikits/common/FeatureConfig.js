fastmap.uikit.FeatureConfig = {
    feature: {
        "RDNODE": {
            name: "道路点"
        },
        "RDLINK": {
            name: "道路线"
        },
        "RDRESTRICTION": {
            name: "交限"
        },
        "RDSPEEDLIMIT": {
            name: "限速"
        },
        "RDBRANCH": {
            name: "分歧"
        },
        "RDCROSS": {
            name: "路口"
        },
        "RDLANECONNEXITY": {
            name: "车道"
        },
        "RDLINKINTRTIC": {
            name: "互联网RTIC"
        },
        "RDGSC": {
            name: "立交"
        },
        "RWNODE": {
            name: "铁路点"
        },
        "RWLINK": {
            name: "铁路线"
        },
        "ADADMIN": {
            name: "行政区划代表点"
        },
        "ADNODE": {
            name: "行政区划组成点"
        },
        "ADLINK": {
            name: "行政区划组成线"
        },
        "ADFACE": {
            name: "行政区划面"
        },
        "ZONENODE": {
            name: "ZONE组成点"
        },
        "ZONELINK": {
            name: "ZONE组成线"
        },
        "ZONEFACE": {
            name: "ZONE面"
        }
    },
    tip: {
        1101: {
            name: '点限速'
        },
        1102: {
            name: '红绿灯'
        },
        1103: {
            name: '红绿灯方位'
        },
        1104: {
            name: '大门'
        },
        1105: {
            name: '危险信息'
        },
        1106: {
            name: '坡度'
        },
        1107: {
            name: '收费站'
        },
        1109: {
            name: '电子眼'
        },
        1110: {
            name: '卡车限制'
        },
        1111: {
            name: '条件限速'
        },
        1113: {
            name: '车道限速'
        },
        1201: {
            name: '道路种别'
        },
        1202: {
            name: '车道数'
        },
        1203: {
            name: '道路方向'
        },
        1205: {
            name: 'SA(服务区)'
        },
        1206: {
            name: 'PA(停车区)'
        },
        1207: {
            name: '匝道'
        },
        1208: {
            name: '停车场出入口Link'
        },
        1301: {
            name: '车信'
        },
        1302: {
            name: '交限'
        },
        1304: {
            name: '禁止穿行'
        },
        1305: {
            name: '禁止驶入'
        },
        1401: {
            name: '方向看板'
        },
        1402: {
            name: 'Real Sign'
        },
        1403: {
            name: '3D'
        },
        1404: {
            name: '提左提右'
        },
        1405: {
            name: '一般道路方面'
        },
        1406: {
            name: '实景图'
        },
        1407: {
            name: '高速分歧'
        },
        1409: {
            name: '普通路口模式图'
        },
        1501: {
            name: '上下线分离'
        },
        1502: {
            name: '路面覆盖'
        },
        1510: {
            name: '桥'
        },
        1514: {
            name: '施工'
        },
        1515: {
            name: '维修'
        },
        1604: {
            name: '区域内道路'
        },
        1703: {
            name: '分叉口提示(SE)'
        },
        1704: {
            name: '交叉路口名称'
        },
        1801: {
            name: '立交'
        },
        1803: {
            name: '挂接'
        },
        1805: {
            name: '复合路口'
        },
        1806: {
            name: '草图'
        },
        1901: {
            name: '道路名'
        },
        2001: {
            name: '测线'
        }
    },
    featureName: function(featCode) {
        if (this.feature[featCode]) {
            return this.feature[featCode].name
        } else {
            return "未知:" + featCode;
        }
    },
    tipName: function(tipCode) {
        if (this.tip[tipCode]) {
            return this.tip[tipCode].name
        } else {
            return "未知:" + tipCode;
        }
    }
};