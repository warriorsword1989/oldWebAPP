/**
 * Created by liwanchong on 2015/11/4.
 */
fastmap.uikit.SelectRestriction = (function () {

    var instantiated;

function init(options) {
    var SelectRestriction = L.Class.extend({

        /***
         *
         * @param {Object}options
         */
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
                var restrictObj = data[item].properties.restrictioninfo;
                var geom = data[item].geometry.coordinates;
                var newGeom = [];
                if (restrictObj !== undefined) {
                    if (restrictObj.constructor === Array) {
                        for (var theory = 0, theoryLen = restrictObj.length; theory < theoryLen; theory++) {
                            if (theory > 0) {
                                newGeom[0] = (parseInt(geom[0]) + theory * 16);
                                newGeom[1] = (parseInt(geom[1]));
                                if (this._TouchesPoint(newGeom, x, y, 20)) {
                                    id = data[item].properties.id;
                                    this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {id: id, tips: 0, optype: 'RDRESTRICTION'})

                                    break;
                                }
                            } else {
                                if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 20)) {
                                    id = data[item].properties.id;
                                    this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {id: id, tips: 0, optype: 'RDRESTRICTION'})

                                    break;
                                }
                            }

                        }
                    } else {
                        var restrictArr = restrictObj.split(",");
                        for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {
                            if (fact > 0) {
                                newGeom[0] = (parseInt(geom[0]) + fact * 16);
                                newGeom[1] = (parseInt(geom[1]));
                                if (this._TouchesPoint(newGeom, x, y, 20)) {
                                    id = data[item].properties.id;
                                    this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {id: id, tips: 0, optype: 'RDRESTRICTION'})

                                    break;
                                }
                            } else {
                                if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 20)) {
                                    id = data[item].properties.id;
                                    this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {id: id, tips: 0, optype: 'RDRESTRICTION'})

                                    break;
                                }
                            }
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
        }

    }
)
    return new SelectRestriction(options);
}

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }

})();