/**
 * Created by linglong on 2015/11/21.
 * Class UpdateAdminPoint
 */

fastmap.mapApi.UpdateAdminPoint = L.Handler.extend({

    /** *
     *
     * @param {Object}options
     */
    initialize: function (options) {
        var layerCtrl = fastmap.uikit.LayerController();
        this.currentEditLayer = layerCtrl.getLayerById('rdLink');
        this.tiles = this.currentEditLayer.tiles;
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._map._container.style.cursor = 'pointer';
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndexs = [];
        this.resultData = null;
        this.selectCtrl = fastmap.uikit.SelectController();
        this.eventController = fastmap.uikit.EventController();
        this.captureHandler = new fastmap.mapApi.Capture(
            {
                map: this._map,
                shapeEditor: this.shapeEditor,
                selectedCapture: false,
                captureLine: true
            }
        );
        this.captureHandler.enable();
        this.validation = fastmap.uikit.geometryValidation(
            {
                transform: new fastmap.mapApi.MecatorTranform()
            }
        );
    },

    /** *
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('tap', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
    },

    /** *
     * 移除事件
     */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
    },

    onMouseMove: function (event) {
        this.captureHandler.setTargetIndex(0);
        this.container.style.cursor = 'pointer';
        this.targetPoint = this._map.layerPointToLatLng(event.layerPoint);
        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry();
        if(this.resultData && JSON.stringify(this.resultData) != "{}"){
            points.components[0].x = this.resultData.lng;
            points.components[0].y = this.resultData.lat;
        }else if(this.resultData && JSON.stringify(this.resultData) == "{}"){
            points.components[0].x = points.components[0].x;
            points.components[0].y = points.components[0].y;
        } else{
            points.components[0].x = this.targetPoint.lng;
            points.components[0].y = this.targetPoint.lat;
        }
        if (this.captureHandler.captured) {
            points.components[1].x = this.captureHandler.captureLatlng[0];
            points.components[1].y = this.captureHandler.captureLatlng[1];
            points.guideLink = this.captureHandler.properties.id;
            this.shapeEditor.shapeEditorResult.setFinalGeometry(points);
        }
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseDown: function (event) {
        this.resultData = this._map.layerPointToLatLng(event.layerPoint);
    }

});
