/**
 * Created by wangmingdong on 2016/11/10.
 */
fastmap.dataApi.TMCPoint = fastmap.dataApi.GeoDataModel.extend({
    /**
     * 初始化
     * @param data
     * @param options
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'TMC_POINT';
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
        this.inPos = data.inPos;
        this.inNeg = data.inNeg;
        this.outNeg = data.outNeg;
        this.presentPos = data.presentPos;
        this.presentNeg = data.presentNeg;
        this.locoffPos = data.locoffPos;
        this.locoffNeg = data.locoffNeg;
        this.lineTmcId = data.lineTmcId;
        this.areaTmcId = data.areaTmcId;
        this.juncLoccode = data.juncLoccode;
        this.neighbourBound = data.neighbourBound;
        this.neighbourTable = data.neighbourTable;
        this.urban = data.urban;
        this.interuptRoad = data.interuptRoad;
        this.geometry = data.geometry;
        this.editFlag = data.editFlag;
        this.names = [];
        if (data.names && data.names.length > 0) {
            for (var i = 0; i < data.names.length; i++) {
                var name = fastmap.dataApi.tmcPointName(data.names[i]);
                this.names.push(name);
            }
        }
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
        data.inPos = this.inPos;
        data.inNeg = this.inNeg;
        data.outNeg = this.outNeg;
        data.presentPos = this.presentPos;
        data.presentNeg = this.presentNeg;
        data.locoffPos = this.locoffPos;
        data.locoffNeg = this.locoffNeg;
        data.lineTmcId = this.lineTmcId;
        data.areaTmcId = this.areaTmcId;
        data.juncLoccode = this.juncLoccode;
        data.neighbourBound = this.neighbourBound;
        data.neighbourTable = this.neighbourTable;
        data.urban = this.urban;
        data.interuptRoad = this.interuptRoad;
        data.geometry = this.geometry;
        data.editFlag = this.editFlag;
        data.names = [];
        for (var i = 0; i < this.names.length; i++) {
            data.names.push(this.names[i].getIntegrate());
        }
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
        data.inPos = this.inPos;
        data.inNeg = this.inNeg;
        data.outNeg = this.outNeg;
        data.presentPos = this.presentPos;
        data.presentNeg = this.presentNeg;
        data.locoffPos = this.locoffPos;
        data.locoffNeg = this.locoffNeg;
        data.lineTmcId = this.lineTmcId;
        data.areaTmcId = this.areaTmcId;
        data.juncLoccode = this.juncLoccode;
        data.neighbourBound = this.neighbourBound;
        data.neighbourTable = this.neighbourTable;
        data.urban = this.urban;
        data.interuptRoad = this.interuptRoad;
        data.geometry = this.geometry;
        data.editFlag = this.editFlag;
        data.names = [];
        for (var i = 0; i < this.names.length; i++) {
            data.names.push(this.names[i].getIntegrate());
        }
        data.uRecord = this.uRecord;
        data.uFields = this.uFields;
        return data;
    }

});

fastmap.dataApi.tmcPoint = function (data, options) {
    return new fastmap.dataApi.TMCPoint(data, options);
};

