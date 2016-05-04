/**
 * Created by zhaohang on 2016/4/25.
 */

fastmap.dataApi.AdNode = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "ADNODE";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.kind = data["kind"] || 1;
        this.form = data["form"] || 0;
        this.geometry = data["geometry"];
        this.editFlag = data["editFlag"] || 1;
        this.meshId = data["meshId"] || 0;

    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["geometry"] = this.geometry;
        data["editFlag"] = this.editFlag;
        data["meshId"] = this.meshId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["geometry"] = this.geometry;
        data["editFlag"] = this.editFlag;
        data["meshId"] = this.meshId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }

});

fastmap.dataApi.adNode = function (data, options) {
    return new fastmap.dataApi.AdNode(data, options);
}

