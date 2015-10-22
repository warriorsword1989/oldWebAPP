/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.rdLink = fastmap.dataApi.GeoDataModel.extend({

    options: {},

    /***
     * @param linkPid
     * 起点link的PID
     */
    linkPid:"",

    /***
     * @param sNodePid
     * 起点Node的PID
     */
    sNodePid:null,

    /***
     * @param eNodePid
     * 终点Node的PID
     */
    eNodePid:null,

    /***
     * @param kind
     * 道路类型
     */
    kind:7,
    /***
     * @param direct
     * 道路通行方向
     */
    direct:1,

    /*
     *  @param appInfo
     *  供用信息
     */
    appInfo:1,

    /*
     *  @param tollInfo
     *  收费信息
     */
    tollInfo:2,

    /*
     * @param routeAdopt
     * 路径采纳
     */
    routeAdopt:2,

    /*
     * @param multiDigitized
     * 上下线分离
     */
    multiDigitized:0,

    /*
     * @param developState
     * 开发状态
     */
    developState:0,

    /*
     * @param imiCode
     * IMI代码
     */
    imiCode:0,

    /*
     * @param specialTraffic
     * 特殊交通
     */
    specialTraffic:0,

    /*
     * @param functionClass
     * 功能等级
     */
    functionClass:5,

    /*
     * @param urban
     * 城市道路
     */
    urban:0,

    /*
     * @param paveStatus
     * 铺设状态
     */
    paveStatus:0,

    /*
     * @param laneNum
     * 总车道数
     */
    laneNum:2,

    /*
     * @param laneLeft
     * 左车道数
     */
    laneLeft:0,

    /*
     * @param LANE_RIGHT
     * 右车道数
     */
    laneRight:0,

    /*
     * @param laneWidthLeft
     * 逆向车道宽度标识
     */
    laneWidthLeft:1,

    /*
     * @param LANE_WIDTH_RIGHT
     * 顺向车道宽度标识
     */
    laneWidthRight:1,

    /*
     * @param laneClass
     * 车道等级
     */
    laneClass:2,

    /*
     * @param width
     * 道路幅宽
     */
    width:0,

    /*
     * @param isViaduct
     * 是否高架
     */
    isViaduct:0,

    /*
     * @param leftRegionId
     * 左区划号码
     */
    leftRegionId:0,

    /*
     * @param rightRegionId
     * 右区划号码
     */
    rightRegionId:0,

    /*
     * @param geometry
     * LINK坐标
     */
    geometry:null,

    /*
     * @param length
     * LINK长度
     */
    length:0,

    /*
     * @param meshId
     * 图幅号码
     */
    meshId:0,

    /*
     * @param onewayMark
     * 单方向标注
     */
    onewayMark:0,

    /*
     * @param streetLight
     * 路灯设施
     */
    streetLight:0,

    /*
     * @param parkingLot
     * 停车设施
     */
    parkingLot:0,

    /*
     * @param adasFlag
     * ADAS标识
     */
    adasFlag:0,

    /*
     * @param sidewalkFlag
     * 人行便道标记
     */
    sidewalkFlag:0,

    /*
     * @param WALKSTAIR_FLAG
     * 人行阶梯标记
     */
    walkstairtFlag:0,

    /*
     * @param dictType
     * DICI城市类型
     */
    diciType:0,

    /*
     * @param walkFlag
     * 行人步行属性
     */
    walkFlag:0,

    /*
     * @param difGroupId
     * 差分产品ID
     */
    difGroupId:"",

    /*
     * @param srcFlag
     * 数据来源
     */
    srcFlag:6,

    /*
     * @param digitalLevel
     * 精度级别
     */
    digitalLevel:0,

    /*
     * @param editFlag
     * 编辑标识
     */
    editFlag:1,

    /*
     * @param truckFlag
     * 卡车验证标识
     */
    truckFlag:0,

    /*
     * @param feeSid
     * 计费标准
     */
    feeSid:0,

    /*
     * @param feeFlag
     * 计费赋值标识
     */
    feeFlag:0,

    /*
     * @param systemId
     * 区域标识
     */
    systemId:0,

    /*
     * @param originLinkPid
     * 初始版道路线号
     */
    originLinkPid:0,

    /*
     * @param centerDivider
     * 道路中心隔离带类型
     */
    centerDivider:0,

    /*
     * @param parkingFlag
     * 是否包含占道停车场
     */
    parkingFlag:0,

    /*
     * @param memo
     * 备注信息
     */
    memo:"",

    /*
     * @param reserved
     * 预留信息
     */
    reserved:"",

    /*
     * @param uRecord
     * 更新记录
     */
    uRecord:0,

    /*
     * @param uFields
     * 更新字段
     */
    uFields:"",

    /*
     * @param forms
     * Rdlink的form子表
     */
    forms:[],

    /*
     * @param limits
     * Rdlink的limit子表
     */
    limits:[],

    /*
     * @param names
     * Rdlink的name子表
     */
    names:[],

    /*
     * @param rtics
     * Rdlink的rtic子表
     */
    rtics:[],

    /*
     * @param sidewalks
     * Rdlink的sidewalk子表
     */
    sideWalks:[],

    /*
     * @param speedLimits
     * Rdlink的speedLimit子表
     */
    speedLimits:[],

    /*
     * @param truckLimits
     * Rdlink的truckLimit子表
     */
    truckLimits:[],

    /*
     * @param walkStairs
     * Rdlink的walkStair子表
     */
    walkStairs:[],

    /*
     * @param zones
     * Rdlink的zones子表
     */
    zones:[],

    /***
     *
     * @param geometry geometry
     * @param attributes 构成rdlink的属性
     * @param options 其他可选参数
     */
    initialize: function (geometry,attributes, options) {
        L.setOptions(this, options);
        this.id = attributes["linkId"];

        this.geometry = geometry;

        var vertices = geometry.getVertices();

        if(!attributes["sNodePid"]){
            throw  "link对象中没有sNode";
        }
        else{

            this.startNode = fastmap.dataApi.rdnode(attributes["sNodePid"], vertices[0]);
        }

        if(!attributes["eNodePid"]){
            throw "link对象中没有eNode";
        }
        else{
            this.endNode = fastmap.dataApi.rdnode(attributes["eNodePid"], vertices[vertices.length - 1]);
        }
        this.setAttributeData(attributes);
    },

    /**
     * 将请求返回结果给对象属性赋值
     * @method setAttributeData
     *
     * @param {object} data.
     */
    setAttributeData:function(data){
        this.linkPid = data["linkPid"]|| null;
        this.sNodePid = data["sNodePid"]|| null;
        this.eNodePid = data["eNodePid"] || null;
        this.kind = data["kind"] || 7;
        this.direct = data["direct"] || 1;
        this.appInfo = data["appInfo"] || 1;
        this.tollInfo = data["tollInfo"] || 2;
        this.routeAdopt = data["routeAdopt"] || 2;
        this.multiDigitized = data["multiDigitized"] || 0;
        this.developState = data["developState"] || 0;
        this.imiCode = data["imiCode"] || 0;
        this.specialTraffic = data["specialTraffic"] || 0;
        this.functionClass = data["functionClass"] || 5;
        this.urban = data["urban"] || 0;
        this.paveStatus = data["paveStatus"] || 0;
        this.laneNum = data["laneNum"] || 2;
        this.laneLeft = data["laneLeft"] || 0;
        this.laneRight = data["laneRight"] || 0;
        this.laneWidthLeft = data["laneWidthLeft"] || 1;
        this.laneWidthRight = data["laneWidthRight"] || 1;
        this.laneClass = data["laneClass"] || 2;
        this.width = data["width"] || 0;
        this.isViaduct = data["isViaduct"] || 0;
        this.leftRegionId = data["leftRegionId"] || 0;
        this.rightRegionId = data["rightRegionId"] || 0;
        this.geometry = data["geoemtry"] || null;
        this.length = data["length"] || 0;
        this.meshId = data["meshId"] || 0;
        this.onewayMark = data["onewayMark"] || 0;
        this.streetLight = data["streetLight"] || 0;
        this.parkingLot = data["parkingLot"] || 0;
        this.adasFlag = data["adasFlag"] || 0;
        this.sidewalkFlag = data["sidewalkFlag"] || 0;
        this.walkstairtFlag = data["walkstairtFlag"] || 0;
        this.diciType = data["diciType"] || 0;
        this.walkFlag = data["walkFlag"] || 0;
        this.difGroupId = data["difGroupId"] || "";
        this.srcFlag = data["srcFlag"] || 6;
        this.digitalLevel = data["digitalLevel"] || 0;
        this.editFlag = data["editFlag"] || 1;
        this.truckFlag = data["truckFlag"] || 0;
        this.feeStd = data["feeStd"] || 0;
        this.feeFlag = data["feeFlag"] || 0;
        this.systemId = data["systemId"] || 0;
        this.originLinkPid = data["originLinkPid"] || 0;
        this.centerDivider = data["centerDivider"] || 0;
        this.parkingFlag = data["parkingFlag"] || 0;
        this.memo = data["memo"] || "";
        this.reserved = data["reserved"] || "";
        this.uRecord = data["uRecord"] || 0;
        this.uFields = data["uFields"] || "";

        if (data["forms"].length>0){
            var form = new fastmap.dataApi.linkform(data["forms"][i]);
            this.forms.push(form);
        }

        if(data["limits"].length>0){
            var limit = new fastmap.dataApi.linkLimit(data["limits"][i]);
            this.limits.push(limit)
        }

        if(data["names"].length>0){
            var name = new fastmap.dataApi.linkName(data["names"][i]);
            this.names.push(name);
        }

        if(data["rtics"].length>0){
            var rtic = new fastmap.dataApi.linkRtic(data["rtics"][i]);
            this.rtics.push(rtic);
        }

        if(data["sideWalks"].length>0){
            var sideWalk = new fastmap.dataApi.linkSidewalk(data["sideWalks"][i]);
            this.sidewalks.push(sideWalk);
        }

        if(data["speedLimits"].length>0){
            var speeedLimit = new fastmap.dataApi.linkSpeedLimit(data["speedLimits"][i]);
            this.speedLimits.push(speeedLimit);
        }

        if(data["truckLimits"].length>0){
            var truckLimit = new fastmap.dataApi.linkTruckLimit(data["truckLimits"][i]);
            this.truckLimits.push(truckLimit);
        }

        if(data["walkStairs"].length>0){
            var walkStair = new fastmap.dataApi.linkWalkStair(data["walkStairs"][i]);
            this.walkStairs.push(walkStair);
        }

        if(data["zones"].length>0){
            var zone = new fastmap.dataApi.linkZone(data["zones"][i]);
            this.zones.push(zone);
        }
    },

    /**
     * 获取道路简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function(){
        var data = {};
        data["linkPid"] = this.linkPid || null;
        data["sNodePid"] = this.sNodePid || null;
        data["eNodePid"] = this.eNodePid  || null;
        data["kind"] = this.kind  || 7;
        data["direct"] = this.direct || 1;
        data["appInfo"] = this.appInfo || 1;
        data["tollInfo"] = this.tollInfo || 2;
        data["routeAdopt"] = this.routeAdopt || 2;
        data["multiDigitized"] = this.multiDigitized || 0;
        data["developState"]  = this.developState || 0;
        data["imiCode"] = this.imiCode || 0;

        return data;
    },

    /**
     * 获取道路详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function(){
        var data = {};
        data["linkPid"] = this.linkPid || null;
        data["sNodePid"] = this.sNodePid || null;
        data["eNodePid"] = this.eNodePid  || null;
        data["kind"] = this.kind  || 7;
        data["direct"] = this.direct || 1;
        data["appInfo"] = this.appInfo || 1;
        data["tollInfo"] = this.tollInfo || 2;
        data["routeAdopt"] = this.routeAdopt || 2;
        data["multiDigitized"] = this.multiDigitized || 0;
        data["developState"]  = this.developState || 0;
        data["imiCode"] = this.imiCode || 0;
        data["specialTraffic"] = this.specialTraffic || 0;
        data["functionClass"] = this.functionClass || 5;
        data["urban"] = this.urban || 0;
        data["paveStatus"] = this.paveStatus || 0;
        data["laneNum"] = this.laneNum|| 2;
        data["laneLeft"] = this.laneLeft|| 0;
        data["laneRight"] = this.laneRight|| 0;
        data["laneWidthLeft"] = this.laneWidthLeft|| 1;
        data["laneWidthRight"] = this.laneWidthRight|| 1;
        data["laneClass"]  = this.laneClass|| 2;
        data["width"] = this.width|| 0;
        data["isViaduct"] = this.isViaduct || 0;
        data["leftRegionId"] = this.leftRegionId|| 0;
        data["rightRegionId"] = this.rightRegionId  || 0;
        data["geoemtry"] = this.geometry || null;
        data["length"] = this.length|| 0;
        data["meshId"]  = this.meshId|| 0;
        data["onewayMark"] = this.onewayMark|| 0;
        data["streetLight"] = this.streetLight|| 0;
        data["parkingLot"] = this.parkingLot || 0;
        data["adasFlag"] = this.adasFlag || 0;
        data["sidewalkFlag"] = this.sidewalkFlag|| 0;
        data["walkstairtFlag"] = this.walkstairtFlag || 0;
        data["diciType"] =this.diciType || 0;
        data["walkFlag"] = this.walkFlag|| 0;
        data["difGroupId"] = this.difGroupId || "";
        data["srcFlag"] = this.srcFlag || 6;
        data["digitalLevel"] = this.digitalLevel || 0;
        data["editFlag"] = this.editFlag  || 1;
        data["truckFlag"] = this.truckFlag  || 0;
        data["feeStd"]  = this.feeStd || 0;
        data["feeFlag"]  = this.feeFlag || 0;
        data["systemId"]  = this.systemId || 0;
        data["originLinkPid"] = this.originLinkPid  || 0;
        data["centerDivider"] = this.centerDivider || 0;
        data["parkingFlag"] = this.parkingFlag || 0;
        data["memo"]  = this.memo || "";
        data["reserved"] = this.reserved || "";
        data["uRecord"]  = this.uRecord || 0;
        data["uFields"] = this.uFields || "";

        var forms=[];
        for(var i= 0,len=this.forms.length;i<len;i++){
            forms.push(this.forms[i].getIntegrate());
        }
        data["forms"] = forms;

        var limits=[];
        for(var i= 0,len = this.limits.length;i<len;i++){
            limits.push(this.limits[i].getIntegrate())
        }
        data["limits"] = limits;

        var names=[];
        for(var i= 0,len=this.names.length;i<len;i++){
            names.push(this.names[i].getIntegrate());
        }

        data["names"] = names;

        var rtics = [];
        for(var i= 0,len=this.rtics.length;i<len;i++){
            rtics.push(this.rtics[i].getIntegrate())
        }
        data["rtics"] = rtics;

        var sideWalks=[];
        for(var i= 0,len= this.sideWalks.length;i<len;i++){
            sideWalks.push(this.sideWalks[i].getIntegrate())
        }
        data["sideWalks"] =sideWalks;

        var speedLimits=[];
        for(var i= 0,len=this.speedLimits.length;i<len;i++){
            speedLimits.push(this.speedLimits[i].getIntegrate())
        }
        data["speedLimits"] = speedLimits;

        var truckLimits=[];
        for(var i= 0,len=this.truckLimits.length;i<len;i++){
            truckLimits.push(this.truckLimits[i].getIntegrate())
        }
        data["truckLimits"] = truckLimits;

        var walkStairs=[];
        for(var i= 0,len=this.walkStairs.length;i<len;i++){
            walkStairs.push(this.walkStairs[i].getIntegrate())
        }
        data["walkStairs"] = walkStairs;

        var zones=[];
        for(var i= 0,len=this.zones.length;i<len;i++){
            zones.push(this.zones[i].getIntegrate());
        }
        data["zones"] = zones;
        return data;
    }
});

/***
 * Rdlink初始化函数
 * @param node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdlink = function (geometry, attributes, options) {
    return new fastmap.dataApi.rdLink(geometry, attributes, options);
}

