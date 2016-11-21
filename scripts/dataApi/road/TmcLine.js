/**
 * Created by wangmingdong on 2016/11/21.
 */
fastmap.dataApi.TMCLine = fastmap.dataApi.GeoDataModel.extend({
    /**
     * 初始化
     * @param data
     * @param options
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'TMC_LINE';
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function (data) {
        this.tmcId = data.tmcId;
        this.loctableId = data.loctableId;
        this.cid = data.cid;
        this.locCode = data.locCode;
        this.typeCode = data.typeCode;
        this.seqNum = data.seqNum;
        this.areaTmcId = data.areaTmcId;
        this.locoffPos = data.locoffPos;
        this.locoffNeg = data.locoffNeg;
        this.uplineTmcId = data.uplineTmcId;
        this.uRecord = data.uRecord;
        this.uFields = data.uFields;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.tmcId = this.tmcId;
        data.loctableId = this.loctableId;
        data.cid = this.cid;
        data.locCode = this.locCode;
        data.typeCode = this.typeCode;
        data.seqNum = this.seqNum;
        data.areaTmcId = this.areaTmcId;
        data.locoffPos = this.locoffPos;
        data.locoffNeg = this.locoffNeg;
        data.uplineTmcId = this.uplineTmcId;
        data.uRecord = this.uRecord;
        data.uFields = this.uFields;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.tmcId = this.tmcId;
        data.loctableId = this.loctableId;
        data.cid = this.cid;
        data.locCode = this.locCode;
        data.typeCode = this.typeCode;
        data.seqNum = this.seqNum;
        data.areaTmcId = this.areaTmcId;
        data.locoffPos = this.locoffPos;
        data.locoffNeg = this.locoffNeg;
        data.uplineTmcId = this.uplineTmcId;
        data.uRecord = this.uRecord;
        data.uFields = this.uFields;
        return data;
    }

});

fastmap.dataApi.tmcLine = function (data, options) {
    return new fastmap.dataApi.TMCLine(data, options);
};

