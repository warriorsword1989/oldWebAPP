/**
 * Created by zhaohang on 2016/4/7.
 */
fastmap.dataApi.RwLinkName = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RWLINKNAME";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.linkPid = data["linkPid"] || 0;
        this.nameGroupid = data["nameGroupid"] || 0;
        this.name = data["name"] || "";
        this.uFields = data["uFields"];


    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["nameGroupid"] = this.nameGroupid;
        data["uFields"] = this.uFields;
        data["name"] = this.name;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["nameGroupid"] = this.nameGroupid;
        data["uFields"] = this.uFields;
        data["name"] = this.name;
        return data;
    },

});

fastmap.dataApi.rwLinkName = function (data, options) {
    return new fastmap.dataApi.RwLinkName(data, options);
}

