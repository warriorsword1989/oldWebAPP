/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdCrossName = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDCROSSNAME";
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"];
        this.nameGroupid = data["nameGroupid"] || 1;
        this.nameId = data["nameId"] || 1;
        this.langCode = data["langCode"] || "CHI";
        this.name = data["name"] || "";
        this.phonetic = data["phonetic"] || "";
        this.srcFlag = data["srcFlag"] || 0;
        this.rowId = data["rowId"];
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["nameGroupid"] = this.nameGroupid;
        data["nameId"] = this.nameId;
        data["langCode"] = this.langCode;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["nameGroupid"] = this.nameGroupid;
        data["nameId"] = this.nameId;
        data["langCode"] = this.langCode;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});
/***
 * rdCross中的name初始化函数
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdCross}
 */
fastmap.dataApi.rdCrossName = function (data, options) {
    return new fastmap.dataApi.RdCrossName(data, options);
}
