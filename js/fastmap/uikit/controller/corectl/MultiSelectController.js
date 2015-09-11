/**
 * Created by wangtun on 2015/9/10.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.MultiSelectController = L.Class.extend({
        options: {
        },
        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
            this.outPuts = [];
        },
        pushOutput:function(output){
            this.outPuts.push(output);
        },

        popOutput:function(output){
            this.outPuts.pop(output);
        },
        clear:function() {

        }
    })
});