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
        var parkingTypeArr = (data["parkingType"] || "").split("|");
        this.parkingType = {};
        for(var i=0;i<parkingTypeArr.length;i++) {
            this.parkingType[parkingTypeArr[i]] = true;
        }
        var tollStdArr = (data["tollStd"] || "").split("|");
        this.tollStd = {};
        for(var i=0;i<tollStdArr.length;i++) {
            this.tollStd[tollStdArr[i]] = true;
        }
        this.tollDes = data['tollDes'];
        var tollWayArr = (data["tollWay"] || "").split("|");
        this.tollWay = {};
        for(var i=0;i<tollWayArr.length;i++) {
            this.tollWay[tollWayArr[i]] = true;
        }
        this.payment = data['payment'];
        this.remark = data['remark'];
        this.source = data['source'];
        this.openTime = data['openTime'];
        this.totalNum = data['totalNum'];
        this.workTime = data['workTime'];
        this.accessType = data['accessType'] || 2;
        this.resHigh = data['resHigh'] || 0;
        this.resWidth = data['resWidth'] || 0;
        this.resWeigh = data['resWeigh'] || 0;
        this.certificate = data['certificate'] || 0;
        this.mechanicalGarage = data['mechanicalGarage'] || 0;
        this.vehicle = data['vehicle'] || 0;
        this.photoName = data['photoName'];
        this.rowId = data["rowId"];
    },
    getIntegrate: function(){
        var ret = {};
        ret['parkingId'] = this.parkingId;
        ret['poiPid'] = this.poiPid;
        var checkedParkingTypeArr = [];
        for(var key in this.parkingType){
            if(this.parkingType[key] == true){
                checkedParkingTypeArr.push(key);
            }
        }
        ret["parkingType"] = checkedParkingTypeArr.join("|");
        var checkedTollStdArr = [];
        for(var key in this.tollStd){
            if(this.tollStd[key] == true){
                checkedTollStdArr.push(key);
            }
        }
        ret["tollStd"] = checkedTollStdArr.join("|");
        ret['tollDes'] = this.tollDes;
        var checkedTollWayArr = [];
        for(var key in this.tollWay){
            if(this.tollWay[key] == true){
                checkedTollWayArr.push(key);
            }
        }
        ret["tollWay"] = checkedTollWayArr.join("|");
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
        ret["rowId"] = this.rowId;
        return ret;
    }
});