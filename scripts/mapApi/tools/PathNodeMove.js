/**
 * Created by zhongxiaoming on 2016/1/13.
 * Class PathNodeMove
 */
fastmap.mapApi.PathNodeMove = L.Handler.extend({
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
        this._map._container.style.cursor = 'pointer';
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndexs = [];
        this.selectCtrl = fastmap.uikit.SelectController();
        this.objectCtrl = fastmap.uikit.ObjectEditController();
        this.linePoints = [];
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
        this.nodeArray = ['RDNODE', 'RWNODE', 'ADNODE', 'LCNODE', 'LUNODE', 'ZONENODE'];// ["RDNODE"];
    },
    /** *
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            L.DomEvent.on(document, 'touchstart', this.onMouseDown, this).on(document, 'touchmove', this.onMouseMove, this).on(document, 'touchend', this.onMouseUp, this);
        }
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);
    },
    /** *
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            L.DomEvent.off(document, 'touchstart', this.onMouseDown, this).off(document, 'touchmove', this.onMouseMove, this).off(document, 'touchend', this.onMouseUp, this);
        }
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);
    },
    /** *
     * 重写disable，加入地图拖动控制
     */
    disable: function () {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /** *
     * 鼠标按下处理事件
     * @param event
     */
    onMouseDown: function (event) {
        // button：0.左键,1.中键,2.右键
        // 限制为左键点击事件
        if (event.originalEvent.button > 0) {
            return;
        }
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
                this.targetIndexs.push(j + '-' + k);
            } else {
                k = points[j].components.length - 1;
                disAB = this.distance(this._map.latLngToLayerPoint([points[j].components[k].y, points[j].components[k].x]), layerPoint);
                if (disAB > 0 && disAB < 5) {
                    this.targetIndexs.push(j + '-' + k);
                }
            }
        }
        if (this.targetIndexs.length == points.length) {
            this.targetIndex = this.targetIndexs.length;
            this.snapHandler.setTargetIndex(this.targetIndex);
        } else {
            this.targetIndexs.length = 0;
        }

        // 计算图幅的四个顶角
        if ((this.nodeArray.indexOf(this.objectCtrl.data.geoLiveType) > -1) && this.objectCtrl.data.meshes.length == 2) { // 增加对于图廓点的特殊控制
            var temp = new fastmap.mapApi.GridLayer();
            var arr1 = temp.Calculate25TMeshBorder(this.objectCtrl.data.meshes[0].meshId + '');
            var arr2 = temp.Calculate25TMeshBorder(this.objectCtrl.data.meshes[1].meshId + '');
            this.linePoints = this.calculateSameLine([{ x: arr1.maxLat, y: arr1.maxLon }, { x: arr1.minLat, y: arr1.minLon }], [{ x: arr2.maxLat, y: arr2.maxLon }, { x: arr2.minLat, y: arr2.minLon }]);
        }
    },
    onMouseMove: function (event) {
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
        };
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },
    onMouseUp: function (event) {
        // 增加图廓点只能在图廓线上移动的控制 --------begin----------
        if ((this.nodeArray.indexOf(this.objectCtrl.data.geoLiveType) > -1) && this.objectCtrl.data.meshes.length == 2) { // 增加对于图廓点的特殊控制
            var point = L.LineUtil.closestPointOnSegment(L.point(event.latlng.lat, event.latlng.lng), L.point(this.linePoints[0].x, this.linePoints[0].y), L.point(this.linePoints[1].x, this.linePoints[1].y));
            this.targetPoint.lat = point.x;
            this.targetPoint.lng = point.y;
            for (var i in this.targetIndexs) {
                this.resetVertex(this.targetIndexs[i], this.targetPoint);
            }
            var node = this.selectCtrl.selectedFeatures;
            this.selectCtrl.selectedFeatures = {
                id: node.id,
                latlng: this.targetPoint
            };
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
        // -------end------

        this.targetIndex = 0;
        this.snapHandler.setTargetIndex(this.targetIndex);
        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
    },
    // 两点之间的距离
    distance: function (pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },
    /**
     * 根据传递两个矩形的两组对角坐标获取公共线坐标
     */
    calculateSameLine: function (arrA, arrB) {
        var rectA = [{ x: arrA[0].x, y: arrA[0].y }, { x: arrA[0].x, y: arrA[1].y }, { x: arrA[1].x, y: arrA[0].y }, { x: arrA[1].x, y: arrA[1].y }];
        var rectB = [{ x: arrB[0].x, y: arrB[0].y }, { x: arrB[0].x, y: arrB[1].y }, { x: arrB[1].x, y: arrB[0].y }, { x: arrB[1].x, y: arrB[1].y }];
        var arrCommon = [];
        // var sPoint = {},ePoint = {};
        for (var i = 0; i < 4; i++) { // 只会有4个点
            for (var j = 0; j < 4; j++) {
                if ((rectA[i].x == rectB[j].x) && (rectA[i].y == rectB[j].y)) {
                    arrCommon.push(rectA[i]);
                }
            }
        }
        return arrCommon;
    },
    /** *
     * 重新设置节点
     */
    resetVertex: function (index, targetPoint) {
        var geom = this.shapeEditor.shapeEditorResult.getFinalGeometry();
        if (geom.type == 'MultiPolyline') {
            geom.coordinates[index.split('-')[0]].components.splice(index.split('-')[1], 1, fastmap.mapApi.point(targetPoint.lng, targetPoint.lat));
        } else {
            geom.components.splice(index.split('-')[1], 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
        }
    }
});
