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
        this.pid = data["pid"];
        this.groupId = data["groupId"];
        this.rowId = data["rowId"] || null;

        this.parts = [];
        if (data["parts"]) {
            for (var i = 0, len = data["parts"].length; i < len; i++) {
                this.parts.push(fastmap.dataApi.rdSameNodePart(data["parts"][i]));
            }
        }
    },

    /**
     * 获取简略信息
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["groupId"] = this.groupId;
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
        data["pid"] = this.pid;
        data["groupId"] = this.groupId;
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

