/**
 * Created by chenxiao on 2016/5/3.
 * Class GeoDataModel GIS数据模型基类，继承于DataModel类
 * 继承后可重写相关的方法，一般要求重写geoLiveType属性，setAttributes、getSnapShot方法
 */
FM.dataApi.GeoDataModel = FM.dataApi.DataModel.extend({
    options: {},
    /***
     *
     * @param id
     * 模型类型
     */
    geoLiveType: "GLM",
    /***
     *
     * @param options
     */
    initialize: function(data, options) {
        if (options) {
            this.options = options || {};
            FM.setOptions(this, options);
        }
        this.setAttributes(data);
        this.originJson = this.getIntegrate();
    }
});