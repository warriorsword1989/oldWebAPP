/**
 * Created by liwanchong on 2015/9/9.
 * DataTips
 * @namespace fast
 * @class DataTips
 */
define(['js/fastmap/fastmap'],function(fastmap) {
    fastmap.DataTips = L.Class.extend({
        /**
         * 相关属性
         */
        options: {
        },
        /**
         * 构造函数
         * @class DataTips
         * @constructor
         * @namespace  fastmap
         * @param id
         * @param type
         * @param geometry
         * @param options
         */
        initialize: function (id,type,geometry,options) {
            this.options = options || {};

            L.setOptions(this, options);
            this.style = options.style;
            this.geometry = geometry;
            this.icon = null;
            this.id = id;
            this.type = type;
            this.source = null;
            this.deep = null;

        },
        /**
         * 获取元素的坐标或者是系列坐标
         * @method setCoordinates
         * @param coordinates
         */
        setCoordinates: function (coordinates) {
            this.options = coordinates;
        },
        /**
         * 移除dataTip
         * @method remove
         */
        remove: function () {

        },
        /**
         * 设置输出DataTips
         * @method setOutPut
         */
        setOutput:function() {

        }



    });
})