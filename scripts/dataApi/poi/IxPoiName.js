/**
 * Created by linglong on 2016/4/29.
 */
FM.dataApi.IxPoiName = FM.dataApi.DataModel.extend({
    
    dataModelType: "IX_POI_NAME",
    /*
     * 初始化
     */
    // initialize: function(data, options) {
    //     FM.setOptions(this, options);
    //     this.geoLiveType = "IxPoiName";
    //     this.setAttributeData(data);
    // },
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
});