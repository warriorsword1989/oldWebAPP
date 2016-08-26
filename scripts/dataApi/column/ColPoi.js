/**
 * Created by wuz on 2016/8/25.
 */
FM.dataApi.ColPoi = FM.dataApi.GeoDataModel.extend({
    geoLiveType: "COL_POI",
    /*
     * DB-->UI
     */
    setAttributes: function(data) {
        this.rowId = data['rowId'] || "";
        this.pid = data['pid'];
        this.kindCode = data['kindCode'] || null;
        this.classifyRules = data['classifyRules'];

        this.addressChi = {};//大陆地址
        this.addressEng = {};//英文地址
        this.addressCht = {};//港澳地址
        this.addressPor = {};//葡文地址
        if (data["addresses"]) {
            for (var i = 0, len = data["addresses"].length; i < len; i++) {
                var obj = new FM.dataApi.ColPoiAddress(data["addresses"][i]);
                if(obj.langCode == "CHI"){
                    this.addressChi = obj;
                } else if(obj.langCode == "ENG"){
                    this.addressEng = obj;
                } else if(obj.langCode == "CHT"){
                    this.addressCht = obj;
                } else if(obj.langCode == "POR"){
                    this.addressPor = obj;
                }
            }
        }

        this.name11Chi = {};//官方标准
        this.name12Chi = {};//官方原始
        this.name51Chi = {};//简称标准化
        this.name11Eng = {};//官方标准英文

        if (data["names"]) {
            for (var i = 0, len = data["names"].length; i < len; i++) {
                var obj = new FM.dataApi.ColPoiName(data["names"][i]);
                var flag = obj.nameClass + "" + obj.nameType + "" + obj.langCode;
                if(flag == "11CHI"){
                    this.name11Chi = obj;
                } else if(flag == "12CHI"){
                    this.name12Chi = obj;
                } else if(flag == "51CHI"){
                    this.name51Chi = obj;
                } else if(flag == "11ENG"){
                    this.name11Eng = obj;
                }
            }
        }
    },
    /*
     * UI-->DB
     */
    getIntegrate: function() {
        var ret = {};
        ret['pid'] = this.pid;
        ret['status'] = this.status;
        ret["names"] = [];
        if (this.names) {
            if (this.names.length > 0) {
                if (this.name && !FM.Util.isEmptyObject(this.name) && this.name.name != "") {
                    var flag = true;
                    for (var i = 0, len = this.names.length; i < len; i++) {
                        if (this.name.langCode == this.names[i].langCode && this.name.nameClass == this.names[i].nameClass && this.name.nameType == this.names[i].nameType) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        this.names.push(this.name);
                    }
                }
                for (var i = 0, len = this.names.length; i < len; i++) {
                    ret["names"].push(this.names[i].getIntegrate());
                }
            } else {
                if (!FM.Util.isEmptyObject(this.name) && this.name.name != "") {
                    ret["names"].push(this.name.getIntegrate());
                }
            }
        }
        ret["addresses"] = [];
        if (this.addresses) {
            if (this.addresses.length > 0) {
                if (this.address && !FM.Util.isEmptyObject(this.address) && this.address.fullname != "") {
                    var flag = true;
                    for (var i = 0, len = this.addresses.length; i < len; i++) {
                        if (this.address.langCode == this.addresses[i].langCode) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        this.addresses.push(this.address);
                    }
                }
                for (var i = 0, len = this.addresses.length; i < len; i++) {
                    ret["addresses"].push(this.addresses[i].getIntegrate());
                }
            } else {
                if (!FM.Util.isEmptyObject(this.address) && this.address.fullname != "") {
                    ret["addresses"].push(this.address.getIntegrate());
                }
            }
        }
        ret["geoLiveType"] = this.geoLiveType;
        return ret;
    }
});