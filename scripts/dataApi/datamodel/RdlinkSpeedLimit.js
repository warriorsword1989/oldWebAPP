/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkSpeedLimit = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKSPEEDLIMIT";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.speedType = data["speedType"] || 0;
        this.fromSpeedLimit = data["fromSpeedLimit"] || 0;
        this.toSpeedLimit = data["toSpeedLimit"] || 0;
        this.speedClass = data["speedClass"] || 0;
        this.fromLimitSrc = data["fromLimitSrc"] || 0;
        this.toLimitSrc = data["toLimitSrc"] ||0;
        this.speedDependent = data["speedDependent"] || 0;
        this.timeDomain = data["timeDomain"] || "";
        this.speedClassWork = data["speedClassWork"] || 1;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["speedType"] = this.speedType;
        data["fromSpeedLimit"]  = this.fromSpeedLimit;
        data["toSpeedLimit"] = this.toSpeedLimit;
        data["speedClass"] = this.speedClass;
        data["fromLimitSrc"]  = this.fromLimitSrc;
        data["toLimitSrc"] = this.toLimitSrc;
        data["speedDependent"] = this.speedDependent;
        data["timeDomain"]  = this.timeDomain;
        data["speedClassWork"] = this.speedClassWork;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPid"] = this.linkPid;
        data["rowId"] = this.rowId;
        data["speedType"] = this.speedType;
        data["fromSpeedLimit"]  = this.fromSpeedLimit;
        data["toSpeedLimit"] = this.toSpeedLimit;
        data["speedClass"] = this.speedClass;
        data["fromLimitSrc"]  = this.fromLimitSrc;
        data["toLimitSrc"] = this.toLimitSrc;
        data["speedDependent"] = this.speedDependent;
        data["timeDomain"]  = this.timeDomain;
        data["speedClassWork"] = this.speedClassWork;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * linkSpeedLimit初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkSpeedLimit}
 */
fastmap.dataApi.rdLinkSpeedLimit = function (data, options) {
    return new fastmap.dataApi.RdLinkSpeedLimit(data, options);
}

