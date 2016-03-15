/**
 * Created by wangtun on 2015/9/9.
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
     * @param id id
     * @param point 初始化rdnode的点
     * @param options 其他可选参数
     */
    initialize: function (geometry, attributes, options) {
        L.setOptions(this, options);
        this.id = data["nodePid"];
        this.geometry = geometry;
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"];
        this.kind = data["kind"];
        this.geometry = data["geometry"];
        this.adasFlag = data["adasFlag"];
        this.editFlag = data["editFlag"];
        this.difGroupId = data["difGroupId"];
        this.srcFlag = data["srcFlag"];
        this.digitalLevel = data["digitalLevel"];
        this.reserved = data["reserved"];
        this.uRecord = data["uRecord"];
        this.uFields = data["uFields"];

        if(data["restrictions"].length>0){
            var rdRestriction = new fastmap.dataApi.rdRestriction(data["restricions"][i]);
            this.restrictions.push(rdRestriction);
        }

        if(data["restrictionConditions"].length>0){
            var rdRestrictionCondition = new fastmap.dataApi.rdRestrictionCondition(data["restrictionConditions"][i]);
            this.restrictionConditions.push(rdRestrictionCondition);
        }

        if(data["restrictionDetails"].length>0){
            var rdRestrictionDetail = new fastmap.dataApi.rdRestrictionDetail(data["restrictionDetails"][i]);
            this.restrictionDetails.push(rdRestrictionDetail);
        }
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
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
        data["linkPid"] = this.linkPid;
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

        var restrictions=[];
        for(var i= 0,len=this.restrictions.length;i<len;i++){
            restrictions.push(this.restrictions[i].getIntegrate());
        }
        data["restrictions"] = restrictions;

        var restrictionConditions =[];
        for(var i= 0,len=this.restrictionConditions.length;i<len;i++){
            restrictionConditions.push(this.restrictionConditions[i].getIntegrate());
        }
        data["restrictionConditions"] = restrictionConditions;

        var restrictionDetails=[];
        for(var i= 0,len=this.restrictionDetails.length;i<len;i++){
            restrictionDetails.push(this.restrictionDetails[i].getIntegrate());
        }
        data["restrictionDetails"] = restrictionDetails;
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

