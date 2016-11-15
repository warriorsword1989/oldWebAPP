/**
 * Created by wuzhen on 2016/8/15.
 * Class RdVoiceGuideDetail 语音引详细信息表
 */

fastmap.dataApi.RdVoiceGuideDetail = fastmap.dataApi.GeoDataModel.extend({


    /** *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = 'RDVOICEGUIDEDETAIL';
        this.setAttributeData(data);
    },
    /**
     * 设置信息
     */
    setAttributeData: function (data) {
        this.pid = data.pid;
        this.voiceguidePid = data.voiceguidePid;
        this.outLinkPid = data.outLinkPid;
        this.guideCode = data.guideCode || 0;
        this.guideType = data.guideType || 0;
        this.processFlag = (data.processFlag === undefined || data.processFlag === '') ? 1 : data.processFlag;
        this.relationshipType = (data.relationshipType === undefined || data.relationshipType === '') ? 1 : data.relationshipType;
        this.rowId = data.rowId || null;

        this.vias = [];
        if (data.vias) {
            for (var i = 0, len = data.vias.length; i < len; i++) {
                this.vias.push(fastmap.dataApi.rdVoiceGuideVia(data.vias[i]));
            }
        }
    },

    /**
     * 获取简略信息
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.voiceguidePid = this.voiceguidePid;
        data.outLinkPid = this.outLinkPid;
        data.guideCode = this.guideCode;
        data.guideType = this.guideType;
        data.processFlag = this.processFlag;
        data.relationshipType = this.relationshipType;

        data.vias = [];
        if (this.vias) {
            for (var i = 0, len = this.vias.length; i < len; i++) {
                data.vias.push(this.vias[i].getIntegrate());
            }
        }
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 全量信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.voiceguidePid = this.voiceguidePid;
        data.outLinkPid = this.outLinkPid;
        data.guideCode = this.guideCode;
        data.guideType = this.guideType;
        data.processFlag = this.processFlag;
        data.relationshipType = this.relationshipType;

        data.vias = [];
        if (this.vias) {
            for (var i = 0, len = this.vias.length; i < len; i++) {
                data.vias.push(this.vias[i].getIntegrate());
            }
        }
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * 初始化函数
 * 其他可选参数
 * @returns {.dataApi.RdVoiceGuideDetail}
 */
fastmap.dataApi.rdVoiceGuideDetail = function (data, options) {
    return new fastmap.dataApi.RdVoiceGuideDetail(data, options);
};

