/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class CheckResult
 * 检查结果
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.CheckResult = L.Class.extend({
        /***
         *
         * @param options
         * options参数说明：
         * pid：检查结果id
         * contentStyle：输出样式
         */
        initialize: function (options){
            this.options = options || {};
            L.setOptions(this, options);
            this.pid = this.options.pid || null;
            this.content =this.options.pid || '';
            this.contentStyle = this.options.contentStyle || null;
        }


    });
});