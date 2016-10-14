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
        this.nodePid = null;
        this.selectedIndex = null;
        this.eventController = fastmap.uikit.EventController();
        this.selectCtrl = fastmap.uikit.SelectController();
        //配置要扑捉的图层;
        this.snapHandler = new fastmap.mapApi.Snap({
            map: this._map,
            shapeEditor: this.shapeEditor,
            selectedSnap: false,
            snapLine: false,
            snapNode: true,
            snapVertex: false
        });
        this.snapHandler.enable();
        this.snapHandler.addGuideLayer(new fastmap.uikit.LayerController().getLayerById('rdNode'));
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
        this.targetIndex = 0;
        var layerPoint = event.layerPoint;
        var geom = this.shapeEditor.shapeEditorResult.getFinalGeometry();
        var points = [];
        points.push(geom.components[0]);
        points.push(geom.components[geom.components.length -1]);
        var distAB = 0,
            k = 0;
        for (var j = 0, len = points.length; j < len; j++) {
            disAB = this.distance(this._map.latLngToLayerPoint([points[j].y, points[j].x]), layerPoint);
            if (disAB > 0 && disAB < 5) {
                this.targetIndex = j+1;
            }
        }
        if( this.selectedIndex && this.targetIndex -1 != this.selectedIndex){//只能移动第一次捕捉的端点
            this.targetIndex = 0;
            return;
        }
        this.snapHandler.setTargetIndex(this.targetIndex);
    },

    onMouseMove: function(event) {
        this.container.style.cursor = 'pointer';
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.containerPoint;
        if (this.targetIndex == 0 || this.targetIndex == undefined) {
            return;
        }
        // this.targetIndex = this.targetIndexs.length;

        if(this.snapHandler.snaped == true){
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':true});
            // this.snapHandler.targetIndex = this.targetIndex;
            // this.selectCtrl.setSnapObj(this.snapHandler);
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])

        }else{
            this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':false});
            this.targetPoint = event.latlng;
        }

        this.resetVertex(this.targetIndex-1, this.targetPoint);
        if(this.targetIndex-1 == 0){
            this.selectedIndex = 0;
            this.nodePid = this.selectCtrl.selectedFeatures.snode;
        } else {
            this.selectedIndex = 1;
            this.nodePid = this.selectCtrl.selectedFeatures.enode;
        }
        // for (var i in this.targetIndexs) {
        //     this.resetVertex(i, this.targetPoint);
        // }
        // var node = this.selectCtrl.selectedFeatures;
        this.selectCtrl.selectedFeatures.catchNodePid = this.snapHandler.snaped ? this.snapHandler.properties.id : 0;
        this.selectCtrl.selectedFeatures.workLinkPid = this.selectCtrl.workLinkPid;
        this.selectCtrl.selectedFeatures.id = this.nodePid;
        this.selectCtrl.selectedFeatures.latlng = this.snapHandler.snaped ? null : this.targetPoint;
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
        if (index == 1) {
            geom.components.splice(geom.components.length -1, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
        } else {
            geom.components.splice(0, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
        }
    }
})