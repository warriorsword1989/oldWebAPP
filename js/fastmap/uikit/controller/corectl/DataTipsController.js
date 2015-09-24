/**
 * Created by liwanchong on 2015/9/9.
 * 操作dataTip
 * @namespace fastmap
 * @class DataTipsController 单例
 */

fastmap.uikit.DataTipsController=(function() {
    var instantiated;
    function init() {

        var dataTipsController = L.Class.extend({
            /**
             *相关属性
             */
            options: {},
            /**
             *构造函数
             * @class DataTipsController
             * @constructor
             * @namespace  fastmap
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
            },
            /**
             * 转换数据
             * @method toDataMode
             */
            toDataMode: function () {

            },
            /**
             * 复制数据
             * @method copy
             */
            copy: function () {

            },
            /**
             * 关闭窗口
             * @method close
             */
            close: function () {

            }
        });


        return new dataTipsController();
    }
    return function() {
        if (!instantiated) {
            instantiated = init();
        }
        return instantiated;
    }
})();



