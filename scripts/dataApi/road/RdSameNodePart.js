/**
 * Created by wuzhen on 2016/8/5.
 * Class RdSameNodePart 同一点组成表
 */

fastmap.dataApi.RdSameNodePart = fastmap.dataApi.GeoDataModel.extend({


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
        this.nodePid = data["nodePid"];
        this.tableName = data["tableName"];
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
        data["nodePid"] = this.nodePid;
        data["tableName"] = this.tableName;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * RdSameNodePart
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["groupId"] = this.groupId;
        data["nodePid"] = this.nodePid;
        data["tableName"] = this.tableName;
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
 * @returns {.dataApi.RdSameNodePart}
 */
fastmap.dataApi.rdSameNodePart = function (data, options) {
    return new fastmap.dataApi.RdSameNodePart(data, options);
};

