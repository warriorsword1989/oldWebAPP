/**
 * Created by zhoumingrui on 2015/11/3.
 * Class DrawPath
 */
fastmap.mapApi.DrawPath = L.Handler.extend({
    /***
     *
     * @param {Object}options
     */
    initialize: function(options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.shapeEditor = this.options.shapeEditor;
        this.eventController = fastmap.uikit.EventController();
        this._map = this.options.shapeEditor.map;
        this.container = this._map._container;
        this._mapDraggable = this._map.dragging.enabled();
        this.targetPoint = null;
        this.catches = [];
        this.insertPoint = null;
        this.snapHandler = new fastmap.mapApi.Snap({
            map: this._map,
            shapeEditor: this.shapeEditor,
            snapLine: true,
            snapVertex: true,
            snapNode: true
        });
        this.snapHandler.enable();
        this.validation = fastmap.uikit.geometryValidation({
            transform: new fastmap.mapApi.MecatorTranform()
        });
        this.lastClickEvent = null;
        this.sameLinkFlag = false;
    },
    /***
     * 添加事件处理
     */
    addHooks: function() {
        this.lastClickEvent = null;
        this.sameLinkFlag = false;
        this._map.on('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            this._map.on('click', this.onMouseDown, this);
        }
        this._map.on('mousemove', this.onMouseMove, this);
    },
    /***
     * 移除事件
     */
    removeHooks: function() {
        this.lastClickEvent = null;
        this.sameLinkFlag = false;
        this._map.off('mousedown', this.onMouseDown, this);
        if (L.Browser.touch) {
            this._map.off('click', this.onMouseDown, this);
        }
        this._map.off('mousemove', this.onMouseMove, this);
    },
    onMouseDown: function(event) {
        // button：0.左键,1.中键,2.右键
        // 限制为左键点击事件
        if(event.originalEvent.button > 0) {
            return;
        }
        var clickEvent = {
            time: new Date().getTime(),
            screenX: event.originalEvent.screenX,
            screenY: event.originalEvent.screenY
        };
        var comp = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;
        // 双击结束编辑
        // 通过点击新增的形状点个数必须大于等于2个
        if (this._isDblClick(clickEvent, this.lastClickEvent) && comp.length > 2) {
            this.lastClickEvent = null;
            comp.pop(); // 去掉最后一个重复的形状点
            this.shapeEditor.shapeEditorResult.setProperties({
                snodePid: this.snodePid,
                catches: this.catches,
                enodePid: this.enodePid,
                sameLinkFlag: this.sameLinkFlag
            });
            this.shapeEditor.stopEditing();
            fastmap.uikit.ShapeEditorController().stopEditing();
        } else {
            var mousePoint = event.latlng;
            var snapedNodePid = 0;
            if (this.snapHandler.snaped) {
                mousePoint = this.targetPoint;
                if (this.snapHandler.snapIndex == 0) {
                    this.catches.push({
                        nodePid: parseInt(this.snapHandler.properties.snode),
                        lon: mousePoint.lng,
                        lat: mousePoint.lat
                    });
                    snapedNodePid = parseInt(this.snapHandler.properties.snode ? this.snapHandler.properties.snode : this.snapHandler.properties['id']);
                } else if (this.snapHandler.snapIndex == -1) {
                    // 为了判断是否有连续两次捕捉到同一根link而加
                    // 目前的判断不是很严谨，临时加上的，只考虑到了捕捉到link的情况
                    // 还应该处理捕捉到连续的两个node点、node点与link线是不是同一根link的情况
                    if(this.catches.length > 0) {
                        if(this.catches[this.catches.length - 1].linkPid && this.catches[this.catches.length - 1].linkPid == this.snapHandler.properties.id) {
                            this.sameLinkFlag = true;
                        }
                    }
                    this.catches.push({
                        linkPid: parseInt(this.snapHandler.properties.id),
                        lon: mousePoint.lng,
                        lat: mousePoint.lat
                    });
                } else if (this.snapHandler.snapIndex == -2) {
                    this.catches.push({
                        nodePid: parseInt(this.snapHandler.properties.id),
                        lon: mousePoint.lng,
                        lat: mousePoint.lat
                    });
                    snapedNodePid = parseInt(this.snapHandler.properties.id);
                } else {
                    this.catches.push({
                        nodePid: parseInt(this.snapHandler.properties.snode ? this.snapHandler.properties.snode : this.snapHandler.properties['id']),
                        lon: mousePoint.lng,
                        lat: mousePoint.lat
                    });
                    snapedNodePid = parseInt(!this.snapHandler.properties.enode ? this.snapHandler.properties['id'] : this.snapHandler.properties.enode);
                }
            }
            if (!this.lastClickEvent) {
                this.snodePid = snapedNodePid;
                // 第一个形状点，要替换掉默认点
                comp.splice(0, 1, fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
            } else {
                this.enodePid = snapedNodePid;
                // 如果未捕捉到node或link上的点，则验证相邻两个形状点距离
                if (this.snapHandler.snaped || this._validAdjacentPoint(comp[comp.length - 1], comp[comp.length - 2])) {
                    comp.push(fastmap.mapApi.point(mousePoint.lng, mousePoint.lat));
                }
            }
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
            this.lastClickEvent = clickEvent;
        }
    },
    onMouseMove: function(event) {
        this.container.style.cursor = 'crosshair';
        this.snapHandler.setTargetIndex(0);
        var points = this.shapeEditor.shapeEditorResult.getFinalGeometry().components;
        var mousePoint = this._map.layerPointToLatLng(event.layerPoint);
        if (this.snapHandler.snaped) {
            this.eventController.fire(this.eventController.eventTypes.SNAPED, {
                'snaped': true
            });
            this.targetPoint = L.latLng(this.snapHandler.snapLatlng[1], this.snapHandler.snapLatlng[0])
            this.insertPoint = fastmap.mapApi.point(this.targetPoint.lng, this.targetPoint.lat);
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback({
                point: {
                    x: this.targetPoint.lng,
                    y: this.targetPoint.lat
                }
            });
        } else {
            this.eventController.fire(this.eventController.eventTypes.SNAPED, {
                'snaped': false
            });
            this.targetPoint = null;
            this.insertPoint = fastmap.mapApi.point(mousePoint.lng, mousePoint.lat);
            this.shapeEditor.shapeEditorResultFeedback.setupFeedback();
        }
        if (this.lastClickEvent) {
            if (points.length == 1) {
                points.push(this.insertPoint);
            } else {
                points.splice(points.length - 1, 1, this.insertPoint);
            }
        }
    },
    disable: function() {
        if (!this._enabled) {
            return;
        }
        this._map.dragging.enable();
        this._enabled = false;
        this.removeHooks();
    },
    /**
     * 判断两次单击是不是双击
     */
    _isDblClick: function(clickEventA, clickEventB) {
        if (!clickEventA || !clickEventB) {
            return false;
        }
        if (Math.abs(clickEventA.time - clickEventB.time) <= 500 && Math.abs(clickEventA.screenX - clickEventB.screenX) <= 3 && Math.abs(clickEventA.screenY - clickEventB.screenY) <= 3) {
            return true;
        }
        return false;
    },
    /**
     * 验证相邻两个形状点是否满足条件
     */
    _validAdjacentPoint: function(p1, p2) {
        // 相邻两个形状点之间的距离必须大于2米
        var space = this.options.space || 2;
        if (L.latLng(p1.y, p1.x).distanceTo(L.latLng(p2.y, p2.x)) > space) {
            return true;
        }
        return false;
    },
});