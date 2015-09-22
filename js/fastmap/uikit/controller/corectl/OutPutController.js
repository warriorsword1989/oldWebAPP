/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class OutPutController
 */
    fastmap.uikit.OutPutController =  L.Class.extend({
        /**
         * 事件管理器
         * @property includes
         */
        includes: L.Mixin.Events,

        options: {
        },

        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
            this.outPuts = [];
            this.on("objectSaved",this.pushOutput,this);
        },

        /***
         * 添加output
         * @param {Object}output
         */
        pushOutput:function(output){
            this.outPuts.push(output);
        },

        /***
         * 顶端移除一个ouput
         * @param {Object}output
         */
        popOutput:function(output){
            this.outPuts.pop(output);
        },

        /***
         * 内容排序
         * @param sortfun
         */
        sort:function(sortfun){

        },

        /***
         * 移除指定的output
         * @param id
         */
        removeOutput:function(id){

        },

        /***
         * 清空
         */
        clear:function(){

        }
});

fastmap.uikit.outPutControllerSingleton=(function() {
    var instantiated;
    function init(options) {
        return new fastmap.uikit.OutPutController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();

fastmap.uikit.outPutController=function(options) {
    return new fastmap.uiKit.outPutControllerSingleton(options);
};