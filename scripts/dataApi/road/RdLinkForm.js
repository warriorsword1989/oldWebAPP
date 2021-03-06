/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */
fastmap.dataApi.RdLinkForm = fastmap.dataApi.GeoDataModel.extend({
    /** *
     *
     * @param data 初始化属性对象
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'RDLINKFORM';
        if (!data.linkPid) {
            throw 'form对象没有对应link';
        } else {
            this.id = data.linkPid;
        }
        this.setAttributeData(data);
    },
    setAttributeData: function (data) {
        this.linkPid = data.linkPid || '';
        this.rowId = data.rowId || '';
        this.formOfWay = data.formOfWay;
        if (this.formOfWay == undefined || this.formOfWay == null) {
            this.formOfWay = 1;
        }
        this.extendedForm = data.extendedForm || 0;
        this.auxiFlag = data.auxiFlag || 0;
        this.kgFlag = data.kgFlag || 0;
        this.status = true;
    },
    /**
     * 获取Node简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.linkPid = this.linkPid;
        data.rowId = this.rowId;
        data.formOfWay = this.formOfWay;
        data.extendedForm = this.extendedForm;
        data.auxiFlag = this.auxiFlag;
        data.kgFlag = this.kgFlag;
        data.geoLiveType = this.geoLiveType;
        return data;
    },
    /**
     * 获取Node详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.linkPid = this.linkPid;
        data.rowId = this.rowId;
        data.formOfWay = this.formOfWay;
        data.extendedForm = this.extendedForm;
        data.auxiFlag = this.auxiFlag;
        data.kgFlag = this.kgFlag;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});
/** *
 * linkform初始化函数
 * @param data 初始化rdnode的点
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdLinkForm = function (data, options) {
    return new fastmap.dataApi.RdLinkForm(data, options);
};
