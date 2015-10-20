/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.linkZone = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /***
     * @param linkPid
     * 道路Id
     */
    linkPid:null,

    /***
     * @param regionId
     * 区划号码
     */
    regionId:0,

    /***
     * @param type
     * zone类型
     */
    type:0,
    /***
     * @param side
     * 位置关系
     */
    side:0,

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
        this.regionId = data["regionId"] || 0;
        this.type = data["type"] || 0;
        this.side = data["side"] || 0;
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
        data["regionId"] = this.regionId || 0;
        data["type"] = this.type || 0;
        data["side"] = this.side || 0;
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
        data["linkPid"] = this.linkPid || "";
        data["regionId"] = this.regionId || 0;
        data["type"] = this.type || 0;
        data["side"] = this.side || 0;
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
fastmap.dataApi.linkzone = function (data, options) {
    return new fastmap.dataApi.linkZone(data, options);
}

