/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.IxPoiRestaurant = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_RESTAURANT",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.restaurantId = data['restaurantId'] || 0;
        this.poiPid = data['poiPid'] || 0;
        var foodTypeArr = (data["foodType"] || "").split("|");
        this.foodType1 = {};
        this.foodType2 = {};
        if(foodTypeArr.length == 2){
            this.foodType1[foodTypeArr[0]] = true;
            this.foodType2[foodTypeArr[1]] = true;
        }
        var creditCardArr = (data["creditCard"] || "").split("|");
        this.creditCard = {};
        for(var i=0;i<creditCardArr.length;i++) {
            this.creditCard[creditCardArr[i]] = true;
        }
        this.avgCost = data['avgCost'] || 0;
        this.parking = data['parking'] || 0;
        this.longDescription = data['longDescription'];
        this.longDescriptionEng = data['longDescriptionEng'];
        this.openHour = data['openHour'];
        this.openHourEng = data['openHourEng'];
        this.telephone = data['telephone'];
        this.address = data['address'];
        this.city = data['city'];
        this.photoName = data['photoName'];
        this.travelguideFlag = data['travelguideFlag'] || 0;
        this.rowId = data["rowId"];
    },
    getIntegrate: function(){
        var ret = {};
        ret['restaurantId'] = this.restaurantId;
        ret['poiPid'] = this.poiPid;
        // ret['foodType'] = this.foodType;
        var foodType1Code = "";
        var foodType2Code = "";
        for(var key in this.foodType1){
            if(this.foodType1[key] == true){
                foodType1Code = key;
            }
        }
        for(var key in this.foodType2){
            if(this.foodType2[key] == true){
                foodType2Code = key;
            }
        }
        if(foodType2Code.length > 0 && foodType2Code.length>0){
            ret['foodType'] = foodType2Code + "|" + foodType1Code;
        }else if(foodType2Code.length > 0){
            ret['foodType'] = foodType2Code;
        }else{
            ret['foodType'] = foodType1Code;
        }
        var checkedCreditCardArr = [];
        for(var key in this.creditCard){
            if(this.creditCard[key] == true){
                checkedCreditCardArr.push(key);
            }
        }
        ret["creditCard"] = checkedCreditCardArr.join("|");
        ret['avgCost'] = this.avgCost;
        ret['parking'] = this.parking;
        ret['longDescription'] = this.longDescription;
        ret['longDescriptionEng'] = this.longDescriptionEng;
        ret['openHour'] = this.openHour;
        ret['openHourEng'] = this.openHourEng;
        ret['telephone'] = this.telephone;
        ret['address'] = this.address;
        ret['city'] = this.city;
        ret['photoName'] = this.photoName;
        ret['travelguideFlag'] = this.travelguideFlag;
        ret["rowId"] = this.rowId;
        return ret;
    }
});