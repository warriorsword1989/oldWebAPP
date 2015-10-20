/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.rdNode = fastmap.dataApi.GeoDataModel.extend({

    options: {},


    /***
     * @param nodePid
     * Node的PID
     */
    nodePid:null,

    /***
     * @param kind
     * NODE种别
     */
    kind:1,

    /***
     * @param geometry
     * Node的几何
     */
    geometry:null,

    /***
     * @param adasFlag
     * ADAS标识
     */
    adasFlag:2,

    /***
     * @param editFlag
     * 编辑标识
     */
    editFlag:1,

    /***
     * @param difGroupId
     * 差分产品ID
     */
    difGroupId:"",

    /***
     * @param srcFlag
     * 数据来源
     */
    srcFlag:1,

    /***
     * @param digitalLevel
     * 精度级别
     */
    digitalLevel:0,

    /***
     * @param reserved
     * 预留信息
     */
    reserved:"",

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
        this.id = data["nodePid"];
        if(!data["geometry"]){
            throw "node对象没有几何信息";
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.kind = data["kind"] || 1;
        this.geometry = data["geometry"] || null;
        this.adasFlag = data["adasFlag"] || 2;
        this.editFlag = data["editFlag"] || 1;
        this.difGroupId = data["difGroupId"] || "";
        this.srcFlag = data["srcFlag"] || 6;
        this.digitalLevel = data["digitalLevel"] || 0;
        this.reserved = data["reserved"] || "";
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
        data["kind"] = this.kind || 1;
        data["geometry"]  = this.geometry || null;
        data["adasFlag"] = this.adasFlag || 2;
        data["editFlag"] = this.editFlag || 1;
        data["difGroupId"] = this.difGroupId || "";
        data["srcFlag"] = this.srcFlag || 6;
        data["digitalLevel"] = this.digitalLevel || 0;
        data["reserved"]  = this.reserved || "";
        data["uRecord"] = this.uRecord  || 0;
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
        data["kind"] = this.kind || 1;
        data["geometry"]  = this.geometry || null;
        data["adasFlag"] = this.adasFlag || 2;
        data["editFlag"] = this.editFlag || 1;
        data["difGroupId"] = this.difGroupId || "";
        data["srcFlag"] = this.srcFlag || 6;
        data["digitalLevel"] = this.digitalLevel || 0;
        data["reserved"]  = this.reserved || "";
        data["uRecord"] = this.uRecord  || 0;
        data["uFields"] = this.uFields || "";
        return data;
    }
});

/***
 * Rdnode初始化函数
 * @param id
 * @param point 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdnode = function (data, options) {
    return new fastmap.dataApi.rdNode(data, options);
}

