/**
 * Created by zhongxiaoming on 2015/12/14.
 * Class Snap
 * SnapPoint or SnapLine
 */
fastmap.uikit.Snap = L.Handler.extend({
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

        this._map = this.options.map;

        this.shapeEditor = this.options.shapeEditor;
        this.transform = new fastmap.mapApi.MecatorTranform();
        this.snapVertex = this.options.snapVertex==true?this.options.snapVertex:false;
        this.snapNode = this.options.snapNode==true?this.options.snapNode:false;
        this.snapLine = this.options.snapLine==true?this.options.snapLine:false;
        this.selectedSnap =this.options.selectedSnap==true?this.options.selectedSnap:false;
        //鼠标点位，按瓦片坐标计算
        this.point =null;
        this.selectedLink=null;
        this._guides= [];
    },
    /***
     * 添加事件处理
     */
    addHooks: function () {
        this._map.on('mousemove', this.onMouseMove, this);
    },
    /***
     * 移除事件
     */
    removeHooks: function(){
        this._map.off('mousemove', this.onMouseMove, this);
    },
    addGuideLayer: function (layer) {
        for (var i=0, n=this._guides.length; i<n; i++)
            if (L.stamp(layer) === L.stamp(this._guides[i]))
                return;
        this._guides.push(layer);
    },

    setTargetIndex:function(index){
        this.targetindex = index;
    },

    setSelectedLink:function(link){
        this.selectedLink= link;
    },

    onMouseMove: function (event) {

        if (this._mapDraggable) {
            this._map.dragging.disable();
        }
        if( this.targetindex == null){
            return;
        }
        var latlng = this._map.layerPointToLatLng(event.layerPoint);
        this.targetPoint = this._map.layerPointToContainerPoint(event.layerPoint);
        var pixels = this.transform.lonlat2Pixel(latlng.lng, latlng.lat,this._map.getZoom());
        //根据鼠标点计算所在的瓦片坐标
        var tiles = this.transform.lonlat2Tile(latlng.lng, latlng.lat, this._map.getZoom());

        var tilePixcel =new fastmap.mapApi.Point(pixels[0] - tiles[0]*256,pixels[1] - tiles[1]*256);

        for (var layerindex in this._guides){
            this.currentTileData = this._guides[layerindex].tiles[tiles[0]+':'+tiles[1]];
            var closest = this.closeestLineSnap(this._map, this.currentTileData.data.features, tilePixcel, 10,this.snapVertex,this._guides[layerindex].id);
            if(closest){
                this.snaped = true;
                this.snapLatlng = this.transform.PixelToLonlat(closest.latlng[0]+tiles[0]*256,closest.latlng[1]+tiles[1]*256,this._map.getZoom());

            }else{
                this.snaped = false;

            }
        }


    },

    setPoint:function(point){
      this.point = point;
    },

    enable: function () {
        this.disable();
        this.addHooks();
    },

    disable: function () {
        //this.removeHooks();
    },

    snapList:function(){
        var snaplist = [];

        function processGuide(guide) {
            if ((guide._layers !== undefined) &&
                (typeof guide.searchBuffer !== 'function')) {
                // Guide is a layer group and has no L.LayerIndexMixin (from Leaflet.LayerIndex)
                for (var id in guide._layers) {
                    processGuide(guide._layers[id]);
                }
            }
            else if (typeof guide.searchBuffer === 'function') {
                // Search snaplist around mouse
                snaplist = snaplist.concat(guide.searchBuffer(latlng, this._buffer));
            }
            else {
                snaplist.push(guide);
            }
        }

        for (var i=0, n = this._guides.length; i < n; i++) {
            var guide = this._guides[i];
            processGuide.call(this, guide);
        }


        return snaplist;
    },

    closeestLineSnap: function (map, data, point, tolerance, withVertices, selectedid) {
        tolerance = typeof tolerance == 'number' ? tolerance : Infinity;
        withVertices = typeof withVertices == 'boolean' ? withVertices : true;
        var result = null;

        result = this.closestLine(map, data, point,selectedid);
        if (!result || result.distance > tolerance)
            return null;


        var isSnapVertices = false;

        //If snapped layer is linear, try to snap on vertices (extremities and middle points)
        if (withVertices /**&& typeof result.layer.getLatLngs == 'function'**/) {

            var closest = this.closest(map, result.layer, result.latlng, withVertices);
            if (closest.distance < tolerance) {
                result.latlng = closest;
                result.distance = point.distanceTo(new fastmap.mapApi.Point(closest[0],closest[1]));
                isSnapVertices = true;
            }
        }

        if(!this.snapLine&&isSnapVertices ==false){
            return null;
        }

        return result;
    },

    closestLine: function (map, data, point, selectedid) {
        var mindist = Infinity,
            result = null,
            ll = null,
            distance = Infinity;

        for (var i = 0, n = data.length; i < n; i++) {
            if(this.selectedSnap){
                if(selectedid ==data[i].properties.id){
                    var layer = data[i].geometry.coordinates;

                    ll = this.closest(map, layer, point);
                    if (ll) distance = ll.distance.distance;  // Can return null if layer has no points.
                    if (distance < mindist) {
                        mindist = distance;
                        result = {layer: layer, latlng: [ll.x,ll.y], distance: distance};
                    }
                }
            }else{
                var layer = data[i].geometry.coordinates;

                ll = this.closest(map, layer, point);
                if (ll) distance = ll.distance.distance;  // Can return null if layer has no points.
                if (distance < mindist) {
                    mindist = distance;
                    result = {layer: layer, latlng: [ll.x,ll.y], distance: distance};
                }
            }


        }
        return result;
    },

    closest: function (map, layer, p, vertices) {
        if (typeof layer.getLatLngs != 'function')

            var latlngs = layer,
            mindist = Infinity,
            result = null,
            i, n, distance;

        // Lookup vertices
        if (vertices) {
            for(i = 0, n = latlngs.length; i < n; i++) {
                if(this.snapNode){
                    if(i==0 || i==n-1){
                        var ll = latlngs[i][0];
                        var point = new fastmap.mapApi.Point(ll[0],ll[1]);

                        distance = point.distanceTo(new fastmap.mapApi.Point(p[0], p[1]));
                        if (distance < mindist) {
                            mindist = distance;
                            result = ll;
                            result.distance = distance;
                        }
                    }
                }else{
                    var ll = latlngs[i][0];
                    var point = new fastmap.mapApi.Point(ll[0],ll[1]);

                    distance = point.distanceTo(new fastmap.mapApi.Point(p[0], p[1]));
                    if (distance < mindist) {
                        mindist = distance;
                        result = ll;
                        result.distance = distance;
                    }
                }

            }
            return result;
        }

        if (layer instanceof L.Polygon) {
            latlngs.push(latlngs[0]);
        }

        // Keep the closest point of all segments
        for (i = 0, n = latlngs.length; i < n-1; i++) {

            var latlngA = latlngs[i][0],
                latlngB = latlngs[i+1][0];

                var line = new fastmap.mapApi.LineString([new fastmap.mapApi.Point(latlngA[0],latlngA[1]),new fastmap.mapApi.Point(latlngB[0],latlngB[1])])
                distance = line.pointToSegmentDistance(p, new fastmap.mapApi.Point(latlngA[0],latlngA[1]),new fastmap.mapApi.Point(latlngB[0],latlngB[1]));

                if (distance.distance <= mindist) {
                    mindist = distance.distance;

                    result = line.pointToSegmentDistance(p, new fastmap.mapApi.Point(latlngA[0],latlngA[1]),new fastmap.mapApi.Point(latlngB[0],latlngB[1]));
                    result.distance = distance;
                }
        }
        return result;
    }

});

