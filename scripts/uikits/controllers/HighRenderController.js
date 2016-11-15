/**
 * Created by liwanchong on 2016/5/12.
 */
fastmap.uikit.HighRenderController = (function() {
    var instantiated;

    function init(options) {
        var highRenderController = L.Class.extend({
            /**
             *
             * @param layer
             * @param options
             */
            initialize: function(options) {
                this.options = options || {};
                this.layerCtrl = fastmap.uikit.LayerController();
                this.objCtrl = fastmap.uikit.ObjectEditController();
                this.layer = this.layerCtrl.getLayerById('highlightLayer');
                this.guideLayer = new L.layerGroup();
                this.guideLayer.id = "poiGuideLayer";
                this.currentEditLayer = null;
                this.highLightFeatures = [];
                this.eventController = fastmap.uikit.EventController();
                var that = this;
                // this.eventController.on(this.eventController.eventTypes.TILEDRAWEND, function(e) {
                //     that.drawHighlight();
                // });
                this.eventController.on('AllTileLayerLoaded', function(e) {
                    that.drawHighlight();
                });
                this.popup = L.popup({'offset':L.point(0,-22),'closeButton':false});
            },
            /**
             * 当前渲染图层
             * @returns {*}
             */
            getLayer: function() {
                return this.this.layer;
            },
            setLayer: function(layer) {
                this.layer = layer;
            },
            /**
             * 使高亮的dataTips随着地图的变化依然高亮
             * @param id
             * @param feature
             * @param ctx
             */
            drawTips: function(id, feature, ctx) {
                var geom = feature.geometry.coordinates;
                if (geom) {
                    var newGeom = [];
                    newGeom[0] = (parseInt(geom[0]));
                    newGeom[1] = (parseInt(geom[1]));
                    if (feature.properties.id == id) {
                        if (feature['geometry']['type'] === "Point") {
                            this.layer._drawBackground({
                                ctx: ctx,
                                geo: newGeom,
                                style: null,
                                boolPixelCrs: true,
                                lineColor: 'rgb(4, 187, 245)',
                                fillColor: 'rgba(225,225,225,0)',
                                lineWidth: 1,
                                width: 20,
                                height: 20,
                                drawx: -10,
                                drawy: -10
                            });
                        } else {
                            this.layer._drawLineString(ctx, feature.geometry.coordinates, true, {
                                strokeWidth: 3,
                                strokeColor: '#00F5FF'
                            }, {
                                strokeWidth: 3,
                                strokeColor: '#00F5FF'
                            }, feature.properties);
                        }
                    }
                }
            },
            drawHighlight: function(action) {
                //绘制钱清除高亮
                //this._cleanHighLight();
                for (var item in this.highLightFeatures) {
                    this.currentEditLayer = fastmap.uikit.LayerController().getLayerById(this.highLightFeatures[item].layerid);
                    if (this.currentEditLayer) {
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
                                    if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RWLINK' && this.highLightFeatures[item].type == 'line') {
                                        this.drawRwLink(id, hightlightfeature, ctx, style);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType != 'RWLINK' && this.highLightFeatures[item].type == 'line') {
                                        this.drawOfLink(id, hightlightfeature, ctx, style);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDROAD' && this.highLightFeatures[item].type == 'marker') {
                                        this.drawOfLink(id, hightlightfeature, ctx, style);
                                    } else if (this.highLightFeatures[item].type == 'node') {
                                        var geo = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates;
                                        this.layer._drawPoint({
                                            boolPixelCrs: true,
                                            ctx: ctx,
                                            fillColor: 'yellow',
                                            radius: 4,
                                            geom: geo
                                        })
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDSPEEDLIMIT') {
                                        this.drawSpeedLimit(id, hightlightfeature, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDCROSS') {
                                        //this.drawPoint(id, hightlightfeature, ctx, style);
                                        this.drawCross(id, hightlightfeature, ctx, style);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDINTER') {
                                        var geo = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates;
                                        this.layer._drawPoint({
                                            boolPixelCrs: true,
                                            ctx: ctx,
                                            fillColor: 'blue',
                                            radius: 5,
                                            geom: geo
                                        })
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDRESTRICTION') {
                                        this.drawRestrict(id, hightlightfeature, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDLANECONNEXITY') {
                                        this.drawLane(id, hightlightfeature, ctx);
                                    } else if (['RDWARNINGINFO','RDHGWGLIMIT'].indexOf(this.currentEditLayer.tiles[tile].data[feature].properties.featType) > -1) {
                                        this.drawBorder(id, hightlightfeature, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDBRANCH') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawBranch(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDVARIABLESPEED') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawBranch(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'TMCPOINT') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawBranch(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDTRAFFICSIGNAL') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawTips(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDGATE') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawTips(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDGSC') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        cusFeature = this.highLightFeatures[item];
                                        this.drawOverpass(this.highLightFeatures[item].id, fea, ctx, cusFeature);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDDIRECTROUTE') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawTips(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDSPEEDBUMP') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawTips(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDTOLLGATE') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawTips(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDSE') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawTips(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDOBJECT') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawTips(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDLINKSPEEDLIMIT') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawTips(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDSLOPE') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawTips(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'RDVOICEGUIDE') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawTips(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.currentEditLayer.tiles[tile].data[feature].properties.featType == 'IXPOI' && action == 'mouseover') {
                                        var geo = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates;
                                        this.layer._drawPoint({
                                            boolPixelCrs: true,
                                            ctx: ctx,
                                            fillColor: 'blue',
                                            radius: 5,
                                            geom: geo
                                        })
                                    } else if (this.highLightFeatures[item].type == 'workPoint') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawTips(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.highLightFeatures[item].type == 'rdgsc') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        cusFeature = this.highLightFeatures[item];
                                        this.drawOverpass(this.highLightFeatures[item].id, fea, ctx, cusFeature);
                                    } else if (this.highLightFeatures[item].type == 'adadmin') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawAdAdmin(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.highLightFeatures[item].type == 'IXPOI') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawPoi(this.highLightFeatures[item].id, fea, ctx);
                                    } else if (this.highLightFeatures[item].type == 'adface' || this.highLightFeatures[item].type == 'zoneFace' || this.highLightFeatures[item].type == 'lcFace' || this.highLightFeatures[item].type == 'luFace') {
                                        var fea = this.currentEditLayer.tiles[tile].data[feature];
                                        this.drawPolygon(this.highLightFeatures[item].id, fea, ctx);
                                    }
                                } else if (this.highLightFeatures[item].type == 'node' && this.highLightFeatures[item].id == this.currentEditLayer.tiles[tile].data[feature].properties.snode) {
                                    var ctxOfSNode = {
                                        canvas: this.layer._tiles[tile],
                                        tile: L.point(tile.split(':')[0], tile.split(':')[1])
                                    };
                                    var geoOfSNode = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates[0];
                                    //this.layer._drawPoint(ctxOfSNode, geoOfSNode, {color: 'yellow', radius: 3}, true);
                                    var radius = this.highLightFeatures[item].style.radius ? this.highLightFeatures[item].style.radius : 3;
                                    var style = this.highLightFeatures[item].style;
                                    var color = 'yellow';
                                    if (style && style.color) {
                                        color = style.color;
                                    }
                                    this.layer._drawPoint({
                                        boolPixelCrs: true,
                                        ctx: ctxOfSNode,
                                        fillColor: color,
                                        radius: radius,
                                        geom: geoOfSNode
                                    })
                                    break;
                                } else if (this.highLightFeatures[item].type == 'node' && this.highLightFeatures[item].id == this.currentEditLayer.tiles[tile].data[feature].properties.enode) {
                                    var ctxOfENode = {
                                        canvas: this.layer._tiles[tile],
                                        tile: L.point(tile.split(':')[0], tile.split(':')[1])
                                    };
                                    var len = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates.length - 1;
                                    var geoOfENode = this.currentEditLayer.tiles[tile].data[feature].geometry.coordinates[len];
                                    //this.layer._drawPoint(ctxOfENode, geoOfENode, {color: 'yellow', radius: 3}, true);
                                    var radius = this.highLightFeatures[item].style.radius ? this.highLightFeatures[item].style.radius : 3;
                                    var style = this.highLightFeatures[item].style;
                                    var color = 'yellow';
                                    if (style && style.color) {
                                        color = style.color;
                                    }
                                    this.layer._drawPoint({
                                        boolPixelCrs: true,
                                        ctx: ctxOfENode,
                                        fillColor: color,
                                        radius: radius,
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
             * @param inOutStyle
             */
            drawOfLink: function(id, feature, ctx, inOutStyle) {
                var color = null;
                if (feature.hasOwnProperty('properties')) {
                    color = feature.properties.style.strokeColor;
                }
                var style = feature.properties.style;
                var geom = feature.geometry.coordinates;
                if (feature.properties.id === id) {
                    if (inOutStyle.color != null) {
                        this.layer._drawLineString(ctx, geom, true, {
                            strokeWidth: inOutStyle.strokeWidth ? inOutStyle.strokeWidth : 3,
                            strokeColor: inOutStyle.color,
                            strokeOpacity: 0.5
                        }, {
                            color: inOutStyle.color,
                            radius: inOutStyle.radius ? inOutStyle.radius : 2,
                            strokeOpacity: 0.5
                        }, feature.properties);
                    } else if (inOutStyle.strokeColor != null) {
                        this.layer._drawLineString(ctx, geom, true, {
                            strokeWidth: inOutStyle.strokeWidth ? inOutStyle.strokeWidth : 3,
                            strokeColor: inOutStyle.strokeColor,
                            strokeOpacity: inOutStyle.strokeOpacity,
                        }, {
                            color: inOutStyle.color,
                            radius: inOutStyle.radius ? inOutStyle.radius : 2,
                            strokeOpacity: 0.5
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
             * 高亮rwlink
             * @param id
             * @param feature
             * @param ctx
             * @param inOutStyle
             */
            drawRwLink: function(id, feature, ctx, inOutStyle) {
                var color = null;
                if (feature.hasOwnProperty('properties')) {
                    color = feature.properties.style.strokeColor;
                }
                var style = feature.properties.style;
                var symbol = feature.properties.symbol.symbols;
                symbol[0].color = '#00F5FF';
                symbol[2].color = '#00F5FF';
                var geom = feature.geometry.coordinates;
                if (feature.properties.id === id) {
                    if (inOutStyle.color != null) {
                        this.layer._drawLineString(ctx, geom, true, {
                            strokeWidth: inOutStyle.strokeWidth,
                            strokeColor: inOutStyle.color,
                            strokeOpacity: 0.5
                        }, {
                            color: inOutStyle.color,
                            radius: inOutStyle.strokeWidth,
                            strokeOpacity: 0.5
                        }, feature.properties);
                    } else {
                        this.layer._drawLineString(ctx, geom, true, {
                            strokeWidth: 3,
                            strokeColor: inOutStyle.color ? inOutStyle.color : '#00F5FF'
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
            drawRestrict: function(id, feature, ctx) {
                if (feature.properties.id == id) {
                    if (id !== undefined) {
                        var laneObjArr = feature.properties.markerStyle.icon;
                        for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {
                            this.layer._drawBackground({
                                ctx: ctx,
                                geo: laneObjArr[fact].location,
                                boolPixelCrs: true,
                                //rotate: feature.properties.rotate,
                                lineColor: 'rgb(4, 187, 245)',
                                fillColor: 'rgba(225,225,225, 0)',
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
            /**
             * 高亮图片的边线
             * @param id
             * @param feature
             * @param ctx
             */
            drawBorder: function(id, feature, ctx) {
                if (feature.properties.id == id) {
                    if (id !== undefined) {
                        var laneObjArr = feature.properties.markerStyle.icon;
                        for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {
                            this.layer._drawBackground({
                                ctx: ctx,
                                geo: laneObjArr[fact].location,
                                boolPixelCrs: true,
                                //rotate: feature.properties.rotate,
                                lineColor: 'rgb(4, 187, 245)',
                                fillColor: 'rgba(225,225,225, 0)',
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
            drawLane: function(id, feature, ctx) {
                if (feature.properties.id == id) {
                    if (id !== undefined) {
                        var laneObjArr = feature.properties.markerStyle.icon;
                        // for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {
                        //     this.layer._drawBackground({
                        //         ctx: ctx,
                        //         geo: laneObjArr[fact].location,
                        //         boolPixelCrs: true,
                        //         rotate: feature.properties.rotate * (Math.PI / 180),
                        //         lineColor: 'rgb(4, 187, 245)',
                        //         fillColor: 'rgba(225,225,225, 0)',
                        //         lineWidth: 1,
                        //         width: 10,
                        //         height: 20,
                        //         drawx: -5,
                        //         drawy: -10,
                        //         scalex: 2 / 3,
                        //         scaley: 2 / 3
                        //     })
                        // }
                        var gjFlag = 1,gjNum = 0;
                        for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {
                            var nameStr = laneObjArr[fact].iconName.split("_");
                            if(nameStr[1] == 1){
                                gjNum ++;
                                gjFlag = 2;
                            }
                        }
                        this.layer._drawBackground({
                            ctx: ctx,
                            geo: laneObjArr[0].location,
                            boolPixelCrs: true,
                            rotate: feature.properties.rotate * (Math.PI / 180),
                            lineColor: 'rgb(4, 187, 245)',
                            fillColor: 'rgba(225,225,225, 0)',
                            lineWidth: 1,
                            width: 10 * (laneObjArr.length-gjNum),
                            height: 20 * gjFlag,
                            drawx: -5,
                            drawy: -10,
                            scalex: 2 / 3,
                            scaley: 2 / 3
                        })
                    }
                }
            },
            drawSpeedLimit: function(id, feature, ctx) {
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
                            fillColor: 'rgba(225,225,225, 0)',
                            lineWidth: 1,
                            width: 20,
                            height: 20,
                            drawx: -10,
                            drawy: -10
                        })
                    }
                }
            },
            drawBranch: function(id, feature, context) {
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
                        fillColor: 'rgba(225,225,225, 0)',
                        lineWidth: 1,
                        width: 30,
                        height: 30,
                        drawx: -15,
                        drawy: -15
                    })
                }
            },
            drawPoint: function(id, feature, ctx, style) {
                var fillColor = style.fillColor ? style.fillColor : "red";
                var radius = style.radius ? style.radius : 6;
                for (var j in feature.geometry.coordinates) {
                    var geo = feature.geometry.coordinates[j];
                    this.layer._drawPoint({
                        boolPixelCrs: true,
                        ctx: ctx,
                        fillColor: fillColor,
                        radius: radius,
                        geom: geo
                    })
                }
            },
            drawCross: function(id, feature, ctx, style) {
                if (feature.properties.id == id) {
                    if (feature.properties.id === undefined) {
                        return;
                    }
                    var fillColor = style.fillColor ? style.fillColor : "red";
                    var radius = style.radius ? style.radius : 6;
                    for (var j in feature.geometry.coordinates) {
                        var geo = feature.geometry.coordinates[j];
                        if (feature.properties.isMainArr[j] == 1) { //主点
                            fillColor = style.fillColor ? style.fillColor : "red";
                        } else {
                            fillColor = "green";
                        }
                        this.layer._drawPoint({
                            boolPixelCrs: true,
                            ctx: ctx,
                            fillColor: fillColor,
                            radius: radius,
                            geom: geo
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
            drawOverpass: function(id, feature, ctx, cusFeature) {
                var COLORTABLE = ['#14B7FC', '#4FFFB6', 'F8B19C', '#FCD6A4'],
                    style = feature.properties.style,
                    /*根据index高低link的高亮也不一样*/
                    cusColor = COLORTABLE[cusFeature.index];
                if (!cusColor) {
                    cusColor = 'red';
                }
                var geom = feature.geometry.coordinates;
                if (feature.properties.id === id) {
                    for (var g in geom) {
                        this.layer._drawLineString(ctx, geom[g].g, true, {
                            strokeWidth: 6,
                            strokeOpacity: 0.5,
                            strokeColor: cusColor
                        }, {
                            color: cusColor,
                            strokeOpacity: 0.5,
                            radius: 3
                        }, feature.properties);
                    }
                } else {
                    for (var g in geom) {
                        this.layer._drawLineString(ctx, geom[g].g, true, style, {
                            color: '#696969',
                            strokeOpacity: 0.5,
                            radius: 3
                        }, feature.properties);
                    }
                }
            },
            drawAdAdmin: function(id, feature, ctx) {
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
                        fillColor: 'rgba(225,225,225, 0)',
                        lineWidth: 1,
                        width: 20,
                        height: 20,
                        drawx: -10,
                        drawy: -10
                    })
                }
            },
            /*
             获取地图上的指定图层
             */
            getLayerById: function(layerId) {
                var layer;
                for (var item in map._layers) {
                    if (map._layers[item].id) {
                        if (map._layers[item].id === layerId) {
                            layer = map._layers[item];
                            break;
                        }
                    }
                }
                return layer;
            },
            drawPoi: function(id, feature, ctx) {
                var transform = new fastmap.mapApi.MecatorTranform();
                var data = this.objCtrl.data;
                var guideTilePoint = transform.lonlat2Tile(data.xGuide, data.yGuide, map.getZoom());
                var guidePixel = transform.lonlat2Pixel(data.xGuide, data.yGuide, map.getZoom());
                guidePixel[0] = Math.ceil(guidePixel[0]);
                guidePixel[1] = Math.ceil(guidePixel[1]);
                var a = guidePixel[0] - 256 * guideTilePoint[0];
                var b = guidePixel[1] - 256 * guideTilePoint[1];
                //防止超出瓦片范围
                a = a < 5 ? 5 : a;
                a = a > 250 ? 250 : a;
                b = b < 5 ? 5 : b;
                b = b > 250 ? 250 : b;
                var point_guide = [];
                point_guide.push(a);
                point_guide.push(b);
                var point_loc = feature.geometry.coordinates;
                var geo = [];
                geo.push({
                    lng: data.geometry.coordinates[0],
                    lat: data.geometry.coordinates[1]
                });
                geo.push({
                    lng: data.xGuide,
                    lat: data.yGuide
                });
                var poiGuideLayer = this.getLayerById('poiGuideLayer');
                if (poiGuideLayer == undefined) {
                    map.addLayer(this.guideLayer);
                }
                if (feature.properties.id == id) {
                    if (feature.properties.id === undefined) {
                        return;
                    }
                    this.layer._drawImg({
                        ctx: ctx,
                        geo: point_loc,
                        style: {
                            src: '../../../images/poi/map/marker_red_16.png'
                        },
                        boolPixelCrs: true,
                        drawy: -31
                    });

                    map.closePopup();
                    if(feature.properties.name){
                        this.popup.setLatLng([data.geometry.coordinates[1], data.geometry.coordinates[0]]).setContent(feature.properties.name);
                        map.openPopup(this.popup);
                    }

                    // if(feature.properties.name){ //poi如果存在名称则显示名称
                    //     var n = feature.properties.name;
                    //     if(n.length > 10){
                    //         n = n.substr(0,10)+"...";
                    //     }
                    //     this.layer._drawText({
                    //         ctx: ctx,
                    //         text: feature.properties.name,
                    //         geo: point_loc,
                    //         font: 'bold 13px Courier New',
                    //         align: 'center',
                    //         drawx: 1,
                    //         drawy: -36
                    //     });
                    // }

                    // var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
                    // feature.properties['symbol'] = symbolFactory.dataToSymbol({
                    //     type: 'SampleLineSymbol',
                    //     style: 'dash',
                    //     color: 'red'
                    // });
                    // this.guideLayer.clear();
                    // this.guideLayer.draw(geo);
                    // this.layer._drawLineStringWithSymbol(ctx, geo, true, feature.properties['symbol']);
                    var guideLine = L.polyline(geo, {
                        color: 'red',
                        weight: 1,
                        dashArray: "5, 10",
                        id: "guideLine"
                    });
                    this.guideLayer.addLayer(guideLine);
                    // map.getPanes().overlayPane.style.zIndex = "1";
                    ctx.canvas = this.layer._tiles[guideTilePoint[0] + ":" + guideTilePoint[1]];
                    ctx.tile = L.point(guideTilePoint[0], guideTilePoint[1]);
                    this.layer._drawImg({
                        ctx: ctx,
                        // geo: feature.properties.guide,
                        geo: point_guide,
                        style: {
                            src: '../../../images/poi/map/marker_circle.png'
                        },
                        boolPixelCrs: true,
                        drawy: 0
                    });
                }
            },
            drawPolygon: function(id, feature, ctx) {
                if (feature.properties.id == id) {
                    if (feature.properties.id === undefined) {
                        return;
                    }
                    var geo = feature.geometry.coordinates;
                    this.layer._drawPolygon(ctx, geo, {
                        'fillColor': '#33ccff',
                        'fillOpacity': 0.6,
                        'strokeColor': '#FFFF00',
                        'strokeWidth': 3,
                        'backgroundImage': ""
                    }, true)
                }
            },
            _cleanHighLight: function(action) {
                for (var index in this.layer._tiles) {
                    this.layer._tiles[index].getContext('2d').clearRect(0, 0, 256, 256);
                }
                var poiGuideLayer = this.getLayerById('poiGuideLayer');
                if (poiGuideLayer != undefined && action != 'mouseover') {
                    poiGuideLayer.clearLayers();
                }
            },
            cleanHighLight : function (){
                this.highLightFeatures = [];
                this._cleanHighLight();
            }
        });
        return new highRenderController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();