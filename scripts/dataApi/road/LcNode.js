/**
 * Created by linglong on 2016/7/25.
 */
fastmap.dataApi.LCNode = fastmap.dataApi.GeoDataModel.extend({
	/**
	 * 初始化
	 * @param data
	 * @param options
	 */
    initialize: function (data, options) {
    	L.setOptions(this, options);
        this.geoLiveType = "LCNODE";
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData:function(data){
        this.pid = data["pid"];
        this.form = data["form"];
        this.geometry = data["geometry"];
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
        data["form"] = this.form;
        data["meshId"] = this.meshId;
        data["geometry"] = this.geometry;
        data["geoLiveType"] = this.geoLiveType;
        return data;

    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["form"] = this.form;
        data["meshId"] = this.meshId;
        data["geometry"] = this.geometry;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

});

fastmap.dataApi.lcNode = function (data, options) {
    return new fastmap.dataApi.LCNode(data, options);
};

