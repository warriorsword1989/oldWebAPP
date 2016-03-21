/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.linkTruckLimit = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.limitDir = data["limitDir"] || 0;
        this.timeDomain = data["timeDomain"] || "";
        this.resTrailer = data["resTrailer"] || 0;
        this.resWeigh = data["resWeigh"] || 0;
        this.resAxleLoad = data["resAxleLoad"] ||0;
        this.resAxleCount = data["resAxleCount"] || 0;
        this.resOut = data["resOut"] || 0;
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
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["limitDir"]  = this.limitDir;
        data["timeDomain"] = this.timeDomain;
        data["resTrailer"]  = this.resTrailer;
        data["resWeigh"] = this.resWeigh;
        data["resAxleLoad"] = this.resAxleLoad;
        data["resAxleCount"]  = this.resAxleCount;
        data["resOut"] = this.resOut;
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
        data["limitDir"]  = this.limitDir;
        data["timeDomain"] = this.timeDomain;
        data["resTrailer"]  = this.resTrailer;
        data["resWeigh"] = this.resWeigh;
        data["resAxleLoad"] = this.resAxleLoad;
        data["resAxleCount"]  = this.resAxleCount;
        data["resOut"] = this.resOut;
        return data;
    }
});

/***
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.linktrucklimit = function (data, options) {
    return new fastmap.dataApi.linkTruckLimit(data, options);
}

