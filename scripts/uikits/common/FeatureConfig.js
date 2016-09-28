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
        "RDVOICEGUIDE":{
            name:"语音引导"
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
        "RDSAMENODE":{
            name:"同一点"
        },
        "RDSAMELINK":{
            name:"同一线"
        },
        "RDLINKSPEEDLIMIT":{
            name:"线限速"
        },
        "RDLANE":{
            name:"详细车道"
        }
    },
    tip: {
        1101:{
            name:'点限速'
        },
        1102:{
            name:'红绿灯'
        },
        1103:{
            name:'红绿灯方位'
        },
        1104:{
            name:'大门'
        },
        1105:{
            name:'危险信息'
        },
        1106:{
            name:'坡度'
        },
        1107:{
            name:'收费站'
        },
        1109:{
            name:'电子眼'
        },
        1110:{
            name:'卡车限制'
        },
        1111:{
            name:'条件限速'
        },
        1112:{
            name:'可变限速'
        },
        1113:{
            name:'车道限速'
        },
        1201:{
            name:'道路种别'
        },
        1202:{
            name:'车道数'
        },
        1203:{
            name:'道路方向'
        },
        1204:{
            name:'可逆车道'
        },
        1205:{
            name:'SA(服务区)'
        },
        1206:{
            name:'PA(停车区)'
        },
        1207:{
            name:'匝道'
        },
        1208:{
            name:'停车场出入口Link'
        },
        1301:{
            name:'车信'
        },
        1302:{
            name:'交限'
        },
        1303:{
            name:'客车交限'
        },
        1304:{
            name:'禁止穿行'
        },
        1305:{
            name:'禁止驶入'
        },
        1306:{
            name:'路口语音引导'
        },
        1307:{
            name:'自然语音引导'
        },
        1401:{
            name:'方向看板'
        },
        1402:{
            name:'Real Sign'
        },
        1403:{
            name:'3D'
        },
        1404:{
            name:'提左提右'
        },
        1405:{
            name:'一般道路方面'
        },
        1406:{
            name:'实景图',
            ctl:'scripts/components/road/ctrls/attr_branch_ctrl/rdRealImageCtrl',
            tpl:'../../../scripts/components/road/tpls/attr_branch_Tpl/realImageOfBranch.html'
        },
        1407:{
            name:'高速分歧',
            ctl:'scripts/components/road/ctrls/attr_branch_ctrl/rdBranchCtrl',
            tpl:'../../../scripts/components/road/tpls/attr_branch_Tpl/namesOfBranch.html'
        },
        1409:{
            name:'普通路口模式图'
        },
        1501:{
            name:'上下线分离'
        },
        1502:{
            name:'路面覆盖'
        },
        1503:{
            name:'高架路'
        },
        1504:{
            name:'OverPass(跨线天桥)'
        },
        1505:{
            name:'UnderPass(跨线地道)'
        },
        1506:{
            name:'私道'
        },
        1507:{
            name:'步行街'
        },
        1508:{
            name:'公交专用道路'
        },
        1509:{
            name:'跨线立交桥'
        },
        1510:{
            name:'桥'
        },
        1511:{
            name:'隧道'
        },
        1512:{
            name:'辅路'
        },
        1513:{
            name:'窄道'
        },
        1514:{
            name:'施工'
        },
        1515:{
            name:'维修'
        },
        1516:{
            name:'季节性关闭道路'
        },
        1517:{
            name:'Usage Fee Required'
        },
        1601:{
            name:'环岛'
        },
        1602:{
            name:'特殊交通类型'
        },
        1603:{
            name:'未定义交通类型'
        },
        1604:{
            name:'区域内道路'
        },
        1605:{
            name:'POI连接路'
        },
        1606:{
            name:'收费开放道路'
        },
        1607:{
            name:'风景路线'
        },
        1701:{
            name:'障碍物'
        },
        1702:{
            name:'铁路道口'
        },
        1703:{
            name:'分叉口提示(SE)'
        },
        1704:{
            name:'交叉路口名称'
        },
        1705:{
            name:'立交桥名称'
        },
        1706:{
            name:'GPS打点'
        },
        1801:{
            name:'立交'
        },
        1803:{
            name:'挂接'
        },
        1804:{
            name:'顺行'
        },
        1805:{
            name:'复合路口'
        },
        1806:{
            name:'草图'
        },
        1901:{
            name:'道路名'
        },
        2001:{
            name:'测线'
        },
        2101:{
            name:'删除标记'
        },
        2102:{
            name:'万能标记'
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
