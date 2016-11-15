/**
 * Created by zhongxiaoming on 2015/9/18.
 * Class PathVertexInsert
 */
fastmap.mapApi.PathBreak = L.Handler.extend({
    /** *
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this.eventController = fastmap.uikit.EventController();
        this.snapHandler = new fastmap.mapApi.Snap({
            map: this._map,
            shapeEditor: this.shapeEditor,
            selectedSnap: true,
            snapLine: true,
            snapVertex: true
        });
        this.snapHandler.enable();
        this.validation = fastmap.uikit.geometryValidation({
            transform: new fastmap.mapApi.MecatorTranform()
        });
        this.breakPointIndex = 0;
    },
    /** *
     * 添加事件处理
     */
    addHooks: function () {
        this.breakPointIndex = 0;
        this._map.on('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            this._map.on('click', this.onMouseDown, this);
        }
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.dragging.disable();
    },
    /** *
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            this._map.off('click', this.onMouseDown, this);
        }
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.dragging.enable();
    },
    onMouseDown: function (event) {
        // button：0.左键,1.中键,2.右键
        // 限制为左键点击事件
        if (event.originalEvent.button > 0) {
            return;
        }
        var layerPoint = event.layerPoint;
        if (this.snapHandler.snaped) {
            layerPoint = this._map.latLngToLayerPoint(this.targetPoint);
            var bp = this.resetVertex(layerPoint);
            if (bp) {
                this.shapeEditor.shapeEditorResultFeedback.setupFeedback({
                    changeTooltips: true
                });
                this.eventController.fire('breakPointAdded', {
                    point: bp
                });
            }
            // this.disable();
        }
        // else {
        //     this.snapHandler.targetindex = -1;
        //     this.snapHandler.onMouseMove(event);
        //     // this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1], this.snapHandler.snapLatlng[0]);
        //     // layerPoint = this._map.latLngToLayerPoint(this.targetPoint);
        //     // this.resetVertex(layerPoint);
        //     this.targetPoint = L.latLng(event.latlng.lat, event.latlng.lng);
        //     this.resetVertex(this._map.latLngToLayerPoint(this.targetPoint));
        //     this.shapeEditor.shapeEditorResultFeedback.setupFeedback({
        //         changeTooltips: true
        //     });
        //     // this.disable();
        // }
    },
    onMouseMove: function (event) {
        this.snapHandler.setTargetIndex(0);
        if (this.snapHandler.snaped) {
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1], this.snapHandler.snapLatlng[0]);
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({
                point: {
                    x: this.targetPoint.lng,
                    y: this.targetPoint.lat
                }
            });
            this.eventController.fire(this.eventController.eventTypes.SNAPED, {
                snaped: true
            });
        } else {
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
            this.eventController.fire(this.eventController.eventTypes.SNAPED, {
                snaped: false
            });
        }
    },
    // 两点之间的距离
    distance: function (pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },
    resetVertex: function (layerPoint) {
        var breakPoint,
            obp;
        var finalGeom = this.shapeEditor.shapeEditorResult.getFinalGeometry();
        if (this.breakPointIndex > 0) {
            obp = finalGeom.components.splice(this.breakPointIndex, 1);
        }
        var segments = finalGeom.getSortedSegments();
        var minDist = 1000,
            minObj = {},
            sp1,
            sp2,
            dist;
        for (var i = 0, len = segments.length; i < len; i++) {
            sp1 = this._map.latLngToLayerPoint(L.latLng(segments[i].y1, segments[i].x1));
            sp2 = this._map.latLngToLayerPoint(L.latLng(segments[i].y2, segments[i].x2));
            dist = L.LineUtil.pointToSegmentDistance(layerPoint, sp1, sp2);
            if (dist < minDist) {
                minDist = dist;
                minObj.index = i;
                minObj.sp = sp1;
                minObj.ep = sp2;
            }
        }
        if (minObj.index != undefined) {
            breakPoint = this._map.layerPointToLatLng(L.LineUtil.closestPointOnSegment(layerPoint, minObj.sp, minObj.ep));
            var d1 = breakPoint.distanceTo(this._map.layerPointToLatLng(minObj.sp));
            var d2 = breakPoint.distanceTo(this._map.layerPointToLatLng(minObj.ep));
            if (d1 >= 2 && d2 >= 2) {
                this.breakPointIndex = minObj.index + 1;
            } else if (d1 <= d2) {
                if (minObj.index == 0) {
                    breakPoint = null;
                } else {
                    breakPoint = this._map.layerPointToLatLng(minObj.sp);
                    this.breakPointIndex = minObj.index + 1;
                }
            } else if (minObj.index == segments.length - 1) {
                breakPoint = null;
            } else {
                breakPoint = this._map.layerPointToLatLng(minObj.ep);
                this.breakPointIndex = minObj.index + 1;
            }
        }
        if (breakPoint) {
            finalGeom.components.splice(this.breakPointIndex, 0, fastmap.mapApi.point(breakPoint.lng, breakPoint.lat));
            this.shapeEditor.shapeEditorResult.setFinalGeometry(finalGeom);
        } else if (obp) {
            finalGeom.components.splice(this.breakPointIndex, 0, obp[0]);
            this.shapeEditor.shapeEditorResult.setFinalGeometry(finalGeom);
        }
    }
});
