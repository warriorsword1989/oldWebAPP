/**
 * Created by zhongxiaoming on 2016/9/23.
 * Class SelectFeature
 */
fastmap.uikit.SelectFeature = L.Handler.extend({
  /**
   * 事件管理器
   * @property includes
   */
    includes: L.Mixin.Events,
  /** *
   *
   * @param {Object}options
   */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this._map = this.options.map;
        this.eventController = new fastmap.uikit.EventController();
        this.layerCtrl = new fastmap.uikit.LayerController();
        this.hightLayer = this.layerCtrl.getLayerById('mousemovelightlayer');
        this.highlightLayer = this.layerCtrl.getLayerById('highlightLayer');
        this.highRenderCtrl = fastmap.uikit.HighRenderController();
        this.mouseMoveHeight = $.extend({}, this.highRenderCtrl);
    // this.mouseMoveHeight = L.extend({},this.highRenderCtrl);
        this.mouseMoveHeight.setLayer(this.hightLayer);
        this._map._container.style.cursor = 'pointer';
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.selectCtrl = new fastmap.uikit.SelectController();
        this.popup = L.popup({ className: 'featuresContent' });
    },


  /** *
   * 添加事件处理
   */
    addHooks: function () {
        this._map.on('mousedown', this.onMouseDown, this);
        this._map.on('mousemove', this.onMouseMove, this);
    },

    onMouseDown: function (event) {
        // button：0.左键,1.中键,2.右键
        // 限制为左键点击事件
        if (event.originalEvent.button > 0) {
            return;
        }

    // this.highRenderCtrl.setLayer(this.highlightLayer);
    // 保存选中的数据
        this.selectData = {};
        this.selectData.lineStrings = [];
        this.selectData.markers = [];
        this.selectData.pointFeatures = [];
        this.selectData.points = [];
        this.selectData.tips = [];
        this.selectData.polygons = [];
        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        var pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat, this._map.getZoom());
        var x = pixels[0] - tileCoordinate[0] * 256,
            y = pixels[1] - tileCoordinate[1] * 256;

// 鼠标点击的位置，用于显示操作按钮面板
        var point = new fastmap.mapApi.Point(this.transform.PixelToLonlat(tileCoordinate[0] * 256 + x, tileCoordinate[1] * 256 + y, this._map.getZoom()));

        var layers = this.layerCtrl.getAllTileJsonLayer();
        for (var layer in layers) {
            if (layers[layer].tiles && layers[layer].tiles[tileCoordinate.join(':')]) {
                var tileData = layers[layer].tiles[tileCoordinate.join(':')].data;
                switch (layers[layer].type) {
                case 'LineString':

                    for (var line in tileData) {
                        var lineGeo = tileData[line].geometry.coordinates;
              // 计算鼠标点和线的关系
                        if (this._TouchesPath(tileData[line].geometry.coordinates, x, y, 5)) {
                            this.selectData.lineStrings.push({
                                id: tileData[line].properties.id,
                                optype: tileData[line].properties.featType,
                                event: event,
                                point: point,
                                properties: tileData[line].properties,
                                layer: layers[layer]
                            });
                        }
                    }
                    break;
                case 'Marker':

                    for (var marker in tileData) {
                        var lineGeo;

                        switch (tileData[marker].properties.featType) {
                        case 'RDCROSS':
                            lineGeo = tileData[marker].geometry.coordinates;

                            for (var j in lineGeo) {
                                if (this._TouchesPoint(lineGeo[j], x, y, 5)) {
                                    this.selectData.markers.push({
                                        id: tileData[marker].properties.id,
                                        optype: tileData[marker].properties.featType,
                                        event: event,
                                        point: point,
                                        properties: tileData[marker].properties,
                                        layer: layers[layer]
                                    });
                                }
                            }

                            break;
                        case 'RDGSC':
                            lineGeo = tileData[marker].geometry.coordinates;
                            for (var key in lineGeo) {
                                if (this._TouchesPath(lineGeo[key].g, x, y, 10)) {
                                    this.selectData.markers.push({
                                        id: tileData[marker].properties.id,
                                        optype: tileData[marker].properties.featType,
                                        event: event,
                                        point: point,
                                        properties: tileData[marker].properties,
                                        layer: layers[layer]
                                    });

                                    this.mouseMoveHeight.highLightFeatures = [{
                                        id: tileData[marker].properties.id,
                                        layerid: layers[layer].options.id,

                                        type: '',
                                        style: {}
                                    }];
                                    this.mouseMoveHeight.drawHighlight();
                                    break;
                                }
                            }
                            break;
                        case 'RDLANECONNEXITY':
                        case 'RDRESTRICTION':
                        case 'RDBRANCH':
                        case 'RDTRAFFICSIGNAL':
                        case 'RDGATE':
                        case 'RDSPEEDLIMIT':
                        case 'RDWARNINGINFO':
                        case 'RDELECTRONICEYE':
                        case 'RDSLOPE':
                        case 'RDDIRECTROUTE':
                        case 'RDSPEEDBUMP':
                        case 'RDSE':
                        case 'RDTOLLGATE':
                        case 'RDVARIABLESPEED':
                        case 'RDVOICEGUIDE':
                        case 'RDLANE':
                        case 'RDINTER':
                        case 'RDOBJECT':
                        case 'RDSAMENODE':
                        case 'RDHGWGLIMIT':
                        case 'RDLINKSPEEDLIMIT':
                            lineGeo = tileData[marker].geometry.coordinates;
                            if (this._TouchesPoint(lineGeo, x, y, 15)) {
                                this.selectData.markers.push({
                                    id: tileData[marker].properties.id,
                                    optype: tileData[marker].properties.featType,
                                    event: event,
                                    point: point,
                                    properties: tileData[marker].properties,
                                    layer: layers[layer]
                                });
                            }
                            break;
                        case 'RDROAD':
                        case 'RDSAMELINK':
                            if (this._TouchesPath(tileData[marker].geometry.coordinates, x, y, 5)) {
                                this.selectData.markers.push({
                                    id: tileData[marker].properties.id,
                                    optype: tileData[marker].properties.featType,
                                    event: event,
                                    point: point,
                                    properties: tileData[marker].properties,
                                    layer: layers[layer]
                                });
                            }
                            break;
                        }
                    }
                    break;
                case 'PointFeature':
                    for (var pointfeature in tileData) {
                        var lineGeo = tileData[pointfeature].geometry.coordinates;
              // 计算鼠标点和线的关系
                        if (this._TouchesPoint(tileData[pointfeature].geometry.coordinates, x, y, 5)) {
                            this.selectData.pointFeatures.push({
                                id: tileData[pointfeature].properties.id,
                                optype: tileData[pointfeature].properties.featType,
                                event: event,
                                point: point,
                                properties: tileData[pointfeature].properties,
                                layer: layers[layer]
                            });
                        }
                    }
                    break;
                case 'Point':
                    for (var p in tileData) {
                        if (this._TouchesPoint(tileData[p].geometry.coordinates, x, y, 5)) {
                            this.selectData.points.push({
                                id: tileData[p].properties.id,
                                optype: tileData[p].properties.featType,
                                event: event,
                                point: point,
                                properties: tileData[p].properties,
                                layer: layers[layer]
                            });
                        }
                    }

                    break;
                case 'TipPoint':
                    for (var tips in tileData) {
                        if (this._TouchesPoint(tileData[tips].geometry.coordinates, x, y, 5)) {
                            var temp = {
                                id: tileData[tips].properties.id,
                                optype: tileData[tips].properties.featType,
                                event: event,
                                point: point,
                                properties: tileData[tips].properties,
                                layer: layers[layer]
                            };
                            temp.properties.featType = 'TIPS'; // 对tips特殊处理，为了解决tips选中显示undefined的问题
                            this.selectData.tips.push(temp);
                        }
                    }
                    break;
                case 'Polygon':
                    for (var polygon in tileData) {
                        if (this._containPoint(tileData[polygon].geometry.coordinates, x, y, 5)) {
                            this.selectData.polygons.push({
                                id: tileData[polygon].properties.id,
                                optype: tileData[polygon].properties.featType,
                                event: event,
                                point: point,
                                properties: tileData[polygon].properties,
                                layer: layers[layer]
                            });
                        }
                    }
                    break;
                }
            }
        }

        this.dispatchEvent(this.selectData, event);
    },

    dispatchEvent: function (data, event) {
    // 计算点击获取到的所有的要素数量
        var arrlen = 0;
        for (var key in data) {
            arrlen += data[key].length;
        }
        if (arrlen == 0) {

        } else if (arrlen == 1) {
            for (var item in data) {
                if (data[item].length == 1) {
                    data[item][0].layer.selectedid = data[item][0].id;
                    this.fireEvents(item, data[item][0], event);
                }
            }
        } else {
            var totalFeature = [];
            for (var item in data) {
                if (data[item].length != 0) {
                    for (var key in data[item]) {
                        data[item][key].selectedtype = item;
                    }
                    if (item == 'lineStrings') {
                        if (data.markers.length == 0 && data.points.length == 0 && data.tips.length == 0 && data.pointFeatures.length == 0) {
                            totalFeature = totalFeature.concat(data[item]);
                        }
                    } else {
                        totalFeature = totalFeature.concat(data[item]);
                    }
                }
            }

            if (totalFeature.length == 1) {
                totalFeature[0].layer.selectedid = totalFeature[0].id;
                this.fireEvents(totalFeature[0].selectedtype, totalFeature[0], event);
                return;
            }

            var html = '<ul id="layerpopup">';

            console.info(totalFeature);
            for (var item in totalFeature) {
                html += '<li><a href="#" id="' + totalFeature[item].properties.featType + totalFeature[item].id + '">' + App.Temp.relationNameObj[totalFeature[item].properties.featType] + '&nbsp' + totalFeature[item].id + '</a></li>';
            }
            html += '</ul>';
            this.popup
        .setLatLng(event.latlng)
        .setContent(html);
            var that = this;
            this._map.on('popupopen', function () {
                document.getElementsByClassName('featuresContent')[0].style.opacity = 0.7;
                document.getElementById('layerpopup');
                document.getElementById('layerpopup').onclick = function (e) {
                    if (e.target.tagName == 'A') {
                        for (var item in totalFeature) {
                            if (e.target.id == totalFeature[item].properties.featType + totalFeature[item].id) {
                                totalFeature[0].layer.selectedid = totalFeature[0].id;
                                that.fireEvents(totalFeature[item].selectedtype, totalFeature[item], event);
                            }
                        }
                    }
                };

                document.getElementById('layerpopup').onmousemove = function (e) {
                    if (!e) var e = window.event;
                    e.cancelBubble = true;
                    if (e.stopPropagation) e.stopPropagation();
                    if (e.target.tagName == 'A') {
                        that.mouseMoveHeight._cleanHighLight('mouseover');
                        for (var item in totalFeature) {
                            if (e.target.id == totalFeature[item].properties.featType + totalFeature[item].id) {
                                switch (totalFeature[item].properties.featType) {
                                case 'RDLINK':
                                case 'RWLINK':
                                case 'ZONELINK':
                                case 'LULINK':
                                case 'LCLINK':
                                    that.mouseMoveHeight.highLightFeatures = [{
                                        id: totalFeature[item].properties.id,
                                        layerid: totalFeature[item].layer.options.id,
                                        type: 'line',
                                        style: { strokeWidth: 5, color: 'red', radius: 3, strokeColor: 'red', strokeOpacity: 0.5 }
                                    }];

                                    that.mouseMoveHeight.drawHighlight();
                                    break;
                                case 'RDNODE':

                                    that.mouseMoveHeight.highLightFeatures = [{
                                        id: totalFeature[item].properties.id,
                                        layerid: 'rdLink',
                                        type: 'node',
                                        style: { strokeWidth: 5, color: 'red', radius: 6, strokeColor: 'red', strokeOpacity: 0.5 }
                                    }];

                                    that.mouseMoveHeight.drawHighlight();
                                    break;
                                case 'RWNODE':
                                case 'ZONENODE':
                                case 'LUNODE':
                                case 'LCNODE':
                                    that.mouseMoveHeight.highLightFeatures = [{
                                        id: totalFeature[item].properties.id,
                                        layerid: totalFeature[item].layer.options.id,
                                        type: 'node',
                                        style: { strokeWidth: 5, color: 'red', radius: 6, strokeColor: 'red', strokeOpacity: 0.5 }
                                    }];
                                    that.mouseMoveHeight.drawHighlight();
                                    break;
                                case 'RDCROSS':
                                case 'RDLANECONNEXITY':
                                case 'RDRESTRICTION':
                                case 'RDBRANCH':
                                case 'RDTRAFFICSIGNAL':
                                case 'RDGATE':
                                case 'RDSPEEDLIMIT':
                                case 'RDWARNINGINFO':
                                case 'RDELECTRONICEYE':
                                case 'RDSLOPE':
                                case 'RDDIRECTROUTE':
                                case 'RDSPEEDBUMP':
                                case 'RDSE':
                                case 'RDTOLLGATE':
                                case 'RDVARIABLESPEED':
                                case 'RDVOICEGUIDE':
                                case 'RDGSC':
                                case 'RDINTER':
                                case 'RDOBJECT':
                                case 'RDSAMENODE':
                                case 'RDLINKSPEEDLIMIT':

                                case 'RDROAD':
                                case 'RDSAMELINK':
                                case 'IXPOI':
                                    that.mouseMoveHeight.highLightFeatures = [{
                                        id: totalFeature[item].properties.id,
                                        layerid: totalFeature[item].layer.options.id,
                                        type: 'marker',
                                        style: { strokeWidth: 5, color: 'red', radius: 3, strokeColor: 'red', strokeOpacity: 0.5 }
                                    }];
                                    that.mouseMoveHeight.drawHighlight('mouseover');
                                    break;

                                }
                            }
                        }
                    }
                };
            });

      // 弹出popup，这里如果不用settimeout,弹出的popup会消失，后期在考虑优化  王屯+

            setTimeout(function () {
                that._map.openPopup(that.popup);
            }, 200);
        }
    },


    fireEvents: function (type, data, event) {
        switch (type) {
        case 'lineStrings':
            this.eventController.fire(this.eventController.eventTypes.GETLINKID, data);
            break;
        case 'markers':
            this.eventController.fire(this.eventController.eventTypes.GETRELATIONID, {
                id: data.properties.id,
                rowId: data.properties.rowId,
                optype: data.properties.featType,
                selectData: data,
                branchType: data.properties.branchType,
                restrictionType: data.properties.restrictionType,
          // tileId:this.selectData[0].tileId,
                event: event
            });
            break;
        case 'pointFeatures':
            this.eventController.fire(this.eventController.eventTypes.GETNODEID, data);
            break;
        case 'points':
            this.eventController.fire(this.eventController.eventTypes.GETNODEID, data);
            break;
        case 'polygons':
            this.eventController.fire(this.eventController.eventTypes.GETFACEID, data);
            break;
        case 'tips':
            this.eventController.fire(this.eventController.eventTypes.GETTIPSID, {
                id: data.properties.id,
                tips: 0,
                optype: 'TIPS'
            });
            break;
        }
    },

  /** *
   * 鼠标移动
   * @param event
   */
    onMouseMove: function (event) {
    // 保存选中的数据
        this.selectData = {};
        this.selectData.lineStrings = [];
        this.selectData.markers = [];
        this.selectData.pointFeatures = [];
        this.selectData.points = [];
        this.selectData.tips = [];
        this.selectData.polygons = [];

        var mouseLatlng = event.latlng;
        var tileCoordinate = this.transform.lonlat2Tile(mouseLatlng.lng, mouseLatlng.lat, this._map.getZoom());
        var pixels = this.transform.lonlat2Pixel(event.latlng.lng, event.latlng.lat, this._map.getZoom());
        var x = pixels[0] - tileCoordinate[0] * 256,
            y = pixels[1] - tileCoordinate[1] * 256;
        this.mouseMoveHeight._cleanHighLight('mouseover');
        var point = new fastmap.mapApi.Point(this.transform.PixelToLonlat(tileCoordinate[0] * 256 + x, tileCoordinate[1] * 256 + y, this._map.getZoom()));

        var layers = this.layerCtrl.getAllTileJsonLayer();
        for (var layer in layers) {
            if (layers[layer].tiles && layers[layer].tiles[tileCoordinate.join(':')]) {
                var tileData = layers[layer].tiles[tileCoordinate.join(':')].data;
                switch (layers[layer].type) {
                case 'LineString':

                    for (var line in tileData) {
                        var lineGeo = tileData[line].geometry.coordinates;
              // 计算鼠标点和线的关系
                        if (this._TouchesPath(tileData[line].geometry.coordinates, x, y, 5)) {
                            this.selectData.lineStrings.push({
                                id: tileData[line].properties.id,
                                optype: tileData[line].properties.featType,
                                event: event,
                                point: point,
                                properties: tileData[line].properties,
                                layer: layers[layer]
                            });

                            this.mouseMoveHeight.highLightFeatures = [{
                                id: tileData[line].properties.id,
                                layerid: layers[layer].options.id,
                                type: 'line',
                                style: { strokeWidth: 5, color: 'red', radius: 3, strokeColor: 'red', strokeOpacity: 0.5 }
                            }];

                            this.mouseMoveHeight.drawHighlight();
                        }
                    }
                    break;
                case 'Marker':

                    for (var marker in tileData) {
                        var lineGeo;

                        switch (tileData[marker].properties.featType) {
                        case 'RDCROSS':
                            lineGeo = tileData[marker].geometry.coordinates;

                            for (var j in lineGeo) {
                                if (this._TouchesPoint(lineGeo[j], x, y, 5)) {
                                    this.selectData.markers.push({
                                        id: tileData[marker].properties.id,
                                        optype: tileData[marker].properties.featType,
                                        event: event,
                                        point: point,
                                        properties: tileData[marker].properties,
                                        layer: layers[layer]
                                    });

                                    this.mouseMoveHeight.highLightFeatures = [{
                                        id: tileData[marker].properties.id,
                                        layerid: layers[layer].options.id,
                                        type: 'marker',
                                        style: { strokeWidth: 5, color: 'red', radius: 3, strokeColor: 'red', strokeOpacity: 0.5 }
                                    }];

                                    this.mouseMoveHeight.drawHighlight();

                                    break;
                                }
                            }

                            break;
                        case 'RDGSC':
                            lineGeo = tileData[marker].geometry.coordinates;
                            for (var key in lineGeo) {
                                if (this._TouchesPath(lineGeo[key].g, x, y, 10)) {
                                    this.selectData.markers.push({
                                        id: tileData[marker].properties.id,
                                        optype: tileData[marker].properties.featType,
                                        event: event,
                                        point: point,
                                        properties: tileData[marker].properties,
                                        layer: layers[layer]
                                    });

                                    this.mouseMoveHeight.highLightFeatures = [{
                                        id: tileData[marker].properties.id,
                                        layerid: layers[layer].options.id,

                                        type: '',
                                        style: {}
                                    }];

                                    this.mouseMoveHeight.drawHighlight();
                                    break;
                                }
                            }
                            break;
                        case 'RDLANECONNEXITY':
                        case 'RDRESTRICTION':
                        case 'RDBRANCH':
                        case 'RDTRAFFICSIGNAL':
                        case 'RDGATE':
                        case 'RDSPEEDLIMIT':
                        case 'RDWARNINGINFO':
                        case 'RDELECTRONICEYE':
                        case 'RDSLOPE':
                        case 'RDDIRECTROUTE':
                        case 'RDSPEEDBUMP':
                        case 'RDSE':
                        case 'RDTOLLGATE':
                        case 'RDVARIABLESPEED':
                        case 'RDVOICEGUIDE':
                        case 'RDINTER':
                        case 'RDOBJECT':
                        case 'RDSAMENODE':
                        case 'RDLINKSPEEDLIMIT':
                            lineGeo = tileData[marker].geometry.coordinates;
                            if (this._TouchesPoint(lineGeo, x, y, 15)) {
                                this.selectData.markers.push({
                                    id: tileData[marker].properties.id,
                                    optype: tileData[marker].properties.featType,
                                    event: event,
                                    point: point,
                                    properties: tileData[marker].properties,
                                    layer: layers[layer]
                                });

                                this.mouseMoveHeight.highLightFeatures = [{
                                    id: tileData[marker].properties.id,
                                    layerid: layers[layer].options.id,

                                    type: '',
                                    style: {}
                                }];

                                this.mouseMoveHeight.drawHighlight();
                                break;
                            }

                            break;
                        case 'RDLANE':// 详细车道
                            break;
                        case 'RDROAD':
                        case 'RDSAMELINK':
                            if (this._TouchesPath(tileData[marker].geometry.coordinates, x, y, 5)) {
                                this.selectData.markers.push({
                                    id: tileData[marker].properties.id,
                                    optype: tileData[marker].properties.featType,
                                    event: event,
                                    point: point,
                                    properties: tileData[marker].properties,
                                    layer: layers[layer]
                                });
                                this.mouseMoveHeight.highLightFeatures = [{
                                    id: tileData[marker].properties.id,
                                    layerid: layers[layer].options.id,
                                    type: 'marker',
                                    style: { strokeWidth: 5, color: 'red', radius: 3, strokeColor: 'red' }
                                }];

                                this.mouseMoveHeight.drawHighlight();
                                break;
                            }

                            break;
                        }

              // 计算鼠标点和线的关系
                    }
                    break;
                case 'PointFeature':
                    for (var pointfeature in tileData) {
                        var lineGeo = tileData[pointfeature].geometry.coordinates;
              // 计算鼠标点和线的关系
                        if (this._TouchesPoint(tileData[pointfeature].geometry.coordinates, x, y, 5)) {
                            this.selectData.pointFeatures.push({
                                id: tileData[pointfeature].properties.id,
                                optype: tileData[pointfeature].properties.featType,
                                event: event,
                                point: point,
                                properties: tileData[pointfeature].properties,
                                layer: layers[layer]
                            });
                            this.mouseMoveHeight.highLightFeatures = [{
                                id: tileData[pointfeature].properties.id,
                                layerid: layers[layer].options.id,
                                type: 'PointFeature',
                                style: { strokeWidth: 5, color: 'red', radius: 3, strokeColor: 'red' }
                            }];
                            this.mouseMoveHeight.drawHighlight('mouseover');
                        }
                    }
                    break;
                case 'Point':
                    for (var p in tileData) {
                        if (this._TouchesPoint(tileData[p].geometry.coordinates, x, y, 5)) {
                            this.selectData.points.push({
                                id: tileData[p].properties.id,
                                optype: tileData[p].properties.featType,
                                event: event,
                                point: point,
                                properties: tileData[p].properties,
                                layer: layers[layer]
                            });
                            this.mouseMoveHeight.highLightFeatures = [{
                                id: tileData[p].properties.id,
                                layerid: layers[layer].options.id,
                                type: 'node',
                                style: { strokeWidth: 5, color: 'red', radius: 6, strokeColor: 'red' }
                            }];

                            this.mouseMoveHeight.drawHighlight();
                            break;
                        }
                    }

                    break;
                case 'TipPoint':
                    for (var tips in tileData) {
                        if (this._TouchesPoint(tileData[tips].geometry.coordinates, x, y, 5)) {
                            this.selectData.tips.push({
                                id: tileData[tips].properties.id,
                                optype: tileData[tips].properties.featType,
                                event: event,
                                point: point,
                                properties: tileData[tips].properties,
                                layer: layers[layer]
                            });
                            this.mouseMoveHeight.highLightFeatures = [{
                                id: tileData[tips].properties.id,
                                layerid: 'workPoint',
                                type: 'workPoint'
                            }];

                            this.mouseMoveHeight.drawHighlight();
                        }
                    }
                    break;
                case 'Polygon':
                    for (var polygon in tileData) {
                        if (this._containPoint(tileData[polygon].geometry.coordinates, x, y, 5)) {
                            this.selectData.polygons.push({
                                id: tileData[polygon].properties.id,
                                optype: tileData[polygon].properties.featType,
                                event: event,
                                point: point,
                                properties: tileData[polygon].properties,
                                layer: layers[layer]
                            });
                        }
                    }
                    break;
                }
            }
        }
    },
  /** *
   * 移除事件
   */
    removeHooks: function () {
        this._map.off('mousedown', this.onMouseDown, this);
        this._map.off('mousemove', this.onMouseMove, this);
    },


  /** *
   *
   * @param {Array}d 几何图形
   * @param {number}x 鼠标x
   * @param {number}y 鼠标y
   * @param {number}r 半径
   * @returns {number}
   * @private
   */
    _TouchesPoint: function (d, x, y, r) {
        var dx = x - d[0];
        var dy = y - d[1];
        if ((dx * dx + dy * dy) <= r * r) {
            return 1;
        } else {
            return 0;
        }
    },
  /** *
   *
   * @param {Array}d 几何图形
   * @param {number}x 鼠标x
   * @param {number}y 鼠标y
   * @param {number}r 半径
   * @returns {number}
   * @private
   */
    _TouchesPath: function (d, x, y, r) {
        var i;
        var N = d.length;
        var p1x = d[0][0];
        var p1y = d[0][1];
        for (var i = 1; i < N; i += 1) {
            var p2x = d[i][0];
            var p2y = d[i][1];
            var dirx = p2x - p1x;
            var diry = p2y - p1y;
            var diffx = x - p1x;
            var diffy = y - p1y;
            var t = 1 * (diffx * dirx + diffy * diry * 1) / (dirx * dirx + diry * diry * 1);
            if (t < 0) {
                t = 0;
            }
            if (t > 1) {
                t = 1;
            }
            var closestx = p1x + t * dirx;
            var closesty = p1y + t * diry;
            var dx = x - closestx;
            var dy = y - closesty;
            if ((dx * dx + dy * dy) <= r * r) {
                return 1;
            }
            p1x = p2x;
            p1y = p2y;
        }
        return 0;
    },

  /** *
   * 判断点是否在几何图形内部
   * @param geo
   * @param x
   * @param y
   * @private
   */
    _containPoint: function (geo, x, y) {
        var lineRing = fastmap.mapApi.linearRing(geo[0]);
        return lineRing.containsPoint(fastmap.mapApi.point(x, y));
    }

});
