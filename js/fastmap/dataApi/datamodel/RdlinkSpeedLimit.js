/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.speedLimit = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /***
     * @param linkPid
     * 道路Id
     */
    linkPid:null,
    /***
     * @param speedType
     * 限速类型
     */
    speedType:0,
    /***
     * @param fromSpeedLimit
     * 顺向限速
     */
    fromSpeedLimit:0,

    /***
     * @param toSpeedLimit
     * 逆向限速
     */
    toSpeedLimit:0,

    /***
     * @param speedClass
     * 限速等级
     */
    speedClass:0,

    /***
     * @param fromLimitSrc
     * 顺向限速来源
     */
    fromLimitSrc:0,

    /***
     * @param toLimitSrc
     * 逆向限速来源
     */
    toLimitSrc:0,

    /***
     * @param speedDependent
     * 限速条件
     */
    speedDependent:0,

    /***
     * @param speedClassWork
     * 等级赋值标记
     */
    speedClassWork:1,

    /***
     * @param timeDomain
     * 时间段
     */
    timeDomain:"",
    /***
     * @param vehicle
     * 车辆类型
     */
    vehicle:0,
    /***
     * @param tollType
     * 收费类型
     */
    tollType:9,

    /***
     * @param weather
     * 天气条件
     */
    weather:9,

    /***
     * @param inputTime
     * 天气条件
     */
    inputTime:"",

    /***
     * @param processFlag
     * 赋值方式
     */
    processFlag:0,

    /***
     * @param uRecord
     * 更新记录
     */
    uRecord:0,

    /***
     * @param uFields
     * 更新字段
     */
    uFields:"",


    /***
     *
     * @param id id
     * @param point 初始化rdnode的点
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }
        else{
            this.id = data["linkPid"];
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.speedType = data["speedType"] || 0;
        this.fromSpeedLimit = data["fromSpeedLimit"] || 0;
        this.toSpeedLimit = data["toSpeedLimit"] || 0;
        this.speedClass = data["speedClass"] || 0;
        this.fromLimitSrc = data["fromLimitSrc"] || 0;
        this.toLimitSrc = data["toLimitSrc"] ||0;
        this.speedDependent = data["speedDependent"] || 0;
        this.timeDomain = data["timeDomain"] || "";
        this.speedClassWork = data["speedClassWork"] || 1;
        this.uRecord = data["uRecord"] || 0;
        this.uFields = data["uFields"] || "";
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid || "";
        data["speedType"] = this.speedType || 0;
        data["fromSpeedLimit"]  = this.fromSpeedLimit || 0;
        data["toSpeedLimit"] = this.toSpeedLimit || 0;
        data["speedClass"] = this.speedClass || 0;
        data["fromLimitSrc"]  = this.fromLimitSrc || 0;
        data["toLimitSrc"] = this.toLimitSrc  ||0;
        data["speedDependent"] = this.speedDependent || 0;
        data["timeDomain"]  = this.timeDomain || "";
        data["speedClassWork"] = this.speedClassWork || 1;
        data["uRecord"]  = this.uRecord || 0;
        data["uFields"] = this.uFields || "";
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid || "";
        data["speedType"] = this.speedType || 0;
        data["fromSpeedLimit"]  = this.fromSpeedLimit || 0;
        data["toSpeedLimit"] = this.toSpeedLimit || 0;
        data["speedClass"] = this.speedClass || 0;
        data["fromLimitSrc"]  = this.fromLimitSrc || 0;
        data["toLimitSrc"] = this.toLimitSrc  ||0;
        data["speedDependent"] = this.speedDependent || 0;
        data["timeDomain"]  = this.timeDomain || "";
        data["speedClassWork"] = this.speedClassWork || 1;
        data["uRecord"]  = this.uRecord || 0;
        data["uFields"] = this.uFields || "";
        return data;
    }
});

/***
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.speedlimit = function (data, options) {
    return new fastmap.dataApi.speedLimit(data, options);
}

