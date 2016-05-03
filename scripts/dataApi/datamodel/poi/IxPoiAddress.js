/**
 * Created by linglong on 2016/4/29.
 */
FM.dataApi.IxPoiAddress = FM.dataApi.GeoDataModel.extend({
    /*
     * 初始化
     */
    initialize: function(data, options) {
        FM.setOptions(this, options);
        this.geoLiveType = "IxPoiAddress";
        this.setAttributeData(data);
    },
    /*
     * 设置参数赋值;
     */
    setAttributeData: function(data) {
        this.fullName = data["fullName"] || null;
        this.addrName = data["addrName"] || null;
        this.roadName = data["roadName"] || null;
        this.fullNamePinyin = data["fullNamePinyin"] || null;
        this.addrNamePinyin = data['addrNamePinyin'] || null;
        this.roadNamePinyin = data["roadNamePinyin"] || null;
        this.langCode = data['langCode'] || 'CHT';
    },
    /*
     *获取的poi Address信息
     */
    getIntegrate: function() {
        var data = {};
        data["fullName"] = this.fullName;
        data["addrName"] = this.addrName;
        data["roadName"] = this.roadName;
        data["fullNamePinyin"] = this.fullNamePinyin;
        data["addrNamePinyin"] = this.addrNamePinyin;
        data["roadNamePinyin"] = this.roadNamePinyin;
        data["langCode"] = this.langCode;
        return data;
    }
});