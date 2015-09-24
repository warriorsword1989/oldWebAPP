/**
 * Created by liwanchong on 2015/9/9.
 * 元素类型
 * @namespace fast
 * @class FeatCodeController 单例
 */


fastmap.uikit.FeatCodeController=(function() {
    var instantiated;
    function init(options) {
            var featCodeController = L.Class.extend({
            /**
             * 相关属性
             */
            options: {},
            /**
             * 构造函数
             * @class FeatCodeController
             * @constructor
             * @namespace  fastmap
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
            },
            /**
             * geometry代码的设置
             * @method setFeatCode
             * @param {String}featCode
             */
            setFeatCode: function (featCode) {

            }
        });
        return new featCodeController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();

