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
    initialize: function (geometry,attributes, options) {
        L.setOptions(this, options);
        if(!data["pid"]){
            throw "对象没有对应pid"
        }
        else{
            this.id = data["pid"];
        }

        this.geoemtry = geometry;
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.inLinkPid = data["inLinkPid"];
        this.restricInfo = data["restricInfo"];
        this.kgFlag = data["kgFlag"];
        this.uRecord = data["uRecord"];
        this.uFields = data["uFields"];
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["restricInfo"] = this.restricInfo;
        data["kgFlag"] = this.kgFlag;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
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
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["restricInfo"] = this.restricInfo;
        data["kgFlag"] = this.kgFlag;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        return data;
    }
});

/***
 * rdRestriction
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
fastmap.dataApi.rdrestriction = function (geometry,attributes, options) {
    return new fastmap.dataApi.rdRestriction(geometry,attributes, options);
}