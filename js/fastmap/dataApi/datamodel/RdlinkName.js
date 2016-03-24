/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.linkName = fastmap.dataApi.GeoDataModel.extend({
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
        this.nameGroupid = data["nameGroupid"] || 0;
        this.seqNum = data["seqNum"] || 1;
        this.name = data["name"] || "";
        this.nameClass = data["nameClass"] || 1;
        this.inputTime = data["inputTime"] || "";
        this.nameType = data["nameType"] || 0;
        this.srcFlag = data["srcFlag"] || 9;
        this.routeAtt = data["routeAtt"] || 0;
        this.code = data["code"] || 0;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["linkPid"] = this.linkPid || "";
        data["rowId"] = this.rowId|| "";
        data["nameGroupid"] = this.nameGroupid  || 0;
        data["name"] = this.name || "";
        data["seqNum"] = this.seqNum || 1;
        data["nameClass"] = this.nameClass || 1;
        data["inputTime"] = this.inputTime || "";
        data["nameType"] = this.nameType || 0;
        data["srcFlag"]= this.srcFlag || 9;
        data["routeAtt"] = this.routeAtt  || 0;
        data["code"]  = this.code || 0;
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
        data["linkPid"] = this.linkPid || "";
        data["rowId"] = this.rowId|| "";
        data["nameGroupid"] = this.nameGroupid  || 0;
        data["name"] = this.name || "";
        data["seqNum"] = this.seqNum || 1;
        data["nameClass"] = this.nameClass || 1;
        data["inputTime"] = this.inputTime || "";
        data["nameType"] = this.nameType || 0;
        data["srcFlag"]= this.srcFlag || 9;
        data["routeAtt"] = this.routeAtt  || 0;
        data["code"]  = this.code || 0;
        return data;
    }
});

/***
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.linkname = function (data, options) {
    return new fastmap.dataApi.linkName(data, options);
}

