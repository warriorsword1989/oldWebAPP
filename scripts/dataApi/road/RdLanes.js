/**
 * Created by wangmingdong on 2016/9/6.
 * Class RdLane组成数组
 */

fastmap.dataApi.RdLanes = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDLANE";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPids = data["linkPids"] || [];
        this.laneDir = data["laneDir"] || 1;
        this.laneInfos = [];
        if (data["laneInfos"] && data["laneInfos"].length > 0) {
            for (var i = 0; i < data["laneInfos"].length; i++) {
                var laneInfo = new fastmap.dataApi.RdLane(data["laneInfos"][i]);
                this.laneInfos.push(laneInfo);
            }
        }
    },

    /**
     * 获取组成link简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPids"] = this.linkPids;
        data["laneDir"] = this.laneDir;
        data["laneInfos"] = this.laneInfos;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取组成link详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["linkPids"] = this.linkPids;
        data["laneDir"] = this.laneDir;
        data["laneInfos"] = this.laneInfos;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * rdLanes初始化函数
 * @param id
 * @param point 初始化rdInterLinks的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdLanes = function (data, options) {
    return new fastmap.dataApi.RdLanes(data, options);
}
