/**
 * Created by mali on 2016/7/27.
 */
fastmap.dataApi.LuFaceName = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'LUFACENAME';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.rowId = data.rowId;
        this.pid = data.pid;
        this.facePid = data.facePid;
        this.nameGroupid = data.nameGroupid || 1;
        this.langCode = data.langCode || 'CHI';
        this.name = data.name || '土地利用面名';
        this.phonetic = data.phonetic || 'Tu Di Li Yong Mian Ming';
        this.srcFlag = data.srcFlag || 0;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.facePid = this.facePid;
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
        data.name = this.name;
        data.phonetic = this.phonetic;
        data.srcFlag = this.srcFlag;
        data.rowId = this.rowId;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.facePid = this.facePid;
        data.nameGroupid = this.nameGroupid;
        data.langCode = this.langCode;
        data.name = this.name;
        data.phonetic = this.phonetic;
        data.srcFlag = this.srcFlag;
        data.rowId = this.rowId;
        return data;
    }
});

fastmap.dataApi.luFaceName = function (data, options) {
    return new fastmap.dataApi.LuFaceName(data, options);
};
