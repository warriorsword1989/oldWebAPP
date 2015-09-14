/**
 * Created by wangtun on 2015/9/10.
 * 保存选取的元素
 * @namespace fastmap.uikit
 * @class SelectController
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.SelectController = L.Class.extend({
        /**
         * 相关属性
         */
        options: {
        },
        /**
         * 构造函数
         * @class SelectController
         * @constructor
         * @param {Object}options
         */
        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
            this.selectedFeatures = null;

        },
        /**
         * 根据属性获取元素
         * @method selectByAttribute
         */
        selectByAttribute:function() {
            var features=[];
            this.onSelected(features);
        },
        /**
         *框选、圆选获取元素
         * @selectByGeometry
         * @param {Geometry}geometry
         */
        selectByGeometry:function(geometry) {
            this.geometry = geometry;
            var features=[];
             if(geometry ==="circle"){
             }

            this.onSelected(features);
        },
        /**
         * 当前被选择的元素
         * @method onSelected
         * @param {Object}features
         */
        onSelected:function(features) {
            this.selectedFeatures = features;
        },
        /**
         * 清空存放数据的数组
         * @method clear
         */
        clear:function() {
            this.selectedFeatures= [];
        }
    })
});