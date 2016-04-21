/**
 * Created by zhaohang on 2016/4/5.
 */
fastmap.dataApi.AdAdminName = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        if(!data["regionId"]){
            throw "form对象没有对应link"
        }
        else{
            this.id = data["regionId"];
        }
        this.geoLiveType = "ADADMINNAME";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.nameId = data["nameId"];
        this.regionId = data["regionId"];
        this.nameGroupid = data["nameGroupid"] || 1;
        this.langCode = data["langCode"] || "CHI" || "CHT";
        this.nameClass = data["nameClass"] || 1;
        this.name = data["name"] || null;
        this.phonetic = data["phonetic"] || null;
        this.srcFlag = data["srcFlag"] || 0;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["nameId"] = this.nameId;
        data["regionId"] = this.regionId;
        data["nameGroupid"] = this.nameGroupid;
        data["langCode"] = this.langCode;
        data["nameClass"] = this.nameClass;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data["nameId"] = this.nameId;
        data["regionId"] = this.regionId;
        data["nameGroupid"] = this.nameGroupid;
        data["langCode"] = this.langCode;
        data["nameClass"] = this.nameClass;
        data["name"] = this.name;
        data["phonetic"] = this.phonetic;
        data["srcFlag"] = this.srcFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

});

fastmap.dataApi.adAdminName = function (data, options) {
    return new fastmap.dataApi.AdAdminName(data, options);
}
