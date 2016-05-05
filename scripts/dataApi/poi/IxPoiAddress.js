/**
 * Created by linglong on 2016/4/29.
 */
FM.dataApi.IxPoiAddress = FM.dataApi.DataModel.extend({

    dataModelType: "IX_POI_ADDRESS",
    /*
     * 初始化
     */
    // initialize: function(data, options) {
    //     FM.setOptions(this, options);
    //     this.geoLiveType = "IxPoiAddress";
    //     this.setAttributeData(data);
    // },
    /*
     * 设置参数赋值;
     */
    setAttributes: function(data) {
        this.fullName = data["fullName"] || null;
        this.addrName = data["addrName"] || null;
        this.roadName = data["roadName"] || null;
        this.fullNamePinyin = data["fullNamePinyin"] || null;
        this.addrNamePinyin = data['addrNamePinyin'] || null;
        this.roadNamePinyin = data["roadNamePinyin"] || null;
        this.langCode = data['langCode'] || 'CHT';
    }
});