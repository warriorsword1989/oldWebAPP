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
                this.currentEditLayer = this.options.currentEditLayer;
                this.eventController = fastmap.uikit.EventController();
                this.tiles = this.options.tiles;
                this.transform = new fastmap.mapApi.MecatorTranform();
                this.redrawTiles = [];
            },
            drawGeomCanvasHighlight: function (event, data) {

                var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;

                var id = null;
                for (var item in data) {
                    var speedlimitObj = data[item].properties.SpeedDivergencecondition;
                    var geom = data[item].geometry.coordinates;
                    var newGeom = [];
                    if (speedlimitObj !== undefined) {

                        if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 20)) {
                            id = data[item].properties.SpeedDivergencecondition[0].ids[0].detailId;
                            this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {detailid: id, tips: 0, optype: 'RDBRANCH'})

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

                for (var index in this.redrawTiles) {
                    var data = this.redrawTiles[index].data;
                    this.redrawTiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);

                    if (data.hasOwnProperty("features")) {
                        for (var i = 0; i < data.features.length; i++) {

                            var feature = data.features[i];
                            var type = feature.geometry.type;
                            var geom = feature.geometry.coordinates;
                            var ctx = {
                                canvas: this.redrawTiles[index].options.context,
                                tile: this.redrawTiles[index].options.context._tilePoint

                            }

                                if (feature.properties.SpeedDivergencecondition === undefined) {
                                    break;
                                }
                                var newStyle = "", newGeom = [];
                                var restrictObj = feature.properties.SpeedDivergencecondition;
                                if (restrictObj !== undefined) {

                                    newStyle = {src: './css/1407/' + 0 + '.svg'}
                                    newGeom[0] = (parseInt(geom[0]));
                                    newGeom[1] = (parseInt(geom[1]));
                                    var divergeRoute = feature.properties.SpeedDivergencerotate * (Math.PI / 180);
                                    this.currentEditLayer._drawImg({
                                        ctx:ctx,
                                        geo:newGeom,
                                        style:newStyle,
                                        boolPixelCrs:true,
                                        rotate:divergeRoute


                                    })

                                }


                        }
                    }
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
                        var geom = feature.geometry.coordinates;
                        if (data[key].properties.id == id) {
                            var ctx = {
                                canvas: this.tiles[obj].options.context,
                                tile: L.point(key.split(',')[0], key.split(',')[1])

                            }

                                if (feature.properties.SpeedDivergencecondition === undefined) {
                                    break;
                                }
                                var newStyle = "", newGeom = [];
                                var restrictObj = feature.properties.SpeedDivergencecondition;
                                if (restrictObj !== undefined) {

                                    //newStyle = {src: './css/speedLimit/selected/selected.png'};
                                    newStyle = {src: './css/1407/' + 0 + '.svg'}
                                    newGeom[0] = (parseInt(geom[0]));
                                    newGeom[1] = (parseInt(geom[1]));
                                    var divergeRoute = feature.properties.SpeedDivergencerotate * (Math.PI / 180);
                                    this.currentEditLayer._drawImg({
                                        ctx:ctx,
                                        geo:newGeom,
                                        style:newStyle,
                                        boolPixelCrs:true,
                                        rotate:divergeRoute,
                                        fillStyle:{
                                            lineColor:'rgb(4, 187, 245)',
                                            fillColor:'rgba(4, 187, 245, 0.5)',
                                            lineWidth:1,
                                            width:30,
                                            height:30,
                                            dx:0,
                                            dy:0

                                        }

                                    })

                                }

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