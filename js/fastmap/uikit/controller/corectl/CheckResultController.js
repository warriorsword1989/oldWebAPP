/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class CheckResultController
 */
    fastmap.uikit.CheckResultController = L.Class.extend({
        /**
         * 事件管理器
         * @property includes
         */
        includes: L.Mixin.Events,

        options: {
        },

        /***
         *
         * @param {Object}options
         */
        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
            this.on("objectSaved",this.startCheck,this);
        },

        /***
         * 开始检查
         * @param {Object}checkObj 检查对象
         * @param {Function}callBack 回调函数
         */
        startCheck:function(checkObj,callBack){

        },

        /***
         * 获得检查结果
         */
        getCheckResult:function(){},

        /***
         * 忽略检查结果
         */
        ignore:function(){}


});

fastmap.uikit.checkResultControllerSingleton=(function() {
    var instantiated;
    function init(options) {
        return new fastmap.uikit.CheckResultController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();

fastmap.uikit.checkResultController=function(options) {
    return new fastmap.uikit.checkResultControllerSingleton(options);
}