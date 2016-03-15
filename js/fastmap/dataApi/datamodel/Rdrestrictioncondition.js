/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.rdRestrictionCondition = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /***
     * @param detailId
     * 详细交限
     */
    detailId:null,

    /***
     * @param timeDomain
     * 时间段
     */
    timeDomain:null,

    /***
     * @param vehicle
     * 车辆类型
     */
    vehicle:0,

    /***
     * @param resTrailer
     * 拖挂车限制
     */
    resTrailer:0,

    /***
     * @param resWeigh
     * 车辆限重
     */
    resWeigh:null,

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
     * 限制类型
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
        this.timeDomain = data["timeDomain"];
        this.vehicle = data["vehicle"];
        this.resTrailer = data["resTrailer"];
        this.resWeigh = data["resWeigh"];
        this.resAxleLoad = data["resAxleLoad"];
        this.resAxleCount = data["resAxleCount"];
        this.resOut = data["resOut"];
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
        data["timeDomain"] = this.timeDomain;
        data["vehicle"] = this.vehicle;
        data["resTrailer"]  = this.resTrailer;
        data["resWeigh"]  = this.resWeigh;
        data["resAxleLoad"]  = this.resAxleLoad;
        data["resAxleCount"]  = this.resAxleCount;
        data["resOut"] = this.resOut;
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
        data["detailId"] = this.detailId || null;
        data["timeDomain"] = this.timeDomain || null;
        data["vehicle"] = this.vehicle || 0;
        data["resTrailer"]  = this.resTrailer || 0;
        data["resWeigh"]  = this.resWeigh || 0;
        data["resAxleLoad"]  = this.resAxleLoad || 0;
        data["resAxleCount"]  = this.resAxleCount || 0;
        data["resOut"] = this.resOut  || 0;
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
fastmap.dataApi.rdrestrictioncondition = function (geometry, attributes, options) {
    return new fastmap.dataApi.rdRestrictionCondition(geometry, attributes, options);
}