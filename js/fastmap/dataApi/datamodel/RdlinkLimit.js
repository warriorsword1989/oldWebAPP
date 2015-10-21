/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.linkLimit = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /***
     * @param linkPid
     * 道路Id
     */
    linkPid:null,
    /***
     * @param type
     * 限制类型
     */
    type:3,
    /***
     * @param limitDir
     * 限制方向
     */
    limitDir:0,
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
     * @param data 初始化属性对象
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
        this.type = data["type"] || 3;
        this.limitDir = data["limitDir"] || 0;
        this.timeDomain = data["timeDomain"] || "";
        this.vehicle = data["vehicle"] || 0;
        this.tollType= data["tollType"] || 9;
        this.weather = data["weather"] || 9;
        this.inputTime = data["inputTime"] || "";
        this.processFlag = data["processFlag"] || 0;
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
        data["type"] = this.type || 3;
        data["limitDir"] = this.limitDir || 0;
        data["timeDomain"]  = this.timeDomain || "";
        data["vehicle"] = this.vehicle || 0;
        data["tollType"] = this.tollType || 9;
        data["weather"] = this.weather || 9;
        data["inputTime"]  = this.inputTime || "";
        data["processFlag"] = this.processFlag || 0;
        data["uRecord"] = this.uRecord || 0;
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
        data["type"] = this.type || 3;
        data["limitDir"] = this.limitDir || 0;
        data["timeDomain"]  = this.timeDomain || "";
        data["vehicle"] = this.vehicle || 0;
        data["tollType"] = this.tollType || 9;
        data["weather"] = this.weather || 9;
        data["inputTime"]  = this.inputTime || "";
        data["processFlag"] = this.processFlag || 0;
        data["uRecord"] = this.uRecord || 0;
        data["uFields"] = this.uFields || "";
        return data;
    }
});

/***
 * linkLimit初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.linklimit = function (data, options) {
    return new fastmap.dataApi.linkLimit(data, options);
};

