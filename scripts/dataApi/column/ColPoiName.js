/**
 * Created by wuz on 2016/8/25.
 */
FM.dataApi.ColPoiName = FM.dataApi.DataModel.extend({
    dataModelType: "COL_POI_NAME",
    /*
     * DB-->UI
     */
    setAttributes: function(data) {
        this.pid = data['pid'] || 0;
        this.poiPid = data['poiPid'] || 0;
        this.nameGroupid = data['nameGroupid'] || 1;
        this.langCode = data['langCode'];
        this.nameClass = data['nameClass'] || 1;
        this.nameType = data['nameType'] || 1;
        this.name = data['name'] || "";
        this.namePhonetic = data['namePhonetic'] || "";
        this.rowId = data["rowId"] || "";
    },
    /*
     * UI-->DB
     */
    getIntegrate: function() {
        var ret = {};
        ret["pid"] = this.pid;
        ret["poiPid"] = this.poiPid;
        ret["nameGroupid"] = this.nameGroupid;
        ret["langCode"] = this.langCode;
        ret["nameClass"] = this.nameClass;
        ret["nameType"] = this.nameType;
        ret["name"] = this.name;
        ret["namePhonetic"] = this.namePhonetic;
        ret["rowId"] = this.rowId;
        return ret;
    }
});