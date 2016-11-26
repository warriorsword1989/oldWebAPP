/**
 * Created by wangmingdong on 2016/4/29.
 */
FM.dataApi.IxPoiMediumKind = FM.dataApi.DataModel.extend({
    dataModelType: 'IX_POI_MEDIUM_KIND',

    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.id = data.id;
        this.code = data.code;
        this.name = data.name;
        this.topId = data.topId;
    },
    getIntegrate: function () {
        var ret = {};
        ret.id = this.id;
        ret.code = this.code;
        ret.name = this.name;
        ret.topId = this.topId;
        return ret;
    }
});
