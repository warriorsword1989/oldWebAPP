/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.linkRtic = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /***
     * @param linkPid
     * 道路Id
     */
    linkPid:null,
    /***
     * @param code
     * Rtic代码
     */
    code:0,
    /***
     * @param rank
     * rtic等级
     */
    rank:0,

    /***
     * @param rticDir
     * rtic方向
     */
    rticDir:0,

    /***
     * @param updownFlag
     * 上下行标识
     */
    updownFlag:0,

    /***
     * @param rangeType
     * rtic域类型
     */
    rangeType:0,

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
        this.code = data["code"] || 0;
        this.rank = data["rank"] || 0;
        this.rticDir = data["rticDir"] || 0;
        this.updownFlag = data["updownFlag"] || 0;
        this.rangeType = data["rangeType"] || 0;
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
        data["code"] = this.code || 0;
        data["rank"]  = this.rank || 0;
        data["rticDir"] = this.rticDir || 0;
        data["updownFlag"] = this.updownFlag || 0;
        data["rangeType"]  = this.rangeType || 0;
        this.uRecord = data["uRecord"] || 0;
        this.uFields = data["uFields"] || "";
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
        data["code"] = this.code || 0;
        data["rank"]  = this.rank || 0;
        data["rticDir"] = this.rticDir || 0;
        data["updownFlag"] = this.updownFlag || 0;
        data["rangeType"]  = this.rangeType || 0;
        this.uRecord = data["uRecord"] || 0;
        this.uFields = data["uFields"] || "";
        return data;
    }
});

/***
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.linkrtic = function (data, options) {
    return new fastmap.dataApi.linkRtic(data, options);
}

