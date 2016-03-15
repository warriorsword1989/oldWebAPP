/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.rdNode = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /**
     * 数据类型
     */
    type:"rdNode",

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
     * @param restrictions
     * 交限
     */
    restrictions:[],

    /***
     * @param restrictionConditions
     * 交限
     */
    restrictionConditions:[],

    /***
     * @param restrictionDetails
     * 交限
     */
    restrictionDetails:[],


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.id = data["nodePid"];
        this.geometry = data["geometry"];
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || "";
        this.kind = data["kind"] || 1;
        this.geometry = data["geometry"] || null;
        this.adasFlag = data["adasFlag"] || 2;
        this.editFlag = data["editFlag"] || 1;

        this.difGroupid = data["difGroupid"] || "";
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
        data["pid"] = this.pid;
        data["kind"] = this.kind;
        data["geometry"]  = this.geometry;
        data["adasFlag"] = this.adasFlag;
        data["editFlag"] = this.editFlag;
        data["difGroupId"] = this.difGroupId;
        data["srcFlag"] = this.srcFlag;
        data["digitalLevel"] = this.digitalLevel;
        data["reserved"]  = this.reserved;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["forms"]=this.forms;
        data["meshes"]=this.meshes;
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
        data["kind"] = this.kind;
        data["geometry"]  = this.geometry;
        data["adasFlag"] = this.adasFlag;
        data["editFlag"] = this.editFlag;
        data["difGroupId"] = this.difGroupId;
        data["srcFlag"] = this.srcFlag;
        data["digitalLevel"] = this.digitalLevel;
        data["reserved"]  = this.reserved;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["forms"]=this.forms;
        data["meshes"]=this.meshes;
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
fastmap.dataApi.rdnode = function (geometry, attributes, options) {
    return new fastmap.dataApi.rdNode(geometry, attributes, options);
}

