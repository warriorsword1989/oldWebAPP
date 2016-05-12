/*
*  Simple navigation control that allows back and forward navigation through map's view history
*/

(function() {
  L.Control.NavBar = L.Control.extend({
    options: {
      position: 'topleft',
      //center:,
      //zoom :,
      resetTitle: '重置',
      centerTitle: '定位'
    },

    onAdd: function(map) {

      // Set options
      if (!this.options.center) {
        this.options.center = map.getCenter();
      }
      if (!this.options.zoom) {
        this.options.zoom = map.getZoom();
      }
      options = this.options;

      // Create toolbar
      var controlName = 'leaflet-control-navbar',
      container = L.DomUtil.create('div', controlName + ' leaflet-bar');

      // Add toolbar buttons
      this._homeButton = this._createButton(options.centerTitle, controlName + '-center', container, this._goCenter);
      this._fwdButton = this._createButton(options.resetTitle, controlName + '-reset', container, this._resetMap);

      return container;
    },

    onRemove: function(map) {
      map.off('moveend', this._updateHistory, this);
    },

    //重新定位到中心点
    _goCenter: function() {
      this._map.setView(this.options.center, this.options.zoom);
    },

    _resetMap: function() {
      var poiJson = FM.mapConf.pPoiJson;
      FM.leafletUtil.clearMapLayer(pMap,"poiEditLayer");
      if(poiJson.lifecycle == 1){
        FM.leafletUtil.createEneditablePoiInMap(poiJson,"poiEditLayer","redIcon");
      }else {
        FM.leafletUtil.createEditablePoiInMap(poiJson,"poiEditLayer","redIcon");
      }
    },

    _createButton: function(title, className, container, fn) {
      var link = L.DomUtil.create('a', className, container);
      link.href = '#';
      link.title = title;

      L.DomEvent
      .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
      .on(link, 'click', L.DomEvent.stop)
      .on(link, 'click', fn, this)
      .on(link, 'click', this._refocusOnMap, this);

      return link;
    }
  });

  L.control.navbar = function(options) {
    return new L.Control.NavBar(options);
  };

})();
