/**
 * Created by mali on 2016/7/25.
 */
fastmap.dataApi.LuLinkKind = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "LULINKKIND";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.linkPid = data["linkPid"];
        this.rowId = data["rowId"];
        this.kind = data["kind"] || 1;
        this.form = data["form"] || 1;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["rowId"] = this.rowId;
        return data;

    }

});

fastmap.dataApi.luLinkKind = function (data, options) {
    return new fastmap.dataApi.LuLinkKind(data, options);
};




