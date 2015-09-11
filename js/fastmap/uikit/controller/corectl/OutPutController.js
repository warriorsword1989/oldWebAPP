/**
 * Created by zhongxiaoming on 2015/9/9.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.OutPutController =  L.Class.extend({
        options: {
        },

        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
            this.outPuts = [];
        },

        /***
         * 添加output
         * @param output
         */
        pushOutput:function(output){
            this.outPuts.push(output);
        },

        /***
         * 顶端移除一个ouput
         * @param output
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