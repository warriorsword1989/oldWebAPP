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
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        if(!data["detailId"]){
            throw "对象没有对应detailId"
        }

        this.geoemtry = geometry;
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.detailId = data["detailId"] || null;
        this.restricPid = data["restricPid"] || null;
        this.outLinkPid = data["outLinkPid"] || null;
        this.flag = data["flag"] || 2;
        this.restricInfo = data["restricInfo"] ||0;
        this.type = data["type"] || 1;
        this.relationshipType = data["relationshipType"] || 1;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["detailId"] = this.detailId ;
        data["restricPid"] = this.restricPid;
        data["outLinkPid"] = this.outLinkPid;
        data["flag"] = this.flag;
        data["restricInfo"] = this.restricInfo;
        data["type"] = this.type;
        data["relationshipType"] = this.relationshipType;
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
        data["detailId"] = this.detailId ;
        data["restricPid"] = this.restricPid;
        data["outLinkPid"] = this.outLinkPid;
        data["flag"] = this.flag;
        data["restricInfo"] = this.restricInfo;
        data["type"] = this.type;
        data["relationshipType"] = this.relationshipType;
        return data;
    }
});

/***
 * rdRestriction
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
fastmap.dataApi.rdrestrictiondetail = function (data, options) {
    return new fastmap.dataApi.rdRestrictionDetail(data, options);
}