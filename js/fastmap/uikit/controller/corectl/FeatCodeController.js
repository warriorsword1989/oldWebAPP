/**
 * Created by liwanchong on 2015/9/9.
 * 元素类型
 * @namespace fast
 * @class featCodeController
 */
define(['js/fastmap/fastmap'],function(fastmap) {
    fastmap.featCodeController= L.Class.extend({
        /**
         * 相关属性
         */
        options:{

        },
        /**
         * 构造函数
         * @class featCodeController
         * @constructor
         * @namespace  fastmap
         */
        initialize:function() {
            this.options = options || {};
            L.setOptions(this, options);
        },
        /**
         * geometry代码的设置
         * @method setFeatCode
         * @param {String}featCode
         */
        setFeatCode:function(featCode) {

        }
    })
})