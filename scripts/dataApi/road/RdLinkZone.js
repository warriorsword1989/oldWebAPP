/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkZone = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKZONE";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.regionId = data["regionId"] || 0;
        this.type = data["type"] || 0;
        this.side = data["side"] || 0;
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
        data["regionId"] = this.regionId;
        data["type"] = this.type;
        data["side"] = this.side;
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
        data["regionId"] = this.regionId;
        data["type"] = this.type;
        data["side"] = this.side;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.rdLinkZone = function (data, options) {
    return new fastmap.dataApi.RdLinkZone(data, options);
}

