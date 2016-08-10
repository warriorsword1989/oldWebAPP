/**
 * Created by mali on 2016/7/25.
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
        this.length = data["length"] || 0;
        this.kinds = [];
        this.form = [];
        if (data["kinds"]) {
            for (var i = 0, len = data["kinds"].length; i < len; i++) {
                this.kinds.push(fastmap.dataApi.LCLinkKind(data["kinds"][i]));
            }
        }
        if (data["form"]) {
            for (var i = 0, len = data["form"].length; i < len; i++) {
                this.kinds.push(fastmap.dataApi.LCLinkKind(data["form"][i]));
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
        data["form"] = [];
        if (this.kinds) {
            for (var i = 0, len = this.kinds.length; i < len; i++) {
                data["kinds"].push(this.kinds[i].getIntegrate());
            }
        }
        if (data["form"]) {
            for (var i = 0, len = data["form"].length; i < len; i++) {
                this.kinds.push(fastmap.dataApi.LCLinkKind(data["form"][i]));
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
        data["form"] = [];
        if (this.kinds) {
            for (var i = 0, len = this.kinds.length; i < len; i++) {
                data["kinds"].push(this.kinds[i].getIntegrate());
            }
        }
        if (this.form) {
            for (var i = 0, len = this.form.length; i < len; i++) {
                data["form"].push(this.form[i].getIntegrate());
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
