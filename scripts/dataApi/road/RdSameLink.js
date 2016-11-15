/**
 * Created by wuzhen on 2016/8/11.
 * Class RdSameLink 同一线
 */

fastmap.dataApi.RdSameLink = fastmap.dataApi.GeoDataModel.extend({


    /** *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = 'RDSAMELINK';
        this.setAttributeData(data);
    },
    /**
     * 设置信息
     */
    setAttributeData: function (data) {
        this.pid = data.pid;
        this.groupId = data.groupId;
        this.rowId = data.rowId || null;

        this.parts = [];
        if (data.parts) {
            for (var i = 0, len = data.parts.length; i < len; i++) {
                this.parts.push(fastmap.dataApi.rdSameLinkPart(data.parts[i]));
            }
        }
    },

    /**
     * 获取简略信息
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.groupId = this.groupId;

        data.parts = [];
        if (this.parts) {
            for (var i = 0, len = this.parts.length; i < len; i++) {
                data.parts.push(this.parts[i].getIntegrate());
            }
        }

        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdDirectRoute详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.groupId = this.groupId;
        data.parts = [];
        if (this.parts) {
            for (var i = 0, len = this.parts.length; i < len; i++) {
                data.parts.push(this.parts[i].getIntegrate());
            }
        }
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

/** *
 * RdSameLink初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.RdSameLink}
 */
fastmap.dataApi.rdSameLink = function (data, options) {
    return new fastmap.dataApi.RdSameLink(data, options);
};

