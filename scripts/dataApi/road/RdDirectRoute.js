/**
 * Created by wangmingdong on 2016/8/4.
 * Class Rdnode
 */

fastmap.dataApi.RdDirectRoute = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDDIRECTROUTE";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || "";
        this.nodePid = data["nodePid"];
        this.inLinkPid = data["inLinkPid"];
        this.outLinkPid = data["outLinkPid"];
        if(data["flag"] == ''){
            this.flag = 2;
        } else {
            this.flag = data["flag"];
        }
        if(data["processFlag"] == ''){
            this.processFlag = 1;
        } else {
            this.processFlag = data["processFlag"];
        }

        this.relationshipType = data["relationshipType"] || 1;
        this.uRecord = data["uRecord"] || 0;
        this.uFields = data["uFields"] || null;
        this.vias = new fastmap.dataApi.rdDirectRouteVia(data['vias']);
    },

    /**
     * 获取RdDirectRoute简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["nodePid"] = this.nodePid;
        data["inLinkPid"]  = this.inLinkPid;
        data["outLinkPid"] = this.outLinkPid;
        data["flag"] = this.flag;
        data["processFlag"] = this.processFlag;
        data["relationshipType"] = this.relationshipType;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["vias"] = this.vias;
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
        data["nodePid"] = this.nodePid;
        data["inLinkPid"]  = this.inLinkPid;
        data["outLinkPid"] = this.outLinkPid;
        data["flag"] = this.flag;
        data["processFlag"] = this.processFlag;
        data["relationshipType"] = this.relationshipType;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
        data["vias"] = this.vias;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * RdDirectRoute初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdDirectRoute = function (data, options) {
    return new fastmap.dataApi.RdDirectRoute(data, options);
}

