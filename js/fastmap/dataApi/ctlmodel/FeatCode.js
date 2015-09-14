/**
 * Created by liwanchong on 2015/9/9.
 * FeatCode对象
 * @namespace fast
 * @class FeatCode
 */
define(['js/fastmap/fastmap'],function(fastmap) {
    fastmap.FeatCode= L.Class.extend({
        /**
         * 构造函数
         * @class FeatCode
         * @constructor
         * @namespace fast
         * @param options
         */
        initialize:function(options) {
            this.options = options || {};
            L.setOptions(this,options)
            this.type = "";
        },
        /**
         * 设置输出
         * @method setOutPut
         */
        setOutput:function() {

        }
    })
})