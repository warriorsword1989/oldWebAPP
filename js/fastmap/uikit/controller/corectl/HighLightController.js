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

                //for (var index in tiles) {
                //    var data = tiles[index].data;
                //    tiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
                //    var ctx = {
                //        canvas: tiles[index].options.context,
                //        tile: tiles[index].options.context._tilePoint,
                //        zoom: map.getZoom()
                //    }
                //    if (data.hasOwnProperty("features")) {
                //        for (var i = 0; i < data.features.length; i++) {
                //            var feature = data.features[i];
                //
                //            var color = null;
                //            if (feature.hasOwnProperty('properties')) {
                //                color = feature.properties.c;
                //            }
                //
                //            var style = layer.styleFor(feature, color);
                //
                //            var geom = feature.geometry.coordinates;
                //            if (featureOfHigh === "links" || featureOfHigh === "link" || featureOfHigh === "linksOfCross"||featureOfHigh ==='linksOfnode') {
                //                layer._drawLineString(ctx, geom, true, style, {
                //                    color: '#696969',
                //                    radius: 3
                //                }, feature.properties);
                //            } else if (featureOfHigh === "dataTips") {
                //                if(feature.properties.kind){  //种别
                //
                //                    if(feature.properties.type == '1201'){
                //                        layer._drawImg({
                //                            ctx:ctx,
                //                            geo:geom,
                //                            style:{src:'css/tips/kind/K'+feature.properties.kind+'.svg'},
                //                            boolPixelCrs:true,
                //                            fillStyle:{
                //                                lineColor:'rgb(4, 187, 245)',
                //                                fillColor:'rgba(4, 187, 245, 0.2)',
                //                                lineWidth:1,
                //                                width:30,
                //                                height:15,
                //                                dx:0,
                //                                dy:7.5
                //                            }
                //
                //                        });
                //                    }else if(feature.properties.type == '1203'){
                //
                //                        layer._drawImg({
                //                            ctx:ctx,
                //                            geo:geom,
                //                            style:{src:feature.properties.direc == 2?'css/tips/road/1.svg':'css/tips/road/2.svg'},
                //                            boolPixelCrs:true,
                //                            fillStyle:{
                //                                lineColor:'rgb(4, 187, 245)',
                //                                fillColor:'rgba(4, 187, 245, 0.2)',
                //                                lineWidth:1,
                //                                width:20,
                //                                height:20,
                //                                dx:5,
                //                                dy:5
                //
                //                            }
                //                        });
                //                    }
                //                } else {
                //
                //                    layer._drawImg({
                //                        ctx:ctx,
                //                        geo:geom,
                //                        style:style,
                //                        boolPixelCrs:true
                //
                //                    });
                //                }
                //            }
                //            else if (featureOfHigh === "speedlimit") {
                //                //layer.redraw();
                //                if (feature.properties.speedlimitcondition === undefined) {
                //                    return;
                //                }
                //                var speedFlagStyle = null, jtType = null;
                //                var speedLimitObj = feature.properties.speedlimitcondition;
                //                var speedLimitRoute = (feature.properties.speedlimitrotate - 90) * (Math.PI / 180);
                //                var resArray = speedLimitObj.split("|");
                //                var gaptureFlag = resArray[0];//采集标志（0,现场采集;1,理论判断）
                //                var speedFlag = resArray[1];//限速标志(0,限速开始;1,解除限速)
                //                var speedValue = resArray[2] / 10;//限速值
                //                if (gaptureFlag === "1") {//理论判断，限速开始和结束都为蓝色
                //                    if (speedFlag === "1") {//解除限速
                //                        speedFlagStyle = {src: './css/1101/1101_1_1_' + speedValue + '.svg'};
                //                        jtType = {src: './css/1101/1101_1_1_e.svg'};
                //                    } else {
                //                        speedFlagStyle = {src: './css/1101/1101_1_0_' + speedValue + '.svg'};
                //                        jtType = {src: './css/1101/1101_1_0_s.svg'};
                //                    }
                //
                //                } else {//现场采集，限速开始为红色，结束为黑色
                //                    if (speedFlag === "1") {//解除限速
                //                        speedFlagStyle = {src: './css/1101/1101_0_1_' + speedValue + '.svg'};
                //                        jtType = {src: './css/1101/1101_0_1_e.svg'};
                //                    } else {
                //                        speedFlagStyle = {src: './css/1101/1101_0_0_' + speedValue + '.svg'};
                //                        jtType = {src: './css/1101/1101_0_0_s.svg'};
                //                    }
                //                }
                //                layer._drawImg({
                //                    ctx:ctx,
                //                    geo:geom,
                //                    style:speedFlagStyle,
                //                    boolPixelCrs:true
                //
                //                })
                //                //绘制箭头
                //                layer._drawImg({
                //                    ctx:ctx,
                //                    geo:geom,
                //                    style:jtType,
                //                    boolPixelCrs:true,
                //                    rotate:speedLimitRoute,
                //                    drawx:5
                //
                //                })
                //            }
                //
                //
                //        }
                //    }
                //
                //}



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