/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdWarningInfo = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data geometry
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDWARNINGINFO";
        this.setAttributeData(data);
    },

    /**
     * 将请求返回结果给对象属性赋值
     * @method setAttributeData
     *
     * @param {object} data.
     */
    setAttributeData: function (data) {
        this.pid = data["pid"] || null;
        this.linkPid = data["linkPid"];
        this.nodePid = data["nodePid"];
        this.typeCode = data["typeCode"] || null;
        this.validDis = data["validDis"] || 0;
        this.warnDis = data["warnDis"] || 0;
        this.timeDomain = data["timeDomain"] || null;
        this.vehicle = data["vehicle"] || 0;
        this.descript = data["descript"] || null;
        this.rowId = data["rowId"] || null;
    },

    /**
     * 获取道路简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["nodePid"] = this.nodePid;
        data["typeCode"] = this.typeCode;
        data["validDis"] = this.validDis;
        data["warnDis"] = this.warnDis;
        data["timeDomain"] = this.timeDomain;
        data["vehicle"] = this.vehicle;
        data["descript"] = this.descript;
        data["rowId"] = this.rowId;
        data["geoLiveType"]  = this.geoLiveType;

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
        data["linkPid"] = this.linkPid;
        data["nodePid"] = this.nodePid;
        data["typeCode"] = this.typeCode;
        data["validDis"] = this.validDis;
        data["warnDis"] = this.warnDis;
        data["timeDomain"] = this.timeDomain;
        data["vehicle"] = this.vehicle;
        data["descript"] = this.descript;
        data["rowId"] = this.rowId;
        data["geoLiveType"]  = this.geoLiveType;

        return data;
    }
});

/***
 * RdWarningInfo
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdWarningInfo = function (data, options) {
    return new fastmap.dataApi.RdWarningInfo(data, options);
}

