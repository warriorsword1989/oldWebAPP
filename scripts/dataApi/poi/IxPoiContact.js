/**
 * Created by wuzhen on 2016/5/3.
 */
FM.dataApi.IxPoiContact = FM.dataApi.DataModel.extend({

    dataModelType: "IX_POI_CONTACT",

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
        this.numRre = "";
        this.numSuf = "";
        this.flag = false;
        if (this.type == 1) {
            if (this.number) {
                var temp = this.number.split("-");
                this.numRre = temp[0];
                this.numSuf = temp[1];
            }
            this.flag = true
        }
    }
});
