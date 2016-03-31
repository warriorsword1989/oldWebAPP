/**
 * Created by wangtun on 2016/3/31.
 */
L.Control.FloatMenu = L.Class.extend({
    initialize: function (pid,mouseEvent, options) {
        this.selectObjPid = pid;
        this._mouseEvent = mouseEvent;
        this.items = options.items||[];
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this._latlng = map.mouseEventToLatLng(this._mouseEvent);

        this._el = L.DomUtil.create('div', 'my-custom-layer leaflet-zoom-hide');


        var container = L.DomUtil.create('ul', 'floatMenu');
        this._map = map;

        var buttons=[];
        for(var i=0;i<this.items.length;i++){
            buttons.push(this._createButton(this.items[i].text,this.items[i].title,this.items[i].class||"",container,this.items[i].callback,this));
        }

        this._el.appendChild(container);
        map.getPanes().overlayPane.appendChild(this._el);

        // add a viewreset event listener for updating layer's position, do the latter
        map.on('viewreset', this._reset, this);
        this._reset();
    },

    onRemove: function (map) {
        map.getPanes().overlayPane.removeChild(this._el);
        map.off('viewreset', this._reset, this);
    },

    _createButton: function (html, title, className, container, fn, context) {
        var link = L.DomUtil.create('li', className, container);
        link.innerHTML = html;
        link.title = title;

        var stop = L.DomEvent.stopPropagation;
        if(fn){
            L.DomEvent
                .on(link, 'click', stop)
                .on(link, 'click', L.DomEvent.preventDefault)
                .on(link, 'click', fn, context)
        }

        return link;
    },

    _reset: function () {
        var pos = this._map.latLngToLayerPoint(this._latlng);
        L.DomUtil.setPosition(this._el, pos);
    }
});