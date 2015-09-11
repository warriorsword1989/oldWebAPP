/**
 * Created by zhongxiaoming on 2015/9/9.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.OutPut = L.Class.extend({
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
});