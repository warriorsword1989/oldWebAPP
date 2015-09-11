/**
 * Created by wangtun on 2015/9/10.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.ObjectEditController = L.Class.extend({
        options: {},
        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
            this.data = "";
            this.originalData = null;
        },
        save:function() {
            this.onSaved(this.originalData, this.data);
        },
        getChanged:function() {

        },
        setCurrentObject:function(obj) {
            this.data = obj;
        },
        onRemove: function () {

        },
        onSaved:function(orignalData,data) {
        }
    })
});