/**
 * Created by zhongxiaoming on 2015/10/19
 * Class EditLayer 可编辑层
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
    initialize: function (url, options) {
        this.options = options || {};
        this.url = url;
        fastmap.mapApi.WholeLayer.prototype.initialize(this, options);
        this.eventController = fastmap.uikit.EventController();
        this.minShowZoom = this.options.minShowZoom || 9;
        this.maxShowZoom = this.options.maxShowZoom || 18;
        this.eventController = fastmap.uikit.EventController();
        this.initEvent();
        this.drawGeometry = null;
    },

    initEvent: function () {
        var that = this;
        this.shapeEditor = fastmap.uikit.ShapeEditorController();

        this.eventController.on(this.eventController.eventTypes.SNAPED, function (event) {
            that.snaped = event.snaped;
        })
        this.eventController.on(this.eventController.eventTypes.STARTSHAPEEDITRESULTFEEDBACK, delegateDraw);
        function delegateDraw(event) {
            that.selectCtrl = fastmap.uikit.SelectController();
            if (that.shapeEditor.shapeEditorResult == null) {
                return;
            }
            that.drawGeometry = that.shapeEditor.shapeEditorResult.getFinalGeometry();
            that.clear();
            that.draw(that.drawGeometry, that, event.index);
            if(that.snaped == true){
                var crosspoint = ( event.index!=null&&that.drawGeometry&&that.drawGeometry.components[event.index])?that.drawGeometry.components[event.index]:event.point;
                if(crosspoint!=undefined){
                    crosspoint = fastmap.mapApi.point(crosspoint.x,crosspoint.y);
                    crosspoint.type = 'Cross';
                    that.draw(crosspoint, that);
                }

            }

        }

        this.eventController.on(this.eventController.eventTypes.STOPSHAPEEDITRESULTFEEDBACK, function () {
            that.map._container.style.cursor = '';

            var coordinate1 = [];
            if (that.drawGeometry) {
                for (var index in that.drawGeometry.components) {
                    coordinate1.push([that.drawGeometry.components[index].x, that.drawGeometry.components[index].y]);
                }

                that._redraw();
            }
        });

        this.eventController.on(this.eventController.eventTypes.ABORTSHAPEEDITRESULTFEEDBACK, function () {
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
        this._initContainer(this.options);
        map.on("moveend", this._redraw, this);
        this._redraw();
    },

    /***
     * 图层被移除时调用
     * @param {L.Map}map
     */
    onRemove: function (map) {
        map.getPanes().tilePane.removeChild(this._div);
        map.off("moveend", this._redraw, this);
    },

    /***
     * 绘制几何图形
     * @param currentGeo 当前几何
     * @param self
     * @param index 鼠标拖动的当前点
     */
    draw: function (currentGeo, self, index) {
        if (!currentGeo) {
            return;
        }

        switch (currentGeo.type) {

            case 'LineString':
                drawLineString(currentGeo.components, {color: 'red', size: 2}, false,null,false,false,self);
                break;
            case 'Point':
                drawPoint(currentGeo, {color: 'red', radius: 3}, false);
                break;
            case'Polygon':
                drawPolygon(currentGeo, {color: 'red', outline: 3}, false);
                break;
            case 'Cross':
                drawCross(currentGeo, {color: 'blue', width: 1}, false,self);
                break;
            case 'marker':
                drawMarker(currentGeo.point, currentGeo.orientation, currentGeo.angle, false,self);
                break;
            case 'MultiPolyline':
                drawMultiPolyline(currentGeo.coordinates,{color: 'red', width: 2},self);
                break;
            case 'intRticMarker':
                drawRticMarker(currentGeo.point, currentGeo.orientation, currentGeo.angle, false,self);
                break;
        }

        function drawCross(geom, style, boolPixelCrs,self) {
            if (!geom) {
                return;
            }
            var p = null;
            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p = this.map.latLngToContainerPoint([geom.y, geom.x]);
            }

            var verLineArr = [{x: p.x, y: p.y + 20}, {x: p.x, y: p.y - 20}];
            drawLineString(verLineArr, {color: 'blue', size: 1}, true,null,null,null,self);
            var horLineArr = [{x: p.x - 20, y: p.y}, {x: p.x + 20, y: p.y}];
            drawLineString(horLineArr, {color: 'blue', size: 1}, true,null,null,null,self);
        }

        function drawPoint(geom, style, boolPixelCrs) {
            if (!geom) {
                return;
            }
            var p = null;
            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p = this.map.latLngToContainerPoint([geom.y, geom.x]);
            }

            var g = self._ctx;
            g.beginPath();
            g.fillStyle = style.color;
            g.arc(p.x, p.y, style.radius, 0, Math.PI * 2);
            g.closePath();
            g.fill();
            g.restore();
        }


        function drawLineString(geom, style, boolPixelCrs, index,boolnode,boolselectnode,self) {
            if (!geom) {
                return;
            }

            var proj = [], i;

            for (var i = 0; i < geom.length; i++) {
                if (boolPixelCrs) {
                    proj.push({x: geom[i].x, y: geom[i].y});
                } else {

                    proj.push(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]));

                    if(boolselectnode&&self.selectCtrl)    {
                        if(self.selectCtrl.selectedFeatures.latlng&&self.selectCtrl.selectedFeatures.latlng.lat == geom[i].y && self.selectCtrl.selectedFeatures.latlng.lng == geom[i].x){
                            drawPoint(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]), {
                                color: 'blue',
                                radius: 4
                            }, true);
                        }
                    }else{
                        if(boolnode){
                            if(i==0 || i==geom.length-1){
                                drawPoint(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]), {
                                    color: 'blue',
                                    radius: 4
                                }, true);
                            }
                        }else{
                            drawPoint(this.map.latLngToContainerPoint([geom[i].y, geom[i].x]), {
                                color: 'blue',
                                radius: 4
                            }, true);
                        }
                    }


                }
            }

            var g = self._ctx;
            g.strokeStyle = style.color;
            g.lineWidth = style.size;
            //g.opacity = 0.5;
            g.beginPath();
            for (i = 0; i < proj.length; i++) {
                var method = (i === 0 ? 'move' : 'line') + 'To';
                g[method](proj[i].x, proj[i].y);
            }
            g.stroke();
            g.restore();
        }


        function drawMultiPolyline(geom,style,self){

            for(var i = 0,len = geom.length;i < len;i++){
                drawLineString(geom[i].components, style, false, null, true,true,self);
            }
        }


        function drawPolygon(geom, style) {
            if (!style) {
                return;
            }

                var coords = geom.components, proj = [], i;

                for (i = 0; i < coords.length; i++) {
                    proj.push(this.map.latLngToContainerPoint([coords[i].y, coords[i].x]));
                }

                var g = self._ctx;
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

        function drawMarker(geom, type, angle, boolPixelCrs,self) {
            var url, p = null,angleOfTran=angle,that=this;
            if (!geom) {
                return;
            }

            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p =this.map.latLngToContainerPoint([geom.y, geom.x]);
            }
            if(type==="3") {
                angleOfTran = angleOfTran + Math.PI;
            }
            url = "./css/img/" + type + ".svg";
            var g = self._ctx;
            loadImg(url, function (img) {
                g.save();
                g.translate(p.x, p.y);
                g.rotate(angleOfTran);
                g.drawImage(img, 0, 0);
                g.restore();
                currentGeo.pointForDirect = directOfPoint(p,61, 32, angle);
                self.eventController.fire(self.eventController.eventTypes.DIRECTEVENT,{"geometry":currentGeo})
            })

        }

        function drawRticMarker(geom, type, angle, boolPixelCrs,self) {
            var url, p = null,angleOfTran=angle,that=this;
            if (!geom) {
                return;
            }

            if (boolPixelCrs) {
                p = {x: geom.x, y: geom.y}
            } else {
                p =this.map.latLngToContainerPoint([geom.y, geom.x]);
            }
            if(type==="2") {
                angleOfTran = angleOfTran + Math.PI;
            }
            url = "./css/intRtic/" + type + ".svg";
            var g = self._ctx;
            loadImg(url, function (img) {
                g.save();
                g.translate(p.x, p.y);
                g.rotate(angleOfTran);
                g.drawImage(img, 0, 0);
                g.restore();
                currentGeo.pointForDirect = directOfPoint(p,61, 32, angle);
                self.eventController.fire(self.eventController.eventTypes.DIRECTEVENT,{"geometry":currentGeo})
            })

        }

        function loadImg(url, callBack) {
            var img = new Image();
            img.onload = function () {
                callBack(img);
            };
            img.src = url;
        }
        function directOfPoint(point,length,width,angle) {
            point.x = point.x + length;
            point.y = point.y + width / 2;
            point.x = point.x + Math.tan(angle);
            point.y = point.y + Math.tan(angle);
            //point=this.map.containerPointToLatLng(point);
            return point;
        }
    },

    /***
     * 清空图层
     */
    clear: function () {
        this.canv.getContext("2d").clearRect(0, 0, this.canv.width, this.canv.height);
    },

    _redraw: function () {

        this.clear();

        this.draw(this.drawGeometry, this);
        this._resetCanvasPosition();
        return this;
    }
});

fastmap.mapApi.editLayer = function (url, options) {
    return new fastmap.mapApi.EditLayer(url, options);
};
