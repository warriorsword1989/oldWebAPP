/**
 * Created by wangtun on 2015/9/10.
 */

define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.ShapeEditorController = L.Class.extend({
        options: {

        },

        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
        },

        startEdit:function(geometry){
             this.onStartEdit(geometry);
        },

        stopEdit:function(geometry){
             this.onEndEdit(geometry);
        },
        saveEdit:function(geometry){
             this.onSaveEdit(geometry)
        },

        onStartEdit:function(geometry){

        },

        onEndEdit:function(geometry){

        },

        onSaveEdit:function(geometry){

        }
    })
});