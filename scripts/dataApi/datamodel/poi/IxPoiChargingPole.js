/**
 * Created by liuyang on 2016/4/29.
 */
FM.dataApi.IxPoiChargingPole = FM.dataApi.DataModel.extend({
    dataModelType: "IX_PoiChargingPole",
    //
    initialize: function(data) {
        this.setAttributes(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributes:function(data){
        this.groupId = data["groupId"] || 1;
        this.acdc = data["acdc"] || 0;
        this.plugType = data["plugType"] || "9";
        this.power = data["power"] || null;
        this.voltage = data["voltage"] || null;
        this.current = data["current"] || null;
        this.mode = data["mode"] || 0;
        this.count = data["count"] || 1;
        this.plugNum = data["plugNum"] || 1;
        this.prices = data["prices"] || null;
        this.openType = data["openType"] || "1";
        this.availableState = data["availableState"] || 0;
        this.manufacturer = data["manufacturer"] || null;
        this.factoryNum = data["factoryNum"] || null;
        this.plotNum = data["plotNum"] || null;
        this.productNum = data["productNum"] || null;
        this.parkingNum = data["parkingNum"] || null;
        this.floor = data["floor"] || 0;
        this.locationType = data["locationType"] || 0;
        this.payment = data["payment"] || "4";
    }

});
//
// FM.dataApi.IxPoiChargingPole = function (data) {
//     return new FM.dataApi.IxPoiChargingPole(data);
// };
