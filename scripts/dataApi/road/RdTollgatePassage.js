/**
 * Created by wangmingdong on 2016/8/9.
 * Class Rdnode
 */

fastmap.dataApi.RdTollgatePassage = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDTOLLGATEPASSAGE";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || 0;
        this.seqNum = data["seqNum"] || 1;
        this.tollForm = data["tollForm"] || 0;
        this.cardType = data["cardType"] || 0;
        this.vehicle = data["vehicle"] || 0;
        this.uDate = data["uDate"] || null;
        this.rowId = data["rowId"] || null;
        this.uRecord = data["uRecord"] || 0;
        this.uFields = data["uFields"] || null;
    },

    /**
     * 获取RdTollgatePassage简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["tollForm"]  = this.tollForm;
        data["cardType"]  = this.cardType;
        data["vehicle"]  = this.vehicle;
        data["uFields"] = this.uFields;
        data["uDate"] = this.uDate;
        data["rowId"] = this.rowId;
        data["uRecord"] = this.uRecord;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdTollgatePassage详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["seqNum"] = this.seqNum;
        data["tollForm"]  = this.tollForm;
        data["cardType"]  = this.cardType;
        data["vehicle"]  = this.vehicle;
        data["uFields"] = this.uFields;
        data["uDate"] = this.uDate;
        data["rowId"] = this.rowId;
        data["uRecord"] = this.uRecord;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * RdTollgatePassage初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdTollgatePassage = function (data, options) {
    return new fastmap.dataApi.RdTollgatePassage(data, options);
}

