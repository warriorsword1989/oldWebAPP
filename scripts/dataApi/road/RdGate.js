/**
 * Created by mali on 2016/7/20.
 * Class RdGate
 */

fastmap.dataApi.RdGate = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data geometry
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDGATE";
        this.setAttributeData(data);
    },

    /**
     * 将请求返回结果给对象属性赋值
     * @method setAttributeData
     *
     * @param {object} data.
     */
    setAttributeData: function (data) {
    	this.pid = data["pid"];
        this.inLinkPid = data["inLinkPid"];
        this.nodePid = data["nodePid"];
        this.outLinkPid = data["outLinkPid"];
        this.type = data["type"] || 2;
        this.dir = data["dir"] || 2;
        this.fee = data["fee"] || 0;
    },

    /**
     * 获取简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["outLinkPid"] = this.outLinkPid;
        data["type"] = this.type;
        data["dir"] = this.dir;
        data["fee"] = this.fee;
        return data;
    },

    /**
     * 获取详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["outLinkPid"] = this.outLinkPid;
        data["type"] = this.type;
        data["dir"] = this.dir;
        data["fee"] = this.fee;
        return data;
    }
});

/***
 * RdGate初始化函数
 */
fastmap.dataApi.rdGate = function (data, options) {
    return new fastmap.dataApi.RdGate(data, options);
}

