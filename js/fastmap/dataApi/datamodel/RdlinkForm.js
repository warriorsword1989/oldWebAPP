/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.linkform = fastmap.dataApi.GeoDataModel.extend({

    options: {},
    /***
     * @param linkPid
     * 道路Id
     */
    linkPid:null,
    /***
     * @param formOfWay
     * 道路形态
     */
    formOfWay:1,
    /***
     * @param extendedForm
     * 扩展形态
     */
    extendedForm:0,
    /***
     * @param auxiFlag
     * 辅助标志
     */
    auxiFlag:0,
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
        this.formOfWay = data["formOfWay"] || 1;
        this.extendedForm = data["extendedForm"] || 0;
        this.auxiFlag = data["auxiFlag"] || 0;
        this.kgFlag = data["kgFlag"] || 0;
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
        data["formOfWay"] = this.formOfWay  || 1;
        data["extendedForm"] = this.extendedForm || 0;
        data["auxiFlag"] = this.auxiFlag || 0;
        data["kgFlag"] = this.kgFlag || 0;
        data["uRecord"] = this.uRecord || 0;
        data["uFields"]  = this.uFields || "";
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
        data["formOfWay"] = this.formOfWay  || 1;
        data["extendedForm"] = this.extendedForm || 0;
        data["auxiFlag"] = this.auxiFlag || 0;
        data["kgFlag"] = this.kgFlag || 0;
        data["uRecord"] = this.uRecord || 0;
        data["uFields"]  = this.uFields || "";
        return data;
    }
});

/***
 * linkform初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.linkform = function (data, options) {
    return new fastmap.dataApi.linkform(data, options);
}

