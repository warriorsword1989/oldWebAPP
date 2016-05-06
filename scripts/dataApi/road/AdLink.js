/**
 * Created by zhaohang on 2016/4/5.
 */
fastmap.dataApi.AdLink = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "ADLINK";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.sNodePid = data["sNodePid"];
        this.eNodePid = data["eNodePid"];
        this.kind = data["kind"] || 1;
        this.form = data["form"] || 1;
        this.geometry = data["geometry"];
        this.length = data["length"] || 0;
        this.scale = data["scale"] || 0;
        this.editFlag = data["editFlag"] || 1;
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
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["geometry"] = this.geometry;
        data["length"] = this.length;
        data["scale"] = this.scale;
        data["editFlag"] = this.editFlag;
        data["meshId"] = this.meshId;
        data["geoLiveType"] = this.geoLiveType;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kind"] = this.kind;
        data["form"] = this.form;
        data["geometry"] = this.geometry;
        data["length"] = this.length;
        data["scale"] = this.scale;
        data["editFlag"] = this.editFlag;
        data["meshId"] = this.meshId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

});

    fastmap.dataApi.adLink = function (data, options) {
        return new fastmap.dataApi.AdLink(data, options);
    }




