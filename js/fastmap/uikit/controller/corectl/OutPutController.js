/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class OutPutController
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.OutPutController =  L.Class.extend({
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
});