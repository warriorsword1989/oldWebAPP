/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkLimit = fastmap.dataApi.GeoDataModel.extend({

    /***
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
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
        this.type = data["type"] || 3;
        this.limitDir = data["limitDir"] || 0;
        this.timeDomain = data["timeDomain"] || "";
        this.vehicle = data["vehicle"] || 0;
        this.tollType= data["tollType"] || 9;
        this.weather = data["weather"] || 9;
        this.inputTime = data["inputTime"] || "";
        this.processFlag = data["processFlag"] || 0;
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
        data["type"] = this.type;
        data["limitDir"] = this.limitDir;
        data["timeDomain"]  = this.timeDomain;
        data["vehicle"] = this.vehicle;
        data["tollType"] = this.tollType;
        data["weather"] = this.weather;
        data["inputTime"]  = this.inputTime;
        data["processFlag"] = this.processFlag;
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
        data["type"] = this.type;
        data["limitDir"] = this.limitDir;
        data["timeDomain"]  = this.timeDomain;
        data["vehicle"] = this.vehicle;
        data["tollType"] = this.tollType;
        data["weather"] = this.weather;
        data["inputTime"]  = this.inputTime;
        data["processFlag"] = this.processFlag;
        return data;
    }
});

/***
 * linkLimit初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.rdLinkLimit = function (data, options) {
    return new fastmap.dataApi.RdLinkLimit(data, options);
};

