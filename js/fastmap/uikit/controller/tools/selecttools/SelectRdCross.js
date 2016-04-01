/**
 * Created by zhongxiaoming on 2016/2/17.
 * Class SelectRdCross
 */
fastmap.uikit.SelectRdCross = (function () {

    var instantiated;

    function init(options) {
        var SelectRdCross = L.Class.extend({
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this._map = this.options.map;
                this.highlightLayer = this.options.highlightLayer;
                this.eventController = fastmap.uikit.EventController();
                this.tiles = this.options.tiles;
                this.transform = new fastmap.mapApi.MecatorTranform();
                this.redrawTiles = [];
            }
            ,
            drawGeomCanvasHighlight: function (event, data) {
                var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;
                var id = null;
                for (var item in data) {
                    var rdCrossObj = data[item].properties.rdcrosscondition;
                    if (rdCrossObj) {
                        for (var key in data[item].geometry.coordinates) {
                            if (this._TouchesPoint(data[item].geometry.coordinates[key][0], x, y, 20)) {
                                id = data[item].properties.id;
                                this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {
                                    id: id,
                                    tips: 0,
                                    optype: 'RDCROSS'
                                })
                                if (this.redrawTiles.length != 0) {
                                    this._cleanHeight();
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
            }
            ,
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
                        if (feature.properties.id == id) {
                            var ctx = {
                                canvas: this.highlightLayer._tiles[this.tiles[obj].options.context.name.replace('_', ":")],
                                tile: L.point(key.split(',')[0], key.split(',')[1])
                            }
                            if (type == "Point") {
                                if (feature.properties.rdcrosscondition === undefined) {
                                    break;
                                }
                                for (var j in feature.geometry.coordinates) {
                                    var geo = feature.geometry.coordinates[j][0];
                                    this.highlightLayer._drawBackground({
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
                        }
                    }
                }
            }
        })
        return new SelectRdCross(options);
    }

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();