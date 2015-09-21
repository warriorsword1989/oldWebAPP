/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class ToolTip 鼠标滑动提示框
 */
    fastmap.uiKit.ToolTip =  L.Class.extend({
        /***
         *
         * @param options
         * options参数说明
         * outputContent：输出内容
         * style：输出样式
         */
        initialize: function (options){
            this.options = options || {};
            L.setOptions(this, options);
            this.outputContent = options.ouputContent;
            this.style = options.style;
        }
});
fastmap.uiKit.toolTip=function(options) {
    return new fastmap.uiKit.ToolTip(options);
};