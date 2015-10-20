/**
 * Created by zhongxiaoming on 2015/9/23.
 * Class OpVertexAdded
 */
fastmap.uikit.OpVertexAdded = L.Class.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this.final = this.options.final;
    },

    doOperation:function(){
        this.fire('VertexAdded',function(){});
    },

    unDoOperation:function(){}
});