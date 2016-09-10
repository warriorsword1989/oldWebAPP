/**
 * Created by wangmingdong on 2016/8/9.
 * Class Rdnode
 */

fastmap.dataApi.RdTollgateName = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDTOLLGATENAME";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || 0;
        this.nameId = data["nameId"] || 0;
        this.nameGroupid = data["nameGroupid"] || 1;
        this.langCode = data["langCode"] || 'CHI';
        this.name = data["name"] || '收费站';
        this.phonetic = data["phonetic"] || 'Shou Fei Zhan';
        this.rowId = data["rowId"] || null;
    },

    /**
     * 获取RdTollgateName简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["nameId"] = this.nameId;
        data["nameGroupid"]  = this.nameGroupid;
        data["langCode"]  = this.langCode;
        data["name"]  = this.name;
        data["phonetic"]  = this.phonetic;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdTollgateName详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["nameId"] = this.nameId;
        data["nameGroupid"]  = this.nameGroupid;
        data["langCode"]  = this.langCode;
        data["name"]  = this.name;
        data["phonetic"]  = this.phonetic;
        data["rowId"] = this.rowId;
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * RdTollgateName初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdTollgateName = function (data, options) {
    return new fastmap.dataApi.RdTollgateName(data, options);
}
