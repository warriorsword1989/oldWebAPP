/**
 * Created by zhongxiaoming on 2016/2/17.
 * Class SelectSpeedLimit
 */
fastmap.uikit.SelectSpeedLimit = (function () {

    var instantiated;

    function init(options) {
        var SelectSpeedLimit = L.Class.extend({

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
                    var speedlimitObj = data[item].properties.speedlimitcondition;

                    if (speedlimitObj !== undefined) {

                        if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 20)) {
                            id = data[item].properties.id;
                            this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {
                                id: id,
                                tips: 0,
                                optype: 'RDSPEEDLIMIT'
                            })

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
            }

        })
        return new SelectSpeedLimit(options);
    }

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();