/**
 * Created by wuzhen on 2016/8/5.
 * Class RdSameNode 同一点
 */

fastmap.dataApi.RdSameNode = fastmap.dataApi.GeoDataModel.extend({


    /***
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDSAMENODE";
        this.setAttributeData(data);
    },
    /**
     * 设置信息
     */
    setAttributeData:function(data){
        this.groupId = data["groupId"];
        this.uRecord = data["uRecord"] || 0;
        this.uFields = data["uFields"] || null;
        this.rowId = data["rowId"] || null;
    },

    /**
     * 获取简略信息
     */
    getSnapShot:function() {
        var data = {};
        data["groupId"] = this.groupId;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdDirectRoute详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["groupId"] = this.groupId;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * RdSameNode初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.RdSameNode}
 */
fastmap.dataApi.rdSameNode = function (data, options) {
    return new fastmap.dataApi.RdSameNode(data, options);
}

