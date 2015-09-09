/**
 * Created by zhongxiaoming on 2015/9/9.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.CheckResult = L.Class.extend({
        initialize: function (options){
            this.options = options || {};
            L.setOptions(this, options);
        }
    });
});