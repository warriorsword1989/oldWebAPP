/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.IxPoiGasstation = FM.dataApi.DataModel.extend({
    dataModelType: 'IX_POI_GASSTATION',
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.pid = data.pid || 0;
        this._flag_ = data._flag_ || false; // 深度信息特殊字段,用于控制深度信息的保存
        // this.gasstationId = data['gasstationId'] || 0;
        this.poiPid = data.poiPid;
        this.serviceProv = data.serviceProv;
        var fuelTypeArr = data.fuelType ? data.fuelType.split('|') : [];
        this.fuelType = {};
        for (var i = 0; i < fuelTypeArr.length; i++) {
            this.fuelType[fuelTypeArr[i]] = true;
        }
        var oilTypeArr = data.oilType ? data.oilType.split('|') : [];
        this.oilType = {};
        for (var i = 0; i < oilTypeArr.length; i++) {
            this.oilType[oilTypeArr[i]] = true;
        }
        var egTypeArr = data.egType ? data.egType.split('|') : [];
        this.egType = {};
        for (var i = 0; i < egTypeArr.length; i++) {
            this.egType[egTypeArr[i]] = true;
        }
        var mgTypeArr = data.mgType ? data.mgType.split('|') : [];
        this.mgType = {};
        for (var i = 0; i < mgTypeArr.length; i++) {
            this.mgType[mgTypeArr[i]] = true;
        }

        var paymentArr = data.payment ? data.payment.split('|') : [];
        this.payment = {};
        for (var i = 0; i < paymentArr.length; i++) {
            this.payment[paymentArr[i]] = true;
        }
        var serviceArr = data.service ? data.service.split('|') : [];
        this.service = {};
        for (var i = 0; i < serviceArr.length; i++) {
            this.service[serviceArr[i]] = true;
        }
        this.memo = data.memo;
        this.openHour = data.openHour;
        this.photoName = data.photoName;
        this.rowId = data.rowId;
    },
    getIntegrate: function () {
        var ret = {};
        ret._flag_ = this._flag_;
        ret.pid = this.pid;
        // ret['gasstationId'] = this.gasstationId;
        ret.poiPid = this.poiPid;
        ret.serviceProv = this.serviceProv;
        var checkedFuelTypeArr = [];
        for (var key in this.fuelType) {
            if (this.fuelType[key] == true) {
                checkedFuelTypeArr.push(key);
            }
        }
        ret.fuelType = checkedFuelTypeArr.join('|');
        var checkedOilTypeArr = [];
        for (var key in this.oilType) {
            if (this.oilType[key] == true) {
                checkedOilTypeArr.push(key);
            }
        }
        ret.oilType = checkedOilTypeArr.join('|');
        var checkedEgTypeArr = [];
        for (var key in this.egType) {
            if (this.egType[key] == true) {
                checkedEgTypeArr.push(key);
            }
        }
        ret.egType = checkedEgTypeArr.join('|');
        var checkedMgTypeArr = [];
        for (var key in this.mgType) {
            if (this.mgType[key] == true) {
                checkedMgTypeArr.push(key);
            }
        }
        ret.mgType = checkedMgTypeArr.join('|');
        var checkedPaymentArr = [];
        for (var key in this.payment) {
            if (this.payment[key] == true) {
                checkedPaymentArr.push(key);
            }
        }
        ret.payment = checkedPaymentArr.join('|');
        var checkedServiceArr = [];
        for (var key in this.service) {
            if (this.service[key] == true) {
                checkedServiceArr.push(key);
            }
        }
        ret.service = checkedServiceArr.join('|');
        ret.memo = this.memo;
        ret.openHour = this.openHour;
        ret.photoName = this.photoName;
        ret.rowId = this.rowId;
        return ret;
    }
});
