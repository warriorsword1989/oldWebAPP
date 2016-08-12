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
        this.kind = data["kind"] || 1;
        this.geoLiveType = data["geoLiveType"];
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["kind"] = this.kind;
        return data;

    }

});

fastmap.dataApi.lcLinkKind = function (data, options) {
    return new fastmap.dataApi.LcLinkKind(data, options);
};




