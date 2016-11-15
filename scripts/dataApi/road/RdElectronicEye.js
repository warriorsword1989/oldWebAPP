/**
 * Created by wangmingdong on 2016/7/22.
 * Class Rdnode
 */

fastmap.dataApi.RdElectronicEye = fastmap.dataApi.GeoDataModel.extend({


    /** *
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = 'RDELECTRONICEYE';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data.pid || '';
        this.direct = data.direct || 0;
        this.linkPid = data.linkPid;
        this.location = data.location || 0;
        this.kind = data.kind || 0;
        this.rowId = data.rowId || null;
        this.angle = data.angle || 0;
        this.speedLimit = data.speedLimit || 0;
        this.verifiedFlag = data.verifiedFlag || 0;
        this.meshId = data.meshId || 0;
        this.geometry = data.geometry;
        this.srcFlag = data.srcFlag || 1;
        this.creationDate = data.creationDate || null;
        this.highViolation = data.highViolation || 0;
        this.uFields = data.uFields || null;
        this.uRecord = data.uRecord || 0;
        this.uDate = data.uDate || null;
        this.pairs = data.pairs || [];
        this.parts = data.parts || [];
    },

    /**
     * 获取RdElectronicEye简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.direct = this.direct;
        data.linkPid = this.linkPid;
        data.location = this.location;
        data.kind = this.kind;
        data.rowId = this.rowId;
        data.angle = this.angle;
        data.speedLimit = this.speedLimit;
        data.verifiedFlag = this.verifiedFlag;
        data.meshId = this.meshId;
        data.geometry = this.geometry;
        data.srcFlag = this.srcFlag;
        data.creationDate = this.creationDate;
        data.highViolation = this.highViolation;
        data.uFields = this.uFields;
        data.uRecord = this.uRecord;
        data.uDate = this.uDate;
        data.pairs = this.pairs;
        data.parts = this.parts;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdElectronicEye详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.direct = this.direct;
        data.linkPid = this.linkPid;
        data.location = this.location;
        data.kind = this.kind;
        data.rowId = this.rowId;
        data.angle = this.angle;
        data.speedLimit = this.speedLimit;
        data.verifiedFlag = this.verifiedFlag;
        data.meshId = this.meshId;
        data.geometry = this.geometry;
        data.srcFlag = this.srcFlag;
        data.creationDate = this.creationDate;
        data.highViolation = this.highViolation;
        data.uFields = this.uFields;
        data.uRecord = this.uRecord;
        data.uDate = this.uDate;
        data.pairs = this.pairs;
        data.parts = this.parts;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * RdElectronicEye初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdElectronicEye = function (data, options) {
    return new fastmap.dataApi.RdElectronicEye(data, options);
};

