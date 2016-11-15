/**
 * Created by mali on 2016/6/6.
 */

FM.dataApi.IxPoiParking = FM.dataApi.DataModel.extend({
    dataModelType: 'IX_POI_PARKING',
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this._flag_ = data._flag_ || false; // 深度信息特殊字段,用于控制深度信息的保存
        this.pid = data.pid || 0;
        // var parkingTypeArr = data["parkingType"] ? data["parkingType"].split("|") : [] ;
        // this.parkingType = {};
        // for(var i=0;i<parkingTypeArr.length;i++) {
        //     this.parkingType[parkingTypeArr[i]] = true;
        // }
        this.parkingType = data.parkingType;
        var tollStdArr = data.tollStd ? data.tollStd.split('|') : [];
        this.tollStd = {};
        for (var i = 0; i < tollStdArr.length; i++) {
            this.tollStd[tollStdArr[i]] = true;
        }
        this.tollDes = data.tollDes;
        var tollWayArr = data.tollWay ? data.tollWay.split('|') : [];
        this.tollWay = {};
        for (var i = 0; i < tollWayArr.length; i++) {
            this.tollWay[tollWayArr[i]] = true;
        }

//        this.payment = data['payment'];
        var paymentArr = data.payment ? data.payment.split('|') : [];
        this.payment = {};
        for (var i = 0; i < paymentArr.length; i++) {
            this.payment[paymentArr[i]] = true;
        }

        var remarkArr = data.remark ? data.remark.split('|') : [];
        this.remark = {};
        for (var i = 0; i < remarkArr.length; i++) {
            this.remark[remarkArr[i]] = true;
        }
        this.source = data.source;
        this.openTiime = data.openTiime;
        this.totalNum = data.totalNum;
        this.workTime = data.workTime;
        this.resHigh = data.resHigh || 0;
        this.resWidth = data.resWidth || 0;
        this.resWeigh = data.resWeigh || 0;
        this.certificate = data.certificate || 0;
        this.vehicle = data.vehicle || 0;
        this.photoName = data.photoName;
        this.rowId = data.rowId || '';
    },
    getIntegrate: function () {
        var ret = {};
        ret._flag_ = this._flag_;
        ret.pid = this.pid;
        // var checkedParkingTypeArr = [];
        // for(var key in this.parkingType){
        //     if(this.parkingType[key]){
        //         checkedParkingTypeArr.push(key);
        //     }
        // }
        // ret["parkingType"] = checkedParkingTypeArr.join("|");
        ret.parkingType = this.parkingType;
        var checkedTollStdArr = [];
        for (var key in this.tollStd) {
            if (this.tollStd[key] == true) {
                checkedTollStdArr.push(key);
            }
        }
        ret.tollStd = checkedTollStdArr.join('|');
        ret.tollDes = this.tollDes;
        var checkedTollWayArr = [];
        for (var key in this.tollWay) {
            if (this.tollWay[key] == true) {
                checkedTollWayArr.push(key);
            }
        }
        ret.tollWay = checkedTollWayArr.join('|');

//        ret['payment'] = this.payment;
        var checkedPayment = [];
        for (var key in this.payment) {
            if (this.payment[key]) {
            	checkedPayment.push(key);
            }
        }
        ret.payment = checkedPayment.join('|');

        var checkedRemark = [];
        for (var key in this.remark) {
            if (this.remark[key]) {
                checkedRemark.push(key);
            }
        }
        ret.remark = checkedRemark.join('|');
        ret.source = this.source;
        ret.openTiime = this.openTiime;
        ret.totalNum = this.totalNum;
        ret.workTime = this.workTime;
        ret.resHigh = this.resHigh;
        ret.resWidth = this.resWidth;
        ret.resWeigh = this.resWeigh;
        ret.certificate = this.certificate;
        ret.vehicle = this.vehicle;
        ret.photoName = this.photoName;
        ret.rowId = this.rowId;
        return ret;
    }
});
