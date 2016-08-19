/**
 * Created by wangmingdong on 2016/8/19.
 */

FM.dataApi.IxPoiCarRental = FM.dataApi.DataModel.extend({
    dataModelType: "IX_POI_CARRENTAL",
    /*
     * 返回参数赋值
     */
    setAttributes: function(data) {
        this._flag_ = data["_flag_"] || false; //深度信息特殊字段,用于控制深度信息的保存
        this.poiPid = data['poiPid'] || 0;
        this.openHour = data['openHour'] || null;
        this.address = data['address'] || null;
        this.howToGo = data['howToGo'] || null;
        this.phone400 = data['phone400'] || null;
        this.webSite = data['webSite'] || null;
    },
    getIntegrate: function(){
        var ret = {};
        ret['_flag_'] = this._flag_;
        ret['poiPid'] = this.poiPid;
        ret["openHour"] = this.openHour;
        ret['address'] = this.address;
        ret['howToGo'] = this.howToGo;
        ret['phone400'] = this.phone400;
        ret['webSite'] = this.webSite;
        return ret;
    }
});
