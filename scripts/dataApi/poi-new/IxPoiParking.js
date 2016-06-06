/**
 * Created by mali on 2016/6/6.
 */

FM.dataApi.IxPoiParking = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_PARKING",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.parkingId = data['parkingId'];
        this.poiPid = data['poiPid'] || 0;
        this.parkingType = data['parkingType'];
        this.tollStd = data['tollStd'];
        this.tollDes = data['tollDes'];
        this.tollWay = data['tollWay'];
        this.payment = data['payment'];
        this.remark = data['remark'];
        this.source = data['source'];
        this.openTime = data['openTime'];
        this.totalNum = data['totalNum'];
        this.workTime = data['workTime'];
        this.accessType = data['accessType'] || 2;
        this.resHigh = data[resHigh] || 0;
        this.resWidth = data['resWidth'] || 0;
        this.resWeigh = data['resWeigh'] || 0;
        this.certificate = data['certificate'] || 0;
        this.mechanicalGarage = data['mechanicalGarage'] || 0;
        this.vehicle = data['vehicle'] || 0;
        this.photoName = data['photoName'];
        this.uRecord = data['uRecord'] || 0;
        this.uFields = data['uFields'];
    },
    getIntegrate: function(){
        var ret = {};
        ret['parkingId'] = this.parkingId;
        ret['poiPid'] = this.poiPid;
        ret['parkingType'] = this.parkingType;
        ret['tollStd'] = this.tollStd;
        ret['tollDes'] = this.tollDes;
        ret['tollWay'] = this.tollWay;
        ret['payment'] = this.payment;
        ret['remark'] = this.remark;
        ret['source'] = this.source;
        ret['openTime'] = this.openTime;
        ret['totalNum'] = this.totalNum;
        ret['workTime'] = this.workTime;
        ret['accessType'] = this.accessType;
        ret['resHigh'] = this.resHigh;
        ret['resWidth'] = this.resWidth;
        ret['resWeigh'] = this.resWeigh;
        ret['certificate'] = this.certificate;
        ret['mechanicalGarage'] = this.mechanicalGarage;
        ret['vehicle'] = this.vehicle;
        ret['photoName'] = this.photoName;
        ret['uRecord'] = this.uRecord;
        ret['uFields'] = this.uFields;
        return ret;
    }
});