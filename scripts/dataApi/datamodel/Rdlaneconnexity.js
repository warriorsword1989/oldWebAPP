/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.RdLaneConnexity = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType  = "RDLANECONNEXITY";
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"];
        this.inLinkPid = data["inLinkPid"];
        this.nodePid = data["nodePid"];
        this.laneInfo = data["laneInfo"] || "";
        this.conflictFlag = data["conflictFlag"] || 0;
        this.kgFlag = data["kgFlag"] || 0;
        this.laneNum = data["laneNum"] || 0;
        this.leftExtend = data["leftExtend"] || 0;
        this.rightExtend = data["rightExtend"] || 0;
        this.srcFlag = data["srcFlag"] || 0;
        this.topos = [];
        for (var i = 0; i < data["topos"].length; i++) {
            var topos = fastmap.dataApi.rdLaneTopology(data["topos"][i]);
            this.topos.push(topos);
        }
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["laneInfo"] = this.laneInfo;
        data["conflictFlag"] = this.conflictFlag;
        data["kgFlag"] = this.kgFlag;
        data["laneNum"] = this.laneNum;
        data["leftExtend"] = this.leftExtend;
        data["rightExtend"] = this.rightExtend;
        data["srcFlag"] = this.srcFlag;
        data["geoLiveType"] = this.geoLiveType;
        data["topos"] = [];
        for (var i = 0; i < this.topos.length; i++) {
            data["topos"].push(this.topos[i].getIntegrate())
        }

        return data;
    },

    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["laneInfo"] = this.laneInfo;
        data["conflictFlag"] = this.conflictFlag;
        data["kgFlag"] = this.kgFlag;
        data["laneNum"] = this.laneNum;
        data["leftExtend"] = this.leftExtend;
        data["rightExtend"] = this.rightExtend;
        data["srcFlag"] = this.srcFlag;
        data["geoLiveType"] = this.geoLiveType;
        data["topos"] = [];
        for (var i = 0; i < this.topos.length; i++) {
            data["topos"].push(this.topos[i].getIntegrate())
        }

        return data;
    }
});
/***
 * rdLaneConnexity初始化函数
 * @param data 车信数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdLaneConnexity}
 */
fastmap.dataApi.rdLaneConnexity = function (data, options) {
    return new fastmap.dataApi.RdLaneConnexity(data, options);
}