/**
 * Created by mali on 2016/5/27.
 */
FM.dataApi.IxPoiAddress = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_ADDRESS",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.nameId = data['nameId'] || 0;
        this.poiPid = data['poiPid'] || 0;
        this.nameGroupId = data['nameGroupId'] || 1;
        this.langCode = data['langCode'];
        this.srcFlag = data['srcFlag'];
        this.fullname = data['fullname'];
        this.roadname = data['roadname'];
        this.addrname = data['addrname'];
        this.province = data['province'];
        this.city = data['city'];
        this.county = data['county'];
        this.town = data['town'];
        this.place = data['place'];
        this.street = data['street'];
        this.landmark = data['landmark'];
        this.prefix = data['prefix'];
        this.housenum = data['housenum'];
        this.type = data['type'];
        this.subnum = data['subnum'];
        this.surfix = data['surfix'];
        this.estab = data['estab'];
        this.building = data['building'];
        this.floor = data['floor'];
        this.unit = data['unit'];
        this.room = data['room'];
        this.addons = data['addons'];
    },
    getIntegrate: function(){
        var ret = {};
        ret['audataId'] = this.audataId;
        ret['nameId'] = this.nameId;
        ret['nameGroupId'] = this.nameGroupId;
        ret['poiPid'] = this.poiPid;
        ret['langCode'] = this.langCode;
        ret['srcFlag'] = this.srcFlag;
        ret['fullname'] = this.fullname;
        ret['roadname'] = this.roadname;
        ret['addrname'] = this.addrname;
        ret['province'] = this.province;
        ret['city'] = this.city;
        ret['county'] = this.county;
        ret['town'] = this.town;
        ret['place'] = this.place;
        ret['street'] = this.street;
        ret['landmark'] = this.landmark;
        ret['prefix'] = this.prefix;
        ret['housenum'] = this.housenum;
        ret['type'] = this.type;
        ret['subnum'] = this.subnum;
        ret['surfix'] = this.surfix;
        ret['estab'] = this.estab;
        ret['building'] = this.building;
        ret['floor'] = this.floor;
        ret['unit'] = this.unit;
        ret['room'] = this.room;
        ret['addons'] = this.addons;
        return ret;
    }
});