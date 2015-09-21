/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class ContentStyle 输出框中的输出样式
 */
    fastmap.uiKit.ContentStyle = L.Class.extend({
        /***
         *
         * @param options
         * options参数说明
         * fontSize：字号
         * fontColor：颜色
         * position：位置
         */
        initialize: function (options){
            this.options = options || {};
            L.setOptions(this, options);
            this.fontSize = this.options.fontSize || 14;
            this.fontCorlor = this.options.fontCorlor || 'black';
            this.position = this.options.position || null ;
        },

        /***
         * 设置字体颜色
         * @param fontCorlor
         */
        setFontCorlor:function(fontCorlor){
            this.fontCorlor = fontCorlor;
        },

        /***
         * 设置字体大小
         * @param fontSize
         */
        setFontSize:function(fontSize){
            this.fontSize = fontSize;
        },

        /***
         * 设置位置信息
         * @param position
         */
        setPosition:function(position){
            this.position = position;
        }
});
fastmap.uiKit.contentStyle=function(options) {
    return new fastmap.uiKit.ContentStyle(options);
};