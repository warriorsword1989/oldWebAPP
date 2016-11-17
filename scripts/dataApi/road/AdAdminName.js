/**
 * Created by zhaohang on 2016/4/5.
 */
fastmap.dataApi.AdAdminName = fastmap.dataApi.GeoDataModel.extend({
    /*

     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        /* if (!data.regionId) {
            throw 'form对象没有对应link';
        } else {
            this.id = data.regionId;
        }*/
        this.geoLiveType = 'ADADMINNAME';
        this.setAttributeData(data);
    },
    /*
     * 返回参数赋值
     */
    setAttributeData: function (data) {
        this.pid = data.pid || 0;
        this.rowId = data.rowId || '';
        this.regionId = data.regionId || 0;
        this.nameId = data.nameId || 0;
        this.nameGroupid = data.nameGroupid || 1;
        this.langCode = data.langCode || 'CHI';
        this.nameClass = data.nameClass || 1;
        this.name = data.name || '名称';
        this.phonetic = data.phonetic || 'Ming Cheng';
        this.srcFlag = data.srcFlag || 0;
        this.geoLiveType = data.geoLiveType;
    },

    /*
     *获取的道路信息
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.regionId = this.regionId;
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
        data.nameClass = this.nameClass;
        data.name = this.name;
        data.phonetic = this.phonetic;
        data.srcFlag = this.srcFlag;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.regionId = this.regionId;
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
        data.nameClass = this.nameClass;
        data.name = this.name;
        data.phonetic = this.phonetic;
        data.srcFlag = this.srcFlag;
        data.geoLiveType = this.geoLiveType;
        return data;
    }

});

fastmap.dataApi.adAdminName = function (data, options) {
    return new fastmap.dataApi.AdAdminName(data, options);
};
