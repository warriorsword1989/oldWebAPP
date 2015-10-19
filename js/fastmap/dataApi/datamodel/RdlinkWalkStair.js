/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.linkWalkStair = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /***
     * @param linkPid
     * 道路Id
     */
    linkPid:null,
    /***
     * @param stairLoc
     * 位置关系
     */
    stairLoc:0,
    /***
     * @param stairFlag
     * 升降标识
     */
    stairFlag:0,

    /***
     * @param workDir
     * 作业方向
     */
    workDir:0,

    /***
     * @param captureFlag
     * 采集标识
     */
    captureFlag:0,

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
        this.stairLoc = data["stairLoc"] || 0;
        this.stairFlag = data["stairFlag"] || 0;
        this.workDir = data["workDir"] || 0;
        this.captureFlag = data["captureFlag"] || 0;
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
        data["stairLoc"] = this.stairLoc || 0;
        data["stairFlag"] = this.stairFlag || 0;
        data["workDir"] = this.workDir || 0;
        data["captureFlag"] = this.captureFlag || 0;
        data["uRecord"] = this.uRecord || 0;
        data["uFields"] = this.uFields || "";
        data["uRecord"]  = this.uRecord || 0;
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
        data["stairLoc"] = this.stairLoc || 0;
        data["stairFlag"] = this.stairFlag || 0;
        data["workDir"] = this.workDir || 0;
        data["captureFlag"] = this.captureFlag || 0;
        data["uRecord"] = this.uRecord || 0;
        data["uFields"] = this.uFields || "";
        data["uRecord"]  = this.uRecord || 0;
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
fastmap.dataApi.linkwalkstair = function (data, options) {
    return new fastmap.dataApi.linkWalkStair(data, options);
}

