/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.IxPoiGasstation = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_GASSTATION",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.gasstationId = data['gasstationId'] || 0;
        this.poiPid = data['poiPid'];
        this.serviceProv = data['serviceProv'];
        this.fuelType = data['fuelType'];
        this.oilType = data['oilType'];
        this.egType = data['egType'];
        this.mgType = data['mgType'];
        this.payment = data['payment'];
        this.service = data['service'];
        this.memo = data['memo'];
        this.openHour = data['openHour'];
        this.photoName = data['photoName'];
        this.uRecord = data['uRecord'] || 0;
        this.uFields = data['uFields'];
    },
    getIntegrate: function(){
        var ret = {};
        ret['gasstationId'] = this.gasstationId;
        ret['poiPid'] = this.poiPid;
        ret['serviceProv'] = this.serviceProv;
        ret['fuelType'] = this.fuelType;
        ret['oilType'] = this.oilType;
        ret['egType'] = this.egType;
        ret['mgType'] = this.mgType;
        ret['payment'] = this.payment;
        ret['service'] = this.service;
        ret['memo'] = this.memo;
        ret['openHour'] = this.openHour;
        ret['photoName'] = this.photoName;
        ret['uRecord'] = this.uRecord;
        ret['uFields'] = this.uFields;
        return ret;
    }
});