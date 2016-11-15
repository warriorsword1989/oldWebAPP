/**
 * Created by wuzhen on 2016/8/15.
 * Class RdVoiceGuideVia 语音引导经过线表
 */

fastmap.dataApi.RdVoiceGuideVia = fastmap.dataApi.GeoDataModel.extend({


    /** *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = 'RDVOICEGUIDEVIA';
        this.setAttributeData(data);
    },
    /**
     * 设置信息
     */
    setAttributeData: function (data) {
        this.detailId = data.detailId;
        this.linkPid = data.linkPid;
        this.groupId = (data.groupId === undefined || data.groupId === '') ? 1 : data.groupId;
        this.seqNum = (data.seqNum === undefined || data.seqNum === '') ? 1 : data.seqNum;
        this.rowId = data.rowId || null;
    },

    /**
     * 获取简略信息
     */
    getSnapShot: function () {
        var data = {};
        data.detailId = this.detailId;
        data.linkPid = this.linkPid;
        data.groupId = this.groupId;
        data.seqNum = this.seqNum;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 全量信息
     */
    getIntegrate: function () {
        var data = {};
        data.detailId = this.detailId;
        data.linkPid = this.linkPid;
        data.groupId = this.groupId;
        data.seqNum = this.seqNum;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * 初始化函数
 * 其他可选参数
 * @returns {.dataApi.RdVoiceGuideVia}
 */
fastmap.dataApi.rdVoiceGuideVia = function (data, options) {
    return new fastmap.dataApi.RdVoiceGuideVia(data, options);
};

