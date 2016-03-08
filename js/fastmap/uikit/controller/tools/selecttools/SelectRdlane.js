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

                this._redraw();
            },

            _redraw:function(){
                this.redrawTiles = this.tiles;
                for (var obj in this.tiles) {
                    var data = this.tiles[obj].data.features;
                    if(this.tiles[obj].options.context._layer.requestType == 'RDLANECONNEXITY' ){

                        this.tiles[obj].options.context.getContext('2d').clearRect(0, 0, 256, 256);

                        for (var key in data) {

                            var feature = data[key];
                            var type = feature.geometry.type;
                            var geom = feature.geometry.coordinates;

                            var ctx = {
                                canvas: this.tiles[obj].options.context,
                                tile: L.point(key.split(',')[0], key.split(',')[1])

                            }
                            if (type == "Point") {
                                if (feature.properties.laneconnexityinfo === undefined) {
                                    break;
                                }
                                var newStyle = "", newGeom = [];
                                var laneObj = feature.properties.laneconnexityinfo;
                                var route = (feature.properties.laneconnexityrotate ) * (Math.PI / 180);
                                var newgeom = [];
                                if (laneObj !== undefined) {

                                    var laneObjArr = laneObj.split(",");

                                    for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {
                                        if (laneObjArr[fact].constructor === Array) {
                                            newstyle = {src: './css/laneinfo/arwF/' + laneObjArr[fact][0] + '.png'};
                                        } else {
                                            if (laneObjArr[fact].indexOf("[") > -1) {
                                                newstyle = {src: './css/laneinfo/extF/' + laneObjArr[fact].substr(laneObjArr[fact].length - 2, 1) + '.png'};

                                            } else if (laneObjArr[fact].indexOf("<") > -1) {
                                                newstyle = {src: './css/laneinfo/arwB/' + laneObjArr[fact].substr(laneObjArr[fact].length - 2, 1) + '.png'};

                                            } else if (laneObjArr[fact] != "9") {
                                                newstyle = {src: './css/laneinfo/arwG/' + laneObjArr[fact] + '.png'};
                                            }
                                        }
                                        if (newstyle.src === './css/laneinfo/extF/[.png') {
                                            console.log("test");
                                        }
                                        if (fact > 0) {
                                            newgeom[0] = parseInt(geom[0]) + fact * 10*Math.cos(route);
                                            newgeom[1] = parseInt(geom[1])+ fact * 10*Math.sin(route);
                                            this.currentEditLayer._drawlaneImgRoute(ctx, newgeom, newstyle, true, route);
                                            //this.currentEditLayer._drawlaneImgbound(ctx, newgeom, newstyle, true, route);
                                        } else {
                                            this.currentEditLayer._drawlaneImgRoute(ctx, geom, newstyle, true, route);
                                            //this.currentEditLayer._drawlaneImgbound(ctx, geom, newstyle, true, route);
                                        }
                                    }
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
                                var route = (feature.properties.laneconnexityrotate ) * (Math.PI / 180);
                                var newgeom = [];
                                if (laneObj !== undefined) {

                                    var laneObjArr = laneObj.split(",");

                                    for (var fact = 0, factLen = laneObjArr.length; fact < factLen; fact++) {
                                        if (laneObjArr[fact].constructor === Array) {
                                            newstyle = {src: './css/laneinfo/arwF/' + laneObjArr[fact][0] + '.png'};
                                        } else {
                                            if (laneObjArr[fact].indexOf("[") > -1) {
                                                newstyle = {src: './css/laneinfo/extF/' + laneObjArr[fact].substr(laneObjArr[fact].length - 2, 1) + '.png'};

                                            } else if (laneObjArr[fact].indexOf("<") > -1) {
                                                newstyle = {src: './css/laneinfo/arwB/' + laneObjArr[fact].substr(laneObjArr[fact].length - 2, 1) + '.png'};

                                            } else if (laneObjArr[fact] != "9") {
                                                newstyle = {src: './css/laneinfo/arwG/' + laneObjArr[fact] + '.png'};
                                            }
                                        }
                                        if (newstyle.src === './css/laneinfo/extF/[.png') {
                                            console.log("test");
                                        }
                                        if (fact > 0) {
                                            newgeom[0] = parseInt(geom[0]) + fact * 10*Math.cos(route);
                                            newgeom[1] = parseInt(geom[1])+ fact * 10*Math.sin(route);
                                            this.currentEditLayer._drawlaneImgRoute(ctx, newgeom, newstyle, true, route);
                                            this.currentEditLayer._drawlaneImgbound(ctx, newgeom, newstyle, true, route);
                                        } else {
                                            this.currentEditLayer._drawlaneImgRoute(ctx, geom, newstyle, true, route);
                                            this.currentEditLayer._drawlaneImgbound(ctx, geom, newstyle, true, route);
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