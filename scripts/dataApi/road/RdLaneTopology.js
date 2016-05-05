/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdLaneTopology = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLANETOPOLOGY";
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"];
        this.busLaneInfo = data["busLaneInfo"] || 0;
        this.connexityPid = data["connexityPid"];
        this.inLaneInfo = data["inLaneInfo"] || 0;
        this.outLinkPid = data["outLinkPid"];
        this.reachDir = data["reachDir"] || 0;
        this.relationshipType = data["relationshipType"] || 1;
        this.vias = [];
        for (var i = 0; i < data["vias"].length; i++) {
            var via = fastmap.dataApi.rdLaneVIA(data["vias"][i]);
            this.vias.push(via);
        }
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["busLaneInfo"] = this.busLaneInfo;
        data["connexityPid"] = this.connexityPid;
        data["inLaneInfo"] = this.inLaneInfo;
        data["outLinkPid"] = this.outLinkPid;
        data["reachDir"] = this.reachDir;
        data["relationshipType"] = this.relationshipType;
        data["vias"] = [];
        data["geoLiveType"] = this.geoLiveType;
        for (var i = 0; i < this.vias.length; i++) {
            data["vias"].push(this.vias.getIntegrate())
        }

        return data;
    },

    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["busLaneInfo"] = this.busLaneInfo;
        data["connexityPid"] = this.connexityPid;
        data["inLaneInfo"] = this.inLaneInfo;
        data["outLinkPid"] = this.outLinkPid;
        data["reachDir"] = this.reachDir;
        data["relationshipType"] = this.relationshipType;
        data["vias"] = [];
        data["geoLiveType"] = this.geoLiveType;
        for (var i = 0; i < this.vias.length; i++) {
            data["vias"].push(this.vias[i].getIntegrate())
        }
        return data;
    }
});/***
 * rdLaneConnexity topos初始化函数
 * @param data 车信数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdlanetopology}
 */
fastmap.dataApi.rdLaneTopology = function (data, options) {
    return new fastmap.dataApi.RdLaneTopology(data, options);
}
