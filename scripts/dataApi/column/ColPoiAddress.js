/**
 * Created Created by wuz on 2016/8/25.
 */
FM.dataApi.ColPoiAddress = FM.dataApi.DataModel.extend({
    dataModelType: "COL_POI_ADDRESS",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.poiPid = data['poiPid'] || 0;
        this.nameGroupid = data['nameGroupid'] || 1;
        this.langCode = data['langCode'];
        this.srcFlag = data['srcFlag'];
        this.fullName = data['fullName'];
        this.fullNamePhonetic = data['fullNamePhonetic'];
        this.roadName = data['roadName'];
        this.roadNamePhonetic = data['roadNamePhonetic'];
        this.addrname = data['addrname'];
        this.addrNamePhonetic = data['addrNamePhonetic'];
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
        this.rowId = data["rowId"];
    },
    getIntegrate: function(){
        var ret = {};
        ret['nameGroupid'] = this.nameGroupid;
        ret['poiPid'] = this.poiPid;
        ret['langCode'] = this.langCode;
        ret['srcFlag'] = this.srcFlag;
        ret['fullName'] = this.fullName;
        ret['fullNamePhonetic'] = this.fullNamePhonetic;
        ret['roadName'] = this.roadName;
        ret['roadNamePhonetic'] = this.roadNamePhonetic;
        ret['addrname'] = this.addrname;
        ret['addrNamePhonetic'] = this.addrNamePhonetic;
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
        ret["rowId"] = this.rowId;
        return ret;
    }
});