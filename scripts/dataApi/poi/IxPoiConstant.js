/**
 * Created by mali on 2016/6/6.
 */
FM.dataApi.Constant = {
    'PARKING_TYPE': {
        0: "室内",
        1: "室外",
        2: "占道",
        3: "室内(地上)",
        4: "室内(地下)"
    },
    'TOLLSTD': {
        "0": "包年",
        "1": "包月",
        "2": "计次",
        "3": "计时",
        "4": "分段计价",
        "5": "免费"
    },
    'TOLLWAY': {
        "0": "手工收费",
        "1": "电子收费",
        "2": "自助缴费"
    },
    'remark_ml': {
        0: "全免费",
        1: "住宿免费",
        2: "就餐免费",
        3: "购物免费",
        4: "满额免费",
        5: "消费免费",
        6: "内部开放",
        7: "汽车美容"
    },
    'remark_hm': {
        11: "搭升降機",
        12: "祗限訪客",
        13: "祗停貨車",
        14: "30 分鐘免費",
        15: "電動車充電",
        16: "留匙",
        17: "洗車及打蠟"
    },
    'RETING': {
        0: "未调查",
        1: "其他",
        3: "三星级",
        4: "四星级",
        5: "五星级",
        6: "超五星级",
        7: "一星级",
        8: "二星级",
        13: "准三星级",
        14: "准四星级",
        15: "准五星级",
        16: "准一星级",
        17: "准二星级"
    },
    'CREDIT_CARD':{
        0: "不支持信用卡",
        1: "维士(visa)",
        2: "万事达(mastercard)",
        3: "大来(dinas)",
        4: "日本国际信用卡(jcb)",
        5: "美 国 运 通 (AmericaExpress)",
        6: "银联(unionpay)"
    },
    'payment_ml': {
        0: "现金",
        1: "借记卡",
        2: "信用卡",
        3: "储值卡"
    },
    'payment_hm': {
        10: "八達通",
        11: "VISA",
        12: "MasterCard",
        13: "現金",
        14: "其他"
    },
    service_ml: {
        1: "便利店",
        2: "洗车",
        3: "汽车维修",
        4: "卫生间",
        5: "餐饮",
        6: "住宿",
        7: "换油",
        8: "自助加油"
    },
    service_hm: {
        11: "換油服務Lube Service",
        12: "洗車服務Car Wash",
        13: "便利店Convenience Store",
        14: "廁所Toilet"
    },
    oilType: {
        "0": "其他",
        "89": "89号汽油",
        "90": "90号汽油",
        "92": "92号汽油",
        "93": "93号汽油",
        "95": "95号汽油",
        "97": "97号汽油",
        "98": "98号汽油"
    },
    mgType: {
        "0": "其他",
        "M5": "M5号汽油",
        "M10": "M10号汽油",
        "M15": "M15号汽油",
        "M30": "M30号汽油",
        "M50": "M50号汽油",
        "M85": "M85号汽油",
        "M100": "M100号汽油",
    },
    egType: {
        "0": "其他",
        "E90": "E90号汽油",
        "E92": "E92号汽油",
        "E93": "E93号汽油",
        "E95": "E95号汽油",
        "E97": "E97号汽油",
        "E98": "E98号汽油",
    },
    fuelType_ml: {
        "0": "柴油",
        "8": "生物柴油"
    },
    // fuelType_ml: {
    //     0: "柴油(Diesel)",
    //     1: "汽油(Gasoline)",
    //     2: "甲醇汽油(MG85)",
    //     3: "其它",
    //     4: "液化石油气(LPG)",
    //     5: "天然气(CNG)",
    //     6: "乙醇汽油(E10)",
    //     7: "氢燃料(Hydrogen)",
    //     8: "生物柴油(Biodiesel)",
    //     9: "液化天然气(LNG)"
    // },
    fuelType_hm: {
        11: "SINO X Power",
        12: "SINO Power",
        13: "SINO Disel",
        21: "力勁柴油",
        22: "清新汽油",
        23: "超級汽油",
        31: "Gold黄金",
        32: "Platinum白金",
        33: "Diesel特配柴油",
        34: "柴油现金咭",
        41: "Disel超低硫柴油",
        42: "8000電油",
        43: "F-1特級電油",
        51: "Disesel柴油",
        52: "FuelSave慳油配方汽油",
        53: "Shell V-Power",
        61: "超勁慳油配方汽油",
        62: "清潔配方低硫柴油"
    },
     gasFuelType_ml: {
         3: "其他",
         4: "液化石油气",
         5: "天然气",
         7: "氢燃料",
         8: "生物柴油",
         9: "液化天然气"
     },
     gasFuelType_hm: {
         14: "LPG",
         24: "LPG",
         35: "AutoGas石油氣",
         44: "AutoGas石油氣",
         54: "AutoGas石油氣"
     },
    sportsVenuesBuildingType: {
        0: "室内",
        1: "室外"
    },
    PAYMENT:{   //支付方式
        10:'八速通',
        11:'VISA',
        12:'MasterCard',
        13:'现金',
        15:'储值卡',
        14:'其他'
    },
    chargingType:{   //充电站类型
        1:'充电站',
        2:'充换电站',
        3:'充电桩组',
        4:'换电站'
    },
    chargingOpenType:{   //换电开放限制
        1:'无限制',
        2:'对环卫车开放',
        3:'对公交车开放',
        4:'对出租车开放',
        5:'对其他特种车辆开放',
        6:'对自有车辆开放'
    },
    serviceProv:{   //充电站类型
        0:'其他',
        1:'国家电网',
        2:'南方电网',
        3:'中石油',
        4:'中石化',
        5:'中海油',
        6:'中国普天',
        7:'特来电',
        8:'循道新能源',
        9:'富电科技',
        10:'华商三优',
        11:'中電',
        12:'港燈',
        13:'澳電',
        14:'绿狗',
        15:'EVCARD',
        16:'星星充电',
        17:'电桩',
        18:'依威能源'
    },
    parkingFees: {
        0: "免费",
        1: "收费"
    },
    stationAvailableState: {
        0: "开放",
        1: "未开放",
        2: "维修中",
        3: "建设中",
        4: "规划中"
    },
    plugType: {
        0: "交流电3孔家用",
        1: "国际交流电7孔插槽",
        2: "国际直流电9孔插槽",
        3: "美式交流5孔插槽",
        4: "美式直流Combo插槽",
        5: "欧式交流7孔插槽",
        6: "欧式直流Combo插槽",
        7: "日式直流CHAdeMO插槽",
        8: "特斯拉专用插槽",
        9: "其他",
    },
    openType: {
        1: "对所有车辆开放",
        2: "对环卫车开放",
        3:'对公交车开放',
        4:'对出租车开放',
        5:'对其他特种车辆开放',
        6:'对自有车辆开放',
        7: "个人充电桩"
    },
    plotAvailableState: {
        0: "可以使用（有电）",
        1: "不可使用（没电）",
        2: "维修中",
        3: "建设中",
        4: "规划中"
    },
    plotPayment: {
        0: "其他",
        1: "现金",
        2: "信用卡",
        3: "借记卡",
        4: "特制充值卡",
        5: "APP"
    }

};
