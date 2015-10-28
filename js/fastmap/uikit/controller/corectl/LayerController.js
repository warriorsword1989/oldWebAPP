/**
 * Created by liwanchong on 2015/9/16.
 */


fastmap.uikit.LayerController = (function () {
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
                this.config = this.options.config;
                this.layers = [];
                this.initLayer();
                this.on('layerOnAdd', this.OnAddLayer, this);
                this.on('layerOnRemove', this.OnRemoveLayer, this);
                this.on("layerSwitch", this.OnSwitchLayer, this);
            },

            initLayer: function () {
                for (var group in this.config) {
                    for (var layer in this.config[group].layers) {
                        this.config[group].layers[layer].options.groupid = this.config[group].groupid;
                        this.layers.push(this.config[group].layers[layer].clazz(this.config[group].layers[layer].url, this.config[group].layers[layer].options));
                    }
                }
            },
            /**
             * 图层显示隐藏转换方法
             * @method OnSwitchLayer
             * @param event
             */
            OnSwitchLayer: function (event) {
                var layerArr = event.layerArr;
                for (var i = 0, len = layerArr.length; i < len; i++) {
                    this.setLayerVisible(layerArr[i].options.id, layerArr[i].options.visible);


                }

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

                for(var item in this.layers){
                    if(layer === this.layers[item]){
                        this.layers.splice(item + 1, 1);
                    }
                }

            },
            /**
             * 显示的图层
             * @method setLayerVisible
             * @param {Layer}layer
             * @param flag
             */
            setLayerVisible: function (id, flag) {
                var layer = this.getLayerById(id);
                this.fire('layerOnShow', {layer: layer, flag: flag});
            },
            /**
             * 可编辑的图层
             * @method editLayer
             * @param {Layer}layer
             */
            setLayerEditable: function (layer) {

                for(var item in this.layers){
                    if(layer === this.layers[item]){
                        this.layers.options. editable = true;
                    }
                }
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
                var layers = []
                for(var item in this.layers){
                    if(this.layers[item].options.visible == true){
                        layers.push(this.layers[item])
                    }
                }
                return layers;
            },
            /**
             * 根据id获取图层
             * @method getLayerById
             * @param {String}id
             * @returns {L.TileLayer.WMS.defaultWmsParams.layers|*|o.TileLayer.WMS.defaultWmsParams.layers|i.TileLayer.WMS.defaultWmsParams.layers|Array|L.control.layers}
             */
            getLayerById: function (id) {
                var layer = null;
                for(var item in this.layers){
                    if(this.layers[item].options.id === id){
                        layer = this.layers[item];
                    }
                }
                return layer;
            },
            /**
             * 获取选择的图层
             * @method getSelectableLayers
             * @returns {Array}
             */
            getSelectableLayers: function () {
                var layers = [];
                for(var item in this.layers){
                    if(this.layers[item].options.selected == true){
                        layers.push(this.layers[item])
                    }
                }
                return layers;
            },
            /**
             * 获取可编辑的图层
             * @method getEditableLayers
             * @returns {Array}
             */
            getEditableLayers: function () {
                var layers = [];
                for(var item in this.layers){
                    if(this.layers[item].options.editable == true){
                        layers.push(this.layers[item])
                    }
                }
                return layers;
            }

        });
        return new layerController(options);
    }

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();