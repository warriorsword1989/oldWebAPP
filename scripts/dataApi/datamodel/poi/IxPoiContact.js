/**
 * Created by wuzhen on 2016/5/3.
 */
FM.dataApi.IxPoiContact = FM.dataApi.GeoDataModel.extend({

    geoLiveType: "IX_POI_CONTACT",

    /*
     * 初始化
     */
    // initialize: function(data, options) {
    //     FM.setOptions(this, options);
    //     this.geoLiveType = "IXPOICONTACT";
    //     this.setAttributeData(data);
    // },
    /*
     * 设置参数赋值;
     */
    setAttributes: function(data) {
        this.number = data["number"] || "";
        this.type = data["type"] || 1;
        this.linkman = data["linkman"] || null;
        this.priority = data["priority"] || 1;
        this.weChatUrl = data["weChatUrl"] || null;
    }
});