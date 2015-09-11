/**
 * Created by wangtun on 2015/9/10.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.ObjectEditController = L.Class.extend({
        options: {
        },
        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
        },
        onOutput:function(IGeoData) {
            var controller =null;
            if(IGeoData==='RDLink')  {

            }

        },
        onRemove:function() {

        }
    })
});