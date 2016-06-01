/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.AuIxPoiHotel = FM.dataApi.DataModel.extend({
    dataModelType: "AU_IX_POI_HOTEL",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.audataId = data['audataId'];
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
        this.attTaskId = data['attTaskId'] || 0;
        this.attOprstatus = data['attOprstatus'] || 0;
        this.attCheckstatus = data['attCheckstatus'] || 0;
        this.fieldTaskId = data['fieldTaskId'] || 0;
        this.fieldTaskSubId = data['fieldTaskSubId'];
        this.fieldGuid = data['fieldGuid'];
        this.poiFieldGuid = data['poiFieldGuid'];
        this.fieldDayTime = data['fieldDayTime'];
        this.fieldSource = data['fieldSource'];
        this.paramEx1 = data['paramEx1'];
        this.paramEx2 = data['paramEx2'];
        this.paramEx3 = data['paramEx3'];
        this.paramEx4 = data['paramEx4'];
        this.state = data['state'] || 0;
    },
    getIntegrate: function(){
        var ret = {};
        ret['audataId'] = this.audataId;
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
        ret['attTaskId'] = this.attTaskId;
        ret['attOprstatus'] = this.attOprstatus;
        ret['attCheckstatus'] = this.attCheckstatus;
        ret['fieldTaskId'] = this.fieldTaskId;
        ret['fieldTaskSubId'] = this.fieldTaskSubId;
        ret['fieldGuid'] = this.fieldGuid;
        ret['poiFieldGuid'] = this.poiFieldGuid;
        ret['fieldDayTime'] = this.fieldDayTime;
        ret[fieldSource] = this.fieldSource;
        ret[paramEx1] = this.paramEx1;
        ret['paramEx2'] = this.paramEx2;
        ret['paramEx3'] = this.paramEx3;
        ret['paramEx4'] = this.paramEx4;
        ret['state'] = this.state;
        return ret;
    }
});