/**
 * Created by wangmingdong on 2016/7/20.
 * Class Rdnode
 */

fastmap.dataApi.RdTrafficSignal = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDTRAFFICSIGNAL";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || "";
        this.nodePid = data["nodePid"];
        this.linkPid = data["linkPid"];
        this.location = data["location"];
        this.flag = data["flag"] || 0;
        this.rowId = data["rowId"] || 0;

        this.type = data["type"] || 0;
        this.kgFlag = data["kgFlag"] || 0;
        this.uRecord = data["uRecord"] || 0;
    },

    /**
     * 获取RdTrafficSignal简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["nodePid"] = this.nodePid;
        data["linkPid"]  = this.linkPid;
        data["location"] = this.location;
        data["flag"] = this.flag;
        data["rowId"] = this.rowId;
        data["type"] = this.type;
        data["kgFlag"] = this.kgFlag;
        data["uRecord"] = this.uRecord;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdTrafficSignal详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["nodePid"] = this.nodePid;
        data["linkPid"]  = this.linkPid;
        data["location"] = this.location;
        data["flag"] = this.flag;
        data["rowId"] = this.rowId;
        data["type"] = this.type;
        data["kgFlag"] = this.kgFlag;
        data["uRecord"] = this.uRecord;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * RdTrafficSignal初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdTrafficSignal = function (data, options) {
    return new fastmap.dataApi.RdTrafficSignal(data, options);
}

