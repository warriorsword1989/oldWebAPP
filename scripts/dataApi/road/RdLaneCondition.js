/**
 * Created by wangmingdong on 2016/8/31.
 * Class Rdnode
 */

fastmap.dataApi.RdLaneCondition = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDLANECONDITION";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.lanePid = data["lanePid"];
        this.direction = data["direction"] || 1;
        this.directionTime = data["directionTime"] || null;
        this.vehicle = data["vehicle"] || 0;
        this.vehicleTime = data["vehicleTime"] || null;
    },

    /**
     * 获取RdLaneCondition简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["lanePid"] = this.lanePid;
        data["direction"] = this.direction;
        data["directionTime"]  = this.directionTime;
        data["vehicle"]  = this.vehicle;
        data["vehicleTime"]  = this.vehicleTime;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdLaneCondition详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["lanePid"] = this.lanePid;
        data["direction"] = this.direction;
        data["directionTime"]  = this.directionTime;
        data["vehicle"]  = this.vehicle;
        data["vehicleTime"]  = this.vehicleTime;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * RdLaneCondition初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdLaneCondition = function (data, options) {
    return new fastmap.dataApi.RdLaneCondition(data, options);
}
