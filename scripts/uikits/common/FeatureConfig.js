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
    "RDWARNINGINFO": {
      name: "警示信息"
    },
    "RDTRAFFICSIGNAL": {
      name: "信号灯"
    },
    "RDELECTRONICEYE": {
      name: "电子眼"
    },
    "RDGATE": {
      name: "大门"
    },
    "RDSLOPE": {
      name: "坡度"
    },
    "RDLANECONNEXITY": {
      name: "车信"
    },
    "RDLINKINTRTIC": {
      name: "互联网RTIC"
    },
    "RDDIRECTROUTE": {
      name: "顺行"
    },
    "RDSPEEDBUMP": {
      name: "减速带"
    },
    "RDSE": {
      name: "分叉口"
    },
    "RDINTER": {
      name: "CRF交叉点"
    },
    "RDROAD": {
      name: "CRF道路"
    },
    "RDOBJECT": {
      name: "CRF对象"
    },
    "RDTOLLGATE": {
      name: "收费站"
    },
    "RDVARIABLESPEED": {
      name: "可变限速"
    },
    "RDVOICEGUIDE": {
      name: "语音引导"
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
    },
    "RDSAMENODE": {
      name: "同一点"
    },
    "RDSAMELINK": {
      name: "同一线"
    },
    "RDLINKSPEEDLIMIT": {
      name: "线限速"
    },
    "RDLANE": {
      name: "详细车道"
    }
  },
  tip: {
    1101: {
      name: '点限速',
      checked: false
    },
    1102: {
      name: '红绿灯',
      checked: false
    },
    1103: {
      name: '红绿灯方位',
      checked: false
    },
    1104: {
      name: '大门',
      checked: false
    },
    1105: {
      name: '危险信息',
      checked: false
    },
    1106: {
      name: '坡度',
      checked: false
    },
    1107: {
      name: '收费站',
      checked: false
    },
    1109: {
      name: '电子眼',
      checked: false
    },
    1110: {
      name: '卡车限制',
      checked: false
    },
    1111: {
      name: '条件限速',
      checked: false
    },
    1112: {
      name: '可变限速',
      checked: false
    },
    1113: {
      name: '车道限速',
      checked: false
    },
    1201: {
      name: '道路种别',
      checked: true
    },
    1202: {
      name: '车道数',
      checked: false
    },
    1203: {
      name: '道路方向',
      checked: false
    },
    1204: {
      name: '可逆车道',
      checked: false
    },
    1205: {
      name: 'SA(服务区)',
      checked: false
    },
    1206: {
      name: 'PA(停车区)',
      checked: false
    },
    1207: {
      name: '匝道',
      checked: false
    },
    1208: {
      name: '停车场出入口Link',
      checked: false
    },
    1301: {
      name: '车信',
      checked: false
    },
    1302: {
      name: '交限',
      checked: false
    },
    1303: {
      name: '客车交限',
      checked: false
    },
    1304: {
      name: '禁止穿行',
      checked: false
    },
    1305: {
      name: '禁止驶入',
      checked: false
    },
    1306: {
      name: '路口语音引导',
      checked: false
    },
    1307: {
      name: '自然语音引导',
      checked: false
    },
    1401: {
      name: '方向看板',
      checked: false
    },
    1402: {
      name: 'Real Sign',
      checked: false
    },
    1403: {
      name: '3D',
      checked: false
    },
    1404: {
      name: '提左提右',
      checked: false
    },
    1405: {
      name: '一般道路方面',
      checked: false
    },
    1406: {
      name: '实景图',
      ctl: 'scripts/components/road/ctrls/attr_branch_ctrl/rdRealImageCtrl',
      tpl: '../../../scripts/components/road/tpls/attr_branch_Tpl/realImageOfBranch.html',
      checked: false
    },
    1407: {
      name: '高速分歧',
      ctl: 'scripts/components/road/ctrls/attr_branch_ctrl/rdBranchCtrl',
      tpl: '../../../scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html',
      checked: false
    },
    1409: {
      name: '普通路口模式图',
      checked: false
    },
    1501: {
      name: '上下线分离',
      checked: false
    },
    1502: {
      name: '路面覆盖',
      checked: false
    },
    1503: {
      name: '高架路',
      checked: false
    },
    1504: {
      name: 'OverPass(跨线天桥)',
      checked: false
    },
    1505: {
      name: 'UnderPass(跨线地道)',
      checked: false
    },
    1506: {
      name: '私道',
      checked: false
    },
    1507: {
      name: '步行街',
      checked: false
    },
    1508: {
      name: '公交专用道路',
      checked: false
    },
    1509: {
      name: '跨线立交桥',
      checked: false
    },
    1510: {
      name: '桥',
      checked: false
    },
    1511: {
      name: '隧道',
      checked: false
    },
    1512: {
      name: '辅路',
      checked: false
    },
    1513: {
      name: '窄道',
      checked: false
    },
    1514: {
      name: '施工',
      checked: true
    },
    1515: {
      name: '维修',
      checked: false
    },
    1516: {
      name: '季节性关闭道路',
      checked: false
    },
    1517: {
      name: 'Usage Fee Required',
      checked: false
    },
    1601: {
      name: '环岛',
      checked: false
    },
    1602: {
      name: '特殊交通类型',
      checked: false
    },
    1603: {
      name: '未定义交通类型',
      checked: false
    },
    1604: {
      name: '区域内道路',
      checked: false
    },
    1605: {
      name: 'POI连接路',
      checked: false
    },
    1606: {
      name: '收费开放道路',
      checked: false
    },
    1607: {
      name: '风景路线',
      checked: false
    },
    1701: {
      name: '障碍物',
      checked: false
    },
    1702: {
      name: '铁路道口',
      checked: false
    },
    1703: {
      name: '分叉口提示(SE)',
      checked: false
    },
    1704: {
      name: '交叉路口名称',
      checked: false
    },
    1705: {
      name: '立交桥名称',
      checked: false
    },
    1706: {
      name: 'GPS打点',
      checked: false
    },
    1801: {
      name: '立交',
      checked: false
    },
    1803: {
      name: '挂接',
      checked: false
    },
    1804: {
      name: '顺行',
      checked: false
    },
    1805: {
      name: '复合路口',
      checked: false
    },
    1806: {
      name: '草图',
      checked: false
    },
    1901: {
      name: '道路名',
      checked: false
    },
    2001: {
      name: '测线',
      checked: false
    },
    2101: {
      name: '删除标记',
      checked: false
    },
    2102: {
      name: '万能标记',
      checked: false
    }
  },
  featureName: function (featCode) {
    if (this.feature[featCode]) {
      return this.feature[featCode].name
    } else {
      return "未知:" + featCode;
    }
  },

  tipName: function (tipCode) {
    if (this.tip[tipCode]) {
      return this.tip[tipCode].name
    } else {
      return "未知:" + tipCode;
    }
  }
};
