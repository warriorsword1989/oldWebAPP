/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkWalkStair = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKWALKSTAIR";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.stairLoc = data["stairLoc"] || 0;
        this.stairFlag = data["stairFlag"] || 0;
        this.workDir = data["workDir"] || 0;
        this.captureFlag = data["captureFlag"] || 0;
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
        data["stairLoc"] = this.stairLoc;
        data["stairFlag"] = this.stairFlag;
        data["workDir"] = this.workDir;
        data["captureFlag"] = this.captureFlag;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
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
        data["stairLoc"] = this.stairLoc;
        data["stairFlag"] = this.stairFlag;
        data["workDir"] = this.workDir;
        data["captureFlag"] = this.captureFlag;
        data["uRecord"] = this.uRecord;
        data["uFields"] = this.uFields;
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
fastmap.dataApi.rdLinkWalkStair = function (data, options) {
    return new fastmap.dataApi.RdLinkWalkStair(data, options);
}

