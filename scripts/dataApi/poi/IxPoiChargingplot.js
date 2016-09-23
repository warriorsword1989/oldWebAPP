/**
 * Created by liuyang on 2016/8/31.
 */
FM.dataApi.IxPoiChargingplot = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_CHARGINGPLOT",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this._flag_ = data["_flag_"] || false; //深度信息特殊字段,用于控制深度信息的保存
        this.poiPid = data['poiPid'] || 0;
        this.groupId = data['groupId'] || 1;
        this.count = data['count'] || 1;
        this.acdc = data['acdc'] || 0;
        var plugTypeArr = data["plugType"] ? data["plugType"].split("|") : [];
        this.plugType = {};
        for(var i=0;i<plugTypeArr.length;i++) {
            this.plugType[plugTypeArr[i]] = true;
        }
        this.power = data['power'] || "";
        this.voltage = data['voltage'] || "";
        this.current = data['current'] || "";
        this.mode = data['mode'] || 0;
        this.memo = data['memo'];
        this.plugNum = data['plugNum'] || 1;
        this.prices = data['prices'] || "";
        var openTypeArr = data["openType"] ? data["openType"].split("|") : [];
        this.openType = {};
        for(var i=0;i<openTypeArr.length;i++) {
            this.openType[openTypeArr[i]] = true;
        }
        this.availableState = data['availableState'] || 0;
        this.manufacturer = data['manufacturer'] || "";
        this.factoryNum = data['factoryNum'] || "";
        this.plotNum = data['plotNum'] || "";
        this.productNum = data['productNum'] || "";
        this.parkingNum = data['parkingNum'] || "";
        this.floor = data['floor'] || 1;
        this.locationType = data['locationType'] || 0;
        var paymentArr = data["payment"] ? data["payment"].split("|") : [];
        this.payment = {};
        for(var i=0;i<paymentArr.length;i++) {
            this.payment[paymentArr[i]] = true;
        }
        this.rowId = data["rowId"];
    },
    getIntegrate: function(){
        var ret = {};
        ret['_flag_'] = this._flag_;
        ret['groupId'] = this.groupId;
        ret['poiPid'] = this.poiPid;
        ret['count'] = this.count;
        ret['acdc'] = this.acdc;
        var plugTypeArr = [];
        for(var key in this.plugType){
            if(this.plugType[key] == true){
                plugTypeArr.push(key);
            }
        }
        ret["plugType"] = plugTypeArr.join("|");
        ret['power'] = this.power;
        ret['voltage'] = this.voltage;
        ret['current'] = this.current;
        ret['mode'] = this.mode;
        ret['memo'] = this.memo;
        ret['plugNum'] = this.plugNum;
        ret['prices'] = this.prices;
        var openTypeArr = [];
        for(var key in this.openType){
            if(this.openType[key] == true){
                openTypeArr.push(key);
            }
        }
        ret["openType"] = openTypeArr.join("|");
        ret['availableState'] = this.availableState;
        ret['manufacturer'] = this.manufacturer;
        ret['factoryNum'] = this.factoryNum;
        ret['plotNum'] = this.plotNum;

        ret['productNum'] = this.productNum;
        ret['parkingNum'] = this.parkingNum;
        ret['floor'] = this.floor;
        ret['locationType'] = this.locationType;
        var paymentArr = [];
        for(var key in this.payment){
            if(this.payment[key] == true){
                paymentArr.push(key);
            }
        }
        ret["payment"] = paymentArr.join("|");
        ret["rowId"] = this.rowId;
        return ret;
    }
});