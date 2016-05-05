/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdSpeedLimit = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDSPEEDLIMIT";
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"];
        this.linkPid = data["linkPid"];
        this.direct = data["direct"] || 0;
        this.speedValue = data["speedValue"] || 0;
        this.speedType = data["speedType"] || 0;
        this.tollgateFlag = data["tollgateFlag"] || 0;
        this.speedDependent = data["speedDependent"] || 0;
        this.speedFlag = data["speedFlag"] || 0;
        this.limitSrc = data["limitSrc"] || 1;
        this.timeDomain = data["timeDomain"] || "";
        this.captureFlag = data["captureFlag"] || 0;
        this.descript = data["descript"] || "";
        this.meshId = data["meshId"] || 0;
        this.status = data["status"] || 7;
        this.ckStatus = data["ckStatus"] || 6;
        this.adjaFlag = data["adjaFlag"] || 0;
        this.recStatusIn = data["recStatusIn"] || 0;
        this.recStatusOut = data["recStatusOut"] || 0;
        this.timeDescript = data["timeDescript"] || "";
        this.geometry = data["geometry"];
        this.laneSpeedValue = data["laneSpeedValue"] || "";
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["direct"] = this.direct;
        data["speedValue"] = this.speedValue;
        data["speedType"] = this.speedType;
        data["tollgateFlag"] = this.tollgateFlag;
        data["speedDependent"] = this.speedDependent;
        data["speedFlag"] = this.speedFlag;
        data["limitSrc"] = this.limitSrc;
        data["timeDomain"] = this.timeDomain;
        data["captureFlag"] = this.captureFlag;
        data["descript"] = this.descript;
        data["meshId"] = this.meshId;
        data["status"] = this.status;
        data["ckStatus"] = this.ckStatus;
        data["adjaFlag"] = this.adjaFlag;
        data["recStatusIn"] = this.recStatusIn;
        data["recStatusOut"] = this.recStatusOut;
        data["timeDescript"] = this.timeDescript;
        data["geometry"] = this.geometry;
        data["laneSpeedValue"] = this.laneSpeedValue;
        data["geoLiveType"]  = this.geoLiveType;

        return data;
    },

    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["direct"] = this.direct;
        data["speedValue"] = this.speedValue;
        data["speedType"] = this.speedType;
        data["tollgateFlag"] = this.tollgateFlag;
        data["speedDependent"] = this.speedDependent;
        data["speedFlag"] = this.speedFlag;
        data["limitSrc"] = this.limitSrc;
        data["timeDomain"] = this.timeDomain;
        data["captureFlag"] = this.captureFlag;
        data["descript"] = this.descript;
        data["meshId"] = this.meshId;
        data["status"] = this.status;
        data["ckStatus"] = this.ckStatus;
        data["adjaFlag"] = this.adjaFlag;
        data["recStatusIn"] = this.recStatusIn;
        data["recStatusOut"] = this.recStatusOut;
        data["timeDescript"] = this.timeDescript;
        data["geometry"] = this.geometry;
        data["laneSpeedValue"] = this.laneSpeedValue;
        data["geoLiveType"]  = this.geoLiveType;

        return data;
    }
});
/***
 * rdSpeedLimit初始化函数
 * @param data 限速数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdSpeedLimit}
 */
fastmap.dataApi.rdSpeedLimit = function (data, options) {
    return new fastmap.dataApi.RdSpeedLimit(data, options);
}