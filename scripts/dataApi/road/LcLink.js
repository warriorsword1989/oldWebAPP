/**
 * Created by linglong on 2016/7/25.
 */
fastmap.dataApi.LCLink = fastmap.dataApi.GeoDataModel.extend({
	/**
	 * 初始化
	 * @param data
	 * @param options
	 */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "LCLINK";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.sNodePid = data["sNodePid"];
        this.eNodePid = data["eNodePid"];
        this.geometry = data["geometry"];
        this.geoLiveType = data["geoLiveType"];
        this.length = data["length"] || 0;
        this.kinds = [];
        if (data["kinds"].length) {
            for (var i = 0, len = data["kinds"].length; i < len; i++) {
                this.kinds.push(fastmap.dataApi.lcLinkKind(data["kinds"][i]));
            }
        }
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
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["geometry"] = this.geometry;
        data["length"] = this.length;
        data["kinds"] = [];
        if (this.kinds) {
            for (var i = 0, len = this.kinds.length; i < len; i++) {
                data["kinds"].push(this.kinds[i].getIntegrate());
            }
        }
        data["editFlag"] = this.editFlag;
        data["meshId"] = this.meshId;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["geometry"] = this.geometry;
        data["length"] = this.length;
        data["kinds"] = [];
        if (this.kinds) {
            for (var i = 0, len = this.kinds.length; i < len; i++) {
                data["kinds"].push(this.kinds[i].getIntegrate());
            }
        }
        data["editFlag"] = this.editFlag;
        data["meshId"] = this.meshId;
        return data;
    }

});

fastmap.dataApi.lcLink = function (data, options) {
    return new fastmap.dataApi.LCLink(data, options);
};
