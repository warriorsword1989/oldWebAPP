/**
 * Created by zhongxiaoming on 2016/2/3.
 * Class SelectRdlane
 */

fastmap.uikit.SelectRdlane = (function () {

    var instantiated;

    function init(options) {
        var SelectRdlane = L.Class.extend({
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this._map = this.options.map;
                this.highlightLayer = this.options.highlightLayer;
                this.eventController = fastmap.uikit.EventController();
                this.tiles = this.options.tiles;
                this.transform = new fastmap.mapApi.MecatorTranform();
                this.redrawTiles = [];
            },


            drawGeomCanvasHighlight: function (event, data) {

                var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;

                var id = null;
                for (var item in data) {
                    var laneObj = data[item].properties.laneconnexityinfo;
                    var geom = data[item].geometry.coordinates;
                    var newGeom = [];
                    if (laneObj !== undefined) {
                        var laneArr = laneObj.split(",");
                        for (var fact = 0, factLen = laneArr.length; fact < factLen; fact++) {
                            newGeom[0] = (parseInt(geom[0]) + fact * 16);
                            newGeom[1] = (parseInt(geom[1]));
                            if (this._TouchesPoint(newGeom, x, y, 20)) {
                                id = data[item].properties.id;
                                this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {
                                    id: id,
                                    tips: 0,
                                    optype: 'RDLANECONNEXITY'
                                })

                                if (this.redrawTiles.length != 0) {
                                    this.cleanHeight();
                                }

                                this._drawHeight(id);
                                break;
                            }
                        }
                    }
                }


            },

            /***
             *
             * @param {Array}d 几何图形
             * @param {number}x 鼠标x
             * @param {number}y 鼠标y
             * @param {number}r 半径
             * @returns {number}
             * @private
             */
            _TouchesPoint: function (d, x, y, r) {
                var dx = x - d[0];
                var dy = y - d[1];
                if ((dx * dx + dy * dy) <= r * r) {
                    return 1;
                } else {
                    return 0;
                }
            },
            cleanHeight: function () {

                this._cleanHeight();

            }
            ,

            /***
             *清除高亮
             */
            _cleanHeight: function () {

                for (var index in this.highlightLayer._tiles) {

                    this.highlightLayer._tiles[index].getContext('2d').clearRect(0, 0, 256, 256);
                }

                for (var i = 0, len = this.eventController.eventTypesMap[this.eventController.eventTypes.TILEDRAWEND].length; i < len; i++) {
                    this.eventController.off(this.eventController.eventTypes.TILEDRAWEND, this.eventController.eventTypesMap[this.eventController.eventTypes.TILEDRAWEND][i]);
                }
            },
            /***
             * 绘制高亮
             * @param id
             * @private
             */
            _drawHeight: function (id) {
                this.redrawTiles = this.tiles;
                for (var obj in this.tiles) {
                    var data = this.tiles[obj].data.features;

                    for (var key in data) {

                        var feature = data[key];
                        var type = feature.geometry.type;
                        var geom = feature.geometry.coordinates;
                        if (data[key].properties.id == id) {
                            var ctx = {
                                canvas: this.highlightLayer._tiles[this.tiles[obj].options.context.name.replace('_', ":")],
                                tile: L.point(key.split(',')[0], key.split(',')[1])
                            }
                            if (type == "Point") {
                                if (feature.properties.laneconnexityinfo === undefined) {
                                    break;
                                }
                                var newGeom = [];
                                var laneObj = feature.properties.laneconnexityinfo;
                                var route = (feature.properties.laneconnexityrotate ) * (Math.PI / 180);
                                if (laneObj !== undefined) {

                                    var laneObjArr = laneObj.split(",");

                                    for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {
                                        if (fact > 0) {
                                            newGeom[0] = parseInt(geom[0]) + fact * 10 * Math.cos(route);
                                            newGeom[1] = parseInt(geom[1]) + fact * 10 * Math.sin(route);
                                            this.highlightLayer._drawBackground(
                                                {
                                                    ctx: ctx,
                                                    geo: newGeom,
                                                    boolPixelCrs: true,
                                                    rotate: route,
                                                    lineColor: 'rgb(4, 187, 245)',
                                                    fillColor: 'rgba(4, 187, 245, 0)',
                                                    lineWidth: 1,
                                                    width: 20,
                                                    height: 10,
                                                    drawx: 0,
                                                    drawy: 5,
                                                    scalex: 2 / 3,
                                                    scaley: 2 / 3
                                                })
                                        } else {

                                            this.highlightLayer._drawBackground(
                                                {
                                                    ctx: ctx,
                                                    geo: geom,
                                                    boolPixelCrs: true,
                                                    rotate: route,
                                                    lineColor: 'rgb(4, 187, 245)',
                                                    fillColor: 'rgba(4, 187, 245, 0)',
                                                    lineWidth: 1,
                                                    width: 20,
                                                    height: 10,
                                                    drawx: 0,
                                                    drawy: 5,
                                                    scalex: 2 / 3,
                                                    scaley: 2 / 3
                                                })
                                        }
                                    }
                                }

                            }
                        }
                    }
                }


            }

        })
        return new SelectRdlane(options);
    }

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();