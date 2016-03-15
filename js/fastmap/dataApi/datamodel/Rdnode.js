/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.rdNode = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.id = data["nodePid"];
        this.geometry = data["geometry"];
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || "";
        this.kind = data["kind"] || 1;
        this.geometry = data["geometry"] || null;
        this.adasFlag = data["adasFlag"] || 2;
        this.editFlag = data["editFlag"] || 1;

        this.difGroupid = data["difGroupid"] || "";
        this.srcFlag = data["srcFlag"] || 6;
        this.digitalLevel = data["digitalLevel"] || 0;
        this.reserved = data["reserved"] || "";

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
        data["kind"] = this.kind;
        data["geometry"]  = this.geometry;
        data["adasFlag"] = this.adasFlag;
        data["editFlag"] = this.editFlag;
        data["difGroupId"] = this.difGroupId;
        data["srcFlag"] = this.srcFlag;
        data["digitalLevel"] = this.digitalLevel;
        data["reserved"]  = this.reserved;
        data["forms"]=this.forms;
        data["meshes"]=this.meshes;
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
        data["kind"] = this.kind;
        data["geometry"]  = this.geometry;
        data["adasFlag"] = this.adasFlag;
        data["editFlag"] = this.editFlag;
        data["difGroupId"] = this.difGroupId;
        data["srcFlag"] = this.srcFlag;
        data["digitalLevel"] = this.digitalLevel;
        data["reserved"]  = this.reserved;
        data["forms"]=this.forms;
        data["meshes"]=this.meshes;
        return data;
    }
});

/***
 * Rdnode初始化函数
 * @param id
 * @param point 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdnode = function (data, options) {
    return new fastmap.dataApi.rdNode(data, options);
}

