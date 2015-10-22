/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.linkName = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /***
     * @param linkPid
     * 道路Id
     */
    linkPid:null,
    /***
     * @param nameGroupId
     * 名称组号
     */
    nameGroupId:0,
    /***
     * @param seqNum
     * 名称序号
     */
    seqNum:1,

    /***
     * @param nameClass
     * 名称分类
     */
    nameClass:1,

    /***
     * @param inputTime
     * 录入时间
     */
    inputTime:0,

    /***
     * @param nameType
     * 名称类型
     */
    nameType:0,

    /***
     * @param srcFlag
     * 名称来源
     */
    srcFlag:9,

    /***
     * @param routeAtt
     * 路线属性
     */
    routeAtt:0,

    /***
     * @param code
     * 主从Code
     */
    code:0,

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
     * @param data 初始化属性对象
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
        this.nameGroupId = data["nameGroupId"] || 0;
        this.seqNum = data["seqNum"] || 1;
        this.nameClass = data["nameClass"] || 1;
        this.inputTime = data["inputTime"] || "";
        this.nameType = data["nameType"] || 0;
        this.srcFlag = data["srcFlag"] || 9;
        this.routeAtt = data["routeAtt"] || 0;
        this.code = data["code"] || 0;
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
        data["nameGroupId"] = this.nameGroupId  || 0;
        data["seqNum"] = this.seqNum || 1;
        data["nameClass"] = this.nameClass || 1;
        data["inputTime"] = this.inputTime || "";
        data["nameType"] = this.nameType || 0;
        data["srcFlag"]= this.srcFlag || 9;
        data["routeAtt"] = this.routeAtt  || 0;
        data["code"]  = this.code || 0;
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
        data["nameGroupId"] = this.nameGroupId  || 0;
        data["seqNum"] = this.seqNum || 1;
        data["nameClass"] = this.nameClass || 1;
        data["inputTime"] = this.inputTime || "";
        data["nameType"] = this.nameType || 0;
        data["srcFlag"]= this.srcFlag || 9;
        data["routeAtt"] = this.routeAtt  || 0;
        data["code"]  = this.code || 0;
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
fastmap.dataApi.linkname = function (data, options) {
    return new fastmap.dataApi.linkName(data, options);
}

