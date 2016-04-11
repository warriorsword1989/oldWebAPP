/**
 * Created by liwanchong on 2015/11/21.
 */

fastmap.uikit.HighLightRender = L.Class.extend({
    initialize: function (layer, options) {
        this.options = options || {};
        this.layer = layer;//高亮的图层
        this.currentEditLayer = null;
        this.highLightFeatures = [];
        this.initFlag = this.options.initFlag || false;//当地图变化时,才能激发this.draw()函数
        this.eventController = fastmap.uikit.EventController();
        var that = this;
        this.eventController.on(this.eventController.eventTypes.TILEDRAWEND, function (e) {
            that.drawHighlight()
        })

    },

    /**
     * 使高亮的dataTips随着地图的变化依然高亮
     * @param tile
     * @param zoom
     */
    drawTips: function (id, feature, ctx) {

        var geom = feature.geometry.coordinates;
        var newGeom = [];
        newGeom[0] = (parseInt(geom[0]));
        newGeom[1] = (parseInt(geom[1]));
        if (feature.properties.id == id) {
            if (feature.properties.kind) {  //种别

                if (feature.properties.type == '1201') {
                    this.layer._drawBackground({
                        ctx: ctx,
                        geo: newGeom,
                        boolPixelCrs: true,
                        lineColor: 'rgb(4, 187, 245)',
                        fillColor: 'rgba(4, 187, 245, 0.2)',
                        lineWidth: 1,
                        width: 40,
                        height: 20,
                        drawx: 20,
                        drawy: -10  


                    });
                } else if (feature.properties.type == '1203') {



                    this.layer._drawBackground({
                        ctx: ctx,
                        geo: newGeom,
                        boolPixelCrs: true,
                        rotate: (feature.properties.kind - 90) * (Math.PI / 180),
                        lineColor: 'rgb(4, 187, 245)',
                        fillColor: 'rgba(4, 187, 245, 0.5)',
                        lineWidth: 1,
                        width: 40,
                        height: 20,
                        drawx: -20,
                        drawy: -10


                    });
                } else {
                    this.layer._drawBackground({
                        ctx: ctx,
                        geo: newGeom,
                        style: null,
                        boolPixelCrs: true,
                        lineColor: 'rgb(4, 187, 245)',
                        fillColor: 'rgba(4, 187, 245, 0.5)',
                        lineWidth: 1,
                        width: 20,
                        height: 20,
                        drawx: -25,
                        drawy: -25

                    });
                }
            } else {

                this.layer._drawBackground({
                    ctx: ctx,
                    geo: newGeom,
                    style: null,
                    boolPixelCrs: true,
                    lineColor: 'rgb(4, 187, 245)',
                    fillColor: 'rgba(4, 187, 245, 0.5)',
                    lineWidth: 1,
                    width: 20,
                    height: 20,
                    drawx: -25,
                    drawy: -25

                });
            }
        }


    },


    drawHighlight: function (tile) {
        //绘制钱清除高亮
        this._cleanHightlight();
        if (tile) {

        } else {
            for (var item in this.highLightFeatures) {
                this.currentEditLayer = fastmap.uikit.LayerController().getLayerById(this.highLightFeatures[item].layerid);
                for (var tile in this.currentEditLayer.tiles) {
                    for (var feature in this.currentEditLayer.tiles[tile].data.features) {
                        if (this.highLightFeatures[item].id == this.currentEditLayer.tiles[tile].data.features[feature].properties.id
                            || this.highLightFeatures[item].id == this.currentEditLayer.tiles[tile].data.features[feature].properties.snode

                        ) {
                            var ctx = {
                                canvas: this.layer._tiles[tile],
                                tile: L.point(tile.split(':')[0], tile.split(':')[1])
                            };
                            var hightlightfeature = this.currentEditLayer.tiles[tile].data.features[feature];
                            var id = this.highLightFeatures[item].id;
                            if (this.highLightFeatures[item].type == 'line') {
                                this.drawOfLink(id, hightlightfeature, ctx);

                            }
                            else if (this.highLightFeatures[item].type == 'node') {
                                var geo = this.currentEditLayer.tiles[tile].data.features[feature].geometry.coordinates[0][0];
                                this.layer._drawPoint(ctx, geo, {color: 'red', radius: 3}, true);
                            }
                            else if (this.highLightFeatures[item].type == 'speedlimit') {

                                this.drawSpeedLimit(id, hightlightfeature, ctx);

                            } else if (this.highLightFeatures[item].type == 'rdcross') {

                                this.drawCross(id, hightlightfeature, ctx);

                            } else if (this.highLightFeatures[item].type == 'restriction') {

                                this.drawRestrict(id, hightlightfeature, ctx);

                            } else if (this.highLightFeatures[item].type == 'rdlaneconnexity') {
                                this.drawLane(id, hightlightfeature, ctx);
                            } else if (this.highLightFeatures[item].type == 'highSpeedDivergence') {
                                var feature = this.currentEditLayer.tiles[tile].data.features[feature];
                                this.drawBranch(this.highLightFeatures[item].id, feature, ctx);
                            } else if (this.highLightFeatures[item].type == 'gpsLine') {
                                this.layer._drawLineString(ctx, this.currentEditLayer.tiles[tile].data.features[feature].geometry.coordinates, true, {
                                    size: 3,
                                    color: '#00F5FF'
                                }, {
                                    size: 3,
                                    color: '#00F5FF'
                                }, this.currentEditLayer.tiles[tile].data.features[feature].properties);
                            } else if (this.highLightFeatures[item].type == 'workPoint') {
                                var feature = this.currentEditLayer.tiles[tile].data.features[feature];
                                this.drawTips(this.highLightFeatures[item].id, feature, ctx);
                            }

                        }
                    }
                }
            }
        }

    }

    ,

    /**
     * 高亮link
     * @param tile
     * @param zoom
     */
    drawOfLink: function (id, feature, ctx) {


        var color = null;
        if (feature.hasOwnProperty('properties')) {
            color = feature.properties.c;
        }

        var style = this.layer.styleFor(feature, color);

        var geom = feature.geometry.coordinates;
        if (feature.properties.id === id) {
            this.layer._drawLineString(ctx, geom, true, {
                size: 3,
                color: '#00F5FF'
            }, {
                color: '#00F5FF',
                radius: 3
            }, feature.properties);
        } else {
            this.layer._drawLineString(ctx, geom, true, style, {
                color: '#696969',
                radius: 3
            }, feature.properties);
        }

    },

    /**
     * 高亮交限
     * @param tile
     * @param zoom
     */
    drawRestrict: function (id, feature, ctx) {

        var type = feature.geometry.type;
        var geom = feature.geometry.coordinates;
        var route = (feature.properties.restrictionrotate) * (Math.PI / 180);
        var newgeom = [];
        if (feature.properties.id == id) {
            if (type == "Point") {
                if (feature.properties.restrictioninfo === undefined) {
                    return;
                }
                var newGeom = [];
                var restrictObj = feature.properties.restrictioninfo;
                if (restrictObj !== undefined) {
                    console.log(this.layer)
                    if (restrictObj.constructor === Array) {
                        for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {

                            if (theory > 0) {

                                newgeom[0] = parseInt(geom[0]) + theory * 16 * Math.cos(route);
                                newgeom[1] = parseInt(geom[1]) + theory * 16 * Math.sin(route);


                                this.layer._drawBackground({
                                    ctx: ctx,
                                    geo: newGeom,

                                    boolPixelCrs: true,
                                    rotate: route,
                                    lineColor: 'rgb(4, 187, 245)',
                                    fillColor: 'rgba(4, 187, 245, 0.5)',
                                    lineWidth: 1,
                                    width: 20,
                                    height: 20,
                                    drawx: -10,
                                    drawy: -10

                                })
                            } else {

                                this.layer._drawBackground({
                                    ctx: ctx,
                                    geo: geom,

                                    boolPixelCrs: true,
                                    rotate: route,
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
                    } else {
                        var restrictArr = restrictObj.split(",");
                        for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {
                            if (fact > 0) {
                                newgeom[0] = parseInt(geom[0][0]) + fact * 16 * Math.cos(route);
                                newgeom[1] = parseInt(geom[1][0]) + fact * 16 * Math.sin(route);


                                this.layer._drawBackground({
                                    ctx: ctx,
                                    geo: newgeom,

                                    boolPixelCrs: true,
                                    rotate: route,
                                    lineColor: 'rgb(4, 187, 245)',
                                    fillColor: 'rgba(4, 187, 245, 0.5)',
                                    lineWidth: 1,
                                    width: 20,
                                    height: 20,
                                    drawx: -10,
                                    drawy: -10

                                })
                            } else {


                                this.layer._drawBackground({
                                    ctx: ctx,
                                    geo: geom,

                                    boolPixelCrs: true,
                                    rotate: route,
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
                    }
                }
            }
        }

    },

    drawLane: function (id, feature, ctx) {
        var geom = feature.geometry.coordinates;
        if (feature.properties.id == id) {

            var newGeom = [];
            var laneObj = feature.properties.laneconnexityinfo;
            var route = (feature.properties.laneconnexityrotate ) * (Math.PI / 180);
            if (laneObj !== undefined) {
                console.log(this.layer);
                var laneObjArr = laneObj.split(",");
                for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {
                    if (fact > 0) {
                        newGeom[0] = parseInt(geom[0]) + fact * 10 * Math.cos(route);
                        newGeom[1] = parseInt(geom[1]) + fact * 10 * Math.sin(route);
                        this.layer._drawBackground(
                            {
                                ctx: ctx,
                                geo: newGeom,
                                boolPixelCrs: true,
                                rotate: route - (Math.PI / 2),
                                lineColor: 'rgb(4, 187, 245)',
                                fillColor: 'rgba(4, 187, 245, 0)',
                                lineWidth: 1,
                                width: 20,
                                height: 10,
                                drawx: -10,
                                drawy: -5,
                                scalex: 2 / 3,
                                scaley: 2 / 3
                            })
                    } else {
                        this.layer._drawBackground(
                            {
                                ctx: ctx,
                                geo: geom,
                                boolPixelCrs: true,
                                rotate: route - (Math.PI / 2),
                                lineColor: 'rgb(4, 187, 245)',
                                fillColor: 'rgba(4, 187, 245, 0)',
                                lineWidth: 1,
                                width: 20,
                                height: 10,
                                drawx: -10,
                                drawy: -5,
                                scalex: 2 / 3,
                                scaley: 2 / 3
                            })

                    }
                }
            }
        }
    },
    drawSpeedLimit: function (id, feature, ctx) {

        var type = feature.geometry.type;
        var geom = feature.geometry.coordinates;
        if (feature.properties.id == id) {
            if (type == "Point") {
                if (feature.properties.speedlimitcondition === undefined) {
                    return;
                }

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
        if (feature.properties.SpeedDivergencecondition && feature.properties.id == id) {

            var newGeom = [];
            newGeom[0] = (parseInt(geom[0]));
            newGeom[1] = (parseInt(geom[1]));
            var divergeRoute = feature.properties.SpeedDivergencerotate * (Math.PI / 180);
            this.layer._drawBackground({
                ctx: context,
                geo: newGeom,
                boolPixelCrs: true,
                rotate: divergeRoute,
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
    drawCross: function (id, feature, context) {
        if (feature.properties.id == id) {
            if (feature.properties.rdcrosscondition === undefined) {
                return;
            }
            for (var j in feature.geometry.coordinates) {
                var geo = feature.geometry.coordinates[j][0];
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

        }

    },
    _cleanHightlight: function () {
        for (var index in this.layer._tiles) {
            this.layer._tiles[index].getContext('2d').clearRect(0, 0, 256, 256);
        }

    }


});