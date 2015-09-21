/**
 * Created by zhongxiaoming on 2015/9/2.
 * Class WholeLayer 整福地图图层由一个canvas组成
 */
fastmap.mapApi.WholeLayer = fastmap.mapApi.Layer.extend({

    /***
     *
     * @param options 初始化可选options
     */
    initialize: function (options) {
        this.options = options || {};
        fastmap.mapApi.Layer.prototype.initialize.call(this, options);
    },

    /***
     * 图层添加到地图时调用
     * @param map
     */
    onAdd: function (map) {
        this.map = map;
        this._initContainer(this.map, this.options);
        map.on("moveend", this._redraw, this);
        this._redraw();
    },

    /***
     * 图层被移除时调用
     * @param map
     */
    onRemove: function (map) {
        map.getPanes().overlayPane.removeChild(this._div);
        map.off("moveend", this._redraw, this);
    },

    /***
     * 初始化图层容器
     * @param options
     * @private
     */
    _initContainer: function (options) {
        var container = L.DomUtil.create('div', 'leaflet-wholelayer-container');
        container.style.position = 'absolute';
        container.style.width = this.map.getSize().x + "px";
        container.style.height = this.map.getSize().y + "px";
        this._div = container;
    },

    /***
     * 绘制图层内容
     */
    draw: function () {
    },

    /***
     * 重绘图层
     * @private
     */
    _redraw: function () {
        this._resetCanvasPosition();
    },

    /***
     * 清空图层
     */
    clear: function () {
    },

    /***
     * 重新调整图层位置
     * @private
     */
    _resetCanvasPosition: function () {
        var bounds = this.map.getBounds();
        var topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(this._div, topLeft);
    }

});
fastmap.mapApi.wholeLayer=function(options) {
    return new fastmap.mapApi.WholeLayer(options);
};
