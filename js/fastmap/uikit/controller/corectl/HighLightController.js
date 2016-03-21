/**
 * Created by liwanchong on 2015/11/24.
 */
fastmap.uikit.HighLightController = (function () {
    var instantiated;

    function init(options) {
        var highLightController = L.Class.extend({

            options: {},

            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.highLightLayersArr = [];
            },

            /***
             * 添加高亮的feature
             * @param {Object}output
             */
            pushHighLightLayers: function (layer) {
                this.highLightLayersArr.push(layer);
            },

            /***
             * 移除高亮的feature
             * @param {Object}output
             */
            removeHighLightLayers: function () {
                for (var i = 0, len = this.highLightLayersArr.length; i < len; i++) {
                    var tiles = this.highLightLayersArr[i].tiles;
                    if (this.highLightLayersArr[i].linksObj) {
                        this.highLightLayersArr[i].linksObj = undefined;
                    }
                    if (this.highLightLayersArr[i].id) {
                        this.highLightLayersArr[i].id = undefined;
                    }
                    if (this.highLightLayersArr[i].linkPid) {
                        this.highLightLayersArr[i].linkPid = undefined;
                    }
                    if (this.highLightLayersArr[i].linksArr) {
                        this.highLightLayersArr[i].linksArr = [];
                        this.highLightLayersArr[i].nodesArr = [];
                    }
                    this.highLightLayersArr[i].initFlag = false;
                    var map = this.highLightLayersArr[i]._map;
                    var layer = this.highLightLayersArr[i].layer;
                    var feature = this.highLightLayersArr[i].highLightFeature;
                    this.cleanHighLayer(tiles, map, layer, feature);
                }
                this.highLightLayersArr.length = 0;
            },
            /***
             * 清空
             */
            cleanHighLayer: function (tiles, map, layer, featureOfHigh) {

                for (var index in tiles) {
                    var data = tiles[index].data;
                    tiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
                    var ctx = {
                        canvas: tiles[index].options.context,
                        tile: tiles[index].options.context._tilePoint,
                        zoom: map.getZoom()
                    }
                    if (data.hasOwnProperty("features")) {
                        for (var i = 0; i < data.features.length; i++) {
                            var feature = data.features[i];

                            var color = null;
                            if (feature.hasOwnProperty('properties')) {
                                color = feature.properties.c;
                            }

                            var style = layer.styleFor(feature, color);

                            var geom = feature.geometry.coordinates;
                            if (featureOfHigh === "links" || featureOfHigh === "link" || featureOfHigh === "linksOfCross"||featureOfHigh ==='linksOfnode') {
                                layer._drawLineString(ctx, geom, true, style, {
                                    color: '#696969',
                                    radius: 3
                                }, feature.properties);
                            } else if (featureOfHigh === "dataTips") {
                                var styleForDataTips;
                                if (feature.properties.srctype == "1") {//未处理
                                    styleForDataTips = {src: './css/tips/normal/pending.png'};
                                } else {//已处理
                                    styleForDataTips = {src: './css/tips/normal/processed.png'};
                                }
                                layer._drawImg(ctx, geom, styleForDataTips, true,feature.properties);
                            }


                        }
                    }

                }


            }
        });
        return new highLightController(options);
    }

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();