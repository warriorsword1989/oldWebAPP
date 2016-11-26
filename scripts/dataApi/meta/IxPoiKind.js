/**
 * Created by wangmingdong on 2016/4/29.
 */
FM.dataApi.IxPoiKind = FM.dataApi.DataModel.extend({
    dataModelType: 'IX_POI_KIND',

    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.id = data.id;
        this.mediumId = data.mediumId;
        this.kindName = data.kindName;
        this.kindCode = data.kindCode;
        this.dispOnLink = data.dispOnLink;
        this.chainFlag = data.chainFlag;
        this.level = data.level;
        this.extend = data.extend;
        this.parent = data.parent;
    },
    getIntegrate: function () {
        var ret = {};
        ret.id = this.id;
        ret.mediumId = this.mediumId;
        ret.kindName = this.kindName;
        ret.kindCode = this.kindCode;
        ret.dispOnLink = this.dispOnLink;
        ret.chainFlag = this.chainFlag;
        ret.level = this.level;
        ret.extend = this.extend;
        ret.parent = this.parent;
        return ret;
    }
});
