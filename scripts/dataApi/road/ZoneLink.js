/**
 * Created by liuyang on 2016/6/29.
 */
fastmap.dataApi.ZoneLink = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "ZONELINK";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.rowId = data["rowId"];
        this.sNodePid = data["sNodePid"];
        this.eNodePid = data["eNodePid"];
        this.kinds = [];
        if (data["kinds"]) {
            for (var i = 0, len = data["kinds"].length; i < len; i++) {
                this.kinds.push(fastmap.dataApi.zoneLinkKind(data["kinds"][i]));
            }
        }
        this.geometry = data["geometry"];
        this.length = data["length"] || 0;
        this.scale = data["scale"] || 0;
        this.editFlag = data["editFlag"] || 1;
        var str = [];
        for (var i = 0; i<data.meshes.length;i++) {
            str.push(data.meshes[i].meshId);
        }
        this.meshId = str.join(',');
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["rowId"] = this.rowId;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kinds"] = [];
        data["geoLiveType"] = this.geoLiveType;
        if (this.kinds) {
            for (var i = 0, len = this.kinds.length; i < len; i++) {
                data["kinds"].push(this.kinds[i].getIntegrate());
            }
        }
        data["geometry"] = this.geometry;
        data["length"] = this.length;
        data["scale"] = this.scale;
        data["editFlag"] = this.editFlag;
        data["meshId"] = this.meshId;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["rowId"] = this.rowId;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kinds"] = [];
        if (this.kinds) {
            for (var i = 0, len = this.kinds.length; i < len; i++) {
                data["kinds"].push(this.kinds[i].getIntegrate());
            }
        }
        data["geometry"] = this.geometry;
        data["length"] = this.length;
        data["scale"] = this.scale;
        data["editFlag"] = this.editFlag;
        data["meshId"] = this.meshId;
        return data;
    }

});

fastmap.dataApi.zoneLink = function (data, options) {
    return new fastmap.dataApi.ZoneLink(data, options);
};




