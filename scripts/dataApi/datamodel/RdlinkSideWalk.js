/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkSideWalk = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDLINKSIDEWALK";
        if(!data["linkPid"]){
            throw "form对象没有对应link"
        }
        else{
            this.id = data["linkPid"];
        }

        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.linkPid = data["linkPid"] || "";
        this.rowId= data["rowId"] || "";
        this.sidewalkLoc = data["sidewalkLoc"] || 0;
        this.dividerType = data["dividerType"] || 0;
        this.workDir = data["workDir"] || 0;
        this.processFlag = data["processFlag"] || 0;
        this.captureFlag= data["captureFlag"] || 0;
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
        data["sidewalkLoc"] = this.sidewalkLoc;
        data["dividerType"] = this.dividerType;
        data["workDir"] = this.workDir;
        data["processFlag"] = this.processFlag;
        data["captureFlag"] = this.captureFlag;
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
        data["sidewalkLoc"] = this.sidewalkLoc;
        data["dividerType"] = this.dividerType;
        data["workDir"] = this.workDir;
        data["processFlag"] = this.processFlag;
        data["captureFlag"] = this.captureFlag;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * linkSidewalk初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkSidewalk}
 */
fastmap.dataApi.rdLinkSideWalk = function (data, options) {
    return new fastmap.dataApi.RdLinkSideWalk(data, options);
}

