/**
 * Created by wuzhen on 2016/5/3.
 */
FM.dataApi.IxPoiContact = FM.dataApi.DataModel.extend({

    dataModelType: "IX_POI_CONTACT",
    /*
     * UI-->DB
     */
    getIntegrate: function() {
        var ret = {};
        ret['priority'] = this.priority;
        ret['type'] = this.type;
        ret['linkman'] = this.linkman;
        ret['weChatUrl'] = this.weChatUrl;
        if (this.type == 1) {
            ret['number'] = this.numRre + "-" + this.numSuf;
        } else {
            ret['number'] = this.numSuf;
        }
        return ret;
    },

    /*
     *  DB-->UI
     */
    setAttributes: function(data) {
        //this.number = data["number"] || "";
        this.type = data["type"];
        this.linkman = data["linkman"] || null;
        this.priority = data["priority"];
        this.weChatUrl = data["weChatUrl"] || null;
        this.numRre = data["numRre"] || "";
        this.numSuf = data["numSuf"] || "";
        if (this.type == 1) { //
            if (data["number"]) {
                var temp = data["number"].split("-");
                this.numRre = temp[0];
                this.numSuf = temp[1];
            }
        } else {
            this.numSuf = this.number
        }
    }
});
