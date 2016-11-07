/**
 * Created by zhongxiaoming on 2015/9/16.
 * 平滑修行
 * Class PathSmooth
 */
fastmap.mapApi.PathSmooth = L.Handler.extend({
    /***
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
            snapVertex: true,
            snapNode:true
        });
        this.snapHandler.enable();
        this.validation = fastmap.uikit.geometryValidation({
            transform: new fastmap.mapApi.MecatorTranform()
        });
        //用于区分click与mousedown；当鼠标按下并有移动时为mousedown拖动；否则为click
        this.isMouseDown = false;
        this.isMouseDownMove = false;
    },
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 添加事件处理
     */
    addHooks: function () {

        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
        this._map.on('mouseup', this.onMouseUp, this);

    },

    /***
     * 移除事件
     */
    removeHooks: function () {

        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
        this._map.off('mouseup', this.onMouseUp, this);

    },


    onMouseDown: function (event) {
        // button：0.左键,1.中键,2.右键
        // 限制为左键点击事件
        if (event.originalEvent.button > 0) {
            return;
        }
        if (this.snapHandler.snaped) {
            //var layerPoint = event.layerPoint;
            this.resetVertex(this._map.latLngToLayerPoint(this.targetPoint));
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({
                changeTooltips: true
            });
        } else {
            // this.snapHandler.targetindex=-1;
            // this.snapHandler.onMouseMove(event);
            // if(this.snapHandler.snaped){
            //     this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0]);
            //     layerPoint = this._map.latLngToLayerPoint(this.targetPoint);
            //     this.resetVertex(layerPoint);
            //
            //     this.shapeEditor.shapeEditorResultFeedback.setupFeedback({changeTooltips:true});
            //     this.disable();
            //     this.snapHandler.snaped=false;
            // }
            //解决移动后不能新增形状点的问题
            this.snapHandler.targetindex = -1;
            this.snapHandler.onMouseMove(event);
            this.targetPoint = L.latLng(event.latlng.lat, event.latlng.lng);
            this.resetVertex(this._map.latLngToLayerPoint(this.targetPoint));
        }

    },

    onMouseMove: function (event) {

        if(this.isMouseDown){
            this.isMouseDownMove = true;
            this.container.style.cursor = 'pointer';
            if (this._mapDraggable) {
                this._map.dragging.disable();
            }
            var layerPoint = event.layerPoint;
            this.targetPoint = this._map.layerPointToLatLng(layerPoint);
            if(this.targetIndex == null){
                return;
            }

            var that = this;

            if(this.snapHandler.snaped == true){
                this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':true});
                this.snapHandler.targetIndex = this.targetIndex;
                this.selectCtrl.setSnapObj(this.snapHandler);
                this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])

            }else{
                this.eventController.fire(this.eventController.eventTypes.SNAPED,{'snaped':false});

            }

            that.resetVertex(layerPoint);

            that.shapeEditor.shapeEditorResultFeedback.setupFeedback({index:that.targetIndex});

        }

    },

    onMouseUp: function (event) {
        if(this.isMouseDown){
            this.isMouseDown = false;
            this.isMouseDownMove = false;
        }
    },

    onClick: function (event) {
        console.log('-----------')
        //判断点击的位置是否有node或是节点
        if(!this.isMouseDownMove ){
            if (event.originalEvent.button > 0) {
                return;
            }
            if (this.snapHandler.snaped) {

                this.resetVertex(this._map.latLngToLayerPoint(this.targetPoint));
                this.shapeEditor.shapeEditorResultFeedback.setupFeedback({
                    changeTooltips: true
                });
            } else {

                //解决移动后不能新增形状点的问题
                this.snapHandler.targetindex = -1;
                this.snapHandler.onMouseMove(event);
                this.targetPoint = L.latLng(event.latlng.lat, event.latlng.lng);
                this.resetVertex(this._map.latLngToLayerPoint(this.targetPoint));
            }
        }

    },
    //两点之间的距离
    distance: function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    resetVertex: function(layerPoint) {
        var index = 0;
        var segments = this.shapeEditor.shapeEditorResult.getFinalGeometry().getSortedSegments();
        for (var i = 0, len = segments.length; i < len; i++) {
            var distance = L.LineUtil.pointToSegmentDistance(layerPoint, this._map.latLngToLayerPoint(L.latLng(segments[i].y1, segments[i].x1)), this._map.latLngToLayerPoint(L.latLng(segments[i].y2, segments[i].x2)))
            if (distance < 5) {
                latlng = this._map.layerPointToLatLng(L.LineUtil.closestPointOnSegment(layerPoint, this._map.latLngToLayerPoint(L.latLng(segments[i].y1, segments[i].x1)), this._map.latLngToLayerPoint(L.latLng(segments[i].y2, segments[i].x2))));
                index = i;
                //增加对形状点之间不能小于2米的判断
                var currentPoint = L.latLng(latlng.lat, latlng.lng);
                var point1 = L.latLng(segments[i].y1, segments[i].x1);
                var point2 = L.latLng(segments[i].y2, segments[i].x2);
                var dis1 = currentPoint.distanceTo(point1);
                var dis2 = currentPoint.distanceTo(point2);
                if (dis1 < 2 || dis2 < 2) {
                    this.tooltipsCtrl.setCurrentTooltip('<span style="color: red">相邻两个形状点之间距离至少2米！</span>');
                    break;
                }
                this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(index + 1, 0, fastmap.mapApi.point(latlng.lng, latlng.lat))
                this.shapeEditor.shapeEditorResult.setFinalGeometry(this.shapeEditor.shapeEditorResult.getFinalGeometry());
            }
        }
    }
})