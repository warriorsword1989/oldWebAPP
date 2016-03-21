/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.rdRestrictionDetail = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        if(!data["pid"]){
            throw "对象没有对应pid"
        }
        this.setAttributeData(data);
    },

    setAttributeData:function(data){

        this.pid = data["pid"] || null;
        this.restricPid = data["restricPid"] || null;
        this.outLinkPid = data["outLinkPid"] || null;
        this.flag = data["flag"] || 2;
        this.restricInfo = data["restricInfo"] ||0;
        this.type = data["type"] || 1;
        this.relationshipType = data["relationshipType"] || 1;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["restricPid"] = this.restricPid;
        data["outLinkPid"] = this.outLinkPid;
        data["flag"] = this.flag;
        data["restricInfo"] = this.restricInfo;
        data["type"] = this.type;
        data["relationshipType"] = this.relationshipType;
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
        data["pid"] = this.pid;
        data["restricPid"] = this.restricPid;
        data["outLinkPid"] = this.outLinkPid;
        data["flag"] = this.flag;
        data["restricInfo"] = this.restricInfo;
        data["type"] = this.type;
        data["relationshipType"] = this.relationshipType;
        return data;
    }
});

/***
 * rdRestriction
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
fastmap.dataApi.rdrestrictiondetail = function (data, options) {
    return new fastmap.dataApi.rdRestrictionDetail(data, options);
}