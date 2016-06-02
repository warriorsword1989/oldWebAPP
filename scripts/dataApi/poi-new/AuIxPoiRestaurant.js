/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.AuIxPoiRestaurant = FM.dataApi.DataModel.extend({
    dataModelType: "AU_IX_POI_RESTAURANT",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.restaurantId = data['restaurantId'] || 0;
        this.poiPid = data['poiPid'] || 0;
        this.foodType = data['foodType'];
        this.creditCard = data['creditCard'];
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
        ret['creditCard'] = this.creditCard;
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