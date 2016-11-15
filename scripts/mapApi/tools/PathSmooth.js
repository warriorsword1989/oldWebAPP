/**
 * Created by zhongxiaoming on 2016/11/9.
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
      selectedSnap: false,
      snapLine: true,
      snapVertex: true,
      snapNode: true
    });
    this.snapHandler.addGuideLayer(new fastmap.uikit.LayerController().getLayerById('rdNode'));
    this.snapHandler.enable();
    this.tooltipsCtrl = fastmap.uikit.ToolTipsController();
    //当鼠标按下并有移动时为mousedown拖动；
    this.isMouseDown = false;
    this.isMouseDownMove = false;
    this._mapDraggable = this._map.dragging.enabled();
    this.selectCtrl = fastmap.uikit.SelectController();
    //鼠标到线距离的计算结果
    this.result = null;
    //捕捉的阈值
    this.snapDistance = 8;
    //根据鼠标位置计算当前距离鼠标最近的几何要素
    this.selectType = null;
    //当前捕捉到的对象
    this.snapStart = [];
    this.snapEnd = [];


  },

  /***
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
    this.isMouseDown = true;

    //计算算鼠标点到选中线的距离，同时需要判断点到线的距离和点到节点的距离的大小；判断节点是否是端点
    //如果点到定点的距离小于5个像素则认为此时进行vertex的移动

    if (this.result.distanceToStart <= this.snapDistance || this.result.distanceToEnd <= this.snapDistance) {
      if (this.selectType == 'vertex') {
        if (this._mapDraggable) {
          this._map.dragging.disable();
        }
        var layerPoint = event.layerPoint;
        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;
        for (var j = 1, len = points.length - 1; j < len; j++) {
          // var disAB = this.distance(this._map.latLngToLayerPoint([points[j].y,points[j].x]), x , y);
          var disAB = this._map.latLngToLayerPoint([points[j].y, points[j].x]).distanceTo(layerPoint);
          if (disAB < this.snapDistance) {
            this.targetIndex = j;
          }
        }
        this.snapHandler.setTargetIndex(this.targetIndex);


      } else if (this.selectType == 'node') {
        if (this._mapDraggable) {
          this._map.dragging.disable();
        }

        var layerPoint = event.layerPoint;
        var geom = this.shapeEditor.shapeEditorResult.getFinalGeometry();
        var points = [geom][0].components;
        for (var j = 0, len = points.length; j < len; j++) {
          if( j==0 || j == len-1){
            var disAB = this.distance(this._map.latLngToLayerPoint([points[j].y, points[j].x]), layerPoint);
            if (disAB < this.snapDistance) {
              this.targetIndex = j;
            }
          }

        }
          this.snapHandler.setTargetIndex(this.targetIndex);
      }
    } else if (this.result.distance.distance <= this.snapDistance) {
      if (this.selectType == 'line') {
        if (this._mapDraggable) {
          this._map.dragging.disable();
        }
        this.targetPoint = L.latLng(event.latlng.lat, event.latlng.lng);
        this.resetVertexInsert(this._map.latLngToLayerPoint(this.targetPoint));
        this._map.dragging.disable();
      }

    }

    this.getTouchType(this.selectCtrl.selectedFeatures, event.layerPoint)

    this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
  },

  onMouseMove: function (event) {

    if (this.isMouseDown == true) {
      this.isMouseDownMove = true
    }
    this.container.style.cursor = 'pointer';
    //this.snapHandler.setTargetIndex(0);
    //就算鼠标点到选中线的距离，同时需要判断点到线的距离和点到节点的距离的大小；判断节点是否是端点
    var selects = this.selectCtrl.selectedFeatures;

    if (this.isMouseDownMove == false) {

      this.getTouchType(this.selectCtrl.selectedFeatures, event.layerPoint)

    }

    //鼠标按下移动
    if (this.isMouseDownMove == true) {

      if (this.selectType == 'vertex') {

        if (this._mapDraggable && this.snapHandler.snaped) {
          this._map.dragging.disable();
        }
        if (this._map.dragging._draggable._enabled == true) {
          return;
        }
        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);
        if (this.targetIndex == null) {
          return;
        }
        this.resetVertexMove(layerPoint);

        if (!this._map.dragging._enabled) {
          //this.shapeEditor.shapeEditorResultFeedback.setupFeedback({index: this.targetIndex});
          this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
      } else if (this.selectType == 'node') {
        this.container.style.cursor = 'pointer';
        if (this._mapDraggable) {
          this._map.dragging.disable();
        }
        if (this._map.dragging._draggable._enabled == true) {
          return;
        }

        var layerPoint = event.layerPoint;
        this.targetPoint = this._map.layerPointToLatLng(layerPoint);
        if (this.targetIndex == null) {
          return;
        }

        if (this.snapHandler.snaped == true) {
          this.eventController.fire(this.eventController.eventTypes.SNAPED, {'snaped': true});
          this.snapHandler.targetIndex = this.targetIndex;
          this.selectCtrl.setSnapObj(this.snapHandler);
          this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1], this.snapHandler.snapLatlng[0])

        } else {
        this.eventController.fire(this.eventController.eventTypes.SNAPED, {'snaped': false});

        }

        this.resetVertexNode(layerPoint);

        this.shapeEditor.shapeEditorResultFeedback.setupFeedback({index: this.targetIndex});
        //设置当前的捕捉对象
        if(this.targetIndex==0){

          this.snapStart = this.createSnapObjs(selects.snode)
        }

        if((this.targetIndex==selects.geometry.components.length - 1)){
          this.snapEnd = this.createSnapObjs(selects.enode)
        }

      }

    }
    //直接鼠标按下增加节点
    else {
        this.eventController.fire(this.eventController.eventTypes.SNAPED, {
          'snaped': false
        });
        this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
    }

  },


  getTouchType:function (selects,layerPoint) {
    this.result = this.pointToLine(selects.geometry.components, layerPoint);

    //根据结果计算点到线的距离,并判断当前操作类型

    if (this.result.distance.distance <= this.snapDistance) {
      this.selectType = 'line';

      var distanceTov = this.distanceToVertex(selects.geometry.components, layerPoint);
      if(distanceTov && distanceTov.distance < this.snapDistance){
        this.selectType = 'vertex';
        if(distanceTov.index ==0 || distanceTov.index == selects.geometry.components.length -1){
          this.selectType = 'node';
        }
      }
    }
  },



  createSnapObjs:function (nodeid) {
    var snaps = [];
    if(this.snapHandler.snaped == true){
      var obj = {};
      if(this.snapHandler.snapType == 'line' || this.snapHandler.snapType == 'vertex'){
        obj.catchLinks = {
          preNodePid:nodeid,
          linkPid:this.snapHandler.properties.id,
          longitude:this.snapHandler.snapLatlng[0],
          latitude:this.snapHandler.snapLatlng[1]
        }
      }else if(this.snapHandler.snapType == 'node') {
        obj.catchNodes = {
          preNodePid:nodeid,
          nodePid:this.snapHandler.properties.id
        }
      }

      snaps.push (obj);
    }else{
      snaps = [];
    }

    return snaps;
  },


  onMouseUp: function (event) {

    this.isMouseDown = false;
    this.isMouseDownMove = false;
    this._map.dragging.enable();
    this.snapHandler.snapType = null;

    this.targetIndex == null
    this.snapHandler.setTargetIndex(-1);

  },


  //两点之间的距离
  distance: function (pointA, pointB) {
    var len = Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2);
    return Math.sqrt(len);
  },

  resetVertexInsert: function (layerPoint) {
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

        this.targetIndex = index + 1

        this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(index + 1, 0, fastmap.mapApi.point(latlng.lng, latlng.lat))
        this.shapeEditor.shapeEditorResult.setFinalGeometry(this.shapeEditor.shapeEditorResult.getFinalGeometry());
      }
    }
  },


  /***
   * 重新设置节点
   */
  resetVertexMove: function () {
    var currentPoint = L.latLng(this.targetPoint.lat, this.targetPoint.lng);

    if (this.hornPoints) { //形状点不能够移动到图幅的顶角处
      for (var i = 0, len = this.hornPoints.length; i < len; i++) {
        var point = L.latLng(this.hornPoints[i].x, this.hornPoints[i].y);
        var dis = currentPoint.distanceTo(point);
        if (dis < 0.8) {
          return;
        }
      }
    }

    //增加了形状点之间距离大于2米的判断(只判断相邻点)
    var components = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;
    var componentA = components[this.targetIndex - 1];
    var componentB = components[this.targetIndex + 1];
    var pointA = L.latLng(componentA.y, componentA.x);
    var pointB = L.latLng(componentB.y, componentB.x);
    var dis1 = currentPoint.distanceTo(pointA);
    var dis2 = currentPoint.distanceTo(pointB);
    //起点和终点不能合并移除
    if(dis1 < 2 && this.targetIndex - 1 != 0){
      this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex - 1, 1);
      this.targetIndex = this.targetIndex-1;
    }
    if(dis2 < 2 && this.targetIndex + 1 != this.shapeEditor.shapeEditorResult.getFinalGeometry().components.length -1){
      this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex + 1, 1);
    }
    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
  },

  /***
   * 重新设置节点
   */
  resetVertexNode: function () {

    var currentPoint = L.latLng(this.targetPoint.lat, this.targetPoint.lng);

    if (this.hornPoints) { //形状点不能够移动到图幅的顶角处
      for (var i = 0, len = this.hornPoints.length; i < len; i++) {
        var point = L.latLng(this.hornPoints[i].x, this.hornPoints[i].y);
        var dis = currentPoint.distanceTo(point);
        if (dis < 0.8) {
          return;
        }
      }
    }
    this.shapeEditor.shapeEditorResult.getFinalGeometry().components.splice(this.targetIndex, 1, fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat));
  },



  /***
   * 计算点到线的最近距离
   * @param layer
   * @param p
   * @param vertices
   * @returns {*}
   */
  pointToLine: function (latlngs, p) {
    var latlngs = latlngs,
      mindist = Infinity,
      result = null,
      i, n, distance;
    // Keep the closest point of all segments
    for (i = 0, n = latlngs.length; i < n - 1; i++) {

      var start = this._map.latLngToLayerPoint(L.latLng(latlngs[i].y, latlngs[i].x));
      end = this._map.latLngToLayerPoint(L.latLng(latlngs[i + 1].y, latlngs[i + 1].x));
      var latlngA = [start.x, start.y],
        latlngB = [end.x, end.y];

      var line = new fastmap.mapApi.LineString([new fastmap.mapApi.Point(latlngA[0], latlngA[1]), new fastmap.mapApi.Point(latlngB[0], latlngB[1])])
      distance = line.pointToSegmentDistance(p, new fastmap.mapApi.Point(latlngA[0], latlngA[1]), new fastmap.mapApi.Point(latlngB[0], latlngB[1]));

      if (distance.distance <= mindist) {
        mindist = distance.distance;
        result = line.pointToSegmentDistance(p, new fastmap.mapApi.Point(latlngA[0], latlngA[1]), new fastmap.mapApi.Point(latlngB[0], latlngB[1]));
        result.distanceToStart = L.point(p.x, p.y).distanceTo(start);
        result.distanceToEnd = L.point(p.x, p.y).distanceTo(end);
        result.distance = distance;

        result.index = i;
      }
    }
    return result;
  },


  distanceToVertex:function (latlngs, p) {
    var distance,
      mindist = 10;
    var result = null;
    for (i = 0, n = latlngs.length; i <= n - 1; i++) {
      var vertex = this._map.latLngToLayerPoint(L.latLng(latlngs[i].y, latlngs[i].x));
      distance = L.point(p.x, p.y).distanceTo(vertex);
      if(distance < mindist){
        result = {}
        result.index = i;
        result.distance = distance;
      }
    }

    return result;
  }

})