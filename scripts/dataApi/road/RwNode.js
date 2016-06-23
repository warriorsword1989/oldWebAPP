/**
 * Created by mali on 2016/6/23.
 */
fastmap.dataApi.RwNode = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RWNODE";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.kind = data["kind"];
        this.form = data["form"];
        this.geometry = data["geometry"];
        var str = [];
        for (var i = 0; i<data.meshes.length;i++) {
            str.push(data.meshes[i].meshId)
        }
        this.meshId = str.join(',');
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["meshId"] = this.meshId;
        data["geometry"] = this.geometry;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["meshId"] = this.meshId;
        data["geometry"] = this.geometry;
        return data;
    },

});

fastmap.dataApi.rwNode = function (data, options) {
    return new fastmap.dataApi.RwNode(data, options);
}

