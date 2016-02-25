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
                this.currentEditLayer = this.options.currentEditLayer;
                this.tiles = this.options.tiles;
                this.transform = new fastmap.mapApi.MecatorTranform();
                this.redrawTiles = [];
            },
            drawGeomCanvasHighlight: function (event, data) {

                var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;

                var id = null;
                for (var item in data) {
                    var speedlimitObj = data[item].properties.speedlimitcondition;
                    var geom = data[item].geometry.coordinates;
                    var newGeom = [];
                    if (speedlimitObj !== undefined) {

                        if (this._TouchesPoint(data[item].geometry.coordinates, x, y, 20)) {
                            id = data[item].properties.id;
                            this._map.fire("getNodeId", {id: id, tips: 0, optype: 'RDSPEEDLIMIT'})

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
                //this._map.fire("getNodeId")
            }
            ,

            /***
             *清除高亮
             */
            _cleanHeight: function () {

                for (var index in this.redrawTiles) {
                    var data = this.redrawTiles[index].data;
                    this.redrawTiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
                    var ctx = {
                        canvas: this.redrawTiles[index].options.context,
                        tile: this.redrawTiles[index].options.context._tilePoint
                        //, zoom: this._map.getZoom()
                    }
                    if (data.hasOwnProperty("features")) {
                        for (var i = 0; i < data.features.length; i++) {
                            var feature = data.features[i];
                            if (feature.properties.speedlimitcondition === undefined) {
                                break;
                            }
                            var newStyle = "", newGeom = [];
                            var restrictObj = feature.properties.speedlimitcondition;
                            var geom = feature.geometry.coordinates, newGeom;
                            if (restrictObj !== undefined) {

                                var speedFlagstyle = null;
                                var jttype = null;
                                var restrictObj = feature.properties.speedlimitcondition;
                                var route = (feature.properties.rdSpeedLimitrotate - 90) * (Math.PI / 180);
                                var resArray = restrictObj.split("|");
                                var gaptureFlag = resArray[0];//采集标志（0,现场采集;1,理论判断）
                                var speedFlag = resArray[1];//限速标志(0,限速开始;1,解除限速)
                                var speedValue = resArray[2] / 10;//限速值
                                if (gaptureFlag === 1) {//理论判断，限速开始和结束都为蓝色
                                    if (speedFlag === 1) {//解除限速
                                        speedFlagstyle = {src: './css/speedLimit/normal/llend_' + speedValue + '.png'};
                                        jttype = {src: './css/speedLimit/normal/llend_gray.png'};
                                    } else {
                                        speedFlagstyle = {src: './css/speedLimit/normal/llstart_' + speedValue + '.png'};
                                        jttype = {src: './css/speedLimit/normal/llstart_blue.png'};
                                    }

                                } else {//现场采集，限速开始为红色，结束为黑色
                                    if (speedFlag === 1) {//解除限速
                                        speedFlagstyle = {src: './css/speedLimit/normal/end_' + speedValue + '.png'};
                                        jttype = {src: './css/speedLimit/normal/end_black.png'};
                                    } else {
                                        speedFlagstyle = {src: './css/speedLimit/normal/start_' + speedValue + '.png'};
                                        jttype = {src: './css/speedLimit/normal/start_red.png'};
                                    }
                                }
                                newGeom[0] = (parseInt(geom[0]));
                                newGeom[1] = (parseInt(geom[1]));
                                this.currentEditLayer._drawImgRoute(ctx, newGeom, speedFlagstyle, jttype, true, route);
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
                                //, zoom: this._map.getZoom()
                            }
                            if (type == "Point") {
                                if (feature.properties.speedlimitcondition === undefined) {
                                    break;
                                }
                                var newStyle = "", newGeom = [];
                                var restrictObj = feature.properties.speedlimitcondition;
                                if (restrictObj !== undefined) {

                                    newStyle = {src: './css/speedLimit/selected/selected.png'};

                                    newGeom[0] = (parseInt(geom[0]));
                                    newGeom[1] = (parseInt(geom[1]) + 23 / 2);
                                    this.currentEditLayer._drawImg(ctx, newGeom, newStyle, true);


                                }


                            }
                        }
                    }
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