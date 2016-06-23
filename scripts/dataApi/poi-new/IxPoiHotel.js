/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.IxPoiHotel = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_HOTEL",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.hotelId = data['hotelId'] || 0;
        this.poiPid = data['poiPid'] || 0;
        this.creditCard = data['creditCard'];
        this.rating = data['rating'] || 0;
        this.checkinTime = data['checkinTime'] || '14:00';
        this.checkoutTime = data['checkoutTime'] || '12:00';
        this.roomCount = data['roomCount'] || 0;
        this.roomType = data['roomType'];
        this.roomPrice = data['roomPrice'];
        this.breakfast = data['breakfast'] || 0;
        this.service = data['service'];
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
        ret['hotelId'] = this.hotelId;
        ret['poiPid'] = this.poiPid;
        ret['creditCard'] = this.creditCard;
        ret['rating'] = this.rating;
        ret['checkinTime'] = this.checkinTime;
        ret['checkoutTime'] = this.checkoutTime;
        ret['roomCount'] = this.roomCount;
        ret['roomType'] = this.roomType;
        ret['roomPrice'] = this.roomPrice;
        ret['breakfast'] = this.breakfast;
        ret['service'] = this.service;
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