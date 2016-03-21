/**
 * Created by liwanchong on 2016/3/14.
 */
fastmap.dataApi.linkIntRtic = fastmap.dataApi.GeoDataModel.extend({
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
        this.rowId= data["rowId"] || "";
        this.code = data["code"] || 0;
        this.rank = data["rank"] || 0;
        this.rticDir = data["rticDir"] || 0;
        this.updownFlag = data["updownFlag"] || 0;
        this.rangeType = data["rangeType"] || 0;
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
        data["rowId"] = this.rowId;
        data["code"] = this.code;
        data["rank"]  = this.rank;
        data["rticDir"] = this.rticDir;
        data["updownFlag"] = this.updownFlag;
        data["rangeType"]  = this.rangeType;
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
        data["rowId"] = this.rowId;
        data["code"] = this.code;
        data["rank"]  = this.rank;
        data["rticDir"] = this.rticDir;
        data["updownFlag"] = this.updownFlag;
        data["rangeType"]  = this.rangeType;
        return data;
    }
});

/***
 * linkrtic初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkRtic}
 */
fastmap.dataApi.linkintrtic = function (data, options) {
    return new fastmap.dataApi.linkIntRtic(data, options);
}
