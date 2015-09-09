/**
 * Created by zhongxiaoming on 2015/9/9.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.OutPut = L.Class.extend({
        initialize: function (options){
            this.options = options || {};
            L.setOptions(this, options);
            this.fontSize = this.options.fontSize || 14;
            this.fontCorlor = this.options.fontSize || 14;
            this.position = this.options.position ;
        }
    })
})