/**
 * Created by liuyang on 2016/5/4.
 */
FM.dataApi.IxPoiChargingPole = FM.dataApi.DataModel.extend({
    dataModelType: "IX_PoiChargingPole",
    /*
     * 返回参数赋值
     */
    setAttributes:function(data){
        this.groupId = data["groupId"] || 1;
        this.acdc = data["acdc"] || 0;
        var plugTypeArr = (data["plugType"] || "9").split("|");
        this.plugType = {};
        for(var i=0;i<plugTypeArr.length;i++) {
        	this.plugType[plugTypeArr[i]] = true;
        }
        this.power = data["power"] || null;
        this.voltage = data["voltage"] || null;
        this.current = data["current"] || null;
        this.mode = data["mode"] || 0;
        this.count = data["count"] || 1;
        this.plugNum = data["plugNum"] || 1;
        this.prices = data["prices"] || null;
        var openTypeArray = (data["openType"] || "1").split("|");
        this.openType = {};
        for (var i=0;i<openTypeArray.length;i++){
        	this.openType[openTypeArray[i]] = true;
        }
        this.availableState = data["availableState"] || 0;
        this.manufacturer = data["manufacturer"] || null;
        this.factoryNum = data["factoryNum"] || null;
        this.plotNum = data["plotNum"] || null;
        this.productNum = data["productNum"] || null;
        this.parkingNum = data["parkingNum"] || null;
        this.floor = data["floor"] || 0;
        this.locationType = data["locationType"] || 0;
    	var paymentArray = (data["payment"] || "4").split("|");
    	this.payment = {};
    	for(var i=0;i<paymentArray.length;i++){
    		this.payment[paymentArray[i]] = true;
    	}
    },
    getIntegrate: function(){
    	var ret = {};
    	ret["groupId"] = this.groupId;
    	ret["acdc"] = this.acdc;
    	var checkedPlugTypeArr = [];
    	for(var key in this.plugType){
    		if(this.plugType[key] == true){
    			checkedPlugTypeArr.push(key);
    		}
    	}
    	ret["plugType"] = checkedPlugTypeArr.join("|");
    	ret["power"] = this.power;
    	ret["voltage"] = this.voltage;
    	ret["mode"] = this.mode;
    	ret["count"] = this.count;
    	ret["plugNum"] = this.plugNum;
    	ret["prices"] = this.prices;
    	var checkedOpenTypeArr = [];
    	for(var key in this.plugType){
    		if(this.openType[key] == true){
    			checkedOpenTypeArr.push(key);
    		}
    	}
    	ret["openType"] = checkedOpenTypeArr.join("|");
    	ret["availableState"] = this.availableState;
    	ret["manufacturer"] = this.manufacturer;
    	ret["factoryNum"] = this.factoryNum;
    	ret["plotNum"] = this.plotNum;
    	ret["productNum"] = this.productNum;
    	ret["floor"] = this.floor;
    	ret["locationType"] = this.locationType;
    	var checkedPayArr = [];
    	for(var key in this.plugType){
    		if(this.payment[key] == true){
    			checkedPayArr.push(key);
    		}
    	}
    	ret["payment"] = checkedPayArr.join("|");
    	ret["productNum"] = this.productNum;
    	return ret;
    }
});

