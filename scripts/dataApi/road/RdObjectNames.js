/**
 * Created by liuyang on 2015/9/9.
 * Class RdObjectNames
 */

fastmap.dataApi.RdObjectNames = fastmap.dataApi.GeoDataModel.extend({
    /** *
     *
     * @param data 初始化属性对象
     */
    initialize: function (data) {
        this.geoLiveType = 'RDOBJECTNAME';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.nameId = data.nameId || 0;
        this.pid = data.pid || 0;
        this.nameGroupid = data.nameGroupid || 1;
        this.langCode = data.langCode || 'CHI';
        this.name = data.name || '名称';
        this.phonetic = data.phonetic || 'Ming Cheng';
        this.srcFlag = data.srcFlag || 0;
        this.rowId = data.rowId || '';
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
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
        data.name = this.name;
        data.phonetic = this.phonetic;
        data.srcFlag = this.srcFlag;
        data.geoLiveType = this.geoLiveType;
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
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
        data.name = this.name;
        data.phonetic = this.phonetic;
        data.srcFlag = this.srcFlag;
        data.geoLiveType = this.geoLiveType;
        data.rowId = this.rowId;
        return data;
    }
});

/** *
 * linkLimit初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.linkLimit}
 */
fastmap.dataApi.rdObjectNames = function (data, options) {
    return new fastmap.dataApi.RdObjectNames(data, options);
};

