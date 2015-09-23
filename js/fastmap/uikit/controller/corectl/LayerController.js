/**
 * Created by liwanchong on 2015/9/16.
 */


fastmap.uikit.layerControllerSingleton=(function() {
    var instantiated;
    function init(options) {
            var layerController = L.Class.extend({
            /**
             * 事件管理器
             * @property includes
             */
            includes: L.Mixin.Events,

            options: {},
            /**
             * @class LayerController
             * @constructor
             * @namespace fastmap.uikit
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.layers = [];
                this.on('layerOnAdd', this.OnAddLayer, this);
                this.on('layerOnRemove', this.OnRemoveLayer, this);

            },
            /**
             * 添加图层
             * @method OnAddLayer
             * @param layer
             * @constructor
             */
            OnAddLayer: function (layer) {
                this.layers.push(layer);
            },
            /**
             * 移除图层
             * @method OnRemoveLayer
             * @param {Layer}layer
             * @constructor
             */
            OnRemoveLayer: function (layer) {
                this.layers.remove(layer);
            },
            /**
             * 显示的图层
             * @method showLayer
             * @param {Layer}layer
             */
            setLayerVisible: function (layer) {
                this.fire('layerOnShow', {layer: layer});
            },
            /**
             * 可编辑的图层
             * @method editLayer
             * @param {Layer}layer
             */
            setLayerEditable: function (layer) {
                this.fire('layerOnEdit', {layer: layer});
            },
            /**
             * 获取layer
             * @method setLayerSelectable
             * @param {String}id
             */
            setLayerSelectable: function (id) {
                this.getLayerById(id);
            },
            /**
             * 获取可见图层
             * @method getVisibleLayers
             * @returns {Array}
             */
            getVisibleLayers: function () {
                var layers = [];
                return layers;
            },
            /**
             * 根据id获取图层
             * @method getLayerById
             * @param {String}id
             * @returns {L.TileLayer.WMS.defaultWmsParams.layers|*|o.TileLayer.WMS.defaultWmsParams.layers|i.TileLayer.WMS.defaultWmsParams.layers|Array|L.control.layers}
             */
            getLayerById: function (id) {
                var layer = this.layers;
                return layer;
            },
            /**
             * 获取选择的图层
             * @method getSelectableLayers
             * @returns {Array}
             */
            getSelectableLayers: function () {
                var layers = [];
                return layers;
            },
            /**
             * 获取可编辑的图层
             * @method getEditableLayers
             * @returns {Array}
             */
            getEditableLayers: function () {
                var layers = [];
                return layers;
            }

        });
        return new layerController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();


fastmap.uikit.layerController=function(options) {
    return new fastmap.uikit.layerControllerSingleton(options);
};
