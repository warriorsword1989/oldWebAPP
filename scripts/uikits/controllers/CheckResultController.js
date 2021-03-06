/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class CheckResultController
 */


fastmap.uikit.CheckResultController = (function () {
    var instantiated;
    function init(options) {
        var checkResultController = L.Class.extend({
            /**
             * 事件管理器
             * @property includes
             */
            includes: L.Mixin.Events,

            options: {
            },

            /** *
             *
             * @param {Object}options
             */
            initialize: function (options) {
                this.eventController = fastmap.uikit.EventController();
                this.options = options || {};
                L.setOptions(this, options);
                this.updateCheck = '';
            },

            /** *
             * 开始检查
             * @param {Object}checkObj 检查对象
             * @param {Function}callBack 回调函数
             */
            startCheck: function (checkObj, callBack) {

            },

            /** *
             * 获得检查结果
             */
            getCheckResult: function () {},
                /**
                 *
                 * @param obj
                 */
            setCheckResult: function (obj) {
                this.eventController.fire(this.eventController.eventTypes.CHEKCRESULT, { errorCheckData: obj }, this);
                this.errorCheckData = obj;
            },
            /** *
             * 忽略检查结果
             */
            ignore: function () {}


        });
        return new checkResultController(options);
    }
    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    };
}());

