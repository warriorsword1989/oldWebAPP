/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.AuIxPoiGasstation = FM.dataApi.DataModel.extend({
    dataModelType: "AU_IX_POI_GASSTATION",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.audataId = data['audataId'];
        this.gasstationId = data['gasstationId'] || 0;
        this.poiPid = data['poiPid'];
        this.fuelType = data['fuelType'];
        this.oilType = data['oilType'];
        this.egType = data['egType'];
        this.mgType = data['mgType'];
        this.service = data['service'];
        this.memo = data['memo'];
        this.attTaskId = data['attTaskId'] || 0;
        this.attOprstatus = data['attOprstatus'] || 0;
        this.attCheckstatus = data['attCheckstatus'] || 0;
        this.fieldTaskId = data['fieldTaskId'] || 0;
        this.fieldTaskSubId = data['fieldTaskSubId'];
        this.fieldGuid = data['fieldGuid'];
        this.poiFieldGuid = data['poiFieldGuid'];
        this.fieldDayTime = data['fieldDayTime'];
        this.fieldSource = data['fieldSource'] || 0;
        this.paramEx1 = data['paramEx1'];
        this.paramEx2 = data['paramEx2'];
        this.paramEx3 = data['paramEx3'];
        this.paramEx4 = data['paramEx4'];
        this.state = data['state'] || 0;
        this.serviceProv = data['serviceProv'];
        this.payment = data['payment'];
        this.openHour = data['openHour'];
        this.photoName = data['photoName'];
    },
    getIntegrate: function(){
        var ret = {};
        ret['audataId'] = this.audataId;
        ret['gasstationId'] = this.gasstationId;
        ret['poiPid'] = this.poiPid;
        ret['fuelType'] = this.fuelType;
        ret['oilType'] = this.oilType;
        ret['egType'] = this.egType;
        ret['mgType'] = this.mgType;
        ret['service'] = this.service;
        ret['memo'] = this.memo;
        ret['attTaskId'] = this.attTaskId;
        ret['attOprstatus'] = this.attOprstatus;
        ret['attCheckstatus'] = this.attCheckstatus;
        ret['fieldTaskId'] = this.fieldTaskId;
        ret['fieldTaskSubId'] = this.fieldTaskSubId;
        ret['fieldGuid'] = this.fieldGuid;
        ret['poiFieldGuid'] = this.poiFieldGuid;
        ret['fieldDayTime'] = this.fieldDayTime;
        ret['fieldSource'] = this.fieldSource;
        ret['paramEx1'] = this.paramEx1;
        ret['paramEx2'] = this.paramEx2;
        ret['paramEx3'] = this.paramEx3;
        ret['paramEx4'] = this.paramEx4;
        ret['state'] = this.state;
        ret['serviceProv'] = this.serviceProv;
        ret['payment'] = this.payment;
        ret['openHour'] = this.openHour;
        ret['photoName'] = this.photoName;
        return ret;
    }
});