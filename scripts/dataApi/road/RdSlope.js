/**
 * Created by liuyang on 2016/7/29.
 * Class RdSlope
 */

fastmap.dataApi.RdSlope = fastmap.dataApi.GeoDataModel.extend({

    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDSLOPE";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || "";
        this.nodePid = data["nodePid"] || 0;
        this.linkPid = data["linkPid"];
        this.type = data["type"] || 1;
        this.angle = data["angle"] || 0;
        this.slopeVias = [];

        for(var i=0;i<data["slopeVias"].length;i++){
            var link = fastmap.dataApi.rdSlopeLinks(data["slopeVias"][i]);
            this.slopeVias.push(link);
        }
    },

    /**
     * 获取RdElectronicEye简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["nodePid"] = this.nodePid;
        data["linkPid"]  = this.linkPid;
        data["type"] = this.type;
        data["angle"] = this.angle;
        data["slopeVias"] = [];
        data["geoLiveType"] = this.geoLiveType;
        for(var i=0;i<this.slopeVias.length;i++){
            data["slopeVias"].push(this.slopeVias[i].getIntegrate());
        }
        return data;
    },

    /**
     * 获取RdElectronicEye详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["nodePid"] = this.nodePid;
        data["linkPid"]  = this.linkPid;
        data["type"] = this.type;
        data["angle"] = this.angle;
        data["slopeVias"] = [];
        data["geoLiveType"] = this.geoLiveType;
        for(var i=0;i<this.slopeVias.length;i++){
            data["slopeVias"].push(this.slopeVias[i].getIntegrate());
        }
        return data;
    }
});

/***
 * RdSlope初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdSlope = function (data, options) {
    return new fastmap.dataApi.RdSlope(data, options);
}

