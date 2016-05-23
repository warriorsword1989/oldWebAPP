/**
 * Created by liuyang on 2016/5/4.
 */
document.write("<script language=javascript src='webApp/scripts/dataApi/poi/IxPoiConstant.js'></script>");
FM.dataApi.IxPoiChargingPole = FM.dataApi.DataModel.extend({
    dataModelType: "IX_PoiChargingPole",
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
    	this.paymentArray = [];
    	for (key in FM.dataApi.Constant.CHARGINGPOLE_PAYMENT) {
    		this.paymentArray.push({
                id: key,
                value: FM.dataApi.Constant.CHARGINGPOLE_PAYMENT[key],
                check:false
            });
        };
        for (var i = 0;i<this.paymentArray.length;i++){
        	if(this.payment.indexOf("|")>0){
        		for(var j = 0;j<this.payment.split('|').length;j++){
        			if(this.paymentArray[i].id == this.payment.split('|')[j]){
        				this.paymentArray[i].check = true;
        			}
        		}
        	}else{
        		if(this.paymentArray[i].id == this.payment){
        			this.paymentArray[i].check = true;
        		}
        	}
        }
    },
    getIntegrate: function(){
    	var ret = {};
    	ret["groupId"] = this.groupId;
    	ret["acdc"] = this.acdc;
    	ret["plugType"] = this.plugType;
    	ret["power"] = this.power;
    	ret["voltage"] = this.voltage;
    	ret["mode"] = this.mode;
    	ret["count"] = this.count;
    	ret["plugNum"] = this.plugNum;
    	ret["prices"] = this.prices;
    	ret["openType"] = this.openType;
    	ret["availableState"] = this.availableState;
    	ret["manufacturer"] = this.manufacturer;
    	ret["factoryNum"] = this.factoryNum;
    	ret["plotNum"] = this.plotNum;
    	ret["productNum"] = this.productNum;
    	ret["floor"] = this.floor;
    	ret["locationType"] = this.locationType;
    	this.checkedPayArr = [];
    	for(var i = 0;i<this.paymentArray.length;i++){
    		if(this.paymentArray[i].check == true){
    			this.checkedPayArr.push(this.paymentArray[i].id);
    		}
    	};
    	ret["payment"] = this.checkedPayArr.join("|");
    	ret["productNum"] = this.productNum;
    	return ret;
    }
});

