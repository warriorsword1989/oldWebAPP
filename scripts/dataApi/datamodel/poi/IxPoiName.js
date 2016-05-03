/**
 * Created by linglong on 2016/4/29.
 */
FM.dataApi.IxPoiName = FM.dataApi.GeoDataModel.extend({
    /*
     * 初始化
     */
    initialize: function(data, options) {
        FM.setOptions(this, options);
        this.geoLiveType = "IxPoiName";
        this.setAttributeData(data);
    },
    /*
     * 设置参数赋值;
     */
    setAttributeData: function(data) {
        this.nameId = data["nameId"] || 0;
        this.langCode = data["langCode"] || 'CHI';
        this.nameStr = data["nameStr"] || null;
        this.nameStrPinyin = data["nameStrPinyin"] || null;
        this.nameClass = data['nameClass'] || 1;
        this.type = data["type"] || 2;
        this.nameGrpId = data['nameGrpId'] || null;
    },
    /*
     *获取的poi Name信息
     */
    getIntegrate: function() {
        var data = {};
        data["nameId"] = this.nameId;
        data["langCode"] = this.langCode;
        data["nameStr"] = this.nameStr;
        data["nameStrPinyin"] = this.nameStrPinyin;
        data["nameClass"] = this.nameClass;
        data["type"] = this.type;
        data["nameGrpId"] = this.nameGrpId;
        return data;
    }
});