/**
 * Created by wangmingdong on 2016/11/22.
 */
fastmap.dataApi.RdTmcLocationLink = fastmap.dataApi.GeoDataModel.extend({
    /**
     * 初始化
     * @param data
     * @param options
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'RD_TMCLOCATION_LINK';
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function (data) {
        this.groupId = data.groupId;
        this.linkPid = data.linkPid;
        this.locDirect = data.locDirect || 0;
        this.rowId = data.rowId;
        this.direct = data.direct || 0;
        // this.geometry = data.geometry || null;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.groupId = this.groupId;
        data.linkPid = this.linkPid;
        data.locDirect = this.locDirect;
        data.rowId = this.rowId;
        data.direct = this.direct;
        // data.geometry = this.geometry;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.groupId = this.groupId;
        data.linkPid = this.linkPid;
        data.locDirect = this.locDirect;
        data.rowId = this.rowId;
        data.direct = this.direct;
        // data.geometry = this.geometry;
        return data;
    }

});

fastmap.dataApi.rdTmcLocationLink = function (data, options) {
    return new fastmap.dataApi.RdTmcLocationLink(data, options);
};

