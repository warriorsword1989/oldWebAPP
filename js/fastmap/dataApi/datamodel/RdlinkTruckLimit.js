/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.truckLimit = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /***
     * @param linkPid
     * 道路Id
     */
    linkPid:null,
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
     * @param resTrailer
     * 拖挂车限制
     */
    resTrailer:0,

    /***
     * @param resWeigh
     * 车辆限重
     */
    resWeigh:0,

    /***
     * @param resAxleLoad
     * 限制轴重
     */
    resAxleLoad:0,

    /***
     * @param resAxleCount
     * 限制轴数
     */
    resAxleCount:0,

    /***
     * @param resOut
     * 本外埠车辆限制
     */
    resOut:0,

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
        this.limitDir = data["limitDir"] || 0;
        this.timeDomain = data["timeDomain"] || "";
        this.resTrailer = data["resTrailer"] || 0;
        this.resWeigh = data["resWeigh"] || 0;
        this.resAxleLoad = data["resAxleLoad"] ||0;
        this.resAxleCount = data["resAxleCount"] || 0;
        this.resOut = data["resOut"] || 0;
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
        data["linkPid"] = this.linkPid  || "";
        data["limitDir"]  = this.limitDir || 0;
        data["timeDomain"] = this.timeDomain || "";
        data["resTrailer"]  = this.resTrailer || 0;
        data["resWeigh"] = this.resWeigh  || 0;
        data["resAxleLoad"] = this.resAxleLoad ||0;
        data["resAxleCount"]  = this.resAxleCount || 0;
        data["resOut"] = this.resOut || 0;
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
        data["linkPid"] = this.linkPid  || "";
        data["limitDir"]  = this.limitDir || 0;
        data["timeDomain"] = this.timeDomain || "";
        data["resTrailer"]  = this.resTrailer || 0;
        data["resWeigh"] = this.resWeigh  || 0;
        data["resAxleLoad"] = this.resAxleLoad ||0;
        data["resAxleCount"]  = this.resAxleCount || 0;
        data["resOut"] = this.resOut || 0;
        data["uRecord"] = this.uRecord || 0;
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
fastmap.dataApi.trucklimit = function (data, options) {
    return new fastmap.dataApi.trucklimit(data, options);
}

