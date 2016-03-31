/**
 * Created by wangtun on 2016/3/31.
 */
L.Control.FloatMenu = L.Control.extend({
    options: {
        position: 'bottomleft',
        nodeDeleteText: '删除',
        nodeDeteteTitle: '删除'
    },

    onAdd: function (map) {
        var zoomName = 'leaflet-control-floatMenu',
            container = L.DomUtil.create('ul', 'floatMenu');

        this._map = map;

        this._deleteButton  = this._createButton(
            this.options.nodeDeleteText, this.options.nodeDeteteTitle,
            zoomName + '-delete',  container, this._delete,  this);

        this._updateDisabled();
        return container;
    },

    onRemove: function (map) {
    },

    _delete: function (e) {
        this._map.zoomIn(e.shiftKey ? 3 : 1);
    },

    _createButton: function (html, title, className, container, fn, context) {
        var link = L.DomUtil.create('li', className, container);
        link.innerHTML = html;
        link.title = title;

        var stop = L.DomEvent.stopPropagation;

        L.DomEvent
            .on(link, 'click', stop)
            .on(link, 'click', L.DomEvent.preventDefault)
            .on(link, 'click', fn, context)
            .on(link, 'click', this._refocusOnMap, context);

        return link;
    },

    _updateDisabled: function () {
        var map = this._map,
            className = 'leaflet-disabled';

        L.DomUtil.removeClass(this._zoomInButton, className);
        L.DomUtil.removeClass(this._zoomOutButton, className);

        if (map._zoom === map.getMinZoom()) {
            L.DomUtil.addClass(this._zoomOutButton, className);
        }
        if (map._zoom === map.getMaxZoom()) {
            L.DomUtil.addClass(this._zoomInButton, className);
        }
    }
});