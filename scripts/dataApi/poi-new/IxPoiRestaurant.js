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
        this.foodType = data['foodType'];
        var creditCardArr = (data["creditCard"]).split("|");
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
        this.uRecord = data['uRecord'] || 0;
        this.uFields = data['uFields'];
    },
    getIntegrate: function(){
        var ret = {};
        ret['restaurantId'] = this.restaurantId;
        ret['poiPid'] = this.poiPid;
        ret['foodType'] = this.foodType;
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
        ret['uRecord'] = this.uRecord;
        ret['uFields'] = this.uFields;
        return ret;
    }
});