/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.AuIxPoiAddress = FM.dataApi.DataModel.extend({
    dataModelType: "AU_IX_POI_ADDRESS",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.audataId = data['audataId'];
        this.nameId = data['nameId'] || 0;
        this.nameGroupId = data['nameGroupId'] || 1;
        this.poiPid = data['poiPid'] || 0;
        this.langCode = data['langCode'];
        this.srcFlag = data['srcFlag'];
        this.fullName = data['fullName'];
        this.roadName = data['roadName'];
        this.addrName = data['addrName'];
        this.province = data['province'];
        this.city = data['city'];
        this.county = data['county'];
        this.town = data['town'];
        this.place = data['place'];
        this.street = data['street'];
        this.landMark = data['landMark'];
        this.prefix = data['prefix'];
        this.houseNum = data['houseNum'];
        this.type = data['type'];
        this.subNum = data['subNum'];
        this.surfix = data['surfix'];
        this.estab = data['estab'];
        this.building = data['building'];
        this.floor = data['floor'];
        this.unit = data['unit'];
        this.room = data['room'];
        this.addons = data['addons'];
        this.attTaskId = data['attTaskId'];
        this.fieldTaskId = data['fieldTaskId'];
        this.attOprstatus = data['attOprstatus'];
        this.attCheckStatus = data['attCheckStatus'];
    },
    getIntegrate: function(){
        var ret = {};
        ret['audataId'] = this.audataId;
        ret['nameId'] = this.nameId;
        ret['nameGroupId'] = this.nameGroupId;
        ret['poiPid'] = this.poiPid;
        ret['langCode'] = this.langCode;
        ret['srcFlag'] = this.srcFlag;
        ret['fullName'] = this.fullName;
        ret['roadName'] = this.roadName;
        ret['addrName'] = this.addrName;
        ret['province'] = this.province;
        ret['city'] = this.city;
        ret['county'] = this.county;
        ret['town'] = this.town;
        ret['place'] = this.place;
        ret['street'] = this.street;
        ret['landMark'] = this.landMark;
        ret['prefix'] = this.prefix;
        ret['houseNum'] = this.houseNum;
        ret['type'] = this.type;
        ret['subNum'] = this.subNum;
        ret['surfix'] = this.surfix;
        ret['estab'] = this.estab;
        ret['building'] = this.building;
        ret['floor'] = this.floor;
        ret['unit'] = this.unit;
        ret['room'] = this.room;
        ret['addons'] = this.addons;
        ret['attTaskId'] = this.attTaskId;
        ret['fieldTaskId'] = this.fieldTaskId;
        ret['attOprstatus'] = this.attOprstatus;
        ret['attCheckStatus'] = this.attCheckStatus;
        return ret;
    }
});