/**
 * Created by liwanchong on 2016/5/12.
 */
fastmap.uikit.HighRenderController = (function () {
    var instantiated;

    function init(options) {
        var highRenderController = L.Class.extend({
            /**
             *
             * @param layer
             * @param options
             */
            initialize: function (options) {
                this.options = options || {};
                this.layerCtrl = fastmap.uikit.LayerController();
                this.layer = this.layerCtrl.getLayerById('highlightlayer');
                this.currentEditLayer = null;
                this.highLightFeatures = [];
                this.eventController = fastmap.uikit.EventController();
                var that = this;
                this.eventController.on(this.eventController.eventTypes.TILEDRAWEND, function (e) {
                    that.drawHighlight();
                })
            },
            /**
             * 使高亮的dataTips随着地图的变化依然高亮
             * @param id
             * @param feature
             * @param ctx
             */
            drawTips: function (id, feature, ctx) {

                var geom = feature.geometry.coordinates;
                if (geom) {
                    var newGeom = [];
                    newGeom[0] = (parseInt(geom[0]));
                    newGeom[1] = (parseInt(geom[1]));
                    if (feature.properties.id == id) {
                        if(feature['geometry']['type']==="Point") {
                            this.layer._drawBackground({
                                ctx: ctx,
                                geo: newGeom,
                                style: null,
                                boolPixelCrs: true,
                                lineColor: 'rgb(4, 187, 245)',
                                fillColor: 'rgba(4, 187, 245, 0)',
                                lineWidth: 1,
                                width: 20,
                                height: 20,
                                drawx: -10,
                                drawy: -10
                            });
                        }else{
                            this.layer._drawLineString(ctx, feature.geometry.coordinates, true, {
                                strokeWidth: 2,
                                strokeColor: '#00F5FF'
                            }, {
                                strokeWidth: 30,
                                strokeColor: '#00F5FF'
                            }, feature.properties);
                        }

                    }
                }
            },
            drawHighlight: function (tile) {
                //绘制钱清除高亮
                //this._cleanHighLight();
                if (tile) {
                } else {
                    for (var item in this.highLightFeatures) {
                        this.currentEditLayer = fastmap.uikit.LayerController().getLayerById(this.highLightFeatures[item].layerid);
                        for (var tile in this.currentEditLayer.tiles) {
                            for (var feature in this.currentEditLayer.tiles[tile].data) {

                                if (this.highLightFeatures[item].id == this.currentEditLayer.tiles[tile].data[feature].properties.id) {
                                    var ctx = {
                                        canvas: this.layer._tiles[tile],
                                        tile: L.point(tile.split(':')[0], tile.split(':')[1])
                                    };
                                    var hightlightfeature = this.currentEditLayer.tiles[tile].data[feature];
                                    var id = this.highLightFeatures[item].id;
                                    var style = this.highLightFeatures[item].style;
                                    if (this.highLightFeatures[item].type == 'line') {
                                        this.drawOfLink(id, hightlightfeature, ctx, style);

                                    }
                                    else if (this.highLightFeatures[item].type == 'node') {
                                        var geo = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates[0];
                                        //this.layer._drawPoint(ctx, geo, {color: 'red', radius: 3}, true);
                                        this.layer._drawPoint({
                                            boolPixelCrs: true,
                                            ctx: ctx,
                                            fillColor: 'red',
                                            radius: 3,
                                            geom: geo
                                        })
                                    }
                                    else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDSPEEDLIMIT') {

                                        this.drawSpeedLimit(id, hightlightfeature, ctx);

                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDCROSS') {

                                        this.drawCross(id, hightlightfeature, ctx);

                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDRESTRICTION') {

                                        this.drawRestrict(id, hightlightfeature, ctx);

                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDLANECONNEXITY') {
                                        this.drawLane(id, hightlightfeature, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDBRANCH') {
                                        var feature = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawBranch(this.highLightFeatures[item].id, feature, ctx);
                                    }  else if (this.highLightFeatures[item].type == 'workPoint') {
                                        var feature = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawTips(this.highLightFeatures[item].id, feature, ctx);
                                    } else if (this.highLightFeatures[item].type == 'RDGSC') {
                                        var feature = this.currentEditLayer.tiles[tile].data[feature];
                                        cusFeature = this.highLightFeatures[item];
                                        this.drawOverpass(this.highLightFeatures[item].id, feature, ctx, cusFeature);
                                    } else if (this.highLightFeatures[item].type == 'adadmin') {
                                        var feature = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawAdAdmin(this.highLightFeatures[item].id, feature, ctx);
                                    } else if (this.highLightFeatures[item].type == 'poi') {
                                        var feature = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawPoi(this.highLightFeatures[item].id, feature, ctx);
                                    } else if (this.highLightFeatures[item].type == 'adface') {
                                        var feature = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawPolygon(this.highLightFeatures[item].id, feature, ctx);
                                    }
                                } else if (this.highLightFeatures[item].id == this.currentEditLayer.tiles[tile].data[feature].properties.snode) {
                                    var ctxOfSNode = {
                                        canvas: this.layer._tiles[tile],
                                        tile: L.point(tile.split(':')[0], tile.split(':')[1])
                                    };
                                    var geoOfSNode = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates[0];
                                    //this.layer._drawPoint(ctxOfSNode, geoOfSNode, {color: 'yellow', radius: 3}, true);
                                    this.layer._drawPoint({
                                        boolPixelCrs: true,
                                        ctx: ctxOfSNode,
                                        fillColor: 'yellow',
                                        radius: 3,
                                        geom: geoOfSNode
                                    })
                                    break;
                                } else if (this.highLightFeatures[item].id == this.currentEditLayer.tiles[tile].data[feature].properties.enode) {
                                    var ctxOfENode = {
                                        canvas: this.layer._tiles[tile],
                                        tile: L.point(tile.split(':')[0], tile.split(':')[1])
                                    };
                                    var len = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates.length - 1;
                                    var geoOfENode = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates[len];
                                    //this.layer._drawPoint(ctxOfENode, geoOfENode, {color: 'yellow', radius: 3}, true);
                                    this.layer._drawPoint({
                                        boolPixelCrs: true,
                                        ctx: ctxOfENode,
                                        fillColor: 'yellow',
                                        radius: 3,
                                        geom: geoOfENode
                                    })
                                    break;
                                }
                            }
                        }
                    }
                }

            },
            /**
             * 高亮link
             * @param id
             * @param feature
             * @param ctx
             */
            drawOfLink: function (id, feature, ctx, inOutStyle) {
                var color = null;
                if (feature.hasOwnProperty('properties')) {
                    color = feature.properties.style.strokeColor;
                }

                var style = feature.properties.style;

                var geom = feature.geometry.coordinates;
                if (feature.properties.id === id) {
                    if (inOutStyle.color != null) {
                        this.layer._drawLineString(ctx, geom, true, {
                            strokeWidth: 3,
                            strokeColor: inOutStyle.color
                        }, {
                            color: '#00F5FF',
                            radius: 3
                        }, feature.properties);
                    } else {
                        this.layer._drawLineString(ctx, geom, true, {
                            strokeWidth: 3,
                            strokeColor: '#00F5FF'
                        }, {
                            color: '#00F5FF',
                            radius: 3
                        }, feature.properties);
                    }

                } else {
                    this.layer._drawLineString(ctx, geom, true, style, {
                        color: '#696969',
                        radius: 3
                    }, feature.properties);
                }
            },

            /**
             * 高亮交限
             * @param id
             * @param feature
             * @param ctx
             */
            drawRestrict: function (id, feature, ctx) {
                if (feature.properties.id == id) {
                    if (id !== undefined) {
                        var laneObjArr = feature.properties.markerStyle.icon;
                        for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {

                            this.layer._drawBackground(
                                {
                                    ctx: ctx,
                                    geo: laneObjArr[fact].location,
                                    boolPixelCrs: true,
                                    //rotate: feature.properties.rotate,
                                    lineColor: 'rgb(4, 187, 245)',
                                    fillColor: 'rgba(4, 187, 245, 0)',
                                    lineWidth: 1,
                                    width: 15,
                                    height: 15,
                                    drawx: -7.5,
                                    drawy: -7.5,
                                    scalex: 2 / 3,
                                    scaley: 2 / 3
                                })
                        }
                    }
                }
            },
            drawLane: function (id, feature, ctx) {
                if (feature.properties.id == id) {
                    if (id !== undefined) {
                        var laneObjArr = feature.properties.markerStyle.icon;
                        for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {
                            this.layer._drawBackground(
                                {
                                    ctx: ctx,
                                    geo: laneObjArr[fact].location,
                                    boolPixelCrs: true,
                                    rotate: feature.properties.rotate * (Math.PI / 180),
                                    lineColor: 'rgb(4, 187, 245)',
                                    fillColor: 'rgba(4, 187, 245, 0)',
                                    lineWidth: 1,
                                    width: 10,
                                    height: 20,
                                    drawx: -5,
                                    drawy: -10,
                                    scalex: 2 / 3,
                                    scaley: 2 / 3
                                })
                        }
                    }
                }
            },
            drawSpeedLimit: function (id, feature, ctx) {
                var type = feature.geometry.type;
                var geom = feature.geometry.coordinates;
                if (feature.properties.id == id) {
                    if (type == "Point") {
                        var newGeom = [];
                        newGeom[0] = (parseInt(geom[0]));
                        newGeom[1] = (parseInt(geom[1]));
                        this.layer._drawBackground({
                            ctx: ctx,
                            geo: newGeom,
                            boolPixelCrs: true,
                            lineColor: 'rgb(4, 187, 245)',
                            fillColor: 'rgba(4, 187, 245, 0.5)',
                            lineWidth: 1,
                            width: 20,
                            height: 20,
                            drawx: -10,
                            drawy: -10
                        })
                    }
                }
            },

            drawBranch: function (id, feature, context) {
                var geom = feature.geometry.coordinates;
                if (feature.properties.id && feature.properties.id == id) {
                    var newGeom = [];
                    newGeom[0] = (parseInt(geom[0]));
                    newGeom[1] = (parseInt(geom[1]));
                    this.layer._drawBackground({
                        ctx: context,
                        geo: newGeom,
                        boolPixelCrs: true,
                        lineColor: 'rgb(4, 187, 245)',
                        fillColor: 'rgba(4, 187, 245, 0.5)',
                        lineWidth: 1,
                        width: 30,
                        height: 30,
                        drawx: -15,
                        drawy: -15
                    })
                }

            },
            drawCross: function (id, feature, ctx) {
                if (feature.properties.id == id) {
                    if (feature.properties.id === undefined) {
                        return;
                    }
                    for (var j in feature.geometry.coordinates) {
                        var geo = feature.geometry.coordinates[j];
                        this.layer._drawBackground({
                            ctx: ctx,
                            geo: geo,
                            boolPixelCrs: true,
                            lineColor: 'rgb(4, 187, 245)',
                            fillColor: 'rgba(4, 187, 245, 0.5)',
                            lineWidth: 1,
                            width: 6,
                            height: 6,
                            drawx: -3,
                            drawy: -3

                        })
                    }
                }
            },
            /**
             * 高亮立交
             * @param id
             * @param feature
             * @param ctx
             */
            drawOverpass: function (id, feature, ctx, cusFeature) {
                var COLORTABLE = ['#14B7FC', '#4FFFB6', 'F8B19C', '#FCD6A4'],
                    style = feature.properties.style,
                /*根据index高低link的高亮也不一样*/
                    cusColor = COLORTABLE[cusFeature.index];
                var geom = feature.geometry.coordinates;
                if (feature.properties.id === id) {
                    this.layer._drawLineString(ctx, geom, true, {
                        strokeWidth: 6,
                        strokeColor: cusColor
                    }, {
                        color: cusColor,
                        radius: 3
                    }, feature.properties);
                } else {
                    this.layer._drawLineString(ctx, geom, true, style, {
                        color: '#696969',
                        radius: 3
                    }, feature.properties);
                }
            },
            drawAdAdmin: function (id, feature, ctx) {
                if (feature.properties.id == id) {
                    if (feature.properties.id === undefined) {
                        return;
                    }
                    var geo = feature.geometry.coordinates;
                    //this.layer._drawImg({
                    //    ctx: ctx,
                    //    geo: geo,
                    //    boolPixelCrs: true,
                    //    style: {src: '../../images/road/img/heightStar.svg'},
                    //    drawx: "",
                    //    drawy: "",
                    //    scalex: 1,
                    //    scaley: 1
                    //
                    //})
                    this.layer._drawBackground({
                        ctx: ctx,
                        geo: geo,
                        boolPixelCrs: true,
                        lineColor: 'rgb(4, 187, 245)',
                        fillColor: 'rgba(4, 187, 245, 0.5)',
                        lineWidth: 1,
                        width: 20,
                        height: 20,
                        drawx: -10,
                        drawy: -10

                    })
                }
            },
            drawPoi: function (id, feature, ctx) {
                if (feature.properties.id == id) {
                    if (feature.properties.id === undefined) {
                        return;
                    }
                    var geo = [];
                    geo.push(feature.geometry.coordinates);
                    geo.push(feature.properties.guide.coordinates);
                    this.layer._drawImg({
                        ctx:ctx,
                        geo:feature.geometry.coordinates,
                        style:{src:'../../../images/poi/map/marker_red_16.png'},
                        boolPixelCrs:true,
                        drawy:-31
                    });
                    // this.layer._drawPoint({
                    //     boolPixelCrs: true,
                    //     ctx: ctx,
                    //     fillColor: 'red',
                    //     radius: 3,
                    //     geom: feature.geometry.coordinates
                    // });

                    var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
                    feature.properties['symbol'] = symbolFactory.dataToSymbol({
                        type:'SampleLineSymbol',
                        style:'dash',
                        color:'red'
                    });
                    this.layer._drawLineStringWithSymbol(ctx, geo, true,feature.properties['symbol']);

                    this.layer._drawImg({
                        ctx:ctx,
                        geo:feature.properties.guide.coordinates,
                        style:{src:'../../../images/poi/map/marker_circle.png'},
                        boolPixelCrs:true,
                        drawy:0
                    });
                }
            },
            drawPolygon: function (id, feature, ctx) {
                if (feature.properties.id == id) {
                    if (feature.properties.id === undefined) {
                        return;
                    }
                    var geo = feature.geometry.coordinates;
                    this.layer._drawPolygon(
                        ctx,
                        geo,
                        {
                            'fillColor': '#FFFF00',
                            'fillOpacity': 0.2,
                            'strokeColor': '#FFFF00',
                            'strokeWidth': 1,
                            'backgroundImage': ""
                        }, true
                    )
                }
            },
            _cleanHighLight: function () {
                for (var index in this.layer._tiles) {
                    this.layer._tiles[index].getContext('2d').clearRect(0, 0, 256, 256);
                }
            }
        });
        return new highRenderController(options);
    }

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();