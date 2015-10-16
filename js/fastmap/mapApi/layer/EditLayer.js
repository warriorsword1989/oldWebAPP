/**
 * Created by zhongxiaoming on 2015/10/13.
 * Class EditLayer 可编辑图层
 */
fastmap.mapApi.EditLayer = fastmap.mapApi.WholeLayer.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    /***
     * 初始化可选参数
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        fastmap.mapApi.WholeLayer.prototype.initialize(this, options);
        this.minShowZoom = this.options.minShowZoom || 9;
        this.maxShowZoom = this.options.maxShowZoom || 18;
        this.initEvent();
        this.drawGeometry = null;
    },

    initEvent: function () {
        var that = this;
        this.shapEditor =  fastmap.uikit.ShapeEditorController();

        this.shapEditor.on('startshapeeditresultfeedback',delegateDraw );
        function delegateDraw(){
            if(that.shapEditor.shapeEditorResult == null){
                return;
            }
            that.drawGeometry = that.shapEditor.shapeEditorResult.getFinalGeometry();
            that.draw(that.drawGeometry,that);
        }

        this.shapEditor.on('stopshapeeditresultfeedback',function(){

        });


        this.shapEditor.on('abortshapeeditresultfeedback',function(){
            that.drawGeometry = that.shapEditor.shapeEditorResult.getOriginalGeometry();
            that.shapEditor.shapeEditorResult.setFinalGeometry(that.drawGeometry.clone());

            that._redraw()
        });
    },
    /***
     * 图层添加到地图时调用
     * @param{L.Map} map
     */
    onAdd: function (map) {
        this.map = map;
        this._initContainer(this.map, this.options);
        map.on("moveend", this._redraw, this);
        this._redraw();
    },

    /***
     * 图层被移除时调用
     * @param {L.Map}map
     */
    onRemove: function (map) {
        map.getPanes().overlayPane.removeChild(this._div);
        map.off("moveend", this._redraw, this);
    },
    draw: function (currentGeo,self) {
        if(!currentGeo){
            return;
        }
        this.drawGeometry = currentGeo;
        switch(this.drawGeometry.type) {
            case 'LineString':
                drawLineString(currentGeo.points, {color: 'red', size: 2}, false);
                break;
            case 'Point':
                drawPoint(currentGeo.points, {color: 'red', radius: 3}, false);
                break;
            case'Polygon':
                drawPolygon();
                break;
        }


        function drawPoint( geom, style, boolPixelCrs) {
            if (!geom) {
                return;
            }
            var p = null;
            if(boolPixelCrs){
                p = {x:geom.x, y:geom.y}
            }else{
                p = this.map.latLngToLayerPoint([geom.y, geom.x]);
            }

            var g = self._ctx;
            g.beginPath();
            g.fillStyle = style.color;
            g.arc(p.x, p.y, style.radius, 0, Math.PI * 2);
            g.closePath();
            g.fill();
            g.restore();
        }


        function drawLineString(geom, style, boolPixelCrs) {
            if (!geom) {
                return;
            }

            var  proj = [], i;
            //coords = this._clip(ctx, coords);
            //coords = L.LineUtil.simplify(coords, 1);
            for (i = 0; i < geom.length; i++) {
                if(boolPixelCrs){
                    proj.push({x:geom[i][0],y:geom[i][1]});
                }else{
                    proj.push(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]));
                    drawPoint(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]),{color:'red', radius:3},true)
                }
            }
            //if (!this._isActuallyVisible(proj)) {
            //    return;
            //}
            var g = self._ctx;
            g.strokeStyle = style.color;
            g.lineWidth = style.size;
            g.beginPath();
            for (i = 0; i < proj.length; i++) {
                var method = (i === 0 ? 'move' : 'line') + 'To';
                g[method](proj[i].x, proj[i].y);
            }
            g.stroke();
            g.restore();
        }
        function drawPolygon( geom, style) {
            if (!style) {
                return;
            }

            for (var el = 0; el < geom.length; el++) {
                var coords = geom[el], proj = [], i;
                coords = this._clip(ctx, coords);
                for (i = 0; i < coords.length; i++) {
                    proj.push(this._tilePoint(ctx, coords[i]));
                }
                if (!this._isActuallyVisible(proj)) {
                    continue;
                }

                var g = ctx.canvas.getContext('2d');
                var outline = style.outline;
                g.fillStyle = style.color;
                if (outline) {
                    g.strokeStyle = outline.color;
                    g.lineWidth = outline.size;
                }
                g.beginPath();
                for (i = 0; i < proj.length; i++) {
                    var method = (i === 0 ? 'move' : 'line') + 'To';
                    g[method](proj[i].x, proj[i].y);
                }
                g.closePath();
                g.fill();
                if (outline) {
                    g.stroke();
                }
            }
        }

    },

    /***
     * 清空图层
     */
    clear: function () {
        this.canv.getContext("2d").clearRect(0, 0, this.canv.width, this.canv.height);
    },

    _redraw: function (){

        this.clear();

        this.draw(this.drawGeometry, this);
        this._resetCanvasPosition()
        return this;
    }
});