/**
 * Created by zhaohang on 2016/4/5.
 */
fastmap.dataApi.adAdmin = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "ADADMIN";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.regionId = data["regionId"];
        this.adminId = data["adminId"] || 0;
        this.extendId = data["extendId"] || 0;
        this.adminType = data["adminType"] || 0;
        this.capital = data["capital"] || 0;
        this.population = data["population"] || null;
        this.geometry = data["geometry"];
        this.linkPid = data["linkPid"] || 0;
        this.side = data["side"] || 0;
        this.jisCode = data["jisCode"] || 0;
        this.meshId = data["meshId"] || 0;
        this.editFlag = data["editFlag"] || 1;
        this.memo = data["memo"] || null;

        this.names = [];
        if (data["names"]&&data["names"].length > 0) {
            for (var i = 0, len = data["names"].length; i < len; i++) {
                var name =fastmap.dataApi.adadminname(data["names"][i]);
                this.names.push(name);
            }


        }


    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["regionId"] = this.regionId;
        data["adminId"] = this.adminId;
        data["extendId"] = this.extendId;
        data["adminType"] = this.adminType;
        data["capital"] = this.capital;
        data["population"] = this.population;
        data["geometry"] = this.geometry;
        data["linkPid"] = this.linkPid;
        data["side"] = this.side;
        data["jisCode"] = this.jisCode;
        data["meshId"] = this.meshId;
        data["editFlag"] = this.editFlag;
        data["memo"] = this.memo;

        var names = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            names.push(this.names[i].getIntegrate());
        }
        data["names"] = names;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["regionId"] = this.regionId;
        data["adminId"] = this.adminId;
        data["extendId"] = this.extendId;
        data["adminType"] = this.adminType;
        data["capital"] = this.capital;
        data["population"] = this.population;
        data["geometry"] = this.geometry;
        data["linkPid"] = this.linkPid;
        data["side"] = this.side;
        data["jisCode"] = this.jisCode;
        data["meshId"] = this.meshId;
        data["editFlag"] = this.editFlag;
        data["memo"] = this.memo;

        var names = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            names.push(this.names[i].getIntegrate());
        }
        data["names"] = names;
        return data;
    },

});

fastmap.dataApi.adadmin = function (data, options) {
    return new fastmap.dataApi.adAdmin(data, options);
}
