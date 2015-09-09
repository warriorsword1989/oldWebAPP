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

        pushOutput:function(output){

        },

        popOutput:function(){

        }





    });
});