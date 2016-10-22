/**
 * Created by liuyang on 2016/10/20.
 * Class SelectGSC
 */
fastmap.uikit.SelectGSC = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,
    /***
     *
     * @param {Object}options
     */
    initialize: function(options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.map;
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.eventController = new fastmap.uikit.EventController();
        this.selectCtrl = new fastmap.uikit.SelectController();
        this.layerCtrl = new fastmap.uikit.LayerController();
        this.selectLayers = this.layerCtrl.getLayerById('edit');
        this.popup = L.popup();
        // this.selectLayers = this.options.selectLayers;
        // this._setSnapHandler(this.options.snapLayers);
    },

    /***
     * 开启捕捉
     * @param {type} 捕捉的图层
     */
    _setSnapHandler: function(layers) {
        this.snapHandler = new fastmap.mapApi.Snap({
            map: this._map,
            shapeEditor: this.shapeEditor,
            snapLine: true,
            snapNode: true,
            snapVertex: false
        });
        for (var i = 0; i < layers.length; i++) {
            this.snapHandler.addGuideLayer(layers[i]);
        }
        this.snapHandler.enable();
    },
    /***
     * 添加事件处理
     */
    addHooks: function() {
        this._map.on('click', this.onMouseDown_np, this);
        if (L.Browser.touch) {
            this._map.on('click', this.onMouseDown_np, this);
            this.snapHandler.disable();
        }
    },
    /***
     * 移除事件
     */
    removeHooks: function() {
        this._map.off('click', this.onMouseDown_np, this);
        if (L.Browser.touch) {
            this._map.off('click', this.onMouseDown_np, this);
        }
    },

    onMouseDown_np: function(event) {
        var selectFeatures = [];
        var x = event.containerPoint.x,
            y = event.containerPoint.y;
        var geoData = this.selectLayers.drawGeometry.geos.conPoints;
        for(var i = 0;i<geoData.length;i++){
            if (this._TouchesPath(geoData[i], x, y, 5)) {
                selectFeatures.push({
                    index: i,
                    event: event,
                    drawGeometry: this.selectLayers.drawGeometry
                });
            }
        }
        if(selectFeatures.length >0){
            this.selectCtrl.selectedFeatures = selectFeatures[0];
            this.eventController.fire(this.eventController.eventTypes.GETEDITDATA, selectFeatures[0]);
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
    _TouchesPath: function(d, x, y, r) {
        var i;
        var N = d.length;
        var p1x = d[0].x;
        var p1y = d[0].y;
        for (var i = 1; i < N; i += 1) {
            var p2x = d[i].x;
            var p2y = d[i].y;
            var dirx = p2x - p1x;
            var diry = p2y - p1y;
            var diffx = x - p1x;
            var diffy = y - p1y;
            var t = 1 * (diffx * dirx + diffy * diry * 1) / (dirx * dirx + diry * diry * 1);
            if (t < 0) {
                t = 0
            }
            if (t > 1) {
                t = 1
            }
            var closestx = p1x + t * dirx;
            var closesty = p1y + t * diry;
            var dx = x - closestx;
            var dy = y - closesty;
            if ((dx * dx + dy * dy) <= r * r) {
                return 1
            }
            p1x = p2x;
            p1y = p2y
        }
        return 0
    }
});