/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.rdRestrictionDetail = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /***
     * @param detailId
     * 详细交限
     */
    detailId:null,

    /***
     * @param restricPid
     * 交限号码
     */
    restricPid:null,

    /***
     * @param outLinkPid
     * 退出link
     */
    outLinkPid:null,

    /***
     * @param flag
     * 交限标志
     */
    flag:2,

    /***
     * @param restricInfo
     * 限制信息
     */
    restricInfo:0,

    /***
     * @param type
     * 限制类型
     */
    type:1,

    /***
     * @param relationshipType
     * 关系类型
     */
    relationshipType:1,

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
    initialize: function (geometry, attributes, options) {
        L.setOptions(this, options);
        if(!attributes["detailId"]){
            throw "对象没有对应detailId"
        }
        else{
            this.id = attributes["detailId"];
        }

        this.geoemtry = geometry;
        this.setAttributeData(attributes);
    },

    setAttributeData:function(data){
        this.detailId = data["detailId"];
        this.restricPid = data["restricPid"];
        this.outLinkPid = data["outLinkPid"];
        this.flag = data["flag"];
        this.restricInfo = data["restricInfo"];
        this.type = data["type"];
        this.relationshipType = data["relationshipType"];
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
        data["detailId"] = this.detailId;
        data["restricPid"] = this.restricPid;
        data["outLinkPid"] = this.outLinkPid;
        data["flag"] = this.flag;
        data["restricInfo"] = this.restricInfo;
        data["type"] = this.type;
        data["relationshipType"] = this.relationshipType;
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
        data["detailId"] = this.detailId;
        data["restricPid"] = this.restricPid;
        data["outLinkPid"] = this.outLinkPid;
        data["flag"] = this.flag;
        data["restricInfo"] = this.restricInfo;
        data["type"] = this.type;
        data["relationshipType"] = this.relationshipType;
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
fastmap.dataApi.rdrestrictiondetail = function (geometry, attributes, options) {
    return new fastmap.dataApi.rdRestrictionDetail(geometry, attributes, options);
}