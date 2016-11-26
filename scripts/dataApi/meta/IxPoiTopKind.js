/**
 * Created by wangmingdong on 2016/4/29.
 */
FM.dataApi.IxPoiTopKind = FM.dataApi.DataModel.extend({
    dataModelType: 'IX_POI_TOP_KIND',

    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.id = data.id;
        this.code = data.code || 0;
        this.name = data.name;
    },
    getIntegrate: function () {
        var ret = {};
        ret.id = this.id;
        ret.code = this.code;
        ret.name = this.name;
        return ret;
    }
});
