/**
 * Created by zhongxiaoming on 2016/1/13.
 * Class PathNodeMove
 */

fastmap.uikit.PathNodeMove = L.Handler.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

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
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.targetIndexs = [];
        this.selectCtrl = fastmap.uikit.SelectController();
        this.snapHandler = new fastmap.uikit.Snap({map:this._map,shapeEditor:this.shapeEditor,selectedSnap:false,snapLine:true,snapNode:true,snapVertex:false});
        this.snapHandler.enable();
        this.snapHandler.addGuideLayer(new fastmap.uikit.LayerController({}).getLayerById('referenceLine'));
        this.validation =fastmap.uikit.geometryValidation({transform: new fastmap.mapApi.MecatorTranform()});
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

    /***
     * 重写disable，加入地图拖动控制
     */
    disable: function () {
        if (!this._enabled) { return; }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /***
     * 鼠标按下处理事件
     * @param event
     */
    onMouseDown: function (event) {
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;

        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry();

        for (var j = 0, len = points.coordinates.length; j < len; j++) {

            for(var k= 0,length = points.coordinates[j].length; k<length; k++){
                //if(j != 0 && j !=len-1){
                var disAB = this.distance(this._map.latLngToContainerPoint([points.coordinates[j][k].y,points.coordinates[j][k].x]), layerPoint);

                if (disAB > 0 && disAB < 5) {

                    this.targetIndexs.push(j+"-"+k);
                    //that.resetVertex(j,layerPoint);
                }
                //}
            }


        }
        this.targetIndex = this.targetIndexs.length;
        this.snapHandler.setTargetIndex(this.targetIndex);
    },

    onMouseMove: function (event) {

        this.container.style.cursor = 'pointer';


        this.container.style.cursor = 'pointer';
        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        var layerPoint = event.containerPoint;
        if(this.targetIndex == 0){
            return;
        }
        this.targetIndex = this.targetIndexs.length;
        this.targetPoint = event.latlng;




        //if(this.snapHandler.snaped == true){
        //    this.shapeEditor.fire('snaped',{'snaped':true});
        //    this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1],this.snapHandler.snapLatlng[0])
        //}else{
        //    this.shapeEditor.fire('snaped',{'snaped':false});
        //}
        for(var i in this.targetIndexs){
            this.resetVertex(this.targetIndexs[i],this.targetPoint);
        }
        var node = this.selectCtrl.selectedFeatures;
        this.selectCtrl.selectedFeatures = {id:node.id,latlng:this.targetPoint}

        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    },

    onMouseUp: function(event){
        this.targetIndex = 0;
        this.snapHandler.setTargetIndex(this.targetIndex);
        this.shapeEditor.shapeEditorResultFeedback.stopFeedback();
    },

    //两点之间的距离
    distance:function(pointA, pointB) {
        var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
        return Math.sqrt(len);
    },

    /***
     * 重新设置节点
     */
    resetVertex:function(index ,targetPoint){
        //for(var i in this.shapeEditor.shapeEditorResult.getFinalGeometry().components){
        //    this.shapeEditor.shapeEditorResult.getFinalGeometry().components[index].splice(index, 1, fastmap.mapApi.point(targetPoint.lng, targetPoint.lat));
        //}

        this.shapeEditor.shapeEditorResult.getFinalGeometry().coordinates[index.split('-')[0]].splice(index.split('-')[1], 1, fastmap.mapApi.point(targetPoint.lng, targetPoint.lat));
        //var distance =0 , distance1 = this.targetIndex!=0?0:this.validation.caculationDistance(this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex-1],this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex]),
        //    distance2 = this.targetIndex!=this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length-1?this.validation.caculationDistance(this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex+1],this.shapeEditor.shapeEditorResult.getFinalGeometry().components[this.targetIndex]):0;
        //distance = distance1<distance2?distance1:distance2
        //if(distance < 2){
        //    console.log('形状点之间距离不能小于2米！')
        //}

    }
})