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
                this.currentEditLayer = this.options.currentEditLayer;
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
                                this._map.fire("getNodeId", {id: id, tips: 0, optype: 'RDLANECONNEXITY'})

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
                //this._map.fire("getNodeId")
            }
            ,

            /***_drawLineString: function (ctx, geom, style, boolPixelCrs) {
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
                            //if (feature.properties.laneconnexityinfo === undefined) {
                            //    break;
                            //}
                            //var newStyle = "", newGeom = [];
                            //var laneObj = feature.properties.laneconnexityinfo;
                            //var geom = feature.geometry.coordinates;
                            //if (laneObj !== undefined) {
                            //
                            //    var laneArr = laneObj.split(",");
                            //    for (var fact = 0, factLen = laneArr.length; fact < factLen; fact++) {
                            //
                            //        if (laneArr[fact].indexOf("[") > -1) {
                            //            laneArr[fact] = laneArr[fact].replace("[", "");
                            //            laneArr[fact] = laneArr[fact].replace("]", "");
                            //            newStyle = {src: './css/laneinfo/normal/' + laneArr[fact] + laneArr[fact] + '.png'};
                            //        } else if (laneArr[fact].indexOf("[") > -1) {
                            //            laneArr[fact] = laneArr[fact].replace("<", "");
                            //            laneArr[fact] = laneArr[fact].replace(">", "");
                            //        }
                            //        else {
                            //            newStyle = {src: './css/laneinfo/normal/' + laneArr[fact] + '.png'};
                            //        }
                            //        this.currentEditLayer._drawImg(ctx, geom, newStyle, true);
                            //
                            //    }
                            //}
                            if (feature.properties.laneconnexityinfo === undefined) {
                                return;
                            }
                            var newstyle = "";
                            var restrictObj = feature.properties.laneconnexityinfo;
                            var route = (feature.properties.rdlaneconnexityrotate-90) * (Math.PI / 180);
                            if (isNaN(route)) {
                                route = 0;
                            }
                            var newgeom = [];
                            if (restrictObj !== undefined) {
                                if (restrictObj.length > 1) {
                                    var restrictArr = restrictObj.split(",");
                                    for (var fact = 0, factLen = restrictArr.length; fact < factLen; fact++) {
                                        if (restrictArr[fact].constructor === Array) {
                                            newstyle = {src: './css/laneinfo/arwF/' + restrictArr[fact][0] + '.png'};
                                        } else {
                                            if (restrictArr[fact].indexOf("[") > -1) {
                                                restrictArr[fact] = restrictArr[fact].replace("[", "");
                                                restrictArr[fact] = restrictArr[fact].replace("]", "");
                                                newstyle = {src: './css/laneinfo/extF/' + restrictArr[fact] + '.png'};

                                            } else if (restrictArr[fact].indexOf("<") > -1) {
                                                restrictArr[fact] = restrictArr[fact].replace("<", "");
                                                restrictArr[fact] = restrictArr[fact].replace(">", "");
                                                newstyle = {src: './css/laneinfo/arwB/' + restrictArr[fact] + '.png'};

                                            } else if (restrictArr[fact] != "9") {
                                                newstyle = {src: './css/laneinfo/arwG/' + restrictArr[fact] + '.png'};
                                            }
                                        }
                                        if (fact > 0) {
                                            newgeom[0] = parseInt(geom[0]) + fact * 10;
                                            newgeom[1] = parseInt(geom[1]);
                                            this._drawlaneImgRoute(ctx, newgeom, newstyle, boolPixelCrs, route);
                                        } else {
                                            this._drawlaneImgRoute(ctx, geom, newstyle, boolPixelCrs, route);
                                        }
                                    }
                                } else {
                                    if (restrictObj.constructor === Array) {
                                        newstyle = {src: './css/laneinfo/arwF/' + restrictArr[0] + '.png'};
                                    } else {
                                        if (restrictObj.indexOf("[") > -1) {
                                            restrictObj = restrictObj.replace("[", "");
                                            restrictObj = restrictObj.replace("]", "");
                                            newstyle = {src: './css/laneinfo/extF/' + restrictObj + '.png'};

                                        } else if (restrictObj.indexOf("<") > -1) {
                                            restrictObj = restrictObj.replace("<", "");
                                            restrictObj = restrictObj.replace(">", "");
                                            newstyle = {src: './css/laneinfo/arwB/' + restrictObj + '.png'};

                                        } else if (restrictObj != "9") {
                                            newstyle = {src: './css/laneinfo/arwG/' + restrictObj + '.png'};
                                        }
                                    }
                                    this._drawlaneImgRoute(ctx, geom, newstyle, true, route);
                                }
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
                                if (feature.properties.laneconnexityinfo === undefined) {
                                    break;
                                }
                                var newStyle = "", newGeom = [];
                                var laneObj = feature.properties.laneconnexityinfo;
                                if (laneObj !== undefined) {

                                    var laneObjArr = laneObj.split(",");
                                    for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {
                                        if (laneObjArr[fact].indexOf("[") > -1) {
                                            laneObjArr[fact] = laneObjArr[fact].replace("[", "");
                                            laneObjArr[fact] = laneObjArr[fact].replace("]", "");
                                        } else if (laneObjArr[fact].indexOf("[") > -1) {
                                            laneObjArr[fact] = laneObjArr[fact].replace("<", "");
                                            laneObjArr[fact] = laneObjArr[fact].replace(">", "");
                                        }

                                        newStyle = {src: './css/limit/laneinfo/' + laneObjArr[fact] + '.png'};
                                        this.currentEditLayer._drawImg(ctx, geom, newStyle, true);
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