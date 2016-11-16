/**
 * Created by linglong on 2015/11/10.
 * Class Rdnode
 */

fastmap.dataApi.RdRestrictionVias = fastmap.dataApi.GeoDataModel.extend({
    /** *
     *
     * @param data data
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'RDRESTRICTIONVIA';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data.pid || 0;
        this.linkPid = data.linkPid;
        this.groupId = data.groupId || 1;
        this.seqNum = data.seqNum || 1;
        this.rowId = data.rowId || null;
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.linkPid = this.linkPid;
        data.groupId = this.groupId;
        data.seqNum = this.seqNum;
        data.rowId = this.rowId;
        return data;
    },

    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.linkPid = this.linkPid;
        data.groupId = this.groupId;
        data.seqNum = this.seqNum;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * rdRestriction
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdRestriction}
 */
fastmap.dataApi.rdRestrictionVias = function (data, options) {
    return new fastmap.dataApi.RdRestrictionVias(data, options);
};
