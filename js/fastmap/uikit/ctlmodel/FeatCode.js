/**
 * Created by liwanchong on 2015/9/9.
 * FeatCode对象
 * @namespace fast
 * @class FeatCode
 */

fastmap.FeatCode = L.Class.extend({
    /**
     * 构造函数
     * @class FeatCode
     * @constructor
     * @namespace fast
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options)
        this.type = "";
    },
    /**
     * 设置输出
     * @method setOutPut
     */
    setOutput: function () {

    }
})
