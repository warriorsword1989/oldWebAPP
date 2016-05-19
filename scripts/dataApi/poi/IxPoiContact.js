/**
 * Created by wuzhen on 2016/5/3.
 */
FM.dataApi.IxPoiContact = FM.dataApi.DataModel.extend({

    dataModelType: "IX_POI_CONTACT",
    /*
     * UI-->DB
     */
     getIntegrate: function (){
        var ret = {};
        ret['priority'] = this.priority;
        ret['type'] = this.type;
        ret['linkman'] = this.linkman;
        ret['weChatUrl'] = this.weChatUrl;
        ret['number'] = this.number;
        return ret;
     },
    
    /*
     *  DB-->UI
     */
    setAttributes: function(data) {
        this.number = data["number"] || "";
        this.type = data["type"];
        this.linkman = data["linkman"] || null;
        this.priority = data["priority"];
        this.weChatUrl = data["weChatUrl"] || null;
        this.numRre = data["numRre"] || "";
        this.numSuf = data["numSuf"] || "";
        this.flag = data["numSuf"] || false;
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
