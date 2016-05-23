/**
 * Created by wangmingdong on 2016/5/10.
 */
FM.dataApi.Constant = {
    'CODE_NAME_MAPPING':{
        "rowkey": "ROWKEY",
        "location": "显示坐标",
        "location-longitude": "经度",
        "location-latitude": "纬度",
        "guide": "引导信息",
        "guide-linkPid": "引导LINK",
        "guide-longitude": "经度",
        "guide-latitude": "纬度",
        "pid": "PID",
        "fid": "FID",
        "meshid": "图幅号",
        "name": "主名称",
        "address": "主地址",
        "telephone": "主电话",
        "postCode": "邮政编码",
        "adminCode": "行政区划",
        "kindCode": "分类",
        "level": "等级",
        "open24H": "24小时",
        "adminReal": "真实城市",
        "importance": "重要度",
        "airportCode": "机场代码",
        "website": "网址",
        "relateParent": "父POI",
        "relateParent-parentRowkey": "ROWKEY",
        "relateParent-parentFid": "FID",
        "relateParent-parentName": "名称",
        "relateChildren": "子POi",
        "relateChildren-type": "关系类型",
        "relateChildren-childRowkey": "ROWKEY",
        "relateChildren-childPid": "PID",
        "relateChildren-childFid": "FID",
        "names": "名称组",
        "names-nameId": "名称ID",
        "names-langCode": "语言",
        "names-nameStr": "名称",
        "names-nameStrPinyin": "名称拼音",
        "names-nameClass": "名称分类",
        "names-type": "名称类型",
        "names-nameGrpId": "分组号",
        "addresses": "地址组",
        "addresses-fullName": "地址全名",
        "addresses-addrName": "地址名",
        "addrName-0": "标志物名",
        "addrName-1": "前缀",
        "addrName-2": "门牌号",
        "addrName-3": "类型名",
        "addrName-4": "子号",
        "addrName-5": "后缀",
        "addrName-6": "附属设施名",
        "addrName-7": "楼栋号",
        "addrName-8": "楼层",
        "addrName-9": "楼门号",
        "addrName-10": "房间号",
        "addrName-11": "附加信息",
        "addresses-roadName": "道路名",
        "roadName-0": "省名",
        "roadName-1": "市名",
        "roadName-2": "区县名",
        "roadName-3": "街道名",
        "roadName-4": "小区名",
        "roadName-5": "街巷名",
        "addresses-fullNamePinyin": "全名拼音",
        "addresses-addrNamePinyin": "地址拼音",
        "addrNamePy-0": "标志物名拼音",
        "addrNamePy-1": "前缀拼音",
        "addrNamePy-2": "门牌号拼音",
        "addrNamePy-3": "类型名拼音",
        "addrNamePy-4": "子号拼音",
        "addrNamePy-5": "后缀拼音",
        "addrNamePy-6": "附属设施名拼音",
        "addrNamePy-7": "楼栋号拼音",
        "addrNamePy-8": "楼层拼音",
        "addrNamePy-9": "楼门号拼音",
        "addrNamePy-10": "房间号拼音",
        "addrNamePy-11": "附加信息拼音",
        "addresses-roadNamePinyin": "道路拼音",
        "roadNamePy-0": "省名拼音",
        "roadNamePy-1": "市名拼音",
        "roadNamePy-2": "区县名拼音",
        "roadNamePy-3": "街道名拼音",
        "roadNamePy-4": "小区名拼音",
        "roadNamePy-5": "街巷名拼音",
        "addresses-langCode": "语言",
        "contacts": "电话",
        "contacts-number": "号码",
        "contacts-type": "类型",
        "contacts-linkman": "联系人",
        "contacts-priority": "重要度",
        "contacts-weChatUrl": "微信二维码地址",
        "foodtypes": "餐饮",
        "zcFoodtype": "中餐馆",
        "xcFoodtype": "西餐馆",
        "kcFoodtype": "快餐店",
        "lyFoodtype": "冷饮店",
        "foodtypes-foodtype": "风味类型",
        "foodtypes-creditCards": "信用卡类型",
        "foodtypes-parking": "停车信息",
        "foodtypes-openHour": "营业时间",
        "foodtypes-avgCost": "人均消费",
        "parkings": "停车场",
        "parkings-tollStd": "收费标准",
        "parkings-tollDes": "收费描述",
        "parkings-tollWay": "收费方式",
        "parkings-openTime": "开放时间",
        "parkings-totalNum": "车位数量",
        "parkings-payment": "支付方式",
        "parkings-remark": "备注",
        "parkings-buildingType": "建筑类型",
        "hotel": "酒店",
        "hotel-rating": "星级",
        "hotel-creditCards": "信用卡",
        "hotel-description": "描述",
        "hotel-checkInTime": "订房时间",
        "hotel-checkOutTime": "退房时间",
        "hotel-roomCount": "房间数量",
        "hotel-roomType": "客房类型",
        "hotel-roomPrice": "客房价格",
        "hotel-breakfast": "早餐",
        "hotel-service": "客房服务",
        "hotel-parking": "停车服务",
        "hotel-openHour": "营业时间",
        "sportsVenues": "运动场馆",
        "sportsVenues-buildingType": "建筑类型",
        "sportsVenues-sports": "支持运动类型",
        "chargingStation": "充电站",
        "chargingStation-type": "类型",
        //    "chargingStation-mode": "充电模式",
        "chargingStation-plugType": "插头类型",
        "chargingStation-payment": "支付方式",
        "chargingStation-servicePro": "服务提供商",
        "chargingStation-chargingNum": "充电桩总数",
        "chargingStation-openHour": "开发时间",
        //    "chargingStation-exchangeNum": "换电箱总数",
        "chargingStation-parkingNum": "电动车泊位号码",
        "chargingStation-plotsNum": "充电桩数目",
        "chargingStation-plots": "充电桩",
        "chargingStation-plots-acdc": "交直流充电",
        "chargingStation-plots-plugType": "插头类型",
        "chargingStation-plots-power": "充电功率",
        "chargingStation-plots-voltage": "充电电压",
        "chargingStation-plots-current": "充电电流",
        "chargingStation-plots-mode": "充电模式",
        "chargingStation-plots-count": "组内充电桩数量",
        "gasStation": "加油站",
        "gasStation-fuelType": "燃料类型",
        "gasStation-oilType": "汽油类型",
        "gasStation-egType": "乙醇汽油",
        "gasStation-mgType": "甲醇汽油",
        "gasStation-payment": "支付方式",
        "gasStation-service": "附加服务",
        "gasStation-servicePro": "服务提供商",
        "airport": "机 场",
        "airport-airportCode": "机场代码",
        "attraction": "旅游景点",
        "attraction-sightLevel": "景点等级",
        "attraction-description": "景点描述",
        "attraction-ticketPrice": "票价",
        "attraction-openHour": "开放时间",
        "attraction-parking": "停车服务",
        "rental": "汽车租赁",
        "rental-openHour": "开放时间",
        "rental-howToGo": "周边交通路线",
        "indoor": "室内POI",
        "indoor-type": "种别",
        "indoor-open": "开放",
        "indoor-floor": "楼层",
        "attachments": "附件",
        "attachments-type": "类型",
        "attachments-url": "云存储地址",
        "attachments-tag": "标识",
        "brands": "品牌",
        "brands-name": "品牌名称",
        "brands-code": "品牌代码",
        "evaluateQuality": "评估,品质",
        "evaluateIntegrity": "评估,完备度",
        "lifecycle": "状态",
        "operateDate": "操作时间",
        "description": "描述",
        "openHour": "营业时间",
        "validationDate": "验证时间"
    },
    'CODE_SOURCE_NAME':{
        "Android": "安卓",
        "batch": "批处理",
        "Web": "行编辑",
        "Desktop": "桌面"
    },
    'LIFE_CYCLE':{
        1: "删 除",
        2: "修 改",
        3: "新 增",
        4: "未 知"
    },
    'AUDITU_STATUS':{
        0: "无",
        1: "待审核",
        2: "已审核",
        3: "审核不通过",
        4: "外业验证",
        5: "鲜度验证"
    },
    'CONF_ORIGIN_PROP':{
        "name": 1,
        "address": 1,
        "contacts": 1,
        "postCode": 1,
        "adminCode": 1,
        "kindCode": 1,
        "brands": 1,
        "level": 1,
        "open24H": 1,
        "relateParent": 1,
        "relateChildren": 1,
        "names": 1,
        "indoor": 1,
        "location": 0,
        "guide": 0,
        "meshid": 0,
        "adminReal": 0,
        "importance": 0,
        "airportCode": 0,
        "website": 0,
        "addresses": 0,
        "foodtypes": 0,
        "parkings": 0,
        "hotel": 0,
        "sportsVenues": 0,
        "chargingStation": 0,
        "gasStation": 0,
        "attraction": 0,
        "rental": 0
    },
    'CHARGINGPOLE_PAYMENT':{
    	"0": "其他",
        "1": "现金",
        "2": "信用卡",
        "3": "借记卡",
        "4": "特制充值卡",
        "5": "APP"
    },
    'CHARGINGPOLE_PLUGTYPE': {
        0: "交流电3孔家用",
        1: "国标交流电7孔插槽",
        2: "国标直流电9孔插槽",
        8: "特斯拉专用插槽",
        9: "其他",
        10: "无法采集"
    },
    'CHARGINGPOLE_OPENTYPE': {
        "1": "对社会车辆开放",
        "2": "对环卫车开放",
        "3": "对公交车开放",
        "4": "对出租车开放",
        "5": "对其他特种车辆开放",
        "6": "对自有车辆开放",
        "7": "个人充电桩",
        "99": "对某品牌汽车开放"
    },
    'CHARGINGPOLE_MODE': {
        "0": "慢速",
        "1": "快速"
    },
    'CHARGINGPOLE_LOCATIONTYPE': {
        0: "室外",
        1: "室内地上",
        2: "地下"
    },
    'CHARGINGPOLE_AVAILABLESTATE': {
        0: "可以使用（有电）",
        1: "不可使用（没电）",
        2: "维修中",
        3: "建设中",
        4: "规划中"
    },
    'CHARGINGPOLE_ACDC': {
        0: "交流",
        1: "直流"
    }
};

