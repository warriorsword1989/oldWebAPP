/**
 * Created by linglong on 2016/8/11.
 */
fastmap.dataApi.LcLinkKind = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "LCLINKKIND";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.linkPid = data["linkPid"];
        this.kind = data["kind"] || 0;
        this.form = data["form"] || 0;
        this.geoLiveType = data["geoLiveType"];
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        return data;
    }

});

fastmap.dataApi.lcLinkKind = function (data, options) {
    return new fastmap.dataApi.LcLinkKind(data, options);
};




