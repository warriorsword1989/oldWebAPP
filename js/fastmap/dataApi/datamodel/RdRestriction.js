/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.rdRestriction = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /***
     * @param pid
     * 交线ID
     */
    pid:null,

    /***
     * @param inLinkPid
     * 进入线Id
     */
    inLinkPid:null,

    /***
     * @param nodePid
     * 进入node
     */
    nodePid:null,

    /***
     * @param restricInfo
     * 限制信息
     */
    restricInfo:"",

    /***
     * @param kgFlag
     * KG标志
     */
    kgFlag:0,

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
        if(!data["pid"]){
            throw "对象没有对应pid"
        }
        else{
            this.id = data["pid"];
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || null;
        this.inLinkPid = data["inLinkPid"] || null;
        this.restricInfo = data["restricInfo"] || null;
        this.kgFlag = data["kgFlag"] || 0;
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
        data["pid"] = this.pid || null;
        data["inLinkPid"] = this.inLinkPid || null;
        data["restricInfo"] = this.restricInfo|| null;
        data["kgFlag"] = this.kgFlag  || 0;
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
        data["pid"] = this.pid || null;
        data["inLinkPid"] = this.inLinkPid || null;
        data["restricInfo"] = this.restricInfo|| null;
        data["kgFlag"] = this.kgFlag  || 0;
        data["uRecord"] = this.uRecord || 0;
        data["uFields"] = this.uFields || "";
        return data;
    }
});

/***
 * rdRestriction
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
fastmap.dataApi.rdrestriction = function (data, options) {
    return new fastmap.dataApi.rdRestriction(data, options);
}