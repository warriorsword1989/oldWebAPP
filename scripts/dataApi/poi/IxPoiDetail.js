/**
 * Created by linglong on 2016/8/26.
 */
FM.dataApi.IxPoiDetail = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_DETAIL",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this.pid = data['pid'] || 0;
        this.webSite = data['webSite'] || '';
        this.fax = [];
        var fax = data["fax"].split("|");
        for(var i=0;i<fax.length;i++) {
            this.fax.push(fax[i]);
        }
        this.starHotel = data['starHotel'] || '';
        this.briefDesc = data['briefDesc'] || '';
        this.adverFlag = data['adverFlag'] || 0;
        this.photoName = data['photoName'] || '';
        this.reserved = data['reserved'] || '';
        this.memo = data['memo'] || '';
        this.hwEntryexit = data['hwEntryexit'] || 0;
        this.paycard = data['paycard'] || '';
        this.cardtype = [];
        var cardtype = data["cardtype"].split("|");
        for(var i=0;i<cardtype.length;i++) {
            this.cardtype.push(cardtype[i]);
        }
        this.hospitalClass = data['hospitalClass'] || 0;
    },

    getIntegrate: function(){
        var ret = {};
        ret['pid'] = this.pid;
        ret['webSite'] = this.webSite;
        ret['fax'] = [];
        for(var i=0;i<this.fax.length;i++) {
            ret['fax'].push(this.fax[i]);
        }
        ret['starHotel'] = this.starHotel;
        ret['briefDesc'] = this.briefDesc;
        ret['adverFlag'] = this.adverFlag;
        ret['photoName'] = this.photoName;
        ret['reserved'] = this.reserved;
        ret['memo'] = this.memo;
        ret['hwEntryexit'] = this.hwEntryexit;
        ret['paycard'] = this.paycard;
        ret['cardtype'] = [];
        for(var i=0;i<this.cardtype.length;i++) {
            ret['cardtype'].push(this.cardtype[i]);
        }
        ret['hospitalClass'] = this.hospitalClass;
        return ret;
    }
});