/**
 * Created by liuyang on 2016/6/29.
 */
fastmap.dataApi.ZoneLinkKind = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'ZONELINKKIND';
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function (data) {
        this.rowId = data.rowId;
        this.linkPid = data.linkPid;
        if (data.kind != 'undefied') {
            this.kind = data.kind;
        } else {
            this.kind = 1;
        }
        // this.kind = data.kind || 1;
        // this.form = data.form || 1;
        if (data.form != 'undefied') {
            this.form = data.form;
        } else {
            this.form = 1;
        }
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.rowId = this.rowId;
        data.linkPid = this.linkPid;
        data.kind = this.kind;
        data.form = this.form;
        return data;
    }

});

fastmap.dataApi.zoneLinkKind = function (data, options) {
    return new fastmap.dataApi.ZoneLinkKind(data, options);
};

