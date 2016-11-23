/**
 * Created by wangmingdong on 2016/11/22.
 */
fastmap.dataApi.RdTmcLocation = fastmap.dataApi.GeoDataModel.extend({
    /**
     * 初始化
     * @param data
     * @param options
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'RD_TMCLOCATION';
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function (data) {
        this.pid = data.pid;
        this.tmcId = data.tmcId || 0;
        this.loctableId = data.loctableId || 0;
        this.rowId = data.rowId;
        this.links = [];
        if (data.links && data.links.length > 0) {
            for (var i = 0; i < data.links.length; i++) {
                var link = fastmap.dataApi.rdTmcLocationLink(data.links[i]);
                this.links.push(link);
            }
        }
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.tmcId = this.tmcId;
        data.loctableId = this.loctableId;
        data.rowId = this.rowId;
        data.links = [];
        for (var i = 0; i < this.links.length; i++) {
            data.links.push(this.links[i].getIntegrate());
        }
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.tmcId = this.tmcId;
        data.loctableId = this.loctableId;
        data.rowId = this.rowId;
        data.links = [];
        for (var i = 0; i < this.links.length; i++) {
            data.links.push(this.links[i].getIntegrate());
        }
        return data;
    }

});

fastmap.dataApi.rdTmcLocation = function (data, options) {
    return new fastmap.dataApi.RdTmcLocation(data, options);
};

