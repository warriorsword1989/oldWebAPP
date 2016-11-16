fastmap.uikit.canvasFeature.RdSameLink = fastmap.uikit.canvasFeature.Feature.extend({
    setAttribute: function (item) {
        this.properties.featType = 'RDSAMELINK';
        this.geometry.type = 'LineString';
        // this.properties['snode'] = item.m.c;
        // this.properties['enode'] = item.m.d;
        // this.properties['kind'] = item.m.c;
        this.properties.style.strokeColor = 'black';
        this.properties.style.strokeWidth = 3;
        this.properties.style.strokeOpacity = 1;
    }
});
