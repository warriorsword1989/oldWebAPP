/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.RdLinkRtic = fastmap.dataApi.GeoDataModel.extend({
    /** *
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'RDLINKRTIC';
        if (!data.linkPid) {
            throw 'form对象没有对应link';
        }

        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.linkPid = data.linkPid || '';
        this.rowId = data.rowId || '';
        this.code = data.code || 0;
        this.rank = data.rank || 0;
        this.rticDir = data.rticDir || 0;
        this.updownFlag = data.updownFlag || 0;
        this.rangeType = data.rangeType || 0;
        this.uRecord = data.uRecord || 0;
        this.uFields = data.uFields || '';
    },

    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.linkPid = this.linkPid;
        data.rowId = this.rowId;
        data.code = this.code;
        data.rank = this.rank;
        data.rticDir = this.rticDir;
        data.updownFlag = this.updownFlag;
        data.rangeType = this.rangeType;
        data.geoLiveType = this.geoLiveType;
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
        data.linkPid = this.linkPid;
        data.rowId = this.rowId;
        data.code = this.code;
        data.rank = this.rank;
        data.rticDir = this.rticDir;
        data.updownFlag = this.updownFlag;
        data.rangeType = this.rangeType;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * linkrtic初始化函数
 * @param data 初始化属性对象
 * @param options 其他可选参数
 * @returns {.dataApi.linkRtic}
 */
fastmap.dataApi.rdLinkRtic = function (data, options) {
    return new fastmap.dataApi.RdLinkRtic(data, options);
};

