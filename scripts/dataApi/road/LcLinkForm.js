/**
 * Created by linglong on 2016/8/11.
 */
fastmap.dataApi.LcLinkForm = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "LCLINKFORM";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.linkPid = data["linkPid"];
        this.form = data["form"] || 1;
        this.geoLiveType = data["geoLiveType"];
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["form"] = this.form;
        return data;

    }

});

fastmap.dataApi.lcLinkForm = function (data, options) {
    return new fastmap.dataApi.LcLinkForm(data, options);
};




