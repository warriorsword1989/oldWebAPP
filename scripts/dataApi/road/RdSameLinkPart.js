/**
 * Created by wuzhen on 2016/8/11.
 * Class RdSameLinkPart 同一线组成表
 */

fastmap.dataApi.RdSameLinkPart = fastmap.dataApi.GeoDataModel.extend({


    /** *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = 'RDSAMELINKPART';
        this.setAttributeData(data);
    },
    /**
     * 设置信息
     */
    setAttributeData: function (data) {
        this.groupId = data.groupId;
        this.linkPid = data.linkPid;
        this.tableName = data.tableName;
        this.rowId = data.rowId || null;
    },

    /**
     * 获取简略信息
     */
    getSnapShot: function () {
        var data = {};
        data.groupId = this.groupId;
        data.linkPid = this.linkPid;
        data.tableName = this.tableName;
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * RdSameLinkPart
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.groupId = this.groupId;
        data.linkPid = this.linkPid;
        data.tableName = this.tableName;
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * RdSameNode初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.RdSameLinkPart}
 */
fastmap.dataApi.rdSameLinkPart = function (data, options) {
    return new fastmap.dataApi.RdSameLinkPart(data, options);
};

