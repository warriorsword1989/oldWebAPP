/**
 * Created by liuyang on 2016/8/31.
 */
FM.dataApi.IxPoiChargingstation = FM.dataApi.DataModel.extend({
    dataModelType: 'IX_POI_CHARGINGSTATION',
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        //this.chargingId = data['chargingId'] || 0;
        this.pid = data["pid"] || 0;
        this._flag_ = data["_flag_"] || false; //深度信息特殊字段,用于控制深度信息的保存
        this.poiPid = data['poiPid'] || 0;
        this.audataId = data['audataId'];
        this.chargingType = data['chargingType'] || 3;

        var changeBrandArr = data["changeBrands"] ? data["changeBrands"].split("|") : [];
        this.changeBrands = {};
        for(var i=0;i<changeBrandArr.length;i++) {
            this.changeBrands[changeBrandArr[i]] = true;
        }
        var changeOpenTypeArr = data["changeOpenType"] ? data["changeOpenType"].split("|") : [1];
        this.changeOpenType = {};
        for(var i=0;i<changeOpenTypeArr.length;i++) {
            this.changeOpenType[changeOpenTypeArr[i]] = true;
        }

        this.chargingNum = data['chargingNum'] || 0;
        this.exchangeNum = data['exchangeNum'];
        this.payment = data['payment'];
        this.serviceProv = data['serviceProv'] || "0";
        this.memo = data['memo'];
        this.photoName = data['photoName'];
        this.openHour = data['openHour'];
        this.parkingFees = data['parkingFees'] || 0;
        this.parkingInfo = data['parkingInfo'];
        this.availableState = data['availableState'] || 0;
        this.rowId = data["rowId"];
    },
    getIntegrate: function () {
        var ret = {};
        ret['_flag_'] = this._flag_;
        ret['pid'] = this.pid;
        ret['poiPid'] = this.poiPid;
        ret['audataId'] = this.audataId;
        ret['chargingType'] = this.chargingType;

        var checkedChangeBrandArr = [];
        for(var key in this.changeBrands){
            if(this.changeBrands[key] == true){
                checkedChangeBrandArr.push(key);
            }
        }
        ret["changeBrands"] = checkedChangeBrandArr.join("|");
        var checkedChangeOpenTypeArr = [];
        for(var key in this.changeOpenType){
            if(this.changeOpenType[key] == true){
                checkedChangeOpenTypeArr.push(key);
            }
        }
        ret["changeOpenType"] = checkedChangeOpenTypeArr.join("|");
        ret['chargingNum'] = this.chargingNum;
        ret['exchangeNum'] = this.exchangeNum;
        ret['payment'] = this.payment;

        ret['serviceProv'] = this.serviceProv;
        ret['memo'] = this.memo;
        ret['photoName'] = this.photoName;
        ret['openHour'] = this.openHour;
        ret['parkingFees'] = this.parkingFees;
        ret['parkingInfo'] = this.parkingInfo;
        ret['availableState'] = this.availableState;
        ret["rowId"] = this.rowId;
        return ret;
    }
});
