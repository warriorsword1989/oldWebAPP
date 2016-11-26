/**
 * Created by liuyang on 2016/4/29.
 */
FM.dataApi.IxPoiBrand = FM.dataApi.DataModel.extend({
    dataModelType: 'IX_POIBRAND',
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.category = data.category || 0;
        this.chainCode = data.chainCode || null;
        this.chainName = data.chainName || null;
        this.weight = data.weight || 0;
        this.level = data.level;
    },
    getIntegrate: function () {
        var ret = {};
        ret.category = this.category;
        ret.chainCode = this.chainCode;
        ret.chainName = this.chainName;
        ret.weight = this.weight;
        ret.level = this.level;
        return ret;
    }
});
