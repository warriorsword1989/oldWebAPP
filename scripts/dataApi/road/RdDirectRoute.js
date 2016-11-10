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
        if(data["flag"] == undefined){
            this.flag = 2;
        } else {
            this.flag = data["flag"];
        }
        if(data["processFlag"] == undefined){
            this.processFlag = 1;
        } else {
            this.processFlag = data["processFlag"];
        }
        this.vias = [];
        for(var i=0;i<data["vias"].length;i++){
            var via = fastmap.dataApi.rdDirectRouteVia(data["vias"][i]);
            this.vias.push(via);
        }
        this.relationshipType = data["relationshipType"] || 1;
        this.uRecord = data["uRecord"] || 0;
        this.uFields = data["uFields"] || null;
    },

    /**
     * 获取RdDirectRoute简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = parseInt(this.pid);
        data["nodePid"] = parseInt(this.nodePid);
        data["inLinkPid"]  = parseInt(this.inLinkPid);
        data["outLinkPid"] = parseInt(this.outLinkPid);
        data["flag"] = parseInt(this.flag);
        data["processFlag"] = parseInt(this.processFlag);
        data["relationshipType"] = parseInt(this.relationshipType);
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
        data["pid"] = parseInt(this.pid);
        data["nodePid"] = parseInt(this.nodePid);
        data["inLinkPid"]  = parseInt(this.inLinkPid);
        data["outLinkPid"] = parseInt(this.outLinkPid);
        data["flag"] = parseInt(this.flag);
        data["processFlag"] = parseInt(this.processFlag);
        data["relationshipType"] = parseInt(this.relationshipType);
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

