/**
 * Created by zhongxiaoming on 2016/2/19.
 * Class SelectRdBranch
 */
/**
 * Created by zhongxiaoming on 2016/2/17.
 * Class SelectSpeedLimit
 */
fastmap.uikit.SelectRdBranch = (function () {

    var instantiated;

    function init(options) {
        var SelectRdBranch = L.Class.extend({

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
                    var speedLimitObj = data[item].properties.SpeedDivergencecondition;
                    if (speedLimitObj) {
                        if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 20)) {
                            id = data[item].properties.SpeedDivergencecondition[0].ids[0].detailId;
                            this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {
                                detailid: id,
                                tips: 0,
                                optype: 'RDBRANCH'
                            })

                            if (this.redrawTiles.length != 0) {
                                this._cleanHeight();
                            }

                            this._drawHeight(id);
                            break;
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
                        var geom = feature.geometry.coordinates;
                        if (data[key].properties.id == id) {
                            var ctx = {
                                canvas: this.highlightLayer._tiles[this.tiles[obj].options.context.name.replace('_', ":")],
                                tile: L.point(key.split(',')[0], key.split(',')[1])
                            }
                            if (feature.properties.SpeedDivergencecondition === undefined) {
                                break;
                            }
                            var newGeom = [];
                            newGeom[0] = (parseInt(geom[0]));
                            newGeom[1] = (parseInt(geom[1]));
                            var divergeRoute = feature.properties.SpeedDivergencerotate * (Math.PI / 180);
                            this.highlightLayer._drawBackground({
                                ctx: ctx,
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

                    }
                }
            }
        })
        return new SelectRdBranch(options);
    }

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();