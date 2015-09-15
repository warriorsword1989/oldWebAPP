/**
 * Created by wangtun on 2015/9/10.
 * 属性编辑
 * @namespace  fastmap.uiKit
 * @class ObjectEditController
 *
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.ObjectEditController = L.Class.extend({
        /**
         * 事件管理器
         * @property includes
         */
        includes: L.Mixin.Events,
        /**
         * 相关属性
         */
        options: {},
        /**
         *构造函数
         * @class ObjectEditController
         * @constructor
         * @namespace  fastmap.uiKit
         * @param {Object}options
         */
        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
            this.data = "";
            this.originalData = null;
            this.on("FeatureSelected",this.setCurrentObject,this);
        },
        /**
         * 保存需要编辑的元素的原数据
         *@method save
         */
        save:function() {
            this.onSaved(this.originalData, this.data);
        },
        /**
         * 获得编辑的字段及其内容
         * @method getChanged
         */
        getChanged:function() {

        },
        /**
         * 保存当前元素
         * @method setCurrentObject
         * @param {Object}obj
         */
        setCurrentObject:function(obj) {
            this.data = obj;
        },
        /**
         * 删除地图上元素
         * @method onRemove
         */
        onRemove: function () {

        },
        /**
         * 保存元素的方法
         * @method onSaved
         * @param {Object}orignalData
         * @param {Object}data
         */
        onSaved:function(orignalData,data) {
        }
    })
});