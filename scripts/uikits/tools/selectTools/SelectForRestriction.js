/**
 * Created by zhongxiaoming on 2015/11/4.
 * Class SelectMultiPath
 */

fastmap.uikit.SelectForRestriction = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /** *
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};

        L.setOptions(this, options);

        this._map = this.options.map;
        this.shapeEditor = this.options.shapeEditor;

        this.currentEditLayer = this.options.currentEditLayer;
        this.eventController = fastmap.uikit.EventController();
        this.tiles = this.currentEditLayer.tiles;

        this.transform = new fastmap.mapApi.MecatorTranform();

        this.redrawTiles = [];
        this._map._container.style.cursor = 'pointer';
        this.selectedFeatures = [];
        this.operationList = this.options.operationList;
        this.snapHandler = new fastmap.mapApi.Snap({
            map: this._map,
            snapLine: true,
            snapNode: true,
            snapVertex: false
        });
        this.snapHandler.enable();
    },

    /** *
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
    },

    /** *
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
    },

    disable: function () {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    onMouseMove: function (event) {
        this.snapHandler.setTargetIndex(0);
        if (this.snapHandler.snaped) {
            this.eventController.fire(this.eventController.eventTypes.SNAPED, {
                snaped: true
            });
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1], this.snapHandler.snapLatlng[0]);
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({
                point: {
                    x: this.targetPoint.lng,
                    y: this.targetPoint.lat
                }
            });
        } else {
            this.eventController.fire(this.eventController.eventTypes.SNAPED, {
                snaped: false
            });
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
    },
    clearCross: function () {
        this.eventController.fire(this.eventController.eventTypes.SNAPED, {
            snaped: false
        });
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },
    onMouseDown: function (event) {
        // button：0.左键,1.中键,2.右键
        // 限制为左键点击事件
        if (event.originalEvent.button > 0) {
            return;
        }
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());

        this.drawGeomCanvasHighlight(tileCoordinate, event);
    },

    /** *
     * 绘制点击高亮显示
     * @param tilePoint
     * @param event
     */
    drawGeomCanvasHighlight: function (tilePoint, event) {
        // var x = event.originalEvent.offsetX || event.layerX, y = event.originalEvent.offsetY || event.layerY;
        var transform = new fastmap.mapApi.MecatorTranform();
        var PointLoc = transform.lonlat2Tile(event.latlng.lng, event.latlng.lat, map.getZoom());
        var PointPixel = transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat, map.getZoom());
        PointPixel[0] = Math.ceil(PointPixel[0]);
        PointPixel[1] = Math.ceil(PointPixel[1]);

        var x = PointPixel[0] - 256 * PointLoc[0];
        var y = PointPixel[1] - 256 * PointLoc[1];

        var data = this.tiles[tilePoint[0] + ':' + tilePoint[1]].data;
        // var data = []; //= this.tiles[tilePoint[0] + ':' + tilePoint[1]].data;

        var linksWidthOneNode = [];
        if (this.operationList.length > this.selectedFeatures.length) {
            if (this.operationList[this.selectedFeatures.length] == 'point') {
                // 找出选中点的所有关联link;
                for (var item in data) {
                    var touchids = this._TouchesNodePoint(data[item].geometry.coordinates, x, y, 5);
                    if (touchids.length) {
                        linksWidthOneNode.push(data[item].properties);
                    }
                }
                for (var item in data) {
                    var touchids = this._TouchesNodePoint(data[item].geometry.coordinates, x, y, 5);
                    if (touchids.length) {
                        var id = data[item].properties.id;
                        if (this.selectedFeatures.length == 0 || (this.selectedFeatures.length > 0 && id == this.selectedFeatures[0])) {
                        	this.selectedFeatures.push(id);
                        	if (touchids[0] == 0) {
                                // 查找所有于改点关联的link;

                            this.eventController.fire(this.eventController.eventTypes.GETLINKID, {
                                id: data[item].properties.snode,
                                event: event,
                                properties: data[item].properties,
                                index: this.selectedFeatures.length - 1,
                                links: linksWidthOneNode
                            });
                        } else {
                            this.eventController.fire(this.eventController.eventTypes.GETLINKID, {
                                id: data[item].properties.enode,
                                event: event,
                                properties: data[item].properties,
                                index: this.selectedFeatures.length - 1,
                                links: linksWidthOneNode
                            });
                        }
                        	// 为了保证on到的时候，selectedFeatures中已经放入了选择的feature,所以在fire之前push
                            // this.selectedFeatures.push(id);
                            break;
                        }
                    }
                }
            } else if (this.operationList[this.selectedFeatures.length] == 'line') {
                for (var item in data) {
                    if (this._TouchesPath(data[item].geometry.coordinates, x, y, 5)) {
                        var id = data[item].properties.id;
                        this.selectedFeatures.push(id);
                        this.eventController.fire(this.eventController.eventTypes.GETLINKID, {
                            id: id,
                            event: event,
                            properties: data[item].properties,
                            index: this.selectedFeatures.length - 1
                        });
                        // 为了保证on到的时候，selectedFeatures中已经放入了选择的feature,所以在fire之前push
                        // this.selectedFeatures.push(id);
                        break;
                    }
                }
            }
        } else { // 因为最后一步可以多次选中，所以做了此处理
            if (this.operationList[this.operationList.length - 1] == 'point') {
                // 找出选中点的所有关联link;
                for (var item in data) {
                    var touchids = this._TouchesNodePoint(data[item].geometry.coordinates, x, y, 5);
                    if (touchids.length) {
                        linksWidthOneNode.push(data[item].properties);
                    }
                }
                for (var item in data) {
                    var touchids = this._TouchesNodePoint(data[item].geometry.coordinates, x, y, 5);
                    if (touchids.length) {
                        var id = data[item].properties.id;
                        this.selectedFeatures.push(id);
                        if (id == this.selectedFeatures[0]) {
                            if (touchids[0] == 0) {
                                this.eventController.fire(this.eventController.eventTypes.GETLINKID, {
                                    id: data[item].properties.snode,
                                    event: event,
                                    index: this.selectedFeatures.length - 1,
                                    style: 'node',
                                    links: linksWidthOneNode
                                });
                            } else {
                                this.eventController.fire(this.eventController.eventTypes.GETLINKID, {
                                    id: data[item].properties.enode,
                                    event: event,
                                    index: this.selectedFeatures.length - 1,
                                    style: 'node',
                                    links: linksWidthOneNode
                                });
                            }
                            // 为了保证on到的时候，selectedFeatures中已经放入了选择的feature,所以在fire之前push
                            // this.selectedFeatures.push(id);
                            break;
                        }
                    }
                }
            } else if (this.operationList[this.operationList.length - 1] == 'line') {
                for (var item in data) {
                    if (this._TouchesPath(data[item].geometry.coordinates, x, y, 5)) {
                        var id = data[item].properties.id;
                        this.selectedFeatures.push(id);
                        this.eventController.fire(this.eventController.eventTypes.GETLINKID, {
                            id: id,
                            properties: data[item].properties,
                            index: this.selectedFeatures.length - 1
                        });
                        // 为了保证on到的时候，selectedFeatures中已经放入了选择的feature,所以在fire之前push
                        // this.selectedFeatures.push(id);
                        break;
                    }
                }
            }
        }


        /* if (this.selectedFeatures.length == 1) {
            for (var item in data) {
                var touchids = this._TouchesNodePoint(data[item].geometry.coordinates, x, y, 5)
                if (touchids.length) {
                    var id = data[item].properties.id;

                    if (id == this.selectedFeatures[0]) {
                        if (touchids[0] == 0) {
                            this.eventController.fire(this.eventController.eventTypes.GETLINKID, {
                                id: data[item].properties.snode,
                                event:event,
                                index: this.selectedFeatures.length
                            })
                        } else {
                            this.eventController.fire(this.eventController.eventTypes.GETLINKID, {
                                id: data[item].properties.enode,
                                event:event,
                                index: this.selectedFeatures.length
                            })
                        }
                        var point = data[item].geometry.coordinates[touchids[0]];
                        this.selectedFeatures.push(id);

                        var ctx = {
                            canvas: this.currentEditLayer.tiles[tilePoint[0] + ":" + tilePoint[1]].options.context,
                            tile: tilePoint,
                            zoom: this._map.getZoom()
                        }

                        //this._drawPointHeight(ctx, point);
                    }
                }
            }
        } else {
            for (var item in data) {
                if (this._TouchesPath(data[item].geometry.coordinates, x, y, 5)) {
                    var id = data[item].properties.id;
                    this.eventController.fire(this.eventController.eventTypes.GETLINKID, {
                        id: id,
                        properties:data[item].properties,
                        index: this.selectedFeatures.length
                    })
                    this.selectedFeatures.push(id)
                    //if (this.selectedFeatures.length === 1) {
                    //    this._drawLineHeight(id, {
                    //        strokeWidth: 3,
                    //        strokeColor: '#F63428'
                    //    });
                    //} else {
                    //    this._drawLineHeight(id, {
                    //        strokeWidth: 3,
                    //        strokeColor: '#253B76'
                    //    });
                    //}

                }

            }
        }*/
    },

    /** *
     *
     * @param {Array}d 几何图形
     * @param {number}x 鼠标x
     * @param {number}y 鼠标y
     * @param {number}r 半径
     * @returns {number}
     * @private
     */
    _TouchesPath: function (d, x, y, r) {
        var i;
        var N = d.length;
        var p1x = d[0][0];
        var p1y = d[0][1];
        for (var i = 1; i < N; i += 1) {
            var p2x = d[i][0];
            var p2y = d[i][1];
            var dirx = p2x - p1x;
            var diry = p2y - p1y;
            var diffx = x - p1x;
            var diffy = y - p1y;
            var t = 1 * (diffx * dirx + diffy * diry * 1) / (dirx * dirx + diry * diry * 1);
            if (t < 0) {
                t = 0;
            }
            if (t > 1) {
                t = 1;
            }
            var closestx = p1x + t * dirx;
            var closesty = p1y + t * diry;
            var dx = x - closestx;
            var dy = y - closesty;
            if ((dx * dx + dy * dy) <= r * r) {
                return 1;
            }
            p1x = p2x;
            p1y = p2y;
        }
        return 0;
    },

    /** *
     * 点击node点
     * @param d
     * @param x
     * @param y
     * @param r
     * @returns {number}
     * @private
     */
    _TouchesNodePoint: function (d, x, y, r) {
        var touched = false;
        for (var i = 0, len = d.length; i < len; i++) {
            if (i == 0 || i == len - 1) {
                var dx = x - d[i][0];
                var dy = y - d[i][1];
                if ((dx * dx + dy * dy) <= r * r) {
                    return [i];
                }
            }
        }

        return [];
    },
    /** *
     * 绘制线高亮
     * @param id
     * @private
     */
    _drawLineHeight: function (id, lineStyle) {
        for (var obj in this.tiles) {
            var data = this.tiles[obj].data;

            for (var key in data) {
                if (data[key].properties.id == id) {
                    this.redrawTiles = this.tiles;
                    var ctx = {
                        canvas: this.tiles[obj].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: this._map.getZoom()
                    };
                    this.currentEditLayer._drawLineString(ctx, data[key].geometry.coordinates, true, lineStyle, {
                        color: '#F63428',
                        radius: 3
                    }, data[key].properties);
                }
            }
        }
    },

    _drawPointHeight: function (ctx, point) {
        this.currentEditLayer._drawPoint(ctx, point, {
            color: '#FFFF00',
            radius: 3
        }, true);
    },
    cleanHeight: function () {
        this._cleanHeight();
        // this.currentEditLayer.fire("getId")
    },
    /** *_drawLineString: function (ctx, geom, style, boolPixelCrs) {
     *清除高亮
     */
    _cleanHeight: function () {
        for (var index in this.redrawTiles) {
            var data = this.redrawTiles[index].data;
            if (!data) {
                return;
            }
            this.redrawTiles[index].options.context.getContext('2d').clearRect(0, 0, 256, 256);
            var ctx = {
                canvas: this.redrawTiles[index].options.context,
                tile: this.redrawTiles[index].options.context._tilePoint,
                zoom: this._map.getZoom()
            };
            this.currentEditLayer._drawFeature(data, ctx, true);
        }
    }

});
