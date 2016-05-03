/**
 * Created by chenxiao on 2016/5/3.
 * Class DataModel 数据模型基类
 * 继承后可重写相关的方法，一般要求重写dataModelType属性，setAttributes、getSnapShot方法
 */
FM.dataApi.DataModel = FM.Class.extend({
    /***
     *
     * @param id
     * 模型ID
     */
    _id: null,
    /***
     *
     * @param id
     * 模型类型
     */
    dataModelType: "DATA_MODEL",
    /***
     *
     * @param options
     */
    initialize: function(data) {
        this.setAttributes(data);
    },
    /*
     * 设置属性
     */
    setAttributes: function(data) {
        this.attributes = data;
    },
    /***
     * 设置对象完整信息
     * @param integrate
     */
    getIntegrate: function() {
        var ret = {};
        var that = this;
        for (var key in that) {
            if (that.hasOwnProperty(key) && key != "_initHooksCalled") {
                if (that[key] != null && typeof that[key] == 'object') {
                    if (that[key] instanceof FM.Class) {
                        ret[key] = that[key].getIntegrate();
                    } else if (FM.Util.isArray(that[key])) {
                        ret[key] = [];
                        for (var i = 0, n = that[key].length; i < n; i++) {
                            ret[key].push(FM.Util.clone(that[key][i]));
                        }
                    } else {
                        ret[key] = FM.Util.clone(that[key]);
                    }
                } else {
                    ret[key] = that[key];
                }
            }
        }
        return ret;
    },
    /***
     * 设置对象概要属性信息
     * @param snapshot
     */
    getSnapShot: function() {
        return this.getIntegrate();
    }
});