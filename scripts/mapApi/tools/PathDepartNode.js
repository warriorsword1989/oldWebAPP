/**
 * Created by linglong on 2016/1/13.
 * Class PathDepartNode
 */
fastmap.mapApi.pathDepartNode = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function(options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._map._container.style.cursor = 'pointer';
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndexs = [];
        this.eventController = fastmap.uikit.EventController();
        this.selectCtrl = fastmap.uikit.SelectController();
        this.snapHandler = new fastmap.mapApi.Snap({
            map: this._map,
            shapeEditor: this.shapeEditor,
            selectedSnap: false,
            snapLine: true,
            snapNode: true,
            snapVertex: false
        });
        this.snapHandler.enable();
        this.validation = fastmap.uikit.geometryValidation({
            transform: new fastmap.mapApi.MecatorTranform()
        });
    },
    /***
     * 添加事件处理
     */
    addHooks: function() {
        this._map.on('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            L.DomEvent.on(document, 'touchstart', this.onMouseDown, this).on(document, 'touchmove', this.onMouseMove, this).on(document, 'touchend', this.onMouseUp, this);
        }
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
    },
    /***
     * 移除事件
     */
    removeHooks: function() {
        this._map.off('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            L.DomEvent.off(document, 'touchstart', this.onMouseDown, this).off(document, 'touchmove', this.onMouseMove, this).off(document, 'touchend', this.onMouseUp, this);
        }
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
    },
    /***
     * 重写disable，加入地图拖动控制
     */
    disable: function() {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 鼠标按下处理事件
     * @param event
     */
    onMouseDown: function(event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        this.targetIndexs.length = 0;
        var layerPoint = event.layerPoint;
        var geom = this.shapeEditor.shapeEditorResult.getFinalGeometry();
        var points;
        if (geom.type == 'MultiPolyline') {
            points = geom.coordinates;
        } else {
            points = [geom];
        }
        // var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().coordinates;
        var distAB = 0,
            k = 0;
        for (var j = 0, len = points.length; j < len; j++) {
            k = 0;
            disAB = this.distance(this._map.latLngToLayerPoint([points[j].components[k].y, points[j].components[k].x]), layerPoint);
            if (disAB > 0 && disAB < 5) {
                this.targetIndexs.push(j + "-" + k);
            } else {
                k = points[j].components.length - 1;
                disAB = this.distance(this._map.latLngToLayerPoint([points[j].components[k].y, points[j].components[k].x]), layerPoint);
                if (disAB > 0 && disAB < 5) {
                    this.targetIndexs.push(j + "-" + k);
                }
            }
        }
        if (this.targetIndexs.length == points.length) {
            this.targetIndex = this.targetIndexs.length;
            this.snapHandler.setTargetIndex(this.targetIndex);
        } else {
            this.targetIndexs.length = 0;
        }
    },

    onMouseMove: function(event) {
        this.container.style.cursor = 'pointer';
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.containerPoint;
        if (this.targetIndex == 0) {
            return;
        }
        this.targetIndex = this.targetIndexs.length;
        this.targetPoint = event.latlng;
        for (var i in this.targetIndexs) {
            this.resetVertex(this.targetIndexs[i], this.targetPoint);
        }
        var node = this.selectCtrl.selectedFeatures;
        this.selectCtrl.selectedFeatures = {
            id: node.id,
            latlng: this.targetPoint
        }
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseUp: function(event) {
        this.targetIndex = 0;
        this.snapHandler.setTargetIndex(this.targetIndex);
        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
    },

    //两点之间的距离
    distance: function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },
    /***
     * 重新设置节点
     */
    resetVertex: function(index, targetPoint) {
        var geom = this.shapeEditor.shapeEditorResult.getFinalGeometry();
        if (geom.type == 'MultiPolyline') {
            geom.coordinates[index.split('-')[0]].components.splice(index.split('-')[1], 1, fastmap.mapApi.point(targetPoint.lng, targetPoint.lat));
        } else {
            geom.components.splice(index.split('-')[1], 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
        }
    }
})