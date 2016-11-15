/**
 * Created by wangmingdong on 2016/8/8.
 * Class Rdnode
 */

fastmap.dataApi.RdSe = fastmap.dataApi.GeoDataModel.extend({


    /** *
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = 'RDSE';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data.pid || '';
        this.nodePid = data.nodePid;
        this.inLinkPid = data.inLinkPid;
        this.outLinkPid = data.outLinkPid;
        this.uFields = data.uFields;
        this.uDate = data.uDate || null;
        this.rowId = data.rowId || null;
        this.uRecord = data.uRecord || 0;
    },

    /**
     * 获取RdSe简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.nodePid = this.nodePid;
        data.inLinkPid = this.inLinkPid;
        data.outLinkPid = this.outLinkPid;
        data.uFields = this.uFields;
        data.uDate = this.uDate;
        data.rowId = this.rowId;
        data.uRecord = this.uRecord;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdSe详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.nodePid = this.nodePid;
        data.inLinkPid = this.inLinkPid;
        data.outLinkPid = this.outLinkPid;
        data.uFields = this.uFields;
        data.uDate = this.uDate;
        data.rowId = this.rowId;
        data.uRecord = this.uRecord;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * RdSe初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdSe = function (data, options) {
    return new fastmap.dataApi.RdSe(data, options);
};

